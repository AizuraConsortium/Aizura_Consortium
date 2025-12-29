import { TrendingUp, Flame, ArrowDown } from 'lucide-react';

export function SupplyProjection() {
  const yearData = [
    { year: 0, supply: 16_000_000, percentage: 16, description: 'Genesis + Initial Distribution' },
    { year: 1, supply: 47_000_000, percentage: 47, description: 'Year 1 Emissions (31M)' },
    { year: 2, supply: 61_000_000, percentage: 61, description: 'Year 2 Emissions (14M)' },
    { year: 3, supply: 75_000_000, percentage: 75, description: 'Year 3 Emissions (14M)' },
    { year: 4, supply: 81_000_000, percentage: 81, description: 'Year 4 Emissions (6M)' },
  ];

  const postYear4Milestones = [
    { supply: 79_000_000, description: 'Burns Begin (Revenue-backed model)' },
    { supply: 50_000_000, description: 'Halfway to Bitcoin Parity' },
    { supply: 30_000_000, description: 'Ultra-Scarce Phase' },
    { supply: 21_000_000, description: 'Final Target: Bitcoin Parity' },
  ];

  const getBarColor = (year: number) => {
    if (year === 0) return 'bg-gradient-to-r from-cyan-500 to-blue-500';
    if (year === 1) return 'bg-gradient-to-r from-blue-500 to-green-500';
    if (year === 2) return 'bg-gradient-to-r from-green-500 to-yellow-500';
    if (year === 3) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-orange-500 to-red-500';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-6 h-6 text-cyan-400" />
        <h3 className="text-2xl font-bold text-white">Circulating Supply Projection</h3>
      </div>
      <p className="text-slate-400 mb-8">
        Year-by-year circulating supply growth through emission phases, followed by deflationary burn phase
      </p>

      <div className="space-y-8">
        <div>
          <h4 className="text-lg font-semibold text-white mb-6">Years 0-4: Emission Phase</h4>
          <div className="space-y-4">
            {yearData.map((data) => (
              <div key={data.year} className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="text-lg font-bold text-white">Year {data.year}</div>
                    <div className="text-sm text-slate-400">{data.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-400">
                      {(data.supply / 1_000_000).toFixed(0)}M
                    </div>
                    <div className="text-sm text-slate-400">{data.percentage}% of max supply</div>
                  </div>
                </div>

                <div className="relative h-8 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getBarColor(data.year)} transition-all duration-500`}
                    style={{ width: `${data.percentage}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-white drop-shadow-lg">
                      {data.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Flame className="w-6 h-6 text-orange-400" />
            <h4 className="text-lg font-semibold text-white">Post-Year 4: Deflationary Phase</h4>
          </div>
          <p className="text-sm text-slate-300 mb-6">
            Supply peaks at ~81M tokens, then burns begin reducing supply toward 21M final target (Bitcoin parity)
          </p>

          <div className="space-y-3">
            {postYear4Milestones.map((milestone, idx) => (
              <div
                key={milestone.supply}
                className="flex items-center gap-4 bg-slate-800/50 rounded-lg p-4"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-orange-500/20 border border-orange-500/30 rounded-full flex-shrink-0">
                  <ArrowDown className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white">
                    {(milestone.supply / 1_000_000).toFixed(0)}M AAIC
                  </div>
                  <div className="text-sm text-slate-400">{milestone.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-400">
                    {Math.round((milestone.supply / 100_000_000) * 100)}%
                  </div>
                  <div className="text-xs text-slate-500">of max</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <div className="text-sm text-slate-400 mb-1">Peak Supply</div>
            <div className="text-2xl font-bold text-yellow-400">81M</div>
            <div className="text-xs text-slate-500 mt-1">End of Year 4</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <div className="text-sm text-slate-400 mb-1">To Be Burned</div>
            <div className="text-2xl font-bold text-orange-400">60M</div>
            <div className="text-xs text-slate-500 mt-1">~74% reduction</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <div className="text-sm text-slate-400 mb-1">Final Supply</div>
            <div className="text-2xl font-bold text-green-400">21M</div>
            <div className="text-xs text-slate-500 mt-1">Bitcoin Parity</div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <h5 className="font-bold text-white mb-2">Key Insights</h5>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>• Supply grows rapidly in Years 0-2 (incentivize early adoption)</li>
            <li>• Growth slows in Years 3-4 (transition to sustainability)</li>
            <li>• Burns begin post-Year 4 when ecosystem generates revenue</li>
            <li>• Burn timeline depends on portfolio profitability (see Burn Calculator)</li>
            <li>• Final 21M supply creates ultra-scarcity and Bitcoin-level perception</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
