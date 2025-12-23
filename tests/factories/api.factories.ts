/**
 * API Response Factories
 *
 * Factory functions for generating test API response objects.
 * Used for mocking API responses in frontend tests.
 */

import type { ApiResponse, PaginatedResponse } from '@shared/types/api';

/**
 * API Response Factory
 * Creates standard API response objects
 */
export const APIResponseFactory = {
  /**
   * Build a successful API response
   */
  success<T>(data: T): ApiResponse<T> {
    return {
      data,
      error: null,
    };
  },

  /**
   * Build an error API response
   */
  error(message: string, status: number = 500): ApiResponse {
    return {
      data: null,
      error: {
        message,
        status,
        statusText: status === 404 ? 'Not Found' : status === 401 ? 'Unauthorized' : 'Internal Server Error',
      },
    };
  },

  /**
   * Build a paginated API response
   */
  paginated<T>(
    items: T[],
    page: number = 1,
    pageSize: number = 10,
    total?: number
  ): PaginatedResponse<T> {
    const actualTotal = total ?? items.length;
    return {
      data: items,
      pagination: {
        page,
        pageSize,
        total: actualTotal,
        totalPages: Math.ceil(actualTotal / pageSize),
      },
      error: null,
    };
  },

  /**
   * Build a validation error response
   */
  validationError(errors: Record<string, string>): ApiResponse {
    return {
      data: null,
      error: {
        message: 'Validation failed',
        status: 400,
        statusText: 'Bad Request',
        errors,
      },
    };
  },

  /**
   * Build an unauthorized error response
   */
  unauthorized(message: string = 'Authentication required'): ApiResponse {
    return APIResponseFactory.error(message, 401);
  },

  /**
   * Build a forbidden error response
   */
  forbidden(message: string = 'Access denied'): ApiResponse {
    return APIResponseFactory.error(message, 403);
  },

  /**
   * Build a not found error response
   */
  notFound(resource: string = 'Resource'): ApiResponse {
    return APIResponseFactory.error(`${resource} not found`, 404);
  },
};

/**
 * System Health Factory
 * Creates test system health data
 */
export const SystemHealthFactory = {
  /**
   * Build a healthy system response
   */
  buildHealthy(overrides?: any): any {
    return {
      status: 'healthy',
      uptime: 99.9,
      errors: {
        last24h: 0,
        bySeverity: {
          critical: 0,
          error: 0,
          warning: 0,
        },
      },
      database: {
        connected: true,
        latency: 15,
      },
      orchestrator: {
        running: true,
        lastRun: new Date().toISOString(),
      },
      ...overrides,
    };
  },

  /**
   * Build a degraded system response
   */
  buildDegraded(overrides?: any): any {
    return SystemHealthFactory.buildHealthy({
      status: 'degraded',
      errors: {
        last24h: 5,
        bySeverity: {
          critical: 0,
          error: 3,
          warning: 2,
        },
      },
      ...overrides,
    });
  },

  /**
   * Build an unhealthy system response
   */
  buildUnhealthy(overrides?: any): any {
    return SystemHealthFactory.buildHealthy({
      status: 'unhealthy',
      errors: {
        last24h: 25,
        bySeverity: {
          critical: 5,
          error: 15,
          warning: 5,
        },
      },
      database: {
        connected: false,
        latency: 0,
      },
      ...overrides,
    });
  },
};

/**
 * Proposals Response Factory
 * Creates test proposals API responses
 */
export const ProposalsResponseFactory = {
  /**
   * Build a proposals list response
   */
  buildList(proposals: any[], pagination?: any): any {
    return {
      proposals,
      pagination: pagination || {
        page: 1,
        pageSize: 10,
        total: proposals.length,
        totalPages: Math.ceil(proposals.length / 10),
      },
    };
  },

  /**
   * Build a single proposal response
   */
  buildSingle(proposal: any): any {
    return {
      proposal,
    };
  },

  /**
   * Build a proposal creation response
   */
  buildCreated(proposal: any): any {
    return {
      success: true,
      proposal,
      message: 'Proposal created successfully',
    };
  },

  /**
   * Build a vote response
   */
  buildVoteResponse(success: boolean = true): any {
    return {
      success,
      message: success ? 'Vote recorded successfully' : 'Vote failed',
    };
  },
};

