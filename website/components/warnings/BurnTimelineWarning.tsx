import { AlertTriangle, Clock, TrendingDown } from 'lucide-react';

export function BurnTimelineWarning() {
  return (
    <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-2 border-orange-500/40 rounded-2xl p-8 my-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 bg-orange-500/20 border-2 border-orange-500/40 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-orange-400" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Burn Timeline Reality Check</h3>
          <p className="text-orange-400 font-semibold text-lg">
            Reaching 21M final supply is a multi-decade goal requiring sustained profitability
          </p>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-slate-200 mb-2">
              <strong className="text-white">At $1M monthly profit and $1.00 token price:</strong> Takes approximately <span className="text-orange-400 font-bold">~44 years</span> to burn 79M tokens
            </p>
            <p className="text-slate-200">
              <strong className="text-white">At $3M monthly profit and $1.00 token price:</strong> Takes approximately <span className="text-orange-400 font-bold">~15 years</span> to burn 79M tokens
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 pt-3 border-t border-slate-700">
          <TrendingDown className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-slate-200 text-sm">
              <strong className="text-white">This is an asymptotic goal, not a short-term target.</strong> The 21M supply (Bitcoin parity) represents the theoretical minimum achievable with sustained, significant profitability across the entire business portfolio. It's a north star, not a promise.
            </p>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
          <p className="text-sm text-slate-300">
            <strong className="text-white">Key Insight:</strong> Burns accelerate as ecosystem profitability grows, but realistic timelines span decades. The burn mechanism creates long-term deflationary pressure, not immediate scarcity. Use the Burn Calculator below to explore different scenarios.
          </p>
        </div>
      </div>
    </div>
  );
}
