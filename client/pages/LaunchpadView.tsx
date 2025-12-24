import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Rocket, Plus, CheckCircle, XCircle, Clock, ArrowRight, ExternalLink } from 'lucide-react';

export default function LaunchpadView() {
  const [activeTab, setActiveTab] = useState<'proposals' | 'votes'>('proposals');

  const yourProposals = [
    {
      id: '1',
      title: 'Automated Content Generation Platform',
      status: 'voting',
      votesFor: 45,
      votesAgainst: 55,
      timeRemaining: '12 days',
      aiProgress: null
    },
    {
      id: '2',
      title: 'DeFi Portfolio Optimizer',
      status: 'approved',
      votesFor: 78,
      votesAgainst: 22,
      timeRemaining: 'Completed',
      aiProgress: 'Planning Phase - 35%'
    }
  ];

  const yourVotes = [
    {
      id: '1',
      proposalTitle: 'AI Trading Bot for DeFi Markets',
      yourVote: 'FOR',
      votingPower: '125,450',
      outcome: 'pending',
      votesFor: 67,
      votesAgainst: 33
    },
    {
      id: '3',
      proposalTitle: 'Blockchain Analytics Dashboard',
      yourVote: 'AGAINST',
      votingPower: '125,450',
      outcome: 'pending',
      votesFor: 42,
      votesAgainst: 58
    },
    {
      id: '4',
      proposalTitle: 'AI Web Dev Platform',
      yourVote: 'FOR',
      votingPower: '125,450',
      outcome: 'approved',
      votesFor: 85,
      votesAgainst: 15
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Launchpad</h1>
            <p className="text-slate-400">Your proposals and votes</p>
          </div>
          <Link
            to="/launchpad/submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Submit Proposal
          </Link>
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
            Your Proposals ({yourProposals.length})
          </button>
          <button
            onClick={() => setActiveTab('votes')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'votes'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Your Votes ({yourVotes.length})
          </button>
        </div>

        {activeTab === 'proposals' && (
          <div className="space-y-4">
            {yourProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Rocket className="w-5 h-5 text-cyan-400" />
                      <h3 className="font-bold text-white text-lg">{proposal.title}</h3>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        proposal.status === 'voting' ? 'bg-blue-500/20 text-blue-400' :
                        proposal.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {proposal.status}
                      </span>
                      <span className="text-sm text-slate-400">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {proposal.timeRemaining}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-sm text-slate-400 mb-1">Votes FOR</div>
                    <div className="text-2xl font-bold text-green-400">{proposal.votesFor}%</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-sm text-slate-400 mb-1">Votes AGAINST</div>
                    <div className="text-2xl font-bold text-red-400">{proposal.votesAgainst}%</div>
                  </div>
                </div>

                {proposal.aiProgress && (
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-cyan-400 mb-2">
                      <CheckCircle className="w-4 h-4" />
                      AI Development Progress
                    </div>
                    <div className="text-white font-medium">{proposal.aiProgress}</div>
                  </div>
                )}

                <Link
                  to={`/app/launchpad/${proposal.id}`}
                  className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'votes' && (
          <div className="space-y-4">
            {yourVotes.map((vote) => (
              <div
                key={vote.id}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-3">{vote.proposalTitle}</h3>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        vote.yourVote === 'FOR' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        Your Vote: {vote.yourVote}
                      </span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        vote.outcome === 'approved' ? 'bg-cyan-500/20 text-cyan-400' :
                        vote.outcome === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {vote.outcome === 'pending' ? 'Voting in Progress' : vote.outcome}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-sm text-slate-400 mb-1">Your Voting Power</div>
                    <div className="text-lg font-bold text-white">{vote.votingPower}</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-sm text-slate-400 mb-1">FOR</div>
                    <div className="text-lg font-bold text-green-400">{vote.votesFor}%</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-sm text-slate-400 mb-1">AGAINST</div>
                    <div className="text-lg font-bold text-red-400">{vote.votesAgainst}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
            Open Launchpad
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
