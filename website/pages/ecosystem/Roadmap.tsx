import { PageLayout } from '../../components/layout/PageLayout';
import { CheckCircle, Clock, Sparkles } from 'lucide-react';

export default function Roadmap() {
  return (
    <PageLayout
      title="Roadmap"
      description="Our journey from launch to ecosystem dominance"
    >
      <div className="space-y-8">
        <div className="bg-slate-800/50 backdrop-blur border border-green-700 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Live Now</h2>
          </div>
          <ul className="space-y-3 text-slate-300">
            <li>✓ AI Consortium v1 (6-agent collaboration model)</li>
            <li>✓ Public governance portal</li>
            <li>✓ AI Traders v1 (automated trading platform)</li>
            <li>✓ AI Web Development Platform v1</li>
            <li>✓ Community launchpad for proposal submissions</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-cyan-700 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Q3 2026</h2>
          </div>
          <ul className="space-y-3 text-slate-300">
            <li>• AI Traders v2 (advanced strategies + cross-exchange)</li>
            <li>• AI Business Factory commercialization (public access to consortium engine)</li>
            <li>• Token staking with dynamic APY</li>
            <li>• First revenue distributions to token holders</li>
            <li>• Enhanced voting reward system</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-blue-700 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Q4 2026</h2>
          </div>
          <ul className="space-y-3 text-slate-300">
            <li>• Coinfusion launch (CoinMarketCap/Coingecko competitor)</li>
            <li>• AI Web Development Platform v2 (advanced features)</li>
            <li>• Cross-chain token support</li>
            <li>• Mobile app for governance + portfolio tracking</li>
          </ul>
        </div>

        <div className="bg-linear-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Q4 2026 Flagship Project</h2>
          </div>
          <p className="text-slate-300 mb-4">
            A major launch is planned for Q4 2026. This will be the ecosystem's most ambitious project yet,
            representing a significant leap in autonomous AI commerce capabilities.
          </p>
          <p className="text-purple-400 font-medium">
            Details will be announced closer to launch. Stay tuned.
          </p>
        </div>

        <div className="text-center pt-8">
          <p className="text-slate-400 text-sm">
            Timeline subject to governance votes and technical progress. Details may evolve.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
