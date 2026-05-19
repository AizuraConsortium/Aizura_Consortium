import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

interface AirdropData {
  userPoints: number;
  totalPoints: number;
  airdropPool: number;
  estimatedTokens: number;
  userPercentage: number;
  rank: number;
  totalUsers: number;
}

interface AirdropEstimateProps {
  userId: string;
}

export function AirdropEstimate({ userId }: AirdropEstimateProps) {
  const [data, setData] = useState<AirdropData | null>(null);
  const [loading, setLoading] = useState(true);
  const [customPool, setCustomPool] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  useEffect(() => {
    loadEstimate();
  }, [userId]);

  async function loadEstimate() {
    try {
      const response = await api.get(`/client/airdrop/estimate`);
      if (response.ok) {
        const estimateData = await response.json();
        setData(estimateData);
        setCustomPool(estimateData.airdropPool.toString());
      }
    } catch (error) {
      console.error('Failed to load airdrop estimate:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateCustomEstimate() {
    if (!data || !customPool) return null;

    const pool = parseFloat(customPool);
    if (isNaN(pool) || pool <= 0) return null;

    const allocation = (data.userPoints / data.totalPoints) * pool;
    return {
      tokens: allocation,
      percentage: (data.userPoints / data.totalPoints) * 100,
    };
  }

  const customEstimate = showCustom ? calculateCustomEstimate() : null;

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-bold text-white">Airdrop Allocation Calculator</h3>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-300">Estimated Allocation</span>
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-white">
              {data.estimatedTokens.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </span>
            <span className="text-xl text-slate-400">AAIC</span>
          </div>
          <p className="text-sm text-slate-400">
            Based on {data.airdropPool.toLocaleString()} total AAIC allocated
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-sm text-slate-400 mb-1">Your Points</div>
            <div className="text-2xl font-bold text-white">
              {data.userPoints.toLocaleString()}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-sm text-slate-400 mb-1">Total Points</div>
            <div className="text-2xl font-bold text-white">
              {data.totalPoints.toLocaleString()}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-sm text-slate-400 mb-1">Your Share</div>
            <div className="text-2xl font-bold text-cyan-400">
              {data.userPercentage.toFixed(4)}%
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-sm text-slate-400 mb-1">Your Rank</div>
            <div className="text-2xl font-bold text-white">
              #{data.rank.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <button
            onClick={() => setShowCustom(!showCustom)}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors mb-4"
          >
            {showCustom ? '← Back to default' : 'Calculate with custom pool →'}
          </button>

          {showCustom && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <label className="block text-sm font-medium text-white mb-2">
                Custom Airdrop Pool Size
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={customPool}
                  onChange={(e) => setCustomPool(e.target.value)}
                  placeholder="100000000"
                  className="flex-1 bg-slate-700 border border-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <span className="text-white font-medium">AAIC</span>
              </div>
              {customEstimate && (
                <div className="mt-4 p-4 bg-cyan-600/10 border border-cyan-500/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Your Estimated Allocation</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cyan-400">
                        {customEstimate.tokens.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </div>
                      <div className="text-xs text-slate-400">
                        {customEstimate.percentage.toFixed(4)}% of pool
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Important Disclaimer</h4>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>• This is an estimate based on current points distribution</li>
                <li>• Final allocation may vary as more users join and earn points</li>
                <li>• Points distribution can change until the airdrop snapshot</li>
                <li>• Actual airdrop pool size will be announced closer to TGE</li>
                <li>• This calculator is for reference only and not a guarantee</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-white">How to Increase Your Allocation</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1">
            <li>✓ Connect and verify all social accounts (+625 pts)</li>
            <li>✓ Refer friends to earn qualified referral bonuses (+200 pts each)</li>
            <li>✓ Submit quality content (up to +800 pts per submission)</li>
            <li>✓ Complete daily tasks and maintain login streaks</li>
            <li>✓ Engage with the community regularly</li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-xs text-slate-500">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
