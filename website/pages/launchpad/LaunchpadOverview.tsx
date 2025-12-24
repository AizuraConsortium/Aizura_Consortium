import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Lightbulb, Users, Cpu, Rocket, DollarSign, TrendingUp, Clock,
  CheckCircle2, AlertTriangle, Shield, Vote, Award, Eye, Filter,
  ArrowRight, Sparkles, BarChart3, Target, Zap
} from 'lucide-react';
import { useState } from 'react';

export default function LaunchpadOverview() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('most_votes');

  return (
    <PageLayout>
      <div className="space-y-20">
        <section className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-6">
            <Lightbulb className="w-4 h-4" />
            Where Ideas Become AI-Run Businesses
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Propose businesses.{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Let AI build them.
            </span>{' '}
            Govern the outcome.
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            The Launchpad is where the community submits ideas, votes on them, and triggers
            autonomous AI agents to launch real, revenue-generating businesses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button
              onClick={() => document.getElementById('live-proposals')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              View Active Proposals
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              to="/launchpad/submit"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              Submit a Proposal
              <Sparkles className="w-5 h-5" />
            </Link>
          </div>

          <p className="text-sm text-slate-400">
            No token sale. Participation-based ecosystem.
          </p>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">From idea to AI-managed business</h2>
          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            Every successful proposal follows this proven lifecycle, powered by autonomous AI agents
          </p>

          <div className="grid md:grid-cols-5 gap-6 lg:gap-8">
            <LifecycleStep
              number="1"
              icon={<Lightbulb className="w-8 h-8" />}
              title="Idea Submission"
              description="Community members submit business proposals"
              color="cyan"
            />
            <LifecycleStep
              number="2"
              icon={<Users className="w-8 h-8" />}
              title="Community Voting"
              description="Token-weighted votes decide what gets built"
              color="blue"
            />
            <LifecycleStep
              number="3"
              icon={<Cpu className="w-8 h-8" />}
              title="AI Development"
              description="Autonomous AI consortium designs & prepares the business"
              color="purple"
            />
            <LifecycleStep
              number="4"
              icon={<Rocket className="w-8 h-8" />}
              title="Launch"
              description="AI agents deploy and operate the business"
              color="green"
            />
            <LifecycleStep
              number="5"
              icon={<DollarSign className="w-8 h-8" />}
              title="Profitability"
              description="Revenue feeds back into the ecosystem"
              color="yellow"
            />
          </div>

          <div className="text-center mt-8">
            <Link
              to="/launchpad/lifecycle"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              View full lifecycle details
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section id="live-proposals">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Live Proposals</h2>
              <p className="text-slate-400">Real proposals from the community</p>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Filter by Status</label>
                <div className="flex flex-wrap gap-2">
                  <FilterButton
                    label="All"
                    active={statusFilter === 'all'}
                    onClick={() => setStatusFilter('all')}
                  />
                  <FilterButton
                    label="Proposed"
                    active={statusFilter === 'proposed'}
                    onClick={() => setStatusFilter('proposed')}
                  />
                  <FilterButton
                    label="In Development"
                    active={statusFilter === 'in_development'}
                    onClick={() => setStatusFilter('in_development')}
                  />
                  <FilterButton
                    label="Launched"
                    active={statusFilter === 'launched'}
                    onClick={() => setStatusFilter('launched')}
                  />
                  <FilterButton
                    label="Profitable"
                    active={statusFilter === 'profitable'}
                    onClick={() => setStatusFilter('profitable')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Sort By</label>
                <div className="flex flex-wrap gap-2">
                  <FilterButton
                    label="Most Votes"
                    active={sortBy === 'most_votes'}
                    onClick={() => setSortBy('most_votes')}
                  />
                  <FilterButton
                    label="Ending Soon"
                    active={sortBy === 'ending_soon'}
                    onClick={() => setSortBy('ending_soon')}
                  />
                  <FilterButton
                    label="Newest"
                    active={sortBy === 'newest'}
                    onClick={() => setSortBy('newest')}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <ProposalCard
              title="AI-Powered Social Media Manager"
              description="Autonomous social media management system that creates, schedules, and optimizes content across platforms"
              status="proposed"
              votes={{ for: 1567, against: 234 }}
              timeRemaining="3 days"
              minTokens={1000}
              category="SaaS"
            />
            <ProposalCard
              title="Decentralized Cloud Storage Platform"
              description="Distributed storage network with AI-driven optimization and automatic redundancy management"
              status="in_development"
              votes={{ for: 2134, against: 156 }}
              timeRemaining="In progress"
              minTokens={1000}
              category="Infrastructure"
            />
            <ProposalCard
              title="AI Trading Analytics Dashboard"
              description="Real-time market analysis and trading signals powered by ensemble AI models"
              status="launched"
              votes={{ for: 1876, against: 289 }}
              timeRemaining="Launched 2 weeks ago"
              minTokens={1000}
              category="Trading"
            />
            <ProposalCard
              title="Automated Content Monetization Platform"
              description="AI system that analyzes, categorizes, and monetizes digital content automatically"
              status="profitable"
              votes={{ for: 2456, against: 178 }}
              timeRemaining="Revenue: $12,450/mo"
              minTokens={1000}
              category="SaaS"
            />
            <ProposalCard
              title="AI-Driven Customer Support Bot Network"
              description="Multi-lingual, multi-platform customer support system that learns from interactions"
              status="proposed"
              votes={{ for: 892, against: 156 }}
              timeRemaining="5 days"
              minTokens={1000}
              category="SaaS"
            />
            <ProposalCard
              title="Blockchain Data Analytics Suite"
              description="Real-time on-chain analytics and insights for traders and researchers"
              status="proposed"
              votes={{ for: 1234, against: 345 }}
              timeRemaining="1 day"
              minTokens={1000}
              category="Data / Analytics"
            />
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-8 text-center">
            <Shield className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Connect Wallet to Vote</h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Sign in with your wallet to view full proposal details, participate in voting, and
              track your governance activity.
            </p>
            <Link
              to="/auth/sign-in"
              className="inline-block px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
            >
              Sign In to Participate
            </Link>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Proposal Statuses Explained</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatusCard
              icon={<Vote className="w-8 h-8 text-blue-400" />}
              title="Proposed"
              description="Open for community voting. Token holders decide if this business should be built."
              color="blue"
            />
            <StatusCard
              icon={<Cpu className="w-8 h-8 text-yellow-400" />}
              title="In Development"
              description="Approved! AI consortium is building the business plan and execution system."
              color="yellow"
            />
            <StatusCard
              icon={<Rocket className="w-8 h-8 text-green-400" />}
              title="Launched"
              description="Business is live and operational. AI agents are actively managing it."
              color="green"
            />
            <StatusCard
              icon={<DollarSign className="w-8 h-8 text-cyan-400" />}
              title="Profitable"
              description="Revenue distribution is active. Profits flow back to the ecosystem."
              color="cyan"
            />
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Why Participate in the Launchpad?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-cyan-500/20 rounded-xl">
                  <Target className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">For Proposers</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-white mb-1">Equity Stake in Approved Businesses</div>
                    <div className="text-sm text-slate-300">
                      Receive 5-15% equity allocation in businesses you propose that get approved
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-white mb-1">Performance-Based Rewards</div>
                    <div className="text-sm text-slate-300">
                      Your stake adjusts based on vote margin, engagement, and business performance
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-white mb-1">Recognition & Influence</div>
                    <div className="text-sm text-slate-300">
                      Listed as the original proposer with ongoing governance influence
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <Award className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">For Voters</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-white mb-1">Reward Pool for Winning Votes</div>
                    <div className="text-sm text-slate-300">
                      Voters on winning proposals receive rewards from the reward pool
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-white mb-1">Token-Weighted Voting Power</div>
                    <div className="text-sm text-slate-300">
                      Your voting power is proportional to tokens held, ensuring aligned incentives
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-white mb-1">Early Participation Advantages</div>
                    <div className="text-sm text-slate-300">
                      Higher multipliers for early votes on successful proposals
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/launchpad/voting-rewards"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Learn more about how rewards work
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <Eye className="w-8 h-8 text-cyan-400" />
            Transparency & Governance
          </h2>

          <p className="text-center text-slate-300 mb-8 max-w-2xl mx-auto">
            Every aspect of the Launchpad is designed for maximum transparency and community control
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <TransparencyCard
              icon={<Vote className="w-6 h-6 text-cyan-400" />}
              title="All Votes Transparent"
              description="Every vote is recorded on-chain and publicly viewable"
            />
            <TransparencyCard
              icon={<Shield className="w-6 h-6 text-green-400" />}
              title="Proposals Archived"
              description="Complete history maintained forever, including rejected proposals"
            />
            <TransparencyCard
              icon={<BarChart3 className="w-6 h-6 text-blue-400" />}
              title="Revenue Auditable"
              description="All revenue flows tracked and displayed in real-time"
            />
            <TransparencyCard
              icon={<Eye className="w-6 h-6 text-purple-400" />}
              title="Public Governance Rules"
              description="All rules and parameters visible and governed by community"
            />
          </div>

          <div className="text-center mt-8">
            <Link
              to="/governance/rules"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              View Governance Rules
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-8 lg:p-12 text-center">
          <Zap className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            The next AI-run business could start with your idea
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Submit a proposal today and let the community decide if it should be built by autonomous AI agents
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/launchpad/submit"
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Submit a Proposal
            </Link>
            <Link
              to="/governance"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Explore Governance
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function LifecycleStep({ number, icon, title, description, color }: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    cyan: 'text-cyan-400 bg-cyan-500/20',
    blue: 'text-blue-400 bg-blue-500/20',
    purple: 'text-purple-400 bg-purple-500/20',
    green: 'text-green-400 bg-green-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/20',
  };

  return (
    <div className="relative flex flex-col items-center text-center">
      <div className={`w-16 h-16 rounded-full ${colorMap[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
        {number}
      </div>
      <h3 className="font-bold text-white mb-2 text-sm">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-cyan-600 text-white'
          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
      }`}
    >
      {label}
    </button>
  );
}

function ProposalCard({ title, description, status, votes, timeRemaining, minTokens, category }: {
  title: string;
  description: string;
  status: 'proposed' | 'in_development' | 'launched' | 'profitable';
  votes: { for: number; against: number };
  timeRemaining: string;
  minTokens: number;
  category: string;
}) {
  const statusConfig = {
    proposed: { icon: <Vote className="w-4 h-4" />, label: 'Voting Open', color: 'text-blue-400', bg: 'bg-blue-500/20' },
    in_development: { icon: <Cpu className="w-4 h-4" />, label: 'In Development', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    launched: { icon: <Rocket className="w-4 h-4" />, label: 'Launched', color: 'text-green-400', bg: 'bg-green-500/20' },
    profitable: { icon: <DollarSign className="w-4 h-4" />, label: 'Profitable', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  };

  const config = statusConfig[status];
  const total = votes.for + votes.against;
  const percentage = Math.round((votes.for / total) * 100);

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded">
              {category}
            </span>
            <span className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded">
              Min: {minTokens} tokens
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
          <p className="text-sm text-slate-400 mb-3">{description}</p>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${config.bg} ${config.color}`}>
            {config.icon}
            <span>{config.label}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-green-400 font-medium">For: {votes.for.toLocaleString()}</span>
          <span className="text-red-400 font-medium">Against: {votes.against.toLocaleString()}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-green-500 to-cyan-500 h-2.5 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-xs text-slate-500 mt-1">{percentage}% approval</div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock className="w-4 h-4" />
          <span>{timeRemaining}</span>
        </div>
        <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}

function StatusCard({ icon, title, description, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/20',
    yellow: 'bg-yellow-500/20',
    green: 'bg-green-500/20',
    cyan: 'bg-cyan-500/20',
  };

  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6 text-center">
      <div className={`w-16 h-16 ${colorMap[color]} rounded-xl flex items-center justify-center mx-auto mb-4`}>
        {icon}
      </div>
      <h3 className="font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}

function TransparencyCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6">
      <div className="mb-3">{icon}</div>
      <h4 className="font-bold text-white mb-2 text-sm">{title}</h4>
      <p className="text-xs text-slate-400">{description}</p>
    </div>
  );
}
