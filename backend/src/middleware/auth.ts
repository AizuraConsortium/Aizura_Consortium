import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { User } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

declare global {
  namespace Express {
    interface Request {
      user?: User & {
        token?: string;
        role?: string;
        aal?: string;
      };
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/^Bearer (.+)$/);
    const token = match ? match[1] : null;

    if (!token) {
      console.warn('Missing Authorization token', {
        path: req.originalUrl,
        ip: req.ip,
        timestamp: new Date().toISOString()
      });
      res.status(401).json({ error: 'Missing Authorization token' });
      return;
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      console.warn('Invalid or expired token', {
        error: error?.message,
        path: req.originalUrl,
        ip: req.ip,
        timestamp: new Date().toISOString()
      });
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    req.user = {
      ...data.user,
      token
    };

    next();
  } catch (error: any) {
    console.error('requireAuth middleware error', {
      error: error.message,
      stack: error.stack,
      path: req.originalUrl,
      ip: req.ip,
      timestamp: new Date().toISOString()
    });
    res.status(401).json({ error: 'Authentication failed' });
  }
}
