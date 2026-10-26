import dotenv from 'dotenv';

dotenv.config();

// Production security assertion
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.error('FATAL: JWT_SECRET must be set and at least 32 characters in production.');
  }
  if (!process.env.SUPERADMIN_MASTER_KEY) {
    console.error('FATAL: SUPERADMIN_MASTER_KEY must be configured in production.');
  }
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-otp-jwt-key-2026-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  superadminMasterKey: process.env.SUPERADMIN_MASTER_KEY || 'SUPERADMIN_2026',
  databaseUrl: process.env.DATABASE_URL || '',
  fiveSimApiKey: process.env.FIVESIM_API_KEY || '',
  onlineSimApiKey: process.env.ONLINESIM_API_KEY || '',
  smsManApiKey: process.env.SMSMAN_API_KEY || '',
  grizzlySmsApiKey: process.env.GRIZZLY_SMS_API_KEY || '5bba7c0da2c431dd1e5c56294fabca18',
  tigerSmsApiKey: process.env.TIGER_SMS_API_KEY || 'XkpIn1695lbXy0y9QCodIQdZ4rKXZh1H',
  // RUB to INR conversion rate for wholesale provider billing calculation
  rubToInrRate: parseFloat(process.env.RUB_TO_INR_RATE || '1.10'),
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  supabaseUrl: process.env.SUPABASE_URL || 'https://yceaqcdehuftdldskugt.supabase.co',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
};


