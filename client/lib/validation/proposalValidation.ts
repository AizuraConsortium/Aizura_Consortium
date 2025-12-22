/**
 * Proposal Validation
 *
 * @deprecated This file now re-exports from @shared/utils/validation
 * Please update imports to use @shared/utils/validation directly:
 *
 * ```typescript
 * import { validateProposal, PROPOSAL_VALIDATION_RULES } from '@shared/utils/validation';
 * ```
 *
 * This file may be removed in future versions.
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
