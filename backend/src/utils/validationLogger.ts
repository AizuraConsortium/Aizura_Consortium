import type { Request } from 'express';
import type { ValidationErrorDetail } from '../../../shared/types/validation.js';

interface ValidationFailureLog {
  timestamp: string;
  ip: string;
  path: string;
  method: string;
  userAgent?: string;
  error: ValidationErrorDetail;
}

interface SuspiciousPattern {
  ip: string;
  failureCount: number;
  firstFailure: number;
  lastFailure: number;
  patterns: string[];
}

const validationFailures: ValidationFailureLog[] = [];
const suspiciousIPs = new Map<string, SuspiciousPattern>();

const MAX_LOG_SIZE = 1000;
const SUSPICIOUS_THRESHOLD = 10;
const SUSPICIOUS_WINDOW_MS = 60 * 1000;

export function logValidationFailure(
  req: Request,
  error: ValidationErrorDetail
): void {
  const ip = req.ip || 'unknown';
  const timestamp = new Date().toISOString();

  const log: ValidationFailureLog = {
    timestamp,
    ip,
    path: req.path,
    method: req.method,
    userAgent: req.get('user-agent'),
    error
  };

  validationFailures.push(log);

  if (validationFailures.length > MAX_LOG_SIZE) {
    validationFailures.shift();
  }

  trackSuspiciousActivity(ip, error);

  console.warn('[VALIDATION FAILURE]', {
    ip,
    path: req.path,
    param: error.param,
    provided: error.provided,
    timestamp
  });
}

function trackSuspiciousActivity(
  ip: string,
  error: ValidationErrorDetail
): void {
  const now = Date.now();
  let pattern = suspiciousIPs.get(ip);

  if (!pattern) {
    pattern = {
      ip,
      failureCount: 0,
      firstFailure: now,
      lastFailure: now,
      patterns: []
    };
    suspiciousIPs.set(ip, pattern);
  }

  if (now - pattern.firstFailure > SUSPICIOUS_WINDOW_MS) {
    pattern.failureCount = 0;
    pattern.firstFailure = now;
    pattern.patterns = [];
  }

  pattern.failureCount++;
  pattern.lastFailure = now;
  pattern.patterns.push(`${error.param}:${error.provided}`);

  if (pattern.failureCount >= SUSPICIOUS_THRESHOLD) {
    console.error('[SUSPICIOUS ACTIVITY DETECTED]', {
      ip,
      failureCount: pattern.failureCount,
      windowMs: now - pattern.firstFailure,
      patterns: pattern.patterns.slice(-5),
      message: 'Multiple validation failures detected - possible attack attempt'
    });

    pattern.failureCount = 0;
    pattern.firstFailure = now;
    pattern.patterns = [];
  }
}

export function getValidationStats(): {
  totalFailures: number;
  recentFailures: ValidationFailureLog[];
  suspiciousIPs: Array<{
    ip: string;
    failureCount: number;
    patterns: string[];
  }>;
} {
  const suspicious = Array.from(suspiciousIPs.values())
    .filter(p => p.failureCount > 0)
    .map(p => ({
      ip: p.ip,
      failureCount: p.failureCount,
      patterns: p.patterns
    }));

  return {
    totalFailures: validationFailures.length,
    recentFailures: validationFailures.slice(-20),
    suspiciousIPs: suspicious
  };
}

export function clearValidationLogs(): void {
  validationFailures.length = 0;
  suspiciousIPs.clear();
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, pattern] of suspiciousIPs.entries()) {
    if (now - pattern.lastFailure > SUSPICIOUS_WINDOW_MS * 2) {
      suspiciousIPs.delete(ip);
    }
  }
}, SUSPICIOUS_WINDOW_MS);
