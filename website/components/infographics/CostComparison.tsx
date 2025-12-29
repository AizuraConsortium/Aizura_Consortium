import { DollarSign, TrendingDown, Target, Sparkles } from 'lucide-react';

export function CostComparison() {
  const traditionalBusiness = {
    label: 'Traditional Business',
    costs: [
      { item: 'Salaries (5-10 employees)', amount: 300_000, range: '200K-500K' },
      { item: 'Office & Infrastructure', amount: 60_000, range: '30K-100K' },
      { item: 'Marketing & Sales', amount: 80_000, range: '50K-150K' },
      { item: 'Legal & Compliance', amount: 30_000, range: '20K-50K' },
      { item: 'Software & Tools', amount: 30_000, range: '20K-100K' },
    ],
    annual: 500_000,
    range: '$500K-$900K',
    color: 'from-red-500 to-orange-500',
  };

  const aiBusiness = {
    label: 'AI Business',
    costs: [
      { item: 'API Costs (OpenAI, etc)', amount: 18_000, range: '12K-36K' },
      { item: 'Cloud Infrastructure', amount: 12_000, range: '6K-24K' },
      { item: 'Domain & Hosting', amount: 1_200, range: '500-2K' },
      { item: 'Minimal Human Oversight', amount: 10_000, range: '0-15K' },
      { item: 'Marketing Automation', amount: 3_000, range: '1K-5K' },
    ],
    annual: 44_200,
    range: '$18K-$65K',
    color: 'from-green-500 to-cyan-500',
  };

  const savings = traditionalBusiness.annual - aiBusiness.annual;
  const savingsPercentage = Math.round((savings / traditionalBusiness.annual) * 100);

  const portfolioMath = {
    failures: 100,
    costPerFailure: aiBusiness.annual,
    totalFailureCost: 100 * aiBusiness.annual,
    successRevenue: 10_000_000,
  };

  const roi = portfolioMath.successRevenue - portfolioMath.totalFailureCost;
  const roiMultiple = (portfolioMath.successRevenue / portfolioMath.totalFailureCost).toFixed(1);

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
      <div className="flex items-center gap-2 mb-2">
        <DollarSign className="w-6 h-6 text-green-400" />
        <h3 className="text-2xl font-bold text-white">Cost Structure Comparison</h3>
      </div>
      <p className="text-slate-400 mb-8">
        AI businesses operate at 10-20x lower cost than traditional businesses, enabling aggressive experimentation
      </p>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-700/30 rounded-xl p-6 border-2 border-red-500/30">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-white">{traditionalBusiness.label}</h4>
            <div className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
              <span className="text-sm font-bold text-red-400">High Cost</span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {traditionalBusiness.costs.map((cost) => (
              <div key={cost.item} className="flex justify-between items-start">
                <span className="text-sm text-slate-300">{cost.item}</span>
                <span className="text-sm font-semibold text-slate-200">{cost.range}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-600">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Annual Total</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-400">
                  ${(traditionalBusiness.annual / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-slate-500">{traditionalBusiness.range}/year</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-6 border-2 border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-white">{aiBusiness.label}</h4>
            <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
              <span className="text-sm font-bold text-green-400">Low Cost</span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {aiBusiness.costs.map((cost) => (
              <div key={cost.item} className="flex justify-between items-start">
                <span className="text-sm text-slate-300">{cost.item}</span>
                <span className="text-sm font-semibold text-slate-200">{cost.range}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-600">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Annual Total</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">
                  ${(aiBusiness.annual / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-slate-500">{aiBusiness.range}/year</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-900/30 to-cyan-900/30 border border-green-500/30 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <TrendingDown className="w-6 h-6 text-green-400" />
          <h4 className="text-xl font-bold text-white">Cost Savings Analysis</h4>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-sm text-slate-400 mb-1">Annual Savings</div>
            <div className="text-3xl font-bold text-green-400">
              ${(savings / 1000).toFixed(0)}K
            </div>
            <div className="text-xs text-slate-500 mt-1">per business/year</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-sm text-slate-400 mb-1">Cost Reduction</div>
            <div className="text-3xl font-bold text-cyan-400">{savingsPercentage}%</div>
            <div className="text-xs text-slate-500 mt-1">vs traditional</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-sm text-slate-400 mb-1">Cost Multiple</div>
            <div className="text-3xl font-bold text-yellow-400">
              {(traditionalBusiness.annual / aiBusiness.annual).toFixed(1)}x
            </div>
            <div className="text-xs text-slate-500 mt-1">cheaper than trad</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-900/30 to-yellow-900/30 border border-orange-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-orange-400" />
          <h4 className="text-xl font-bold text-white">Portfolio Economics</h4>
        </div>
        <p className="text-sm text-slate-300 mb-6">
          Low costs enable aggressive experimentation: launch 100 AI businesses for the cost of 5-10 traditional businesses
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Experiment Volume</div>
              <div className="text-2xl font-bold text-white mb-1">
                {portfolioMath.failures} AI Businesses
              </div>
              <div className="text-xs text-slate-500">
                @ ${(portfolioMath.costPerFailure / 1000).toFixed(0)}K each
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Total Investment</div>
              <div className="text-2xl font-bold text-orange-400">
                ${(portfolioMath.totalFailureCost / 1_000_000).toFixed(1)}M
              </div>
              <div className="text-xs text-slate-500">for 100 experiments</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-lg p-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-green-400" />
              <div className="text-sm text-slate-400">If Just 1 Success Generates</div>
            </div>
            <div className="text-4xl font-bold text-green-400 mb-2">
              ${(portfolioMath.successRevenue / 1_000_000).toFixed(0)}M+
            </div>
            <div className="space-y-1 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Net ROI:</span>
                <span className="font-bold text-cyan-400">
                  ${(roi / 1_000_000).toFixed(1)}M
                </span>
              </div>
              <div className="flex justify-between">
                <span>ROI Multiple:</span>
                <span className="font-bold text-green-400">{roiMultiple}x</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h5 className="font-bold text-white mb-2">Strategic Advantage</h5>
        <ul className="space-y-1 text-sm text-slate-300">
          <li>• AI businesses cost 90-98% less than traditional businesses</li>
          <li>• Low costs enable 10-20x more experiments for same budget</li>
          <li>• Portfolio approach: 99 failures + 1 success = massive profit</li>
          <li>• Automated operations = minimal human overhead</li>
          <li>• Scales to hundreds of businesses without linear cost increase</li>
        </ul>
      </div>
    </div>
  );
}
