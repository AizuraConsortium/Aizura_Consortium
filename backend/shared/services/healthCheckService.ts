/**
 * Health Check Service
 *
 * Comprehensive system health validation including database,
 * external services, and resource availability.
 */

import { SupabaseService } from './supabase/index.js';
import { PerformanceMonitor } from '../monitoring/PerformanceMonitor.js';

/**
 * Health status values
 */
export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

/**
 * Individual dependency health
 */
export interface DependencyHealth {
  name: string;
  status: HealthStatus;
  message?: string;
  responseTime?: number;
  lastChecked: string;
}

/**
 * System health report
 */
export interface HealthReport {
  status: HealthStatus;
  uptime: number;
  timestamp: string;
  version?: string;
  dependencies: {
    database: DependencyHealth;
    fileSystem: DependencyHealth;
    memory: DependencyHealth;
  };
  details?: {
    memoryMb: number;
    activeConnections?: number;
    errorRate?: number;
  };
}

/**
 * Readiness status
 */
export interface ReadinessStatus {
  ready: boolean;
  reason?: string;
  checks: {
    database: boolean;
    dependencies: boolean;
  };
}

/**
 * Health Check Service
 *
 * Validates system health by checking all critical dependencies.
 * Used for monitoring, alerting, and Kubernetes probes.
 */
export class HealthCheckService {
  private static instance: HealthCheckService | null = null;
  private supabase: SupabaseService;
  private perfMonitor: PerformanceMonitor;
  private startTime: Date;
  private readonly CHECK_TIMEOUT = 5000; // 5 seconds

  private constructor() {
    this.supabase = SupabaseService.getInstance();
    this.perfMonitor = PerformanceMonitor.getInstance();
    this.startTime = new Date();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): HealthCheckService {
    if (!HealthCheckService.instance) {
      HealthCheckService.instance = new HealthCheckService();
    }
    return HealthCheckService.instance;
  }

  /**
   * Perform comprehensive health check
   *
   * Checks all system dependencies and returns detailed health report.
   *
   * @returns Health report
   */
  async checkHealth(): Promise<HealthReport> {
    const checks = await Promise.all([
      this.checkDatabase(),
      this.checkFileSystem(),
      this.checkMemory(),
    ]);

    const [database, fileSystem, memory] = checks;

    // Determine overall status
    const hasUnhealthy = checks.some((check) => check.status === 'unhealthy');
    const hasDegraded = checks.some((check) => check.status === 'degraded');

    const overallStatus: HealthStatus = hasUnhealthy
      ? 'unhealthy'
      : hasDegraded
      ? 'degraded'
      : 'healthy';

    const resourceUsage = this.perfMonitor.getResourceUsage();

    return {
      status: overallStatus,
      uptime: Math.round((Date.now() - this.startTime.getTime()) / 1000),
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || '1.0.0',
      dependencies: {
        database,
        fileSystem,
        memory,
      },
      details: {
        memoryMb: resourceUsage.memoryMb,
      },
    };
  }

  /**
   * Check if system is ready to serve traffic
   *
   * Used for Kubernetes readiness probe.
   *
   * @returns Readiness status
   */
  async checkReadiness(): Promise<ReadinessStatus> {
    try {
      // Check database connectivity with timeout
      const dbHealthy = await this.withTimeout(
        this.isDatabaseHealthy(),
        this.CHECK_TIMEOUT
      );

      if (!dbHealthy) {
        return {
          ready: false,
          reason: 'Database not connected',
          checks: {
            database: false,
            dependencies: true,
          },
        };
      }

      return {
        ready: true,
        checks: {
          database: true,
          dependencies: true,
        },
      };
    } catch (error) {
      return {
        ready: false,
        reason: error instanceof Error ? error.message : 'Unknown error',
        checks: {
          database: false,
          dependencies: false,
        },
      };
    }
  }

  /**
   * Check if process is alive
   *
   * Used for Kubernetes liveness probe.
   * Simple check that process is responsive.
   *
   * @returns True if alive
   */
  async checkLiveness(): Promise<boolean> {
    // Simple check - if we can execute this, we're alive
    return true;
  }

  /**
   * Check database health
   *
   * @private
   */
  private async checkDatabase(): Promise<DependencyHealth> {
    const startTime = Date.now();

    try {
      const healthy = await this.withTimeout(
        this.isDatabaseHealthy(),
        this.CHECK_TIMEOUT
      );

      const responseTime = Date.now() - startTime;

      if (!healthy) {
        return {
          name: 'database',
          status: 'unhealthy',
          message: 'Database connection failed',
          responseTime,
          lastChecked: new Date().toISOString(),
        };
      }

      // Check response time
      if (responseTime > 1000) {
        return {
          name: 'database',
          status: 'degraded',
          message: 'Database responding slowly',
          responseTime,
          lastChecked: new Date().toISOString(),
        };
      }

      return {
        name: 'database',
        status: 'healthy',
        responseTime,
        lastChecked: new Date().toISOString(),
      };
    } catch (error) {
      return {
        name: 'database',
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
      };
    }
  }

  /**
   * Check if database is healthy
   *
   * @private
   */
  private async isDatabaseHealthy(): Promise<boolean> {
    try {
      // Simple query to check database connectivity
      const { error } = await this.supabase.getClient()
        .from('consortium_topics')
        .select('id')
        .limit(1);

      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Check file system health
   *
   * @private
   */
  private async checkFileSystem(): Promise<DependencyHealth> {
    try {
      // Check if we can write to /tmp
      const testFile = `/tmp/health-check-${Date.now()}.txt`;
      const fs = await import('fs/promises');

      await fs.writeFile(testFile, 'health check');
      await fs.unlink(testFile);

      return {
        name: 'fileSystem',
        status: 'healthy',
        lastChecked: new Date().toISOString(),
      };
    } catch (error) {
      return {
        name: 'fileSystem',
        status: 'degraded',
        message: 'File system check failed',
        lastChecked: new Date().toISOString(),
      };
    }
  }

  /**
   * Check memory health
   *
   * @private
   */
  private async checkMemory(): Promise<DependencyHealth> {
    const usage = this.perfMonitor.getResourceUsage();

    if (usage.memoryMb > 1024) {
      return {
        name: 'memory',
        status: 'unhealthy',
        message: `Memory usage critical: ${usage.memoryMb}MB`,
        lastChecked: new Date().toISOString(),
      };
    }

    if (usage.memoryMb > 512) {
      return {
        name: 'memory',
        status: 'degraded',
        message: `Memory usage high: ${usage.memoryMb}MB`,
        lastChecked: new Date().toISOString(),
      };
    }

    return {
      name: 'memory',
      status: 'healthy',
      lastChecked: new Date().toISOString(),
    };
  }

  /**
   * Execute promise with timeout
   *
   * @private
   */
  private async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), timeoutMs)
      ),
    ]);
  }
}
