import { v4 as uuidv4 } from 'uuid';
import { memoryStore } from '../store/memoryStore.js';
import { memoryCache } from '../store/cache.js';
import { Wallet, WalletTransaction, WalletTxnType } from '../types/index.js';

export class WalletService {
  public getOrCreateWallet(userId: string): Wallet {
    const cacheKey = `wallet:${userId}`;
    const cached = memoryCache.get<Wallet>(cacheKey);
    if (cached) return cached;

    let wallet = memoryStore.wallets.get(userId);
    if (!wallet) {
      wallet = {
        id: `WAL-${uuidv4().slice(0, 8).toUpperCase()}`,
        userId,
        availableBalance: 0.0,
        heldBalance: 0.0,
        currency: 'INR',
        updatedAt: new Date().toISOString(),
      };
      memoryStore.wallets.set(userId, wallet);
    }
    memoryCache.set(cacheKey, wallet, 300);
    return wallet;
  }

  public getTransactions(userId: string): WalletTransaction[] {
    return memoryStore.transactions
      .filter((t) => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getAllTransactions(): WalletTransaction[] {
    return [...memoryStore.transactions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Recharge Wallet (CREDIT_RECHARGE)
   */
  public creditRecharge(
    userId: string,
    amount: number,
    referenceId: string,
    gateway: string = 'UPI'
  ): { wallet: Wallet; transaction: WalletTransaction } {
    if (amount <= 0) {
      throw new Error('Recharge amount must be greater than zero');
    }

    const wallet = this.getOrCreateWallet(userId);
    const balanceBefore = wallet.availableBalance;
    const holdBefore = wallet.heldBalance;

    wallet.availableBalance = Math.round((wallet.availableBalance + amount) * 100) / 100;
    wallet.updatedAt = new Date().toISOString();
    memoryCache.set(`wallet:${userId}`, wallet, 300);

    const transaction: WalletTransaction = {
      id: `TXN-${uuidv4().slice(0, 8).toUpperCase()}`,
      walletId: wallet.id,
      userId,
      type: 'CREDIT_RECHARGE',
      amount,
      balanceBefore,
      balanceAfter: wallet.availableBalance,
      holdBefore,
      holdAfter: wallet.heldBalance,
      referenceType: 'PAYMENT_GATEWAY',
      referenceId,
      description: `Instant wallet top-up via ${gateway.toUpperCase()} Gateway`,
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
    };

    memoryStore.transactions.push(transaction);

    // Persist wallet update and ledger transaction to Supabase PostgreSQL
    import('../lib/supabase.js').then(async ({ getSupabase, isSupabaseConfigured }) => {
      if (isSupabaseConfigured()) {
        try {
          const client = getSupabase();
          await client.from('wallets').upsert({
            id: wallet.id,
            user_id: wallet.userId,
            available_balance: wallet.availableBalance,
            held_balance: wallet.heldBalance,
            currency: wallet.currency,
            updated_at: wallet.updatedAt,
          });

          await client.from('wallet_transactions').insert({
            id: transaction.id,
            wallet_id: transaction.walletId,
            user_id: transaction.userId,
            type: transaction.type,
            amount: transaction.amount,
            balance_before: transaction.balanceBefore,
            balance_after: transaction.balanceAfter,
            hold_before: transaction.holdBefore,
            hold_after: transaction.holdAfter,
            reference_type: transaction.referenceType,
            reference_id: transaction.referenceId,
            description: transaction.description,
            status: transaction.status,
            created_at: transaction.createdAt,
          });
        } catch (err: unknown) {
          console.warn('Supabase wallet/transaction sync warning:', err);
        }
      }
    }).catch(() => {});

    return { wallet, transaction };
  }

  /**
   * Place Funds on Hold when OTP Number is Requested (HOLD_OTP_PURCHASE)
   */
  public placeHold(
    userId: string,
    amount: number,
    orderId: string,
    serviceName: string
  ): { wallet: Wallet; transaction: WalletTransaction } {
    const wallet = this.getOrCreateWallet(userId);

    if (wallet.availableBalance < amount) {
      throw new Error(
        `Insufficient available balance. Required: ₹${amount.toFixed(2)}, Available: ₹${wallet.availableBalance.toFixed(2)}`
      );
    }

    const balanceBefore = wallet.availableBalance;
    const holdBefore = wallet.heldBalance;

    // Deduct from available, add to hold
    wallet.availableBalance = Math.round((wallet.availableBalance - amount) * 100) / 100;
    wallet.heldBalance = Math.round((wallet.heldBalance + amount) * 100) / 100;
    wallet.updatedAt = new Date().toISOString();
    memoryCache.set(`wallet:${userId}`, wallet, 300);

    const transaction: WalletTransaction = {
      id: `TXN-${uuidv4().slice(0, 8).toUpperCase()}`,
      walletId: wallet.id,
      userId,
      type: 'HOLD_OTP_PURCHASE',
      amount,
      balanceBefore,
      balanceAfter: wallet.availableBalance,
      holdBefore,
      holdAfter: wallet.heldBalance,
      referenceType: 'OTP_ORDER',
      referenceId: orderId,
      description: `Temporary hold for ${serviceName} virtual number reservation`,
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
    };

    memoryStore.transactions.push(transaction);
    return { wallet, transaction };
  }

  /**
   * Release Hold when Customer or System cancels order before SMS (RELEASE_HOLD)
   */
  public releaseHold(
    userId: string,
    amount: number,
    orderId: string,
    reason: string = 'Order cancelled before SMS receipt'
  ): { wallet: Wallet; transaction: WalletTransaction } {
    const wallet = this.getOrCreateWallet(userId);
    const balanceBefore = wallet.availableBalance;
    const holdBefore = wallet.heldBalance;

    const actualRelease = Math.min(wallet.heldBalance, amount);
    wallet.heldBalance = Math.round((wallet.heldBalance - actualRelease) * 100) / 100;
    wallet.availableBalance = Math.round((wallet.availableBalance + actualRelease) * 100) / 100;
    wallet.updatedAt = new Date().toISOString();
    memoryCache.set(`wallet:${userId}`, wallet, 300);

    const transaction: WalletTransaction = {
      id: `TXN-${uuidv4().slice(0, 8).toUpperCase()}`,
      walletId: wallet.id,
      userId,
      type: 'RELEASE_HOLD',
      amount: actualRelease,
      balanceBefore,
      balanceAfter: wallet.availableBalance,
      holdBefore,
      holdAfter: wallet.heldBalance,
      referenceType: 'OTP_ORDER',
      referenceId: orderId,
      description: `Held funds released back to available balance (${reason})`,
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
    };

    memoryStore.transactions.push(transaction);
    return { wallet, transaction };
  }

  /**
   * Convert Held Funds to Final Debit upon successful OTP delivery (DEBIT_OTP_PURCHASE)
   */
  public finalizeDebit(
    userId: string,
    amount: number,
    orderId: string,
    serviceName: string
  ): { wallet: Wallet; transaction: WalletTransaction } {
    const wallet = this.getOrCreateWallet(userId);
    const balanceBefore = wallet.availableBalance;
    const holdBefore = wallet.heldBalance;

    const actualDeduct = Math.min(wallet.heldBalance, amount);
    wallet.heldBalance = Math.round((wallet.heldBalance - actualDeduct) * 100) / 100;
    wallet.updatedAt = new Date().toISOString();
    memoryCache.set(`wallet:${userId}`, wallet, 300);

    const transaction: WalletTransaction = {
      id: `TXN-${uuidv4().slice(0, 8).toUpperCase()}`,
      walletId: wallet.id,
      userId,
      type: 'DEBIT_OTP_PURCHASE',
      amount: actualDeduct,
      balanceBefore,
      balanceAfter: wallet.availableBalance,
      holdBefore,
      holdAfter: wallet.heldBalance,
      referenceType: 'OTP_ORDER',
      referenceId: orderId,
      description: `Finalized debit for verified OTP delivery: ${serviceName}`,
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
    };

    memoryStore.transactions.push(transaction);
    return { wallet, transaction };
  }

  /**
   * Administrative Balance Adjustment
   */
  public adminAdjustBalance(
    userId: string,
    type: 'ADMIN_CREDIT' | 'ADMIN_DEBIT',
    amount: number,
    description: string
  ): { wallet: Wallet; transaction: WalletTransaction } {
    const wallet = this.getOrCreateWallet(userId);
    const balanceBefore = wallet.availableBalance;
    const holdBefore = wallet.heldBalance;

    if (type === 'ADMIN_CREDIT') {
      wallet.availableBalance = Math.round((wallet.availableBalance + amount) * 100) / 100;
    } else {
      wallet.availableBalance = Math.max(0, Math.round((wallet.availableBalance - amount) * 100) / 100);
    }
    wallet.updatedAt = new Date().toISOString();
    memoryCache.set(`wallet:${userId}`, wallet, 300);

    const transaction: WalletTransaction = {
      id: `TXN-${uuidv4().slice(0, 8).toUpperCase()}`,
      walletId: wallet.id,
      userId,
      type,
      amount,
      balanceBefore,
      balanceAfter: wallet.availableBalance,
      holdBefore,
      holdAfter: wallet.heldBalance,
      referenceType: 'ADMIN_AUDIT',
      referenceId: `ADJ-${Date.now()}`,
      description: `Manual admin adjustment: ${description}`,
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
    };

    memoryStore.transactions.push(transaction);
    return { wallet, transaction };
  }
}

export const walletService = new WalletService();
