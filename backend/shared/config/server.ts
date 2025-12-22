/**
 * Server configuration constants
 */

/**
 * Required environment variables for the server to start
 */
export const REQUIRED_ENV_VARS = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ANTHROPIC_API_KEY',
  'OPENAI_API_KEY',
  'GROK_API_KEY',
  'GEMINI_API_KEY',
  'DEEPSEEK_API_KEY',
  'QWEN_API_KEY'
] as const;

/**
 * Optional environment variables
 */
export const OPTIONAL_ENV_VARS = [
  'ADMIN_WHITELISTED_IPS'
] as const;

/**
 * Default port for the server
 */
export const DEFAULT_PORT = 3001;

/**
 * Maximum size for request bodies
 */
export const REQUEST_BODY_LIMIT = '1mb';

/**
 * Default allowed origins for CORS
 */
export const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'http://localhost:4173'
] as const;

/**
 * HSTS (HTTP Strict Transport Security) configuration
 */
export const HSTS_CONFIG = {
  maxAge: 31536000,
  includeSubDomains: true
} as const;

/**
 * Content Security Policy directives
 */
export const CSP_DIRECTIVES = {
  defaultSrc: "'self'",
  scriptSrc: "'self' 'unsafe-inline' 'unsafe-eval'",
  styleSrc: "'self' 'unsafe-inline'",
  imgSrc: "'self' data: https:",
  fontSrc: "'self' data:",
  connectSrc: "'self' https://*.supabase.co wss://*.supabase.co",
  frameAncestors: "'none'",
  baseUri: "'self'",
  formAction: "'self'"
} as const;

/**
 * Builds the Content-Security-Policy header value from directives
 */
export function buildCSPHeader(): string {
  return [
    `default-src ${CSP_DIRECTIVES.defaultSrc}`,
    `script-src ${CSP_DIRECTIVES.scriptSrc}`,
    `style-src ${CSP_DIRECTIVES.styleSrc}`,
    `img-src ${CSP_DIRECTIVES.imgSrc}`,
    `font-src ${CSP_DIRECTIVES.fontSrc}`,
    `connect-src ${CSP_DIRECTIVES.connectSrc}`,
    `frame-ancestors ${CSP_DIRECTIVES.frameAncestors}`,
    `base-uri ${CSP_DIRECTIVES.baseUri}`,
    `form-action ${CSP_DIRECTIVES.formAction}`
  ].join('; ');
}

/**
 * Builds the HSTS header value
 */
export function buildHSTSHeader(): string {
  const { maxAge, includeSubDomains } = HSTS_CONFIG;
  return `max-age=${maxAge}${includeSubDomains ? '; includeSubDomains' : ''}`;
}

/**
 * Gets the list of allowed origins from environment or defaults
 */
export function getAllowedOrigins(): string[] {
  if (process.env.ALLOWED_ORIGINS) {
    return process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
  }
  return [...DEFAULT_ALLOWED_ORIGINS];
}

/**
 * Gets the server port from environment or default
 */
export function getServerPort(): number {
  return process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_PORT;
}
