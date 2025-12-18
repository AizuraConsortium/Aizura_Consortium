import type { Request, Response, NextFunction } from 'express';
import { RateLimiterService } from '../services/rateLimiter.js';
import { getRateLimitForEndpoint, normalizeEndpoint } from '../config/rateLimits.js';

const rateLimiter = RateLimiterService.getInstance();

function getIdentifier(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

function addRateLimitHeaders(
  res: Response,
  limit: number,
  remaining: number,
  resetAt: Date
): void {
  res.setHeader('X-RateLimit-Limit', limit.toString());
  res.setHeader('X-RateLimit-Remaining', Math.max(0, remaining).toString());
  res.setHeader('X-RateLimit-Reset', Math.floor(resetAt.getTime() / 1000).toString());
}

export function rateLimitPostgreSQL(
  maxRequests: number,
  windowMinutes: number,
  endpointName: string
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const identifier = getIdentifier(req);

    try {
      const result = await rateLimiter.checkLimit(
        identifier,
        endpointName,
        maxRequests,
        windowMinutes
      );

      addRateLimitHeaders(res, result.limit, result.remaining, result.resetAt);

      if (!result.allowed) {
        const retryAfter = Math.ceil((result.resetAt.getTime() - Date.now()) / 1000);
        res.setHeader('Retry-After', retryAfter.toString());

        await rateLimiter.logViolation({
          identifier,
          endpoint: endpointName,
          tokensRequested: 1,
          userAgent: req.headers['user-agent'],
          ipAddress: identifier
        });

        return res.status(429).json({
          error: 'Too many requests, please try again later',
          retryAfter
        });
      }

      next();
    } catch (error) {
      console.error('Rate limit middleware error:', error);
      next();
    }
  };
}

export function createRateLimit(endpoint: string) {
  const config = getRateLimitForEndpoint(endpoint);
  return rateLimitPostgreSQL(config.maxRequests, config.windowMinutes, endpoint);
}

export function rateLimit(maxRequests: number, windowMs: number) {
  const windowMinutes = windowMs / 60000;
  const endpointName = 'legacy';
  return rateLimitPostgreSQL(maxRequests, windowMinutes, endpointName);
}

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

export { validatePagination, createQueryValidator } from './queryValidation.js';
export {
  validatePaginationParams,
  validateIntegerParam,
  validateEnumParam,
  QueryValidationError
} from '../utils/queryValidation.js';
export { logValidationFailure, getValidationStats } from '../utils/validationLogger.js';
