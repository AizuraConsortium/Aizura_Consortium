import { useState } from 'react';
import { Flame, TrendingUp } from 'lucide-react';

export function BurnCalculator() {
  const [monthlyProfit, setMonthlyProfit] = useState(90000);
  const [aaicPrice, setAaicPrice] = useState(0.50);

  const burnPercentage = 15;
  const targetBurnedSupply = 79_000_000;
  const currentSupply = 100_000_000;

  const calculateBurnRate = () => {
    const safeProfit = Math.max(0, monthlyProfit);
    const safePrice = Math.max(0.01, aaicPrice);

    const monthlyBurnUSD = safeProfit * (burnPercentage / 100);
    const monthlyBurnAAIC = monthlyBurnUSD / safePrice;
    const monthsToTarget = monthlyBurnAAIC > 0 ? targetBurnedSupply / monthlyBurnAAIC : 0;
    const yearsToTarget = monthsToTarget / 12;

    return {
      monthlyBurnUSD,
      monthlyBurnAAIC,
      monthsToTarget,
      yearsToTarget,
      finalSupply: currentSupply - targetBurnedSupply,
    };
  };

  const result = calculateBurnRate();

  const scenarios = [
    {
      profit: 40080,
      price: 0.20,
      label: 'Conservative',
      description: '~219 years',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      profit: 80730,
      price: 0.50,
      label: 'Base Case',
      description: '~272 years',
      color: 'from-orange-500 to-red-500',
    },
    {
      profit: 163100,
      price: 1.00,
      label: 'Growth',
      description: '~269 years',
      color: 'from-red-500 to-pink-500',
    },
    {
      profit: 255800,
      price: 1.50,
      label: 'Aggressive',
      description: '~257 years',
      color: 'from-pink-500 to-violet-500',
    },
    {
      profit: 600700,
      price: 2.00,
      label: 'Hyperscale',
      description: '~146 years',
      color: 'from-violet-500 to-blue-500',
    },
    {
      profit: 1252800,
      price: 2.50,
      label: 'Ultra-Aggressive',
      description: '~88 years',
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  const scenarioResults = scenarios.map(scenario => {
    const safeProfit = Math.max(0, scenario.profit);
    const safePrice = Math.max(0.01, scenario.price);

    const burnUSD = safeProfit * (burnPercentage / 100);
    const burnAAIC = burnUSD / safePrice;
    const months = burnAAIC > 0 ? targetBurnedSupply / burnAAIC : 0;
    const years = months / 12;

    return {
      ...scenario,
      burnAAIC,
      years,
    };
  });

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
      <div className="flex items-center gap-2 mb-2">
        <Flame className="w-6 h-6 text-orange-400" />
        <h3 className="text-2xl font-bold text-white">Burn Timeline Calculator</h3>
      </div>
      <p className="text-slate-400 mb-8">
        Calculate how long it takes to burn 79M tokens (reducing supply to 21M, matching Bitcoin) based on profit and token price
      </p>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Input Parameters</h4>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Monthly Net Profit (USD)
              </label>
              <input
                type="number"
                min="1000"
                step="1000"
                value={monthlyProfit}
                onChange={(e) => setMonthlyProfit(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>${(monthlyProfit * 0.15).toLocaleString()} allocated to burn (15% of profit)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                AAIC Token Price (USD)
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={aaicPrice}
                onChange={(e) => setAaicPrice(parseFloat(e.target.value) || 0.01)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>Higher price = fewer tokens burned per dollar</span>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <h5 className="font-semibold text-white mb-2 text-sm">Burn Mechanism</h5>
            <ul className="space-y-1 text-xs text-slate-300">
              <li>• 15% buyback + 15% burn (30% combined for deflationary pressure)</li>
              <li>• Tokens purchased from open market via buyback allocation</li>
              <li>• Burn allocation directly reduces supply permanently</li>
              <li>• Permanent supply reduction until 79M burned (21M final supply)</li>
              <li>• Target: 21M final circulating supply (Bitcoin parity)</li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Projected Timeline</h4>

          <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/30 rounded-xl p-6 mb-6">
            <div className="text-center mb-4">
              <Flame className="w-12 h-12 text-orange-400 mx-auto mb-3" />
              <div className="text-4xl font-bold text-orange-400 mb-2">
                {result.yearsToTarget.toFixed(1)} years
              </div>
              <div className="text-sm text-slate-300">To reach 21M supply target (Bitcoin parity)</div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-orange-500/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {Math.round(result.monthlyBurnAAIC).toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">AAIC Burned/Month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  ${Math.round(result.monthlyBurnUSD).toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">USD/Month</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">Current Supply</span>
                <span className="font-bold text-white">{currentSupply.toLocaleString()} AAIC</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">Target Burned</span>
                <span className="font-bold text-red-400">-{targetBurnedSupply.toLocaleString()} AAIC</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-600">
                <span className="text-sm text-slate-400">Final Supply</span>
                <span className="font-bold text-green-400">{result.finalSupply.toLocaleString()} AAIC</span>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4">
              <h5 className="font-semibold text-white mb-3 text-sm">Supply Reduction</h5>
              <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
                  style={{ width: '21%' }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>0%</span>
                <span className="text-orange-400 font-bold">21% Reduction</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-700/30 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          Scenario Analysis Matrix
        </h4>
        <p className="text-sm text-slate-400 mb-4">
          Time to reach 21M supply target (Bitcoin parity) under different conditions
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">Scenario</th>
                <th className="text-right py-3 px-4 text-slate-400 font-semibold">Monthly Profit</th>
                <th className="text-right py-3 px-4 text-slate-400 font-semibold">Token Price</th>
                <th className="text-right py-3 px-4 text-slate-400 font-semibold">Burn/Month</th>
                <th className="text-right py-3 px-4 text-slate-400 font-semibold">Years to 21M</th>
              </tr>
            </thead>
            <tbody>
              {scenarioResults.map((scenario) => (
                <tr
                  key={scenario.label}
                  className="border-b border-slate-700/50 hover:bg-slate-700/20"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded bg-gradient-to-r ${scenario.color}`} />
                      <div>
                        <div className="font-semibold text-white">{scenario.label}</div>
                        <div className="text-xs text-slate-500">{scenario.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 text-slate-300">
                    ${scenario.profit.toLocaleString()}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-300">
                    ${scenario.price.toFixed(2)}
                  </td>
                  <td className="text-right py-3 px-4 text-orange-400 font-semibold">
                    {Math.round(scenario.burnAAIC).toLocaleString()}
                  </td>
                  <td className="text-right py-3 px-4 text-cyan-400 font-bold">
                    {scenario.years.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h5 className="font-bold text-white mb-2">Important Notes</h5>
        <ul className="space-y-1 text-sm text-slate-300">
          <li>• Burns are permanent and irreversible</li>
          <li>• Market price affects burn rate (higher price = slower burn)</li>
          <li>• Accelerates as supply decreases if demand remains constant</li>
          <li>• Creates deflationary pressure on circulating supply</li>
          <li>• <strong className="text-cyan-400">Reaching 21M supply (Bitcoin parity) requires significant sustained profitability</strong></li>
        </ul>
      </div>
    </div>
  );
}
