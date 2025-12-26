import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/layout/Navigation';
import { Footer } from '../components/layout/Footer';
import {
  Sparkles, TrendingUp, Zap, Users, Clock, Rocket, FileText, Vote, Cpu, DollarSign,
  MessageSquare, BarChart3, Shield, ArrowRight, CheckCircle2
} from 'lucide-react';

export default function NewHome() {
  const [connectWalletModal, setConnectWalletModal] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      <div className="relative">
        <Navigation onConnectWallet={() => setConnectWalletModal(true)} />

        <main id="main-content">
          <HeroSection />
          <FivePhaseSection />
          <WhyAIWinsSection />
          <UseToEarnSection />
          <PortfolioPreviewSection />
          <FoundationProofSection />
          <LaunchpadTeaserSection />
          <TokenAirdropSection />
          <LiveGovernanceSection />
          <CommunitySection />
          <FinalCTASection />
        </main>

        <Footer />
      </div>

      {connectWalletModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Connect Wallet</h2>
            <p className="text-slate-300 mb-6">
              Wallet connection coming soon. Sign in to participate in governance and track your portfolio.
            </p>
            <button
              onClick={() => setConnectWalletModal(false)}
              className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Autonomous AI launches businesses.{' '}
            <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              The community governs.
            </span>{' '}
            The ecosystem compounds.
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
            A decentralized platform where token holders propose and vote on businesses — then autonomous AI agents build and operate them. Profits feed back into the ecosystem through transparent distributions and long-term token value mechanics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Link
              to="/launchpad"
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors text-center"
            >
              Explore the Launchpad
            </Link>
            <Link
              to="/token/airdrop"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors text-center"
            >
              Check Airdrop Eligibility
            </Link>
          </div>
          <p className="text-sm text-slate-400">
            The first Use-to-Earn ecosystem: Use services, earn tokens. No speculation required.
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            Live Snapshot
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Proposals Live" value="12" />
            <StatCard label="In Development" value="8" />
            <StatCard label="Businesses Launched" value="5" />
            <StatCard label="Monthly Revenue" value="$77k" />
            <StatCard label="Tokens Distributed" value="2.4M" />
            <StatCard label="Total Burned" value="180k" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-4">
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

function FivePhaseSection() {
  const phases = [
    {
      icon: <FileText className="w-10 h-10" />,
      title: 'Submit',
      subtitle: 'Proposed',
      description: 'Submit a business idea. Define goals, scope, and success metrics.',
    },
    {
      icon: <Vote className="w-10 h-10" />,
      title: 'Vote',
      subtitle: 'Community Governance',
      description: 'Token holders vote FOR or AGAINST. Voting weight matches holdings.',
    },
    {
      icon: <Cpu className="w-10 h-10" />,
      title: 'AI Builds',
      subtitle: 'In Development',
      description: 'The AI Consortium designs the business plan and execution system.',
    },
    {
      icon: <Rocket className="w-10 h-10" />,
      title: 'Launch',
      subtitle: 'Live Operation',
      description: 'AI agents deploy the product, operations, and growth loops.',
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: 'Profit & Scale',
      subtitle: 'Revenue Flows',
      description: 'Revenue flows into transparent distributions and ecosystem growth.',
    },
  ];

  return (
    <section className="bg-slate-900/80 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            From ideas to AI-run revenue — in 5 phases.
          </h2>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {phases.map((phase, idx) => (
            <div
              key={idx}
              className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-colors"
            >
              <div className="text-cyan-400 mb-4 flex justify-center">{phase.icon}</div>
              <h3 className="text-xl font-bold text-white mb-1">{phase.title}</h3>
              <p className="text-sm text-cyan-400 mb-3">{phase.subtitle}</p>
              <p className="text-sm text-slate-300">{phase.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/launchpad"
            className="inline-block px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
          >
            See active proposals in real time →
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhyAIWinsSection() {
  const reasons = [
    {
      icon: <Clock className="w-12 h-12 text-blue-400" />,
      title: '24/7 execution',
      description: "AI doesn't sleep — operations, support, marketing run continuously.",
    },
    {
      icon: <Zap className="w-12 h-12 text-yellow-400" />,
      title: 'Compound learning',
      description: 'Every launched business improves the next.',
    },
    {
      icon: <Users className="w-12 h-12 text-green-400" />,
      title: 'Zero emotional decision making',
      description: 'Data-driven, objective execution.',
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-purple-400" />,
      title: 'Infinite scalability',
      description: 'More proposals → more launches → more revenue loops.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Why AI-owned businesses scale faster.
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {reasons.map((reason, idx) => (
          <div
            key={idx}
            className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-colors"
          >
            <div className="mb-4 flex justify-center">{reason.icon}</div>
            <h3 className="text-xl font-bold text-white mb-3">{reason.title}</h3>
            <p className="text-slate-300">{reason.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-lg text-cyan-400 font-medium">
          As AI gets smarter, so does the entire ecosystem.
        </p>
      </div>
    </section>
  );
}

function UseToEarnSection() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/website/u2e/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch U2E stats:', error);
      }
    }
    fetchStats();
  }, []);

  return (
    <section className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            First-Ever Sustainable Model
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            The First-Ever Use-to-Earn Ecosystem
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Use our services, earn AAIC tokens. No gimmicks, just sustainable rewards backed by real AI-driven profits.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 text-center hover:border-green-500/50 transition-colors">
            <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Real Usage = Real Rewards</h3>
            <p className="text-slate-300">
              Earn tokens for actual platform usage, not speculation. Every action you take generates rewards.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 text-center hover:border-green-500/50 transition-colors">
            <Cpu className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">AI-Powered Sustainability</h3>
            <p className="text-slate-300">
              90% cost reduction through AI automation enables genuine reward sharing from business profits.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 text-center hover:border-green-500/50 transition-colors">
            <TrendingUp className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Transparent Rates</h3>
            <p className="text-slate-300">
              Live reward rates adjusted dynamically based on business performance. Full transparency, always.
            </p>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {Math.round(stats.total_rewards_distributed).toLocaleString()}
              </div>
              <div className="text-sm text-slate-400">Total Rewards Distributed</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-1">
                {stats.active_businesses}
              </div>
              <div className="text-sm text-slate-400">Active Businesses</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {Math.round(stats.avg_monthly_earnings)}
              </div>
              <div className="text-sm text-slate-400">Avg Monthly Earnings</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {stats.total_usage_events.toLocaleString()}
              </div>
              <div className="text-sm text-slate-400">Usage Events Tracked</div>
            </div>
          </div>
        )}

        <div className="text-center">
          <Link
            to="/token/use-to-earn"
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-lg transition-colors"
          >
            See How Much You Can Earn
            <TrendingUp className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function PortfolioPreviewSection() {
  const businesses = [
    {
      name: 'AI Traders',
      description: 'Automated trading platform',
      status: 'V1 live; V2 2026 Q3/Q4',
      path: '/portfolio/ai-traders',
    },
    {
      name: 'AI Web Dev Platform',
      description: 'AI-powered development tools',
      status: 'V1 live; V2 coming',
      path: '/portfolio/ai-web-dev',
    },
    {
      name: 'AI Business Factory',
      description: 'Consortium engine commercialization',
      status: 'Internal; public Q3 2026',
      path: '/portfolio/ai-business-factory',
    },
    {
      name: 'Coinfusion',
      description: 'Crypto data aggregation platform',
      status: 'In progress',
      path: '/portfolio/coinfusion',
    },
    {
      name: 'Q4 2026 Flagship',
      description: 'Major ecosystem launch',
      status: 'Coming soon',
      path: '/portfolio/flagship-q4-2026',
    },
  ];

  return (
    <section className="bg-slate-900/80 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            The ecosystem already has live products.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business, idx) => (
            <Link
              key={idx}
              to={business.path}
              className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all hover:scale-105"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-white">{business.name}</h3>
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <p className="text-slate-300 text-sm mb-3">{business.description}</p>
              <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                {business.status}
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/portfolio"
            className="inline-block px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
          >
            Explore full portfolio + metrics →
          </Link>
        </div>
      </div>
    </section>
  );
}

function FoundationProofSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-cyan-500/30 rounded-2xl p-8 lg:p-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              Validation Complete
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              4 Foundation Businesses Proved the Model Works
            </h2>
            <p className="text-slate-300 mb-6">
              Before opening governance to the community, we validated that AI agents
              can build and manage profitable businesses. These foundation businesses
              generated <strong className="text-cyan-400">$15K+/month</strong> and
              served 2,400+ users.
            </p>
            <Link
              to="/portfolio/foundation"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              See Foundation Businesses
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard icon={<CheckCircle2 />} value="4" label="Businesses Live" />
            <MetricCard icon={<DollarSign />} value="$15K" label="Monthly Revenue" />
            <MetricCard icon={<Users />} value="2.4K" label="Active Users" />
            <MetricCard icon={<TrendingUp />} value="45%" label="Profit Margin" />
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ icon, value, label }: { icon: React.ReactElement; value: string; label: string }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
      <div className="flex justify-center text-cyan-400 mb-2">
        {React.cloneElement(icon, { className: 'w-6 h-6' })}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

function LaunchpadTeaserSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Got an idea? The ecosystem can launch it.
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">The Pitch</h3>
          <p className="text-lg text-slate-300 mb-6">
            Propose businesses. The community votes. AI builds. You earn upside.
          </p>
          <Link
            to="/launchpad/submit"
            className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
          >
            Submit a proposal
          </Link>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">Requirements + Rewards</h3>
          <ul className="space-y-3 text-slate-300 mb-6">
            <li>• Minimum tokens to submit: 1000</li>
            <li>• Voting period: 7–14 days</li>
            <li>• Proposer wallet recorded for future allocation</li>
            <li>• Winning-side voters earn reward multipliers</li>
          </ul>
          <Link
            to="/launchpad/voting-rewards"
            className="inline-block px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
          >
            How voting rewards work
          </Link>
        </div>
      </div>
    </section>
  );
}

function TokenAirdropSection() {
  return (
    <section className="bg-slate-900/80 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
          No token sale. Only an airdrop for users and supporters.
        </h2>

        <div className="space-y-4 text-lg text-slate-300 mb-12">
          <p>The ecosystem prioritizes participation over speculation.</p>
          <p>Airdrop rewards real usage: proposing, voting, contributing, building.</p>
          <p>Special community allocations will be announced.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/token/airdrop"
            className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
          >
            Airdrop details
          </Link>
          <Link
            to="/token"
            className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
          >
            Token utility
          </Link>
        </div>

        <p className="text-sm text-slate-400 mt-8">
          Details may evolve via governance.
        </p>
      </div>
    </section>
  );
}

function LiveGovernanceSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Governance is public. Votes are visible in real time.
        </h2>
      </div>

      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
        <div className="space-y-4">
          <ProposalPreview
            title="Expand AI Traders to European markets"
            status="Active"
            progress={68}
            timeLeft="5 days"
          />
          <ProposalPreview
            title="Launch AI-powered customer support platform"
            status="Active"
            progress={42}
            timeLeft="11 days"
          />
          <ProposalPreview
            title="Implement token staking mechanism"
            status="Passed"
            progress={73}
            timeLeft="Approved"
          />
        </div>

        <div className="text-center mt-8">
          <Link
            to="/governance/live"
            className="inline-block px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
          >
            View live governance →
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProposalPreview({ title, status, progress, timeLeft }: { title: string; status: string; progress: number; timeLeft: string }) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-white font-medium">{title}</h3>
        <span className={`px-2 py-1 text-xs rounded-full ${
          status === 'Active' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
        }`}>
          {status}
        </span>
      </div>
      <div className="mb-2">
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-cyan-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">{progress}% approval</span>
        <span className="text-slate-400">{timeLeft}</span>
      </div>
    </div>
  );
}

function CommunitySection() {
  return (
    <section className="bg-slate-900/80 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-12">
          Join the builders of the ecosystem.
        </h2>

        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Discord
          </button>
          <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors">
            X / Twitter
          </button>
          <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors">
            Telegram
          </button>
          <Link
            to="/community/faq"
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
          >
            Read FAQ
          </Link>
          <Link
            to="/community/contact"
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
          >
            Contact
          </Link>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
          <h3 className="text-xl font-bold text-white mb-4">Get airdrop + launch updates</h3>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
            <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="bg-linear-to-r from-cyan-600/20 to-blue-600/20 border-y border-cyan-500/30 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
          Ready to participate?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/launchpad"
            className="px-10 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors"
          >
            Go to Launchpad
          </Link>
          <button className="px-10 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors">
            Connect Wallet
          </button>
        </div>
      </div>
    </section>
  );
}
