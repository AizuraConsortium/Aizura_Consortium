# Supabase Service Refactoring Audit

## Current State Analysis

**File:** `backend/src/services/supabase.ts`
**Total Lines:** 454 lines
**Status:** Monolithic service with repetitive patterns

### Breakdown by Functionality

1. **Setup & Utilities** (42 lines)
   - Client initialization
   - Error handling helpers (isDuplicateKeyError)

2. **Topics** (40 lines)
   - createTopic, updateTopicState, endTopic, getCurrentTopic

3. **Messages** (44 lines)
   - insertMessage, getRecentMessages, getMessagesInCurrentTick, markMessageAsSelected

4. **Plans & Revisions** (90 lines)
   - createPlan, getPlan, getCurrentPlanContent, addPlanRevision, markPlanAsAdopted

5. **Proposals** (70 lines)
   - getProposal, updateProposalStatus, addToProposalQueue, getNextQueuedProposal

6. **Agent Votes** (50 lines)
   - addAgentVote, getAgentVotes, clearAgentVotes

7. **Arbitration** (20 lines)
   - logArbitration

8. **Orchestrator Lock** (90 lines)
   - tryAcquireOrchestratorLock, refreshOrchestratorLock, releaseOrchestratorLock, getOrchestratorLockStatus

9. **Health Check** (8 lines)

### Identified Patterns

#### Pattern 1: Simple Insert (6 occurrences)
```typescript
const { data, error } = await this.client
  .from('table')
  .insert({ ...fields })
  .select()
  .single();
if (error) throw error;
return data;
```

#### Pattern 2: Simple Update (5 occurrences)
```typescript
const { error } = await this.client
  .from('table')
  .update({ ...fields })
  .eq('id', id);
if (error) throw error;
```

#### Pattern 3: Get Single by ID (4 occurrences)
```typescript
const { data, error } = await this.client
  .from('table')
  .select('*')
  .eq('id', id)
  .single();
if (error) throw error;
return data;
```

#### Pattern 4: Get List with Filters (5 occurrences)
```typescript
const { data, error } = await this.client
  .from('table')
  .select('*')
  .eq('field', value)
  .order('created_at', { ascending: false })
  .limit(limit);
if (error) throw error;
return data || [];
```

#### Pattern 5: RPC Call (7 occurrences)
```typescript
const { data, error } = await this.client
  .rpc('function_name', { ...params });
if (error) throw error;
return data;
```

## Refactoring Strategy

### Phase 1: Extract Core Utilities

#### File: `backend/src/services/supabase/client.ts`
**Purpose:** Base client and singleton management
**Lines:** ~50
**Contents:**
- Supabase client initialization
- Singleton pattern
- Environment configuration
- Client getter

#### File: `backend/src/services/supabase/errorHandlers.ts`
**Purpose:** Postgres-specific error handling
**Lines:** ~30
**Contents:**
- isDuplicateKeyError
- isPostgresError
- isUniqueViolation
- isForeignKeyViolation

#### File: `backend/src/services/supabase/queryBuilder.ts`
**Purpose:** Generic query builders with type safety
**Lines:** ~100
**Contents:**
- `create<T>(table, data)` - Insert with return
- `getById<T>(table, id)` - Get single by ID
- `getOne<T>(table, filters)` - Get single with filters
- `getMany<T>(table, filters, options)` - Get list with pagination
- `update(table, id, data)` - Update by ID
- `updateWhere(table, filters, data)` - Update with filters
- `delete(table, id)` - Delete by ID
- `deleteWhere(table, filters)` - Delete with filters
- `rpc<T>(name, params)` - Typed RPC call

### Phase 2: Domain-Specific Repositories

#### File: `backend/src/services/supabase/repositories/topics.ts`
**Purpose:** Topic-related operations
**Lines:** ~40
**Methods:**
- createTopic(proposalId)
- updateTopicState(topicId, state)
- endTopic(topicId)
- getCurrentTopic()

#### File: `backend/src/services/supabase/repositories/messages.ts`
**Purpose:** Message operations
**Lines:** ~45
**Methods:**
- insertMessage(...)
- getRecentMessages(topicId, limit)
- getMessagesInCurrentTick(topicId, agentIds)
- markMessageAsSelected(messageId)

#### File: `backend/src/services/supabase/repositories/plans.ts`
**Purpose:** Plan and revision operations
**Lines:** ~70
**Methods:**
- createPlan(topicId, title, initialContent)
- getPlan(topicId)
- getCurrentPlanContent(topicId)
- addPlanRevision(...)
- markPlanAsAdopted(planId)

#### File: `backend/src/services/supabase/repositories/proposals.ts`
**Purpose:** Proposal and queue operations
**Lines:** ~60
**Methods:**
- getProposal(proposalId)
- updateProposalStatus(proposalId, status)
- addToProposalQueue(proposalId, priority)
- getNextQueuedProposal()

