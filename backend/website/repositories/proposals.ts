/**
 * Website Proposals Repository
 *
 * Handles all proposal-related database queries for the public website backend.
 * Uses anon-key Supabase client for read-only access with proper RLS policies.
 *
 * Security Context: ANON_KEY (read-only, RLS enforced)
 */

import { getById, getMany } from './queryBuilder.js';
import type { Proposal } from '../../../shared/types/index.js';

/**
 * Retrieves all proposals, optionally filtered by status
 *
 * @param {string} [status] - Optional status filter (e.g., 'active', 'completed')
 * @returns {Promise<Proposal[]>} Array of proposals ordered by creation date (newest first)
 * @throws {Error} If database query fails
 * @example
 * // Get all proposals
 * const allProposals = await getProposals();
 *
 * // Get only active proposals
 * const activeProposals = await getProposals('active');
 */
export async function getProposals(status?: string): Promise<Proposal[]> {
  const filters = status ? { status } : undefined;

  return getMany<Proposal>(
    'proposals',
    filters,
    { orderBy: 'created_at', ascending: false }
  );
}

/**
 * Retrieves a specific proposal by ID
 *
 * @param {string} id - The proposal UUID
 * @returns {Promise<Proposal | null>} The requested proposal or null if not found
 * @example
 * const proposal = await getProposalById('abc-123');
 */
export async function getProposalById(id: string): Promise<Proposal | null> {
  try {
    return await getById<Proposal>('proposals', id);
  } catch (error) {
    return null;
  }
}
