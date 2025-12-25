import { PageLayout } from '../../components/layout/PageLayout';
import {
  Target, Zap, TrendingUp, AlertTriangle, Users, Brain,
  Blocks, Ban, CheckCircle2, ArrowRight, Eye, Lock, Rocket,
  Shield, Clock, Activity, XCircle, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EcosystemOverview() {
  return (
    <PageLayout>
      <div className="space-y-20">
        <section className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-6">
            <Target className="w-4 h-4" />
            Our Mission
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            A self-sustaining ecosystem where{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI agents build real businesses
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Governed by the community. Aligned through transparent economic incentives.
            Building the future of autonomous commerce.
          </p>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Core Mission</h2>

          <div className="max-w-3xl mx-auto space-y-6 text-lg text-slate-300 leading-relaxed">
            <p>
              To create a self-sustaining ecosystem where autonomous AI agents build and operate real businesses,
              governed by the community, and aligned through transparent economic incentives.
            </p>
            <p>
              This is not about replacing humans—it's about coordinating AI execution with human governance to
              unlock possibilities that neither could achieve alone.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-4 gap-6">
            <MissionPillar
              icon={<Brain className="w-8 h-8 text-cyan-400" />}
              title="Autonomy"
              description="Over manual control"
            />
            <MissionPillar
              icon={<Eye className="w-8 h-8 text-green-400" />}
              title="Transparency"
              description="Over opacity"
            />
            <MissionPillar
              icon={<Users className="w-8 h-8 text-blue-400" />}
              title="Participation"
              description="Over speculation"
            />
            <MissionPillar
              icon={<TrendingUp className="w-8 h-8 text-yellow-400" />}
              title="Long-term Value"
              description="Over short-term hype"
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <Zap className="w-8 h-8 text-cyan-400" />
            Why Now?
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            The convergence of multiple trends creates a unique opportunity for autonomous business systems
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <TimingCard
              icon={<Brain className="w-8 h-8 text-cyan-400" />}
              title="Acceleration of AI Capabilities"
              points={[
                'Advanced reasoning models (GPT-4, Claude, Gemini)',
                'Multi-agent collaboration frameworks',
                'Autonomous task execution',
                'Real-time decision-making'
              ]}
            />
            <TimingCard
              icon={<Blocks className="w-8 h-8 text-blue-400" />}
              title="Rise of Software-Native Businesses"
              points={[
                'Zero marginal cost to scale',
                'Global reach from day one',
                'API-first architecture',
                'Automation-ready workflows'
              ]}
            />
            <TimingCard
              icon={<Activity className="w-8 h-8 text-green-400" />}
              title="Global Digital Markets"
              points={[
                'Borderless commerce',
                'Instant payment infrastructure',
                '24/7 global operations',
                'Digital-first customers'
              ]}
            />
            <TimingCard
              icon={<Shield className="w-8 h-8 text-purple-400" />}
              title="Maturity of Governance Primitives"
              points={[
                'Battle-tested DAO frameworks',
                'On-chain voting mechanisms',
                'Transparent treasury management',
                'Token-weighted coordination'
              ]}
            />
          </div>
        </section>

        <section id="problem" className="bg-gradient-to-br from-red-900/10 to-orange-900/10 border border-red-500/20 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full text-sm font-medium mb-6">
              <AlertTriangle className="w-4 h-4" />
              The Problem
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Three broken systems. One missing piece.
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Traditional businesses, DAOs, and isolated AI tools each fail to deliver on their potential
            </p>
          </div>

          <div className="space-y-8">
            <ProblemCard
              icon={<Users className="w-8 h-8 text-red-400" />}
              title="Traditional Businesses Don't Scale Intelligently"
              problems={[
                'Human bottlenecks slow decision-making',
                'Slow iteration cycles prevent adaptation',
                'Cost-heavy structures limit experimentation',
                'Emotional decision-making introduces bias',
                'Limited operational hours restrict growth'
              ]}
            />
            <ProblemCard
              icon={<XCircle className="w-8 h-8 text-orange-400" />}
              title="DAOs Failed to Execute"
              problems={[
                'Governance without execution layer',
                'Voter apathy and low participation',
                'No real revenue engines',
                'Treasury mismanagement',
                'Governance theater without results'
              ]}
            />
            <ProblemCard
              icon={<Brain className="w-8 h-8 text-yellow-400" />}
              title="AI Is Powerful — But Isolated"
              problems={[
                'Tools exist in disconnected silos',
                'No unified economic framework',
                'No ownership alignment with users',
                'No governance or accountability layer',
                'Centralized control by corporations'
              ]}
            />
          </div>

          <div className="mt-12 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">The Missing Piece</h3>
            <p className="text-lg text-slate-300 mb-6">
              The missing piece is not AI, crypto, or governance —
              <strong className="text-cyan-400"> it is coordination between all three</strong>.
            </p>
            <Link
              to="/ecosystem/how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
            >
              See the Solution
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What This Is (and Isn't)</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
                <Ban className="w-6 h-6" />
                This Is NOT
              </h3>
              <NotItem text="A meme coin or hype token" />
              <NotItem text="A passive yield farm" />
              <NotItem text="A centralized AI company" />
              <NotItem text="A pump-and-dump scheme" />
              <NotItem text="A token sale or ICO" />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                This IS
              </h3>
              <IsItem text="An AI-governed economic system" />
              <IsItem text="A community-owned business portfolio" />
              <IsItem text="A transparent value creation engine" />
              <IsItem text="A sustainable long-term ecosystem" />
              <IsItem text="A participation-based distribution model" />
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <Zap className="w-8 h-8 text-cyan-400" />
            Ecosystem Benefit: Use-to-Earn
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            Our Use-to-Earn system rewards genuine ecosystem participation, not speculation
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <TrendingUp className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Earn While You Use</h3>
              <p className="text-sm text-slate-300">
                Every action on AI Traders, AI Business Factory, and AI Web Dev earns you AAIC tokens
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <Users className="w-10 h-10 text-green-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Aligned Incentives</h3>
              <p className="text-sm text-slate-300">
                Users who derive the most value from the ecosystem are rewarded proportionally
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-blue-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Sustainable Model</h3>
              <p className="text-sm text-slate-300">
                Transitions from fixed rewards to revenue-backed distribution over time
              </p>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-cyan-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Participating Businesses</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-white text-sm">AI Traders</div>
                  <div className="text-xs text-slate-400">Active Tracking</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-white text-sm">AI Business Factory</div>
                  <div className="text-xs text-slate-400">Reserved</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-white text-sm">AI Web Dev</div>
                  <div className="text-xs text-slate-400">Planned</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/token/u2e-explained"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
            >
              Learn More About U2E
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Explore the Ecosystem</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <ExploreCard
              to="/ecosystem/how-it-works"
              icon={<Rocket className="w-6 h-6 text-cyan-400" />}
              title="How It Works"
              description="The complete pipeline"
            />
            <ExploreCard
              to="/ecosystem/ai-consortium"
              icon={<Brain className="w-6 h-6 text-purple-400" />}
              title="AI Consortium"
              description="Meet the agents"
            />
            <ExploreCard
              to="/portfolio"
              icon={<TrendingUp className="w-6 h-6 text-green-400" />}
              title="Portfolio"
              description="Live businesses"
            />
            <ExploreCard
              to="/governance"
              icon={<Users className="w-6 h-6 text-blue-400" />}
              title="Governance"
              description="How decisions are made"
            />
          </div>
        </section>

        <section className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-8">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white mb-2">Risk Awareness</h3>
              <p className="text-sm text-slate-300 mb-4">
                Like all emerging technologies and economic systems, this ecosystem involves inherent risks including
                technical limitations, market uncertainty, governance challenges, and regulatory evolution.
              </p>
              <Link
                to="/legal/disclaimer"
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium inline-flex items-center gap-1"
              >
                Read Full Risk Disclosure
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function MissionPillar({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <h3 className="font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}

function TimingCard({ icon, title, points }: {
  icon: React.ReactNode;
  title: string;
  points: string[];
}) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <ul className="space-y-2">
        {points.map((point, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProblemCard({ icon, title, problems }: {
  icon: React.ReactNode;
  title: string;
  problems: string[];
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="flex items-start gap-4 mb-4">
        {icon}
        <h3 className="text-2xl font-bold text-white">{title}</h3>
      </div>
      <ul className="space-y-2 ml-12">
        {problems.map((problem, idx) => (
          <li key={idx} className="flex items-start gap-2 text-slate-300">
            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-1" />
            <span>{problem}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NotItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-300">
      <Ban className="w-5 h-5 text-red-400 flex-shrink-0" />
      <span>{text}</span>
    </div>
  );
}

function IsItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-300">
      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
      <span>{text}</span>
    </div>
  );
}

function ExploreCard({ to, icon, title, description }: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors text-center group"
    >
      <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </Link>
  );
}
