import express from 'express';
import { SupabaseService } from '../services/supabase.js';

const router = express.Router();
const supabase = SupabaseService.getInstance();

router.get('/health', async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: errors, error } = await supabase
      .getClient()
      .from('error_logs')
      .select('severity')
      .gte('created_at', twentyFourHoursAgo);

    if (error) {
      console.error('Error fetching system health:', error);
      return res.status(500).json({ error: 'Failed to fetch system health' });
    }

    const errorCounts = {
      info: 0,
      warning: 0,
      error: 0,
      critical: 0
    };

    errors?.forEach(log => {
      if (log.severity in errorCounts) {
        errorCounts[log.severity as keyof typeof errorCounts]++;
      }
    });

    const totalErrors = errors?.length || 0;
    const criticalErrors = errorCounts.critical;
    const highPriorityErrors = errorCounts.error + errorCounts.critical;

    let systemHealth: 'healthy' | 'degraded' | 'unhealthy';
    if (criticalErrors > 10 || highPriorityErrors > 50) {
      systemHealth = 'unhealthy';
    } else if (criticalErrors > 0 || highPriorityErrors > 20) {
      systemHealth = 'degraded';
    } else {
      systemHealth = 'healthy';
    }

    const dbHealth = await supabase.healthCheck();

    const uptimePercent = dbHealth.healthy ? 99.9 : 0;

    res.json({
      status: systemHealth,
      uptime: uptimePercent,
      errors: {
        last24h: totalErrors,
        bySeverity: errorCounts
      },
      database: {
        connected: dbHealth.healthy
      }
    });
  } catch (error) {
    console.error('System health check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
