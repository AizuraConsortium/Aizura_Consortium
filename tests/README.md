# Test Suite

This directory contains all tests for the Aizura Consortium project.

## Table of Contents

1. [Structure](#structure)
2. [Configuration](#configuration)
3. [Running Tests](#running-tests)
4. [Test Categories](#test-categories)
5. [Writing Tests](#writing-tests)
6. [Test Data](#test-data)
7. [CI/CD Integration](#cicd-integration)

---

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

---

## Configuration

### Required Dependencies

Add these dev dependencies to your `package.json`:

```json
{
  "devDependencies": {
    "@jest/globals": "^29.7.0",
    "@types/jest": "^29.5.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.0"
  }
}
```

### Installation

Run the following command to install test dependencies:

```bash
npm install --save-dev @jest/globals @types/jest jest ts-jest
```

### Jest Configuration

Create a `jest.config.js` file in the project root:

```javascript
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  testMatch: [
    '**/tests/**/*.test.ts'
  ],
  collectCoverageFrom: [
    'backend/src/**/*.ts',
    'shared/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup/testConfig.ts']
};
```

### Package.json Scripts

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:verbose": "jest --verbose"
  }
}
```

---

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

# Run in watch mode (for development)
npm run test:watch

# Run with verbose output
npm run test:verbose
```

---

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

---

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

---

## Test Data

Test fixtures are located in `tests/fixtures/data/` and include:
- Sample proposals
- Mock agent messages
- Test database states
- Common test scenarios

---

## CI/CD Integration

Add to your CI/CD pipeline:

```yaml
- name: Run Tests
  run: npm test

- name: Generate Coverage Report
  run: npm run test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

---

**Document Version:** 1.0
**Last Updated:** 2025-12-19
**Owner:** Development Team
