/**
 * Test Data Factories
 *
 * Factory functions for generating realistic test data for all entities.
 */

/**
 * Test utilities
 */
const testUtils = {
  randomUUID(): string {
    return `${Math.random().toString(36).substring(2)}-${Date.now()}`;
  },
  randomEmail(): string {
    return `test-${this.randomUUID()}@example.com`;
  },
  randomString(length = 10): string {
    return Math.random().toString(36).substring(2, 2 + length);
  },
};

/**
 * User factory
 */
export const UserFactory = {
  build: (overrides?: any) => ({
    id: testUtils.randomUUID(),
    email: testUtils.randomEmail(),
    role: 'client' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }),

  buildAdmin: (overrides?: any) =>
    UserFactory.build({ role: 'admin', email: 'admin@example.com', ...overrides }),

  buildAgent: (overrides?: any) =>
    UserFactory.build({ role: 'agent', email: 'agent@example.com', ...overrides }),

  buildMany: (count: number, overrides?: any) =>
    Array.from({ length: count }, () => UserFactory.build(overrides)),
};

/**
 * Proposal factory
 */
export const ProposalFactory = {
  build: (overrides?: any) => ({
    id: testUtils.randomUUID(),
    title: `Test Proposal ${testUtils.randomString(6)}`,
    summary: `This is a test proposal summary with sufficient detail for validation. It describes the proposal in meaningful detail. ${testUtils.randomString(20)}`,
    status: 'pending' as const,
    submitted_by: testUtils.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }),

  buildApproved: (overrides?: any) =>
    ProposalFactory.build({ status: 'approved', ...overrides }),

  buildRejected: (overrides?: any) =>
    ProposalFactory.build({ status: 'rejected', ...overrides }),

  buildActive: (overrides?: any) =>
    ProposalFactory.build({ status: 'active', ...overrides }),

  buildMany: (count: number, overrides?: any) =>
    Array.from({ length: count }, () => ProposalFactory.build(overrides)),
};

/**
 * Topic factory
 */
export const TopicFactory = {
  build: (overrides?: any) => ({
    id: testUtils.randomUUID(),
    proposal_id: testUtils.randomUUID(),
    state: 'discussion' as const,
    started_at: new Date().toISOString(),
    ...overrides,
  }),

  buildVoting: (overrides?: any) =>
    TopicFactory.build({ state: 'voting', ...overrides }),

  buildPassed: (overrides?: any) =>
    TopicFactory.build({ state: 'passed', ...overrides }),

  buildFailed: (overrides?: any) =>
    TopicFactory.build({ state: 'failed', ...overrides }),

  buildMany: (count: number, overrides?: any) =>
    Array.from({ length: count }, () => TopicFactory.build(overrides)),
};

/**
 * Message factory
 */
export const MessageFactory = {
  build: (overrides?: any) => ({
    id: testUtils.randomUUID(),
    topic_id: testUtils.randomUUID(),
    agent_id: 'orchestrator' as const,
    role: 'system' as const,
    content_text: `Test message content ${testUtils.randomString(20)}`,
    created_at: new Date().toISOString(),
    ...overrides,
  }),

  buildUserMessage: (overrides?: any) =>
    MessageFactory.build({ role: 'user', agent_id: 'user', ...overrides }),

  buildAssistantMessage: (overrides?: any) =>
    MessageFactory.build({ role: 'assistant', agent_id: 'agent_1', ...overrides }),

  buildMany: (count: number, overrides?: any) =>
    Array.from({ length: count }, () => MessageFactory.build(overrides)),
};

/**
 * Plan factory
 */
export const PlanFactory = {
  build: (overrides?: any) => ({
    id: testUtils.randomUUID(),
    topic_id: testUtils.randomUUID(),
    created_at: new Date().toISOString(),
    ...overrides,
  }),

  buildWithContent: (overrides?: any) => ({
    ...PlanFactory.build(overrides),
    content_md: `# Test Plan\n\n## Overview\n\nThis is a test plan.\n\n## Steps\n\n1. Step 1\n2. Step 2`,
  }),

  buildMany: (count: number, overrides?: any) =>
    Array.from({ length: count }, () => PlanFactory.build(overrides)),
};

/**
 * Vote factory
 */
