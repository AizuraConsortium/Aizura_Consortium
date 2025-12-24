import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Rocket, ArrowRight, Clock, Sparkles, Eye, Lock, Zap, Target, TrendingUp, Users, Shield
} from 'lucide-react';

export default function Q42026FlagshipProject() {
  return (
    <PageLayout>
      <div className="space-y-20">
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium mb-6">
            <Clock className="w-4 h-4" />
            Coming Q4 2026
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Q4 2026 Flagship Project
          </h1>

          <p className="text-2xl text-cyan-400 mb-6 font-medium">
            A major new initiative launching in Q4 2026.
          </p>

          <p className="text-lg text-slate-300 mb-8">
            Details will be revealed as development progresses. Token holders will vote on strategic decisions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/governance"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Join Governance
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/token/airdrop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Get Early Access
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">What We Can Share</h2>

          <p className="text-lg text-slate-300 mb-8 max-w-3xl mx-auto text-center">
            While specific details remain under wraps, we can share the strategic direction and principles
            guiding this major initiative.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Rocket className="w-8 h-8 text-blue-400" />}
              title="High Impact"
              description="A significant addition to the portfolio with major market potential"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-yellow-400" />}
              title="AI-Powered"
              description="Built and operated by autonomous AI agents"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 text-green-400" />}
              title="Revenue Focus"
              description="Designed to generate substantial income for the ecosystem"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-cyan-400" />}
              title="Community Governed"
              description="Token holders will guide strategic decisions"
            />
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Why The Secrecy?</h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <ReasonCard
              title="Competitive Advantage"
              description="In rapidly evolving markets, maintaining strategic advantages means protecting early-stage plans until execution is ready. Premature disclosure invites copycats and competitors."
            />
            <ReasonCard
              title="Flexibility During Development"
              description="AI-driven development allows for rapid pivots and optimization. Locking in public commitments too early limits our ability to adapt to market conditions and technical discoveries."
            />
            <ReasonCard
              title="Governance-First Approach"
              description="Token holders will have input on key strategic decisions as they arise. Community governance works better with concrete proposals than distant speculation."
            />
            <ReasonCard
              title="Focus on Current Portfolio"
              description="Premature hype distracts from current businesses generating real value today. We'd rather show results than make promises."
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            What Token Holders Can Expect
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            <ExpectationItem
              title="Phased Disclosure"
              description="Information will be shared as development milestones are reached, with governance votes on key decisions."
            />
            <ExpectationItem
              title="Strategic Voting Rights"
              description="Token holders will vote on major aspects including resource allocation, feature priorities, and go-to-market strategy."
            />
            <ExpectationItem
              title="Transparent Progress Updates"
              description="Regular updates on development status without revealing competitive details prematurely."
            />
            <ExpectationItem
              title="Early Access Opportunities"
              description="Token holders may receive priority access to beta testing and early launch phases."
            />
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Guiding Principles</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <PrincipleCard
              icon={<Target className="w-8 h-8 text-cyan-400" />}
              title="Market Validated"
              description="Building solutions to real problems with proven demand, not speculative moonshots."
            />
            <PrincipleCard
              icon={<Sparkles className="w-8 h-8 text-purple-400" />}
              title="AI-First Design"
              description="Leveraging AI capabilities that would be impossible or impractical with traditional development."
            />
            <PrincipleCard
              icon={<TrendingUp className="w-8 h-8 text-green-400" />}
              title="Revenue Focused"
              description="Designed for sustainable revenue generation, not just user acquisition or engagement metrics."
            />
            <PrincipleCard
              icon={<Users className="w-8 h-8 text-blue-400" />}
              title="Ecosystem Synergy"
              description="Complements existing portfolio businesses and strengthens the overall ecosystem."
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Timeline</h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <TimelineItem
              period="Now - Q2 2026"
              status="planned"
              title="Stealth Development"
              description="Core development, market validation, and technical proof-of-concept work."
            />
            <TimelineItem
              period="Q3 2026"
              status="planned"
              title="Community Preparation"
              description="Initial disclosure to token holders, governance proposals, and strategic planning votes."
            />
            <TimelineItem
              period="Q4 2026"
              status="planned"
              title="Public Launch"
              description="Official announcement, beta testing, and phased rollout to users."
            />
            <TimelineItem
              period="2027+"
              status="vision"
              title="Scaling & Optimization"
              description="Full-scale operation, continuous improvement, and integration with broader ecosystem."
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            How This Fits The Ecosystem
          </h2>

          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-slate-300 mb-8 text-center">
              Every project in the portfolio serves a strategic purpose and contributes to ecosystem value.
            </p>

            <div className="space-y-4">
              <FlowItem
                icon={<Rocket className="w-6 h-6 text-blue-400" />}
                title="Portfolio Expansion"
                description="Diversifies revenue streams and reduces dependency on any single business"
              />
              <FlowItem
                icon={<TrendingUp className="w-6 h-6 text-green-400" />}
                title="Treasury Growth"
                description="New revenue flows into treasury for token buybacks, burns, and ecosystem expansion"
              />
              <FlowItem
                icon={<Users className="w-6 h-6 text-purple-400" />}
                title="Token Value"
                description="Increased portfolio value and revenue potential strengthens token value proposition"
              />
              <FlowItem
                icon={<Sparkles className="w-6 h-6 text-yellow-400" />}
                title="Market Position"
                description="Strengthens the consortium's reputation as a leader in AI-driven business creation"
              />
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Status & Transparency
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatusCard
              icon={<Clock className="w-8 h-8 text-yellow-400" />}
              label="Status"
              value="In Development"
              valueColor="text-yellow-400"
            />
            <StatusCard
              icon={<Lock className="w-8 h-8 text-slate-400" />}
              label="Details"
              value="Confidential"
              valueColor="text-slate-400"
            />
            <StatusCard
              icon={<Eye className="w-8 h-8 text-blue-400" />}
              label="Launch"
              value="Q4 2026"
              valueColor="text-blue-400"
            />
            <StatusCard
              icon={<Users className="w-8 h-8 text-cyan-400" />}
              label="Governance"
              value="Token Holders"
              valueColor="text-cyan-400"
            />
          </div>

          <div className="mt-8 text-center space-y-4">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              View Current Portfolio
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/governance"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors ml-3"
            >
              Join Governance
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Something big is coming. Be ready.
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Token holders will have exclusive early access and voting rights on this major new initiative.
            Don't miss out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/token/airdrop"
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Join the Ecosystem
            </Link>
            <Link
              to="/governance"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Learn About Governance
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

function ReasonCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-300">{description}</p>
    </div>
  );
}

function ExpectationItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg">
      <ArrowRight className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
        <p className="text-sm text-slate-300">{description}</p>
      </div>
    </div>
  );
}

function PrincipleCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <p className="text-slate-300">{description}</p>
    </div>
  );
}

function TimelineItem({
  period,
  status,
  title,
  description
}: {
  period: string;
  status: 'planned' | 'vision';
  title: string;
  description: string;
}) {
  const statusConfig = {
    planned: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
    vision: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  };

  const config = statusConfig[status];

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div>
          <span className="text-sm text-slate-400">{period}</span>
          <h3 className="text-xl font-bold text-white mt-1">{title}</h3>
        </div>
        <span className={`px-3 py-1 ${config.bg} ${config.text} text-sm font-medium rounded-full w-fit`}>
          {status === 'planned' ? 'Planned' : 'Vision'}
        </span>
      </div>
      <p className="text-slate-300">{description}</p>
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
