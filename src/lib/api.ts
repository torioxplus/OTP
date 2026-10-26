import {
  User,
  Wallet,
  WalletTransaction,
  ServiceItem,
  Country,
  SmsProvider,
  OtpOrder,
  SupportTicket,
} from '@/types';
import { clientCache, DEFAULT_TTLS } from './cache';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || '/api/v1';

const TOKEN_KEY = 'otp_auth_token';

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  try {
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  } catch {
    // Cookie fallback
  }
};

export const removeStoredToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  try {
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
  } catch {
    // Cookie fallback
  }
};

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface RequestOptions extends RequestInit {
  ttl?: number;
  force?: boolean;
  bypassCache?: boolean;
  swr?: boolean;
}

async function rawFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: data.error || data.message || `Request failed with status ${res.status}`,
      };
    }

    return data as ApiResponse<T>;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error or backend offline';
    return {
      success: false,
      error: message,
    };
  }
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const method = (options.method || 'GET').toUpperCase();
  const isGet = method === 'GET';

  // 1. GET requests use client cache & SWR
  if (isGet && !options.bypassCache) {
    const ttl = options.ttl ?? DEFAULT_TTLS.SERVICES;
    return clientCache.fetchWithCache<ApiResponse<T>>(
      endpoint,
      () => rawFetch<T>(endpoint, options),
      { ttl, force: options.force, swr: options.swr !== false }
    );
  }

  // 2. Non-GET or cache-bypassed requests execute directly
  const res = await rawFetch<T>(endpoint, options);

  // 3. Smart automatic invalidation on successful mutations
  if (res.success && !isGet) {
    if (endpoint.startsWith('/wallet')) {
      clientCache.invalidatePrefix('/wallet');
      clientCache.invalidatePrefix('/admin/dashboard');
      clientCache.invalidatePrefix('/admin/users');
    } else if (endpoint.startsWith('/otp')) {
      clientCache.invalidatePrefix('/otp');
      clientCache.invalidatePrefix('/wallet');
      clientCache.invalidatePrefix('/admin/dashboard');
    } else if (endpoint.startsWith('/services')) {
      clientCache.invalidatePrefix('/services');
      clientCache.invalidatePrefix('/admin/dashboard');
    } else if (endpoint.startsWith('/admin')) {
      clientCache.invalidatePrefix('/admin');
      clientCache.invalidatePrefix('/services');
      clientCache.invalidatePrefix('/wallet');
    } else if (endpoint.startsWith('/tickets')) {
      clientCache.invalidatePrefix('/tickets');
    } else if (endpoint.startsWith('/auth')) {
      clientCache.clearAll();
    }
  }

  return res;
}

