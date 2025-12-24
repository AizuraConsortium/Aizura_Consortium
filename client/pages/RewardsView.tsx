import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Award, DollarSign, CheckCircle, Clock, Lock, Info } from 'lucide-react';

export default function RewardsView() {
  const [activeTab, setActiveTab] = useState<'voting' | 'proposals' | 'ecosystem' | 'airdrop'>('voting');

  const rewardsSummary = {
    totalEarned: '8,230',
    totalClaimed: '6,985',
    pending: '1,245',
    vesting: '523'
  };

  const votingRewards = [
    {
      id: '1',
      source: 'AI Trading Bot - Winning Vote',
      amount: '450',
      status: 'claimable',
      claimableDate: 'Now',
      multiplier: '1.5x Early Voter'
    },
    {
      id: '2',
      source: 'Platform Upgrade - Winning Vote',
      amount: '320',
      status: 'pending',
      claimableDate: 'Dec 30, 2025',
      multiplier: '1.0x'
    },
    {
      id: '3',
      source: 'Treasury Allocation - Winning Vote',
      amount: '180',
      status: 'claimed',
      claimableDate: 'Claimed Dec 15',
      multiplier: '1.2x Consistent Voter'
    }
  ];

  const proposalRewards = [
    {
      id: '1',
      source: 'AI Web Dev Platform - Approved Proposal',
      amount: '2,500',
      status: 'vesting',
      claimableDate: 'Vesting over 12 months',
      vestedAmount: '625'
    },
    {
      id: '2',
      source: 'Automated Content Gen - Pending Approval',
      amount: '0',
      status: 'pending_approval',
      claimableDate: 'Vote in progress'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Rewards</h1>
          <p className="text-slate-400">Track and claim your participation rewards</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6">
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
              <Award className="w-4 h-4" />
              Total Earned
            </div>
            <div className="text-3xl font-bold text-white mb-1">{rewardsSummary.totalEarned}</div>
            <div className="text-sm text-slate-500">AAIC</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
              <CheckCircle className="w-4 h-4" />
              Total Claimed
            </div>
            <div className="text-3xl font-bold text-green-400 mb-1">{rewardsSummary.totalClaimed}</div>
            <div className="text-sm text-slate-500">AAIC</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
              <Clock className="w-4 h-4" />
              Pending
            </div>
            <div className="text-3xl font-bold text-yellow-400 mb-1">{rewardsSummary.pending}</div>
            <div className="text-sm text-slate-500">AAIC</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
              <Lock className="w-4 h-4" />
              Vesting
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-1">{rewardsSummary.vesting}</div>
            <div className="text-sm text-slate-500">AAIC</div>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white mb-2">Why Participation Matters</h3>
              <p className="text-sm text-slate-300">
                Voting on winning proposals, submitting approved ideas, and consistent participation earn you rewards.
                The more you engage with governance, the more you earn.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('voting')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'voting'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Voting Rewards
          </button>
          <button
            onClick={() => setActiveTab('proposals')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'proposals'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Proposal Rewards
          </button>
          <button
            onClick={() => setActiveTab('ecosystem')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'ecosystem'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Ecosystem Distributions
          </button>
          <button
            onClick={() => setActiveTab('airdrop')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'airdrop'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Airdrop
          </button>
        </div>

        {activeTab === 'voting' && (
          <div className="space-y-4">
            {votingRewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-2">{reward.source}</h3>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        reward.status === 'claimable' ? 'bg-green-500/20 text-green-400' :
                        reward.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {reward.status === 'claimable' ? 'Claimable' :
                         reward.status === 'pending' ? 'Pending' : 'Claimed'}
                      </span>
                      <span className="text-sm text-cyan-400">{reward.multiplier}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{reward.amount}</div>
                    <div className="text-sm text-slate-400">AAIC</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">{reward.claimableDate}</span>
                  {reward.status === 'claimable' && (
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                      Claim {reward.amount} AAIC
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'proposals' && (
          <div className="space-y-4">
            {proposalRewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-2">{reward.source}</h3>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      reward.status === 'vesting' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {reward.status === 'vesting' ? 'Vesting' : 'Pending Approval'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{reward.amount}</div>
                    <div className="text-sm text-slate-400">AAIC</div>
                  </div>
                </div>
                {reward.status === 'vesting' && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400">Vested Amount</span>
                      <span className="text-white font-medium">{reward.vestedAmount} AAIC</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Vesting Schedule</span>
                      <span className="text-white">{reward.claimableDate}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ecosystem' && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
            <DollarSign className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No ecosystem distributions yet</p>
            <p className="text-sm text-slate-500 mt-2">
              Future revenue distributions will appear here
            </p>
          </div>
        )}

        {activeTab === 'airdrop' && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
            <Award className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">Airdrop allocations coming soon</p>
            <p className="text-sm text-slate-500 mt-2">
              Airdrop details will be announced when ready
            </p>
          </div>
        )}

        <button className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors text-lg">
          Claim All Available Rewards ({rewardsSummary.pending} AAIC)
        </button>
      </div>
    </DashboardLayout>
  );
}
