import { useState } from 'react';
import { PieChart, TrendingDown } from 'lucide-react';

export function StakingAPYCalculator() {
  const [totalStaked, setTotalStaked] = useState(20_000_000);
  const [selectedYear, setSelectedYear] = useState(1);

  const yearlyEmissions = {
    1: 5_000_000,
    2: 4_000_000,
    3: 3_500_000,
    4: 2_500_000,
  };

  const lockPeriods = [
    { days: 30, multiplier: 1.0, label: '30 Days' },
    { days: 90, multiplier: 1.2, label: '90 Days' },
    { days: 180, multiplier: 1.5, label: '180 Days' },
    { days: 365, multiplier: 2.0, label: '365 Days' },
  ];

  const calculateAPY = (lockMultiplier: number) => {
    const yearEmissions = yearlyEmissions[selectedYear as keyof typeof yearlyEmissions];
    const baseAPY = (yearEmissions / totalStaked) * 100;
    return baseAPY * lockMultiplier;
  };

  const apyData = lockPeriods.map(period => ({
    ...period,
    apy: calculateAPY(period.multiplier),
  }));

  const generateChartPoints = () => {
    const points = [];
    const minStaked = 5_000_000;
    const maxStaked = 50_000_000;
    const steps = 20;
    const stepSize = (maxStaked - minStaked) / steps;

    for (let i = 0; i <= steps; i++) {
      const staked = minStaked + (stepSize * i);
      const yearEmissions = yearlyEmissions[selectedYear as keyof typeof yearlyEmissions];
      const baseAPY = (yearEmissions / staked) * 100;
      const maxAPY = baseAPY * 2.0;

      points.push({
        staked,
        apy: maxAPY,
      });
    }
    return points;
  };

  const chartPoints = generateChartPoints();
  const maxAPY = Math.max(...chartPoints.map(p => p.apy));

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
      <div className="flex items-center gap-2 mb-6">
        <PieChart className="w-6 h-6 text-purple-400" />
        <h3 className="text-2xl font-bold text-white">Staking APY Calculator</h3>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Input Parameters</h4>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Year (Emission Schedule)
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value={1}>Year 1 - {yearlyEmissions[1].toLocaleString()} AAIC</option>
                <option value={2}>Year 2 - {yearlyEmissions[2].toLocaleString()} AAIC</option>
                <option value={3}>Year 3 - {yearlyEmissions[3].toLocaleString()} AAIC</option>
                <option value={4}>Year 4 - {yearlyEmissions[4].toLocaleString()} AAIC</option>
              </select>
              <p className="text-xs text-slate-400 mt-2">
                Emissions taper each year from the 15M pool
              </p>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Total AAIC Staked (Network-Wide)
              </label>
              <input
                type="range"
                min="5000000"
                max="50000000"
                step="1000000"
                value={totalStaked}
                onChange={(e) => setTotalStaked(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-slate-400 mt-2">
                <span>5M</span>
                <span className="text-purple-400 font-bold">
                  {(totalStaked / 1_000_000).toFixed(1)}M
                </span>
                <span>50M</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                APY decreases as more tokens are staked
              </p>
            </div>
          </div>

          <div className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <h5 className="font-semibold text-white mb-2 text-sm">How It Works</h5>
            <ul className="space-y-1 text-xs text-slate-300">
              <li>• Fixed emission pool distributed per year</li>
              <li>• APY = (Yearly Emissions / Total Staked) × Lock Multiplier</li>
              <li>• Longer locks = higher multipliers</li>
              <li>• Market-driven: More stakers = lower APY</li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">APY by Lock Period</h4>

          <div className="space-y-3 mb-6">
            {apyData.map((data) => (
              <div
                key={data.days}
                className="bg-slate-700/50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{data.label}</span>
                  <span className="text-sm text-slate-400">
                    {data.multiplier}× multiplier
                  </span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-purple-400">
                    {data.apy.toFixed(2)}%
                  </span>
                  <span className="text-sm text-slate-400 mb-1">APY</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-5 h-5 text-cyan-400" />
              <h5 className="font-semibold text-white text-sm">Year {selectedYear} Emissions</h5>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-cyan-400">
                  {yearlyEmissions[selectedYear as keyof typeof yearlyEmissions].toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">AAIC This Year</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {((totalStaked / 100_000_000) * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-slate-400">Of Supply Staked</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-700/30 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">APY vs Total Staked (365-Day Lock)</h4>
        <p className="text-sm text-slate-400 mb-4">
          Year {selectedYear} - Maximum APY curve showing inverse relationship
        </p>

        <div className="relative h-64">
          <svg viewBox="0 0 800 200" className="w-full h-full">
            <defs>
              <linearGradient id="apyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {chartPoints.map((point, index) => {
              if (index === 0) return null;

              const prevPoint = chartPoints[index - 1];
              const x1 = ((prevPoint.staked - 5_000_000) / 45_000_000) * 760 + 20;
              const y1 = 180 - ((prevPoint.apy / maxAPY) * 160);
              const x2 = ((point.staked - 5_000_000) / 45_000_000) * 760 + 20;
              const y2 = 180 - ((point.apy / maxAPY) * 160);

              return (
                <g key={index}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgb(168, 85, 247)"
                    strokeWidth="3"
                  />
                  {index === 1 && (
                    <polygon
                      points={`${x1},${y1} ${x1},180 ${x2},180 ${x2},${y2}`}
                      fill="url(#apyGradient)"
                    />
                  )}
                  {index > 1 && (
                    <polygon
                      points={`${x1},${y1} ${x1},180 ${x2},180 ${x2},${y2}`}
                      fill="url(#apyGradient)"
                    />
                  )}
                </g>
              );
            })}

            <text x="400" y="195" textAnchor="middle" className="text-xs fill-slate-400">
              Total Staked (M AAIC)
            </text>
            <text x="10" y="20" textAnchor="start" className="text-xs fill-slate-400">
              APY %
            </text>

            {[5, 15, 25, 35, 45, 50].map((value) => (
              <text
                key={value}
                x={((value - 5) / 45) * 760 + 20}
                y="195"
                textAnchor="middle"
                className="text-xs fill-slate-500"
              >
                {value}M
              </text>
            ))}
          </svg>
        </div>
      </div>

      <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h5 className="font-bold text-white mb-2">Post-Year 4 Transition</h5>
        <p className="text-sm text-slate-300">
          After Year 4, staking rewards transition from fixed emissions to 15% of monthly profits.
          APY becomes directly tied to business performance instead of token emissions.
        </p>
      </div>
    </div>
  );
}
