import { PageLayout } from '../../components/layout/PageLayout';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function SubmitProposal() {
  return (
    <PageLayout
      title="Submit a Proposal"
      description="Share your business idea with the community"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Requirements</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• Minimum 1000 tokens required to submit</li>
                <li>• Your wallet address will be recorded for future equity allocation</li>
                <li>• Proposal must include clear goals, scope, and success metrics</li>
                <li>• Voting period: 7-14 days based on community engagement</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">What Makes a Strong Proposal?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">Clear Value Proposition</h3>
                <p className="text-slate-300 text-sm">
                  What problem does it solve? Who is the target market? Why now?
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">Measurable Success Metrics</h3>
                <p className="text-slate-300 text-sm">
                  Define specific KPIs: revenue targets, user growth, market share, etc.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">Realistic Scope</h3>
                <p className="text-slate-300 text-sm">
                  Can it be built and launched within 3-6 months? Is it technically feasible?
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">Revenue Model</h3>
                <p className="text-slate-300 text-sm">
                  How will it generate income? What's the monetization strategy?
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Proposer Benefits</h2>
          <ul className="space-y-3 text-slate-300">
            <li>✓ Your wallet address is recorded for future equity allocation</li>
            <li>✓ If approved, you earn a share of the business's future profits</li>
            <li>✓ Recognition as the original proposer in the ecosystem</li>
            <li>✓ Influence over the business's strategic direction</li>
          </ul>
        </div>

        <div className="text-center">
          <button className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors">
            Connect Wallet to Submit
          </button>
          <p className="text-slate-400 text-sm mt-4">
            Must be signed in and hold minimum 1000 tokens
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
