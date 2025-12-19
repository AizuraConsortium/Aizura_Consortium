import { rpc } from '../queryBuilder.js';

export interface OrchestratorLockStatus {
  isLocked: boolean;
  instanceId: string | null;
  acquiredAt?: string;
  lastHeartbeat?: string;
  expiresAt?: string;
  ageSeconds?: number;
  heartbeatAgeSeconds?: number;
  expiresInSeconds?: number;
}

export async function tryAcquireOrchestratorLock(
  instanceId: string,
  ttlSeconds: number = 120
): Promise<boolean> {
  return rpc<boolean>('try_acquire_orchestrator_lock', {
    p_instance_id: instanceId,
    p_ttl_seconds: ttlSeconds
  });
}

export async function refreshOrchestratorLock(
  instanceId: string,
  ttlSeconds: number = 120
): Promise<boolean> {
  return rpc<boolean>('refresh_orchestrator_lock', {
    p_instance_id: instanceId,
    p_ttl_seconds: ttlSeconds
  });
}

export async function releaseOrchestratorLock(
  instanceId: string
): Promise<boolean> {
  return rpc<boolean>('release_orchestrator_lock', {
    p_instance_id: instanceId
  });
}

export async function getOrchestratorLockStatus(): Promise<OrchestratorLockStatus> {
  const data = await rpc<any>('get_orchestrator_lock_status');

  return {
    isLocked: data?.is_locked || false,
    instanceId: data?.instance_id || null,
    acquiredAt: data?.acquired_at,
    lastHeartbeat: data?.last_heartbeat,
    expiresAt: data?.expires_at,
    ageSeconds: data?.age_seconds,
    heartbeatAgeSeconds: data?.heartbeat_age_seconds,
    expiresInSeconds: data?.expires_in_seconds
  };
}
