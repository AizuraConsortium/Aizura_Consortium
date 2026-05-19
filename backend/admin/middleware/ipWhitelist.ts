import { Request, Response, NextFunction } from 'express';

function getClientIp(req: Request): string {
  // Rely on Express's trust-proxy resolution (see app.set('trust proxy', 1)
  // in backend/index.ts). With one trusted hop, req.ip is the rightmost
  // entry in X-Forwarded-For — the IP nginx itself observed and appended —
  // not a value the client can forge by sending its own XFF header.
  if (req.ip) return req.ip;

  // Fallback: X-Real-IP is set by nginx from $remote_addr and cannot be
  // forged by the client (nginx overwrites, not appends).
  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    const ip = Array.isArray(realIp) ? realIp[0] : realIp;
    if (ip) return ip;
  }

  return req.socket.remoteAddress || 'unknown';
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
