import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { memoryStore } from '../store/memoryStore.js';
import { AuthTokenPayload, User } from '../types/index.js';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase.js';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      success: false,
      error: 'Authentication token required',
    });
    return;
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader;

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Authentication token is empty or malformed',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as AuthTokenPayload;
    let user = memoryStore.users.get(decoded.userId);

    // If not found in in-memory store, query Supabase PostgreSQL
    if (!user && isSupabaseConfigured()) {
      try {
        const client = getSupabase();
        const { data: dbUser } = await client
          .from('users')
          .select('*')
          .eq('id', decoded.userId)
          .maybeSingle();

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
          memoryStore.users.set(user.id, user);
        }
      } catch (err) {
        console.warn('[Auth Middleware] Supabase lookup error:', err);
      }
    }

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User account not found',
      });
      return;
    }

    if (user.status === 'blocked') {
      res.status(403).json({
        success: false,
        error: 'Account has been suspended by administration',
      });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired authentication token',
    });
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
    res.status(403).json({
      success: false,
      error: 'Administrative privileges required',
    });
    return;
  }
  next();
};
