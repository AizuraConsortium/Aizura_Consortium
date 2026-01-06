import { useState } from 'react';
import { Calculator, TrendingUp, ArrowLeftRight } from 'lucide-react';

export function PostYear4Calculator() {
  const [mode, setMode] = useState<'forward' | 'reverse'>('forward');
  const [desiredDistribution, setDesiredDistribution] = useState(1_000_000);
  const [aaicPrice, setAaicPrice] = useState(0.50);
  const [monthlyProfit, setMonthlyProfit] = useState(200_000);

  const rewardPercentage = 30;

  const calculateForward = () => {
    const safeProfit = Math.max(0, monthlyProfit);
    const safePrice = Math.max(0.01, aaicPrice);

    const rewardBudgetUSD = safeProfit * (rewardPercentage / 100);
    const maxDistributableAAIC = rewardBudgetUSD / safePrice;

    return {
      rewardBudgetUSD,
      maxDistributableAAIC,
      u2eShare: maxDistributableAAIC * 0.5,
      stakingShare: maxDistributableAAIC * 0.5,
    };
  };

  const calculateReverse = () => {
    const safeDistribution = Math.max(0, desiredDistribution);
    const safePrice = Math.max(0.01, aaicPrice);
    const safeProfit = Math.max(0, monthlyProfit);

    const totalNeededAAIC = safeDistribution;
    const totalNeededUSD = totalNeededAAIC * safePrice;
    const requiredProfit = totalNeededUSD / (rewardPercentage / 100);

    return {
      totalNeededUSD,
      requiredProfit,
      currentProfit: safeProfit,
      profitGap: requiredProfit - safeProfit,
    };
  };

  const forwardResult = calculateForward();
  const reverseResult = calculateReverse();

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
      <div className="flex items-center gap-2 mb-2">
        <Calculator className="w-6 h-6 text-blue-400" />
        <h3 className="text-2xl font-bold text-white">Post-Year 4 Sustainability Calculator</h3>
      </div>
      <p className="text-slate-400 mb-8">
        Calculate the relationship between profit, token price, and sustainable reward distribution after fixed emissions end
      </p>

      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setMode('forward')}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
            mode === 'forward'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span>Forward: Profit → Distribution</span>
          </div>
        </button>

        <ArrowLeftRight className="w-6 h-6 text-slate-400" />

        <button
          onClick={() => setMode('reverse')}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
            mode === 'reverse'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <ArrowLeftRight className="w-5 h-5" />
            <span>Reverse: Distribution → Profit</span>
          </div>
        </button>
      </div>

      {mode === 'forward' ? (
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Inputs</h4>
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
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
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
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <h5 className="font-semibold text-white mb-2 text-sm">How It Works</h5>
              <ul className="space-y-1 text-xs text-slate-300">
                <li>• 30% of profit allocated to rewards</li>
                <li>• Split 50/50 between U2E and Staking</li>
                <li>• Rewards scale with business performance</li>
                <li>• Fully sustainable, no token inflation</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Sustainable Distribution</h4>

            <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-xl p-6 mb-6">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-cyan-400 mb-2">
                  {Math.round(forwardResult.maxDistributableAAIC).toLocaleString()}
                </div>
                <div className="text-sm text-slate-300">AAIC Distributable Per Month</div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-cyan-500/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {Math.round(forwardResult.u2eShare).toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400">Use-to-Earn</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {Math.round(forwardResult.stakingShare).toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400">Staking Rewards</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-400">Monthly Profit</span>
                  <span className="font-bold text-white">${monthlyProfit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-400">30% to Rewards</span>
                  <span className="font-bold text-cyan-400">${forwardResult.rewardBudgetUSD.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-600">
                  <span className="text-sm text-slate-400">Token Price</span>
                  <span className="font-bold text-white">${aaicPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Target Distribution</h4>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Desired Monthly AAIC Distribution
                </label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={desiredDistribution}
                  onChange={(e) => setDesiredDistribution(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
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
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Current Monthly Profit (USD)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={monthlyProfit}
                  onChange={(e) => setMonthlyProfit(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Required Profit</h4>

            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-xl p-6 mb-6">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  ${Math.round(reverseResult.requiredProfit).toLocaleString()}
                </div>
                <div className="text-sm text-slate-300">Required Monthly Profit</div>
              </div>

              <div className="pt-4 border-t border-blue-500/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-400">Current Profit</span>
                  <span className="font-bold text-white">${monthlyProfit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Gap</span>
                  <span className={`font-bold ${reverseResult.profitGap > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {reverseResult.profitGap > 0 ? '+' : ''}{reverseResult.profitGap > 0 ? '$' : '-$'}
                    {Math.abs(reverseResult.profitGap).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-400">Target Distribution</span>
                  <span className="font-bold text-cyan-400">{desiredDistribution.toLocaleString()} AAIC</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-400">USD Value</span>
                  <span className="font-bold text-white">${reverseResult.totalNeededUSD.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-600">
                  <span className="text-sm text-slate-400">% of Required Profit</span>
                  <span className="font-bold text-white">30%</span>
                </div>
              </div>

              {reverseResult.profitGap > 0 ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-sm text-slate-300">
                    Need <span className="font-bold text-red-400">${Math.abs(reverseResult.profitGap).toLocaleString()}</span> more profit
                    to sustain this distribution level.
                  </p>
                </div>
              ) : (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-sm text-slate-300">
                    Current profit is <span className="font-bold text-green-400">sufficient</span> to support this
                    distribution level.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 pt-8 border-t border-slate-700">
        <h4 className="font-bold text-white mb-4">Key Principles</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h5 className="font-semibold text-cyan-400 mb-2 text-sm">No Token Inflation</h5>
            <p className="text-xs text-slate-300">
              Rewards come from USD profits converted to AAIC on the market, not from minting new tokens.
            </p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h5 className="font-semibold text-green-400 mb-2 text-sm">Performance-Linked</h5>
            <p className="text-xs text-slate-300">
              Distribution scales directly with business success. More profit = more rewards.
            </p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h5 className="font-semibold text-purple-400 mb-2 text-sm">Market-Based</h5>
            <p className="text-xs text-slate-300">
              Token price affects distribution size. Higher price = fewer tokens needed per dollar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
