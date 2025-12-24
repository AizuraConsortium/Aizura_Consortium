import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import { Lock, TrendingUp, Award, Shield, Clock, Info, ArrowRight, Zap, Target, AlertTriangle } from 'lucide-react';

export default function Staking() {
  return (
    <PageLayout>
      <div className="space-y-20">
        <section className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium mb-6">
            <Clock className="w-4 h-4" />
            Coming Soon
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Token{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Staking
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8">
            Stake your AAIC tokens to earn rewards from ecosystem revenue
          </p>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 max-w-2xl mx-auto">
            <Info className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <p className="text-slate-300">
              <strong className="text-white">Staking is planned for Q3/Q4 2026.</strong> This page outlines
              the proposed staking mechanism. Final implementation details will be subject to governance approval.
            </p>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What is Staking?</h2>

          <p className="text-lg text-slate-300 mb-8 text-center max-w-3xl mx-auto">
            Staking allows you to lock your AAIC tokens for a period of time in exchange for rewards paid from
            ecosystem revenue. It creates long-term alignment and shares value with committed token holders.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 text-center">
              <TrendingUp className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Revenue Sharing</h3>
              <p className="text-sm text-slate-400">Earn portion of ecosystem business profits</p>
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

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Proposed Staking Model</h2>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <Lock className="w-6 h-6 text-cyan-400 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Flexible Lock Periods</h3>
                  <p className="text-slate-300 mb-3">Choose from multiple lockup durations based on your commitment level</p>
                  <ul className="space-y-2 pl-4">
                    <li className="text-sm text-slate-400">• 30 days: Lower rewards, flexible exit</li>
                    <li className="text-sm text-slate-400">• 90 days: Moderate rewards, balanced commitment</li>
                    <li className="text-sm text-slate-400">• 180 days: High rewards, strong alignment</li>
                    <li className="text-sm text-slate-400">• 365 days: Maximum rewards, full ecosystem commitment</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <TrendingUp className="w-6 h-6 text-green-400 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Revenue-Based Rewards</h3>
                  <p className="text-slate-300 mb-3">Rewards come from real business profits, not token inflation</p>
                  <ul className="space-y-2 pl-4">
                    <li className="text-sm text-slate-400">• Portion of ecosystem revenue allocated to staking pool</li>
                    <li className="text-sm text-slate-400">• Rewards distributed proportionally to staked amounts</li>
                    <li className="text-sm text-slate-400">• No new token emissions required</li>
                    <li className="text-sm text-slate-400">• Sustainable long-term reward mechanism</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <Target className="w-6 h-6 text-purple-400 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Governance Benefits</h3>
                  <p className="text-slate-300 mb-3">Staked tokens may receive enhanced governance power</p>
                  <ul className="space-y-2 pl-4">
                    <li className="text-sm text-slate-400">• Voting weight multipliers for stakers</li>
                    <li className="text-sm text-slate-400">• Priority access to new proposals</li>
                    <li className="text-sm text-slate-400">• Enhanced proposal submission rights</li>
                    <li className="text-sm text-slate-400">• Details subject to governance approval</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Proposed APY Tiers</h2>

          <p className="text-center text-slate-400 mb-8 text-sm">
            Estimated ranges based on ecosystem revenue projections - actual APYs will vary
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6 text-center">
              <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">30 Days</h3>
              <div className="text-3xl font-bold text-blue-400 mb-2">3-8%</div>
              <p className="text-xs text-slate-400">Flexible short-term staking</p>
            </div>
            <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-xl p-6 text-center">
              <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">90 Days</h3>
              <div className="text-3xl font-bold text-cyan-400 mb-2">6-12%</div>
              <p className="text-xs text-slate-400">Balanced commitment</p>
            </div>
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 text-center">
              <Clock className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">180 Days</h3>
              <div className="text-3xl font-bold text-green-400 mb-2">10-18%</div>
              <p className="text-xs text-slate-400">Strong long-term alignment</p>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-6 text-center">
              <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">365 Days</h3>
              <div className="text-3xl font-bold text-yellow-400 mb-2">15-25%</div>
              <p className="text-xs text-slate-400">Maximum ecosystem commitment</p>
            </div>
          </div>

          <div className="mt-8 bg-slate-700/30 border border-slate-600 rounded-xl p-6 text-center">
            <p className="text-sm text-slate-300">
              <strong className="text-white">APY is not guaranteed.</strong> Actual yields depend on ecosystem
              revenue performance, staking pool size, and governance parameters. These are projections, not promises.
            </p>
          </div>
        </section>

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
              <p className="text-sm text-slate-400">Complete security audits and governance review before mainnet deployment</p>
            </div>

            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-bold text-cyan-400">Q4 2026</span>
                  <h3 className="text-xl font-bold text-white">Mainnet Launch</h3>
                </div>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full border border-blue-500/30">
                  Upcoming
                </span>
              </div>
              <p className="text-sm text-slate-400">Deploy staking system to mainnet with initial conservative parameters</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Timeline is subject to change based on development progress, audit requirements, and governance decisions
            </p>
          </div>
        </section>

        <section className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-12 text-center">
          <Lock className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Stay Updated on Staking Launch
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Follow governance proposals and official announcements for the latest information on staking development and launch dates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/governance"
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              View Governance
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/token"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Token Overview
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
