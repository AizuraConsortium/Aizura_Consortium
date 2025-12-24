/**
 * Middleware Type Definitions
 *
 * Common types for middleware functionality.
 * Provides type safety for middleware chain.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Standard Express middleware signature
 */
export type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

/**
 * Async middleware (returns Promise)
 */
export type AsyncMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * Error handling middleware
 */
export type ErrorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

/**
 * Middleware factory (returns middleware)
 */
export type MiddlewareFactory<TOptions = any> = (
  options?: TOptions
) => MiddlewareFunction;

/**
 * Rate limit middleware context
 */
export interface RateLimitContext {
  identifier: string;
  endpoint: string;
  limit: number;
  remaining: number;
  resetAt: Date;
  allowed: boolean;
}

/**
 * Authentication context
 */
export interface AuthContext {
  userId: string;
  email: string;
  role: 'admin' | 'client' | 'agent';
  sessionId?: string;
  expiresAt?: Date;
}

/**
 * Authenticated Request (extends Express Request with user context)
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'admin' | 'client' | 'agent';
  };
}

/**
 * Pagination context
 */
export interface PaginationContext {
  limit: number;
  offset: number;
  page?: number;
  maxLimit?: number;
  defaultLimit?: number;
}

/**
 * Validation context
 */
export interface ValidationContext<T = any> {
  schema: T;
  validated: boolean;
  errors?: ValidationError[];
}

/**
 * Validation error detail
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
  code?: string;
}

/**
 * Sanitization options
 */
export interface SanitizationOptions {
  maxLength?: number;
  allowHtml?: boolean;
  stripTags?: boolean;
  trimWhitespace?: boolean;
}

/**
 * Request context for logging
 */
export interface RequestContext {
  requestId: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  requestPath: string;
  requestMethod: string;
  timestamp: Date;
}

/**
 * Admin action context
 */
export interface AdminActionContext {
  adminUserId: string;
  actionType: string;
  resourceType: string;
  resourceId?: string;
  actionDetails?: Record<string, any>;
  success: boolean;
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
}