export const VoteFactory = {
  build: (overrides?: any) => ({
    id: testUtils.randomUUID(),
    proposal_id: testUtils.randomUUID(),
    agent_id: 'agent_1' as const,
    vote: 'approve' as const,
    reasoning: `Test reasoning for vote ${testUtils.randomString(10)}`,
    created_at: new Date().toISOString(),
    ...overrides,
  }),

  buildApprove: (overrides?: any) =>
    VoteFactory.build({ vote: 'approve', ...overrides }),

  buildReject: (overrides?: any) =>
    VoteFactory.build({ vote: 'reject', ...overrides }),

  buildAbstain: (overrides?: any) =>
    VoteFactory.build({ vote: 'abstain', ...overrides }),

  buildMany: (count: number, overrides?: any) =>
    Array.from({ length: count }, () => VoteFactory.build(overrides)),
};

/**
 * Error log factory
 */
export const ErrorLogFactory = {
  build: (overrides?: any) => ({
    id: testUtils.randomUUID(),
    error_type: 'TEST_ERROR',
    message: `Test error message ${testUtils.randomString(10)}`,
    source: 'backend' as const,
    severity: 'error' as const,
    created_at: new Date().toISOString(),
    ...overrides,
  }),

  buildWarning: (overrides?: any) =>
    ErrorLogFactory.build({ severity: 'warning', ...overrides }),

  buildCritical: (overrides?: any) =>
    ErrorLogFactory.build({ severity: 'critical', ...overrides }),

  buildMany: (count: number, overrides?: any) =>
    Array.from({ length: count }, () => ErrorLogFactory.build(overrides)),
};

/**
 * Admin action factory
 */
export const AdminActionFactory = {
  build: (overrides?: any) => ({
    id: testUtils.randomUUID(),
    user_id: testUtils.randomUUID(),
    action_type: 'orchestrator_force_unlock' as const,
    resource_type: 'orchestrator_lock' as const,
    success: true,
    created_at: new Date().toISOString(),
    ...overrides,
  }),

  buildFailed: (overrides?: any) =>
    AdminActionFactory.build({
      success: false,
      error_message: 'Test error',
      ...overrides,
    }),

  buildMany: (count: number, overrides?: any) =>
    Array.from({ length: count }, () => AdminActionFactory.build(overrides)),
};

/**
 * Rate limit entry factory
 */
export const RateLimitFactory = {
  build: (overrides?: any) => ({
    id: testUtils.randomUUID(),
    identifier: `user_${testUtils.randomUUID()}`,
    endpoint: '/api/test',
    request_count: 1,
    window_start: new Date().toISOString(),
    created_at: new Date().toISOString(),
    ...overrides,
  }),

  buildExceeded: (overrides?: any) =>
    RateLimitFactory.build({ request_count: 100, ...overrides }),

  buildMany: (count: number, overrides?: any) =>
    Array.from({ length: count }, () => RateLimitFactory.build(overrides)),
};

/**
 * Helper to create related entities
 */
export const RelatedFactory = {
  /**
   * Create a complete proposal flow with topic and plan
   */
  buildProposalFlow: (overrides?: any) => {
    const user = UserFactory.build();
    const proposal = ProposalFactory.build({
      submitted_by: user.id,
      ...overrides?.proposal,
    });
    const topic = TopicFactory.build({
      proposal_id: proposal.id,
      ...overrides?.topic,
    });
    const plan = PlanFactory.buildWithContent({
      topic_id: topic.id,
      ...overrides?.plan,
    });

    return { user, proposal, topic, plan };
  },

  /**
   * Create a voting scenario with multiple votes
   */
  buildVotingScenario: (voteCount = 3, overrides?: any) => {
    const proposal = ProposalFactory.build(overrides?.proposal);
    const votes = VoteFactory.buildMany(voteCount, {
      proposal_id: proposal.id,
      ...overrides?.vote,
    });

    return { proposal, votes };
  },

  /**
   * Create a discussion with messages
   */
  buildDiscussion: (messageCount = 5, overrides?: any) => {
    const topic = TopicFactory.build(overrides?.topic);
    const messages = MessageFactory.buildMany(messageCount, {
      topic_id: topic.id,
      ...overrides?.message,
    });

    return { topic, messages };
  },
};
