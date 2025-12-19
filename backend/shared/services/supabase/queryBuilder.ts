import { getSupabaseClient } from './client.js';

export interface QueryOptions {
  orderBy?: string;
  ascending?: boolean;
  limit?: number;
  offset?: number;
}

export interface FilterOptions {
  [key: string]: any;
}

export async function create<T>(
  table: string,
  data: Partial<T>
): Promise<T> {
  const { data: result, error } = await getSupabaseClient()
    .from(table)
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function getById<T>(
  table: string,
  id: string
): Promise<T> {
  const { data, error } = await getSupabaseClient()
    .from(table)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getOne<T>(
  table: string,
  filters: FilterOptions
): Promise<T | null> {
  let query = getSupabaseClient()
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

export async function getMany<T>(
  table: string,
  filters?: FilterOptions,
  options?: QueryOptions
): Promise<T[]> {
  let query = getSupabaseClient()
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

export async function updateById<T>(
  table: string,
  id: string,
  data: Partial<T>
): Promise<void> {
  const { error } = await getSupabaseClient()
    .from(table)
    .update(data)
    .eq('id', id);

  if (error) throw error;
}

export async function updateWhere<T>(
  table: string,
  filters: FilterOptions,
  data: Partial<T>
): Promise<void> {
  let query = getSupabaseClient()
    .from(table)
    .update(data);

  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value);
  }

  const { error } = await query;

  if (error) throw error;
}

export async function deleteById(
  table: string,
  id: string
): Promise<void> {
  const { error } = await getSupabaseClient()
    .from(table)
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function deleteWhere(
  table: string,
  filters: FilterOptions
): Promise<void> {
  let query = getSupabaseClient()
    .from(table)
    .delete();

  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value);
  }

  const { error } = await query;

  if (error) throw error;
}

export async function rpc<T>(
  functionName: string,
  params?: Record<string, any>
): Promise<T> {
  const { data, error } = await getSupabaseClient()
    .rpc(functionName, params);

  if (error) throw error;
  return data;
}

export function query(table: string) {
  return getSupabaseClient().from(table);
}
