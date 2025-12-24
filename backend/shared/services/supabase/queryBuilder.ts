import { getSupabaseClient } from './client.js';
import { createQueryBuilder, type WriteQueryBuilder } from './queryBuilderFactory.js';

export type { QueryOptions, FilterOptions } from './queryBuilderFactory.js';

const builder = createQueryBuilder(getSupabaseClient(), { readOnly: false }) as WriteQueryBuilder;

export const create = builder.create;
export const getById = builder.getById;
export const getOne = builder.getOne;
export const getMany = builder.getMany;
export const updateById = builder.updateById;
export const updateWhere = builder.updateWhere;
export const deleteById = builder.deleteById;
export const deleteWhere = builder.deleteWhere;
export const rpc = builder.rpc;
export const query = builder.query;
export const getClient = builder.getClient;
