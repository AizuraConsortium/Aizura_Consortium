# Supabase Service Refactoring - Implementation Example

## File Structure (Proposed)

```
backend/src/services/supabase/
├── index.ts                      # Main export and backward compatibility
├── client.ts                     # Singleton client management
├── errorHandlers.ts              # Postgres error utilities
├── queryBuilder.ts               # Generic CRUD operations
└── repositories/
    ├── topics.ts                 # Topic operations
    ├── messages.ts               # Message operations
    ├── plans.ts                  # Plan & revision operations
    ├── proposals.ts              # Proposal operations
    ├── votes.ts                  # Agent vote operations
    ├── arbitration.ts            # Arbitration logging
    └── orchestrator.ts           # Lock management
```

## Implementation Details

### 1. client.ts (Base Client)

```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export function initializeSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  supabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'X-Client-Info': 'aizura-consortium-backend'
      }
    }
  });

  return supabaseClient;
}

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    return initializeSupabaseClient();
  }
  return supabaseClient;
}
```

### 2. errorHandlers.ts (Error Utilities)

```typescript
export interface PostgresError extends Error {
  code?: string;
  details?: string;
  hint?: string;
}

export function isPostgresError(error: unknown): error is PostgresError {
  return error instanceof Error && 'code' in error;
}

export function isDuplicateKeyError(
  error: unknown,
  constraintName?: string
): boolean {
  if (!isPostgresError(error)) return false;
  if (error.code !== '23505') return false;

  if (constraintName && error.message) {
    return error.message.includes(constraintName);
  }

  return true;
}

export function isUniqueViolation(error: unknown): boolean {
  return isPostgresError(error) && error.code === '23505';
}

export function isForeignKeyViolation(error: unknown): boolean {
  return isPostgresError(error) && error.code === '23503';
}

export function isNotNullViolation(error: unknown): boolean {
  return isPostgresError(error) && error.code === '23502';
}
```

### 3. queryBuilder.ts (Generic CRUD)

```typescript
import { getSupabaseClient } from './client';
import type { PostgrestError } from '@supabase/supabase-js';

export interface QueryOptions {
  orderBy?: string;
  ascending?: boolean;
  limit?: number;
  offset?: number;
}

export interface FilterOptions {
  [key: string]: any;
}

// CREATE
export async function create<T>(
  table: string,
  data: Partial<T>
): Promise<T> {
  const { data: result, error } = await getSupabaseClient()
    .from(table)
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return result;
}

// READ - Single by ID
export async function getById<T>(
  table: string,
  id: string
): Promise<T> {
  const { data, error } = await getSupabaseClient()
    .from(table)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// READ - Single by filter (may return null)
export async function getOne<T>(
  table: string,
  filters: FilterOptions
): Promise<T | null> {
  let query = getSupabaseClient()
    .from(table)
    .select('*');

  // Apply filters
  for (const [key, value] of Object.entries(filters)) {
    if (value === null) {
      query = query.is(key, null);
    } else {
      query = query.eq(key, value);
    }
  }

  const { data, error } = await query.maybeSingle();

  if (error) throw error;
  return data;
}

// READ - Multiple with options
export async function getMany<T>(
  table: string,
  filters?: FilterOptions,
  options?: QueryOptions
): Promise<T[]> {
  let query = getSupabaseClient()
    .from(table)
    .select('*');

  // Apply filters
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value === null) {
        query = query.is(key, null);
      } else if (Array.isArray(value)) {
        query = query.in(key, value);
      } else {
        query = query.eq(key, value);
      }
    }
  }

  // Apply ordering
  if (options?.orderBy) {
    query = query.order(options.orderBy, {
      ascending: options.ascending ?? false
    });
  }

  // Apply pagination
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 10) - 1
    );
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

// UPDATE - by ID
export async function updateById<T>(
  table: string,
  id: string,
  data: Partial<T>
): Promise<void> {
  const { error } = await getSupabaseClient()
    .from(table)
    .update(data)
    .eq('id', id);

  if (error) throw error;
}

// UPDATE - by filters
export async function updateWhere<T>(
  table: string,
  filters: FilterOptions,
  data: Partial<T>
): Promise<void> {
  let query = getSupabaseClient()
    .from(table)
    .update(data);

  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value);
  }

  const { error } = await query;

  if (error) throw error;
}

// DELETE - by ID
export async function deleteById(
  table: string,
  id: string
): Promise<void> {
  const { error } = await getSupabaseClient()
    .from(table)
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// DELETE - by filters
export async function deleteWhere(
  table: string,
  filters: FilterOptions
): Promise<void> {
  let query = getSupabaseClient()
    .from(table)
    .delete();

  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value);
  }

  const { error } = await query;

  if (error) throw error;
}

// RPC - Remote Procedure Call
export async function rpc<T>(
  functionName: string,
  params?: Record<string, any>
): Promise<T> {
  const { data, error } = await getSupabaseClient()
    .rpc(functionName, params);

  if (error) throw error;
  return data;
}

// Custom query builder for complex cases
export function query(table: string) {
  return getSupabaseClient().from(table);
}
```

