import { Coins, Lock, Unlock, TrendingDown, Clock } from 'lucide-react';

export function SupplyBreakdown() {
  const totalSupply = 100_000_000;

  const categories = [
    {
      label: 'Circulating at Launch',
      amount: 16_000_000,
      percentage: 16,
      color: 'from-green-500 to-emerald-500',
      items: [
        { label: 'Airdrop (immediate unlock)', amount: 8_000_000 },
        { label: 'Investors (immediate unlock)', amount: 8_000_000 },
      ],
    },
    {
      label: 'TreasuryVault',
      amount: 28_000_000,
      percentage: 28,
      color: 'from-blue-500 to-cyan-500',
      items: [
        { label: 'Treasury Reserve', amount: 15_000_000 },
        { label: 'Liquidity Provisioning', amount: 6_000_000 },
        { label: 'Market Ops / CEX', amount: 7_000_000 },
      ],
    },
    {
      label: 'Vested (Linear Release)',
      amount: 19_000_000,
      percentage: 19,
      color: 'from-orange-500 to-amber-500',
      items: [
        { label: 'Team (36mo NO CLIFF)', amount: 16_000_000 },
        { label: 'Advisors (12mo NO CLIFF)', amount: 3_000_000 },
      ],
    },
    {
      label: 'Emission Pools (Y1-4)',
      amount: 37_000_000,
      percentage: 37,
      color: 'from-purple-500 to-pink-500',
      items: [
        { label: 'Use-to-Earn Pool', amount: 22_000_000 },
        { label: 'Staking Rewards Pool', amount: 15_000_000 },
      ],
    },
  ];

  const timelineStages = [
    {
      label: 'Launch Day',
      circulating: 16_000_000,
      locked: 84_000_000,
      color: 'text-green-400',
    },
    {
      label: '6 Months',
      circulating: 32_250_000,
      locked: 67_750_000,
      color: 'text-cyan-400',
    },
    {
      label: '12 Months',
      circulating: 48_500_000,
      locked: 51_500_000,
      color: 'text-blue-400',
    },
    {
      label: '24 Months',
      circulating: 72_000_000,
      locked: 28_000_000,
      color: 'text-purple-400',
    },
    {
      label: '48 Months',
      circulating: 100_000_000,
      locked: 0,
      color: 'text-orange-400',
    },
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
      <div className="flex items-center gap-2 mb-2">
        <Coins className="w-6 h-6 text-cyan-400" />
        <h3 className="text-2xl font-bold text-white">Token Supply Breakdown</h3>
      </div>
      <p className="text-slate-400 mb-8">
        Complete breakdown of 100M token allocation, vesting, and release schedule
      </p>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Allocation Categories</h4>

          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.label} className="bg-slate-700/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-bold text-white">{category.label}</h5>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">
                      {category.percentage}%
                    </span>
                    <div className={`w-4 h-4 rounded bg-gradient-to-r ${category.color}`} />
                  </div>
                </div>

                <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full bg-gradient-to-r ${category.color}`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>

                <div className="space-y-2">
                  {category.items.map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-slate-300">{item.label}</span>
                      <span className="font-semibold text-slate-200">
                        {item.amount.toLocaleString()} AAIC
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-600">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">Total:</span>
                    <span className="font-bold text-white">
                      {category.amount.toLocaleString()} AAIC
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Circulating Supply Timeline</h4>

          <div className="bg-slate-700/30 rounded-xl p-6 mb-6">
            <div className="space-y-4">
              {timelineStages.map((stage, index) => (
                <div key={stage.label}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Clock className={`w-5 h-5 ${stage.color}`} />
                      <span className="font-semibold text-white">{stage.label}</span>
                    </div>
                    <span className={`font-bold ${stage.color}`}>
                      {((stage.circulating / totalSupply) * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <div className="flex-1">
                      <div className="h-8 bg-slate-800 rounded-lg overflow-hidden flex">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold"
                          style={{ width: `${(stage.circulating / totalSupply) * 100}%` }}
                        >
                          {stage.circulating >= 16_000_000 && (
                            <Unlock className="w-4 h-4" />
                          )}
                        </div>
                        <div
                          className="bg-gradient-to-r from-slate-600 to-slate-700 flex items-center justify-center text-white text-xs font-bold"
                          style={{ width: `${(stage.locked / totalSupply) * 100}%` }}
                        >
                          {stage.locked > 0 && stage.locked < 84_000_000 && (
                            <Lock className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Circulating: {stage.circulating.toLocaleString()}</span>
                    <span>Locked: {stage.locked.toLocaleString()}</span>
                  </div>

                  {index < timelineStages.length - 1 && (
                    <div className="h-4 border-l-2 border-slate-600 ml-2.5 my-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <Unlock className="w-6 h-6 text-green-400 mb-2" />
              <div className="text-2xl font-bold text-green-400 mb-1">16M</div>
              <div className="text-xs text-slate-300">Circulating at Launch</div>
            </div>

            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              <Lock className="w-6 h-6 text-slate-400 mb-2" />
              <div className="text-2xl font-bold text-slate-300 mb-1">84M</div>
              <div className="text-xs text-slate-300">Locked/Vested at Launch</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600 rounded-xl p-6 mb-8">
        <h4 className="font-bold text-white mb-4">Deploy-Time Distribution</h4>
        <div className="grid md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">100M</div>
            <div className="text-sm text-slate-400">Minted Once</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">16M</div>
            <div className="text-sm text-slate-400">Instant Unlock</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">28M</div>
            <div className="text-sm text-slate-400">TreasuryVault</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">19M</div>
            <div className="text-sm text-slate-400">Linear Vesting</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">37M</div>
            <div className="text-sm text-slate-400">4-Year Emissions</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-700/30 rounded-xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <Lock className="w-6 h-6 text-orange-400 flex-shrink-0" />
            <div>
              <h5 className="font-bold text-white mb-2">Vesting Details</h5>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><strong className="text-white">Team (16M):</strong> 36-month linear, NO CLIFF</li>
                <li><strong className="text-white">Advisors (3M):</strong> 12-month linear, NO CLIFF</li>
                <li><strong className="text-white">Investors (8M):</strong> NO VESTING (publicly labeled wallets)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <TrendingDown className="w-6 h-6 text-purple-400 flex-shrink-0" />
            <div>
              <h5 className="font-bold text-white mb-2">Emission Schedule</h5>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><strong className="text-white">U2E:</strong> 458,333/month flat (48 months)</li>
                <li><strong className="text-white">Staking:</strong> Tapered Y1-4 (4.5M, 3.75M, 3.75M, 3M)</li>
                <li><strong className="text-white">Post-Y4:</strong> Transition to profit-backed rewards</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Coins className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h5 className="font-bold text-white mb-2">Fixed Supply Forever</h5>
            <p className="text-sm text-slate-300">
              100M tokens minted at deployment, then minting disabled permanently. No inflation, ever. The only
              supply change is deflationary through burns (target: 79M burned → 21M final supply, Bitcoin parity).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
