import { useState } from 'react';
import { TrendingUp, Calculator, Info, AlertCircle } from 'lucide-react';

type ScenarioType = 'conservative' | 'moderate' | 'optimistic';

export function U2EPointsCalculator() {
  const [actionsPerMonth, setActionsPerMonth] = useState({
    aiTradersTrades: 10,
    webDevProjects: 2,
    businessFactoryUsage: 1,
    coinfusionSearches: 50,
  });

  const scenarios = {
    conservative: 50_000_000,
    moderate: 10_000_000,
    optimistic: 1_000_000,
  };

  const [totalNetworkPoints, setTotalNetworkPoints] = useState(scenarios.moderate);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>('moderate');

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

  const yourPoolShare = (monthlyPoints / totalNetworkPoints) * 100;
  const estimatedAAIC = (monthlyPoints / totalNetworkPoints) * monthlyU2EPool;

  const participationLevels = [
    {
      level: 'Casual',
      monthlyPoints: 1_000,
      share: (1_000 / totalNetworkPoints) * 100,
      aaic: (1_000 / totalNetworkPoints) * monthlyU2EPool
    },
    {
      level: 'Regular',
      monthlyPoints: 5_000,
      share: (5_000 / totalNetworkPoints) * 100,
      aaic: (5_000 / totalNetworkPoints) * monthlyU2EPool
    },
    {
      level: 'Active',
      monthlyPoints: 15_000,
      share: (15_000 / totalNetworkPoints) * 100,
      aaic: (15_000 / totalNetworkPoints) * monthlyU2EPool
    },
    {
      level: 'Power User',
      monthlyPoints: 50_000,
      share: (50_000 / totalNetworkPoints) * 100,
      aaic: (50_000 / totalNetworkPoints) * monthlyU2EPool
    },
  ];

  const handleChange = (field: keyof typeof actionsPerMonth, value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setActionsPerMonth(prev => ({ ...prev, [field]: numValue }));
  };

  const handleNetworkPointsChange = (value: string) => {
    const numValue = Math.max(1_000_000, Math.min(100_000_000_000, parseInt(value) || 1_000_000));
    setTotalNetworkPoints(numValue);
    setSelectedScenario('moderate');
  };

  const handleScenarioChange = (scenario: ScenarioType) => {
    setSelectedScenario(scenario);
    setTotalNetworkPoints(scenarios[scenario]);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-6 h-6 text-green-400" />
        <h3 className="text-2xl font-bold text-white">Use-to-Earn Points Calculator</h3>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-slate-300">
            <strong className="text-amber-400">Important:</strong> The Use-to-Earn system has not launched yet, so the average monthly network points are currently unknown. The calculations below are estimates based on assumed network activity. Once the system is live and we have historical data, we will update this calculator with actual averages to provide more accurate projections.
          </div>
        </div>
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
          <h4 className="text-lg font-semibold text-white mb-4">Network Activity Estimate</h4>

          <div className="bg-slate-700/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <label className="text-sm text-slate-300">
                Total Monthly Network Points
              </label>
              <div className="group relative">
                <Info className="w-4 h-4 text-cyan-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  This represents the total points earned by all users network-wide per month. Higher values = lower individual rewards. Adjust this to see how network competition affects your share.
                </div>
              </div>
            </div>

            <input
              type="number"
              min="1000000"
              max="100000000000"
              value={totalNetworkPoints}
              onChange={(e) => handleNetworkPointsChange(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 mb-3"
            />

            <div className="text-xs text-slate-400 mb-3">Range: 1M to 100B points</div>

            <div className="flex gap-2">
              <button
                onClick={() => handleScenarioChange('optimistic')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedScenario === 'optimistic'
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                }`}
              >
                Optimistic
                <div className="text-xs opacity-75">Low Competition</div>
              </button>
              <button
                onClick={() => handleScenarioChange('moderate')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedScenario === 'moderate'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                }`}
              >
                Moderate
                <div className="text-xs opacity-75">Average Use</div>
              </button>
              <button
                onClick={() => handleScenarioChange('conservative')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedScenario === 'conservative'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                }`}
              >
                Conservative
                <div className="text-xs opacity-75">High Competition</div>
              </button>
            </div>
          </div>

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
            <h5 className="font-semibold text-white mb-3 text-sm flex items-center gap-2">
              Assumptions
              <div className="group relative">
                <Info className="w-4 h-4 text-cyan-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  These calculations are projections. Actual rewards will depend on real network activity once the system launches.
                </div>
              </div>
            </h5>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• Monthly U2E pool: {monthlyU2EPool.toLocaleString()} AAIC (fixed)</li>
              <li>• Total network points: {totalNetworkPoints.toLocaleString()} (adjustable)</li>
              <li>• Your share scales proportionally with usage</li>
              <li>• Points expire monthly (use it or lose it)</li>
              <li>• Pool share = Your Points ÷ Total Network Points</li>
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
