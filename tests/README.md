# Test Suite

This directory contains all tests for the Aizura Consortium project.

## Structure

```
tests/
├── unit/                 # Unit tests for individual components
│   ├── services/        # Service layer tests
│   ├── orchestrator/    # Orchestrator logic tests
│   └── utils/           # Utility function tests
├── integration/         # Integration tests
│   ├── api/             # API endpoint tests
│   └── webhooks/        # Webhook integration tests
├── fixtures/            # Test data and mocks
│   ├── mocks/           # Mock implementations
│   └── data/            # Sample test data
└── setup/               # Test setup and configuration
```

## Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## Test Categories

### Unit Tests
- Test individual functions and methods in isolation
- Use mocks for external dependencies
- Fast execution
- High coverage of edge cases

### Integration Tests
- Test multiple components working together
- May use test database or mock services
- Test real API endpoints and workflows
- Slower but more comprehensive

## Writing Tests

### Naming Convention
- Test files should end with `.test.ts`
- Use descriptive names: `serviceName.test.ts`
- Test suites should describe the component: `describe('SupabaseService', ...)`
- Test cases should describe behavior: `it('should return duplicate when proposal already queued', ...)`

### Best Practices
1. Arrange-Act-Assert pattern
2. One assertion per test (when practical)
3. Clean up resources in afterEach/afterAll
4. Use meaningful test data
5. Mock external dependencies in unit tests
6. Test both success and error paths
7. Test edge cases and boundary conditions

## Test Data

Test fixtures are located in `tests/fixtures/data/` and include:
- Sample proposals
- Mock agent messages
- Test database states
- Common test scenarios
