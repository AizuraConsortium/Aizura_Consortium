import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProposalCard } from '@shared/components/proposals/ProposalCard';
import { ProposalSubmitButton } from '../components/proposals/ProposalSubmitButton';
import { VoteButton } from '../components/proposals/VoteButton';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';
import { CardSkeleton } from '@shared/components/skeletons/CardSkeleton';
import { useProposals } from '@shared/hooks/useProposals';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@shared/components/ToastProvider';
import { api } from '../lib/api';
import { Rocket, FileText, Vote, RefreshCw, AlertCircle } from 'lucide-react';

export default function LaunchpadView() {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { showError } = useToast();
  const [activeTab, setActiveTab] = useState<'proposals' | 'votes'>('proposals');

  const {
    proposals: allProposals,
    loading: proposalsLoading,
    error: proposalsError,
    refetch: refetchProposals
  } = useProposals({
    apiClient: {
      getProposals: (token) => api.getProposals(token)
    },
    token: session?.access_token,
    autoRefetch: true,
    refetchInterval: 30000,
    onError: (err) => {
      showError('Failed to Load', err.message);
    }
  });

  const userProposals = useMemo(() => {
    return allProposals.filter(p => p.submitted_by === user?.id);
  }, [allProposals, user?.id]);

  const votedProposals = useMemo(() => {
    return allProposals.filter(p =>
      p.submitted_by !== user?.id
    );
  }, [allProposals, user?.id]);

  const handleProposalClick = (proposal: any) => {
    navigate(`/app/launchpad/${proposal.id}`);
  };

  const handleRetry = async () => {
    await refetchProposals();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Launchpad</h1>
            <p className="text-slate-400">Your proposals and votes</p>
          </div>
          <ProposalSubmitButton
            onProposalCreated={() => refetchProposals()}
            variant="primary"
            size="md"
          />
        </div>

        <div className="flex gap-4 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('proposals')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'proposals'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Your Proposals ({userProposals.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('votes')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'votes'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Vote className="w-4 h-4" />
              <span>Your Votes ({votedProposals.length})</span>
            </div>
          </button>
        </div>

        {proposalsError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-400 mb-2">
                  Failed to Load Proposals
                </h3>
                <p className="text-red-300 mb-4">
                  {proposalsError}
                </p>
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'proposals' && (
          <div className="space-y-4">
            {proposalsLoading ? (
              <CardSkeleton count={3} theme="dark" />
            ) : userProposals.length === 0 ? (
              <EmptyState
                icon={Rocket}
                title="No proposals yet"
                description="Submit your first business idea to the Aizura AI Consortium"
                action={
                  <ProposalSubmitButton
                    onProposalCreated={() => refetchProposals()}
                  />
                }
                variant="dark"
              />
            ) : (
              userProposals.map(proposal => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  variant="dark"
                  showVoteButtons={false}
                  showMetadata
                  onClick={handleProposalClick}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'votes' && (
          <div className="space-y-4">
            {proposalsLoading ? (
              <CardSkeleton count={3} theme="dark" />
            ) : votedProposals.length === 0 ? (
              <EmptyState
                icon={Vote}
                title="No votes cast yet"
                description="Browse active proposals in governance and cast your vote"
                action={
                  <button
                    onClick={() => navigate('/app/governance')}
                    className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
                  >
                    View Governance
                  </button>
                }
                variant="dark"
              />
            ) : (
              votedProposals.map(proposal => (
                <div
                  key={proposal.id}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors"
                >
                  <ProposalCard
                    proposal={proposal}
                    variant="dark"
                    showVoteButtons={false}
                    showMetadata
                    onClick={handleProposalClick}
                  />

                  <div className="mt-6 pt-6 border-t border-slate-700">
                    <VoteButton
                      proposalId={proposal.id}
                      onVoteChange={() => refetchProposals()}
                      variant="dark"
                      disabled={proposal.status !== 'queued' && proposal.status !== 'in_debate'}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {!proposalsError && (
          <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl p-8 text-center">
            <Rocket className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Explore Public Launchpad</h3>
            <p className="text-slate-300 mb-6">
              View all proposals, vote on ideas, and participate in the ecosystem
            </p>
            <a
              href="/launchpad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              Open Public Launchpad
            </a>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
