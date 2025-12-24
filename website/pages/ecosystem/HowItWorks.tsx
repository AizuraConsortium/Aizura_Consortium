import { PageLayout } from '../../components/layout/PageLayout';
import {
  FileText, Vote, Cpu, Rocket, DollarSign, Users, Brain,
  CheckCircle2, ArrowRight, Zap, Shield, Target, TrendingUp,
  Eye, Activity, Blocks, Settings, Lock, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  const phases = [
    {
      icon: <FileText className="w-12 h-12 text-cyan-400" />,
      title: '1. Propose',
      description: 'Token holders submit business ideas with goals, scope, and success metrics.',
      detail: 'Minimum 50,000 tokens required. Proposer wallet is recorded for future equity allocation.',
    },
    {
      icon: <Vote className="w-12 h-12 text-blue-400" />,
      title: '2. Vote',
      description: 'Community votes FOR or AGAINST. Voting weight matches token holdings.',
      detail: 'Winning-side voters earn reward multipliers. Early voters get bonus weight.',
    },
    {
      icon: <Cpu className="w-12 h-12 text-purple-400" />,
      title: '3. AI Builds',
      description: 'The AI Consortium designs the business plan and execution system.',
      detail: 'Six specialized agents collaborate, debate, and vote on internal decisions.',
    },
    {
      icon: <Rocket className="w-12 h-12 text-green-400" />,
      title: '4. Launch',
      description: 'AI agents deploy the product, operations, and growth loops.',
      detail: '24/7 execution. No downtime. Continuously optimized.',
    },
    {
      icon: <DollarSign className="w-12 h-12 text-yellow-400" />,
      title: '5. Profit & Scale',
      description: 'Revenue flows into transparent distributions and ecosystem growth.',
      detail: 'Token buybacks, burns, treasury allocation, and proposer rewards.',
    },
  ];

  return (
    <PageLayout>
      <div className="space-y-16">
        <section className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            The Solution
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            From ideas to{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI-run revenue
            </span>
            {' '}in 5 phases
          </h1>

          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            A decentralized platform where the community proposes ideas, token holders govern decisions,
            and autonomous AI agents execute and operate businesses end-to-end.
          </p>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Overview: The Complete Pipeline</h2>

          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            This system synthesizes three powerful components—community governance, AI execution,
            and transparent economics—into a unified value creation engine
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <ComponentCard
              icon={<Users className="w-8 h-8 text-cyan-400" />}
              title="Community Governance"
              description="Token holders propose ideas and vote on which businesses to build"
              color="cyan"
            />
            <ComponentCard
              icon={<Brain className="w-8 h-8 text-purple-400" />}
              title="AI Execution"
              description="Autonomous agents design, build, and operate each approved business"
              color="purple"
            />
            <ComponentCard
              icon={<TrendingUp className="w-8 h-8 text-green-400" />}
              title="Economic Alignment"
              description="Revenue flows back through buybacks, burns, and treasury growth"
              color="green"
            />
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 text-center">
            <p className="text-lg text-white font-bold">
              The unique synthesis: Humans define WHAT to build. AI determines HOW to build it.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-10 text-center">The 5-Phase Pipeline</h2>

          <div className="space-y-8">
            {phases.map((phase, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">{phase.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-3">{phase.title}</h2>
                    <p className="text-lg text-slate-200 mb-3">{phase.description}</p>
                    <p className="text-slate-400">{phase.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Why AI Can Actually Run These Businesses
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            Not all businesses can be fully automated, but a growing category can—and AI excels at them
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <CapabilityCard
              icon={<Blocks className="w-8 h-8 text-cyan-400" />}
              title="Software-Native Domains"
              points={[
                'Web development platforms',
                'Trading and market-making systems',
                'Data analysis and reporting tools',
                'API services and integrations',
                'Digital content generation'
              ]}
            />
            <CapabilityCard
              icon={<Activity className="w-8 h-8 text-blue-400" />}
              title="Repetitive Operations"
              points={[
                'Continuous monitoring and optimization',
                'Automated customer support',
                'Rule-based decision-making',
                'Systematic testing and iteration',
                'Performance analytics'
              ]}
            />
            <CapabilityCard
              icon={<Target className="w-8 h-8 text-green-400" />}
              title="Data-Driven Loops"
              points={[
                'Real-time feedback processing',
                'A/B testing at scale',
                'Pattern recognition',
                'Predictive modeling',
                'Automated reporting'
              ]}
            />
            <CapabilityCard
              icon={<Settings className="w-8 h-8 text-purple-400" />}
              title="Continuous Optimization"
              points={[
                'Self-improving algorithms',
                '24/7 operational capability',
                'Instant adaptation to changes',
                'Multi-variable optimization',
                'No emotional bias'
              ]}
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            Why Governance Still Matters
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            AI execution is powerful, but humans must maintain strategic control
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <GovernanceReasonCard
              icon={<Lock className="w-8 h-8 text-cyan-400" />}
              title="Humans Define Boundaries"
              description="Strategic direction, ethical guidelines, and operational constraints are set by the community, not by AI"
              examples={[
                'Which business categories to pursue',
                'Risk tolerance levels',
                'Ethical operational standards'
              ]}
            />
            <GovernanceReasonCard
              icon={<DollarSign className="w-8 h-8 text-green-400" />}
              title="Humans Allocate Capital"
              description="Treasury spending, revenue distribution, and investment decisions require community approval"
              examples={[
                'Budget allocation per business',
                'Distribution of profits',
                'Emergency fund management'
              ]}
            />
            <GovernanceReasonCard
              icon={<Eye className="w-8 h-8 text-blue-400" />}
              title="Humans Set Values"
              description="Long-term vision, community values, and ecosystem priorities are human decisions"
              examples={[
                'Ecosystem mission and values',
                'Community culture',
                'Long-term strategic goals'
              ]}
            />
            <GovernanceReasonCard
              icon={<Shield className="w-8 h-8 text-purple-400" />}
              title="Humans Provide Accountability"
              description="AI agents operate under community oversight with transparent, auditable actions"
              examples={[
                'Performance monitoring',
                'Failure analysis',
                'Course correction authority'
              ]}
            />
          </div>

          <div className="mt-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 text-center">
            <p className="text-lg font-bold text-white">
              AI agents are operators, not owners. The community maintains ultimate control.
            </p>
          </div>
        </section>

        <section className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-8 lg:p-12">
          <h3 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <Zap className="w-8 h-8 text-cyan-400" />
            The Flywheel Effect
          </h3>

          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-lg text-slate-300 leading-relaxed">
              As AI gets smarter, so does the entire ecosystem. Every launched business improves the next.
              Revenue compounds. The community grows. More proposals flow in. The cycle accelerates.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mt-8">
              <FlywheelStep
                number="1"
                title="More Businesses Launched"
                description="Each success attracts more proposals"
              />
              <FlywheelStep
                number="2"
                title="More Revenue Generated"
                description="Portfolio grows, income diversifies"
              />
              <FlywheelStep
                number="3"
                title="Token Value Increases"
                description="Buybacks and burns reduce supply"
              />
              <FlywheelStep
                number="4"
                title="Community Grows"
                description="Success attracts more participants"
              />
              <FlywheelStep
                number="5"
                title="AI Learns & Improves"
                description="Each project improves agent capabilities"
              />
              <FlywheelStep
                number="6"
                title="Cycle Accelerates"
                description="Returns to step 1, faster and stronger"
              />
            </div>

            <div className="mt-8 text-center">
              <p className="text-xl font-bold text-cyan-400">
                This is how autonomous commerce scales exponentially.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Key Differentiators</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <DifferentiatorCard
              icon={<CheckCircle2 className="w-6 h-6 text-green-400" />}
              title="Real Revenue"
              description="Actual businesses generating real income, not token emissions"
            />
            <DifferentiatorCard
              icon={<CheckCircle2 className="w-6 h-6 text-cyan-400" />}
              title="Community-Owned"
              description="Token holders collectively own the portfolio, not VCs or insiders"
            />
            <DifferentiatorCard
              icon={<CheckCircle2 className="w-6 h-6 text-blue-400" />}
              title="Transparent Execution"
              description="All AI decisions and operations are publicly visible"
            />
            <DifferentiatorCard
              icon={<CheckCircle2 className="w-6 h-6 text-purple-400" />}
              title="Multi-Agent Coordination"
              description="Six specialized AI agents collaborate, not a single bot"
            />
            <DifferentiatorCard
              icon={<CheckCircle2 className="w-6 h-6 text-yellow-400" />}
              title="Sustainable Economics"
              description="Revenue-backed model, not reliant on continuous token inflation"
            />
            <DifferentiatorCard
              icon={<CheckCircle2 className="w-6 h-6 text-orange-400" />}
              title="Proven Track Record"
              description="Live businesses already operating and generating revenue"
            />
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <Link
            to="/ecosystem/ai-consortium"
            className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-8 hover:border-purple-500/50 transition-colors group"
          >
            <Brain className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold text-white mb-3">Meet the AI Consortium</h3>
            <p className="text-slate-300 mb-4">
              Learn about the six specialized AI agents that power the ecosystem
            </p>
            <div className="flex items-center gap-2 text-cyan-400 font-medium">
              Learn More
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>

          <Link
            to="/portfolio"
            className="bg-gradient-to-br from-green-600/20 to-cyan-600/20 border border-green-500/30 rounded-2xl p-8 hover:border-green-500/50 transition-colors group"
          >
            <TrendingUp className="w-12 h-12 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold text-white mb-3">View Live Portfolio</h3>
            <p className="text-slate-300 mb-4">
              See the businesses currently built and operated by AI agents
            </p>
            <div className="flex items-center gap-2 text-cyan-400 font-medium">
              View Portfolio
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </section>

        <section className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-8">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white mb-2">Important Note</h3>
              <p className="text-sm text-slate-300">
                While AI agents handle execution and operations, all major decisions require community governance approval.
                This system is designed for sustainable growth with built-in safeguards and risk mitigation.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function ComponentCard({ icon, title, description, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colorMap = {
    cyan: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/30',
    purple: 'from-purple-500/10 to-blue-500/10 border-purple-500/30',
    green: 'from-green-500/10 to-cyan-500/10 border-green-500/30'
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color as keyof typeof colorMap]} border rounded-xl p-6 text-center`}>
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-sm text-slate-300">{description}</p>
    </div>
  );
}

function CapabilityCard({ icon, title, points }: {
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

function GovernanceReasonCard({ icon, title, description, examples }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  examples: string[];
}) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-sm text-slate-300 mb-4">{description}</p>
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-400 uppercase">Examples:</p>
        {examples.map((example, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
            <span className="text-xs text-slate-400">{example}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlywheelStep({ number, title, description }: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {number}
        </div>
        <h4 className="font-bold text-white">{title}</h4>
      </div>
      <p className="text-sm text-slate-400 ml-13">{description}</p>
    </div>
  );
}

function DifferentiatorCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
      <div className="mb-3">{icon}</div>
      <h4 className="font-bold text-white mb-2 text-sm">{title}</h4>
      <p className="text-xs text-slate-400">{description}</p>
    </div>
  );
}
