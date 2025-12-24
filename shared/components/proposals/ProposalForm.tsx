import { useState } from 'react';
import { AlertCircle, Save } from 'lucide-react';
import { cn } from '@shared/styles/theme';
import { FormField } from '../ui/FormField';
import { useProposalForm } from '@shared/hooks/useProposalForm';

export interface ProposalFormProps {
  onSubmit: (title: string, summary: string) => Promise<void>;
  onCancel: () => void;
  variant?: 'light' | 'dark';
  enableDrafts?: boolean;
  showPreview?: boolean;
}

/**
 * ProposalForm Component
 *
 * Enhanced form for creating proposals with:
 * - Validation with real-time feedback
 * - Character counters
 * - Auto-save draft support
 * - Cancel confirmation if data exists
 * - Optional rich text preview
 * - Light/dark variant support
 *
 * @example
 * ```tsx
 * <ProposalForm
 *   onSubmit={handleCreateProposal}
 *   onCancel={() => setShowForm(false)}
 *   variant="light"
 *   enableDrafts
 * />
 * ```
 */
export function ProposalForm({
  onSubmit,
  onCancel,
  variant = 'light',
  enableDrafts = true,
  showPreview = false,
}: ProposalFormProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [preview, setPreview] = useState(false);

  const form = useProposalForm({
    onSubmit: async (data) => {
      await onSubmit(data.title, data.summary);
    },
    enableDrafts,
    draftKey: 'new-proposal-draft',
    autoSaveInterval: 2000,
  });

  const containerClasses = cn(
    'rounded-xl p-6 mb-6 shadow-sm',
    variant === 'light'
      ? 'bg-white border border-slate-200'
      : 'bg-slate-800 border border-slate-700'
  );

  const titleClasses = cn(
    'text-xl font-bold mb-4',
    variant === 'light' ? 'text-slate-900' : 'text-white'
  );

  const inputClasses = (hasError: boolean) =>
    cn(
      'w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-colors',
      variant === 'light'
        ? cn(
            'bg-white border text-slate-900',
            hasError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-slate-300 focus:ring-blue-500'
          )
        : cn(
            'bg-slate-900 border text-white',
            hasError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-slate-600 focus:ring-cyan-500'
          )
    );

  const buttonClasses = {
    primary: cn(
      'px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
      variant === 'light'
        ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white'
        : 'bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 text-slate-900'
    ),
    secondary: cn(
      'px-6 py-2 rounded-lg font-medium transition-colors',
      variant === 'light'
        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        : 'text-slate-300 hover:text-white hover:bg-slate-700'
    ),
    danger: cn(
      'px-4 py-2 rounded-lg font-medium transition-colors',
      variant === 'light'
        ? 'bg-red-600 hover:bg-red-700 text-white'
        : 'bg-red-500 hover:bg-red-600 text-white'
    ),
  };

  const handleCancel = () => {
    if (form.data.title || form.data.summary) {
      setShowCancelConfirm(true);
    } else {
      onCancel();
    }
  };

  const handleConfirmCancel = () => {
    form.reset();
    setShowCancelConfirm(false);
    onCancel();
  };

  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={titleClasses}>Create New Proposal</h3>
        {showPreview && (
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className={buttonClasses.secondary}
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
        )}
      </div>

      {form.hasDraft && (
        <div
          className={cn(
            'flex items-start space-x-3 p-4 rounded-lg mb-4',
            variant === 'light'
              ? 'bg-blue-50 border border-blue-200'
              : 'bg-blue-500/10 border border-blue-500/30'
          )}
        >
          <Save
            className={cn('w-5 h-5 shrink-0 mt-0.5', variant === 'light' ? 'text-blue-600' : 'text-blue-400')}
            aria-hidden="true"
          />
          <div className="flex-1">
            <p
              className={cn(
                'text-sm font-medium',
                variant === 'light' ? 'text-blue-900' : 'text-blue-300'
              )}
            >
              Draft saved
            </p>
            <p
              className={cn(
                'text-sm mt-1',
                variant === 'light' ? 'text-blue-700' : 'text-blue-400'
              )}
            >
              Your progress is automatically saved every few seconds.
            </p>
          </div>
        </div>
      )}

      {preview ? (
        <div className="space-y-4">
          <div>
            <h4
              className={cn(
                'text-lg font-bold mb-2',
                variant === 'light' ? 'text-slate-900' : 'text-white'
              )}
            >
              {form.data.title || 'Untitled Proposal'}
            </h4>
            <p className={variant === 'light' ? 'text-slate-600' : 'text-slate-300'}>
              {form.data.summary || 'No summary provided.'}
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit} className="space-y-4">
          <FormField
            label="Title"
            htmlFor="proposal-title"
            required
            error={form.touched.title ? form.errors.title : undefined}
            characterCount={form.characterCounts.title}
          >
            <input
              id="proposal-title"
              type="text"
              value={form.data.title}
              onChange={(e) => form.handleChange('title', e.target.value)}
              onBlur={() => form.handleBlur('title')}
              className={inputClasses(Boolean(form.touched.title && form.errors.title))}
              placeholder="AI-Powered Travel Booking Platform"
              maxLength={form.characterCounts.title.max}
              required
              aria-label="Proposal title"
              aria-invalid={Boolean(form.touched.title && form.errors.title)}
              aria-describedby={form.touched.title && form.errors.title ? 'title-error' : undefined}
            />
          </FormField>

          <FormField
            label="Summary"
            htmlFor="proposal-summary"
            required
            error={form.touched.summary ? form.errors.summary : undefined}
            characterCount={form.characterCounts.summary}
          >
            <textarea
              id="proposal-summary"
              value={form.data.summary}
              onChange={(e) => form.handleChange('summary', e.target.value)}
              onBlur={() => form.handleBlur('summary')}
              className={cn(
                inputClasses(Boolean(form.touched.summary && form.errors.summary)),
                'h-32 resize-none'
              )}
              placeholder="Describe your business idea in detail..."
              maxLength={form.characterCounts.summary.max}
              required
              aria-label="Proposal summary"
              aria-invalid={Boolean(form.touched.summary && form.errors.summary)}
              aria-describedby={
                form.touched.summary && form.errors.summary ? 'summary-error' : undefined
              }
            />
          </FormField>

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              disabled={form.submitting || !form.isValid}
              className={buttonClasses.primary}
            >
              {form.submitting ? 'Submitting...' : 'Submit Proposal'}
            </button>
            <button type="button" onClick={handleCancel} className={buttonClasses.secondary}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={cn('rounded-xl p-6 max-w-md w-full', containerClasses)}>
            <div className="flex items-start space-x-3 mb-4">
              <AlertCircle
                className={cn('w-6 h-6 shrink-0', variant === 'light' ? 'text-amber-600' : 'text-amber-400')}
                aria-hidden="true"
              />
              <div>
                <h4 className={cn('font-bold mb-2', variant === 'light' ? 'text-slate-900' : 'text-white')}>
                  Discard changes?
                </h4>
                <p className={variant === 'light' ? 'text-slate-600' : 'text-slate-300'}>
                  {enableDrafts
                    ? 'Your draft will be deleted. This action cannot be undone.'
                    : 'You have unsaved changes. Are you sure you want to discard them?'}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className={buttonClasses.secondary}
              >
                Keep Editing
              </button>
              <button onClick={handleConfirmCancel} className={buttonClasses.danger}>
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
