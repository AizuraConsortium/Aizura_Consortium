/**
 * Type System Tests
 *
 * Tests runtime behavior of type guards and validation
 */

import { describe, it, expect } from 'vitest';
import {
  isProposalStatus,
  isAgentId,
  isAgentRole,
  isPhase,
  isProposal,
  assertProposalStatus,
  assertAgentId
} from '@shared/utils/typeGuards';

describe('Type Guards', () => {
  describe('isProposalStatus', () => {
    it('should validate correct proposal statuses', () => {
      expect(isProposalStatus('queued')).toBe(true);
      expect(isProposalStatus('in_debate')).toBe(true);
      expect(isProposalStatus('adopted')).toBe(true);
      expect(isProposalStatus('rejected')).toBe(true);
    });

    it('should reject invalid proposal statuses', () => {
      expect(isProposalStatus('pending')).toBe(false);
      expect(isProposalStatus('active')).toBe(false);
      expect(isProposalStatus('')).toBe(false);
      expect(isProposalStatus(null)).toBe(false);
      expect(isProposalStatus(undefined)).toBe(false);
    });
  });

  describe('isAgentId', () => {
    it('should validate correct agent IDs', () => {
      expect(isAgentId('claude')).toBe(true);
      expect(isAgentId('chatgpt')).toBe(true);
      expect(isAgentId('grok')).toBe(true);
      expect(isAgentId('gemini')).toBe(true);
      expect(isAgentId('deepseek')).toBe(true);
      expect(isAgentId('qwen')).toBe(true);
    });

    it('should reject invalid agent IDs', () => {
      expect(isAgentId('gpt4')).toBe(false);
      expect(isAgentId('unknown')).toBe(false);
      expect(isAgentId('')).toBe(false);
    });
  });

  describe('isAgentRole', () => {
    it('should validate correct agent roles', () => {
      expect(isAgentRole('product-strategy')).toBe(true);
      expect(isAgentRole('engineering-arch')).toBe(true);
      expect(isAgentRole('gtm-marketing')).toBe(true);
      expect(isAgentRole('ops-automation')).toBe(true);
      expect(isAgentRole('finance-tokenomics')).toBe(true);
      expect(isAgentRole('risk-compliance')).toBe(true);
    });

    it('should reject invalid agent roles', () => {
      expect(isAgentRole('developer')).toBe(false);
      expect(isAgentRole('admin')).toBe(false);
      expect(isAgentRole('')).toBe(false);
    });
  });

  describe('isPhase', () => {
    it('should validate correct phases', () => {
      expect(isPhase('intake')).toBe(true);
      expect(isPhase('debate')).toBe(true);
      expect(isPhase('plan_drafting')).toBe(true);
      expect(isPhase('pre_vote')).toBe(true);
      expect(isPhase('vote')).toBe(true);
      expect(isPhase('commit')).toBe(true);
      expect(isPhase('idle')).toBe(true);
    });

    it('should reject invalid phases', () => {
      expect(isPhase('active')).toBe(false);
      expect(isPhase('pending')).toBe(false);
      expect(isPhase('')).toBe(false);
    });
  });

  describe('isProposal', () => {
    it('should validate complete proposal objects', () => {
      const validProposal = {
        id: '123',
        title: 'Test Proposal',
        summary: 'Test summary',
        status: 'queued',
        votes_for: 0,
        votes_against: 0,
        voting_ends_at: null,
        submitted_by: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      expect(isProposal(validProposal)).toBe(true);
    });

    it('should reject incomplete proposal objects', () => {
      expect(isProposal({})).toBe(false);
      expect(isProposal({ id: '123' })).toBe(false);
      expect(isProposal({ id: '123', title: 'Test' })).toBe(false);
    });

    it('should reject objects with invalid status', () => {
      const invalidProposal = {
        id: '123',
        title: 'Test Proposal',
        summary: 'Test summary',
        status: 'invalid',
        votes_for: 0,
        votes_against: 0,
        created_at: '2024-01-01T00:00:00Z'
      };

      expect(isProposal(invalidProposal)).toBe(false);
    });
  });

  describe('assertProposalStatus', () => {
    it('should not throw for valid status', () => {
      expect(() => assertProposalStatus('queued')).not.toThrow();
      expect(() => assertProposalStatus('in_debate')).not.toThrow();
      expect(() => assertProposalStatus('adopted')).not.toThrow();
      expect(() => assertProposalStatus('rejected')).not.toThrow();
    });

    it('should throw for invalid status', () => {
      expect(() => assertProposalStatus('invalid')).toThrow(TypeError);
      expect(() => assertProposalStatus(null)).toThrow(TypeError);
      expect(() => assertProposalStatus(undefined)).toThrow(TypeError);
    });

    it('should provide helpful error message', () => {
      expect(() => assertProposalStatus('invalid')).toThrow(/Invalid proposal status/);
    });
  });

  describe('assertAgentId', () => {
    it('should not throw for valid agent ID', () => {
      expect(() => assertAgentId('claude')).not.toThrow();
      expect(() => assertAgentId('chatgpt')).not.toThrow();
    });

    it('should throw for invalid agent ID', () => {
      expect(() => assertAgentId('invalid')).toThrow(TypeError);
      expect(() => assertAgentId(null)).toThrow(TypeError);
    });

    it('should provide helpful error message', () => {
      expect(() => assertAgentId('invalid')).toThrow(/Invalid agent ID/);
    });
  });
});

describe('Type Safety Integration', () => {
  it('should ensure AGENT_ROLE_MAPPING has correct types', async () => {
    const types = await import('@shared/types');
    const { AGENT_ROLE_MAPPING } = types;

    Object.keys(AGENT_ROLE_MAPPING).forEach(agentId => {
      expect(isAgentId(agentId)).toBe(true);
      const role = AGENT_ROLE_MAPPING[agentId as keyof typeof AGENT_ROLE_MAPPING];
      expect(isAgentRole(role)).toBe(true);
    });
  });

  it('should ensure all agent IDs have display names', async () => {
    const types = await import('@shared/types');
    const { AGENT_DISPLAY_NAMES } = types;
    const validAgentIds = ['claude', 'chatgpt', 'grok', 'gemini', 'deepseek', 'qwen'];

    validAgentIds.forEach(agentId => {
      expect(AGENT_DISPLAY_NAMES).toHaveProperty(agentId);
      const displayName = AGENT_DISPLAY_NAMES[agentId as keyof typeof AGENT_DISPLAY_NAMES];
      expect(typeof displayName).toBe('string');
      expect(displayName.length).toBeGreaterThan(0);
    });
  });
});
