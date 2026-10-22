import { Router, Response } from 'express';
import { z } from 'zod';
import { walletService } from '../services/walletService.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

export const walletRouter = Router();

const rechargeSchema = z.object({
  amount: z.number().positive('Recharge amount must be greater than zero'),
  gateway: z.string().optional(),
  paymentMethod: z.string().optional(),
});

const verifyPaymentSchema = z.object({
  gatewayOrderId: z.string().optional(),
  paymentId: z.string().min(1, 'Payment ID is required'),
  signature: z.string().optional(),
  amount: z.number().positive().optional(),
});

walletRouter.use(authenticate);

walletRouter.get('/', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const wallet = walletService.getOrCreateWallet(userId);
  res.json({
    success: true,
    data: { wallet },
  });
});

walletRouter.get('/balance', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const wallet = walletService.getOrCreateWallet(userId);
  res.json({
    success: true,
    data: { wallet },
  });
});

walletRouter.get('/transactions', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const transactions = walletService.getTransactions(userId);
  res.json({
    success: true,
    data: { transactions },
  });
});

// Server-side registry of pending Razorpay orders to prevent client-side amount tampering
interface PendingPaymentOrder {
  userId: string;
  amount: number;
  createdAt: number;
}
const pendingOrders = new Map<string, PendingPaymentOrder>();

// Unverified / Direct Recharge endpoints are permanently disabled for security
walletRouter.post('/recharge', (_req: AuthenticatedRequest, res: Response) => {
  res.status(403).json({
    success: false,
    error: 'Direct unverified recharge is permanently disabled. Please use official Razorpay checkout.',
  });
});

walletRouter.post('/verify-payment', (_req: AuthenticatedRequest, res: Response) => {
  res.status(403).json({
    success: false,
    error: 'Unverified gateway verification is disabled. Please use official Razorpay verification.',
  });
});

const razorpayCreateOrderSchema = z.object({
  amount: z.number().min(10, 'Minimum recharge is ₹10').max(50000, 'Maximum recharge is ₹50,000'),
});

const razorpayVerifySchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  paymentId: z.string().min(1, 'Payment ID is required'),
  signature: z.string().min(1, 'Signature is required'),
  amount: z.number().positive('Amount is required'),
});

walletRouter.post(
  '/razorpay/create-order',
  validate(razorpayCreateOrderSchema),
  async (req: AuthenticatedRequest, res: Response, next) => {
    try {
      const { razorpayService } = await import('../services/razorpayService.js');
      const userId = req.user!.id;
      const { amount } = req.body;
      const orderResult = await razorpayService.createOrder(amount, userId);

      if (!orderResult.success) {
        res.status(400).json({
          success: false,
          error: orderResult.error || 'Failed to initialize Razorpay checkout',
        });
        return;
      }

      // Record expected amount in server-side registry to prevent tampering
      pendingOrders.set(orderResult.orderId, {
        userId,
        amount,
        createdAt: Date.now(),
      });

      res.json({
        success: true,
        message: 'Razorpay order created successfully',
        data: orderResult,
      });
    } catch (error) {
      next(error);
    }
  }
);

walletRouter.post(
  '/razorpay/verify-payment',
  validate(razorpayVerifySchema),
  async (req: AuthenticatedRequest, res: Response, next) => {
    try {
      const { razorpayService } = await import('../services/razorpayService.js');
      const userId = req.user!.id;
      const { orderId, paymentId, signature, amount } = req.body;

      // 1. Verify cryptographic HMAC SHA256 signature
      const verifyResult = razorpayService.verifySignature(orderId, paymentId, signature);

      if (!verifyResult.verified) {
        res.status(400).json({
          success: false,
          error: verifyResult.error || 'Payment signature verification failed',
        });
        return;
      }

      // 2. Validate against server-registered pending order to prevent client-side amount tampering
      const pending = pendingOrders.get(orderId);
      if (pending && pending.userId !== userId) {
        res.status(403).json({
          success: false,
          error: 'This payment order belongs to a different account',
        });
        return;
      }

      if (pending && Math.abs(amount - pending.amount) > 0.01) {
        res.status(400).json({
          success: false,
          error: `Payment amount tampering detected. Expected: ₹${pending.amount}, Received: ₹${amount}`,
        });
        return;
      }

      const creditAmount = pending ? pending.amount : amount;

      // 3. Credit wallet with idempotency check (rejects replay attacks)
      const rechargeResult = walletService.creditRecharge(
        userId,
        creditAmount,
        paymentId,
        'RAZORPAY'
      );

      // Clean up fulfilled pending order
      pendingOrders.delete(orderId);

      res.json({
        success: true,
        message: `Payment verified! ₹${creditAmount.toFixed(2)} credited to your wallet.`,
        data: rechargeResult,
      });
    } catch (error) {
      next(error);
    }
  }
);


