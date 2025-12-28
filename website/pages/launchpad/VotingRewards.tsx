import { PageLayout } from '../../components/layout/PageLayout';
import { Trophy, TrendingUp, Clock, Award } from 'lucide-react';

export default function VotingRewards() {
  return (
    <PageLayout
      title="Voting & Rewards"
      description="How voting weight works and how you earn rewards"
    >
      <div className="space-y-12">
        <section className="bg-linear-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">How Voting Works</h2>
          <div className="space-y-4 text-slate-300">
            <p>
              Your voting weight is directly proportional to your token holdings. The more tokens you hold,
              the more influence your vote carries.
            </p>
            <p>
              Voting is simple: FOR or AGAINST. Proposals need 60% approval to pass (with minimum 5% quorum).
            </p>
            <p className="text-cyan-400 font-medium">
              All votes are recorded on-chain and publicly visible.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Reward Mechanisms</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <Trophy className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Winning Side Rewards</h3>
              <p className="text-slate-300 mb-4">
                Vote with the majority? You earn a reward multiplier based on your voting weight.
              </p>
              <p className="text-sm text-slate-400">
                Example: If you voted FOR with 10k tokens and the proposal passes, you earn bonus tokens
                proportional to your contribution to the winning vote.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <Clock className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Early Voter Multiplier</h3>
              <p className="text-slate-300 mb-4">
                Vote early in the voting period to earn an additional bonus multiplier.
              </p>
              <p className="text-sm text-slate-400">
                First 24 hours: 1.5x bonus | Days 2-3: 1.3x | Days 4-5: 1.1x | After day 5: 1x
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <TrendingUp className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Consistency Bonus</h3>
              <p className="text-slate-300 mb-4">
                Vote on multiple proposals to build a consistency streak and earn cumulative bonuses.
              </p>
              <p className="text-sm text-slate-400">
                Vote on 5 proposals in a row: +5% rewards | 10 in a row: +10% | 20 in a row: +20%
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <Award className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Governance Power Boost</h3>
              <p className="text-slate-300 mb-4">
                Active voters gain increased governance weight over time, amplifying their influence.
              </p>
              <p className="text-sm text-slate-400">
                This ensures that engaged community members have a stronger voice in ecosystem decisions.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Example Reward Calculation</h2>
          <div className="space-y-3 text-slate-300">
            <p>
              Let's say you hold 10,000 tokens and vote FOR a proposal within the first 24 hours.
              The proposal passes with 70% approval.
            </p>
            <div className="bg-slate-900/50 rounded-lg p-4 space-y-2 font-mono text-sm">
              <div>Base voting weight: 10,000 tokens</div>
              <div>Early voter multiplier: 1.5x</div>
              <div>Winning side bonus: 1.2x</div>
              <div className="border-t border-slate-700 pt-2 mt-2 text-cyan-400">
                Total reward weight: 10,000 × 1.5 × 1.2 = 18,000 effective voting power
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-4">
              Rewards are distributed from the ecosystem treasury based on the total effective voting power
              of all winning-side voters.
            </p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
