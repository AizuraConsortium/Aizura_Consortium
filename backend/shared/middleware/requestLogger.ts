/**
 * Request Logger Middleware
 *
 * Logs all requests with structured format and correlation IDs.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Sensitive header names that should be masked
 */
const SENSITIVE_HEADERS = [
  'authorization',
  'cookie',
  'x-api-key',
  'x-auth-token',
];

/**
 * Sensitive body fields that should be masked
 */
const SENSITIVE_BODY_FIELDS = [
  'password',
  'secret',
  'token',
  'apiKey',
  'api_key',
  'accessToken',
  'access_token',
];

/**
 * Request log data structure
 */
interface RequestLog {
  requestId: string;
  timestamp: string;
  method: string;
  url: string;
  path: string;
  query: Record<string, any>;
  headers: Record<string, string>;
  body?: any;
  userId?: string;
  userRole?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Response log data structure
 */
interface ResponseLog extends RequestLog {
  statusCode: number;
  duration: number;
  responseSize?: number;
}

/**
 * Mask sensitive data in object
 *
 * @param data - Object to mask
 * @param sensitiveFields - Fields to mask
 * @returns Masked object
 */
function maskSensitiveData(
  data: Record<string, any>,
  sensitiveFields: string[]
): Record<string, any> {
  const masked = { ...data };

  for (const field of sensitiveFields) {
    if (masked[field]) {
      masked[field] = '***REDACTED***';
    }
  }

  return masked;
}

/**
 * Generate correlation ID
 */
function generateRequestId(): string {
  // Use crypto.randomUUID if available, fallback to timestamp
  try {
    return crypto.randomUUID();
  } catch {
    return `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}

/**
 * Request logger middleware
 *
 * Logs all incoming requests and outgoing responses with structured format.
 * Includes correlation IDs for request tracking and masks sensitive data.
 *
 * @example
 * app.use(requestLoggerMiddleware);
 */
export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = Date.now();
  const requestId = req.headers['x-request-id'] as string || generateRequestId();

  // Attach request ID to request for use in other middleware/controllers
  (req as any).requestId = requestId;

  // Set response header
  res.setHeader('X-Request-ID', requestId);

  // Prepare request log
  const requestLog: RequestLog = {
    requestId,
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    path: req.path,
    query: req.query,
    headers: maskSensitiveData(
      req.headers as Record<string, string>,
      SENSITIVE_HEADERS
    ),
    userId: (req as any).user?.id,
    userRole: (req as any).user?.role,
    ipAddress: req.ip || req.socket.remoteAddress,
    userAgent: req.get('user-agent'),
  };

  // Include body for non-GET requests (mask sensitive fields)
  if (req.method !== 'GET' && req.body) {
    requestLog.body = maskSensitiveData(
      req.body,
      SENSITIVE_BODY_FIELDS
    );
  }

  // Log request
  console.log(JSON.stringify({
    type: 'REQUEST',
    ...requestLog,
  }));

  // Override res.end to log response
  const originalEnd = res.end.bind(res);
  res.end = function (chunk?: any, encoding?: any, callback?: any): Response {
    const duration = Date.now() - startTime;

    // Prepare response log
    const responseLog: ResponseLog = {
      ...requestLog,
      statusCode: res.statusCode,
      duration,
      responseSize: res.get('content-length')
        ? parseInt(res.get('content-length')!, 10)
        : undefined,
    };

    // Log response
    const logLevel = res.statusCode >= 500 ? 'ERROR' :
                     res.statusCode >= 400 ? 'WARN' : 'INFO';

    console.log(JSON.stringify({
      type: 'RESPONSE',
      level: logLevel,
      ...responseLog,
    }));

    // Call original end
    if (callback) {
      return originalEnd(chunk, encoding, callback);
    } else if (encoding) {
      return originalEnd(chunk, encoding);
    } else {
      return originalEnd(chunk);
    }
  } as any;

  next();
}

/**
 * Log business event
 *
 * Helper function to log important business events with context.
 *
 * @param event - Event name
 * @param data - Event data
 * @param req - Express request (optional)
 *
 * @example
 * logBusinessEvent('PROPOSAL_SUBMITTED', {
 *   proposalId: proposal.id,
 *   userId: user.id
 * }, req);
 */
export function logBusinessEvent(
  event: string,
  data: Record<string, any>,
  req?: Request
): void {
  const log = {
    type: 'BUSINESS_EVENT',
    event,
    timestamp: new Date().toISOString(),
    requestId: (req as any)?.requestId,
    userId: (req as any)?.user?.id,
    data: maskSensitiveData(data, SENSITIVE_BODY_FIELDS),
  };

  console.log(JSON.stringify(log));
}

/**
 * Log security event
 *
 * Helper function to log security-related events.
 *
 * @param event - Event name
 * @param data - Event data
 * @param req - Express request (optional)
 *
 * @example
 * logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', {
 *   path: req.path,
 *   userId: req.user?.id
 * }, req);
 */
export function logSecurityEvent(
  event: string,
  data: Record<string, any>,
  req?: Request
): void {
  const log = {
    type: 'SECURITY_EVENT',
    event,
    timestamp: new Date().toISOString(),
    requestId: (req as any)?.requestId,
    userId: (req as any)?.user?.id,
    ipAddress: req?.ip || req?.socket.remoteAddress,
    userAgent: req?.get('user-agent'),
    data: maskSensitiveData(data, SENSITIVE_BODY_FIELDS),
  };

  console.error(JSON.stringify(log));
}
