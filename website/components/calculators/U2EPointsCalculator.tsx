import { useState } from 'react';
import { TrendingUp, Calculator } from 'lucide-react';

export function U2EPointsCalculator() {
  const [actionsPerMonth, setActionsPerMonth] = useState({
    aiTradersTrades: 10,
    webDevProjects: 2,
    businessFactoryUsage: 1,
    coinfusionSearches: 50,
  });

  const pointsPerAction = {
    aiTradersTrades: 100,
    webDevProjects: 500,
    businessFactoryUsage: 1000,
    coinfusionSearches: 10,
  };

  const calculateMonthlyPoints = () => {
    return (
      actionsPerMonth.aiTradersTrades * pointsPerAction.aiTradersTrades +
      actionsPerMonth.webDevProjects * pointsPerAction.webDevProjects +
      actionsPerMonth.businessFactoryUsage * pointsPerAction.businessFactoryUsage +
      actionsPerMonth.coinfusionSearches * pointsPerAction.coinfusionSearches
    );
  };

  const monthlyPoints = calculateMonthlyPoints();
  const monthlyU2EPool = 458_333;
  const estimatedTotalUsersPoints = 1_000_000;

  const yourPoolShare = (monthlyPoints / estimatedTotalUsersPoints) * 100;
  const estimatedAAIC = (monthlyPoints / estimatedTotalUsersPoints) * monthlyU2EPool;

  const participationLevels = [
    { level: 'Casual', monthlyPoints: 1_000, share: 0.1, aaic: 458 },
    { level: 'Regular', monthlyPoints: 5_000, share: 0.5, aaic: 2_292 },
    { level: 'Active', monthlyPoints: 15_000, share: 1.5, aaic: 6_875 },
    { level: 'Power User', monthlyPoints: 50_000, share: 5.0, aaic: 22_917 },
  ];

  const handleChange = (field: keyof typeof actionsPerMonth, value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setActionsPerMonth(prev => ({ ...prev, [field]: numValue }));
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-6 h-6 text-green-400" />
        <h3 className="text-2xl font-bold text-white">Use-to-Earn Points Calculator</h3>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Your Monthly Activity</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                AI Traders - Automated Trades
                <span className="text-cyan-400 ml-2">({pointsPerAction.aiTradersTrades} pts each)</span>
              </label>
              <input
                type="number"
                min="0"
                value={actionsPerMonth.aiTradersTrades}
                onChange={(e) => handleChange('aiTradersTrades', e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                AI Web Dev - Projects Created
                <span className="text-cyan-400 ml-2">({pointsPerAction.webDevProjects} pts each)</span>
              </label>
              <input
                type="number"
                min="0"
                value={actionsPerMonth.webDevProjects}
                onChange={(e) => handleChange('webDevProjects', e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                AI Business Factory - Business Plans
                <span className="text-cyan-400 ml-2">({pointsPerAction.businessFactoryUsage} pts each)</span>
              </label>
              <input
                type="number"
                min="0"
                value={actionsPerMonth.businessFactoryUsage}
                onChange={(e) => handleChange('businessFactoryUsage', e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Coinfusion - Data Searches
                <span className="text-cyan-400 ml-2">({pointsPerAction.coinfusionSearches} pts each)</span>
              </label>
              <input
                type="number"
                min="0"
                value={actionsPerMonth.coinfusionSearches}
                onChange={(e) => handleChange('coinfusionSearches', e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Your Estimated Rewards</h4>

          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-xl p-6 mb-6">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {monthlyPoints.toLocaleString()}
              </div>
              <div className="text-sm text-slate-300">Points Per Month</div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-500/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  {yourPoolShare.toFixed(2)}%
                </div>
                <div className="text-xs text-slate-400">Pool Share</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {Math.round(estimatedAAIC).toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">AAIC / Month</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/30 rounded-xl p-4">
            <h5 className="font-semibold text-white mb-3 text-sm">Assumptions</h5>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• Monthly U2E pool: {monthlyU2EPool.toLocaleString()} AAIC</li>
              <li>• Estimated total network points: {estimatedTotalUsersPoints.toLocaleString()}</li>
              <li>• Your share scales with actual usage</li>
              <li>• Points expire monthly (use it or lose it)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-slate-700">
        <h4 className="text-lg font-semibold text-white mb-4">Participation Level Benchmarks</h4>
        <div className="grid md:grid-cols-4 gap-4">
          {participationLevels.map((level, index) => (
            <div
              key={level.level}
              className={`bg-slate-700/30 rounded-lg p-4 border ${
                monthlyPoints >= level.monthlyPoints && monthlyPoints < (participationLevels[index + 1]?.monthlyPoints || Infinity)
                  ? 'border-green-500'
                  : 'border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-bold text-white text-sm">{level.level}</h5>
                {monthlyPoints >= level.monthlyPoints && monthlyPoints < (participationLevels[index + 1]?.monthlyPoints || Infinity) && (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                )}
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <div>{level.monthlyPoints.toLocaleString()} pts/mo</div>
                <div className="text-green-400 font-semibold">~{level.aaic.toLocaleString()} AAIC</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
