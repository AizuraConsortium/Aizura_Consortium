import { useState } from 'react';
import { Calculator, TrendingUp, Info, Sparkles, BarChart3 } from 'lucide-react';

interface UsageInput {
  aiTraders: number;
  aiBusinessFactory: number;
  aiWebDev: number;
}

interface RewardRate {
  business: string;
  rate: number;
  unit: string;
}

export function U2ECalculator() {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [usage, setUsage] = useState<UsageInput>({
    aiTraders: 20,
    aiBusinessFactory: 5,
    aiWebDev: 10
  });

  const rewardRates: RewardRate[] = [
    { business: 'AI Traders', rate: 5, unit: 'AAIC per trade' },
    { business: 'AI Business Factory', rate: 50, unit: 'AAIC per business' },
    { business: 'AI Web Dev', rate: 10, unit: 'AAIC per project' }
  ];

  const multipliers = {
    daily: 1,
    weekly: 7,
    monthly: 30
  };

  const calculateRewards = () => {
    const multiplier = multipliers[timeframe];
    const tradersReward = usage.aiTraders * 5 * multiplier;
    const factoryReward = usage.aiBusinessFactory * 50 * multiplier;
    const webDevReward = usage.aiWebDev * 10 * multiplier;
    return {
      traders: tradersReward,
      factory: factoryReward,
      webDev: webDevReward,
      total: tradersReward + factoryReward + webDevReward
    };
  };

  const rewards = calculateRewards();

  const estimatedValue = (tokens: number) => {
    const assumedPrice = 0.10;
    return (tokens * assumedPrice).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-6 h-6 text-cyan-400" />
          <h3 className="text-2xl font-bold text-white">Earning Potential Calculator</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Time Frame
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['daily', 'weekly', 'monthly'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeframe === tf
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {tf.charAt(0).toUpperCase() + tf.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                AI Traders Usage
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={usage.aiTraders}
                  onChange={(e) => setUsage({ ...usage, aiTraders: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500"
                />
                <div className="w-20 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-center">
                  <input
                    type="number"
                    value={usage.aiTraders}
                    onChange={(e) => setUsage({ ...usage, aiTraders: parseInt(e.target.value) || 0 })}
                    className="w-full bg-transparent text-white text-sm focus:outline-none"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1">Trades per {timeframe === 'daily' ? 'day' : timeframe === 'weekly' ? 'week' : 'month'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                AI Business Factory Usage
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={usage.aiBusinessFactory}
                  onChange={(e) => setUsage({ ...usage, aiBusinessFactory: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500"
                />
                <div className="w-20 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-center">
                  <input
                    type="number"
                    value={usage.aiBusinessFactory}
                    onChange={(e) => setUsage({ ...usage, aiBusinessFactory: parseInt(e.target.value) || 0 })}
                    className="w-full bg-transparent text-white text-sm focus:outline-none"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1">Businesses created per {timeframe === 'daily' ? 'day' : timeframe === 'weekly' ? 'week' : 'month'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                AI Web Dev Usage
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={usage.aiWebDev}
                  onChange={(e) => setUsage({ ...usage, aiWebDev: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500"
                />
                <div className="w-20 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-center">
                  <input
                    type="number"
                    value={usage.aiWebDev}
                    onChange={(e) => setUsage({ ...usage, aiWebDev: parseInt(e.target.value) || 0 })}
                    className="w-full bg-transparent text-white text-sm focus:outline-none"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1">Projects per {timeframe === 'daily' ? 'day' : timeframe === 'weekly' ? 'week' : 'month'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-cyan-400" />
          <h4 className="text-xl font-bold text-white">Estimated Earnings</h4>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">AI Traders</div>
            <div className="text-2xl font-bold text-cyan-400">{rewards.traders.toFixed(0)} AAIC</div>
            <div className="text-xs text-slate-500 mt-1">≈ ${estimatedValue(rewards.traders)}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">AI Business Factory</div>
            <div className="text-2xl font-bold text-blue-400">{rewards.factory.toFixed(0)} AAIC</div>
            <div className="text-xs text-slate-500 mt-1">≈ ${estimatedValue(rewards.factory)}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">AI Web Dev</div>
            <div className="text-2xl font-bold text-green-400">{rewards.webDev.toFixed(0)} AAIC</div>
            <div className="text-xs text-slate-500 mt-1">≈ ${estimatedValue(rewards.webDev)}</div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-cyan-500/30 rounded-lg p-6 text-center">
          <div className="text-sm text-slate-400 mb-2">Total {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Earnings</div>
          <div className="text-4xl font-bold text-white mb-1">{rewards.total.toFixed(0)} AAIC</div>
          <div className="text-lg text-cyan-400">≈ ${estimatedValue(rewards.total)} USD</div>
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-slate-500 mb-1">Monthly</div>
                <div className="text-sm font-bold text-white">{(rewards.total * 30 / multipliers[timeframe]).toFixed(0)} AAIC</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Yearly</div>
                <div className="text-sm font-bold text-white">{(rewards.total * 365 / multipliers[timeframe]).toFixed(0)} AAIC</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Est. Value</div>
                <div className="text-sm font-bold text-green-400">${estimatedValue(rewards.total * 365 / multipliers[timeframe])}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h5 className="font-bold text-white">Current Reward Rates</h5>
          </div>
          <div className="space-y-2">
            {rewardRates.map((rate, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-0">
                <span className="text-sm text-slate-300">{rate.business}</span>
                <span className="text-sm font-medium text-cyan-400">{rate.rate} {rate.unit.split(' ').slice(1).join(' ')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-white mb-2">Important Notes</h5>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>• Rates shown are current Phase 1 rates</li>
                <li>• Actual rates may vary based on system config</li>
                <li>• Token price estimate is illustrative only</li>
                <li>• System must be active for rewards</li>
                <li>• Rewards accrue in real-time per action</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-bold text-white mb-2">Maximize Your Earnings</h5>
            <p className="text-sm text-slate-300 mb-3">
              The more you use the ecosystem, the more you earn. Power users who actively leverage
              all three platforms can accumulate significant AAIC rewards over time.
            </p>
            <p className="text-sm text-slate-400 italic">
              Remember: U2E rewards are designed to incentivize genuine usage, not speculation.
              Use the platforms because they provide value, and earn tokens as a bonus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
