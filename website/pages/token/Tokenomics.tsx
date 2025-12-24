import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Shield, TrendingUp, Lock, Coins, Users, BarChart3, Flame, DollarSign,
  CheckCircle2, AlertTriangle, Eye, Target, Zap, ArrowRight, Clock, Sparkles
} from 'lucide-react';

export default function Tokenomics() {
  return (
    <PageLayout>
      <div className="space-y-20">
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Sustainable Economics
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            A sustainable,{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              revenue-backed
            </span>{' '}
            token economy
          </h1>

          <div className="space-y-4 text-lg text-slate-300 max-w-3xl mx-auto mb-8">
            <p>
              AAIC is not a hype token, a one-time sale, or a perpetual inflation machine.
            </p>
            <p className="text-cyan-400 font-medium">
              It's a productive asset backed by AI-run businesses, designed for long-term sustainability.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <PrincipleCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              text="No public token sale"
              positive
            />
            <PrincipleCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              text="Fixed max supply"
              positive
            />
            <PrincipleCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              text="Revenue-backed rewards"
              positive
            />
            <PrincipleCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              text="Transparent governance"
              positive
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Core Principles</h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <CorePrinciple
              title="Airdrop + Usage Distribution"
              description="No token sale. Initial distribution via airdrop and usage-based rewards to real participants."
            />
            <CorePrinciple
              title="Bootstrap Inflation"
              description="Early inflation for 4 years to bootstrap participation, then pure revenue-backed rewards."
            />
            <CorePrinciple
              title="Real Revenue Backing"
              description="Long-term rewards funded by actual business revenues, not endless token printing."
            />
            <CorePrinciple
              title="Governed Sustainability"
              description="Governance can adjust parameters but cannot break sustainability rules or mint beyond cap."
            />
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Supply & Distribution</h2>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Global Parameters</h3>
              <div className="space-y-4">
                <ParameterRow label="Token Name" value="AAIC" sublabel="(Placeholder)" />
                <ParameterRow label="Max Supply" value="1,000,000,000" sublabel="Fixed Hard Cap" highlight />
                <ParameterRow label="Initial Circulation" value="~30%" sublabel="300,000,000 AAIC" />
              </div>

              <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="text-sm text-slate-300">
                  <span className="font-bold text-cyan-400">Why 30% initial?</span> Enough liquidity for
                  governance and usage without extreme dilution. Leaves room for ecosystem growth.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Token Allocation</h3>
              <div className="space-y-3">
                <AllocationBar label="Community Airdrop & Rewards" percent={30} tokens="300M" color="cyan" />
                <AllocationBar label="Staking Rewards Pool (4 years)" percent={20} tokens="200M" color="green" />
                <AllocationBar label="Ecosystem Treasury" percent={20} tokens="200M" color="blue" />
                <AllocationBar label="Founding Team" percent={10} tokens="100M" color="purple" />
                <AllocationBar label="Contributors & Advisors" percent={5} tokens="50M" color="yellow" />
                <AllocationBar label="Strategic Reserve" percent={10} tokens="100M" color="orange" />
                <AllocationBar label="Liquidity & Market Ops" percent={5} tokens="50M" color="pink" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock className="w-6 h-6 text-yellow-400" />
              Vesting & Lockups
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <VestingCard
                title="Founding Team (10%)"
                items={['12-month cliff', 'Linear vesting over 36 months', 'Total lock: 48 months']}
              />
              <VestingCard
                title="Contributors (5%)"
                items={['6-month cliff', 'Linear vesting over 24 months', 'Total lock: 30 months']}
              />
              <VestingCard
                title="Treasury (20%)"
                items={['Fully locked', 'Usage only via governance vote', 'No team access']}
              />
              <VestingCard
                title="Strategic Reserve (10%)"
                items={['Fully locked', 'Released only via governance', 'Partnership allocation']}
              />
              <VestingCard
                title="Community (30%)"
                items={['No lockup', 'Airdrop + usage rewards', 'Immediate circulation']}
              />
              <VestingCard
                title="Staking Pool (20%)"
                items={['Emissions over 4 years', 'Smart contract controlled', 'Automatic distribution']}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Emissions & Staking</h2>

          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-2xl p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
                  PHASE 1
                </div>
                <h3 className="text-2xl font-bold text-white">Bootstrap Phase (Years 1–4)</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h4 className="text-lg font-bold text-white mb-4">Staking Rewards Pool</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-slate-300">
                      <span>Total Pool:</span>
                      <span className="font-bold text-white">200,000,000 AAIC</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Distribution Period:</span>
                      <span className="font-bold text-white">4 Years</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Average Yearly Emission:</span>
                      <span className="font-bold text-white">50,000,000 AAIC</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-white mb-2">APY Is NOT Fixed</h4>
                      <p className="text-sm text-slate-300">
                        APY depends on total tokens staked, remaining emissions, and time elapsed.
                        Early APY will be high and naturally decreases.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h4 className="font-bold text-white mb-4">APY Examples (Illustrative)</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="text-sm text-slate-400 mb-2">If 200M tokens staked</div>
                    <div className="text-2xl font-bold text-green-400">~25% APY</div>
                    <div className="text-xs text-slate-500 mt-1">Year 1 estimate</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="text-sm text-slate-400 mb-2">If 400M tokens staked</div>
                    <div className="text-2xl font-bold text-cyan-400">~12.5% APY</div>
                    <div className="text-xs text-slate-500 mt-1">Year 1 estimate</div>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mt-4 italic">
                  No magic. No lies. APY is purely mathematical based on supply and demand.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-bold">
                  PHASE 2
                </div>
                <h3 className="text-2xl font-bold text-white">Transition Phase (After Year 4)</h3>
              </div>

              <div className="space-y-4 text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <p>All staking emissions are exhausted</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <p>100% of tokens are in circulation</p>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                  <p className="font-bold text-white">
                    From here: Staking rewards funded ONLY by business revenues, platform fees,
                    and ecosystem profits
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <p className="font-bold text-cyan-400">No new tokens are minted. Ever.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-500/10 to-green-500/10 border border-cyan-500/30 rounded-2xl p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-bold">
                  PHASE 3
                </div>
                <h3 className="text-2xl font-bold text-white">Revenue-Backed Dynamic APY (Forever)</h3>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
                <h4 className="font-bold text-white mb-3">Dynamic APY Formula</h4>
                <div className="bg-slate-900/50 rounded-lg p-4 font-mono text-cyan-400 text-center text-lg">
                  APY = (Annual Distributable Revenue / Total Staked Value)
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    High Revenue Scenario
                  </h4>
                  <p className="text-slate-300">
                    When businesses perform well and generate strong revenue, APY increases naturally.
                    Stakers benefit directly from ecosystem success.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    Low Revenue Scenario
                  </h4>
                  <p className="text-slate-300">
                    During slow periods, APY decreases. This is honest, sustainable, and
                    impossible to rug. Real economics, not token printing.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-sm text-slate-300">
                  <span className="font-bold text-green-400">Why this works:</span> Honest,
                  sustainable, institution-friendly, and impossible to rug. Governance can vote on
                  the percentage of revenue distributed, but cannot mint new tokens.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Revenue Distribution Model</h2>

          <p className="text-center text-slate-300 mb-8 max-w-2xl mx-auto">
            Monthly net revenue is distributed according to this target model, ensuring balanced
            growth, sustainability, and value accrual.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <RevenueCard
              icon={<Users className="w-8 h-8 text-cyan-400" />}
              label="Stakers"
              percent={35}
              description="Direct rewards to token stakers"
            />
            <RevenueCard
              icon={<Coins className="w-8 h-8 text-blue-400" />}
              label="Ecosystem Treasury"
              percent={25}
              description="Long-term sustainability fund"
            />
            <RevenueCard
              icon={<TrendingUp className="w-8 h-8 text-green-400" />}
              label="Token Buybacks"
              percent={20}
              description="Market support and demand creation"
            />
            <RevenueCard
              icon={<Flame className="w-8 h-8 text-orange-400" />}
              label="Burns"
              percent={10}
              description="Deflationary mechanism"
            />
            <RevenueCard
              icon={<Target className="w-8 h-8 text-purple-400" />}
              label="Proposers + Voters"
              percent={10}
              description="Governance participation rewards"
            />
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">100%</div>
                <div className="text-sm text-slate-400">Total Distribution</div>
              </div>
            </div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6">
            <h4 className="font-bold text-white mb-3">Why This Works</h4>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Buybacks + burns create deflation</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Treasury ensures long-term longevity</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Rewards stay proportional to success</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>No insane 70% burn rate</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400 italic">
              Governance can fine-tune percentages within safe bounds to adapt to market conditions.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Buyback & Burn Mechanism</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                Buyback Process
              </h3>
              <div className="space-y-4">
                <ProcessStep
                  number="1"
                  title="Revenue Collection"
                  description="Ecosystem revenue flows into treasury"
                />
                <ProcessStep
                  number="2"
                  title="Allocation"
                  description="20% allocated to buyback program"
                />
                <ProcessStep
                  number="3"
                  title="Execution"
                  description="Periodic buybacks (monthly/quarterly)"
                />
                <ProcessStep
                  number="4"
                  title="Distribution"
                  description="Some burned, some recycled per governance"
                />
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-400" />
                Burn Mechanics
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-white mb-1">10% Direct Burns</div>
                    <div className="text-sm text-slate-300">
                      10% of revenue goes to immediate token burns
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-white mb-1">Buyback Burns</div>
                    <div className="text-sm text-slate-300">
                      Portion of bought-back tokens also burned
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-white mb-1">Full Transparency</div>
                    <div className="text-sm text-slate-300">
                      All burns tracked on-chain and displayed publicly
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <h4 className="text-sm font-bold text-slate-400 mb-3">Tracked Metrics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Total Supply</span>
                    <span className="font-mono text-white">1,000,000,000</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Circulating Supply</span>
                    <span className="font-mono text-cyan-400">Live Data</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Total Burned</span>
                    <span className="font-mono text-orange-400">Live Data</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Revenue Backing/Token</span>
                    <span className="font-mono text-green-400">Live Data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Token Utility</h2>

          <p className="text-center text-slate-300 mb-8 max-w-2xl mx-auto">
            AAIC is required for meaningful participation in the ecosystem. Real utility, not fake promises.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UtilityCard
              icon={<Target className="w-8 h-8 text-cyan-400" />}
              title="Proposal Submission"
              description="Required to submit new business proposals to the ecosystem"
            />
            <UtilityCard
              icon={<Users className="w-8 h-8 text-blue-400" />}
              title="Governance Voting"
              description="Vote on proposals, parameter changes, and treasury allocation"
            />
            <UtilityCard
              icon={<Coins className="w-8 h-8 text-green-400" />}
              title="Staking Rewards"
              description="Stake tokens to earn revenue share from ecosystem businesses"
            />
            <UtilityCard
              icon={<Sparkles className="w-8 h-8 text-purple-400" />}
              title="Premium AI Services"
              description="Access advanced AI tools and priority service across platforms"
            />
            <UtilityCard
              icon={<TrendingUp className="w-8 h-8 text-yellow-400" />}
              title="Fee Reductions"
              description="Reduced fees across all ecosystem platforms and services"
            />
            <UtilityCard
              icon={<Shield className="w-8 h-8 text-orange-400" />}
              title="Treasury Control"
              description="Governance control over treasury funds and parameter adjustments"
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Governance Safeguards</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                Governance CAN Change
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Revenue distribution percentages (within bounds)</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Staking parameters and reward schedules</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Treasury fund allocation for proposals</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Fee structures across platforms</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Voting thresholds and proposal requirements</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Governance CANNOT Change
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                  <span className="font-bold">Max supply of 1,000,000,000 tokens</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                  <span className="font-bold">Mint new tokens beyond cap</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Vesting schedules for team and contributors</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Core sustainability principles</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Smart contract security guarantees</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <h4 className="font-bold text-white mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              Anti-Hyperinflation Rules
            </h4>
            <p className="text-slate-300">
              The tokenomics contract enforces hard caps at the protocol level. No governance vote
              can override these fundamental protections. This makes the system trustless and
              institutional-grade.
            </p>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <Eye className="w-8 h-8 text-cyan-400" />
            Transparency Metrics
          </h2>

          <p className="text-center text-slate-300 mb-8">
            All key metrics are publicly available and updated in real-time. Full transparency, always.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              label="Circulating Supply"
              value="Live Data"
              sublabel="Updated real-time"
              color="cyan"
            />
            <MetricCard
              label="Total Burned"
              value="Live Data"
              sublabel="Cumulative burns"
              color="orange"
            />
            <MetricCard
              label="Monthly Revenue"
              value="Live Data"
              sublabel="Ecosystem earnings"
              color="green"
            />
            <MetricCard
              label="Current APY"
              value="Live Data"
              sublabel="Historical tracking"
              color="purple"
            />
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/token/transparency"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors"
            >
              View Full Transparency Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
            Important Disclaimer
          </h2>

          <div className="space-y-4 text-slate-300">
            <p>
              <span className="font-bold text-white">This is not financial advice.</span> AAIC is
              a utility token for ecosystem participation, not an investment product.
            </p>
            <p>
              Token value is directly tied to ecosystem performance. If businesses underperform,
              token value and rewards will decrease accordingly.
            </p>
            <p>
              <span className="font-bold text-white">Risks acknowledged:</span> Cryptocurrency
              markets are volatile. Regulatory landscapes are evolving. AI business performance
              is not guaranteed. Only participate with amounts you can afford to lose.
            </p>
            <p className="text-cyan-400 font-medium">
              We prioritize honesty over hype. This model is designed for long-term sustainability,
              not short-term pump-and-dump schemes.
            </p>
          </div>
        </section>

        <section className="bg-linear-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Why This Model Is Strong
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <StrengthCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Scales With Success"
              description="More revenue = higher rewards"
            />
            <StrengthCard
              icon={<Shield className="w-6 h-6" />}
              title="Survives Low Periods"
              description="No death spiral mechanics"
            />
            <StrengthCard
              icon={<CheckCircle2 className="w-6 h-6" />}
              title="No Ponzinomics"
              description="Real revenue backing"
            />
            <StrengthCard
              icon={<Users className="w-6 h-6" />}
              title="Serious Users"
              description="Attracts long-term holders"
            />
            <StrengthCard
              icon={<Zap className="w-6 h-6" />}
              title="Works Without Hype"
              description="Fundamentals-driven value"
            />
            <StrengthCard
              icon={<Eye className="w-6 h-6" />}
              title="Full Transparency"
              description="All metrics public"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/token/staking"
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Explore Staking
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

function PrincipleCard({ icon, text, positive }: { icon: React.ReactNode; text: string; positive: boolean }) {
  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg ${positive ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
      <div className={positive ? 'text-green-400' : 'text-red-400'}>{icon}</div>
      <span className="text-sm text-white font-medium">{text}</span>
    </div>
  );
}

function CorePrinciple({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
      <h4 className="font-bold text-white mb-2">{title}</h4>
      <p className="text-sm text-slate-300">{description}</p>
    </div>
  );
}

function ParameterRow({ label, value, sublabel, highlight }: { label: string; value: string; sublabel?: string; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-3 border-b border-slate-700 ${highlight ? 'bg-cyan-500/5' : ''}`}>
      <span className="text-slate-400">{label}</span>
      <div className="text-right">
        <div className={`font-bold ${highlight ? 'text-cyan-400 text-lg' : 'text-white'}`}>{value}</div>
        {sublabel && <div className="text-xs text-slate-500">{sublabel}</div>}
      </div>
    </div>
  );
}

function AllocationBar({ label, percent, tokens, color }: { label: string; percent: number; tokens: string; color: string }) {
  const colorMap: Record<string, string> = {
    cyan: 'bg-cyan-600',
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    yellow: 'bg-yellow-600',
    orange: 'bg-orange-600',
    pink: 'bg-pink-600',
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-white font-bold">{percent}%</span>
      </div>
      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${colorMap[color]}`} style={{ width: `${percent}%` }} />
      </div>
      <div className="text-xs text-slate-500 text-right">{tokens} AAIC</div>
    </div>
  );
}

function VestingCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
      <h4 className="font-bold text-white mb-4">{title}</h4>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
            <Clock className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RevenueCard({ icon, label, percent, description }: { icon: React.ReactNode; label: string; percent: number; description: string }) {
  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6">
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="text-3xl font-bold text-white text-center mb-1">{percent}%</div>
      <div className="text-sm font-medium text-slate-300 text-center mb-2">{label}</div>
      <div className="text-xs text-slate-400 text-center">{description}</div>
    </div>
  );
}

function ProcessStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
        {number}
      </div>
      <div>
        <h5 className="font-bold text-white mb-1">{title}</h5>
        <p className="text-sm text-slate-300">{description}</p>
      </div>
    </div>
  );
}

function UtilityCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h4 className="font-bold text-white mb-2">{title}</h4>
      <p className="text-sm text-slate-300">{description}</p>
    </div>
  );
}

function MetricCard({ label, value, sublabel, color }: { label: string; value: string; sublabel: string; color: string }) {
  const colorMap: Record<string, string> = {
    cyan: 'text-cyan-400',
    orange: 'text-orange-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
  };

  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6 text-center">
      <div className="text-sm text-slate-400 mb-2">{label}</div>
      <div className={`text-2xl font-bold mb-1 ${colorMap[color]}`}>{value}</div>
      <div className="text-xs text-slate-500">{sublabel}</div>
    </div>
  );
}

function StrengthCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="flex justify-center text-cyan-400 mb-3">{icon}</div>
      <h4 className="font-bold text-white text-sm mb-1 text-center">{title}</h4>
      <p className="text-xs text-slate-400 text-center">{description}</p>
    </div>
  );
}
