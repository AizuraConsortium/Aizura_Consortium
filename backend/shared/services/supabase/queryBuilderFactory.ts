import type { SupabaseClient } from '@supabase/supabase-js';

export interface QueryOptions {
  orderBy?: string;
  ascending?: boolean;
  limit?: number;
  offset?: number;
}

export interface FilterOptions {
  [key: string]: any;
}

export interface QueryBuilderOptions {
  readOnly?: boolean;
}

export interface ReadQueryBuilder {
  getById: <T>(table: string, id: string) => Promise<T>;
  getOne: <T>(table: string, filters: FilterOptions) => Promise<T | null>;
  getMany: <T>(table: string, filters?: FilterOptions, options?: QueryOptions) => Promise<T[]>;
  query: (table: string) => any;
  getClient: () => SupabaseClient;
}

export interface WriteQueryBuilder extends ReadQueryBuilder {
  create: <T>(table: string, data: Partial<T>) => Promise<T>;
  updateById: <T>(table: string, id: string, data: Partial<T>) => Promise<void>;
  updateWhere: <T>(table: string, filters: FilterOptions, data: Partial<T>) => Promise<void>;
  deleteById: (table: string, id: string) => Promise<void>;
  deleteWhere: (table: string, filters: FilterOptions) => Promise<void>;
  rpc: <T>(functionName: string, params?: Record<string, any>) => Promise<T>;
}

export type QueryBuilder = ReadQueryBuilder | WriteQueryBuilder;

export function createQueryBuilder(
  client: SupabaseClient,
  options: QueryBuilderOptions = {}
): QueryBuilder {
  const { readOnly = false } = options;

  async function getById<T>(table: string, id: string): Promise<T> {
    const { data, error } = await client
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async function getOne<T>(
    table: string,
    filters: FilterOptions
  ): Promise<T | null> {
    let query = client.from(table).select('*');

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

  async function getMany<T>(
    table: string,
    filters?: FilterOptions,
    options?: QueryOptions
  ): Promise<T[]> {
    let query = client.from(table).select('*');

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

  function query(table: string) {
    return client.from(table);
  }

  function getClient(): SupabaseClient {
    return client;
  }

  const readBuilder: ReadQueryBuilder = {
    getById,
    getOne,
    getMany,
    query,
    getClient
  };

  if (readOnly) {
    return readBuilder;
  }

  async function create<T>(table: string, data: Partial<T>): Promise<T> {
    const { data: result, error } = await client
      .from(table)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async function updateById<T>(
    table: string,
    id: string,
    data: Partial<T>
  ): Promise<void> {
    const { error } = await client.from(table).update(data).eq('id', id);

    if (error) throw error;
  }

  async function updateWhere<T>(
    table: string,
    filters: FilterOptions,
    data: Partial<T>
  ): Promise<void> {
    let query = client.from(table).update(data);

    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }

    const { error } = await query;

    if (error) throw error;
  }

  async function deleteById(table: string, id: string): Promise<void> {
    const { error } = await client.from(table).delete().eq('id', id);

    if (error) throw error;
  }

  async function deleteWhere(
    table: string,
    filters: FilterOptions
  ): Promise<void> {
    let query = client.from(table).delete();

    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }

    const { error } = await query;

    if (error) throw error;
  }

  async function rpc<T>(
    functionName: string,
    params?: Record<string, any>
  ): Promise<T> {
    const { data, error } = await client.rpc(functionName, params);

    if (error) throw error;
    return data;
  }

  const writeBuilder: WriteQueryBuilder = {
    ...readBuilder,
    create,
    updateById,
    updateWhere,
    deleteById,
    deleteWhere,
    rpc
  };

  return writeBuilder;
}
