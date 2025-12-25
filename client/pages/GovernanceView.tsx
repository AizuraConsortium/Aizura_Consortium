import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProposalCard } from '@shared/components/proposals/ProposalCard';
import { VoteButton } from '../components/proposals/VoteButton';
import { EmptyState } from '../components/ui/EmptyState';
import { CardSkeleton } from '@shared/components/skeletons/CardSkeleton';
import { useProposals } from '@shared/hooks/useProposals';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@shared/components/ToastProvider';
import { api } from '../lib/api';
import { Vote, TrendingUp, BarChart3, CheckCircle, Clock, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';

export default function GovernanceView() {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { showError } = useToast();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

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

  const activeProposals = useMemo(() => {
    return allProposals.filter(p =>
      p.status === 'queued' || p.status === 'in_debate'
    );
  }, [allProposals]);

  const historicalProposals = useMemo(() => {
    return allProposals.filter(p =>
      p.status === 'adopted' || p.status === 'rejected'
    );
  }, [allProposals]);

  const handleProposalClick = (proposal: any) => {
    navigate(`/app/governance/${proposal.id}`);
  };

  const handleRetry = async () => {
    await refetchProposals();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Governance</h1>
          <p className="text-slate-400">Your participation in ecosystem governance</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Vote className="w-8 h-8 text-cyan-400" />
              <h3 className="font-bold text-white">Voting Power</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-1">TBD</div>
            <div className="text-sm text-slate-400">Coming soon</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-8 h-8 text-blue-400" />
              <h3 className="font-bold text-white">% of Supply</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-1">TBD</div>
            <div className="text-sm text-slate-400">Coming soon</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <h3 className="font-bold text-white">Participation Rate</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-1">TBD</div>
            <div className="text-sm text-slate-400">Coming soon</div>
          </div>
        </div>

        <div className="flex gap-4 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'active'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Active Votes ({activeProposals.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Vote History ({historicalProposals.length})</span>
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

        {activeTab === 'active' && (
          <div className="space-y-4">
            {proposalsLoading ? (
              <CardSkeleton count={3} theme="dark" />
            ) : activeProposals.length === 0 ? (
              <EmptyState
                icon={Vote}
                title="No active proposals"
                description="There are currently no proposals in voting. Check back soon!"
                variant="dark"
              />
            ) : (
              activeProposals.map(proposal => (
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
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {proposalsLoading ? (
              <CardSkeleton count={3} theme="dark" />
            ) : historicalProposals.length === 0 ? (
              <EmptyState
                icon={CheckCircle}
                title="No completed proposals"
                description="Your voting history will appear here once proposals are completed"
                variant="dark"
              />
            ) : (
              historicalProposals.map(proposal => (
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

                  {proposal.status === 'adopted' && (
                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Proposal Adopted</span>
                      </div>
                      <p className="text-sm text-green-300 mt-1">
                        This proposal was approved by the community
                      </p>
                    </div>
                  )}

                  {proposal.status === 'rejected' && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-center gap-2 text-red-400">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">Proposal Rejected</span>
                      </div>
                      <p className="text-sm text-red-300 mt-1">
                        This proposal did not receive enough support
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {!proposalsError && (
          <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl p-8 text-center">
            <Vote className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">View Live Governance</h3>
            <p className="text-slate-300 mb-6">
              See all active proposals and participate in ecosystem governance
            </p>
            <a
              href="/governance/live"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              Open Governance
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
