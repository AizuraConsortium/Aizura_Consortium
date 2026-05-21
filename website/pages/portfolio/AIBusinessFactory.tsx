import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Factory, ArrowRight, CheckCircle2, Clock,
  Shield, Lightbulb, Users, Sparkles, Eye, TrendingUp,
  Brain, Cpu, Network, Briefcase
} from 'lucide-react';

export default function AIBusinessFactory() {
  return (
    <PageLayout>
      <div className="space-y-20">
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            Internal Tool — Commercialization Q3 2026
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            AI Business Factory
          </h1>

          <p className="text-2xl text-cyan-400 mb-6 font-medium">
            The Consortium Engine that builds, manages, and optimizes autonomous businesses.
          </p>

          <p className="text-lg text-slate-300 mb-8">
            Currently operating internally. External commercialization planned for Q3 2026.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#roadmap"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors"
            >
              View Roadmap
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              to="/ecosystem/how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
            >
              How It Works
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">What is the AI Business Factory?</h2>

          <p className="text-lg text-slate-300 mb-6 max-w-3xl mx-auto">
            The AI Business Factory is the core engine of the Aizura Consortium — an autonomous system
            that designs, launches, operates, and optimizes AI-powered businesses. This is the underlying
            infrastructure that makes the entire ecosystem possible.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <FeatureCard
              icon={<Brain className="w-8 h-8 text-purple-400" />}
              title="Strategic Planning"
              description="AI agents identify opportunities and design business models"
            />
            <FeatureCard
              icon={<Factory className="w-8 h-8 text-blue-400" />}
              title="Autonomous Launch"
              description="Businesses are built, tested, and deployed automatically"
            />
            <FeatureCard
              icon={<Network className="w-8 h-8 text-green-400" />}
              title="Continuous Optimization"
              description="Performance monitored and strategies refined in real-time"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-cyan-400" />}
              title="Governance Integration"
              description="Token holders govern strategic decisions and resource allocation"
            />
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How It Works</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <StepCard
              number="1"
              title="Opportunity Identification"
              items={[
                'AI agents analyze markets for gaps and opportunities',
                'Evaluate technical feasibility and resource requirements',
                'Assess revenue potential and strategic fit',
                'Generate business proposals for governance review'
              ]}
            />
            <StepCard
              number="2"
              title="Governance Approval"
              items={[
                'Proposals submitted to token holder governance',
                'Community evaluates strategy and resource allocation',
                'Voting determines which businesses to pursue',
                'Approved projects receive treasury funding'
              ]}
            />
            <StepCard
              number="3"
              title="Autonomous Development"
              items={[
                'AI agents build technical infrastructure',
                'Systems deployed and tested automatically',
                'Risk management protocols activated',
                'Performance monitoring initialized'
              ]}
            />
            <StepCard
              number="4"
              title="Operation & Optimization"
              items={[
                'Businesses operate autonomously with AI management',
                'Revenue flows back to ecosystem treasury',
                'Continuous performance analysis and refinement',
                'Strategic pivots proposed to governance when needed'
              ]}
            />
          </div>

          <div className="mt-8 p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">The Core Innovation</h3>
                <p className="text-slate-300">
                  The AI Business Factory isn't just automation — it's a self-improving system where
                  each business teaches the AI more about markets, operations, and strategy. The
                  ecosystem gets smarter with every project.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Current Capabilities</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                Active Features
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Multi-agent orchestration and coordination</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Governance proposal generation and management</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Automated business deployment pipelines</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Revenue tracking and treasury integration</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Performance monitoring and analytics</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Cross-business optimization strategies</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                Businesses Powered
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">AI Traders</span>
                    <span className="block text-sm text-slate-400">Autonomous trading platform</span>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">AI Web Development Platform</span>
                    <span className="block text-sm text-slate-400">Automated web development</span>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Coinfusion</span>
                    <span className="block text-sm text-slate-400">Crypto market intelligence</span>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">More in Development</span>
                    <span className="block text-sm text-slate-400">Portfolio expanding continuously</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="roadmap">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Roadmap</h2>

          <div className="space-y-6">
            <RoadmapPhase
              phase="Current: Internal Operation"
              timeline="Now"
              status="active"
              features={[
                'Operating as the core engine for all consortium businesses',
                'Managing AI Traders, Web Dev Platform, and Coinfusion',
                'Coordinating multi-agent governance and decision-making',
                'Generating and executing strategic proposals',
                'Continuous optimization of existing portfolio businesses',
              ]}
            />

            <RoadmapPhase
              phase="Commercialization Phase"
              timeline="Q3 2026"
              status="planned"
              features={[
                'External access to AI Business Factory capabilities',
                'Third parties can propose businesses for AI consortium to build',
                'Revenue-sharing models for external business proposals',
                'White-label deployment options for enterprises',
                'API access for developers to integrate with Factory capabilities',
                'Expanded agent marketplace for specialized business strategies',
              ]}
            />

            <RoadmapPhase
              phase="Advanced Ecosystem"
              timeline="2027+"
              status="vision"
              features={[
                'Self-evolving business strategies based on cross-portfolio learning',
                'Autonomous identification and pursuit of opportunities without governance',
                'Integration with external AI networks and data sources',
                'Multi-chain business deployment and management',
                'Advanced risk modeling and portfolio optimization',
                'Factory becomes a platform for global AI-driven entrepreneurship',
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
              The AI Business Factory is the foundation that makes everything else possible.
            </p>

            <div className="space-y-4">
              <FlowItem
                icon={<Brain className="w-6 h-6 text-purple-400" />}
                title="Strategic Intelligence"
                description="The brain of the ecosystem — identifying opportunities and optimizing operations"
              />
              <FlowItem
                icon={<Factory className="w-6 h-6 text-blue-400" />}
                title="Business Creation"
                description="Transforms ideas into operational businesses without human development teams"
              />
              <FlowItem
                icon={<TrendingUp className="w-6 h-6 text-green-400" />}
                title="Portfolio Growth"
                description="Continuously expands ecosystem value by launching new revenue streams"
              />
              <FlowItem
                icon={<Network className="w-6 h-6 text-cyan-400" />}
                title="Cross-Business Synergy"
                description="Optimizes across all businesses for maximum ecosystem-wide efficiency"
              />
              <FlowItem
                icon={<Users className="w-6 h-6 text-yellow-400" />}
                title="Governance Execution"
                description="Translates token holder decisions into executed business strategy"
              />
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Why It Matters
          </h2>

          <div className="max-w-3xl mx-auto space-y-6 text-lg text-slate-300">
            <div className="p-6 bg-slate-700/30 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-3">Traditional Business Model</h3>
              <p className="text-slate-300">
                Building a business requires capital, hiring teams, managing operations, and taking
                years to reach profitability. High risk, high cost, slow execution.
              </p>
            </div>

            <div className="p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-3">AI Business Factory Model</h3>
              <p className="text-slate-300">
                AI agents identify opportunities, build businesses autonomously, and scale operations
                without traditional overhead. Faster execution, lower risk, continuous optimization,
                governed by token holders.
              </p>
            </div>

            <div className="p-6 bg-slate-700/30 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-3">The Result</h3>
              <p className="text-slate-300">
                A self-expanding ecosystem that launches businesses faster than any traditional
                organization, learns from each deployment, and distributes value directly to token holders.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Status & Transparency
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatusCard
              icon={<Cpu className="w-8 h-8 text-green-400" />}
              label="Status"
              value="Active"
              valueColor="text-green-400"
            />
            <StatusCard
              icon={<Briefcase className="w-8 h-8 text-cyan-400" />}
              label="Access"
              value="Internal"
              valueColor="text-cyan-400"
            />
            <StatusCard
              icon={<Users className="w-8 h-8 text-blue-400" />}
              label="Governance"
              value="Token Holders"
              valueColor="text-blue-400"
            />
            <StatusCard
              icon={<Eye className="w-8 h-8 text-purple-400" />}
              label="Commercialization"
              value="Q3 2026"
              valueColor="text-purple-400"
            />
          </div>

          <div className="mt-8 text-center space-y-4">
            <Link
              to="/ecosystem/how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              Learn How It Works
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/governance"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors ml-3"
            >
              Participate in Governance
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            The Factory is the foundation. The ecosystem is the result.
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Explore the businesses powered by the AI Business Factory and see the full potential of
            autonomous entrepreneurship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/portfolio"
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors"
            >
              View Portfolio
            </Link>
            <Link
              to="/ecosystem/ai-consortium"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Learn About the Consortium
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
  status: 'active' | 'planned' | 'vision';
  features: string[];
}) {
  const statusConfig = {
    active: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Active' },
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
