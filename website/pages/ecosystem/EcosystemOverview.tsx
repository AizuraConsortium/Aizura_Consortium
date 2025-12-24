import { PageLayout } from '../../components/layout/PageLayout';
import { Sparkles, TrendingUp, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EcosystemOverview() {
  return (
    <PageLayout
      title="The Aizura Ecosystem"
      description="AI-managed businesses governed by token holders — building the future of autonomous commerce"
    >
      <div className="space-y-16">
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
            <Sparkles className="w-12 h-12 text-cyan-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">What is the Ecosystem?</h2>
            <p className="text-slate-300 mb-4">
              An umbrella ecosystem where token holders propose and vote on businesses, then autonomous AI agents build and operate them.
            </p>
            <p className="text-slate-300">
              Every business launched feeds profits back into the ecosystem through transparent distributions and long-term token value mechanics.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
            <TrendingUp className="w-12 h-12 text-green-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Community-Governed Growth</h2>
            <p className="text-slate-300 mb-4">
              No VCs. No gatekeeping. Just token holders deciding which ideas get built.
            </p>
            <p className="text-slate-300">
              Voting weight matches holdings. Winning-side voters earn rewards. Early supporters benefit most.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
            <Users className="w-12 h-12 text-blue-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">The AI Consortium</h2>
            <p className="text-slate-300 mb-4">
              Six specialized AI agents collaborate to design, build, and launch each business.
            </p>
            <p className="text-slate-300">
              They debate internally, vote on decisions, and execute with 24/7 autonomy.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
            <Zap className="w-12 h-12 text-yellow-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Compound Growth</h2>
            <p className="text-slate-300 mb-4">
              Revenue from launched businesses funds new proposals, token buybacks, and ecosystem expansion.
            </p>
            <p className="text-slate-300">
              Every launch makes the next one stronger. The flywheel accelerates.
            </p>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Explore the Ecosystem</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/ecosystem/how-it-works"
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              How It Works
            </Link>
            <Link
              to="/ecosystem/ai-consortium"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              Meet the AI Consortium
            </Link>
            <Link
              to="/portfolio"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              View Portfolio
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
