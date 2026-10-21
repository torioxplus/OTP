import { memoryStore } from '../store/memoryStore.js';
import { AdminStats, ServiceItem, User } from '../types/index.js';
import { walletService } from './walletService.js';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase.js';

export class AdminService {
  public async getDashboardStats(): Promise<AdminStats> {
    let totalUsers = 0;
    let activeUsers = 0;
    let todayOrders = 0;
    let completedOrders = 0;
    let failedOrders = 0;
    let totalRefunds = 0;
    let totalRevenue = 0;
    let totalProviderCost = 0;
    let todayRecharge = 0;

    if (isSupabaseConfigured()) {
      try {
        const client = getSupabase();

        // 1. Real Users count from Supabase
        const { data: dbUsers } = await client.from('users').select('id, status');
        if (dbUsers) {
          totalUsers = dbUsers.length;
          activeUsers = dbUsers.filter((u) => u.status === 'active').length;
        }

        // 2. Real Orders from Supabase
        const { data: dbOrders } = await client.from('otp_orders').select('*');
        if (dbOrders) {
          todayOrders = dbOrders.length;
          const completed = dbOrders.filter((o) => o.status === 'COMPLETED');
          completedOrders = completed.length;
          failedOrders = dbOrders.filter(
            (o) => o.status === 'FAILED' || o.status === 'CANCELLED'
          ).length;
          totalRefunds = dbOrders.filter((o) => o.status === 'REFUNDED').length;
          totalRevenue = completed.reduce(
            (sum, o) => sum + parseFloat(o.selling_price || 0),
            0
          );
          totalProviderCost = completed.reduce(
            (sum, o) => sum + parseFloat(o.provider_cost || 0),
            0
          );
        }

        // 3. Real Transactions / Recharges from Supabase
        const { data: dbTxns } = await client.from('wallet_transactions').select('*');
        if (dbTxns) {
          todayRecharge = dbTxns
            .filter((t) => t.type === 'CREDIT_RECHARGE')
            .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
        }
      } catch (e) {
        console.warn('[AdminService] Supabase stats query warning:', e);
      }
    }

    if (totalUsers === 0) {
      const users = Array.from(memoryStore.users.values());
      totalUsers = users.length;
      activeUsers = users.filter((u) => u.status === 'active').length;
    }

    const grossProfit = Math.round((totalRevenue - totalProviderCost) * 100) / 100;

    return {
      totalUsers,
      activeUsers,
      todayRecharge: Math.round(todayRecharge * 100) / 100,
      todayOrders,
      successfulOrders: completedOrders,
      failedOrders,
      totalRefunds,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalProviderCost: Math.round(totalProviderCost * 100) / 100,
      grossProfit,
    };
  }

  public async getAllUsers(): Promise<User[]> {
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabase();
        const { data: dbUsers, error } = await client
          .from('users')
          .select('*, wallets(*)')
          .order('created_at', { ascending: false });

        if (dbUsers && !error) {
          return dbUsers.map((u: Record<string, unknown>) => {
            const rawWal = Array.isArray(u.wallets)
              ? (u.wallets[0] as Record<string, unknown> | undefined)
              : (u.wallets as Record<string, unknown> | undefined);
            return {
              id: String(u.id),
              name: String(u.name || 'User'),
              email: String(u.email || ''),
              phone: String(u.phone || ''),
              role: (u.role as User['role']) || 'customer',
              status: (u.status as User['status']) || 'active',
              emailVerified: !!u.email_verified,
              twoFactorEnabled: !!u.two_factor_enabled,
              createdAt: String(u.created_at || new Date().toISOString()),
              walletBalance: parseFloat(String(rawWal?.available_balance || 0)),
            };
          });
        }
      } catch (err) {
        console.warn('[AdminService] Supabase getAllUsers error:', err);
      }
    }

    return Array.from(memoryStore.users.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public async toggleUserStatus(userId: string): Promise<User> {
    let newStatus: 'active' | 'blocked' = 'active';
    const user = memoryStore.users.get(userId);
    if (user) {
      newStatus = user.status === 'active' ? 'blocked' : 'active';
      user.status = newStatus;
      memoryStore.users.set(userId, user);
    }

    if (isSupabaseConfigured()) {
      try {
        const client = getSupabase();
        const { data: dbUser } = await client
          .from('users')
          .select('status')
          .eq('id', userId)
          .maybeSingle();

        if (dbUser) {
          newStatus = dbUser.status === 'active' ? 'blocked' : 'active';
        }

        await client.from('users').update({ status: newStatus }).eq('id', userId);
      } catch (err) {
        console.warn('[AdminService] Supabase toggleUserStatus error:', err);
      }
    }

    return (
      user || {
        id: userId,
        name: 'User',
        email: '',
        role: 'customer',
        status: newStatus,
        emailVerified: true,
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
      }
    );
  }

  public adjustUserWallet(
    userId: string,
    type: 'ADMIN_CREDIT' | 'ADMIN_DEBIT',
    amount: number,
    notes: string
  ) {
    return walletService.adminAdjustBalance(userId, type, amount, notes);
  }

  public updateService(serviceId: string, updates: Partial<ServiceItem>): ServiceItem {
    const service = memoryStore.services.get(serviceId);
    if (!service) {
      throw new Error(`Service not found: ${serviceId}`);
    }
    const updated = { ...service, ...updates };
    memoryStore.services.set(serviceId, updated);

    if (isSupabaseConfigured()) {
      (async () => {
        try {
          const client = getSupabase();
          await client
            .from('services')
            .update({
              selling_price: updated.sellingPrice,
              minimum_margin: updated.minimumMargin,
              enabled: updated.enabled,
            })
            .eq('id', serviceId);
        } catch {}
      })();
    }

    return updated;
  }
}

export const adminService = new AdminService();
