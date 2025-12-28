import { TrendingDown, Zap } from 'lucide-react';

export function EmissionSchedule() {
  const monthlyU2E = 458_333;

  const yearlyStakingEmissions = [
    { year: 1, amount: 5_000_000, monthly: 416_667 },
    { year: 2, amount: 4_000_000, monthly: 333_333 },
    { year: 3, amount: 3_500_000, monthly: 291_667 },
    { year: 4, amount: 2_500_000, monthly: 208_333 },
  ];

  const generateMonthlyData = () => {
    const data = [];
    for (let month = 1; month <= 48; month++) {
      const year = Math.ceil(month / 12);
      const yearData = yearlyStakingEmissions[year - 1];

      data.push({
        month,
        u2e: monthlyU2E,
        staking: yearData.monthly,
        total: monthlyU2E + yearData.monthly,
        year,
      });
    }
    return data;
  };

  const monthlyData = generateMonthlyData();
  const maxEmission = Math.max(...monthlyData.map(d => d.total));

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
      <div className="flex items-center gap-2 mb-2">
        <TrendingDown className="w-6 h-6 text-cyan-400" />
        <h3 className="text-2xl font-bold text-white">48-Month Emission Schedule</h3>
      </div>
      <p className="text-slate-400 mb-8">
        Years 1-4: Fixed pool distribution. After Year 4: Transition to profit-backed rewards.
      </p>

      <div className="bg-slate-700/30 rounded-xl p-6 mb-8">
        <svg viewBox="0 0 1000 400" className="w-full">
          <defs>
            <linearGradient id="u2eGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="stakingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="totalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(6, 182, 212)" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3, 4].map((year) => {
            const x = 50 + (year * 12 * 19);
            return (
              <g key={year}>
                <rect
                  x={x}
                  y={30}
                  width={228}
                  height={280}
                  fill={year % 2 === 0 ? 'rgba(71, 85, 105, 0.1)' : 'rgba(51, 65, 85, 0.1)'}
                  rx="4"
                />
                {year > 0 && (
                  <text
                    x={x + 114}
                    y={20}
                    textAnchor="middle"
                    className="text-sm font-semibold fill-slate-400"
                  >
                    Year {year}
                  </text>
                )}
              </g>
            );
          })}

          {monthlyData.map((data, index) => {
            if (index === 0) return null;

            const prev = monthlyData[index - 1];
            const x1 = 50 + ((prev.month - 1) * 19);
            const x2 = 50 + ((data.month - 1) * 19);

            const totalY1 = 310 - ((prev.total / maxEmission) * 240);
            const totalY2 = 310 - ((data.total / maxEmission) * 240);

            const stakingY1 = 310 - ((prev.staking / maxEmission) * 240);
            const stakingY2 = 310 - ((data.staking / maxEmission) * 240);

            const u2eY = 310 - ((monthlyU2E / maxEmission) * 240);

            return (
              <g key={data.month}>
                <line
                  x1={x1}
                  y1={totalY1}
                  x2={x2}
                  y2={totalY2}
                  stroke="rgb(6, 182, 212)"
                  strokeWidth="2"
                />

                <line
                  x1={x1}
                  y1={stakingY1}
                  x2={x2}
                  y2={stakingY2}
                  stroke="rgb(168, 85, 247)"
                  strokeWidth="2"
                />

                <line
                  x1={x1}
                  y1={u2eY}
                  x2={x2}
                  y2={u2eY}
                  stroke="rgb(34, 197, 94)"
                  strokeWidth="2"
                />

                {index === 1 && (
                  <>
                    <polygon
                      points={`${x1},${totalY1} ${x1},310 ${x2},310 ${x2},${totalY2}`}
                      fill="url(#totalGradient)"
                    />
                    <polygon
                      points={`${x1},${stakingY1} ${x1},310 ${x2},310 ${x2},${stakingY2}`}
                      fill="url(#stakingGradient)"
                    />
                    <polygon
                      points={`${x1},${u2eY} ${x1},310 ${x2},310 ${x2},${u2eY}`}
                      fill="url(#u2eGradient)"
                    />
                  </>
                )}
                {index > 1 && (
                  <>
                    <polygon
                      points={`${x1},${totalY1} ${x1},310 ${x2},310 ${x2},${totalY2}`}
                      fill="url(#totalGradient)"
                    />
                    <polygon
                      points={`${x1},${stakingY1} ${x1},310 ${x2},310 ${x2},${stakingY2}`}
                      fill="url(#stakingGradient)"
                    />
                  </>
                )}
              </g>
            );
          })}

          <line x1="50" y1="310" x2="962" y2="310" stroke="rgb(71, 85, 105)" strokeWidth="2" />
          <line x1="50" y1="30" x2="50" y2="310" stroke="rgb(71, 85, 105)" strokeWidth="2" />

          <text x="500" y="345" textAnchor="middle" className="text-sm fill-slate-400">
            Month
          </text>
          <text x="20" y="170" textAnchor="middle" className="text-sm fill-slate-400" transform="rotate(-90 20 170)">
            AAIC Emitted
          </text>

          {[0, 12, 24, 36, 48].map((month) => (
            <text
              key={month}
              x={50 + (month * 19)}
              y="330"
              textAnchor="middle"
              className="text-xs fill-slate-500"
            >
              {month}
            </text>
          ))}
        </svg>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <h4 className="font-bold text-white">Use-to-Earn</h4>
          </div>
          <div className="text-2xl font-bold text-green-400 mb-1">
            {monthlyU2E.toLocaleString()}
          </div>
          <div className="text-sm text-slate-400">AAIC per month (flat)</div>
          <div className="mt-3 pt-3 border-t border-green-500/20">
            <div className="text-sm text-slate-300">
              Total: <span className="font-bold text-green-400">22M</span> over 48 months
            </div>
          </div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 bg-purple-500 rounded" />
            <h4 className="font-bold text-white">Staking Rewards</h4>
          </div>
          <div className="text-2xl font-bold text-purple-400 mb-1">
            Tapered
          </div>
          <div className="text-sm text-slate-400">Decreases yearly</div>
          <div className="mt-3 pt-3 border-t border-purple-500/20">
            <div className="text-sm text-slate-300">
              Total: <span className="font-bold text-purple-400">15M</span> over 48 months
            </div>
          </div>
        </div>

        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 bg-cyan-500 rounded" />
            <h4 className="font-bold text-white">Combined Total</h4>
          </div>
          <div className="text-2xl font-bold text-cyan-400 mb-1">
            {(monthlyU2E + yearlyStakingEmissions[0].monthly).toLocaleString()}
          </div>
          <div className="text-sm text-slate-400">AAIC/mo (Year 1)</div>
          <div className="mt-3 pt-3 border-t border-cyan-500/20">
            <div className="text-sm text-slate-300">
              Total: <span className="font-bold text-cyan-400">37M</span> over 48 months
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-700/30 rounded-xl p-6">
        <h4 className="font-bold text-white mb-4">Yearly Breakdown</h4>
        <div className="space-y-3">
          {yearlyStakingEmissions.map((data) => (
            <div
              key={data.year}
              className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">Y{data.year}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Staking Emissions</div>
                  <div className="font-bold text-purple-400">
                    {data.amount.toLocaleString()} AAIC
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400">Monthly Average</div>
                <div className="font-bold text-white">
                  {data.monthly.toLocaleString()} AAIC
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h5 className="font-bold text-white mb-2">After Month 48</h5>
            <p className="text-sm text-slate-300">
              Both Use-to-Earn and Staking transition from fixed token emissions to profit-backed rewards.
              Distribution continues indefinitely but is funded by 30% of monthly profits instead of token inflation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
