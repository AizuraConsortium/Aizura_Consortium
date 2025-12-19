import { SupabaseService } from './supabase.js';
import { EventEmitter } from 'events';

export class OrchestratorLockService extends EventEmitter {
  private instanceId: string;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private readonly HEARTBEAT_INTERVAL = 30000; // 30 seconds
  private readonly LOCK_TTL = 120; // 2 minutes
  private readonly RETRY_INTERVAL = 60000; // 1 minute
  private isShuttingDown: boolean = false;

  constructor(private supabase: SupabaseService) {
    super();

    // Generate unique instance ID
    const hostname = process.env.HOSTNAME || process.env.POD_NAME || 'local';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    this.instanceId = `${hostname}-${timestamp}-${random}`;

    console.log(`🆔 Orchestrator instance ID: ${this.instanceId}`);
  }

  getInstanceId(): string {
    return this.instanceId;
  }

  async acquireLock(): Promise<boolean> {
    if (this.isShuttingDown) {
      return false;
    }

    try {
      const acquired = await this.supabase.tryAcquireOrchestratorLock(
        this.instanceId,
        this.LOCK_TTL
      );

      if (acquired) {
        this.startHeartbeat();
        console.log(`🔐 Orchestrator lock acquired by ${this.instanceId}`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Error acquiring orchestrator lock:', error);
      return false;
    }
  }

  private startHeartbeat(): void {
    // Clear any existing heartbeat
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(async () => {
      if (this.isShuttingDown) {
        this.stopHeartbeat();
        return;
      }

      try {
        const refreshed = await this.supabase.refreshOrchestratorLock(
          this.instanceId,
          this.LOCK_TTL
        );

        if (!refreshed) {
          console.error('❌ Lost orchestrator lock! Another instance may have taken over.');
          this.stopHeartbeat();
          this.emit('lock-lost');
        } else {
          console.log(`💓 Orchestrator heartbeat sent (${this.instanceId})`);
        }
      } catch (error) {
        console.error('❌ Error sending heartbeat:', error);
        this.stopHeartbeat();
        this.emit('lock-lost');
      }
    }, this.HEARTBEAT_INTERVAL);

    console.log(`💓 Heartbeat started (every ${this.HEARTBEAT_INTERVAL}ms)`);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
      console.log('💓 Heartbeat stopped');
    }
  }

  async releaseLock(): Promise<void> {
    this.isShuttingDown = true;
    this.stopHeartbeat();

    try {
      const released = await this.supabase.releaseOrchestratorLock(this.instanceId);

      if (released) {
        console.log(`🔓 Orchestrator lock released by ${this.instanceId}`);
      } else {
        console.warn(`⚠️  Lock was not held by ${this.instanceId} during release`);
      }
    } catch (error) {
      console.error('❌ Error releasing orchestrator lock:', error);
    }
  }

  async getLockStatus(): Promise<{
    isLocked: boolean;
    instanceId: string | null;
    acquiredAt?: string;
    lastHeartbeat?: string;
    expiresAt?: string;
    ageSeconds?: number;
    heartbeatAgeSeconds?: number;
    expiresInSeconds?: number;
  }> {
    try {
      const status = await this.supabase.getOrchestratorLockStatus();
      return status;
    } catch (error) {
      console.error('❌ Error getting lock status:', error);
      return {
        isLocked: false,
        instanceId: null
      };
    }
  }

  isCurrentLeader(lockStatus: { instanceId: string | null }): boolean {
    return lockStatus.instanceId === this.instanceId;
  }
}
