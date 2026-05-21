import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Lightbulb, Users, Cpu, Rocket, DollarSign, Zap,
  CheckCircle2, Shield, Vote, Award, Eye,
  ArrowRight, Sparkles, BarChart3, Target
} from 'lucide-react';

export default function LaunchpadOverview() {
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
              <h2 className="text-3xl font-bold text-white mb-2">Governance Launchpad</h2>
              <p className="text-slate-400">Coming Q2 2025 after token distribution</p>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
            <div className="text-center mb-6">
              <Rocket className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Launchpad Opens Q2 2025
              </h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Governance proposals and voting will go live after token distribution.
                Beta testing currently in progress with early community members.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-cyan-400 mb-1">47</div>
                <div className="text-sm text-slate-400">Proposals in Draft</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400 mb-1">1,200+</div>
                <div className="text-sm text-slate-400">Beta Testers</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400 mb-1">8,500+</div>
                <div className="text-sm text-slate-400">Waitlist Signups</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400 mb-1">Q2 2025</div>
                <div className="text-sm text-slate-400">Mainnet Launch</div>
              </div>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-300 text-center">
                <strong className="text-cyan-400">Pre-Launch Phase:</strong> All metrics shown are from beta testing and internal validation. Live metrics will be displayed after mainnet launch.
              </p>
            </div>

            <div className="text-center">
              <Link
                to="/auth/sign-in"
                className="inline-block px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
              >
                Join Waitlist
              </Link>
            </div>
          </div>

          <div className="mt-8 bg-slate-900/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Example Proposals in Development</h3>
            <p className="text-sm text-slate-400 mb-4">
              These are example business ideas being refined during beta testing. Actual proposals will be submitted by the community after launch.
            </p>
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h4 className="font-bold text-white mb-2">AI-Powered Social Media Manager</h4>
                <p className="text-sm text-slate-400 mb-2">Autonomous social media management system</p>
                <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">SaaS</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h4 className="font-bold text-white mb-2">Decentralized Cloud Storage</h4>
                <p className="text-sm text-slate-400 mb-2">Distributed storage with AI optimization</p>
                <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">Infrastructure</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h4 className="font-bold text-white mb-2">AI Trading Analytics Dashboard</h4>
                <p className="text-sm text-slate-400 mb-2">Real-time market analysis and signals</p>
                <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Trading</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h4 className="font-bold text-white mb-2">AI Customer Support Network</h4>
                <p className="text-sm text-slate-400 mb-2">Multi-lingual support system</p>
                <span className="inline-block px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded">SaaS</span>
              </div>
            </div>
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
