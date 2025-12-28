import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Vote, Shield, TrendingUp, Users, Zap, DollarSign, Target,
  ArrowRight, CheckCircle2, Lock, Award, Activity, BarChart3,
  Flame, RefreshCw, Info, Eye, AlertTriangle, Coins
} from 'lucide-react';

export default function TokenOverview() {
  return (
    <PageLayout>
      <div className="space-y-20">
        <section className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-6">
            <Coins className="w-4 h-4" />
            Token Overview
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            The{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AAIC Token
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Governance. Coordination. Incentives. Access.
          </p>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Purpose of the Token</h2>

          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            The AAIC token is not a speculative instrument—it's a coordination tool for a decentralized economic system
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PurposeCard
              icon={<Vote className="w-8 h-8 text-cyan-400" />}
              title="Governance"
              description="Vote on proposals, approve businesses, and shape ecosystem direction"
            />
            <PurposeCard
              icon={<Users className="w-8 h-8 text-blue-400" />}
              title="Coordination"
              description="Align community members around shared goals and decision-making"
            />
            <PurposeCard
              icon={<TrendingUp className="w-8 h-8 text-green-400" />}
              title="Incentives"
              description="Reward participation through voting rewards and value accrual"
            />
            <PurposeCard
              icon={<Target className="w-8 h-8 text-purple-400" />}
              title="Access"
              description="Required to submit proposals and participate in the ecosystem"
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <Coins className="w-8 h-8 text-cyan-400" />
            Token Specifications
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            Complete technical specifications for the AAIC token
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-cyan-400" />
                Core Identity
              </h3>
              <SpecRow label="Name" value="Autonomous AI Consortium" />
              <SpecRow label="Symbol" value="AAIC" />
              <SpecRow label="Standard" value="BEP-20 (EVM ERC-20 compatible)" />
              <SpecRow label="Decimals" value="18" />
              <SpecRow label="Canonical Chain" value="BNB Chain" highlight />
              <SpecRow label="Max Supply" value="100,000,000 AAIC" highlight />
            </div>

            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Cross-Chain Strategy
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-slate-400 mb-1">V1 Launch (2025)</div>
                  <div className="flex flex-wrap gap-2">
                    <ChainBadge name="BNB Chain" isPrimary />
                    <ChainBadge name="Base" />
                    <ChainBadge name="Avalanche" />
                    <ChainBadge name="Sui" />
                    <ChainBadge name="Hyperliquid" />
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">V2 Expansion (Late 2026)</div>
                  <div className="flex flex-wrap gap-2">
                    <ChainBadge name="Optimism" />
                    <ChainBadge name="Fantom" />
                    <ChainBadge name="Solana" />
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 mt-4">
                <p className="text-xs text-slate-400">
                  <span className="text-cyan-400 font-medium">Axelar ITS</span> handles cross-chain bridging with BNB Chain as canonical source
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-white mb-2">Immutable Supply</h4>
                <p className="text-sm text-slate-300">
                  The max supply of 100,000,000 AAIC is fixed and immutable. No additional tokens can ever be created,
                  even through governance. This ensures absolute scarcity and predictable tokenomics.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Distribution Philosophy</h2>

          <div className="max-w-3xl mx-auto space-y-6 text-lg text-slate-300 leading-relaxed mb-10">
            <p>
              Unlike traditional token launches, AAIC has <strong className="text-white">no token sale</strong>—public or private.
              Distribution is entirely <strong className="text-cyan-400">participation-based</strong>.
            </p>
            <p>
              This model ensures that those who contribute to the ecosystem's success are the ones who own it.
              No VCs. No early investor dominance. Just builders, voters, and long-term participants.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <PhilosophyCard
              icon={<Shield className="w-6 h-6 text-green-400" />}
              title="No Token Sale"
              description="No public or private sale. All tokens earned through participation."
            />
            <PhilosophyCard
              icon={<Users className="w-6 h-6 text-cyan-400" />}
              title="Participation-Based"
              description="Airdrop rewards voting, proposing, and using ecosystem products."
            />
            <PhilosophyCard
              icon={<Lock className="w-6 h-6 text-purple-400" />}
              title="Long-Term Alignment"
              description="Vesting schedules ensure participants stay committed to ecosystem success."
            />
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/token/airdrop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
            >
              Learn About the Airdrop
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <Activity className="w-8 h-8 text-cyan-400" />
            Emissions & Transition
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            The token supply model transitions from bootstrap emissions to a sustainable, revenue-backed system
          </p>

          <div className="space-y-6">
            <EmissionPhase
              phase="Phase 1"
              title="Early Bootstrap Emissions"
              status="active"
              description="Initial emissions to reward early participants and bootstrap governance"
              details={[
                'Airdrop distribution to early users',
                'Governance participation rewards',
                'Proposer incentives',
                'Controlled emission schedule'
              ]}
            />
            <EmissionPhase
              phase="Phase 2"
              title="Fixed Max Supply"
              status="upcoming"
              description="Supply cap reached, no new tokens can be created"
              details={[
                '100,000,000 total max supply',
                'Cannot be increased through governance',
                'Scarcity creates value as demand grows',
                'Deflationary mechanisms active'
              ]}
            />
            <EmissionPhase
              phase="Phase 3"
              title="Revenue-Backed Rewards"
              status="upcoming"
              description="Transition to sustainable rewards funded by ecosystem revenue"
              details={[
                'Buybacks from business profits',
                'Staking rewards from revenue (future)',
                'Treasury-funded distributions',
                'Self-sustaining incentive model'
              ]}
            />
          </div>
        </section>

        <section className="bg-gradient-to-br from-red-900/10 to-orange-900/10 border border-orange-500/20 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <Flame className="w-8 h-8 text-orange-400" />
            Deflation & Sustainability
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            Multiple deflationary mechanisms ensure long-term token value accrual as the ecosystem grows
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <DeflationCard
              icon={<Flame className="w-8 h-8 text-orange-400" />}
              title="Token Buybacks"
              description="Ecosystem revenue used to buy tokens from the market"
              mechanism="Reduces circulating supply, increases scarcity"
            />
            <DeflationCard
              icon={<RefreshCw className="w-8 h-8 text-red-400" />}
              title="Token Burns"
              description="Bought-back tokens are permanently burned"
              mechanism="Supply decreases while demand increases with ecosystem growth"
            />
            <DeflationCard
              icon={<BarChart3 className="w-8 h-8 text-yellow-400" />}
              title="Treasury-Controlled Flows"
              description="Strategic management of token supply and demand"
              mechanism="Transparent governance over distribution rates"
            />
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 text-center">
            <p className="text-lg font-bold text-white mb-2">
              The Growth Formula
            </p>
            <p className="text-slate-300">
              More businesses → More revenue → More buybacks → Less supply → Higher value per token
            </p>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Token Utility in Action</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <UtilityCard
              icon={<Vote className="w-8 h-8 text-cyan-400" />}
              title="Voting Power"
              actions={[
                'Vote on business proposals',
                'Approve treasury spending',
                'Govern platform parameters',
                'Shape strategic direction'
              ]}
              requirement="Any amount to vote"
            />
            <UtilityCard
              icon={<Award className="w-8 h-8 text-green-400" />}
              title="Voting Rewards"
              actions={[
                'Earn rewards for voting on winning proposals',
                'Early voter bonuses',
                'Consistent participation multipliers',
                'Quality contribution bonuses'
              ]}
              requirement="Automatic for voters"
            />
            <UtilityCard
              icon={<Target className="w-8 h-8 text-blue-400" />}
              title="Proposal Submission"
              actions={[
                'Submit business proposals',
                'Earn proposer rewards if approved',
                'Shape ecosystem direction',
                'Access to AI execution'
              ]}
              requirement="50,000 AAIC minimum"
            />
            <UtilityCard
              icon={<Zap className="w-8 h-8 text-cyan-400" />}
              title="Use-to-Earn Rewards"
              actions={[
                'Earn tokens by using ecosystem products',
                'AI Traders, AI Business Factory, AI Web Dev',
                'Automatic reward accrual',
                'Sustainable long-term distribution'
              ]}
              requirement="Active ecosystem usage"
            />
            <UtilityCard
              icon={<Lock className="w-8 h-8 text-purple-400" />}
              title="Future Staking"
              actions={[
                'Stake tokens for additional rewards',
                'Revenue-sharing from ecosystem profits',
                'Enhanced governance weight',
                'Long-term value accrual'
              ]}
              requirement="TBD - Coming later"
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <Eye className="w-8 h-8 text-cyan-400" />
            Value Accrual Mechanisms
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            Multiple pathways for token value to increase as the ecosystem grows
          </p>

          <div className="space-y-4">
            <ValueAccrualItem
              title="Revenue Buybacks"
              description="Portion of business profits used to buy tokens from market, reducing supply"
            />
            <ValueAccrualItem
              title="Deflationary Burns"
              description="Bought-back tokens permanently removed from circulation"
            />
            <ValueAccrualItem
              title="Increased Demand"
              description="More participants need tokens to vote and propose as ecosystem grows"
            />
            <ValueAccrualItem
              title="Governance Premium"
              description="Control over valuable ecosystem assets increases token utility"
            />
            <ValueAccrualItem
              title="Staking Utility (Future)"
              description="Revenue-sharing through staking creates holding incentive"
            />
            <ValueAccrualItem
              title="Network Effects"
              description="More businesses = more revenue = more value flowing to token holders"
            />
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <Link
            to="/token/tokenomics"
            className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-500/50 transition-colors group"
          >
            <BarChart3 className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold text-white mb-3">View Full Tokenomics</h3>
            <p className="text-slate-300 mb-4">
              Detailed breakdown of token distribution, emissions, and economic model
            </p>
            <div className="flex items-center gap-2 text-cyan-400 font-medium">
              View Tokenomics
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>

          <Link
            to="/token/transparency"
            className="bg-gradient-to-br from-green-600/20 to-cyan-600/20 border border-green-500/30 rounded-2xl p-8 hover:border-green-500/50 transition-colors group"
          >
            <Eye className="w-12 h-12 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold text-white mb-3">Token Transparency</h3>
            <p className="text-slate-300 mb-4">
              Real-time metrics, supply tracking, and complete transparency dashboard
            </p>
            <div className="flex items-center gap-2 text-cyan-400 font-medium">
              View Transparency
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </section>

        <section className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-8">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white mb-2">Important Note</h3>
              <p className="text-sm text-slate-300 mb-4">
                The token model is designed for long-term sustainability, not short-term speculation.
                Value accrues through real business revenue, not token emissions or ponzi mechanics.
              </p>
              <Link
                to="/legal/disclaimer"
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium inline-flex items-center gap-1"
              >
                Read Risk Disclosure
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function PurposeCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-colors">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}

function PhilosophyCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
      <div className="mb-3">{icon}</div>
      <h4 className="font-bold text-white mb-2">{title}</h4>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}

function EmissionPhase({ phase, title, status, description, details }: {
  phase: string;
  title: string;
  status: 'active' | 'upcoming';
  description: string;
  details: string[];
}) {
  const statusColors = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };

  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{phase}: {title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <p className="text-slate-300 mb-4">{description}</p>
      <ul className="space-y-2">
        {details.map((detail, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span>{detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DeflationCard({ icon, title, description, mechanism }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  mechanism: string;
}) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-sm text-slate-300 mb-3">{description}</p>
      <div className="bg-slate-800/50 rounded-lg p-3">
        <p className="text-xs text-slate-400">{mechanism}</p>
      </div>
    </div>
  );
}

function UtilityCard({ icon, title, actions, requirement }: {
  icon: React.ReactNode;
  title: string;
  actions: string[];
  requirement: string;
}) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <ul className="space-y-2 mb-4">
        {actions.map((action, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span>{action}</span>
          </li>
        ))}
      </ul>
      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
        <p className="text-xs text-cyan-400 font-medium">{requirement}</p>
      </div>
    </div>
  );
}

function ValueAccrualItem({ title, description }: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-4 flex items-start gap-4">
      <TrendingUp className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-bold text-white mb-1">{title}</h4>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function SpecRow({ label, value, highlight }: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-slate-400">{label}:</span>
      <span className={`text-sm font-medium ${highlight ? 'text-cyan-400' : 'text-white'}`}>
        {value}
      </span>
    </div>
  );
}

function ChainBadge({ name, isPrimary }: {
  name: string;
  isPrimary?: boolean;
}) {
  return (
    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
      isPrimary
        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
        : 'bg-slate-700/50 text-slate-300 border border-slate-600'
    }`}>
      {name}
    </div>
  );
}
