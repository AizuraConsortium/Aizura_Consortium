import type { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter
// NOTE: This implementation is suitable for single-server deployments only.
// For production environments with multiple server instances (horizontal scaling),
// replace this with Redis-backed rate limiting to ensure consistent rate limits
// across all server instances.
//
// Recommended approach for production:
//   1. Install: npm install express-rate-limit rate-limit-redis ioredis
//   2. Set up Redis connection (use Redis Cloud, AWS ElastiCache, etc.)
//   3. Replace this implementation with:
//      import rateLimit from 'express-rate-limit';
//      import RedisStore from 'rate-limit-redis';
//      import { Redis } from 'ioredis';
//
//      const redisClient = new Redis(process.env.REDIS_URL);
//
//      export const createRateLimit = (maxRequests: number, windowMs: number) =>
//        rateLimit({
//          windowMs,
//          max: maxRequests,
//          standardHeaders: true,
//          legacyHeaders: false,
//          store: new RedisStore({
//            client: redisClient,
//            prefix: 'rl:',
//          }),
//          message: { error: 'Too many requests, please try again later' }
//        });
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    const now = Date.now();

    let limitData = rateLimitMap.get(key);

    if (!limitData || now > limitData.resetTime) {
      limitData = { count: 0, resetTime: now + windowMs };
      rateLimitMap.set(key, limitData);
    }

    limitData.count++;

    if (limitData.count > maxRequests) {
      return res.status(429).json({
        error: 'Too many requests, please try again later'
      });
    }

    next();
  };
}

// Clean up old rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

// Validation helpers
export function validateProposal(req: Request, res: Response, next: NextFunction) {
  const { title, summary } = req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required and must be a string' });
  }

  if (!summary || typeof summary !== 'string') {
    return res.status(400).json({ error: 'Summary is required and must be a string' });
  }

  // Title length limit: 200 characters
  if (title.length > 200) {
    return res.status(400).json({ error: 'Title must be 200 characters or less' });
  }

  if (title.length < 3) {
    return res.status(400).json({ error: 'Title must be at least 3 characters' });
  }

  // Summary length limit: 5000 characters
  if (summary.length > 5000) {
    return res.status(400).json({ error: 'Summary must be 5000 characters or less' });
  }

  if (summary.length < 10) {
    return res.status(400).json({ error: 'Summary must be at least 10 characters' });
  }

  // Basic sanitization - strip any script tags
  req.body.title = sanitizeInput(title);
  req.body.summary = sanitizeInput(summary);

  next();
}

export function validateVote(req: Request, res: Response, next: NextFunction) {
  const { vote } = req.body;

  if (!vote || !['for', 'against'].includes(vote)) {
    return res.status(400).json({ error: 'Vote must be either "for" or "against"' });
  }

  next();
}

// Basic sanitization function
function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .trim();
}
