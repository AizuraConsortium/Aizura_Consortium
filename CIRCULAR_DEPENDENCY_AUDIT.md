# Circular Dependency Audit Report

**Date:** December 17, 2024
**Issue:** Circular foreign key relationship between `plans` and `plan_revisions`

---

## Schema Analysis

### Current Schema
```sql
-- plans table
CREATE TABLE plans (
  id uuid PRIMARY KEY,
  topic_id uuid REFERENCES topics(id),
  title text,
  current_revision_id uuid,  -- References plan_revisions.id
  status text,
  created_at timestamptz
);

-- plan_revisions table
CREATE TABLE plan_revisions (
  id uuid PRIMARY KEY,
  plan_id uuid REFERENCES plans(id),  -- References plans.id
  agent_id text,
  op text,
  path text,
  content_md text,
  diff jsonb,
  created_at timestamptz
);

-- Foreign key constraint creating circular dependency
ALTER TABLE plans ADD CONSTRAINT fk_plans_current_revision
  FOREIGN KEY (current_revision_id)
  REFERENCES plan_revisions(id)
  ON DELETE SET NULL;
```

### Circular Dependency
```
plans.current_revision_id → plan_revisions.id
                             ↓
                     plan_revisions.plan_id → plans.id
```

---

## Current Implementation Analysis

### `createPlan()` Method (supabase.ts:133-169)
```typescript
async createPlan(topicId: string, title: string, initialContent: string): Promise<Plan> {
  // Step 1: Create plan with current_revision_id = NULL
  const { data: plan } = await this.client
    .from('plans')
    .insert({ topic_id: topicId, title, status: 'draft' })
    .select()
    .single();

  // Step 2: Create first revision referencing the plan
  const { data: revision } = await this.client
    .from('plan_revisions')
    .insert({
      plan_id: plan.id,
      agent_id: 'chatgpt',
      op: 'upsert_section',
      path: 'root',
      content_md: initialContent,
      diff: { op: 'init', addedChars: initialContent.length }
    })
    .select()
    .single();

  // Step 3: Update plan to reference the revision
  await this.client
    .from('plans')
    .update({ current_revision_id: revision.id })
    .eq('id', plan.id);

  return { ...plan, current_revision_id: revision.id };
}
```

---

## Risk Assessment

### ⚠️ Identified Risks

#### 1. **Process Crash Between Steps** (MEDIUM RISK)
If the process crashes between step 2 and step 3:
- Plan exists with `current_revision_id = NULL`
- Revision exists but isn't referenced as current
- Plan has no "current" content pointer
- Data is orphaned and inconsistent

#### 2. **No Atomicity** (MEDIUM RISK)
The three-step process has no transaction wrapper:
- If any step fails, previous steps don't roll back
- Database could be left in inconsistent state
- No all-or-nothing guarantee

#### 3. **Race Conditions** (LOW RISK in current architecture)
Multiple concurrent `createPlan` calls could interfere:
- However, orchestrator is single-threaded
- Only one debate runs at a time
- Very unlikely in current implementation

### ✅ Mitigating Factors

1. **ON DELETE SET NULL**: Prevents cascade failures
2. **Single Orchestrator**: No concurrent plan creation
3. **NULL is Valid**: `current_revision_id = NULL` represents draft state
4. **Subsequent Edits**: `addPlanRevision` calls update current_revision_id

---

## Problem Severity

**Overall Risk: MEDIUM**

While the current implementation works in practice due to:
- Single-threaded orchestrator
- No concurrent access
- Plans created only once per topic

The lack of atomicity is a **legitimate concern** for production:
- Process crashes could leave orphaned data
- Manual database cleanup would be required
- Not resilient to unexpected failures

---

## Recommended Fix

### Option 1: Wrap in Database Transaction ✅ RECOMMENDED

Use PostgreSQL transactions to make the operation atomic:

```typescript
async createPlan(topicId: string, title: string, initialContent: string): Promise<Plan> {
  // Use Supabase RPC to execute transaction
  const { data, error } = await this.client.rpc('create_plan_with_revision', {
    p_topic_id: topicId,
    p_title: title,
    p_initial_content: initialContent
  });

  if (error) throw error;
  return data;
}
```

