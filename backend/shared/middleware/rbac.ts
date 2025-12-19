import { Request, Response, NextFunction } from 'express';
import { getUserRole } from '../utils/roleChecks.js';

type AllowedRoles = string | string[];

export function requireRole(allowedRoles: AllowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;

      if (!user || !user.id) {
        console.warn('requireRole: user not authenticated', {
          path: req.originalUrl,
          ip: req.ip,
          timestamp: new Date().toISOString()
        });
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const userRole = await getUserRole(user.id);

      if (!userRole) {
        console.warn('requireRole: user has no role', {
          userId: user.id,
          email: user.email,
          path: req.originalUrl,
          ip: req.ip,
          timestamp: new Date().toISOString()
        });
        res.status(403).json({ error: 'Forbidden: No valid role assigned' });
        return;
      }

      if (!roles.includes(userRole)) {
        console.warn('requireRole: Forbidden, access denied', {
          userId: user.id,
          email: user.email,
          path: req.originalUrl,
          userRole,
          requiredRoles: roles,
          ip: req.ip,
          timestamp: new Date().toISOString()
        });
        res.status(403).json({
          error: 'Forbidden: You do not have permission to perform this action.'
        });
        return;
      }

      if (req.user) {
        req.user.role = userRole;
      }

      console.info('requireRole: Access granted', {
        userId: user.id,
        email: user.email,
        path: req.originalUrl,
        userRole,
        ip: req.ip,
        timestamp: new Date().toISOString()
      });

      next();
    } catch (error: any) {
      console.error('requireRole middleware error', {
        error: error.message,
        stack: error.stack,
        path: req.originalUrl,
        ip: req.ip,
        timestamp: new Date().toISOString()
      });
      res.status(500).json({ error: 'Internal server error during role check.' });
    }
  };
}
