import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  TrendingUp, ArrowRight, DollarSign, RefreshCw, Zap, Shield,
  CheckCircle2, Target, Users, Cpu, BarChart3, AlertTriangle,
  Sparkles, Lock, TrendingDown, Activity
} from 'lucide-react';

export default function EconomicModel() {
  return (
    <PageLayout>
      <div className="space-y-20">
        <section className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            The Economics of Sustainable Growth
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            AI Cost Reduction.{' '}
            <span className="bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
              Sustainable Rewards.
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            A revolutionary economic model where AI agents reduce operational costs to near-zero,
            converting traditional business expenses into perpetual token holder rewards.
          </p>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 max-w-3xl mx-auto">
            <p className="text-lg text-slate-300">
              <strong className="text-white">The Core Thesis:</strong> What if businesses could operate profitably
              with 90% lower costs than competitors? The savings become rewards, creating a deflationary,
              revenue-backed token economy.
            </p>
          </div>
        </section>

        <section className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">The Economic Flywheel</h2>

          <p className="text-center text-slate-300 mb-10 max-w-3xl mx-auto">
            A self-reinforcing cycle where AI efficiency creates revenue, which funds rewards,
            attracting more users, generating more revenue.
          </p>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <FlywheelStep
                number="1"
                icon={<Cpu className="w-8 h-8 text-blue-400" />}
                title="AI Reduces Costs"
                description="Agents automate tasks that normally cost $100K+ in salaries. Operating expenses drop 90%."
              />
              <FlywheelStep
                number="2"
                icon={<DollarSign className="w-8 h-8 text-green-400" />}
                title="Profit Margins Soar"
                description="Same revenue, fraction of the costs = massive profit margins flow to treasury."
              />
              <FlywheelStep
                number="3"
                icon={<Sparkles className="w-8 h-8 text-cyan-400" />}
                title="Rewards Distributed"
                description="60% of net profit funds buyback/burn, staking, and Use-to-Earn rewards."
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FlywheelStep
                number="4"
                icon={<Users className="w-8 h-8 text-purple-400" />}
                title="Users Attracted"
                description="Real rewards attract genuine users, driving organic growth and usage."
              />
              <FlywheelStep
                number="5"
                icon={<BarChart3 className="w-8 h-8 text-yellow-400" />}
                title="Revenue Increases"
                description="More users = more subscriptions, trading fees, and API usage."
              />
              <FlywheelStep
                number="6"
                icon={<RefreshCw className="w-8 h-8 text-green-400" />}
                title="Cycle Accelerates"
                description="Higher revenue amplifies rewards, attracting even more users. The flywheel spins faster."
              />
            </div>

            <div className="mt-10 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                <Activity className="w-6 h-6 text-green-400" />
                <span className="text-white font-semibold">Self-Sustaining Growth Without Inflation</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Failure is Capped. Success Scales.</h2>

          <p className="text-center text-slate-300 mb-10 max-w-3xl mx-auto">
            Unlike traditional tokens with unlimited emission, AAIC has a fixed 100M supply.
            Downside is limited. Upside is unlimited as business revenue grows.
          </p>

          <div className="max-w-5xl mx-auto space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingDown className="w-8 h-8 text-red-400" />
                  <h3 className="text-xl font-bold text-white">Worst Case Scenario</h3>
                </div>
                <div className="space-y-4">
                  <ScenarioItem
                    label="Token Supply"
                    value="Fixed at 100M"
                    description="Cannot inflate to zero"
                  />
                  <ScenarioItem
                    label="Business Portfolio"
                    value="3 validated businesses already live"
                    description="Foundation exists even if growth slows"
                  />
                  <ScenarioItem
                    label="Treasury"
                    value="Guardrails prevent rapid depletion"
                    description="Weekly spend caps protect assets"
                  />
                  <ScenarioItem
                    label="Maximum Loss"
                    value="Limited to token purchase price"
                    description="No leveraged positions or unbounded risk"
                  />
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                  <h3 className="text-xl font-bold text-white">Best Case Scenario</h3>
                </div>
                <div className="space-y-4">
                  <ScenarioItem
                    label="Revenue Growth"
                    value="Unlimited scaling potential"
                    description="Each new business adds revenue stream"
                  />
                  <ScenarioItem
                    label="Token Value"
                    value="Backed by real cash flows"
                    description="Not speculation—actual profit distribution"
                  />
                  <ScenarioItem
                    label="Deflationary Pressure"
                    value="Continuous buyback + burn to 21M"
                    description="Supply shrinks as revenue grows"
                  />
                  <ScenarioItem
                    label="Maximum Gain"
                    value="Theoretically unlimited"
                    description="Scales with portfolio performance"
                  />
                </div>
              </div>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 text-center">
              <p className="text-slate-300">
                <strong className="text-white">Asymmetric Risk Profile:</strong> Limited downside with capped supply
                and guardrails. Unlimited upside as AI businesses scale with minimal marginal costs.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Scaling Timeline: 5 → 50 → 500 Agents</h2>

          <p className="text-center text-slate-300 mb-10 max-w-3xl mx-auto">
            The economic model scales exponentially as the consortium grows from prototype to production scale.
          </p>

          <div className="max-w-5xl mx-auto space-y-6">
            <ScalingPhase
              phase="Year 1"
              agents="5-10 agents"
              projects="3-5 businesses"
              revenue="$100K-$500K annual revenue"
              status="Validation Phase"
              statusColor="text-blue-400"
              bgColor="from-blue-500/10 to-cyan-500/10"
              borderColor="border-blue-500/30"
              details={[
                'Prove the AI consortium model works in production',
                'Establish foundation businesses (AI Traders, Web Dev, Coinfusion)',
                'Begin modest buyback/burn and reward distribution',
                'Focus on product-market fit over revenue maximization',
              ]}
            />

            <ScalingPhase
              phase="Year 2-3"
              agents="50-100 agents"
              projects="10-20 businesses"
              revenue="$5M-$20M annual revenue"
              status="Growth Phase"
              statusColor="text-purple-400"
              bgColor="from-purple-500/10 to-pink-500/10"
              borderColor="border-purple-500/30"
              details={[
                'Scale successful models, sunset underperformers',
                'Launch Q4 2026 flagship business (major revenue driver)',
                'Accelerate buyback/burn toward 21M supply target',
                'Staking and U2E rewards become significant income streams',
              ]}
            />

            <ScalingPhase
              phase="Year 4+"
              agents="500+ agents"
              projects="50+ businesses"
              revenue="$100M+ annual revenue potential"
              status="Scale Phase"
              statusColor="text-green-400"
              bgColor="from-green-500/10 to-cyan-500/10"
              borderColor="border-green-500/30"
              details={[
                'Diversified portfolio across multiple verticals',
                'Each business operates with near-zero marginal costs',
                'Massive deflationary pressure from continuous burns',
                'Token holders receive substantial passive income',
              ]}
            />
          </div>

          <div className="mt-10 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-yellow-400 mb-2">Conservative Estimates</h4>
                <p className="text-sm text-slate-300">
                  These projections assume moderate success. With AI cost advantages, actual growth could significantly
                  exceed these targets. However, <strong className="text-white">past performance does not guarantee future results</strong>,
                  and all crypto investments carry substantial risk.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How Business Profits Flow to Token Holders</h2>

          <p className="text-center text-slate-300 mb-10 max-w-3xl mx-auto">
            Transparent, automated profit distribution ensures token holders directly benefit from ecosystem success.
          </p>

          <div className="max-w-4xl mx-auto space-y-6">
            <ProfitFlowStep
              step="1"
              title="Business Generates Revenue"
              description="AI Traders earn trading fees. Web Dev earns subscriptions. Coinfusion earns advertising revenue."
              icon={<DollarSign className="w-6 h-6 text-green-400" />}
            />
            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-cyan-400 rotate-90" />
            </div>

            <ProfitFlowStep
              step="2"
              title="Operational Costs Deducted"
              description="Server costs, API fees, maintenance. AI agents minimize these to ~10% of revenue."
              icon={<BarChart3 className="w-6 h-6 text-blue-400" />}
            />
            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-cyan-400 rotate-90" />
            </div>

            <ProfitFlowStep
              step="3"
              title="Net Profit Calculated"
              description="Remaining ~90% becomes net profit. This flows into the ecosystem treasury."
              icon={<Target className="w-6 h-6 text-purple-400" />}
            />
            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-cyan-400 rotate-90" />
            </div>

            <ProfitFlowStep
              step="4"
              title="Automated Allocation"
              description="Smart contracts automatically split profit: 30% Buyback+Burn, 30% Staking+U2E, 20% Treasury, 15% Variable."
              icon={<RefreshCw className="w-6 h-6 text-cyan-400" />}
            />
            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-cyan-400 rotate-90" />
            </div>

            <ProfitFlowStep
              step="5"
              title="Value Accrues to Token"
              description="Buybacks reduce supply. Staking provides yield. U2E rewards usage. Treasury funds growth. All backed by real revenue."
              icon={<Sparkles className="w-6 h-6 text-yellow-400" />}
            />
          </div>

          <div className="mt-10 bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
            <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <p className="text-slate-300">
              <strong className="text-white">No Manual Intervention Required:</strong> Once set up, profit distribution
              is fully automated by smart contracts. No team can redirect funds or change allocations without governance approval.
            </p>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Why This Model Works Long-Term</h2>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <LongTermAdvantage
              icon={<Zap className="w-8 h-8 text-yellow-400" />}
              title="AI Cost Advantage"
              points={[
                'AI agents work 24/7 without salaries or benefits',
                'Marginal cost of scaling approaches zero',
                'Competitors paying human salaries cannot compete',
                'Cost advantage compounds as AI improves',
              ]}
            />

            <LongTermAdvantage
              icon={<Lock className="w-8 h-8 text-blue-400" />}
              title="Revenue-Backed Value"
              points={[
                'Token value tied to real business performance',
                'Not dependent on continuous new buyer demand',
                'Deflationary mechanics reduce supply over time',
                'Rewards funded by revenue, not inflation',
              ]}
            />

            <LongTermAdvantage
              icon={<Shield className="w-8 h-8 text-green-400" />}
              title="Governance Protection"
              points={[
                'Treasury guardrails prevent misuse of funds',
                'Weekly spend caps limit downside risk',
                'Community controls all major decisions',
                'Guardian system provides emergency safeguards',
              ]}
            />

            <LongTermAdvantage
              icon={<Users className="w-8 h-8 text-purple-400" />}
              title="Aligned Incentives"
              points={[
                'Token holders benefit directly from business success',
                'U2E rewards encourage genuine product usage',
                'Governance ensures long-term thinking',
                'No team dump risk with transparent vesting',
              ]}
            />
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/token/tokenomics"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors"
            >
              View Full Tokenomics
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section className="text-center">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 lg:p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Traditional Tokenomics vs Revenue-Backed Model</h2>
            <p className="text-slate-300 mb-8">
              Most tokens rely on endless emission and hype cycles. AAIC is backed by real business revenue
              and has a fixed supply cap.
            </p>

            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="font-bold text-red-400 mb-4">Traditional Model</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✗</span>
                    <span>Rewards funded by inflation (dilutes holders)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✗</span>
                    <span>No real revenue backing token value</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✗</span>
                    <span>Requires constant new buyers (Ponzi dynamics)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✗</span>
                    <span>Team controls treasury with minimal oversight</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✗</span>
                    <span>Emission often accelerates over time</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                <h3 className="font-bold text-green-400 mb-4">AAIC Revenue Model</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Rewards funded by business profits (zero dilution)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Token backed by real revenue and cash flows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Self-sustaining: more users = more revenue = more rewards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Governance controls treasury with immutable guardrails</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Supply becomes deflationary (burns toward 21M cap)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/ecosystem/how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
              >
                See How It Works
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function FlywheelStep({ number, icon, title, description }: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 relative">
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
        {number}
      </div>
      <div className="mb-4">{icon}</div>
      <h3 className="font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}

function ScenarioItem({ label, value, description }: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div>
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div className="font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-slate-500">{description}</div>
    </div>
  );
}

function ScalingPhase({ phase, agents, projects, revenue, status, statusColor, bgColor, borderColor, details }: {
  phase: string;
  agents: string;
  projects: string;
  revenue: string;
  status: string;
  statusColor: string;
  bgColor: string;
  borderColor: string;
  details: string[];
}) {
  return (
    <div className={`bg-gradient-to-r ${bgColor} border ${borderColor} rounded-xl p-8`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">{phase}</h3>
        <span className={`px-3 py-1 ${statusColor} bg-slate-900/50 rounded-full text-sm font-bold`}>
          {status}
        </span>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div>
          <div className="text-xs text-slate-400 mb-1">Consortium Size</div>
          <div className="font-bold text-white">{agents}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">Active Businesses</div>
          <div className="font-bold text-white">{projects}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">Revenue Target</div>
          <div className="font-bold text-white">{revenue}</div>
        </div>
      </div>

      <ul className="space-y-2 text-sm text-slate-300">
        {details.map((detail, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span>{detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProfitFlowStep({ step, title, description, icon }: {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 flex items-start gap-4">
      <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
        {step}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          {icon}
          <h3 className="font-bold text-white">{title}</h3>
        </div>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function LongTermAdvantage({ icon, title, points }: {
  icon: React.ReactNode;
  title: string;
  points: string[];
}) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="font-bold text-white text-lg">{title}</h3>
      </div>
      <ul className="space-y-2 text-sm text-slate-300">
        {points.map((point, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