export const api = {
  // Cache utility exposure
  cache: clientCache,

  // 1. Health
  healthCheck: async (options?: { force?: boolean }) => {
    return request<{ status: string; service: string }>('/health', {
      ttl: DEFAULT_TTLS.STATIC,
      force: options?.force,
    });
  },

  // 2. Authentication
  auth: {
    login: async (email: string, password?: string) => {
      clientCache.clearAll();
      const res = await request<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res.success && res.data?.token) {
        setStoredToken(res.data.token);
      }
      return res;
    },

    register: async (name: string, email: string, password: string, phone?: string) => {
      clientCache.clearAll();
      const res = await request<{ user: User; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, phone }),
      });
      if (res.success && res.data?.token) {
        setStoredToken(res.data.token);
      }
      return res;
    },

    loginAsDemoCustomer: async () => {
      clientCache.clearAll();
      const res = await request<{ user: User; token: string }>('/auth/demo-customer', {
        method: 'POST',
      });
      if (res.success && res.data?.token) {
        setStoredToken(res.data.token);
      }
      return res;
    },

    loginWithAdminKey: async (key: string) => {
      clientCache.clearAll();
      const res = await request<{ user: User; token: string }>('/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify({ key }),
      });
      if (res.success && res.data?.token) {
        setStoredToken(res.data.token);
      }
      return res;
    },

    getMe: async (options?: { force?: boolean }) => {
      return request<{ user: User }>('/auth/me', {
        ttl: 30 * 1000,
        force: options?.force,
      });
    },

    logout: () => {
      removeStoredToken();
      clientCache.clearAll();
    },
  },

  // 3. Wallet
  wallet: {
    getBalance: async (options?: { force?: boolean }) => {
      return request<{ wallet: Wallet }>('/wallet/balance', {
        ttl: DEFAULT_TTLS.WALLET,
        force: options?.force,
      });
    },

    getTransactions: async (limit: number = 50, options?: { force?: boolean }) => {
      return request<{ transactions: WalletTransaction[] }>(
        `/wallet/transactions?limit=${limit}`,
        {
          ttl: DEFAULT_TTLS.WALLET,
          force: options?.force,
        }
      );
    },

    createRecharge: async (amount: number, paymentMethod: string) => {
      return request<{
        transaction: WalletTransaction;
        gatewayOrderId: string;
        paymentUrl?: string;
      }>('/wallet/recharge', {
        method: 'POST',
        body: JSON.stringify({ amount, paymentMethod }),
      });
    },

    verifyPayment: async (
      gatewayOrderId: string,
      paymentId: string,
      signature: string
    ) => {
      return request<{ transaction: WalletTransaction }>('/wallet/verify-payment', {
        method: 'POST',
        body: JSON.stringify({ gatewayOrderId, paymentId, signature }),
      });
    },

    createRazorpayOrder: async (amount: number) => {
      return request<{
        orderId: string;
        amount: number;
        amountInRupees: number;
        currency: string;
        keyId: string;
        isSandbox: boolean;
      }>('/wallet/razorpay/create-order', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      });
    },

    verifyRazorpayPayment: async (
      orderId: string,
      paymentId: string,
      signature: string,
      amount: number
    ) => {
      return request<{
        wallet: Wallet;
        transaction: WalletTransaction;
      }>('/wallet/razorpay/verify-payment', {
        method: 'POST',
        body: JSON.stringify({ orderId, paymentId, signature, amount }),
      });
    },

    adminAdjust: async (
      userId: string,
      type: 'ADMIN_CREDIT' | 'ADMIN_DEBIT',
      amount: number,
      reason: string
    ) => {
      return request<{ transaction: WalletTransaction; wallet: Wallet }>('/wallet/admin-adjust', {
        method: 'POST',
        body: JSON.stringify({ userId, type, amount, reason }),
      });
    },
  },

  // 4. Services & Providers
  services: {
    getAll: async (category?: string, countryCode?: string, options?: { force?: boolean }) => {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (countryCode) params.set('countryCode', countryCode);
      const query = params.toString() ? `?${params.toString()}` : '';
      return request<{ services: ServiceItem[] }>(`/services${query}`, {
        ttl: DEFAULT_TTLS.SERVICES,
        force: options?.force,
      });
    },

    getCountries: async (options?: { force?: boolean }) => {
      return request<{ countries: Country[] }>('/services/countries', {
        ttl: DEFAULT_TTLS.STATIC,
        force: options?.force,
      });
    },

    getProviders: async (options?: { force?: boolean }) => {
      return request<{ providers: SmsProvider[] }>('/services/providers', {
        ttl: DEFAULT_TTLS.PROVIDERS,
        force: options?.force,
      });
    },

    updateService: async (id: string, updates: Partial<ServiceItem>) => {
      return request<{ service: ServiceItem }>(`/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    toggleService: async (id: string) => {
      return request<{ service: ServiceItem }>(`/services/${id}/toggle`, {
        method: 'PATCH',
      });
    },

    updateProvider: async (id: string, updates: Partial<SmsProvider>) => {
      return request<{ provider: SmsProvider }>(`/services/providers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    syncProvider: async (id: string) => {
      return request<{ provider: SmsProvider }>(`/services/providers/${id}/sync`, {
        method: 'POST',
      });
    },
  },

  // 5. OTP Orders
  otp: {
    createOrder: async (serviceId: string, countryCode: string = 'IN', operator?: string) => {
      return request<{ order: OtpOrder }>('/otp/orders', {
        method: 'POST',
        body: JSON.stringify({ serviceId, countryCode, operator }),
      });
    },

    getUserOrders: async (options?: { force?: boolean }) => {
      return request<{ orders: OtpOrder[] }>('/otp/orders', {
        ttl: DEFAULT_TTLS.ORDERS,
        force: options?.force,
      });
    },

    getActiveOrder: async (options?: { force?: boolean }) => {
      return request<{ activeOrder: OtpOrder | null }>('/otp/orders/active', {
        ttl: DEFAULT_TTLS.ACTIVE_ORDER,
        force: options?.force,
      });
    },

    getOrder: async (id: string) => {
      return request<{ order: OtpOrder }>(`/otp/orders/${id}`);
    },

    cancelOrder: async (id: string) => {
      return request<{ order: OtpOrder }>(`/otp/orders/${id}/cancel`, {
        method: 'POST',
      });
    },

    simulateSms: async (id: string, code?: string) => {
      return request<{ order: OtpOrder }>(`/otp/orders/${id}/simulate-sms`, {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
    },
  },

  // 6. Support Tickets
  tickets: {
    getAll: async (options?: { force?: boolean }) => {
      return request<{ tickets: SupportTicket[] }>('/tickets', {
        ttl: DEFAULT_TTLS.TICKETS,
        force: options?.force,
      });
    },

    create: async (subject: string, category: string, message: string) => {
      return request<{ ticket: SupportTicket }>('/tickets', {
        method: 'POST',
        body: JSON.stringify({ subject, category, message }),
      });
    },

    reply: async (id: string, message: string) => {
      return request<{ ticket: SupportTicket }>(`/tickets/${id}/reply`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
    },
  },

  // 7. Admin Dashboard
  admin: {
    getDashboard: async (options?: { force?: boolean }) => {
      return request<{ stats: Record<string, number> }>('/admin/dashboard', {
        ttl: DEFAULT_TTLS.ADMIN_STATS,
        force: options?.force,
      });
    },

    getUsers: async (options?: { force?: boolean }) => {
      return request<{ users: User[] }>('/admin/users', {
        ttl: DEFAULT_TTLS.ADMIN_USERS,
        force: options?.force,
      });
    },

    toggleUser: async (userId: string) => {
      return request<{ user: User }>(`/admin/users/${userId}/status`, {
        method: 'PATCH',
      });
    },

    adjustWallet: async (
      userId: string,
      type: 'ADMIN_CREDIT' | 'ADMIN_DEBIT',
      amount: number,
      notes: string
    ) => {
      return request<{ wallet: Wallet; transaction: WalletTransaction }>(
        `/admin/users/${userId}/wallet/adjust`,
        {
          method: 'POST',
          body: JSON.stringify({ type, amount, notes }),
        }
      );
    },

    updateMargin: async (serviceId: string, minimumMargin: number) => {
      return request<{ service: ServiceItem }>(`/admin/pricing/margin`, {
        method: 'PATCH',
        body: JSON.stringify({ serviceId, minimumMargin }),
      });
    },
  },
};
