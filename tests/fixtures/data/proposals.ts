import type { Proposal } from '../../../shared/types/index.js';

export const mockProposal1: Proposal = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Implement New Feature X',
  summary: 'A comprehensive proposal to implement Feature X with proper testing',
  submitted_by: 'user@example.com',
  status: 'queued',
  votes_for: 0,
  votes_against: 0,
  voting_ends_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const mockProposal2: Proposal = {
  id: '223e4567-e89b-12d3-a456-426614174001',
  title: 'Update Security Protocols',
  summary: 'Enhance security measures across the platform',
  submitted_by: 'admin@example.com',
  status: 'in_debate',
  votes_for: 3,
  votes_against: 1,
  voting_ends_at: new Date(Date.now() + 86400000).toISOString(),
  created_at: new Date(Date.now() - 3600000).toISOString(),
  updated_at: new Date().toISOString()
};

export const mockProposals = [mockProposal1, mockProposal2];
