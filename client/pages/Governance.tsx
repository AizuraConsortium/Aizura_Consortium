import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../lib/api';
import { validateProposalTitle, validateProposalSummary } from '../lib/validation/proposalValidation';
import { logApiError } from '../lib/logging/errorLogger';
import { useAuth } from '../contexts/AuthContext';
import { CardSkeleton } from '@shared/components/skeletons';
import { Navigation, ProposalForm, ProposalCard } from '../components';

export default function Governance() {
  const { session } = useAuth();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      const data = await api.getProposals(session?.access_token);
      setProposals(data.proposals);
    } catch (error) {
      logApiError(error, '/client/proposals', 'GET', { component: 'Governance' });
      setError('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProposal = async (title: string, summary: string) => {
    const titleError = validateProposalTitle(title);
    const summaryError = validateProposalSummary(summary);

    if (titleError || summaryError) {
      const errorMsg = [titleError, summaryError].filter(Boolean).join('; ');
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setError('');

    try {
      const token = session?.access_token;
      await api.createProposal(title, summary, token);
      setShowCreateForm(false);
      loadProposals();
    } catch (error: any) {
      logApiError(error, '/client/proposals', 'POST', {
        component: 'Governance',
        additionalData: { titleLength: title.length, summaryLength: summary.length }
      });
      setError(error.message || 'Failed to create proposal');
      throw error;
    }
  };

  const handleVote = async (proposalId: string, vote: 'for' | 'against') => {
    try {
      const token = session?.access_token;
      if (!token) {
        setError('Please sign in to vote');
        return;
      }
      await api.voteOnProposal(proposalId, vote, token);
      loadProposals();
    } catch (error: any) {
      logApiError(error, `/client/proposals/${proposalId}/vote`, 'POST', {
        component: 'Governance',
        additionalData: { vote }
      });
      setError(error.message || 'Failed to vote');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Governance</h1>
            <p className="text-slate-600">
              Submit and vote on business proposals for the Aizura Consortium
            </p>
          </div>

          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            aria-label="Create new proposal"
            aria-expanded={showCreateForm}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" aria-hidden="true" />
            <span>New Proposal</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        {showCreateForm && (
          <ProposalForm
            onSubmit={handleCreateProposal}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {loading ? (
          <div className="space-y-4">
            <CardSkeleton count={3} />
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onVote={handleVote}
              />
            ))}

            {proposals.length === 0 && (
              <div className="text-center text-slate-500 py-12 bg-white border border-slate-200 rounded-xl">
                No proposals yet. Be the first to submit one!
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