/**
 * Topic Response Factory
 * Creates test topic API responses
 */
export const TopicResponseFactory = {
  /**
   * Build a topic with details response
   */
  buildWithDetails(topic: any, proposal?: any, messages?: any[]): any {
    return {
      topic,
      proposal: proposal || null,
      messages: messages || [],
    };
  },

  /**
   * Build a topic list response
   */
  buildList(topics: any[]): any {
    return {
      topics,
    };
  },
};

/**
 * Error Response Factory
 * Creates test error log API responses
 */
export const ErrorResponseFactory = {
  /**
   * Build an errors list response
   */
  buildList(errors: any[], total?: number, pagination?: any): any {
    return {
      errors,
      total: total ?? errors.length,
      pagination: pagination || {
        limit: 50,
        offset: 0,
        total: total ?? errors.length,
      },
    };
  },

  /**
   * Build an error details response
   */
  buildDetails(error: any): any {
    return {
      error,
    };
  },

  /**
   * Build a cleanup response
   */
  buildCleanupResponse(deleted: number): any {
    return {
      success: true,
      deleted,
      message: `${deleted} error logs deleted`,
    };
  },
};

/**
 * Admin Action Response Factory
 * Creates test admin action audit responses
 */
export const AdminActionResponseFactory = {
  /**
   * Build an admin actions list response
   */
  buildList(actions: any[], pagination?: any): any {
    return {
      actions,
      pagination: pagination || {
        page: 1,
        pageSize: 50,
        total: actions.length,
        totalPages: Math.ceil(actions.length / 50),
      },
    };
  },

  /**
   * Build an action success response
   */
  buildSuccess(message: string = 'Action completed successfully'): any {
    return {
      success: true,
      message,
    };
  },

  /**
   * Build an action failure response
   */
  buildFailure(message: string = 'Action failed', details?: any): any {
    return {
      success: false,
      message,
      details,
    };
  },
};

/**
 * Rate Limit Response Factory
 * Creates test rate limit API responses
 */
export const RateLimitResponseFactory = {
  /**
   * Build a rate limits list response
   */
  buildList(limits: any[]): any {
    return {
      active_limits: limits,
      total: limits.length,
    };
  },

  /**
   * Build a rate limit exceeded response
   */
  buildExceeded(retryAfter: number = 60): any {
    return {
      error: 'Rate limit exceeded',
      retry_after: retryAfter,
      message: `Too many requests. Please try again in ${retryAfter} seconds.`,
    };
  },

  /**
   * Build a clear rate limits response
   */
  buildClearResponse(cleared: number): any {
    return {
      success: true,
      cleared,
      message: `${cleared} rate limit entries cleared`,
    };
  },
};

/**
 * Home Data Factory
 * Creates test home page data (for website)
 */
export const HomeDataFactory = {
  /**
   * Build idle home data
   */
  buildIdle(): any {
    return {
      status: 'idle',
      activeProposal: null,
      recentProposals: [],
      stats: {
        totalProposals: 0,
        activeDebates: 0,
        adoptedProposals: 0,
      },
    };
  },

  /**
   * Build active home data
   */
  buildActive(proposal: any, messages?: any[]): any {
    return {
      status: 'active',
      activeProposal: proposal,
      currentPhase: 'debate',
      messages: messages || [],
      recentProposals: [],
      stats: {
        totalProposals: 1,
        activeDebates: 1,
        adoptedProposals: 0,
      },
    };
  },

  /**
   * Build complete home data
   */
  build(overrides?: any): any {
    return {
      status: 'active',
      activeProposal: null,
      currentPhase: null,
      messages: [],
      recentProposals: [],
      stats: {
        totalProposals: 0,
        activeDebates: 0,
        adoptedProposals: 0,
      },
      ...overrides,
    };
  },
};
