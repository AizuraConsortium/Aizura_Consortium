/**
 * User Context Middleware
 *
 * Extracts and validates user context after authentication.
 * Eliminates redundant user ID checks in controllers.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Extended Express Request with userId shortcut
 */
export interface UserContextRequest extends Request {
  userId: string;
}

/**
 * Require User ID Middleware
 *
 * Ensures that req.user.id exists after authentication middleware.
 * Sets req.userId for convenient access in controllers.
 * Returns 401 if user ID is missing.
 *
 * Should be used after requireAuth middleware.
 *
 * @example
 * router.post('/items',
 *   requireAuth,
 *   requireUserId(),
 *   controller.createItem
 * );
 */
export function requireUserId() {
  return (req: Request, _res: Response, next: NextFunction): void => {
    // Check if user exists and has an ID
    if (!req.user || !req.user.id) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User ID not found in request. Please authenticate.',
      });
      return;
    }

    // Set userId for convenient access
    (req as UserContextRequest).userId = req.user.id;

    next();
  };
}

/**
 * Optional User ID Middleware
 *
 * Sets req.userId if user is authenticated, but doesn't require it.
 * Useful for endpoints that work differently for authenticated vs anonymous users.
 *
 * @example
 * router.get('/items',
 *   optionalUserId(),
 *   controller.getItems // Can check if req.userId exists
 * );
 */
export function optionalUserId() {
  return (req: Request, _res: Response, next: NextFunction): void => {
    // Set userId if available
    if (req.user && req.user.id) {
      (req as UserContextRequest).userId = req.user.id;
    }

    next();
  };
}

/**
 * Require Specific User or Admin
 *
 * Ensures the authenticated user is either the owner of a resource or an admin.
 * Useful for endpoints where users can only access their own data unless they're admin.
 *
 * @param getResourceUserId - Function to extract the resource owner's user ID from request
 * @returns Express middleware function
 *
 * @example
 * router.get('/users/:id/profile',
 *   requireAuth,
 *   requireUserOrAdmin((req) => req.params.id),
 *   controller.getProfile
 * );
 */
export function requireUserOrAdmin(
  getResourceUserId: (req: Request) => string
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.id) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User ID not found in request.',
      });
      return;
    }

    const resourceUserId = getResourceUserId(req);
    const isOwner = req.user.id === resourceUserId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to access this resource.',
      });
      return;
    }

    // Set userId for convenient access
    (req as UserContextRequest).userId = req.user.id;

    next();
  };
}
