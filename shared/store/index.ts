/**
 * Shared Store Utilities
 *
 * Reusable store patterns and middleware for Zustand.
 * Reduces boilerplate across admin, client, and website stores.
 *
 * Usage:
 *   import { createFilteredStore, createPaginatedStore } from '@shared/store';
 */

export * from './createFilteredStore';
export * from './createPaginatedStore';
export * from './middleware/syncToUrl';
