import { AlertTriangle, Scale, Calculator } from 'lucide-react';

export function StakingMultiplierWarning() {
  return (
    <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-2 border-orange-500/40 rounded-2xl p-8 my-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 bg-orange-500/20 border-2 border-orange-500/40 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-orange-400" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">IMPORTANT: Lock Multipliers Are Weight-Based</h3>
          <p className="text-orange-400 font-semibold text-lg">
            Not direct APY multipliers — they increase your share of the reward pool
          </p>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 space-y-6">
        <div className="flex items-start gap-3">
          <Scale className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-slate-200 mb-4">
              <strong className="text-white">How Lock Multipliers Actually Work:</strong>
            </p>
            <div className="space-y-3 text-sm">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="font-bold text-cyan-400 mb-2">Example: Staking 1,000 AAIC with 2.0x Lock</div>
                <ul className="space-y-2 text-slate-300">
                  <li>• Your staking weight = 1,000 AAIC × 2.0 = <span className="text-white font-bold">2,000 weight</span></li>
                  <li>• Total pool weight = 100,000 (hypothetical)</li>
                  <li>• Your share = 2,000 / 100,000 = <span className="text-cyan-400 font-bold">2% of monthly emissions</span></li>
                  <li>• Your rewards = 2% × Monthly Emissions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 pt-3 border-t border-slate-700">
          <Calculator className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-slate-200 mb-3">
              <strong className="text-white">The multiplier increases your weight relative to others, but your actual APY depends on:</strong>
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-3">
                <div className="font-semibold text-white mb-1">1. How much total AAIC is staked</div>
                <p className="text-slate-400 text-xs">More staked = APY spread across more participants</p>
              </div>
              <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-3">
                <div className="font-semibold text-white mb-1">2. How others lock their stakes</div>
                <p className="text-slate-400 text-xs">If everyone uses 2.0x, no relative advantage</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-slate-300 mb-2">
            <strong className="text-white">Key Insight:</strong> Lock multipliers give you a <span className="text-cyan-400 font-bold">competitive advantage</span> in the reward pool by increasing your weight. They don't directly multiply APY. Your actual APY is market-driven based on total staking participation and lock distribution.
          </p>
          <p className="text-xs text-slate-400 mt-2 italic">
            This ensures sustainable, fair rewards and prevents unsustainable "guaranteed APY" promises.
          </p>
        </div>
      </div>
    </div>
  );
}
