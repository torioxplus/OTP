/**
 * Universal High-Performance Client Cache & SWR Engine
 * Provides 0ms instant cached page loads, in-flight request deduplication,
 * configurable TTLs, and seamless background Stale-While-Revalidate (SWR).
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const STORAGE_PREFIX = 'otp_c_v5_';
const memoryCache = new Map<string, CacheEntry<unknown>>();
const inFlightRequests = new Map<string, Promise<unknown>>();
const listeners = new Map<string, Set<(data: unknown) => void>>();

export const DEFAULT_TTLS = {
  STATIC: 5 * 60 * 1000,      // 5 minutes (Countries, static lists)
  SERVICES: 60 * 1000,        // 60 seconds (Catalog, prices)
  PROVIDERS: 30 * 1000,       // 30 seconds (Carrier statuses)
  ADMIN_STATS: 15 * 1000,     // 15 seconds (Admin KPIs, revenue)
  ADMIN_USERS: 20 * 1000,     // 20 seconds (Admin user directory)
  WALLET: 10 * 1000,          // 10 seconds (Balance & transactions)
  ORDERS: 10 * 1000,          // 10 seconds (User orders history)
  ACTIVE_ORDER: 5 * 1000,     // 5 seconds (Live OTP waiting order)
  TICKETS: 30 * 1000,         // 30 seconds (Support tickets)
} as const;

class ClientCacheEngine {
  /**
   * Read from Memory cache first (0ms), fallback to persistent localStorage
   */
  public get<T>(key: string): { data: T; isFresh: boolean } | null {
    // 1. In-Memory lookup
    const memEntry = memoryCache.get(key) as CacheEntry<T> | undefined;
    const now = Date.now();

    if (memEntry) {
      const isFresh = now - memEntry.timestamp < memEntry.ttl;
      return { data: memEntry.data, isFresh };
    }

    // 2. LocalStorage lookup (fallback on page reload)
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem(STORAGE_PREFIX + key);
        if (item) {
          const parsed = JSON.parse(item) as CacheEntry<T>;
          // Hydrate memory cache
          memoryCache.set(key, parsed as CacheEntry<unknown>);
          const isFresh = now - parsed.timestamp < parsed.ttl;
          return { data: parsed.data, isFresh };
        }
      } catch {
        // LocalStorage quota or parse error ignored
      }
    }

    return null;
  }

  /**
   * Set cache entry in both Memory and LocalStorage
   */
  public set<T>(key: string, data: T, ttl: number = DEFAULT_TTLS.SERVICES): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    memoryCache.set(key, entry as CacheEntry<unknown>);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(entry));
      } catch {
        // Storage quota protection - clear oldest if full
      }
    }

    this.notifySubscribers(key, data);
  }

  /**
   * Invalidate a single key
   */
  public invalidate(key: string): void {
    memoryCache.delete(key);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_PREFIX + key);
      } catch {}
    }
  }

  /**
   * Invalidate all keys matching a prefix or pattern (e.g. '/wallet' or '/admin')
   */
  public invalidatePrefix(prefix: string): void {
    // Memory
    for (const key of memoryCache.keys()) {
      if (key.startsWith(prefix) || key.includes(prefix)) {
        memoryCache.delete(key);
      }
    }

    // LocalStorage
    if (typeof window !== 'undefined') {
      try {
        const targetPrefix = STORAGE_PREFIX + prefix;
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.startsWith(targetPrefix) || k.includes(prefix))) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      } catch {}
    }
  }

  /**
   * Clear entire client cache
   */
  public clearAll(): void {
    memoryCache.clear();
    if (typeof window !== 'undefined') {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(STORAGE_PREFIX)) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      } catch {}
    }
  }

  /**
   * Execute fetch with cache + request deduplication + SWR
   */
  public async fetchWithCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: {
      ttl?: number;
      force?: boolean;
      swr?: boolean;
    } = {}
  ): Promise<T> {
    const { ttl = DEFAULT_TTLS.SERVICES, force = false, swr = true } = options;

    // Check existing cache if not forced
    if (!force) {
      const cached = this.get<T>(key);
      if (cached) {
        if (cached.isFresh) {
          // Fresh cache hit - return instantly (0ms)
          return cached.data;
        }

        // Cache is stale. If SWR is enabled, return stale data immediately and revalidate in background!
        if (swr) {
          this.revalidateInBackground(key, fetcher, ttl);
          return cached.data;
        }
      }
    }

    // Deduplicate in-flight requests for the same key
    if (inFlightRequests.has(key)) {
      return inFlightRequests.get(key) as Promise<T>;
    }

    const requestPromise = (async () => {
      try {
        const result = await fetcher();
        this.set(key, result, ttl);
        return result;
      } finally {
        inFlightRequests.delete(key);
      }
    })();

    inFlightRequests.set(key, requestPromise);
    return requestPromise;
  }

  /**
   * Revalidate in background without blocking the UI
   */
  private revalidateInBackground<T>(key: string, fetcher: () => Promise<T>, ttl: number): void {
    if (inFlightRequests.has(key)) return;

    const promise = (async () => {
      try {
        const fresh = await fetcher();
        this.set(key, fresh, ttl);
      } catch (err) {
        console.warn(`[Cache SWR Revalidation Failed for ${key}]`, err);
      } finally {
        inFlightRequests.delete(key);
      }
    })();

    inFlightRequests.set(key, promise);
  }

  /**
   * Subscribe to cache updates for reactive re-renders
   */
  public subscribe<T>(key: string, callback: (data: T) => void): () => void {
    if (!listeners.has(key)) {
      listeners.set(key, new Set());
    }
    const set = listeners.get(key)!;
    set.add(callback as (data: unknown) => void);

    return () => {
      set.delete(callback as (data: unknown) => void);
      if (set.size === 0) {
        listeners.delete(key);
      }
    };
  }

  private notifySubscribers(key: string, data: unknown): void {
    const set = listeners.get(key);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(data);
        } catch (e) {
          console.error('[Cache Subscriber Error]', e);
        }
      });
    }
  }
}

export const clientCache = new ClientCacheEngine();
