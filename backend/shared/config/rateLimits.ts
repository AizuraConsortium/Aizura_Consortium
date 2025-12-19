export interface RateLimitConfig {
  maxRequests: number;
  windowMinutes: number;
  description?: string;
}

export const RATE_LIMIT_CONFIG: Record<string, RateLimitConfig> = {
  'GET:/api/home': {
    maxRequests: 60,
    windowMinutes: 1,
    description: 'High traffic landing page, allows frequent refreshes'
  },
  'GET:/api/room/:topicId/messages': {
    maxRequests: 30,
    windowMinutes: 1,
    description: 'Paginated message viewing, moderate usage'
  },
  'GET:/api/plan/:topicId': {
    maxRequests: 30,
    windowMinutes: 1,
    description: 'Document viewer, moderate usage'
  },
  'GET:/api/proposals': {
    maxRequests: 60,
    windowMinutes: 1,
    description: 'Public proposal listing, high traffic'
  },
  'POST:/api/proposals': {
    maxRequests: 10,
    windowMinutes: 1,
    description: 'Proposal creation, prevent spam submissions'
  },
  'POST:/api/proposals/:proposalId/vote': {
    maxRequests: 20,
    windowMinutes: 1,
    description: 'Voting endpoint, prevent vote manipulation'
  },
  'GET:/api/system/health': {
    maxRequests: 120,
    windowMinutes: 1,
    description: 'Health checks are frequent, allow high rate'
  },
  'GET:/health': {
    maxRequests: 120,
    windowMinutes: 1,
    description: 'Main health check endpoint for monitoring systems'
  },
  'GET:/api/errors/recent': {
    maxRequests: 30,
    windowMinutes: 1,
    description: 'Public error viewing, moderate usage'
  },
  'POST:/api/errors/log': {
    maxRequests: 100,
    windowMinutes: 1,
    description: 'Frontend error logging from all apps (admin, client, website), spikes are normal during issues'
  },
  'GET:/api/errors/admin': {
    maxRequests: 60,
    windowMinutes: 1,
    description: 'Admin error viewing with pagination'
  },
  'DELETE:/api/errors/admin/:id': {
    maxRequests: 30,
    windowMinutes: 1,
    description: 'Admin delete actions, moderate rate'
  },
  'DELETE:/api/errors/admin/cleanup': {
    maxRequests: 10,
    windowMinutes: 1,
    description: 'Heavy cleanup operation, low rate'
  },
  'POST:/webhook/proposal': {
    maxRequests: 100,
    windowMinutes: 1,
    description: 'Webhook endpoint for external integrations'
  },
  'GET:/api/system/rate-limits': {
    maxRequests: 30,
    windowMinutes: 1,
    description: 'Admin rate limit monitoring'
  },
  'GET:/api/system/rate-limits/:identifier': {
    maxRequests: 30,
    windowMinutes: 1,
    description: 'Admin rate limit details for specific identifier'
  }
};

export function getRateLimitForEndpoint(endpoint: string): RateLimitConfig {
  const config = RATE_LIMIT_CONFIG[endpoint];
  if (!config) {
    return {
      maxRequests: 60,
      windowMinutes: 1,
      description: 'Default rate limit for unconfigured endpoints'
    };
  }
  return config;
}

export function normalizeEndpoint(method: string, path: string): string {
  const normalizedPath = path
    .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
    .replace(/\/\d+/g, '/:id')
    .replace(/\/[^/]+$/g, (match) => {
      if (match.includes('-') || match.length > 20) {
        return '/:id';
      }
      return match;
    });

  return `${method.toUpperCase()}:${normalizedPath}`;
}
