/**
 * Website Query Builder
 *
 * Provides read-only database access utilities for the public website backend.
 * Uses ANON_KEY Supabase client for proper RLS enforcement and least privilege access.
 *
 * Security Context: ANON_KEY (read-only, RLS enforced)
 *
 * IMPORTANT: This module intentionally omits write operations (create, update, delete)
 * to maintain security boundaries. All public website queries should use these utilities.
 */

import { websiteSupabase } from '../config/supabaseWebsiteClient.js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { QueryOptions, FilterOptions } from '../../../shared/types/index.js';

export type { QueryOptions, FilterOptions };

/**
 * Retrieves a single record by ID
 *
 * @param {string} table - The table name to query
 * @param {string} id - The record ID
 * @returns {Promise<T>} The requested record
 * @throws {Error} If record not found or query fails
 * @example
 * const topic = await getById<Topic>('topics', 'abc-123');
 */
export async function getById<T>(
  table: string,
  id: string
): Promise<T> {
  const { data, error } = await websiteSupabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Retrieves a single record matching filters
 *
 * @param {string} table - The table name to query
 * @param {FilterOptions} filters - Key-value pairs to filter by
 * @returns {Promise<T | null>} The matching record or null if not found
 * @throws {Error} If query fails
 * @example
 * const topic = await getOne<Topic>('topics', { ended_at: null });
 */
export async function getOne<T>(
  table: string,
  filters: FilterOptions
): Promise<T | null> {
  let query = websiteSupabase
    .from(table)
    .select('*');

  for (const [key, value] of Object.entries(filters)) {
    if (value === null) {
      query = query.is(key, null);
    } else {
      query = query.eq(key, value);
    }
  }

  const { data, error } = await query.maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Retrieves multiple records matching filters and options
 *
 * @param {string} table - The table name to query
 * @param {FilterOptions} [filters] - Optional key-value pairs to filter by
 * @param {QueryOptions} [options] - Optional query options (orderBy, limit, offset)
 * @returns {Promise<T[]>} Array of matching records (empty array if none found)
 * @throws {Error} If query fails
 * @example
 * const proposals = await getMany<Proposal>('proposals',
 *   { status: 'active' },
 *   { orderBy: 'created_at', ascending: false, limit: 10 }
 * );
 */
export async function getMany<T>(
  table: string,
  filters?: FilterOptions,
  options?: QueryOptions
): Promise<T[]> {
  let query = websiteSupabase
    .from(table)
    .select('*');

  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value === null) {
        query = query.is(key, null);
      } else if (Array.isArray(value)) {
        query = query.in(key, value);
      } else {
        query = query.eq(key, value);
      }
    }
  }

  if (options?.orderBy) {
    query = query.order(options.orderBy, {
      ascending: options.ascending ?? false
    });
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 10) - 1
    );
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

/**
 * Returns the raw Supabase query builder for custom queries
 *
 * Use this when you need to build complex queries not covered by helper functions.
 * Remember: This client uses ANON_KEY with RLS enforcement.
 *
 * @param {string} table - The table name to query
 * @returns {SupabaseQueryBuilder} Supabase query builder instance
 * @example
 * const { data, error } = await query('topics')
 *   .select('*, proposals(*)')
 *   .is('ended_at', null)
 *   .single();
 */
export function query(table: string) {
  return websiteSupabase.from(table);
}

/**
 * Returns the raw Supabase client instance
 *
 * Use sparingly. Prefer using query builder functions above for consistency.
 *
 * @returns {SupabaseClient} The website Supabase client (ANON_KEY)
 */
export function getClient(): SupabaseClient {
  return websiteSupabase;
}
