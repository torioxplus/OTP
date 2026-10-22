import { Router, Response } from 'express';
import { z } from 'zod';
import { authService } from '../services/authService.js';
import { validate } from '../middleware/validate.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';

import rateLimit from 'express-rate-limit';

export const authRouter = Router();

// Anti-Brute-Force Rate Limiter (Max 10 auth attempts per minute)
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please wait 1 minute before trying again.',
  },
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email address required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Valid email address required'),
  password: z.string().min(1, 'Password is required'),
});

const adminLoginSchema = z.object({
  key: z.string().min(1, 'Admin master key required'),
});

authRouter.post('/register', authLimiter, validate(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const result = await authService.register(name, email, password, phone);
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/login', authLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/demo-customer', (_req, res) => {
  res.status(403).json({
    success: false,
    error: 'Demo customer login has been permanently disabled. Please create a real account.',
  });
});

authRouter.post('/admin-login', authLimiter, validate(adminLoginSchema), (req, res, next) => {
  try {
    const { key } = req.body;
    const result = authService.loginWithAdminKey(key);
    res.json({
      success: true,
      message: 'Admin access authorized',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

authRouter.get('/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    data: { user: req.user },
  });
});
