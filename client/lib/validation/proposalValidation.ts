/**
 * Proposal Validation
 *
 * This file re-exports shared validation functions for backwards compatibility.
 * All validation logic is now centralized in @shared/utils/validation.
 */

import {
  PROPOSAL_VALIDATION_RULES,
  validateProposalTitle,
  validateProposalSummary,
  validateProposal,
  type ProposalValidationResult as ValidationResult
} from '@shared/utils/validation';

export {
  PROPOSAL_VALIDATION_RULES,
  validateProposalTitle,
  validateProposalSummary,
  validateProposal,
  type ValidationResult
};
