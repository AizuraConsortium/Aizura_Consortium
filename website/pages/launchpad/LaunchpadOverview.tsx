import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import { PlusCircle, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function LaunchpadOverview() {
  return (
    <PageLayout
      title="Launchpad"
      description="Propose businesses, vote on ideas, and earn rewards"
    >
      <div className="space-y-12">
        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">12</div>
            <div className="text-slate-400">Active Proposals</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">8</div>
            <div className="text-slate-400">In Development</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">5</div>
            <div className="text-slate-400">Launched</div>
          </div>
        </section>

        <section className="bg-linear-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">How to Participate</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Submit a Proposal</h3>
              <p className="text-slate-300 text-sm mb-4">
                Have a business idea? Submit it for community voting. Minimum 1000 tokens required.
              </p>
              <Link
                to="/launchpad/submit"
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Submit Proposal
              </Link>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Vote & Earn Rewards</h3>
              <p className="text-slate-300 text-sm mb-4">
                Vote on proposals to help shape the ecosystem. Winning-side voters earn multipliers.
              </p>
              <Link
                to="/launchpad/voting-rewards"
                className="inline-block px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Learn About Rewards
              </Link>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Recent Proposals</h2>
          <div className="space-y-4">
            <ProposalCard
              title="AI-Powered Social Media Manager"
              status="voting"
              votes={{ for: 156, against: 43 }}
              timeRemaining="3 days"
            />
            <ProposalCard
              title="Decentralized Cloud Storage Platform"
              status="in_development"
              votes={{ for: 203, against: 12 }}
              timeRemaining="In progress"
            />
            <ProposalCard
              title="AI NFT Generator & Marketplace"
              status="launched"
              votes={{ for: 189, against: 34 }}
              timeRemaining="Launched"
            />
          </div>

          <div className="text-center mt-8">
            <p className="text-slate-400 text-sm mb-4">
              Sign in to view full proposal details and participate in voting
            </p>
            <Link
              to="/auth/sign-in"
              className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              Sign In to Participate
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

interface ProposalCardProps {
  title: string;
  status: 'voting' | 'in_development' | 'launched';
  votes: { for: number; against: number };
  timeRemaining: string;
}

function ProposalCard({ title, status, votes, timeRemaining }: ProposalCardProps) {
  const statusConfig = {
    voting: { icon: <Clock className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    in_development: { icon: <TrendingUp className="w-5 h-5" />, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    launched: { icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-400', bg: 'bg-green-500/20' },
  };

  const config = statusConfig[status];
  const total = votes.for + votes.against;
  const percentage = Math.round((votes.for / total) * 100);

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${config.bg} ${config.color}`}>
            {config.icon}
            <span className="capitalize">{status.replace('_', ' ')}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">{timeRemaining}</div>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-green-400">For: {votes.for}</span>
          <span className="text-red-400">Against: {votes.against}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
