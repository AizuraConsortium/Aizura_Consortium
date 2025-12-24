import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Vote, TrendingUp, CheckCircle, Clock, ExternalLink, BarChart3 } from 'lucide-react';

export default function GovernanceView() {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const governancePower = {
    votingPower: '125,450',
    percentOfSupply: '0.12',
    participationRate: '87'
  };

  const activeVotes = [
    {
      id: '1',
      title: 'Update Revenue Distribution Parameters',
      yourVote: 'FOR',
      outcome: 'pending',
      timeRemaining: '3 days',
      votesFor: 78,
      votesAgainst: 22,
      quorum: 85
    },
    {
      id: '2',
      title: 'Approve New AI Agent Development',
      yourVote: null,
      outcome: 'pending',
      timeRemaining: '8 days',
      votesFor: 56,
      votesAgainst: 44,
      quorum: 62
    }
  ];

  const voteHistory = [
    {
      id: '1',
      title: 'Treasury Allocation for Q1 2025',
      yourVote: 'FOR',
      outcome: 'approved',
      executionStatus: 'executed',
      finalVotes: { for: 82, against: 18 }
    },
    {
      id: '2',
      title: 'Increase Proposal Threshold to 50,000 AAIC',
      yourVote: 'AGAINST',
      outcome: 'rejected',
      executionStatus: 'archived',
      finalVotes: { for: 38, against: 62 }
    },
    {
      id: '3',
      title: 'Platform Upgrade: Add Staking Module',
      yourVote: 'FOR',
      outcome: 'approved',
      executionStatus: 'in_progress',
      finalVotes: { for: 91, against: 9 }
    }
  ];

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
              <h3 className="font-bold text-white">Current Voting Power</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{governancePower.votingPower}</div>
            <div className="text-sm text-slate-400">AAIC tokens</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-8 h-8 text-blue-400" />
              <h3 className="font-bold text-white">% of Circulating Supply</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{governancePower.percentOfSupply}%</div>
            <div className="text-sm text-slate-400">Governance share</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <h3 className="font-bold text-white">Participation Rate</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{governancePower.participationRate}%</div>
            <div className="text-sm text-slate-400">Of eligible votes</div>
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
            Active Votes ({activeVotes.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Vote History ({voteHistory.length})
          </button>
        </div>

        {activeTab === 'active' && (
          <div className="space-y-4">
            {activeVotes.map((vote) => (
              <div
                key={vote.id}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-3">{vote.title}</h3>
                    <div className="flex items-center gap-3">
                      {vote.yourVote ? (
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          vote.yourVote === 'FOR' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          Your Vote: {vote.yourVote}
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-500/20 text-yellow-400">
                          Not Voted
                        </span>
                      )}
                      <span className="text-sm text-slate-400">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {vote.timeRemaining} remaining
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-sm text-slate-400 mb-1">FOR</div>
                    <div className="text-2xl font-bold text-green-400">{vote.votesFor}%</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-sm text-slate-400 mb-1">AGAINST</div>
                    <div className="text-2xl font-bold text-red-400">{vote.votesAgainst}%</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-sm text-slate-400 mb-1">Quorum</div>
                    <div className="text-2xl font-bold text-cyan-400">{vote.quorum}%</div>
                  </div>
                </div>

                {!vote.yourVote && (
                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                      Vote FOR
                    </button>
                    <button className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
                      Vote AGAINST
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {voteHistory.map((vote) => (
              <div
                key={vote.id}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-3">{vote.title}</h3>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        vote.yourVote === 'FOR' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        Your Vote: {vote.yourVote}
                      </span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        vote.outcome === 'approved' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {vote.outcome}
                      </span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        vote.executionStatus === 'executed' ? 'bg-green-500/20 text-green-400' :
                        vote.executionStatus === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {vote.executionStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-sm text-slate-400 mb-1">Final FOR</div>
                    <div className="text-xl font-bold text-green-400">{vote.finalVotes.for}%</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-sm text-slate-400 mb-1">Final AGAINST</div>
                    <div className="text-xl font-bold text-red-400">{vote.finalVotes.against}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
      </div>
    </DashboardLayout>
  );
}
