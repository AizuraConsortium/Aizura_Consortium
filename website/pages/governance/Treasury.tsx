import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Wallet, ArrowRight, TrendingUp, PieChart, Users, Shield, Eye, DollarSign,
  Coins, Target, CheckCircle2, BarChart3, RefreshCw
} from 'lucide-react';

export default function TreasuryDistributions() {
  return (
    <PageLayout>
      <div className="space-y-20">
        <section className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Treasury & Distributions
          </h1>

          <p className="text-2xl text-cyan-400 mb-6 font-medium">
            Where revenue goes and how the ecosystem treasury is managed.
          </p>

          <p className="text-lg text-slate-300 mb-8">
            Transparent, governed allocation of ecosystem resources for sustainable growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/governance"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors"
            >
              View Treasury Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/launchpad/submit-proposal"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Propose Allocation
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Revenue Sources</h2>

          <p className="text-lg text-slate-300 mb-8 max-w-3xl mx-auto text-center">
            The ecosystem treasury is funded by revenue from AI-managed businesses.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RevenueSourceCard
              icon={<TrendingUp className="w-8 h-8 text-green-400" />}
              source="AI Traders"
              description="Trading fees and performance-based revenue from autonomous trading platform"
            />
            <RevenueSourceCard
              icon={<DollarSign className="w-8 h-8 text-blue-400" />}
              source="Web Dev Platform"
              description="Subscription revenue and API access fees from AI web development service"
            />
            <RevenueSourceCard
              icon={<BarChart3 className="w-8 h-8 text-purple-400" />}
              source="Coinfusion"
              description="Advertising, premium subscriptions, and data API revenue"
            />
            <RevenueSourceCard
              icon={<Target className="w-8 h-8 text-cyan-400" />}
              source="Business Factory"
              description="Future commercialization revenue from external business building services"
            />
            <RevenueSourceCard
              icon={<Coins className="w-8 h-8 text-yellow-400" />}
              source="Future Projects"
              description="Revenue from upcoming portfolio businesses (Q4 2026 flagship and beyond)"
            />
            <RevenueSourceCard
              icon={<Shield className="w-8 h-8 text-red-400" />}
              source="Strategic Investments"
              description="Returns from ecosystem treasury investments approved by governance"
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Revenue Distribution</h2>

          <p className="text-lg text-slate-300 mb-8 max-w-3xl mx-auto text-center">
            Revenue flows are allocated according to governance-approved parameters.
          </p>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              <AllocationBar
                category="Token Buybacks & Burns"
                percentage={30}
                color="bg-cyan-500"
                description="Direct value return to token holders through market buybacks and permanent burns"
              />
              <AllocationBar
                category="Staking Rewards"
                percentage={20}
                color="bg-green-500"
                description="Distributed to stakers as yield for locking tokens and securing governance"
              />
              <AllocationBar
                category="Development Fund"
                percentage={25}
                color="bg-blue-500"
                description="Funds new business development, AI infrastructure, and technical improvements"
              />
              <AllocationBar
                category="Operations & Security"
                percentage={15}
                color="bg-purple-500"
                description="Infrastructure costs, security audits, and ongoing operational expenses"
              />
              <AllocationBar
                category="Governance Reserve"
                percentage={10}
                color="bg-yellow-500"
                description="Emergency fund and reserve for governance-approved initiatives"
              />
            </div>

            <div className="mt-8 p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <Eye className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Adjustable by Governance</h3>
                  <p className="text-slate-300">
                    These allocations can be adjusted through governance proposals. Token holders vote on
                    changes to ensure distributions align with ecosystem needs as conditions evolve.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Token Buyback Mechanism</h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <MechanismCard
              step="1"
              title="Revenue Collection"
              description="Revenue from all portfolio businesses flows into the ecosystem treasury in stablecoins (USDC)."
            />
            <MechanismCard
              step="2"
              title="Allocation Split"
              description="Revenue is automatically split according to governance-approved percentages (30% for buybacks by default)."
            />
            <MechanismCard
              step="3"
              title="Market Buyback"
              description="Buyback funds are used to purchase tokens from open market at current prices, increasing demand."
            />
            <MechanismCard
              step="4"
              title="Token Burn"
              description="50% of bought tokens are permanently burned, reducing supply. The other 50% goes to staking rewards."
            />
            <MechanismCard
              step="5"
              title="Transparency"
              description="All buyback transactions are publicly visible on-chain with detailed reporting to the community."
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Staking Rewards</h2>

          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-slate-300 mb-8 text-center">
              Token holders can stake tokens to earn yield from ecosystem revenue.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <StakingMetricCard
                label="Base APY"
                value="12-18%"
                description="Variable yield based on treasury revenue and staking participation"
              />
              <StakingMetricCard
                label="Lock Period"
                value="Flexible"
                description="Longer locks earn higher yields (1 month, 3 months, 6 months, 12 months)"
              />
              <StakingMetricCard
                label="Distribution"
                value="Weekly"
                description="Rewards distributed every week to active stakers"
              />
              <StakingMetricCard
                label="Early Unstake"
                value="5% Penalty"
                description="Penalty fee redistributed to remaining stakers"
              />
            </div>

            <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Lock Period Multipliers</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between text-slate-300">
                  <span>No Lock (Flexible)</span>
                  <span className="font-semibold text-white">1.0x Base APY</span>
                </li>
                <li className="flex items-center justify-between text-slate-300">
                  <span>1 Month Lock</span>
                  <span className="font-semibold text-cyan-400">1.2x Base APY</span>
                </li>
                <li className="flex items-center justify-between text-slate-300">
                  <span>3 Months Lock</span>
                  <span className="font-semibold text-cyan-400">1.5x Base APY</span>
                </li>
                <li className="flex items-center justify-between text-slate-300">
                  <span>6 Months Lock</span>
                  <span className="font-semibold text-cyan-400">2.0x Base APY</span>
                </li>
                <li className="flex items-center justify-between text-slate-300">
                  <span>12 Months Lock</span>
                  <span className="font-semibold text-green-400">3.0x Base APY</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Development Fund</h2>

          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-slate-300 mb-8 text-center">
              25% of revenue is allocated to continuous development and ecosystem expansion.
            </p>

            <div className="space-y-4">
              <DevelopmentAllocation
                category="AI Agent Development"
                percentage={40}
                description="Improving agent capabilities, expanding AI model integrations, and optimizing decision-making"
              />
              <DevelopmentAllocation
                category="New Business Launches"
                percentage={30}
                description="Funding development of new portfolio businesses and opportunities identified by AI agents"
              />
              <DevelopmentAllocation
                category="Platform Improvements"
                percentage={20}
                description="Enhancing governance interfaces, analytics dashboards, and user experience"
              />
              <DevelopmentAllocation
                category="Research & Innovation"
                percentage={10}
                description="Exploring emerging technologies, market opportunities, and strategic partnerships"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Treasury Security & Controls</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <SecurityCard
              icon={<Shield className="w-8 h-8 text-cyan-400" />}
              title="Multi-Signature Control"
              description="Treasury funds require multiple signatures for withdrawals. No single entity controls access."
            />
            <SecurityCard
              icon={<Eye className="w-8 h-8 text-blue-400" />}
              title="Full Transparency"
              description="All treasury transactions are public on-chain. Real-time reporting available to community."
            />
            <SecurityCard
              icon={<CheckCircle2 className="w-8 h-8 text-green-400" />}
              title="Governance Approval"
              description="Large expenditures require governance proposals and token holder voting approval."
            />
            <SecurityCard
              icon={<RefreshCw className="w-8 h-8 text-purple-400" />}
              title="Regular Audits"
              description="Periodic security audits of smart contracts and treasury management systems."
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            How to Propose Changes
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            <ProposalStep
              step="1"
              title="Identify Need"
              description="Recognize a reason to adjust treasury allocations based on ecosystem needs or opportunities."
            />
            <ProposalStep
              step="2"
              title="Draft Proposal"
              description="Write a detailed proposal explaining the change, rationale, expected outcomes, and new allocation percentages."
            />
            <ProposalStep
              step="3"
              title="Community Discussion"
              description="Share proposal in community forums. Gather feedback, answer questions, and refine as needed."
            />
            <ProposalStep
              step="4"
              title="Submit On-Chain"
              description="Submit formal governance proposal with required token stake. Proposal enters review period."
            />
            <ProposalStep
              step="5"
              title="Voting Period"
              description="Token holders vote for 7 days. Requires 20% quorum and 66% approval to pass."
            />
            <ProposalStep
              step="6"
              title="Execution"
              description="If approved, new allocations take effect after 48-hour execution delay."
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Live Treasury Metrics
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={<Wallet className="w-8 h-8 text-green-400" />}
              label="Treasury Balance"
              value="View Dashboard"
              valueColor="text-green-400"
            />
            <MetricCard
              icon={<TrendingUp className="w-8 h-8 text-cyan-400" />}
              label="Monthly Revenue"
              value="View Dashboard"
              valueColor="text-cyan-400"
            />
            <MetricCard
              icon={<Coins className="w-8 h-8 text-yellow-400" />}
              label="Tokens Burned"
              value="View Dashboard"
              valueColor="text-yellow-400"
            />
            <MetricCard
              icon={<Users className="w-8 h-8 text-blue-400" />}
              label="Staking APY"
              value="View Dashboard"
              valueColor="text-blue-400"
            />
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/governance"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              View Full Treasury Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Transparent. Governed. Sustainable.
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            The treasury exists to create long-term value for token holders through responsible,
            community-governed allocation of ecosystem resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/token/staking"
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Start Staking
            </Link>
            <Link
              to="/governance"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
            >
              View Governance
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function RevenueSourceCard({ icon, source, description }: { icon: React.ReactNode; source: string; description: string }) {
  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="text-lg font-bold text-white">{source}</h3>
      </div>
      <p className="text-sm text-slate-300">{description}</p>
    </div>
  );
}

function AllocationBar({
  category,
  percentage,
  color,
  description
}: {
  category: string;
  percentage: number;
  color: string;
  description: string;
}) {
  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white">{category}</h3>
        <span className="text-2xl font-bold text-cyan-400">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-600 rounded-full h-3 mb-3">
        <div className={`${color} h-3 rounded-full`} style={{ width: `${percentage}%` }} />
      </div>
      <p className="text-sm text-slate-300">{description}</p>
    </div>
  );
}

function MechanismCard({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
          {step}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <p className="text-slate-300 ml-14">{description}</p>
    </div>
  );
}

function StakingMetricCard({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6 text-center">
      <div className="text-sm text-slate-400 mb-2">{label}</div>
      <div className="text-2xl font-bold text-cyan-400 mb-2">{value}</div>
      <p className="text-xs text-slate-300">{description}</p>
    </div>
  );
}

function DevelopmentAllocation({
  category,
  percentage,
  description
}: {
  category: string;
  percentage: number;
  description: string;
}) {
  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-bold text-white">{category}</h4>
        <span className="text-xl font-bold text-cyan-400">{percentage}%</span>
      </div>
      <p className="text-sm text-slate-300">{description}</p>
    </div>
  );
}

function SecurityCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
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

function ProposalStep({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg">
      <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
        {step}
      </div>
      <div>
        <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
        <p className="text-sm text-slate-300">{description}</p>
      </div>
    </div>
  );
}

function MetricCard({
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
