export const TEST_CONFIG = {
  timeout: {
    unit: 5000,
    integration: 30000,
    e2e: 60000
  },
  database: {
    testSchema: 'test_schema',
    cleanupAfterTests: true
  },
  logging: {
    verbose: process.env.TEST_VERBOSE === 'true',
    showSql: process.env.TEST_SHOW_SQL === 'true'
  },
  mock: {
    enableNetworkMocks: true,
    enableDatabaseMocks: process.env.TEST_USE_MOCKS === 'true'
  }
};

export const TEST_PROPOSALS = {
  valid: {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Proposal',
    summary: 'A test proposal for unit testing'
  },
  duplicate: {
    id: '223e4567-e89b-12d3-a456-426614174001',
    title: 'Duplicate Test Proposal',
    summary: 'Used for testing duplicate detection'
  }
};

export const TEST_ERRORS = {
  duplicateKey: {
    code: '23505',
    constraint: 'proposal_queue_proposal_id_key'
  },
  connectionError: {
    code: '08006',
    message: 'Connection failed'
  }
};

export function setupTestEnvironment() {
  process.env.NODE_ENV = 'test';
  process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:54321';
  process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-key';
}

export function cleanupTestEnvironment() {
  // Cleanup logic here
}

export async function waitForAsync(ms: number = 100): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
