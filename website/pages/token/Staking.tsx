import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Lock, TrendingUp, Award, Shield, Clock, Info, ArrowRight, Zap, Target,
  AlertTriangle, Coins, BarChart3, DollarSign, CheckCircle2, Calculator
} from 'lucide-react';

export default function Staking() {
  return (
    <PageLayout>
      <div className="space-y-20">
        <section className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium mb-6">
            <Clock className="w-4 h-4" />
            Q3/Q4 2026
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Token{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Staking
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8">
            Stake your AAIC tokens to earn rewards from ecosystem emissions (Years 1-4) and revenue (Year 4+)
          </p>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 max-w-2xl mx-auto">
            <Info className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <p className="text-slate-300">
              <strong className="text-white">Staking is planned for Q3/Q4 2026.</strong> This page outlines
              the staking mechanism with full mathematical transparency. Final implementation details will be subject to governance approval.
            </p>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What is Staking?</h2>

          <p className="text-lg text-slate-300 mb-8 text-center max-w-3xl mx-auto">
            Staking allows you to lock your AAIC tokens for a period of time in exchange for rewards. During Years 1-4, rewards come from emissions. After Year 4, rewards transition to 100% revenue-backed buybacks.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 text-center">
              <TrendingUp className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Revenue Sharing</h3>
              <p className="text-sm text-slate-400">Earn portion of ecosystem business profits (Year 4+)</p>
            </div>
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 text-center">
              <Award className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Enhanced Voting</h3>
              <p className="text-sm text-slate-400">Staked tokens may receive governance weight multipliers</p>
            </div>
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 text-center">
              <Shield className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Long-Term Value</h3>
              <p className="text-sm text-slate-400">Aligns incentives with ecosystem success</p>
            </div>
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 text-center">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Compounding</h3>
              <p className="text-sm text-slate-400">Restake rewards to maximize long-term gains</p>
            </div>
          </div>
        </section>

        {/* Staking Pool & Emissions */}
        <section className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Staking Rewards: The Complete Math
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Total Staking Pool: <span className="font-bold text-cyan-400">15,000,000 AAIC</span> over 48 months
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-8">
            {/* Tapered Emission Schedule */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Coins className="w-7 h-7 text-green-400" />
                Tapered Emission Schedule
              </h3>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-white">Year 1 (Months 1-12)</span>
                    <span className="text-2xl font-bold text-green-400">4,500,000 AAIC</span>
                  </div>
                  <div className="text-sm text-slate-400">
                    30% of pool → <span className="text-white font-mono">375,000 AAIC/month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-white">Year 2 (Months 13-24)</span>
                    <span className="text-2xl font-bold text-cyan-400">3,750,000 AAIC</span>
                  </div>
                  <div className="text-sm text-slate-400">
                    25% of pool → <span className="text-white font-mono">312,500 AAIC/month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-white">Year 3 (Months 25-36)</span>
                    <span className="text-2xl font-bold text-cyan-400">3,750,000 AAIC</span>
                  </div>
                  <div className="text-sm text-slate-400">
                    25% of pool → <span className="text-white font-mono">312,500 AAIC/month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-white">Year 4 (Months 37-48)</span>
                    <span className="text-2xl font-bold text-blue-400">3,000,000 AAIC</span>
                  </div>
                  <div className="text-sm text-slate-400">
                    20% of pool → <span className="text-white font-mono">250,000 AAIC/month</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <h4 className="font-bold text-white mb-2 text-sm">Why Tapered?</h4>
                <div className="grid md:grid-cols-3 gap-3 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Higher early rewards incentivize early stakers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Gradual decrease prepares for revenue model</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Natural equilibrium as supply stabilizes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Combined Outflow */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Combined User Rewards Outflow (U2E + Staking)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-2">Year 1 Monthly</div>
                  <div className="text-3xl font-bold text-green-400">833,333 AAIC</div>
                  <div className="text-xs text-slate-500 mt-1">458k U2E + 375k Staking</div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-2">Year 4 Monthly</div>
                  <div className="text-3xl font-bold text-blue-400">708,333 AAIC</div>
                  <div className="text-xs text-slate-500 mt-1">458k U2E + 250k Staking</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Market-Based APY */}
        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            How APY Actually Works (No Lies, Just Math)
          </h2>

          <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-yellow-400 mb-2">APY is NOT fixed</h3>
                  <p className="text-sm text-slate-300">
                    It depends on two variables: Annual staking rewards emitted and Total AAIC staked by all users
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
              <div className="text-center mb-6">
                <div className="text-xl font-bold text-white mb-4">Formula:</div>
                <div className="bg-slate-900/50 rounded-lg p-6">
                  <div className="text-2xl font-mono text-cyan-400">
                    APY = (Annual Staking Rewards / Total Staked) × 100
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-white mb-4">Year 1 Example Calculations</h4>
                  <p className="text-sm text-slate-400 mb-4">Annual rewards = 4,500,000 AAIC</p>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                      <div className="text-xs text-slate-400 mb-2">10M AAIC Staked</div>
                      <div className="text-3xl font-bold text-green-400">≈45%</div>
                      <div className="text-xs text-slate-500 mt-1">APY</div>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 text-center">
                      <div className="text-xs text-slate-400 mb-2">20M AAIC Staked</div>
                      <div className="text-3xl font-bold text-cyan-400">≈22.5%</div>
                      <div className="text-xs text-slate-500 mt-1">APY</div>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                      <div className="text-xs text-slate-400 mb-2">30M AAIC Staked</div>
                      <div className="text-3xl font-bold text-blue-400">≈15%</div>
                      <div className="text-xs text-slate-500 mt-1">APY</div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
                      <div className="text-xs text-slate-400 mb-2">45M AAIC Staked</div>
                      <div className="text-3xl font-bold text-purple-400">≈10%</div>
                      <div className="text-xs text-slate-500 mt-1">APY</div>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="text-sm font-semibold text-white mb-2">Target APY Band: 10-15% with healthy staking participation</p>
                  <p className="text-xs text-slate-400">Market will naturally find equilibrium based on supply and demand</p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-4">Year 4 Example (Lower Emissions)</h4>
                  <p className="text-sm text-slate-400 mb-4">Annual rewards = 3,000,000 AAIC</p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                      <div className="text-xs text-slate-400 mb-2">30M AAIC Staked</div>
                      <div className="text-3xl font-bold text-blue-400">≈10%</div>
                      <div className="text-xs text-slate-500 mt-1">APY</div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
                      <div className="text-xs text-slate-400 mb-2">45M AAIC Staked</div>
                      <div className="text-3xl font-bold text-purple-400">≈6.67%</div>
                      <div className="text-xs text-slate-500 mt-1">APY</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
              <p className="text-center text-slate-300 font-semibold">
                This is honest, transparent, and mathematically sound. No fake APY promises.
              </p>
            </div>
          </div>
        </section>

        {/* Staking Tiers & Multipliers */}
        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Lock Periods & Multipliers (Proposed)
          </h2>

          <p className="text-center text-slate-300 mb-8 max-w-3xl mx-auto">
            Instead of fixed APY tiers, staking offers TIME-BASED MULTIPLIERS on the base market APY.
          </p>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="text-center mb-6">
                <p className="text-lg text-slate-300">
                  <span className="font-bold text-white">Base Market APY:</span> Calculated as shown above (depends on emissions + total staked)
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">30 days</div>
                    <p className="text-xs text-slate-400">Short-term commitment</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">1.0x</div>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">90 days</div>
                    <p className="text-xs text-slate-400">Moderate commitment</p>
                  </div>
                  <div className="text-2xl font-bold text-cyan-400">1.2x</div>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">180 days</div>
                    <p className="text-xs text-slate-400">Strong commitment</p>
                  </div>
                  <div className="text-2xl font-bold text-green-400">1.5x</div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">365 days</div>
                    <p className="text-xs text-slate-400">Maximum commitment</p>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">2.0x</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <h4 className="font-bold text-white mb-2 text-sm">How Lock Multipliers Work</h4>
                <p className="text-xs text-slate-300 mb-3">
                  Lock multipliers increase your <span className="font-bold text-cyan-400">staking weight</span>, not your APY directly.
                </p>
                <div className="bg-slate-900/50 rounded p-3 text-xs text-slate-300 space-y-2">
                  <div><span className="font-bold text-white">Example:</span></div>
                  <div>• Stake 10,000 AAIC with 2.0x lock = 20,000 weight</div>
                  <div>• Pool has 100,000 total weight</div>
                  <div>• Your share: 20,000 / 100,000 = <span className="font-bold text-cyan-400">20% of rewards</span></div>
                  <div>• Monthly rewards distributed based on your weight share</div>
                </div>
                <p className="text-xs text-slate-400 mt-3 italic">
                  The multiplier increases your relative share compared to shorter-lock stakers, but actual APY depends on total staked and how others stake.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Example APY Calculation:</h3>
              <p className="text-sm text-slate-300 mb-3">If base APY (30-day lock) = 12%:</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div className="bg-slate-900/50 rounded p-3">
                  <div className="text-slate-400 mb-1">30-day lock</div>
                  <div className="text-lg font-bold text-blue-400">12% APY</div>
                  <div className="text-xs text-slate-500">12% × 1.0</div>
                </div>
                <div className="bg-slate-900/50 rounded p-3">
                  <div className="text-slate-400 mb-1">90-day lock</div>
                  <div className="text-lg font-bold text-cyan-400">14.4% APY</div>
                  <div className="text-xs text-slate-500">12% × 1.2</div>
                </div>
                <div className="bg-slate-900/50 rounded p-3">
                  <div className="text-slate-400 mb-1">180-day lock</div>
                  <div className="text-lg font-bold text-green-400">18% APY</div>
                  <div className="text-xs text-slate-500">12% × 1.5</div>
                </div>
                <div className="bg-slate-900/50 rounded p-3">
                  <div className="text-slate-400 mb-1">365-day lock</div>
                  <div className="text-lg font-bold text-yellow-400">24% APY</div>
                  <div className="text-xs text-slate-500">12% × 2.0</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Additional Perks</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Longer locks earn bonus points for U2E (governance participation)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Priority access to new business proposals</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Enhanced voting weight multipliers (TBD by governance)</span>
                </div>
              </div>
            </div>

            <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm text-slate-300">
                <span className="font-bold text-white">This model is flexible, fair, and rewards long-term commitment</span> without making promises we can't keep.
              </p>
            </div>
          </div>
        </section>

        {/* Post-Year-4 Revenue-Backed */}
        <section className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            After Emissions End: Infinite Sustainability
          </h2>

          <p className="text-center text-slate-300 mb-8 max-w-3xl mx-auto">
            After 48 months, all 15M staking rewards are distributed. What happens next?
          </p>

          <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Transition to Revenue-Backed Model</h3>
              <div className="space-y-4 text-slate-300">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <p>15% of net profit allocated to staking support</p>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                  <p>Tokens bought from market, distributed to stakers</p>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                  <p>APY becomes directly tied to ecosystem profitability</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 text-center">Formula (Post-Year-4):</h3>
              <div className="bg-slate-900/50 rounded-lg p-6 mb-6">
                <div className="text-center text-xl font-mono text-cyan-400">
                  Monthly Staking Budget = (Monthly Net Profit × 0.15) / AAIC Price
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-white mb-4">Example Scenarios:</h4>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-lg p-6">
                      <div className="font-bold text-green-400 mb-3">If Monthly Profit = $1M, AAIC Price = $1:</div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-slate-400 mb-1">Budget</div>
                          <div className="font-mono text-white">150,000 AAIC/month</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Annual</div>
                          <div className="font-mono text-white">1,800,000 AAIC</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">If 30M staked</div>
                          <div className="font-mono text-green-400 text-lg">6% APY</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6">
                      <div className="font-bold text-blue-400 mb-3">If Monthly Profit = $2M, AAIC Price = $1:</div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-slate-400 mb-1">Budget</div>
                          <div className="font-mono text-white">300,000 AAIC/month</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Annual</div>
                          <div className="font-mono text-white">3,600,000 AAIC</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">If 30M staked</div>
                          <div className="font-mono text-green-400 text-lg">12% APY</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-6">
                      <div className="font-bold text-cyan-400 mb-3">If Monthly Profit = $1M, AAIC Price = $0.50:</div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-slate-400 mb-1">Budget</div>
                          <div className="font-mono text-white">300,000 AAIC/month</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Annual</div>
                          <div className="font-mono text-white">3,600,000 AAIC</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">If 30M staked</div>
                          <div className="font-mono text-green-400 text-lg">12% APY</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">This is TRUE Infinite Sustainability:</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>No new token minting</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Backed by real revenue</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Deflationary (buybacks reduce supply)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Scales with ecosystem success</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Completely transparent</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Impossible to rug</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Timeline & Development</h2>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-bold text-cyan-400">Q1 2026</span>
                  <h3 className="text-xl font-bold text-white">Design & Specification</h3>
                </div>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full border border-blue-500/30">
                  Upcoming
                </span>
              </div>
              <p className="text-sm text-slate-400">Finalize staking mechanism design with community feedback and governance input</p>
            </div>

            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-bold text-cyan-400">Q2 2026</span>
                  <h3 className="text-xl font-bold text-white">Development & Testing</h3>
                </div>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full border border-blue-500/30">
                  Upcoming
                </span>
              </div>
              <p className="text-sm text-slate-400">Build and test staking smart contracts on testnets with simulated revenue scenarios</p>
            </div>

            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-bold text-cyan-400">Q3 2026</span>
                  <h3 className="text-xl font-bold text-white">Audits & Review</h3>
                </div>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full border border-blue-500/30">
                  Upcoming
                </span>
              </div>
              <p className="text-sm text-slate-400">Third-party security audits and final community review period</p>
            </div>

            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-bold text-cyan-400">Q4 2026</span>
                  <h3 className="text-xl font-bold text-white">Launch</h3>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                  Target
                </span>
              </div>
              <p className="text-sm text-slate-400">Staking goes live on mainnet with phased rollout and monitoring</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 lg:p-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Learn More?</h2>
            <p className="text-slate-300 mb-8">
              Explore the full tokenomics to understand how staking fits into the bigger picture
            </p>
            <Link
              to="/token/tokenomics"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
            >
              View Full Tokenomics
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
