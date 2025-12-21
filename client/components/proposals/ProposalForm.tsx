import { useState } from 'react';
import { FormField } from '@shared/components/ui';
import {
  validateProposalTitle,
  validateProposalSummary,
  PROPOSAL_VALIDATION_RULES
} from '../../lib/validation/proposalValidation';

interface ProposalFormProps {
  onSubmit: (title: string, summary: string) => Promise<void>;
  onCancel: () => void;
}

export function ProposalForm({ onSubmit, onCancel }: ProposalFormProps) {
  const [newProposal, setNewProposal] = useState({ title: '', summary: '' });
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ title?: string; summary?: string }>({});

  const handleTitleBlur = () => {
    const error = validateProposalTitle(newProposal.title);
    setFieldErrors(prev => ({ ...prev, title: error || undefined }));
  };

  const handleSummaryBlur = () => {
    const error = validateProposalSummary(newProposal.summary);
    setFieldErrors(prev => ({ ...prev, summary: error || undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const titleError = validateProposalTitle(newProposal.title);
    const summaryError = validateProposalSummary(newProposal.summary);

    if (titleError || summaryError) {
      setFieldErrors({
        title: titleError || undefined,
        summary: summaryError || undefined,
      });
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(newProposal.title, newProposal.summary);
      setNewProposal({ title: '', summary: '' });
      setFieldErrors({});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Create New Proposal</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Title"
          htmlFor="proposal-title"
          required
          error={fieldErrors.title}
          characterCount={{ current: newProposal.title.length, max: PROPOSAL_VALIDATION_RULES.TITLE_MAX_LENGTH }}
        >
          <input
            id="proposal-title"
            type="text"
            value={newProposal.title}
            onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
            onBlur={handleTitleBlur}
            className={`w-full bg-white border rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              fieldErrors.title ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="AI-Powered Travel Booking Platform"
            maxLength={PROPOSAL_VALIDATION_RULES.TITLE_MAX_LENGTH}
            required
            aria-label="Proposal title"
            aria-invalid={!!fieldErrors.title}
            aria-describedby={fieldErrors.title ? 'title-error' : undefined}
          />
        </FormField>

        <FormField
          label="Summary"
          htmlFor="proposal-summary"
          required
          error={fieldErrors.summary}
          characterCount={{ current: newProposal.summary.length, max: PROPOSAL_VALIDATION_RULES.SUMMARY_MAX_LENGTH }}
        >
          <textarea
            id="proposal-summary"
            value={newProposal.summary}
            onChange={(e) => setNewProposal({ ...newProposal, summary: e.target.value })}
            onBlur={handleSummaryBlur}
            className={`w-full bg-white border rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 ${
              fieldErrors.summary ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Describe your business idea in detail..."
            maxLength={PROPOSAL_VALIDATION_RULES.SUMMARY_MAX_LENGTH}
            required
            aria-label="Proposal summary"
            aria-invalid={!!fieldErrors.summary}
            aria-describedby={fieldErrors.summary ? 'summary-error' : undefined}
          />
        </FormField>

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={submitting || !!fieldErrors.title || !!fieldErrors.summary}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit Proposal'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