### 4. repositories/topics.ts (Domain Logic)

```typescript
import { create, getOne, updateById, query } from '../queryBuilder';
import type { Topic, Phase } from '../../../../shared/types/index';

export async function createTopic(proposalId: string): Promise<Topic> {
  return create<Topic>('topics', {
    proposal_id: proposalId,
    state: 'intake'
  });
}

export async function updateTopicState(
  topicId: string,
  state: Phase
): Promise<void> {
  await updateById('topics', topicId, { state });
}

export async function endTopic(topicId: string): Promise<void> {
  await updateById('topics', topicId, {
    ended_at: new Date().toISOString(),
    state: 'commit'
  });
}

export async function getCurrentTopic(): Promise<Topic | null> {
  const { data, error } = await query('topics')
    .select('*')
    .is('ended_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}
```

### 5. repositories/messages.ts (Domain Logic)

```typescript
import { create, getMany, updateById } from '../queryBuilder';
import type { Message, AgentId, AgentRole, Phase, AgentMessage, AgentVoteMessage } from '../../../../shared/types/index';

export async function insertMessage(
  topicId: string,
  agentId: AgentId,
  agentRole: AgentRole,
  phase: Phase,
  importance: number,
  body: AgentMessage | AgentVoteMessage,
  selected: boolean
): Promise<Message> {
  return create<Message>('messages', {
    topic_id: topicId,
    agent_id: agentId,
    agent_role: agentRole,
    phase,
    importance,
    body,
    selected
  });
}

export async function getRecentMessages(
  topicId: string,
  limit: number = 20
): Promise<Message[]> {
  return getMany<Message>(
    'messages',
    { topic_id: topicId, selected: true },
    { orderBy: 'created_at', ascending: false, limit }
  );
}

export async function getMessagesInCurrentTick(
  topicId: string,
  agentIds: AgentId[]
): Promise<Message[]> {
  return getMany<Message>(
    'messages',
    { topic_id: topicId, agent_id: agentIds },
    { orderBy: 'created_at', ascending: false, limit: agentIds.length }
  );
}

export async function markMessageAsSelected(
  messageId: string
): Promise<void> {
  await updateById('messages', messageId, { selected: true });
}
```

### 6. repositories/plans.ts (Domain Logic)

```typescript
import { create, getOne, updateById, rpc, query } from '../queryBuilder';
import type { Plan, PlanRevision, AgentId } from '../../../../shared/types/index';
import { getSupabaseClient } from '../client';

export async function createPlan(
  topicId: string,
  title: string,
  initialContent: string
): Promise<Plan> {
  return rpc<Plan>('create_plan_with_revision', {
    p_topic_id: topicId,
    p_title: title,
    p_initial_content: initialContent
  });
}

export async function getPlan(topicId: string): Promise<Plan | null> {
  return getOne<Plan>('plans', { topic_id: topicId });
}

export async function getCurrentPlanContent(topicId: string): Promise<string> {
  const plan = await getPlan(topicId);
  if (!plan || !plan.current_revision_id) {
    return '';
  }

  const { data, error } = await getSupabaseClient()
    .from('plan_revisions')
    .select('content_md')
    .eq('id', plan.current_revision_id)
    .single();

  if (error) throw error;
  return data?.content_md || '';
}

export async function addPlanRevision(
  planId: string,
  agentId: AgentId,
  op: string,
  path: string,
  contentMd: string,
  diff: any
): Promise<PlanRevision> {
  const revision = await create<PlanRevision>('plan_revisions', {
    plan_id: planId,
    agent_id: agentId,
    op,
    path,
    content_md: contentMd,
    diff
  });

  await updateById('plans', planId, {
    current_revision_id: revision.id
  });

  return revision;
}

export async function markPlanAsAdopted(planId: string): Promise<void> {
  await updateById('plans', planId, { status: 'adopted' });
}
```

### 7. repositories/proposals.ts (Domain Logic)

