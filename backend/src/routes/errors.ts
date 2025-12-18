import express from 'express';
import { SupabaseService } from '../services/supabase.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { requireWhitelistedIP } from '../middleware/ipWhitelist.js';
import { ErrorLogger } from '../services/errorLogger.js';

const router = express.Router();
const supabase = SupabaseService.getInstance();
const errorLogger = ErrorLogger.getInstance();

router.get('/recent', async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: errors, error } = await supabase
      .getClient()
      .from('error_logs')
      .select('id, source, severity, error_type, message, created_at, agent_id')
      .gte('created_at', twentyFourHoursAgo)
      .in('severity', ['info', 'warning'])
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching recent errors:', error);
      return res.status(500).json({ error: 'Failed to fetch recent errors' });
    }

    res.json({
      errors: errors || [],
      count: errors?.length || 0
    });
  } catch (error) {
    console.error('Recent errors endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/log', async (req, res) => {
  try {
    const { source, severity, agentId, errorType, message, details, topicId } = req.body;

    if (!source || !errorType || !message) {
      return res.status(400).json({
        error: 'Missing required fields: source, errorType, message'
      });
    }

    if (!['frontend', 'backend', 'agent'].includes(source)) {
      return res.status(400).json({
        error: 'Invalid source. Must be: frontend, backend, or agent'
      });
    }

    if (severity && !['info', 'warning', 'error', 'critical'].includes(severity)) {
      return res.status(400).json({
        error: 'Invalid severity. Must be: info, warning, error, or critical'
      });
    }

    await errorLogger.logError({
      source,
      severity: severity || 'error',
      agentId: agentId || undefined,
      errorType,
      message,
      details: details || {},
      topicId: topicId || undefined
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error logging error:', error);
    res.status(500).json({ error: 'Failed to log error' });
  }
});

router.get('/admin', requireAuth, requireRole('admin'), requireWhitelistedIP, async (req, res) => {
  try {
    const {
      source,
      severity,
      agentId,
      startDate,
      endDate,
      limit = '100',
      offset = '0'
    } = req.query;

    let query = supabase
      .getClient()
      .from('error_logs')
      .select('*', { count: 'exact' });

    if (source) {
      query = query.eq('source', source);
    }

    if (severity) {
      query = query.eq('severity', severity);
    }

    if (agentId) {
      query = query.eq('agent_id', agentId);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const limitNum = Math.min(parseInt(limit as string) || 100, 1000);
    const offsetNum = parseInt(offset as string) || 0;

    const { data: errors, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offsetNum, offsetNum + limitNum - 1);

    if (error) {
      console.error('Error fetching admin errors:', error);
      return res.status(500).json({ error: 'Failed to fetch errors' });
    }

    res.json({
      errors: errors || [],
      total: count || 0,
      limit: limitNum,
      offset: offsetNum
    });
  } catch (error) {
    console.error('Admin errors endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/admin/:id', requireAuth, requireRole('admin'), requireWhitelistedIP, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .getClient()
      .from('error_logs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting error log:', error);
      return res.status(500).json({ error: 'Failed to delete error log' });
    }

    console.info('Error log deleted', {
      errorId: id,
      deletedBy: req.user?.email,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete error endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/admin/cleanup', requireAuth, requireRole('admin'), requireWhitelistedIP, async (req, res) => {
  try {
    const { olderThan, severity, source } = req.query;

    if (!olderThan) {
      return res.status(400).json({
        error: 'Missing required parameter: olderThan (ISO date string)'
      });
    }

    let countQuery = supabase
      .getClient()
      .from('error_logs')
      .select('id', { count: 'exact', head: true })
      .lt('created_at', olderThan);

    if (severity) {
      countQuery = countQuery.eq('severity', severity);
    }

    if (source) {
      countQuery = countQuery.eq('source', source);
    }

    const { count } = await countQuery;

    let deleteQuery = supabase
      .getClient()
      .from('error_logs')
      .delete()
      .lt('created_at', olderThan);

    if (severity) {
      deleteQuery = deleteQuery.eq('severity', severity);
    }

    if (source) {
      deleteQuery = deleteQuery.eq('source', source);
    }

    const { error } = await deleteQuery;

    if (error) {
      console.error('Error during cleanup:', error);
      return res.status(500).json({ error: 'Failed to cleanup error logs' });
    }

    console.info('Error logs cleanup completed', {
      deletedCount: count || 0,
      olderThan,
      severity: severity || 'all',
      source: source || 'all',
      deletedBy: req.user?.email,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      deletedCount: count || 0
    });
  } catch (error) {
    console.error('Cleanup endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
