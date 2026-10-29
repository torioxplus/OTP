import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/index.js';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export const app = express();

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow frontend Next.js embedding
    crossOriginEmbedderPolicy: false,
  })
);

// Global Rate Limiter to prevent DoS / automated flooding
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 300, // 300 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP. Please slow down and try again after a minute.',
  },
});
app.use(globalLimiter);

// Middlewares
const allowedOrigins = [
  config.corsOrigin,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://sim10.in',
  'http://sim10.in',
  'https://www.sim10.in',
  'http://www.sim10.in',
  'https://ameridrugs.in',
  'http://ameridrugs.in',
  'https://www.ameridrugs.in',
  'http://www.ameridrugs.in',
  'http://187.126.127.19',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.includes('sim10.in') ||
        origin.includes('ameridrugs.in') ||
        origin.includes('187.126.127.19') ||
        origin.includes('localhost')
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'OTP Wallet Platform API',
    version: '1.0.0',
    documentation: '/api/v1/health',
    endpoints: {
      auth: '/api/v1/auth',
      wallet: '/api/v1/wallet',
      services: '/api/v1/services',
      otp: '/api/v1/otp',
      tickets: '/api/v1/tickets',
      admin: '/api/v1/admin',
    },
  });
});

// Mount V1 API
app.use('/api/v1', apiRouter);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
  });
});

// Error handling middleware
app.use(errorHandler);
