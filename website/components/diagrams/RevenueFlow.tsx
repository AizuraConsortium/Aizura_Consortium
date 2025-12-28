import { ArrowRight, DollarSign, Flame, Lock, TrendingUp, Wallet, Zap } from 'lucide-react';

export function RevenueFlow() {
  const buckets = [
    {
      label: 'Buyback → Burn',
      percentage: 30,
      color: 'from-red-500 to-orange-500',
      icon: <Flame className="w-5 h-5" />,
      description: 'Permanent supply reduction',
    },
    {
      label: 'Staking Rewards',
      percentage: 15,
      color: 'from-purple-500 to-pink-500',
      icon: <Lock className="w-5 h-5" />,
      description: 'Distributed to token stakers',
    },
    {
      label: 'Use-to-Earn',
      percentage: 15,
      color: 'from-green-500 to-emerald-500',
      icon: <Zap className="w-5 h-5" />,
      description: 'Rewards for platform usage',
    },
    {
      label: 'Treasury',
      percentage: 20,
      color: 'from-blue-500 to-cyan-500',
      icon: <Wallet className="w-5 h-5" />,
      description: 'Ecosystem development fund',
    },
    {
      label: 'Variable',
      percentage: 20,
      color: 'from-yellow-500 to-amber-500',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Governance-adjustable bucket',
    },
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
      <h3 className="text-2xl font-bold text-white mb-2">Revenue Distribution Flow</h3>
      <p className="text-slate-400 mb-8">
        How monthly profits are automatically distributed across the ecosystem
      </p>

      <div className="space-y-8">
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600 rounded-xl p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <div className="text-sm text-slate-400 mb-2">Monthly Revenue</div>
              <div className="text-4xl font-bold text-white mb-2">$100,000</div>
              <div className="text-sm text-green-400">Example Calculation</div>
            </div>

            <ArrowRight className="w-8 h-8 text-cyan-400 rotate-90 md:rotate-0" />

            <div className="flex-1 text-center md:text-left">
              <div className="text-sm text-slate-400 mb-2">Operating Costs</div>
              <div className="text-4xl font-bold text-red-400 mb-2">-$10,000</div>
              <div className="text-sm text-slate-400">~90% margin from AI</div>
            </div>

            <ArrowRight className="w-8 h-8 text-cyan-400 rotate-90 md:rotate-0" />

            <div className="flex-1 text-center md:text-left">
              <div className="text-sm text-slate-400 mb-2">Net Profit</div>
              <div className="text-4xl font-bold text-green-400 mb-2">$90,000</div>
              <div className="text-sm text-green-400">Ready to distribute</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 text-slate-400">
            <div className="h-px w-16 bg-cyan-500/50" />
            <DollarSign className="w-6 h-6 text-cyan-400" />
            <div className="h-px w-16 bg-cyan-500/50" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buckets.map((bucket) => (
            <div
              key={bucket.label}
              className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 hover:border-slate-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${bucket.color}`}>
                  {bucket.icon}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">
                    {bucket.percentage}%
                  </div>
                  <div className="text-sm text-slate-400">of profit</div>
                </div>
              </div>

              <h4 className="font-bold text-white mb-2">{bucket.label}</h4>
              <p className="text-sm text-slate-300 mb-4">{bucket.description}</p>

              <div className="pt-4 border-t border-slate-600">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">From $90k profit:</span>
                  <span className="font-bold text-cyan-400">
                    ${(90000 * (bucket.percentage / 100)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-6">
          <h4 className="font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Distribution Breakdown
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Total Distribution</span>
              <span className="font-bold text-white">100% of net profit</span>
            </div>

            <div className="h-8 flex rounded-lg overflow-hidden">
              {buckets.map((bucket) => (
                <div
                  key={bucket.label}
                  style={{ width: `${bucket.percentage}%` }}
                  className={`bg-gradient-to-r ${bucket.color} flex items-center justify-center text-white text-xs font-bold`}
                  title={`${bucket.label}: ${bucket.percentage}%`}
                >
                  {bucket.percentage}%
                </div>
              ))}
            </div>

            <div className="grid grid-cols-5 gap-2 text-center pt-2">
              {buckets.map((bucket) => (
                <div key={bucket.label} className="text-xs text-slate-400">
                  {bucket.label.split(' ')[0]}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-700/30 rounded-xl p-6">
            <h4 className="font-bold text-white mb-3">Automatic Distribution</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Smart contracts execute distribution monthly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>No manual intervention required</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Fully transparent on-chain</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Governance can adjust percentages</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-700/30 rounded-xl p-6">
            <h4 className="font-bold text-white mb-3">Variable Bucket</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Governance-controlled allocation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Can fund special initiatives</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Flexible response to ecosystem needs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Subject to DAO approval</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
