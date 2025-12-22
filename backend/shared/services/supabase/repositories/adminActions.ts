import { create, query } from '../queryBuilder.js';
import type { Database } from '../../../../../shared/types/database.types.js';

type AdminAction = Database['public']['Tables']['admin_actions']['Row'];
type AdminActionInsert = Database['public']['Tables']['admin_actions']['Insert'];

export type ActionType =
  | 'error_delete'
  | 'error_bulk_cleanup'
  | 'rate_limit_clear'
  | 'rate_limit_view'
  | 'user_role_update'
  | 'user_create'
  | 'user_view'
  | 'user_delete'
  | 'orchestrator_start'
  | 'orchestrator_stop'
  | 'orchestrator_pause'
  | 'orchestrator_resume'
  | 'orchestrator_status'
  | 'system_health_check'
  | 'system_config_update';

export type ResourceType = 'error_log' | 'rate_limit' | 'user' | 'orchestrator' | 'system';

export interface LogAdminActionParams {
  adminUserId: string;
  actionType: ActionType;
  resourceType: ResourceType;
  resourceId?: string;
  actionDetails?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  requestPath?: string;
  requestMethod?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  success?: boolean;
  errorMessage?: string;
}

export interface AdminActionFilters {
  adminUserId?: string;
  actionType?: ActionType;
  resourceType?: ResourceType;
  success?: boolean;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface PaginatedAdminActions {
  actions: AdminAction[];
  total: number;
  limit: number;
  offset: number;
}

function sanitizeDetails(details: Record<string, any>): Record<string, any> {
  const sanitized = { ...details };
  const sensitiveKeys = ['password', 'token', 'secret', 'api_key', 'apiKey', 'access_token', 'refresh_token'];

  for (const key of sensitiveKeys) {
    if (key in sanitized) {
      sanitized[key] = '***REDACTED***';
    }
  }

  return sanitized;
}

export async function logAdminAction(params: LogAdminActionParams): Promise<void> {
  try {
    const sanitizedDetails = params.actionDetails ? sanitizeDetails(params.actionDetails) : {};

    const actionData: AdminActionInsert = {
      admin_user_id: params.adminUserId,
      action_type: params.actionType,
      resource_type: params.resourceType,
      resource_id: params.resourceId || null,
      action_details: sanitizedDetails,
      ip_address: params.ipAddress || null,
      user_agent: params.userAgent ? params.userAgent.substring(0, 500) : null,
      request_path: params.requestPath || null,
      request_method: params.requestMethod || null,
      success: params.success !== undefined ? params.success : true,
      error_message: params.errorMessage || null,
    };

    await create<AdminAction>('admin_actions', actionData);

    console.info('Admin action logged:', {
      adminUserId: params.adminUserId,
      actionType: params.actionType,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      success: params.success !== false,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log admin action:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      params: {
        adminUserId: params.adminUserId,
        actionType: params.actionType,
        resourceType: params.resourceType
      }
    });
  }
}

export async function getAdminActions(filters: AdminActionFilters = {}): Promise<PaginatedAdminActions> {
  let queryBuilder = query('admin_actions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (filters.adminUserId) {
    queryBuilder = queryBuilder.eq('admin_user_id', filters.adminUserId);
  }

  if (filters.actionType) {
    queryBuilder = queryBuilder.eq('action_type', filters.actionType);
  }

  if (filters.resourceType) {
    queryBuilder = queryBuilder.eq('resource_type', filters.resourceType);
  }

  if (filters.success !== undefined) {
    queryBuilder = queryBuilder.eq('success', filters.success);
  }

  if (filters.startDate) {
    queryBuilder = queryBuilder.gte('created_at', filters.startDate);
  }

  if (filters.endDate) {
    queryBuilder = queryBuilder.lte('created_at', filters.endDate);
  }

  const limit = filters.limit || 50;
  const offset = filters.offset || 0;
  queryBuilder = queryBuilder.range(offset, offset + limit - 1);

  const { data, error, count } = await queryBuilder;

  if (error) throw error;

  return {
    actions: data || [],
    total: count || 0,
    limit,
    offset
  };
}

export async function getAdminActionStats(hours: number = 24): Promise<{
  total: number;
  successful: number;
  failed: number;
  byType: Record<string, number>;
  byUser: Record<string, number>;
}> {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

  const { data, error } = await query('admin_actions')
    .select('action_type, admin_user_id, success')
    .gte('created_at', since);

  if (error) throw error;

  const stats = {
    total: data?.length || 0,
    successful: data?.filter(a => a.success).length || 0,
    failed: data?.filter(a => !a.success).length || 0,
    byType: {} as Record<string, number>,
    byUser: {} as Record<string, number>
  };

  data?.forEach(action => {
    stats.byType[action.action_type] = (stats.byType[action.action_type] || 0) + 1;
    stats.byUser[action.admin_user_id] = (stats.byUser[action.admin_user_id] || 0) + 1;
  });

  return stats;
}
