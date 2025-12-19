import { Request, Response, NextFunction } from 'express';

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

function getWhitelistedIPs(): string[] {
  const whitelistEnv = process.env.ADMIN_WHITELISTED_IPS || '';

  if (!whitelistEnv) {
    console.warn('ADMIN_WHITELISTED_IPS not configured. No IPs are whitelisted.');
    return [];
  }

  return whitelistEnv
    .split(',')
    .map(ip => ip.trim())
    .filter(ip => ip.length > 0);
}

export function requireWhitelistedIP(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const clientIp = getClientIp(req);
  const whitelistedIPs = getWhitelistedIPs();

  if (whitelistedIPs.length === 0) {
    console.error('IP whitelist check: No whitelisted IPs configured', {
      clientIp,
      path: req.originalUrl,
      timestamp: new Date().toISOString()
    });
    res.status(403).json({
      error: 'Forbidden: IP whitelist not configured'
    });
    return;
  }

  const isWhitelisted = whitelistedIPs.some(whitelistedIp => {
    if (whitelistedIp === clientIp) return true;

    if (whitelistedIp.includes('/')) {
      return false;
    }

    if (clientIp.startsWith('::ffff:')) {
      const ipv4 = clientIp.substring(7);
      return whitelistedIp === ipv4;
    }

    return false;
  });

  if (!isWhitelisted) {
    console.warn('IP whitelist check: Access denied', {
      clientIp,
      whitelistedIPs,
      path: req.originalUrl,
      user: req.user?.email || 'unknown',
      timestamp: new Date().toISOString()
    });
    res.status(403).json({
      error: 'Forbidden: Access denied from your IP address'
    });
    return;
  }

  console.info('IP whitelist check: Access granted', {
    clientIp,
    path: req.originalUrl,
    user: req.user?.email || 'unknown',
    timestamp: new Date().toISOString()
  });

  next();
}