Create a database function:
```sql
CREATE OR REPLACE FUNCTION create_plan_with_revision(
  p_topic_id uuid,
  p_title text,
  p_initial_content text
)
RETURNS json AS $$
DECLARE
  v_plan_id uuid;
  v_revision_id uuid;
  v_result json;
BEGIN
  -- Step 1: Create plan
  INSERT INTO plans (topic_id, title, status)
  VALUES (p_topic_id, p_title, 'draft')
  RETURNING id INTO v_plan_id;

  -- Step 2: Create first revision
  INSERT INTO plan_revisions (plan_id, agent_id, op, path, content_md, diff)
  VALUES (
    v_plan_id,
    'chatgpt',
    'upsert_section',
    'root',
    p_initial_content,
    json_build_object('op', 'init', 'addedChars', length(p_initial_content))
  )
  RETURNING id INTO v_revision_id;

  -- Step 3: Update plan with revision reference
  UPDATE plans
  SET current_revision_id = v_revision_id
  WHERE id = v_plan_id;

  -- Return complete plan
  SELECT row_to_json(p.*) INTO v_result
  FROM plans p
  WHERE p.id = v_plan_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;
```

**Benefits:**
- Atomic operation (all-or-nothing)
- Prevents orphaned data
- Rollback on any failure
- Production-ready

**Drawbacks:**
- Requires database migration
- Slightly more complex

---

### Option 2: Make FK Constraint Deferrable

Defer constraint checking until end of transaction:

```sql
ALTER TABLE plans DROP CONSTRAINT fk_plans_current_revision;

ALTER TABLE plans ADD CONSTRAINT fk_plans_current_revision
  FOREIGN KEY (current_revision_id)
  REFERENCES plan_revisions(id)
  ON DELETE SET NULL
  DEFERRABLE INITIALLY DEFERRED;
```

Then use explicit transactions in code:
```typescript
async createPlan(topicId: string, title: string, initialContent: string): Promise<Plan> {
  const { data, error } = await this.client.rpc('exec_transaction', {
    sql: `
      BEGIN;
      -- Insert plan, revision, update plan
      COMMIT;
    `
  });
}
```

**Benefits:**
- More flexible constraint checking
- Allows circular references within transaction

**Drawbacks:**
- Schema change required
- More complex transaction management

---

### Option 3: Leave As-Is ❌ NOT RECOMMENDED

Accept that `current_revision_id = NULL` is a valid state.

**Benefits:**
- No code changes needed
- Simple

**Drawbacks:**
- Risk of orphaned data on crashes
- Requires manual database cleanup
- Not production-ready
- Data inconsistency possible

---

## Recommendation Summary

### ✅ Implement Option 1: Database Transaction Function

**Why:**
1. Provides true atomicity
2. Prevents data inconsistency
3. Production-ready solution
4. Handles process crashes gracefully
5. No race conditions possible
6. Clean rollback on errors

**Implementation Effort:** Low (1 migration + small code change)

**Risk Reduction:** HIGH → LOW

---

## Implementation Plan

If you want to fix this:

1. Create migration: `supabase/migrations/YYYYMMDDHHMMSS_add_create_plan_transaction.sql`
2. Add the `create_plan_with_revision` function
3. Update `backend/src/services/supabase.ts` to use RPC call
4. Test with process kill during plan creation
5. Verify rollback behavior

---

## Conclusion

**Current Status:** ⚠️ MEDIUM RISK

The circular dependency itself is **not the problem**. The problem is the **lack of atomicity** in the multi-step plan creation process.

**Recommendation:**
- ✅ Implement database transaction wrapper (Option 1)
- This makes the operation atomic and production-ready
- Low implementation effort, high value

**However**, if you accept that:
- Orchestrator is single-threaded
- Process crashes are rare
- Manual cleanup is acceptable
- NULL current_revision_id is valid

Then **leaving as-is** is also reasonable for this specific use case.

---

**Your decision:** Do you want to implement the transaction fix, or accept the current risk?