```typescript
import { getById, updateById, create, rpc } from '../queryBuilder';
import { isDuplicateKeyError } from '../errorHandlers';
import type { Proposal, ProposalQueue, QueueOperationResult } from '../../../../shared/types/index';

export async function getProposal(proposalId: string): Promise<Proposal> {
  return getById<Proposal>('proposals', proposalId);
}

export async function updateProposalStatus(
  proposalId: string,
  status: string
): Promise<void> {
  await updateById('proposals', proposalId, {
    status,
    updated_at: new Date().toISOString()
  });
}

export async function addToProposalQueue(
  proposalId: string,
  priority: number = 0
): Promise<QueueOperationResult> {
  try {
    await create('proposal_queue', {
      proposal_id: proposalId,
      priority,
      status: 'queued'
    });

    return {
      success: true,
      wasAlreadyQueued: false,
      message: `Proposal ${proposalId} added to queue successfully`
    };
  } catch (error) {
    if (isDuplicateKeyError(error, 'proposal_queue_proposal_id_key')) {
      return {
        success: true,
        wasAlreadyQueued: true,
        message: `Proposal ${proposalId} is already queued`
      };
    }
    throw error;
  }
}

export async function getNextQueuedProposal(): Promise<ProposalQueue | null> {
  return rpc<ProposalQueue | null>('get_and_lock_next_proposal');
}
```

### 8. repositories/votes.ts (Domain Logic)

```typescript
import { create, getMany, rpc } from '../queryBuilder';
import type { AgentVote, AgentId } from '../../../../shared/types/index';

export async function addAgentVote(
  topicId: string,
  agentId: AgentId,
  choice: 'approve' | 'reject' | 'abstain',
  rationaleMd: string,
  conditions: string[]
): Promise<AgentVote> {
  return create<AgentVote>('agent_votes', {
    topic_id: topicId,
    agent_id: agentId,
    choice,
    rationale_md: rationaleMd,
    conditions
  });
}

export async function getAgentVotes(topicId: string): Promise<AgentVote[]> {
  return getMany<AgentVote>('agent_votes', { topic_id: topicId });
}

export async function clearAgentVotes(topicId: string): Promise<void> {
  await rpc('clear_agent_votes_for_topic', { topic_id_param: topicId });
}
```

### 9. repositories/orchestrator.ts (Domain Logic)

```typescript
import { rpc } from '../queryBuilder';

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
```

### 10. repositories/arbitration.ts (Domain Logic)

```typescript
import { create } from '../queryBuilder';
import type { ArbitrationEntry } from '../../../../shared/types/index';

export async function logArbitration(
  topicId: string,
  winnerMessageId: string,
  decision: any
): Promise<ArbitrationEntry> {
  return create<ArbitrationEntry>('arbitration', {
    topic_id: topicId,
    winner_message_id: winnerMessageId,
    decision
  });
}
```

### 11. index.ts (Main Export & Backward Compatibility)

