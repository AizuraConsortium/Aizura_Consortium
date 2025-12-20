import { useState } from 'react';
import { FormField } from '@shared/components/ui';

interface ProposalFormProps {
  onSubmit: (title: string, summary: string) => Promise<void>;
  onCancel: () => void;
}

export function ProposalForm({ onSubmit, onCancel }: ProposalFormProps) {
  const [newProposal, setNewProposal] = useState({ title: '', summary: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProposal.title || !newProposal.summary) return;

    setSubmitting(true);
    try {
      await onSubmit(newProposal.title, newProposal.summary);
      setNewProposal({ title: '', summary: '' });
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
          characterCount={{ current: newProposal.title.length, max: 200 }}
        >
          <input
            id="proposal-title"
            type="text"
            value={newProposal.title}
            onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="AI-Powered Travel Booking Platform"
            maxLength={200}
            required
            aria-label="Proposal title"
          />
        </FormField>

        <FormField
          label="Summary"
          htmlFor="proposal-summary"
          required
          characterCount={{ current: newProposal.summary.length, max: 5000 }}
        >
          <textarea
            id="proposal-summary"
            value={newProposal.summary}
            onChange={(e) => setNewProposal({ ...newProposal, summary: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            placeholder="Describe your business idea in detail..."
            maxLength={5000}
            required
            aria-label="Proposal summary"
          />
        </FormField>

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
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
