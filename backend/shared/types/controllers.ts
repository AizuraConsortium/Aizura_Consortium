/**
 * Controller Type Definitions
 *
 * Common types for controller layer functionality.
 * Provides type safety for request/response handling.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Standard controller method signature
 */
export type ControllerMethod<TReq = Request, TRes = Response> = (
  req: TReq,
  res: TRes,
  next?: NextFunction
) => void | Promise<void>;

/**
 * Async controller method (returns Promise)
 */
export type AsyncControllerMethod<TReq = Request, TRes = Response> = (
  req: TReq,
  res: TRes,
  next?: NextFunction
) => Promise<void>;

/**
 * Controller method with no next function
 */
export type ControllerHandler<TReq = Request, TRes = Response> = (
  req: TReq,
  res: TRes
) => void | Promise<void>;

/**
 * Standard user data in request
 */
export interface RequestUser {
  id: string;
  email: string;
  role: 'admin' | 'client' | 'agent';
}

/**
 * Request with validated body of type T
 */
export interface ValidatedRequest<T> extends Request {
  body: T;
}

/**
 * Standard API response envelope
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    pagination?: {
      limit: number;
      offset: number;
      total: number;
      page: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    timestamp?: string;
    requestId?: string;
  };
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Error response format
 */
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  details?: any;
  stack?: string;
  requestId?: string;
  timestamp: string;
}

/**
 * Success response helper
 */
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}
