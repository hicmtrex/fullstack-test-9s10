import { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';

interface RateLimitEntry {
  firstAttemptAt: number;
  attempts: number;
}

// In-memory store for rate limiting (sufficient for this test project)
const loginAttempts = new Map<string, RateLimitEntry>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

/**
 * Simple rate limiter middleware for login endpoint
 * Limits failed login attempts per IP within a time window
 */
export function loginRateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const key = `login:${ip}`;

  const now = Date.now();
  const entry = loginAttempts.get(key);

  if (entry) {
    const elapsed = now - entry.firstAttemptAt;

    if (elapsed > WINDOW_MS) {
      // Reset window
      loginAttempts.set(key, { firstAttemptAt: now, attempts: 1 });
    } else if (entry.attempts >= MAX_ATTEMPTS) {
      const retryAfter = Math.ceil((WINDOW_MS - elapsed) / 1000);
      logger.warn('Login rate limit exceeded', { ip, attempts: entry.attempts });
      res
        .status(429)
        .setHeader('Retry-After', retryAfter.toString())
        .json({
          message:
            'Too many login attempts. Please try again later or contact support if the issue persists.',
        });
      return;
    } else {
      // Within window and under limit
      loginAttempts.set(key, { firstAttemptAt: entry.firstAttemptAt, attempts: entry.attempts + 1 });
    }
  } else {
    loginAttempts.set(key, { firstAttemptAt: now, attempts: 1 });
  }

  next();
}


