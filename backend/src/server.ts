import { app } from './app.js';
import { config } from './config/index.js';
import { otpOrderService } from './services/otpOrderService.js';

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 OTP Wallet Platform Backend running on http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${config.nodeEnv}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log(`⚡ API Documentation & Endpoints: http://localhost:${PORT}`);
  console.log(`=================================================`);

  // Start background worker for 5-minute order timeout and hold release
  otpOrderService.startBackgroundWorker(3000);

  // Verify Supabase Cloud PostgreSQL connection
  import('./lib/supabase.js').then(async ({ getSupabase, isSupabaseConfigured }) => {
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabase();
        const { count, error } = await client
          .from('services')
          .select('*', { count: 'exact', head: true });
        if (!error) {
          console.log(`⚡ [Supabase DB] Connected to Cloud PostgreSQL (Tables: 9, Catalog items: ${count})`);
        } else {
          console.warn('[Supabase DB Error]', error.message);
        }

        // Hydrate users from Supabase into memoryStore
        const { data: dbUsers } = await client.from('users').select('*');
        if (dbUsers && dbUsers.length > 0) {
          const { memoryStore } = await import('./store/memoryStore.js');
          for (const u of dbUsers) {
            memoryStore.users.set(u.id, {
              id: u.id,
              name: u.name,
              email: u.email,
              phone: u.phone || '',
              role: u.role || 'customer',
              status: u.status || 'active',
              emailVerified: !!u.email_verified,
              twoFactorEnabled: !!u.two_factor_enabled,
              createdAt: u.created_at,
            });
          }
          console.log(`⚡ [Supabase DB] Hydrated ${dbUsers.length} users into backend store`);
        }

        // Hydrate wallets from Supabase into memoryStore
        const { data: dbWallets } = await client.from('wallets').select('*');
        if (dbWallets && dbWallets.length > 0) {
          const { memoryStore } = await import('./store/memoryStore.js');
          for (const w of dbWallets) {
            memoryStore.wallets.set(w.user_id, {
              id: w.id,
              userId: w.user_id,
              availableBalance: parseFloat(w.available_balance || 0),
              heldBalance: parseFloat(w.held_balance || 0),
              currency: w.currency || 'INR',
              updatedAt: w.updated_at || new Date().toISOString(),
            });
          }
          console.log(`⚡ [Supabase DB] Hydrated ${dbWallets.length} wallets into backend store`);
        }
      } catch (err: unknown) {
        console.warn('[Supabase DB Warning]', err);
      }
    }
  });

  // Sync initial live balances for 5SIM & OnlineSIM
  import('./services/providerService.js').then(({ providerService }) => {
    providerService.syncProviderBalances().catch((err) => {
      console.warn('Initial provider balance sync warning:', err);
    });
  });
});

// Graceful shutdown
const shutdown = () => {
  console.log('\n🛑 Shutting down backend gracefully...');
  otpOrderService.stopBackgroundWorker();
  server.close(() => {
    console.log('✅ HTTP server closed. Process exiting.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

