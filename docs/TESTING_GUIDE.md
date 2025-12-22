# Testing Guide

## Table of Contents
1. [Overview](#overview)
2. [Test Structure](#test-structure)
3. [Writing Tests](#writing-tests)
4. [Test Factories](#test-factories)
5. [Running Tests](#running-tests)
6. [Best Practices](#best-practices)

## Overview

Our testing strategy follows industry best practices with centralized test utilities,
factories for test data generation, and clear separation between unit, integration,
and end-to-end tests.

## Test Structure

```
/tests/
  /setup/           - Test configuration and global setup
  /factories/       - Test data factories
  /fixtures/        - Static test data and mocks
  /unit/            - Unit tests
  /integration/     - Integration tests
  /e2e/             - End-to-end tests (future)
```

## Writing Tests

### Unit Tests

Location: `/tests/unit/<module>/<file>.test.ts`

Example:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { UserFactory } from '@tests/factories';
import { validateUser } from '@shared/utils';

describe('validateUser', () => {
  it('should validate a valid user', () => {
    const user = UserFactory.build();
    const result = validateUser(user);
    expect(result.isValid).toBe(true);
  });

  it('should reject invalid email', () => {
    const user = UserFactory.build({ email: 'invalid' });
    const result = validateUser(user);
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });
});
```

### Integration Tests

Location: `/tests/integration/<module>/<file>.test.ts`

Example:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { ProposalFactory } from '@tests/factories';
import { setupSupabaseTest, cleanupSupabaseTest } from '@tests/setup/supabaseSetup';
import * as proposalRepo from '@backend/shared/services/supabase/repositories/proposals';

describe('Proposal Repository Integration', () => {
  beforeEach(async () => {
    await setupSupabaseTest();
  });

  afterEach(async () => {
    await cleanupSupabaseTest();
  });

  it('should create a proposal in database', async () => {
    const proposalData = ProposalFactory.build();
    const created = await proposalRepo.createProposal(proposalData);

    expect(created.id).toBeDefined();
    expect(created.title).toBe(proposalData.title);
  });
});
```

## Test Factories

All test data should be generated using factories:

```typescript
import {
  UserFactory,
  ProposalFactory,
  TopicFactory,
  RelatedFactory
} from '@tests/factories';

// Create a user
const user = UserFactory.build();
const admin = UserFactory.buildAdmin();

// Create multiple items
const users = UserFactory.buildMany(5);

// Override specific fields
const proposal = ProposalFactory.build({
  title: 'Custom Title',
  status: 'adopted'
});

// Create related data
const topicWithMessages = RelatedFactory.buildTopicWithMessages(10);
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test tests/unit/admin/api.test.ts

# Run with coverage
npm run test:coverage

# Run only unit tests
npm test tests/unit

# Run only integration tests
npm test tests/integration
```

## Best Practices

1. **Use Factories**: Always use test factories instead of hardcoded test data
2. **Test Isolation**: Each test should be independent and not rely on other tests
3. **Descriptive Names**: Test names should clearly describe what is being tested
4. **Arrange-Act-Assert**: Follow AAA pattern in test structure
5. **Mock External Dependencies**: Use mocks for external services and databases in unit tests
6. **Clean Up**: Always clean up test data, especially in integration tests
7. **Test Edge Cases**: Don't just test the happy path
8. **Avoid Test Logic**: Tests should be simple and straightforward
9. **One Assertion Per Test**: Ideally, test one thing at a time
10. **Fast Tests**: Unit tests should run quickly (< 100ms each)

## Configuration

Test configuration is in:

- `/vitest.config.ts` - Vitest configuration
- `/tests/setup/testConfig.ts` - Application test configuration
- `/tests/setup/globalSetup.ts` - Global test setup

## Coverage Goals

- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 75%
- **Statements**: 80%

Check coverage with: `npm run test:coverage`
