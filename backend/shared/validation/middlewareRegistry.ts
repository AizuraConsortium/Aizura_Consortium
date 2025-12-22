/**
 * Validation Middleware Registry
 *
 * Central registry of all validation middleware for consistent usage across routes.
 * Provides type-safe, well-documented validation functions.
 */

import { z } from 'zod';
import { createBodyValidator, createQueryValidator } from './schemas.js';
import {
  validateProposal as legacyValidateProposal,
  validateVote as legacyValidateVote,
} from '../middleware/validation.js';

/**
 * Proposal Validation Schemas
 */
export const proposalCreateSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must not exceed 200 characters'),
  summary: z
    .string()
    .min(20, 'Summary must be at least 20 characters')
    .max(2000, 'Summary must not exceed 2000 characters'),
});

export const voteSchema = z.object({
  vote: z.enum(['for', 'against'], {
    errorMap: () => ({ message: 'Vote must be either "for" or "against"' }),
  }),
});

/**
 * User Management Schemas
 */
export const userRoleUpdateSchema = z.object({
  role: z.enum(['admin', 'client', 'agent'], {
    errorMap: () => ({ message: 'Role must be one of: admin, client, agent' }),
  }),
});

export const userCreateSchema = z.object({
  email: z.string().email('Must be a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters'),
  role: z
    .enum(['admin', 'client', 'agent'])
    .optional()
    .default('client'),
});

/**
 * Pagination Schema
 */
export const paginationQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 50))
    .pipe(z.number().int().min(1).max(100)),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0))
    .pipe(z.number().int().min(0)),
});

/**
 * Filter Schemas
 */
export const errorFilterSchema = z.object({
  severity: z.enum(['info', 'warning', 'error', 'critical']).optional(),
  source: z.enum(['frontend', 'backend', 'agent']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const auditFilterSchema = z.object({
  admin_user_id: z.string().uuid().optional(),
  action_type: z.string().optional(),
  resource_type: z.string().optional(),
  status: z.enum(['success', 'failed']).optional(),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 50))
    .pipe(z.number().int().min(1).max(100)),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0))
    .pipe(z.number().int().min(0)),
});

/**
 * Orchestrator Schema
 */
export const orchestratorCommandSchema = z.object({
  command: z.enum(['start', 'stop', 'pause', 'resume'], {
    errorMap: () => ({ message: 'Invalid orchestrator command' }),
  }),
});

/**
 * Validation Middleware Registry
 * Export all validation middleware for use in routes
 */
export const ValidationMiddleware = {
  // Proposal validation
  validateProposal: legacyValidateProposal, // Keep existing implementation for compatibility
  validateProposalCreate: createBodyValidator(proposalCreateSchema),
  validateVote: legacyValidateVote, // Keep existing implementation
  validateVoteBody: createBodyValidator(voteSchema),

  // User validation
  validateUserRoleUpdate: createBodyValidator(userRoleUpdateSchema),
  validateUserCreate: createBodyValidator(userCreateSchema),

  // Query parameter validation
  validatePagination: createQueryValidator(paginationQuerySchema),
  validateErrorFilters: createQueryValidator(errorFilterSchema),
  validateAuditFilters: createQueryValidator(auditFilterSchema),

  // Orchestrator validation
  validateOrchestratorCommand: createBodyValidator(orchestratorCommandSchema),
};

/**
 * Re-export for convenience
 */
export const {
  validateProposal,
  validateProposalCreate,
  validateVote,
  validateVoteBody,
  validateUserRoleUpdate,
  validateUserCreate,
  validatePagination,
  validateErrorFilters,
  validateAuditFilters,
  validateOrchestratorCommand,
} = ValidationMiddleware;
