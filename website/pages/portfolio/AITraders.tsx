import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  TrendingUp, ExternalLink, ArrowRight, CheckCircle2, Clock,
  Shield, BarChart3, Zap, Users, Target, Sparkles, Eye
} from 'lucide-react';

export default function AITraders() {
  return (
    <PageLayout>
      <div className="space-y-20">
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live — V1
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            AI Traders
          </h1>

          <p className="text-2xl text-cyan-400 mb-6 font-medium">
            Autonomous AI agents trading crypto markets on your behalf.
          </p>

          <p className="text-lg text-slate-300 mb-8">
            V2 (advanced features) planned for Q3/Q4 2026
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors">
              Visit Platform
              <ExternalLink className="w-5 h-5" />
            </button>
            <a
              href="#roadmap"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
            >
              View Roadmap
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">What is AI Traders?</h2>

          <p className="text-lg text-slate-300 mb-6 max-w-3xl mx-auto">
            AI Traders is a platform that allows users to deploy autonomous AI trading agents connected
            to real-time market data and wallets. These AI agents analyze markets, execute strategies,
            manage risk, and trade continuously — without human intervention.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-yellow-400" />}
              title="Fully Autonomous"
              description="Execute trades 24/7 without manual intervention"
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8 text-blue-400" />}
              title="Real-time Data"
              description="Market feeds connected and analyzed continuously"
            />
            <FeatureCard
              icon={<Target className="w-8 h-8 text-green-400" />}
              title="Strategy Optimization"
              description="Strategies refined and improved over time"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-cyan-400" />}
              title="Long-term Operation"
              description="Designed for scalability and continuous running"
            />
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How It Works</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <StepCard
              number="1"
              title="User Setup"
              items={[
                'Connect your wallet',
                'Choose AI strategy profile',
                'Set risk parameters',
                'Approve AI agent access'
              ]}
            />
            <StepCard
              number="2"
              title="AI Deployment"
              items={[
                'AI agent initialized',
                'Market feeds connected',
                'Strategy parameters loaded',
                'Risk management activated'
              ]}
            />
            <StepCard
              number="3"
              title="Live Trading"
              items={[
                'AI executes trades autonomously',
                'Risk parameters enforced',
                'Real-time market analysis',
                'Continuous strategy adaptation'
              ]}
            />
            <StepCard
              number="4"
              title="Monitoring"
              items={[
                'Users monitor performance dashboard',
                'No manual execution required',
                'Full transparency on all trades',
                'Strategies refined over time'
              ]}
            />
          </div>

          <div className="mt-8 p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Important Note</h3>
                <p className="text-slate-300">
                  Users retain custody and control at all times. The AI agent operates within your defined
                  parameters and you can pause or withdraw at any moment.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Current Version: V1</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                V1 Includes
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Autonomous spot trading across major exchanges</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Core risk management with stop-loss and position sizing</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Performance tracking dashboard with real-time metrics</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Strategy presets for different risk profiles</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Basic market analysis and technical indicators</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-yellow-400" />
                V1 Limitations
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Limited strategy customization options</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                  <span>No cross-strategy orchestration</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Advanced AI features reserved for V2</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Single-market focus (crypto only)</span>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-slate-700/30 border border-slate-600 rounded-lg">
                <p className="text-sm text-slate-300 italic">
                  Transparency builds trust. We're upfront about current capabilities while
                  working toward advanced features.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="roadmap">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Roadmap</h2>

          <div className="space-y-6">
            <RoadmapPhase
              phase="V2"
              timeline="Q3/Q4 2026"
              status="planned"
              features={[
                'Advanced AI strategy generation with custom parameters',
                'Multi-agent trading coordination and portfolio optimization',
                'Cross-market optimization (futures, options, DeFi)',
                'Expanded analytics with predictive modeling',
                'Deeper integration with ecosystem governance',
                'Advanced risk management with dynamic position sizing',
                'Social trading features and strategy sharing',
              ]}
            />

            <RoadmapPhase
              phase="Future Vision"
              timeline="2027+"
              status="vision"
              features={[
                'AI Traders becomes a core revenue engine for the ecosystem',
                'Strategies improve as ecosystem data grows',
                'Shared learning across all AI-managed businesses',
                'Cross-ecosystem AI collaboration and optimization',
                'Integration with external AI networks',
              ]}
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Role in the Ecosystem
          </h2>

          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-slate-300 mb-8 text-center">
              AI Traders is more than a standalone product — it's a key component of the larger ecosystem
              value flow.
            </p>

            <div className="space-y-4">
              <FlowItem
                icon={<DollarSign className="w-6 h-6 text-green-400" />}
                title="Generates Real Revenue"
                description="Trading fees and performance-based revenue contribute to ecosystem treasury"
              />
              <FlowItem
                icon={<TrendingUp className="w-6 h-6 text-cyan-400" />}
                title="Treasury Distributions"
                description="Revenue flows into ecosystem treasury, governed by token holders"
              />
              <FlowItem
                icon={<Users className="w-6 h-6 text-purple-400" />}
                title="Token Holder Benefits"
                description="Contributes to token buybacks, burns, rewards, and ecosystem expansion"
              />
              <FlowItem
                icon={<Sparkles className="w-6 h-6 text-yellow-400" />}
                title="Ecosystem Growth"
                description="Success of AI Traders strengthens the entire portfolio and token value"
              />
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Governance & Ownership
          </h2>

          <div className="max-w-3xl mx-auto space-y-4 text-lg text-slate-300">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <p>Built and operated by autonomous AI agents</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <p>Strategic decisions governed by token holders</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <p>No single entity controls the platform</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <p>Future changes subject to governance proposals</p>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Transparency & Status
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatusCard
              icon={<CheckCircle2 className="w-8 h-8 text-green-400" />}
              label="Status"
              value="Live"
              valueColor="text-green-400"
            />
            <StatusCard
              icon={<DollarSign className="w-8 h-8 text-green-400" />}
              label="Stage"
              value="Revenue-Generating"
              valueColor="text-green-400"
            />
            <StatusCard
              icon={<Users className="w-8 h-8 text-cyan-400" />}
              label="Governance"
              value="Active"
              valueColor="text-cyan-400"
            />
            <StatusCard
              icon={<Eye className="w-8 h-8 text-blue-400" />}
              label="Roadmap"
              value="Public"
              valueColor="text-blue-400"
            />
          </div>

          <div className="mt-8 text-center space-y-4">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              View Portfolio Overview
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/governance"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors ml-3"
            >
              See Governance
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="bg-linear-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            AI Traders is one piece of a much larger system.
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Explore the full ecosystem of AI-managed businesses working together to create sustainable value.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/portfolio"
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Explore Full Portfolio
            </Link>
            <Link
              to="/token/airdrop"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Join the Ecosystem
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-300">{description}</p>
    </div>
  );
}

function StepCard({ number, title, items }: { number: string; title: string; items: string[] }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
          {number}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RoadmapPhase({
  phase,
  timeline,
  status,
  features
}: {
  phase: string;
  timeline: string;
  status: 'planned' | 'vision';
  features: string[];
}) {
  const statusConfig = {
    planned: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Planned' },
    vision: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Vision' },
  };

  const config = statusConfig[status];

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">{phase}</h3>
          <p className="text-slate-400">{timeline}</p>
        </div>
        <span className={`px-3 py-1 ${config.bg} ${config.text} text-sm font-medium rounded-full w-fit`}>
          {config.label}
        </span>
      </div>

      <ul className="space-y-3">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 text-slate-300">
            <ArrowRight className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FlowItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
        <p className="text-sm text-slate-300">{description}</p>
      </div>
    </div>
  );
}

function StatusCard({
  icon,
  label,
  value,
  valueColor
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor: string;
}) {
  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6 text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="text-sm text-slate-400 mb-1">{label}</div>
      <div className={`text-lg font-bold ${valueColor}`}>{value}</div>
    </div>
  );
}

function DollarSign({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