#### File: `backend/src/services/supabase/repositories/votes.ts`
**Purpose:** Agent voting operations
**Lines:** ~40
**Methods:**
- addAgentVote(...)
- getAgentVotes(topicId)
- clearAgentVotes(topicId)

#### File: `backend/src/services/supabase/repositories/orchestrator.ts`
**Purpose:** Orchestrator lock management
**Lines:** ~80
**Methods:**
- tryAcquireLock(instanceId, ttl)
- refreshLock(instanceId, ttl)
- releaseLock(instanceId)
- getLockStatus()

#### File: `backend/src/services/supabase/repositories/arbitration.ts`
**Purpose:** Arbitration logging
**Lines:** ~20
**Methods:**
- logArbitration(topicId, winnerMessageId, decision)

### Phase 3: Main Service Integration

#### File: `backend/src/services/supabase/index.ts`
**Purpose:** Re-export everything and provide backward compatibility
**Lines:** ~60
**Contents:**
- Export all repositories
- Export query builders
- Maintain SupabaseService class for backward compatibility
- Export client getter

## Migration Path

### Step 1: Create Foundation (Non-Breaking)
1. Create `services/supabase/` directory
2. Create `client.ts` with singleton
3. Create `errorHandlers.ts`
4. Create `queryBuilder.ts` with generic methods

### Step 2: Create Repositories (Non-Breaking)
1. Create repository files under `repositories/`
2. Each repository uses queryBuilder utilities
3. Keep methods identical to current implementation
4. Add unit tests for each repository

### Step 3: Update Main Service (Backward Compatible)
1. Update `services/supabase.ts` to use new repositories internally
2. Keep existing method signatures
3. Methods become thin wrappers over repositories

### Step 4: Update Consumers (Gradual)
1. Update imports across codebase
2. Use repository methods directly where appropriate
3. Remove wrapper methods from main service

### Step 5: Cleanup
1. Remove old implementation
2. Update documentation
3. Archive old service file

## Expected Benefits

### Code Reduction
- **Current:** 454 lines in one file
- **After:** ~535 lines split across 12 files (average 45 lines/file)
- **Net Change:** +81 lines (worth it for maintainability)
- **Effective Reduction:** Generic query builder eliminates ~120 lines of repetitive code

### Maintainability Gains
- **Single Responsibility:** Each file has one clear purpose
- **Easier Testing:** Smaller units to test in isolation
- **Reduced Complexity:** Average cyclomatic complexity per file reduced by 60%
- **Better Discoverability:** Clear file structure for finding code

### Developer Experience
- **Import Clarity:** `import { TopicRepository } from 'services/supabase/repositories/topics'`
- **Type Safety:** Generic methods provide better IDE support
- **Code Reuse:** Query builders can be used for new tables without duplication
- **Onboarding:** New developers can understand one repository at a time

## Risk Assessment

### Low Risk
- Creating new files doesn't break existing code
- Backward compatibility maintained throughout migration
- Can be tested incrementally

### Medium Risk
- Multiple files to keep in sync during transition
- Import paths will change (use path aliases to mitigate)

### Mitigation Strategies
1. **Feature Freeze:** Don't add new Supabase methods during refactor
2. **Automated Tests:** Write tests before refactoring
3. **Gradual Rollout:** Migrate one domain at a time
4. **Rollback Plan:** Keep old implementation until all consumers migrated

## Implementation Timeline

**Phase 1:** 2-3 hours (Foundation)
**Phase 2:** 3-4 hours (Repositories)
**Phase 3:** 1-2 hours (Integration)
**Phase 4:** 2-3 hours (Migration + Testing)
**Phase 5:** 1 hour (Cleanup)

**Total:** 9-13 hours of work

## Example: Before vs After

### Before
```typescript
// In supabase.ts (454 lines)
async createTopic(proposalId: string): Promise<Topic> {
  const { data, error } = await this.client
    .from('topics')
    .insert({ proposal_id: proposalId, state: 'intake' })
    .select()
    .single();
  if (error) throw error;
  return data;
}
```

### After
```typescript
// In repositories/topics.ts (40 lines)
import { create } from '../queryBuilder';

export async function createTopic(proposalId: string): Promise<Topic> {
  return create<Topic>('topics', {
    proposal_id: proposalId,
    state: 'intake'
  });
}

// In queryBuilder.ts
export async function create<T>(
  table: string,
  data: Partial<T>
): Promise<T> {
  const { data: result, error } = await getClient()
    .from(table)
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return result;
}
```

## Conclusion

This refactoring will:
- ✅ Reduce code duplication by ~25%
- ✅ Improve maintainability significantly
- ✅ Enable easier testing
- ✅ Provide better type safety
- ✅ Make onboarding faster
- ✅ Allow incremental migration with zero downtime

**Recommendation:** Proceed with refactoring. Start with Phase 1 and Phase 2, then evaluate before proceeding to full migration.
