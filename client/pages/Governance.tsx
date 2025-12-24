import { useState } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../lib/api';
import { logApiError } from '../lib/logging/errorLogger';
import { useAuth } from '../contexts/AuthContext';
import { useProposals } from '@shared/hooks/useProposals';
import { ProposalList } from '@shared/components/proposals/ProposalList';
import { ProposalForm } from '@shared/components/proposals/ProposalForm';
import { Navigation } from '../components/layout/Navigation';

export default function Governance() {
  const { session } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState('');

  const {
    proposals,
    loading,
    error: loadError,
    refetch,
  } = useProposals({
    apiClient: api,
    token: session?.access_token,
    onError: (err) => {
      logApiError(err, '/client/proposals', 'GET', { component: 'Governance' });
    },
  });

  const handleCreateProposal = async (title: string, summary: string) => {
    setError('');

    try {
      const token = session?.access_token;
      await api.createProposal(title, summary, token);
      setShowCreateForm(false);
      refetch();
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
      refetch();
    } catch (error: any) {
      logApiError(error, `/client/proposals/${proposalId}/vote`, 'POST', {
        component: 'Governance',
        additionalData: { vote }
      });
      setError(error.message || 'Failed to vote');
    }
  };

  const displayError = error || loadError;

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

        {displayError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700" role="alert" aria-live="assertive">
            {displayError}
          </div>
        )}

        {showCreateForm && (
          <ProposalForm
            onSubmit={handleCreateProposal}
            onCancel={() => setShowCreateForm(false)}
            variant="light"
            enableDrafts
          />
        )}

        <ProposalList
          proposals={proposals}
          loading={loading}
          onVote={handleVote}
          variant="light"
          showVoteButtons
          emptyMessage="No proposals yet. Be the first to submit one!"
        />
      </main>
    </div>
  );
}
