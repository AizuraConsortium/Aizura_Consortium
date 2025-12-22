import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  validateProposalTitle,
  validateProposalSummary,
  PROPOSAL_VALIDATION_RULES,
} from '@shared/utils/validation';

export interface ProposalFormData {
  title: string;
  summary: string;
}

export interface ProposalFormErrors {
  title?: string;
  summary?: string;
}

export interface UseProposalFormConfig {
  onSubmit: (data: ProposalFormData) => Promise<void>;
  enableDrafts?: boolean;
  draftKey?: string;
  autoSaveInterval?: number;
}

export interface UseProposalFormReturn {
  data: ProposalFormData;
  errors: ProposalFormErrors;
  submitting: boolean;
  touched: {
    title: boolean;
    summary: boolean;
  };
  handleChange: (field: keyof ProposalFormData, value: string) => void;
  handleBlur: (field: keyof ProposalFormData) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  reset: () => void;
  validateField: (field: keyof ProposalFormData) => string | null;
  isValid: boolean;
  clearDraft: () => void;
  hasDraft: boolean;
  characterCounts: {
    title: { current: number; max: number };
    summary: { current: number; max: number };
  };
}

const DEFAULT_DATA: ProposalFormData = {
  title: '',
  summary: '',
};

/**
 * useProposalForm Hook
 *
 * Extract form logic from component with:
 * - Validation with real-time feedback
 * - Auto-save draft support
 * - Character counters
 * - Touch tracking
 * - Submit handling
 *
 * @example
 * ```tsx
 * const form = useProposalForm({
 *   onSubmit: async (data) => {
 *     await api.createProposal(data.title, data.summary);
 *   },
 *   enableDrafts: true,
 *   draftKey: 'new-proposal-draft',
 * });
 *
 * <form onSubmit={form.handleSubmit}>
 *   <input
 *     value={form.data.title}
 *     onChange={(e) => form.handleChange('title', e.target.value)}
 *     onBlur={() => form.handleBlur('title')}
 *   />
 * </form>
 * ```
 *
 * @param config - Configuration object
 * @returns Form state and handlers
 */
export function useProposalForm({
  onSubmit,
  enableDrafts = false,
  draftKey = 'proposal-draft',
  autoSaveInterval = 2000,
}: UseProposalFormConfig): UseProposalFormReturn {
  const [draft, setDraft, clearDraft] = useLocalStorage<ProposalFormData | null>(
    enableDrafts ? draftKey : '__disabled__',
    null
  );

  const [data, setData] = useState<ProposalFormData>(draft || DEFAULT_DATA);
  const [errors, setErrors] = useState<ProposalFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({
    title: false,
    summary: false,
  });

  const hasDraft = Boolean(draft && (draft.title || draft.summary));

  const validateField = useCallback((field: keyof ProposalFormData): string | null => {
    if (field === 'title') {
      return validateProposalTitle(data.title);
    } else if (field === 'summary') {
      return validateProposalSummary(data.summary);
    }
    return null;
  }, [data]);

  const isValid =
    !validateProposalTitle(data.title) && !validateProposalSummary(data.summary);

  const handleChange = useCallback(
    (field: keyof ProposalFormData, value: string) => {
      setData((prev) => ({ ...prev, [field]: value }));

      if (touched[field]) {
        const error = field === 'title'
          ? validateProposalTitle(value)
          : validateProposalSummary(value);
        setErrors((prev) => ({ ...prev, [field]: error || undefined }));
      }
    },
    [touched]
  );

  const handleBlur = useCallback(
    (field: keyof ProposalFormData) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const error = validateField(field);
      setErrors((prev) => ({ ...prev, [field]: error || undefined }));
    },
    [validateField]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const titleError = validateProposalTitle(data.title);
      const summaryError = validateProposalSummary(data.summary);

      if (titleError || summaryError) {
        setErrors({
          title: titleError || undefined,
          summary: summaryError || undefined,
        });
        setTouched({ title: true, summary: true });
        return;
      }

      setSubmitting(true);
      try {
        await onSubmit(data);
        setData(DEFAULT_DATA);
        setErrors({});
        setTouched({ title: false, summary: false });
        if (enableDrafts) {
          clearDraft();
        }
      } catch (error) {
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    [data, onSubmit, enableDrafts, clearDraft]
  );

  const reset = useCallback(() => {
    setData(DEFAULT_DATA);
    setErrors({});
    setTouched({ title: false, summary: false });
    if (enableDrafts) {
      clearDraft();
    }
  }, [enableDrafts, clearDraft]);

  useEffect(() => {
    if (!enableDrafts) return;

    const timer = setTimeout(() => {
      if (data.title || data.summary) {
        setDraft(data);
      }
    }, autoSaveInterval);

    return () => clearTimeout(timer);
  }, [data, enableDrafts, autoSaveInterval, setDraft]);

  const characterCounts = {
    title: {
      current: data.title.length,
      max: PROPOSAL_VALIDATION_RULES.TITLE_MAX_LENGTH,
    },
    summary: {
      current: data.summary.length,
      max: PROPOSAL_VALIDATION_RULES.SUMMARY_MAX_LENGTH,
    },
  };

  return {
    data,
    errors,
    submitting,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    validateField,
    isValid,
    clearDraft,
    hasDraft,
    characterCounts,
  };
}
