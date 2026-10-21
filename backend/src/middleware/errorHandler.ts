import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const message = err.message || 'Internal server error';

  let statusCode = err.statusCode || 500;
  if (
    message.includes('Invalid email') ||
    message.includes('Password must be') ||
    message.includes('already exists') ||
    message.includes('Password is required')
  ) {
    statusCode = 400;
  } else if (message.includes('suspended')) {
    statusCode = 403;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};
