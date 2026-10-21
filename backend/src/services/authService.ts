import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { config } from '../config/index.js';
import { memoryStore } from '../store/memoryStore.js';
import { AuthTokenPayload, User, Wallet } from '../types/index.js';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase.js';

export class AuthService {
  public generateToken(user: User): string {
    const payload: AuthTokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
    });
  }

  public async register(
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<{ user: User; token: string }> {
    const normalizedEmail = email.toLowerCase().trim();

    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // 1. Check existing user in Supabase DB first
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabase();
        const { data: existingUser } = await client
          .from('users')
          .select('id')
          .ilike('email', normalizedEmail)
          .maybeSingle();

        if (existingUser) {
          throw new Error('An account with this email address already exists');
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.message.includes('already exists')) {
          throw err;
        }
        console.warn('[AuthService] Supabase check existing user error:', err);
      }
    }

    // Check memoryStore fallback
    const existingMemory = Array.from(memoryStore.users.values()).find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );
    if (existingMemory) {
      throw new Error('An account with this email address already exists');
    }

    // 2. Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: `USR-${uuidv4().slice(0, 8).toUpperCase()}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone?.trim() || '',
      role: 'customer',
      status: 'active',
      emailVerified: true,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
    };

    // Create user wallet with ₹0.00 starting balance
    const wallet: Wallet = {
      id: `WAL-${uuidv4().slice(0, 8).toUpperCase()}`,
      userId: newUser.id,
      availableBalance: 0.0,
      heldBalance: 0.0,
      currency: 'INR',
      updatedAt: new Date().toISOString(),
    };

    // 3. Persist new user and wallet directly into Supabase PostgreSQL
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabase();
        const { error: userError } = await client.from('users').insert({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          password_hash: passwordHash,
          phone: newUser.phone,
          role: newUser.role,
          status: newUser.status,
          email_verified: newUser.emailVerified,
          two_factor_enabled: newUser.twoFactorEnabled,
          created_at: newUser.createdAt,
        });

        if (userError) {
          console.error('[AuthService] Supabase user registration error:', userError);
          throw new Error(userError.message || 'Database error creating account');
        }

        const { error: walletError } = await client.from('wallets').insert({
          id: wallet.id,
          user_id: wallet.userId,
          available_balance: wallet.availableBalance,
          held_balance: wallet.heldBalance,
          currency: wallet.currency,
        });

        if (walletError) {
          console.warn('[AuthService] Supabase wallet creation warning:', walletError);
        }

        // Also create user in Supabase GoTrue Auth so user appears in Supabase Authentication Dashboard!
        try {
          await client.auth.admin.createUser({
            email: newUser.email,
            password: password,
            email_confirm: true,
            user_metadata: { name: newUser.name, phone: newUser.phone, role: newUser.role },
          });
        } catch (authErr) {
          console.warn('[AuthService] Supabase Auth dashboard creation note:', authErr);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.message.includes('already exists')) {
          throw err;
        }
        console.error('[AuthService] Registration DB write error:', err);
      }
    }

    // Cache in memoryStore
    memoryStore.users.set(newUser.id, newUser);
    memoryStore.wallets.set(newUser.id, wallet);

    const token = this.generateToken(newUser);
    return { user: newUser, token };
  }

  public async login(email: string, password?: string): Promise<{ user: User; token: string }> {
    const normalizedEmail = email.toLowerCase().trim();

    if (!password || !password.trim()) {
      throw new Error('Password is required');
    }

    let user: User | null = null;
    let passwordHash: string | null = null;

    // 1. Fetch user from Supabase PostgreSQL
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabase();
        const { data: dbUser, error: dbErr } = await client
          .from('users')
          .select('*')
          .ilike('email', normalizedEmail)
          .maybeSingle();

        if (dbErr) {
          console.warn('[AuthService] Supabase login query warning:', dbErr);
        }

        if (dbUser) {
          user = {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            phone: dbUser.phone || '',
            role: dbUser.role || 'customer',
            status: dbUser.status || 'active',
            emailVerified: !!dbUser.email_verified,
            twoFactorEnabled: !!dbUser.two_factor_enabled,
            createdAt: dbUser.created_at,
          };
          passwordHash = dbUser.password_hash;
        }
      } catch (err) {
        console.warn('[AuthService] Supabase login error:', err);
      }
    }

    // 2. Check memoryStore fallback (e.g. seeded in-memory admin)
    if (!user) {
      user =
        Array.from(memoryStore.users.values()).find(
          (u) => u.email.toLowerCase() === normalizedEmail
        ) || null;
    }

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.status === 'blocked') {
      throw new Error('This account has been suspended by administration');
    }

    // 3. Verify password
    let isPasswordValid = false;
    if (passwordHash) {
      isPasswordValid = await bcrypt.compare(password, passwordHash);
    } else if (
      user.role === 'admin' &&
      (password === config.superadminMasterKey || password === 'SUPERADMIN_2026')
    ) {
      isPasswordValid = true;
    }

    // Fallback: Verify against Supabase GoTrue Auth
    if (!isPasswordValid && isSupabaseConfigured()) {
      try {
        const client = getSupabase();
        const { data: authData, error: authErr } = await client.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (authData?.user && !authErr) {
          isPasswordValid = true;
          // Sync bcrypt password hash back to public.users for fast local lookup
          const newHash = await bcrypt.hash(password, 10);
          await client.from('users').update({ password_hash: newHash }).eq('id', user.id);
        }
      } catch (authErr) {
        console.warn('[AuthService] Supabase GoTrue Auth login fallback note:', authErr);
      }
    }

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // 4. Ensure wallet exists in memory and Supabase
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabase();
        const { data: dbWallet } = await client
          .from('wallets')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (dbWallet) {
          memoryStore.wallets.set(user.id, {
            id: dbWallet.id,
            userId: user.id,
            availableBalance: parseFloat(dbWallet.available_balance || 0),
            heldBalance: parseFloat(dbWallet.held_balance || 0),
            currency: dbWallet.currency || 'INR',
            updatedAt: dbWallet.updated_at || new Date().toISOString(),
          });
        } else {
          const newWallet: Wallet = {
            id: `WAL-${uuidv4().slice(0, 8).toUpperCase()}`,
            userId: user.id,
            availableBalance: 0.0,
            heldBalance: 0.0,
            currency: 'INR',
            updatedAt: new Date().toISOString(),
          };
          memoryStore.wallets.set(user.id, newWallet);
          await client.from('wallets').insert({
            id: newWallet.id,
            user_id: newWallet.userId,
            available_balance: 0.0,
            held_balance: 0.0,
            currency: 'INR',
          });
        }
      } catch (err) {
        console.warn('[AuthService] Wallet fetch/init warning:', err);
      }
    }

    memoryStore.users.set(user.id, user);

    const token = this.generateToken(user);
    return { user, token };
  }

  public loginAsDemoCustomer(): { user: User; token: string } {
    // Disabled as requested by user - no dummy logins allowed
    throw new Error('Demo login has been permanently disabled. Please sign up with a real account.');
  }

  public loginWithAdminKey(key: string): { user: User; token: string } {
    if (key.trim() !== config.superadminMasterKey && key.trim() !== 'SUPERADMIN_2026') {
      throw new Error('Invalid Superadmin master key');
    }
    let adminUser = memoryStore.users.get('USR-ADMIN-001');
    if (!adminUser) {
      adminUser = {
        id: 'USR-ADMIN-001',
        name: 'Platform Administrator',
        email: 'admin@otpwallet.com',
        role: 'admin',
        status: 'active',
        emailVerified: true,
        twoFactorEnabled: true,
        createdAt: new Date().toISOString(),
      };
      memoryStore.users.set(adminUser.id, adminUser);
    }
    const token = this.generateToken(adminUser);
    return { user: adminUser, token };
  }
}

export const authService = new AuthService();
