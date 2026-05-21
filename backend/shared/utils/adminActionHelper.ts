/**
 * Admin Action Helper Utility
 *
 * Simplifies admin action logging with standardized patterns.
 * Reduces boilerplate code in admin controllers.
 */

import { Request, Response } from 'express';
import { logAdminAction, type ActionType, type ResourceType } from '../services/supabase/repositories/adminActions.js';

/**
 * Admin action context extracted from request
 */
export interface AdminActionContext {
  adminUserId: string;
  ipAddress?: string;
  userAgent?: string;
  requestPath: string;
  requestMethod: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

/**
 * Extract admin context from request
 * Gets all necessary information for logging admin actions
 *
 * @param req - Express request object
 * @returns Admin action context
 */
export function extractAdminContext(req: Request): AdminActionContext {
  const userId = req.user?.id;
  if (!userId) {
    throw new Error('User ID not found in request');
  }

  // Get IP address from various possible sources
  const forwarded = req.headers['x-forwarded-for'];
  const ipAddress =
    typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : req.ip || req.socket.remoteAddress;

  return {
    adminUserId: userId,
    ipAddress,
    userAgent: req.headers['user-agent'],
    requestPath: req.path,
    requestMethod: req.method as AdminActionContext['requestMethod'],
  };
}

/**
 * Log successful admin action
 *
 * @param req - Express request object
 * @param actionType - Type of action performed
 * @param resourceType - Type of resource affected
 * @param details - Additional action details
 * @param resourceId - ID of the affected resource (optional)
 *
 * @example
 * await logSuccess(req, 'user_role_update', 'user', {
 *   oldRole: 'client',
 *   newRole: 'admin'
 * }, userId);
 */
export async function logSuccess(
  req: Request,
  actionType: ActionType,
  resourceType: ResourceType,
  details?: Record<string, any>,
  resourceId?: string
): Promise<void> {
  try {
    const context = extractAdminContext(req);

    await logAdminAction({
      ...context,
      actionType,
      resourceType,
      resourceId,
      actionDetails: details,
      success: true,
    });
  } catch (error) {
    console.error('Failed to log admin success:', error);
  }
}

/**
 * Log failed admin action
 *
 * @param req - Express request object
 * @param actionType - Type of action attempted
 * @param resourceType - Type of resource affected
 * @param error - Error that occurred
 * @param details - Additional action details (optional)
 * @param resourceId - ID of the affected resource (optional)
 *
 * @example
 * await logFailure(req, 'user_delete', 'user', error, { userId }, userId);
 */
export async function logFailure(
  req: Request,
  actionType: ActionType,
  resourceType: ResourceType,
  error: Error | string,
  details?: Record<string, any>,
  resourceId?: string
): Promise<void> {
  try {
    const context = extractAdminContext(req);
    const errorMessage = error instanceof Error ? error.message : error;

    await logAdminAction({
      ...context,
      actionType,
      resourceType,
      resourceId,
      actionDetails: details,
      success: false,
      errorMessage,
    });
  } catch (logError) {
    console.error('Failed to log admin failure:', logError);
  }
}

/**
 * Execute admin action with automatic logging
 *
 * Wraps an admin action to automatically log success or failure.
 * Reduces boilerplate by handling try/catch and logging automatically.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param actionType - Type of action to perform
 * @param resourceType - Type of resource affected
 * @param action - Async function to execute
 * @param options - Additional options
 *
 * @example
 * await withAdminAction(
 *   req,
 *   res,
 *   'user_role_update',
 *   'user',
 *   async () => {
 *     const result = await userService.updateRole(userId, newRole);
 *     res.json(result);
 *     return { resourceId: userId, details: { newRole } };
 *   }
 * );
 */
export async function withAdminAction(
  req: Request,
  _res: Response,
  actionType: ActionType,
  resourceType: ResourceType,
  action: () => Promise<{
    resourceId?: string;
    details?: Record<string, any>;
  } | void>
): Promise<void> {
  try {
    // Execute the action
    const result = await action();

    // Log success
    await logSuccess(
      req,
      actionType,
      resourceType,
      result?.details,
      result?.resourceId
    );
  } catch (error) {
    // Log failure
    await logFailure(
      req,
      actionType,
      resourceType,
      error as Error,
      undefined,
      undefined
    );

    // Re-throw the error for controller error handling
    throw error;
  }
}

/**
 * Higher-order function to wrap controller methods with admin action logging
 *
 * @param actionType - Type of action performed
 * @param resourceType - Type of resource affected
 * @param extractResourceId - Function to extract resource ID from request (optional)
 * @param extractDetails - Function to extract action details from request (optional)
 * @returns Decorator function
 *
 * @example
 * const deleteUser = adminAction(
 *   'user_delete',
 *   'user',
 *   (req) => req.params.id
 * )(async (req, _res) => {
 *   await userService.deleteUser(req.params.id);
 *   res.json({ success: true });
 * });
 */
export function adminAction(
  actionType: ActionType,
  resourceType: ResourceType,
  extractResourceId?: (req: Request) => string | undefined,
  extractDetails?: (req: Request) => Record<string, any> | undefined
) {
  return (
    handler: (req: Request, res: Response) => Promise<void>
  ) => {
    return async (req: Request, res: Response): Promise<void> => {
      const resourceId = extractResourceId?.(req);
      const details = extractDetails?.(req);

      try {
        // Execute the handler
        await handler(req, _res);

        // Log success
        await logSuccess(req, actionType, resourceType, details, resourceId);
      } catch (error) {
        // Log failure
        await logFailure(
          req,
          actionType,
          resourceType,
          error as Error,
          details,
          resourceId
        );

        // Re-throw the error
        throw error;
      }
    };
  };
}

/**
 * Infer action type from method name
 * Useful for automated logging based on naming conventions
 *
 * @param methodName - Name of the controller method
 * @returns Inferred action type
 *
 * @example
 * extractActionType('getUserById') // 'user_view'
 * extractActionType('deleteError') // 'error_delete'
 */
export function extractActionType(methodName: string): string {
  // Convert camelCase to snake_case
  const snakeCase = methodName
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');

  // Remove common prefixes
  const withoutPrefix = snakeCase
    .replace(/^(get|fetch|load|retrieve)_/, '')
    .replace(/^(create|add|insert)_/, 'create_')
    .replace(/^(update|modify|edit|change)_/, 'update_')
    .replace(/^(delete|remove)_/, 'delete_')
    .replace(/^(list|get_all)_/, 'view_');

  return withoutPrefix;
}
