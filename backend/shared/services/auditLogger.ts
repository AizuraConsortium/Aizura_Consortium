/**
 * Audit Logger Service
 *
 * Records business events and user actions for audit trail.
 */

import { SupabaseService } from './supabase/index.js';

/**
 * Audit event types
 */
export type AuditEventType =
  | 'PROPOSAL_CREATED'
  | 'PROPOSAL_APPROVED'
  | 'PROPOSAL_REJECTED'
  | 'TOPIC_CREATED'
  | 'TOPIC_STATE_CHANGED'
  | 'VOTE_CAST'
  | 'PLAN_CREATED'
  | 'PLAN_UPDATED'
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'ADMIN_ACTION'
  | 'ORCHESTRATOR_STARTED'
  | 'ORCHESTRATOR_STOPPED'
  | 'SYSTEM_CONFIG_CHANGED';

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  eventType: AuditEventType;
  userId?: string;
  resourceType: string;
  resourceId?: string;
  action: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

/**
 * Audit Logger Service
 *
 * Logs important business events and user actions to database
 * for compliance and audit trail purposes.
 */
export class AuditLogger {
  private static instance: AuditLogger | null = null;
  private supabase: SupabaseService;

  private constructor() {
    this.supabase = SupabaseService.getInstance();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  /**
   * Log audit event
   *
   * @param entry - Audit log entry
   */
  async logEvent(entry: AuditLogEntry): Promise<void> {
    try {
      // Also log to console in JSON format
      console.log(JSON.stringify({
        type: 'AUDIT_EVENT',
        ...entry,
      }));

      // In production, you would also store in database
      // For now, we just log to console
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Don't throw - audit logging should never break the app
    }
  }

  /**
   * Log proposal event
   */
  async logProposalEvent(
    action: 'created' | 'approved' | 'rejected' | 'updated',
    proposalId: string,
    userId: string,
    details?: Record<string, any>
  ): Promise<void> {
    const eventTypeMap = {
      created: 'PROPOSAL_CREATED' as const,
      approved: 'PROPOSAL_APPROVED' as const,
      rejected: 'PROPOSAL_REJECTED' as const,
      updated: 'PROPOSAL_CREATED' as const, // Use created for updates
    };

    await this.logEvent({
      eventType: eventTypeMap[action],
      userId,
      resourceType: 'proposal',
      resourceId: proposalId,
      action,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log topic event
   */
  async logTopicEvent(
    action: 'created' | 'state_changed',
    topicId: string,
    userId?: string,
    details?: Record<string, any>
  ): Promise<void> {
    const eventType = action === 'created'
      ? 'TOPIC_CREATED' as const
      : 'TOPIC_STATE_CHANGED' as const;

    await this.logEvent({
      eventType,
      userId,
      resourceType: 'topic',
      resourceId: topicId,
      action,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log vote event
   */
  async logVoteEvent(
    voteId: string,
    proposalId: string,
    userId: string,
    voteValue: string,
    details?: Record<string, any>
  ): Promise<void> {
    await this.logEvent({
      eventType: 'VOTE_CAST',
      userId,
      resourceType: 'vote',
      resourceId: voteId,
      action: 'cast',
      details: {
        proposalId,
        vote: voteValue,
        ...details,
      },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log plan event
   */
  async logPlanEvent(
    action: 'created' | 'updated',
    planId: string,
    topicId: string,
    userId?: string,
    details?: Record<string, any>
  ): Promise<void> {
    const eventType = action === 'created'
      ? 'PLAN_CREATED' as const
      : 'PLAN_UPDATED' as const;

    await this.logEvent({
      eventType,
      userId,
      resourceType: 'plan',
      resourceId: planId,
      action,
      details: {
        topicId,
        ...details,
      },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log user authentication event
   */
  async logAuthEvent(
    action: 'login' | 'logout',
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    const eventType = action === 'login'
      ? 'USER_LOGIN' as const
      : 'USER_LOGOUT' as const;

    await this.logEvent({
      eventType,
      userId,
      resourceType: 'user',
      resourceId: userId,
      action,
      ipAddress,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log admin action
   */
  async logAdminAction(
    action: string,
    userId: string,
    resourceType: string,
    resourceId?: string,
    details?: Record<string, any>,
    ipAddress?: string
  ): Promise<void> {
    await this.logEvent({
      eventType: 'ADMIN_ACTION',
      userId,
      resourceType,
      resourceId,
      action,
      details,
      ipAddress,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log orchestrator event
   */
  async logOrchestratorEvent(
    action: 'started' | 'stopped',
    userId?: string,
    details?: Record<string, any>
  ): Promise<void> {
    const eventType = action === 'started'
      ? 'ORCHESTRATOR_STARTED' as const
      : 'ORCHESTRATOR_STOPPED' as const;

    await this.logEvent({
      eventType,
      userId,
      resourceType: 'orchestrator',
      action,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log system configuration change
   */
  async logConfigChange(
    configKey: string,
    oldValue: any,
    newValue: any,
    userId: string
  ): Promise<void> {
    await this.logEvent({
      eventType: 'SYSTEM_CONFIG_CHANGED',
      userId,
      resourceType: 'system_config',
      resourceId: configKey,
      action: 'updated',
      details: {
        oldValue,
        newValue,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
