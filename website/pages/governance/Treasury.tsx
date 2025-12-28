import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Wallet, ArrowRight, TrendingUp, PieChart, Users, Shield, Eye, DollarSign,
  Coins, Target, CheckCircle2, BarChart3, RefreshCw, XCircle
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
          <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <PieChart className="w-8 h-8 text-cyan-400" />
            Revenue Distribution Model
          </h2>

          <p className="text-lg text-slate-300 mb-8 max-w-3xl mx-auto text-center">
            After business operational costs, net profit is allocated according to this transparent model.
          </p>

          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Fixed Base (85% total)</h3>
              <div className="space-y-3">
                <AllocationBar
                  category="Buyback"
                  percentage={15}
                  color="bg-cyan-500"
                  description="Buy AAIC from market using stablecoin revenue"
                />
                <AllocationBar
                  category="Burn"
                  percentage={15}
                  color="bg-orange-500"
                  description="Until 21M AAIC burned, then redirected by governance"
                />
                <AllocationBar
                  category="Staking Support"
                  percentage={15}
                  color="bg-green-500"
                  description="Funds staking rewards post-Year 4"
                />
                <AllocationBar
                  category="Use-to-Earn Support"
                  percentage={15}
                  color="bg-blue-500"
                  description="Funds U2E rewards post-48 months"
                />
                <AllocationBar
                  category="Treasury"
                  percentage={25}
                  color="bg-purple-500"
                  description="Long-term growth, operations, development"
                />
              </div>
            </div>

            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Variable Bucket (15% total)</h3>
              <div className="text-slate-300 text-sm space-y-2">
                <p>Governance-adjustable bucket for experiments, liquidity, and special initiatives</p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 mt-3">
                  <p className="text-xs text-slate-300">
                    Can be allocated to any combination: additional buybacks, LP incentives, partnerships, marketing, or emergency reserves
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900/20 to-cyan-900/20 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Why This Works</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">Simple, transparent percentages</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">Fixed minimums prevent over-allocation</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">Burn stops at 21M target (12-year timeline)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">Revenue-backs post-emissions rewards</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">Treasury stays healthy for growth</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">Variable bucket allows adaptation</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <Shield className="w-8 h-8 text-red-400" />
            Treasury Guardrails (Protocol-Enforced)
          </h2>

          <p className="text-lg text-slate-300 mb-8 max-w-3xl mx-auto text-center">
            The TreasuryVault smart contract has HARD-CODED limits that governance cannot bypass.
          </p>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-cyan-400" />
                Weekly Spend Caps
              </h3>
              <div className="space-y-3 text-sm">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="font-bold text-white mb-1">Stablecoin Cap</div>
                  <div className="text-slate-300">max($50,000, 3% of treasury stablecoin balance) per week</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="font-bold text-white mb-1">AAIC Token Cap</div>
                  <div className="text-slate-300">max(250,000 AAIC, 2% of treasury AAIC balance) per week</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                Allowlist Only
              </h3>
              <p className="text-slate-300 mb-4">Treasury can ONLY interact with pre-approved contracts:</p>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Approved DEX routers (buybacks)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Approved buyback executor</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Approved staking/U2E vaults</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Approved liquidity manager</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">NO arbitrary external calls</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">NO unapproved addresses</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <RefreshCw className="w-6 h-6 text-blue-400" />
                Buyback Guardrails
              </h3>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                  <span>Max frequency</span>
                  <span className="font-medium text-white">1 per week (or 2 per month)</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                  <span>Slippage cap</span>
                  <span className="font-medium text-white">≤ 2.5% (governance can adjust up to 5% max)</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded">
                  <span>Daily buyback spend cap</span>
                  <span className="font-medium text-white">≤ 0.5% of treasury stablecoin balance</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                LP (Liquidity Pool) Guardrails
              </h3>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>LP withdrawals limited to max 25% of position per month</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Emergency vote required for larger withdrawals</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Prevents "liquidity rug" optics</span>
                </div>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white mb-2">Immutable Smart Contract Rules</h4>
                  <p className="text-sm text-slate-300">
                    These rules are IMMUTABLE at the smart contract level. Governance cannot bypass them.
                    This ensures absolute protection of treasury funds and prevents abuse.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <Users className="w-8 h-8 text-yellow-400" />
            Emergency Pause Mechanism (3 Guardians)
          </h2>

          <p className="text-lg text-slate-300 mb-8 max-w-3xl mx-auto text-center">
            For the first year: 3 FIXED guardians. After Year 1: DAO feature allows rotation to trusted crypto industry actors.
          </p>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Current Guardian Setup (First Year)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-cyan-400 mb-3">Guardian Powers (Limited)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">Emergency pause on security exploits</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">Pause interchain transfers</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">Pause staking</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">Pause U2E claims</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">Pause specific contracts</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-red-400 mb-3">What Guardians CANNOT Do</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">Cannot move treasury funds</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">Cannot change allocations</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">Cannot mint tokens</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">Cannot access treasury</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">Cannot override governance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">Cannot change token supply</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-sm text-slate-300">
                  <span className="font-bold text-white">2-of-3 multisig:</span> Requires 2 guardians to agree on any emergency pause action
                </p>
              </div>
            </div>

            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Future Guardian Rotation (After Year 1)</h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>DAO votes on guardian candidates</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Trusted actors from crypto industry</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Vetted reputation requirements</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>3-of-5 multisig (upgrade from 2-of-3)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Transparent selection process</span>
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
              description="Revenue is automatically split according to governance-approved percentages (15% buyback, 15% burn, 15% staking, 15% U2E, 25% treasury, 15% variable)."
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
              Token holders can stake tokens to earn yield. APY is market-based and varies by total amount staked.
            </p>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-white mb-3">Market-Based APY Formula</h3>
              <div className="text-center text-xl font-mono text-cyan-400 mb-4">
                APY = (Annual Staking Rewards / Total Staked) × 100
              </div>
              <p className="text-sm text-slate-300 text-center">
                Years 1-4: Fixed emissions from 15M pool. Post-Year-4: Revenue-backed from 15% of monthly net profit.
                Lower staking = higher APY, higher staking = lower APY.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <StakingMetricCard
                label="Launch Timeframe"
                value="Q3/Q4 2026"
                description="Staking launches aligned with revenue generation"
              />
              <StakingMetricCard
                label="Lock Period"
                value="Flexible"
                description="Multiple lock options with multipliers (30d, 90d, 180d, 365d)"
              />
              <StakingMetricCard
                label="Rewards Source"
                value="Dual Model"
                description="Y1-4: 15M emissions pool. Post-Y4: 15% of monthly profit"
              />
              <StakingMetricCard
                label="Distribution"
                value="Continuous"
                description="Rewards accrue in real-time, claim anytime"
              />
            </div>

            <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Lock Period Multipliers (Proposed)</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between text-slate-300">
                  <span>Flexible (no lock)</span>
                  <span className="font-semibold text-white">1.0x</span>
                </li>
                <li className="flex items-center justify-between text-slate-300">
                  <span>30 Days</span>
                  <span className="font-semibold text-cyan-400">1.2x</span>
                </li>
                <li className="flex items-center justify-between text-slate-300">
                  <span>90 Days</span>
                  <span className="font-semibold text-cyan-400">1.5x</span>
                </li>
                <li className="flex items-center justify-between text-slate-300">
                  <span>180 Days</span>
                  <span className="font-semibold text-cyan-400">2.0x</span>
                </li>
                <li className="flex items-center justify-between text-slate-300">
                  <span>365 Days</span>
                  <span className="font-semibold text-green-400">2.5x</span>
                </li>
              </ul>
              <div className="mt-4 text-xs text-slate-400 text-center">
                Final parameters subject to governance approval at launch
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/token/staking"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
              >
                Learn More About Staking
                <ArrowRight className="w-4 h-4" />
              </Link>
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
              label="Staking Info"
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
              to="/governance/treasury-guardrails"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-lg transition-colors"
            >
              <Shield className="w-5 h-5" />
              Treasury Guardrails
            </Link>
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
