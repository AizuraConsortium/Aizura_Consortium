export const PROPOSAL_VALIDATION_RULES = {
  TITLE_MAX_LENGTH: 200,
  TITLE_MIN_LENGTH: 3,
  SUMMARY_MAX_LENGTH: 5000,
  SUMMARY_MIN_LENGTH: 10,
} as const;

export interface ValidationResult {
  isValid: boolean;
  errors: {
    title?: string;
    summary?: string;
  };
}

export function validateProposalTitle(title: string): string | null {
  if (!title || title.trim().length === 0) {
    return 'Title is required';
  }

  if (title.trim().length < PROPOSAL_VALIDATION_RULES.TITLE_MIN_LENGTH) {
    return `Title must be at least ${PROPOSAL_VALIDATION_RULES.TITLE_MIN_LENGTH} characters`;
  }

  if (title.length > PROPOSAL_VALIDATION_RULES.TITLE_MAX_LENGTH) {
    return `Title must be ${PROPOSAL_VALIDATION_RULES.TITLE_MAX_LENGTH} characters or less`;
  }

  return null;
}

export function validateProposalSummary(summary: string): string | null {
  if (!summary || summary.trim().length === 0) {
    return 'Summary is required';
  }

  if (summary.trim().length < PROPOSAL_VALIDATION_RULES.SUMMARY_MIN_LENGTH) {
    return `Summary must be at least ${PROPOSAL_VALIDATION_RULES.SUMMARY_MIN_LENGTH} characters`;
  }

  if (summary.length > PROPOSAL_VALIDATION_RULES.SUMMARY_MAX_LENGTH) {
    return `Summary must be ${PROPOSAL_VALIDATION_RULES.SUMMARY_MAX_LENGTH} characters or less`;
  }

  return null;
}

export function validateProposal(title: string, summary: string): ValidationResult {
  const titleError = validateProposalTitle(title);
  const summaryError = validateProposalSummary(summary);

  return {
    isValid: !titleError && !summaryError,
    errors: {
      ...(titleError && { title: titleError }),
      ...(summaryError && { summary: summaryError }),
    },
  };
}
