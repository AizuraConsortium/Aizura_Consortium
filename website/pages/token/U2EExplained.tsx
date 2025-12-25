import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Zap, TrendingUp, CheckCircle2, ArrowRight, Clock, Shield,
  Users, Activity, Target, Coins, BarChart3, Sparkles, Info,
  AlertTriangle, Brain, Rocket
} from 'lucide-react';
import { U2ECalculator } from '../../components/tokenomics/U2ECalculator';
import { TokenomicsPhaseVisualizer } from '../../components/tokenomics/TokenomicsPhaseVisualizer';

export default function U2EExplained() {
  return (
    <PageLayout>
      <div className="space-y-20">
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Use-to-Earn
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Earn{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AAIC tokens
            </span>{' '}
            by using the ecosystem
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Use-to-Earn (U2E) rewards genuine ecosystem participation. The more you use AI Traders,
            AI Business Factory, and AI Web Dev, the more AAIC tokens you earn.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/client/dashboard"
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              Start Earning
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#calculator"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
            >
              Calculate Earnings
            </a>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What is Use-to-Earn?</h2>

          <div className="max-w-3xl mx-auto space-y-6 text-lg text-slate-300 leading-relaxed mb-10">
            <p>
              Use-to-Earn (U2E) is a reward system that distributes AAIC tokens to users based on
              their <strong className="text-white">actual usage</strong> of ecosystem products.
            </p>
            <p>
              Unlike speculation-driven models, U2E aligns incentives with genuine value creation.
              You earn rewards by <strong className="text-cyan-400">using the tools that help you succeed</strong>,
              not by holding tokens and hoping for price appreciation.
            </p>
            <p className="text-cyan-400 font-medium">
              This is honest economics: Use our platforms → Get rewards → Own part of the ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <PrincipleCard
              icon={<Activity className="w-8 h-8 text-cyan-400" />}
              title="Action-Based"
              description="Rewards are tied to specific actions: trades, business launches, projects completed"
            />
            <PrincipleCard
              icon={<Shield className="w-8 h-8 text-green-400" />}
              title="Fair & Transparent"
              description="Clear reward rates published openly. No hidden mechanisms or preferential treatment"
            />
            <PrincipleCard
              icon={<TrendingUp className="w-8 h-8 text-blue-400" />}
              title="Sustainable"
              description="Long-term model transitioning from fixed supply to revenue-backed rewards"
            />
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How It Works</h2>

          <div className="space-y-6">
            <StepCard
              number="1"
              title="Use Ecosystem Products"
              description="Actively use AI Traders for trading, AI Business Factory for business creation, or AI Web Dev for development projects."
              icon={<Rocket className="w-6 h-6 text-cyan-400" />}
              highlights={[
                'Every action is tracked securely',
                'Automated reward calculation',
                'Real-time balance updates',
                'No manual claims required'
              ]}
            />

            <StepCard
              number="2"
              title="Earn AAIC Tokens"
              description="Each eligible action earns you AAIC tokens based on predefined reward rates. Your rewards accumulate automatically in your account."
              icon={<Coins className="w-6 h-6 text-green-400" />}
              highlights={[
                'Fixed rates per action type',
                'Instant accrual on completion',
                'Transparent calculation',
                'Fraud detection protections'
              ]}
            />

            <StepCard
              number="3"
              title="Claim When Active"
              description="Once the U2E system is officially activated (post-airdrop), you can claim your accumulated rewards and use them across the ecosystem."
              icon={<Target className="w-6 h-6 text-blue-400" />}
              highlights={[
                'Rewards tracked from day one',
                'Claimable after system activation',
                'Use for governance voting',
                'Stake for additional benefits'
              ]}
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Eligible Platforms</h2>

          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            U2E rewards are available across all core ecosystem platforms
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <PlatformCard
              name="AI Traders"
              status="Active"
              statusColor="green"
              description="Autonomous trading platform powered by AI algorithms"
              rewardActions={[
                { action: 'Execute Trade', reward: 5 },
                { action: 'Profitable Trade', reward: 10 },
                { action: 'Strategy Deployment', reward: 25 }
              ]}
            />
            <PlatformCard
              name="AI Business Factory"
              status="Reserved"
              statusColor="yellow"
              description="AI-powered business creation and management platform"
              rewardActions={[
                { action: 'Create Business', reward: 50 },
                { action: 'Business Launch', reward: 100 },
                { action: 'Revenue Milestone', reward: 200 }
              ]}
            />
            <PlatformCard
              name="AI Web Dev"
              status="Planning"
              statusColor="blue"
              description="Autonomous web development and deployment tool"
              rewardActions={[
                { action: 'Project Completion', reward: 10 },
                { action: 'Deployment', reward: 20 },
                { action: 'Client Milestone', reward: 50 }
              ]}
            />
          </div>

          <div className="mt-8 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white mb-2">Tracking Starts Immediately</h4>
                <p className="text-sm text-slate-300">
                  Even though the U2E system is not yet active for claiming, we are tracking all eligible
                  actions from day one. When the system goes live, you'll be credited for all your past usage.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="calculator">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Earning Potential Calculator</h2>
          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            Estimate how much you could earn based on your expected usage patterns
          </p>
          <U2ECalculator />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Three-Phase Tokenomics Model</h2>
          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            U2E rewards transition through three distinct phases, balancing immediate incentives with long-term sustainability
          </p>
          <TokenomicsPhaseVisualizer />
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
              Benefits of U2E
            </h3>
            <ul className="space-y-3">
              <BenefitItem text="Earn passively while using products you already need" />
              <BenefitItem text="Build significant token holdings over time through usage" />
              <BenefitItem text="Aligned incentives: Better products = More usage = More rewards" />
              <BenefitItem text="Transparent and predictable reward rates" />
              <BenefitItem text="No speculation required—just use and earn" />
              <BenefitItem text="Fraud protection ensures fair distribution" />
            </ul>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
              Important Considerations
            </h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span>U2E system must be activated before rewards can be claimed</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span>Reward rates may change based on governance decisions</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span>Token value fluctuates with market conditions</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span>Abuse and fraud will result in account suspension</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span>Phase transitions may affect reward amounts</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Why U2E Matters</h2>

          <div className="max-w-3xl mx-auto space-y-6 text-lg text-slate-300 leading-relaxed">
            <p>
              Traditional crypto projects distribute tokens through sales, airdrops, or yield farming.
              These methods often attract speculators, not genuine users.
            </p>
            <p>
              <strong className="text-white">U2E is different.</strong> By tying token distribution
              directly to product usage, we ensure that those who earn tokens are the same people who
              derive real value from the ecosystem.
            </p>
            <p className="text-cyan-400 font-medium">
              This creates a virtuous cycle: Better products → More users → More distribution →
              Stronger community → Better products.
            </p>
            <p>
              U2E is how we build a sustainable, user-owned ecosystem that lasts decades, not months.
            </p>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Ready to Start Earning?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <ActionCard
              to="/client/dashboard"
              icon={<Activity className="w-6 h-6 text-cyan-400" />}
              title="U2E Dashboard"
              description="Track your earnings"
            />
            <ActionCard
              to="/token/tokenomics"
              icon={<BarChart3 className="w-6 h-6 text-green-400" />}
              title="Full Tokenomics"
              description="Complete economic model"
            />
            <ActionCard
              to="/legal/u2e-terms"
              icon={<Shield className="w-6 h-6 text-blue-400" />}
              title="U2E Terms"
              description="Read the fine print"
            />
            <ActionCard
              to="/community/faq"
              icon={<Info className="w-6 h-6 text-purple-400" />}
              title="U2E FAQ"
              description="Common questions"
            />
          </div>
        </section>

        <section className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white mb-2">Risk Disclosure</h3>
              <p className="text-sm text-slate-300 mb-4">
                U2E rewards are not guaranteed income and token value can fluctuate significantly.
                Participate only if you understand the risks and would use the products regardless of rewards.
              </p>
              <Link
                to="/legal/risk-disclosure"
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

function PrincipleCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-300">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description, icon, highlights }: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlights: string[];
}) {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-3">
            {number}
          </div>
          <div className="flex justify-center">{icon}</div>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
          <p className="text-slate-300 mb-4 leading-relaxed">{description}</p>
          <ul className="space-y-2">
            {highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function PlatformCard({ name, status, statusColor, description, rewardActions }: {
  name: string;
  status: string;
  statusColor: 'green' | 'yellow' | 'blue';
  description: string;
  rewardActions: { action: string; reward: number }[];
}) {
  const colorMap = {
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };

  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colorMap[statusColor]}`}>
          {status}
        </span>
      </div>
      <p className="text-sm text-slate-300 mb-4">{description}</p>
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-400 mb-2">Reward Actions:</h4>
        {rewardActions.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-0">
            <span className="text-sm text-slate-300">{item.action}</span>
            <span className="text-sm font-bold text-cyan-400">{item.reward} AAIC</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-slate-300">
      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
      <span>{text}</span>
    </li>
  );
}

function ActionCard({ to, icon, title, description }: {
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
