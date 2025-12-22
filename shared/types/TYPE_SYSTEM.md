# Type System Documentation

## Architecture Overview

The type system follows a strict hierarchy:

```
database.types.ts (Generated from Supabase)
↓
index.ts (Re-exports + Utility Types)
↓
Application Code (Imports from shared/types)
```

## Rules

### 1. Single Source of Truth
- All database types come from `database.types.ts`
- Never redefine types from the database
- Use type aliases, not duplicates

### 2. Type Imports
```typescript
// ✅ Correct
import type { Proposal, ProposalStatus } from '@shared/types';

// ❌ Wrong
type Proposal = { id: string; title: string; ... };
```

### 3. Never Use Any
```typescript
// ❌ Wrong
const data: any = await fetch();

// ✅ Correct
import type { Proposal } from '@shared/types';
const data: Proposal = await fetch();

// ✅ Also correct for truly unknown data
const data: unknown = await fetch();
if (isProposal(data)) {
  // TypeScript knows data is Proposal here
}
```

### 4. Use Type Guards for Runtime
```typescript
import { isProposal, isProposalArray } from '@shared/utils/typeGuards';

const data: unknown = await apiCall();
if (isProposalArray(data)) {
  // TypeScript knows data is Proposal[] here
  data.forEach(proposal => console.log(proposal.title));
}
```

### 5. Discriminated Unions
```typescript
// AgentMessage has discriminated type field
type MessageType = AgentMessage | AgentVoteMessage;

function handle(msg: MessageType) {
  if (msg.type === 'message') {
    // TypeScript knows it's AgentMessage
    console.log(msg.message.title);
  } else {
    // TypeScript knows it's AgentVoteMessage
    console.log(msg.vote.choice);
  }
}
```

## Type Categories

### Database Types (database.types.ts)
Generated from Supabase schema. Never edit manually.

### Entity Types (index.ts)
```typescript
export type Proposal = Database['public']['Tables']['proposals']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
```

### API Types (api.ts)
Request/response interfaces for API endpoints.

### Query Types (query.ts)
Filtering, pagination, and query building types.

### Form Types (forms.ts)
Form state and validation types.

## Best Practices

### Import types with type keyword:
```typescript
import type { Proposal } from '@shared/types';
```

### Export types explicitly:
```typescript
export type { Proposal, Topic };
```

### Use exhaustive checking:
```typescript
function handle(status: ProposalStatus) {
  switch (status) {
    case 'queued': return 'Queued';
    case 'in_debate': return 'In Debate';
    case 'adopted': return 'Adopted';
    case 'rejected': return 'Rejected';
    default:
      const _exhaustive: never = status;
      throw new Error(`Unhandled status: ${status}`);
  }
}
```

### Prefer unknown over any:
```typescript
// ❌ Avoid
catch (error: any) { }

// ✅ Prefer
catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}
```

## Updating Types

### When Database Schema Changes
1. Update Supabase schema
2. Regenerate types:
   ```bash
   npx supabase gen types typescript --project-id PROJECT_ID > shared/types/database.types.ts
   ```
3. Run type checks:
   ```bash
   npm run typecheck
   ```
4. Fix any type errors

### Adding New Shared Types
1. Add to appropriate file in shared/types/
2. Export from barrel file (index.ts)
3. Document in this README

### Adding Local Types
Only add local types for:
- Component-specific props
- Internal component state
- Module-specific helpers

Never create local types for:
- Database entities
- API responses
- Shared business logic

## Runtime Validation

Use type guards from `@shared/utils/typeGuards`:

```typescript
import {
  isProposalStatus,
  isAgentId,
  isProposal,
  assertProposalStatus
} from '@shared/utils/typeGuards';

// Type narrowing
if (isProposal(data)) {
  console.log(data.title); // TypeScript knows data is Proposal
}

// Type assertions
assertProposalStatus(value); // Throws if invalid
// After this line, TypeScript knows value is ProposalStatus
```

## Error Handling

Use typed error utilities from `@shared/utils/errorHandling`:

```typescript
import {
  getErrorMessage,
  isAppError,
  Result,
  success,
  failure
} from '@shared/utils/errorHandling';

// Type-safe error messages
try {
  await doSomething();
} catch (error) {
  const message = getErrorMessage(error); // Always returns string
  console.error(message);
}

// Result pattern
async function fetchData(): Promise<Result<Proposal[]>> {
  try {
    const data = await api.getProposals();
    return success(data);
  } catch (error) {
    return failure({
      message: getErrorMessage(error),
      code: 'FETCH_ERROR',
      status: 500
    });
  }
}
```

## API Validation

The API client supports optional runtime validation:

```typescript
import { apiClient } from '@shared/lib';
import { isProposalArray } from '@shared/utils/typeGuards';

// Without validation (type assertion)
const data = await apiClient.get<Proposal[]>('/proposals');

// With validation (runtime check)
const data = await apiClient.get<Proposal[]>('/proposals', token, isProposalArray);
// Throws if response doesn't match Proposal[]
```

## Type Testing

Write tests for type guards in `tests/types/`:

```typescript
import { describe, it, expect } from 'vitest';
import { isProposalStatus } from '@shared/utils/typeGuards';

describe('isProposalStatus', () => {
  it('validates correct statuses', () => {
    expect(isProposalStatus('queued')).toBe(true);
  });

  it('rejects invalid statuses', () => {
    expect(isProposalStatus('invalid')).toBe(false);
  });
});
```

## Common Patterns

### API Response Handling
```typescript
async function getProposals(): Promise<Proposal[]> {
  try {
    const response = await api.get<{ proposals: Proposal[] }>('/proposals');
    return response.proposals;
  } catch (error) {
    console.error('Failed to fetch proposals:', getErrorMessage(error));
    throw error;
  }
}
```

### Form State with Validation
```typescript
interface ProposalFormState {
  title: string;
  summary: string;
  errors: Partial<Record<keyof ProposalFormData, string>>;
}

function validateForm(data: ProposalFormData): ProposalFormState['errors'] {
  const errors: ProposalFormState['errors'] = {};

  if (!data.title.trim()) {
    errors.title = 'Title is required';
  }

  return errors;
}
```

### Type-Safe Event Handlers
```typescript
function handleStatusChange(status: ProposalStatus): void {
  // TypeScript ensures status is valid ProposalStatus
  updateFilter({ status });
}
```
