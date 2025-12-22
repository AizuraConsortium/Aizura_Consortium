import { Request, Response, NextFunction } from 'express';
import { logAdminAction, type ActionType, type ResourceType, type LogAdminActionParams } from '../services/supabase/repositories/adminActions.js';

declare global {
  namespace Express {
    interface Request {
      logAdminAction?: (params: {
        actionType: ActionType;
        resourceType: ResourceType;
        resourceId?: string;
        actionDetails?: Record<string, any>;
        success?: boolean;
        errorMessage?: string;
      }) => Promise<void>;
    }
  }
}

function getClientIp(req: Request): string {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    const ips = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
    return ips.split(',')[0].trim();
  }
  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return Array.isArray(realIp) ? realIp[0] : realIp;
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

export function adminActionLogger(req: Request, res: Response, next: NextFunction): void {
  const adminUserId = req.user?.id;
  const ipAddress = getClientIp(req);
  const userAgent = req.headers['user-agent'];
  const requestPath = req.path;
  const requestMethod = req.method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

  req.logAdminAction = async (params) => {
    if (!adminUserId) {
      console.warn('Attempted to log admin action without admin user ID');
      return;
    }

    const logParams: LogAdminActionParams = {
      adminUserId,
      actionType: params.actionType,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      actionDetails: params.actionDetails,
      ipAddress,
      userAgent,
      requestPath,
      requestMethod,
      success: params.success,
      errorMessage: params.errorMessage
    };

    await logAdminAction(logParams);
  };

  next();
}
