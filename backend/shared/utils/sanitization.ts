import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

const window = new JSDOM('').window;
const purify = DOMPurify(window as any);

export interface SanitizationOptions {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  maxLength?: number;
}

const DEFAULT_MAX_LENGTH = 10000;

export function sanitizeHtml(
  dirty: string,
  options: SanitizationOptions = {}
): string {
  const maxLength = options.maxLength || DEFAULT_MAX_LENGTH;

  if (dirty.length > maxLength) {
    throw new Error(`Input exceeds maximum length of ${maxLength} characters`);
  }

  const config: any = {};

  if (options.allowedTags) {
    config.ALLOWED_TAGS = options.allowedTags;
  }

  if (options.allowedAttributes) {
    config.ALLOWED_ATTR = Object.values(options.allowedAttributes).flat();
  }

  const result = purify.sanitize(dirty, config);
  return String(result);
}

export function sanitizeText(dirty: string, maxLength = DEFAULT_MAX_LENGTH): string {
  if (dirty.length > maxLength) {
    throw new Error(`Input exceeds maximum length of ${maxLength} characters`);
  }

  const result = purify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
  return String(result);
}

export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  options: SanitizationOptions = {}
): T {
  const sanitized: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value, options.maxLength);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value, options);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'string'
          ? sanitizeText(item, options.maxLength)
          : item && typeof item === 'object'
          ? sanitizeObject(item, options)
          : item
      );
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

export function sanitizeQueryParam(value: string | string[]): string | string[] {
  if (Array.isArray(value)) {
    return value.map((v) => sanitizeText(v, 1000));
  }
  return sanitizeText(value, 1000);
}