```typescript
// Export client
export { getSupabaseClient, initializeSupabaseClient } from './client';

// Export error handlers
export * from './errorHandlers';

// Export query builder
export * from './queryBuilder';

// Export all repositories
export * as TopicRepository from './repositories/topics';
export * as MessageRepository from './repositories/messages';
export * as PlanRepository from './repositories/plans';
export * as ProposalRepository from './repositories/proposals';
export * as VoteRepository from './repositories/votes';
export * as OrchestratorRepository from './repositories/orchestrator';
export * as ArbitrationRepository from './repositories/arbitration';

// Backward compatibility: Keep the old SupabaseService class
import { getSupabaseClient } from './client';
import * as TopicRepo from './repositories/topics';
import * as MessageRepo from './repositories/messages';
import * as PlanRepo from './repositories/plans';
import * as ProposalRepo from './repositories/proposals';
import * as VoteRepo from './repositories/votes';
import * as OrchestratorRepo from './repositories/orchestrator';
import * as ArbitrationRepo from './repositories/arbitration';

export class SupabaseService {
  private static instance: SupabaseService | null = null;

  private constructor() {}

  static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  // Topics
  createTopic = TopicRepo.createTopic;
  updateTopicState = TopicRepo.updateTopicState;
  endTopic = TopicRepo.endTopic;
  getCurrentTopic = TopicRepo.getCurrentTopic;

  // Messages
  insertMessage = MessageRepo.insertMessage;
  getRecentMessages = MessageRepo.getRecentMessages;
  getMessagesInCurrentTick = MessageRepo.getMessagesInCurrentTick;
  markMessageAsSelected = MessageRepo.markMessageAsSelected;

  // Plans
  createPlan = PlanRepo.createPlan;
  getPlan = PlanRepo.getPlan;
  getCurrentPlanContent = PlanRepo.getCurrentPlanContent;
  addPlanRevision = PlanRepo.addPlanRevision;
  markPlanAsAdopted = PlanRepo.markPlanAsAdopted;

  // Proposals
  getProposal = ProposalRepo.getProposal;
  updateProposalStatus = ProposalRepo.updateProposalStatus;
  addToProposalQueue = ProposalRepo.addToProposalQueue;
  getNextQueuedProposal = ProposalRepo.getNextQueuedProposal;

  // Votes
  addAgentVote = VoteRepo.addAgentVote;
  getAgentVotes = VoteRepo.getAgentVotes;
  clearAgentVotes = VoteRepo.clearAgentVotes;

  // Orchestrator
  tryAcquireOrchestratorLock = OrchestratorRepo.tryAcquireOrchestratorLock;
  refreshOrchestratorLock = OrchestratorRepo.refreshOrchestratorLock;
  releaseOrchestratorLock = OrchestratorRepo.releaseOrchestratorLock;
  getOrchestratorLockStatus = OrchestratorRepo.getOrchestratorLockStatus;

  // Arbitration
  logArbitration = ArbitrationRepo.logArbitration;

  // Health check
  async healthCheck(): Promise<{ healthy: boolean; error?: string }> {
    try {
      const { data, error } = await getSupabaseClient()
        .from('proposals')
        .select('id')
        .limit(1);

      if (error) {
        return { healthy: false, error: error.message };
      }

      return { healthy: true };
    } catch (error: any) {
      return { healthy: false, error: error.message };
    }
  }

  getClient() {
    return getSupabaseClient();
  }
}
```

## Usage Examples

### Old Way (Still Works)
```typescript
import { SupabaseService } from './services/supabase';

const supabase = SupabaseService.getInstance();
const topic = await supabase.createTopic(proposalId);
```

### New Way (Recommended)
```typescript
import { TopicRepository } from './services/supabase';

const topic = await TopicRepository.createTopic(proposalId);
```

### Generic Query Builder
```typescript
import { create, getMany } from './services/supabase';

// Create a new record
const newRecord = await create('custom_table', { name: 'Test' });

// Get filtered list
const records = await getMany('custom_table',
  { status: 'active' },
  { orderBy: 'created_at', limit: 10 }
);
```

## Testing Example

```typescript
// tests/repositories/topics.test.ts
import { createTopic, getCurrentTopic } from '../../src/services/supabase/repositories/topics';

describe('TopicRepository', () => {
  describe('createTopic', () => {
    it('should create a topic with intake state', async () => {
      const topic = await createTopic('proposal-123');

      expect(topic.proposal_id).toBe('proposal-123');
      expect(topic.state).toBe('intake');
      expect(topic.id).toBeDefined();
    });
  });

  describe('getCurrentTopic', () => {
    it('should return the most recent unended topic', async () => {
      // Setup: Create two topics
      await createTopic('proposal-1');
      await createTopic('proposal-2');

      const currentTopic = await getCurrentTopic();

      expect(currentTopic).toBeDefined();
      expect(currentTopic?.ended_at).toBeNull();
    });
  });
});
```

## Migration Checklist

- [ ] Phase 1: Foundation
  - [ ] Create directory structure
  - [ ] Implement client.ts
  - [ ] Implement errorHandlers.ts
  - [ ] Implement queryBuilder.ts
  - [ ] Write unit tests for queryBuilder

- [ ] Phase 2: Repositories
  - [ ] Implement topics.ts
  - [ ] Implement messages.ts
  - [ ] Implement plans.ts
  - [ ] Implement proposals.ts
  - [ ] Implement votes.ts
  - [ ] Implement orchestrator.ts
  - [ ] Implement arbitration.ts
  - [ ] Write unit tests for each repository

- [ ] Phase 3: Integration
  - [ ] Create index.ts with re-exports
  - [ ] Create backward-compatible SupabaseService
  - [ ] Run integration tests
  - [ ] Verify no breaking changes

- [ ] Phase 4: Migration
  - [ ] Update orchestrator to use new repositories
  - [ ] Update route handlers
  - [ ] Update any other consumers
  - [ ] Remove old supabase.ts file

- [ ] Phase 5: Documentation
  - [ ] Update README with new structure
  - [ ] Document repository methods
  - [ ] Create migration guide for future developers
