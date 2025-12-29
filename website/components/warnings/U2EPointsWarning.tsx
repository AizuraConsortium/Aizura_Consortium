import { AlertTriangle, Activity, Shield, TrendingUp } from 'lucide-react';

export function U2EPointsWarning() {
  return (
    <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-red-500/40 rounded-2xl p-8 my-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 bg-red-500/20 border-2 border-red-500/40 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">CRITICAL: U2E is Points-Based, Not Fixed-Rate</h3>
          <p className="text-red-400 font-semibold text-lg">
            Point values are adjustable by governance to prevent gaming
          </p>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-red-500/30 rounded-xl p-6 space-y-6">
        <div className="flex items-start gap-3">
          <Activity className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-slate-200 mb-4">
              <strong className="text-white">How the Points System Works:</strong>
            </p>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-4">
              <div className="text-center mb-3">
                <div className="text-xl font-mono text-cyan-400">
                  Your Monthly AAIC = (Your Points / Total Points) × 458,333 AAIC
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 text-sm text-slate-300">
                <div className="text-center p-2 bg-slate-900/50 rounded">
                  <div className="font-bold text-white mb-1">Fixed</div>
                  <div className="text-xs text-slate-400">458,333 AAIC/month budget</div>
                </div>
                <div className="text-center p-2 bg-slate-900/50 rounded">
                  <div className="font-bold text-cyan-400 mb-1">Variable</div>
                  <div className="text-xs text-slate-400">Total points issued</div>
                </div>
                <div className="text-center p-2 bg-slate-900/50 rounded">
                  <div className="font-bold text-cyan-400 mb-1">Variable</div>
                  <div className="text-xs text-slate-400">Your point share</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 pt-3 border-t border-slate-700">
          <Shield className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-slate-200 mb-3">
              <strong className="text-white">Why Point Values Are Adjustable:</strong>
            </p>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-1.5 flex-shrink-0" />
                <span><strong className="text-white">Prevents Gaming:</strong> If an action becomes heavily farmed, governance can reduce its point value</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-1.5 flex-shrink-0" />
                <span><strong className="text-white">Maintains Balance:</strong> Keeps ecosystem rewards fair and aligned with actual value creation</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-1.5 flex-shrink-0" />
                <span><strong className="text-white">Ensures Sustainability:</strong> System never overpays regardless of user base size</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 pt-3 border-t border-slate-700">
          <TrendingUp className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-slate-200 mb-3">
              <strong className="text-white">Infinite Scalability:</strong>
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-800/50 border border-green-500/30 rounded-lg p-3">
                <div className="font-semibold text-green-400 mb-1">✓ Works with 10 users</div>
                <p className="text-slate-400 text-xs">Budget divided by small point pool</p>
              </div>
              <div className="bg-slate-800/50 border border-green-500/30 rounded-lg p-3">
                <div className="font-semibold text-green-400 mb-1">✓ Works with 10M users</div>
                <p className="text-slate-400 text-xs">Same budget divided by large point pool</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-slate-300 mb-2">
            <strong className="text-white">Bottom Line:</strong> Your rewards depend on your <span className="text-cyan-400 font-bold">relative contribution</span> to the ecosystem, not fixed rates. The more you contribute compared to others, the higher your reward share. This system scales infinitely and never overpays.
          </p>
          <p className="text-xs text-slate-400 mt-2 italic">
            Point values are transparent and updated by governance based on ecosystem health metrics.
          </p>
        </div>
      </div>
    </div>
  );
}
