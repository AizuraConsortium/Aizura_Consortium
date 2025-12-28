import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Shield, Lock, AlertTriangle, CheckCircle2, Clock, TrendingUp,
  DollarSign, Users, ArrowRight, Info, XCircle, Zap, Target, Eye
} from 'lucide-react';

export default function TreasuryGuardrails() {
  return (
    <PageLayout>
      <div className="space-y-20">
        <section className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Treasury Protection
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Treasury{' '}
            <span className="bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
              Guardrails
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Multi-layered safety mechanisms that protect ecosystem funds from misuse,
            theft, or governance attacks while maintaining operational flexibility.
          </p>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 max-w-3xl mx-auto">
            <Info className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
            <p className="text-slate-300">
              <strong className="text-white">Immutable smart contract rules</strong> combined with
              governance-adjustable parameters create a robust defense against treasury mismanagement.
            </p>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Core Guardrails</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <GuardrailCard
              icon={<Clock className="w-8 h-8 text-blue-400" />}
              title="Weekly Spend Cap"
              immutable
              description="Maximum treasury spend per 7-day period is automatically calculated and enforced."
            />
            <GuardrailCard
              icon={<Lock className="w-8 h-8 text-yellow-400" />}
              title="Allowlist-Only Spending"
              immutable
              description="Treasury can only send funds to pre-approved contract addresses, never arbitrary wallets."
            />
            <GuardrailCard
              icon={<TrendingUp className="w-8 h-8 text-green-400" />}
              title="Buyback Frequency Limit"
              immutable
              description="Minimum 1-week cooldown between buyback operations prevents market manipulation."
            />
            <GuardrailCard
              icon={<Target className="w-8 h-8 text-purple-400" />}
              title="LP Withdrawal Caps"
              governanceAdjustable
              description="Maximum 25% of liquidity pool can be withdrawn per month to protect market depth."
            />
            <GuardrailCard
              icon={<Shield className="w-8 h-8 text-red-400" />}
              title="Slippage Protection"
              governanceAdjustable
              description="Maximum slippage limits on buybacks prevent sandwich attacks and excessive losses."
            />
            <GuardrailCard
              icon={<DollarSign className="w-8 h-8 text-cyan-400" />}
              title="Daily Buyback Caps"
              governanceAdjustable
              description="Maximum daily buyback amount prevents single-day treasury depletion."
            />
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <Clock className="w-8 h-8 text-blue-400" />
            Weekly Spend Cap: The Math
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-3xl mx-auto">
            The weekly spend cap is calculated dynamically based on treasury balance to prevent rapid depletion.
          </p>

          <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 text-center">Formula</h3>
              <div className="bg-slate-900/50 rounded-lg p-6 mb-6">
                <div className="text-center text-2xl font-mono text-cyan-400">
                  Weekly Cap = (Treasury Balance × Cap Percentage) / 52
                </div>
              </div>
              <p className="text-sm text-slate-400 text-center">
                Default Cap Percentage: <span className="text-white font-bold">10%</span> (governance-adjustable within 5-20% range)
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Example Calculations</h3>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-lg p-6">
                  <div className="font-bold text-green-400 mb-3">Treasury Balance: 1,000,000 AAIC, Cap: 10%</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Annual Spendable (10%)</span>
                      <span className="font-mono text-white">100,000 AAIC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Weekly Cap (÷ 52)</span>
                      <span className="font-mono text-green-400 text-lg">1,923 AAIC</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6">
                  <div className="font-bold text-blue-400 mb-3">Treasury Balance: 5,000,000 AAIC, Cap: 10%</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Annual Spendable (10%)</span>
                      <span className="font-mono text-white">500,000 AAIC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Weekly Cap (÷ 52)</span>
                      <span className="font-mono text-blue-400 text-lg">9,615 AAIC</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6">
                  <div className="font-bold text-purple-400 mb-3">Treasury Balance: 500,000 AAIC, Cap: 15% (governance increased)</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Annual Spendable (15%)</span>
                      <span className="font-mono text-white">75,000 AAIC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Weekly Cap (÷ 52)</span>
                      <span className="font-mono text-purple-400 text-lg">1,442 AAIC</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-yellow-400 mb-2">Why This Matters</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Prevents catastrophic treasury drain from a single malicious proposal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Automatically scales with treasury size (larger treasury = higher cap)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Community has time to detect and respond to suspicious spending patterns</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <Lock className="w-8 h-8 text-yellow-400" />
            Allowlist-Only Rule
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-3xl mx-auto">
            Treasury funds can ONLY be sent to smart contract addresses that have been explicitly approved by governance.
          </p>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                <CheckCircle2 className="w-8 h-8 text-green-400 mb-4" />
                <h3 className="font-bold text-white mb-3">Allowed Destinations</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>StakingRewardsVault contract</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>UseToEarnRewardsVault contract</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>BuybackExecutor contract</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>Approved liquidity pool contracts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>Governance-approved vesting contracts</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <XCircle className="w-8 h-8 text-red-400 mb-4" />
                <h3 className="font-bold text-white mb-3">Blocked Destinations</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    <span>Any externally-owned account (EOA)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    <span>Unapproved smart contracts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    <span>Exchanges or centralized services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    <span>Team or advisor wallets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    <span>Any address not on allowlist</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">How to Add to Allowlist</h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-cyan-500/20 rounded-full text-cyan-400 font-bold flex-shrink-0">
                    1
                  </div>
                  <p>Submit a governance proposal explaining why the contract address needs treasury access</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-cyan-500/20 rounded-full text-cyan-400 font-bold flex-shrink-0">
                    2
                  </div>
                  <p>Provide contract verification, audit reports, and clear documentation of purpose</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-cyan-500/20 rounded-full text-cyan-400 font-bold flex-shrink-0">
                    3
                  </div>
                  <p>Community votes on proposal (simple majority required)</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-cyan-500/20 rounded-full text-cyan-400 font-bold flex-shrink-0">
                    4
                  </div>
                  <p>If approved, address is added to allowlist via governance execution</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-400" />
            Buyback & LP Guardrails
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-3xl mx-auto">
            Special protections for market-facing operations that could impact token price or liquidity.
          </p>

          <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Buyback Guardrails</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <GuardrailDetail
                  label="Frequency Limit"
                  value="Minimum 1 week between buybacks"
                  immutable
                />
                <GuardrailDetail
                  label="Max Slippage"
                  value="≤ 2.5% (max 5%)"
                  governanceAdjustable
                />
                <GuardrailDetail
                  label="Daily Cap"
                  value="≤ 0.5% of treasury balance per day"
                  governanceAdjustable
                />
                <GuardrailDetail
                  label="Price Impact Limit"
                  value="Maximum 1% price movement per buyback"
                  governanceAdjustable
                />
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Liquidity Pool Guardrails</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <GuardrailDetail
                  label="Maximum Withdrawal"
                  value="25% of LP per month"
                  governanceAdjustable
                />
                <GuardrailDetail
                  label="Cooldown Period"
                  value="7 days between LP withdrawals"
                  immutable
                />
                <GuardrailDetail
                  label="Emergency Reserve"
                  value="Must maintain 10% minimum liquidity"
                  immutable
                />
                <GuardrailDetail
                  label="Rebalancing Limit"
                  value="5% ratio adjustment per action"
                  governanceAdjustable
                />
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Why These Limits?</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Prevents wash trading and market manipulation</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Protects against MEV attacks and sandwich bots</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Maintains healthy market depth and liquidity</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Ensures predictable, gradual market operations</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Prevents single proposals from destabilizing price</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Allows time for community review and intervention</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <Eye className="w-8 h-8 text-cyan-400" />
            Immutable vs Governance-Adjustable
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-3xl mx-auto">
            Understanding which guardrails are permanent and which can be adjusted by the community.
          </p>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-8 h-8 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Immutable Rules</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                These rules are coded into smart contracts and CANNOT be changed by anyone, including governance.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Weekly spend cap formula structure</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Allowlist-only spending requirement</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>1-week minimum buyback frequency</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>7-day LP withdrawal cooldown</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>10% minimum emergency LP reserve</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-8 h-8 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Governance-Adjustable</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                These parameters can be changed by governance vote within predefined safe ranges.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>Weekly cap percentage (5-20% range)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>Buyback slippage tolerance (≤ 2.5%, max 5%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>Daily buyback cap (≤ 0.5% of treasury)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>LP withdrawal (max 25% per month)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>Allowlist additions (via standard governance)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 max-w-3xl mx-auto">
            <Info className="w-6 h-6 text-cyan-400 mb-3" />
            <p className="text-sm text-slate-300">
              <strong className="text-white">Design Philosophy:</strong> Core protective structures are immutable,
              but specific threshold values can be adjusted to adapt to changing market conditions while
              staying within safe ranges.
            </p>
          </div>
        </section>

        <section className="text-center">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 lg:p-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Learn More About Governance</h2>
            <p className="text-slate-300 mb-8">
              Explore how treasury decisions are made and how you can participate in protecting ecosystem funds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/governance"
                className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
              >
                Governance Overview
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/governance/treasury"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
              >
                View Treasury
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

interface GuardrailCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  immutable?: boolean;
  governanceAdjustable?: boolean;
}

function GuardrailCard({ icon, title, description, immutable, governanceAdjustable }: GuardrailCardProps) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        {immutable && (
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded border border-blue-500/30">
            Immutable
          </span>
        )}
        {governanceAdjustable && (
          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded border border-purple-500/30">
            Adjustable
          </span>
        )}
      </div>
      <p className="text-sm text-slate-300">{description}</p>
    </div>
  );
}

interface GuardrailDetailProps {
  label: string;
  value: string;
  immutable?: boolean;
  governanceAdjustable?: boolean;
}

function GuardrailDetail({ label, value, immutable, governanceAdjustable }: GuardrailDetailProps) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-400">{label}</span>
        {immutable && (
          <Lock className="w-4 h-4 text-blue-400" />
        )}
        {governanceAdjustable && (
          <Users className="w-4 h-4 text-purple-400" />
        )}
      </div>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
}
