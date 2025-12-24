import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Coins, Lock, TrendingUp, Flame, BarChart3, Info, ArrowRight } from 'lucide-react';

export default function TokenView() {
  const tokenBalance = {
    available: '125,450',
    locked: '0',
    vested: '2,500'
  };

  const tokenMetrics = {
    circulatingSupply: '1.2B',
    burned: '45M',
    currentAPY: 'Coming Soon'
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Token</h1>
          <p className="text-slate-400">Your AAIC token balance and ecosystem metrics</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Coins className="w-8 h-8 text-cyan-400" />
              <h3 className="font-bold text-white">Available</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{tokenBalance.available}</div>
            <div className="text-sm text-slate-400">AAIC</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-8 h-8 text-purple-400" />
              <h3 className="font-bold text-white">Locked</h3>
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-1">{tokenBalance.locked}</div>
            <div className="text-sm text-slate-400">AAIC</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-yellow-400" />
              <h3 className="font-bold text-white">Vesting</h3>
            </div>
            <div className="text-3xl font-bold text-yellow-400 mb-1">{tokenBalance.vested}</div>
            <div className="text-sm text-slate-400">AAIC</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <Lock className="w-8 h-8 text-cyan-400 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Staking Coming Soon</h3>
              <p className="text-slate-300 mb-4">
                Stake your AAIC tokens to earn revenue-sharing rewards from ecosystem businesses.
                APY will be dynamic based on real business performance.
              </p>
              <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Dynamic APY</span>
                  <span className="text-white font-medium">Based on revenue</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Revenue Source</span>
                  <span className="text-white font-medium">Business profits</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Lock Period</span>
                  <span className="text-white font-medium">Flexible options</span>
                </div>
              </div>
            </div>
          </div>
          <Link
            to="/token/staking"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
          >
            Learn More About Staking
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-4">Ecosystem Token Metrics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
                <h3 className="font-bold text-white">Circulating Supply</h3>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{tokenMetrics.circulatingSupply}</div>
              <div className="text-sm text-slate-400">Of 10B max supply</div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Flame className="w-6 h-6 text-orange-400" />
                <h3 className="font-bold text-white">Total Burned</h3>
              </div>
              <div className="text-2xl font-bold text-orange-400 mb-1">{tokenMetrics.burned}</div>
              <div className="text-sm text-slate-400">Permanently removed</div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <h3 className="font-bold text-white">Current APY</h3>
              </div>
              <div className="text-2xl font-bold text-slate-400 mb-1">{tokenMetrics.currentAPY}</div>
              <div className="text-sm text-slate-400">Staking rewards</div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white mb-2">About AAIC Token</h3>
              <p className="text-sm text-slate-300 mb-4">
                AAIC is a governance and coordination token for the AI Autonomous Investment Consortium.
                It's not a speculative instrument—value accrues through real business revenue, buybacks, and burns.
              </p>
              <Link
                to="/token"
                className="text-sm text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
              >
                Learn More About Tokenomics
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            to="/token/tokenomics"
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors group"
          >
            <BarChart3 className="w-8 h-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-white mb-2">View Tokenomics</h3>
            <p className="text-sm text-slate-400">
              Detailed breakdown of token distribution, emissions, and economic model
            </p>
          </Link>

          <Link
            to="/token/transparency"
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors group"
          >
            <TrendingUp className="w-8 h-8 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-white mb-2">Transparency Dashboard</h3>
            <p className="text-sm text-slate-400">
              Real-time metrics, supply tracking, and complete transparency
            </p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
