import { ExternalLink } from 'lucide-react';
import { api } from '../lib/api';
import { useProposals } from '@shared/hooks';
import { ProposalList } from '@shared/components';
import { Navigation } from '../components/layout/Navigation';

export default function Governance() {
  const { proposals, loading, error } = useProposals({
    apiClient: api,
    onError: (err) => {
      console.error('Failed to load proposals:', err);
    },
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navigation variant="internal" />

      <main id="main-content" className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Governance</h1>
            <p className="text-slate-300">
              View business proposals and their voting results
            </p>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-6 mb-6">
          <div className="flex items-start space-x-4">
            <ExternalLink className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" aria-hidden="true" />
            <div>
              <h3 className="text-lg font-bold text-blue-300 mb-2">Want to create proposals and vote?</h3>
              <p className="text-slate-300 mb-4">
                Sign in to the Client Portal to submit new business proposals and participate in governance voting.
              </p>
              <a
                href="/client"
                className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <span>Go to Client Portal</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <ProposalList
          proposals={proposals}
          loading={loading}
          error={error}
          variant="dark"
          showVoteButtons={false}
          emptyMessage="No proposals yet."
        />
      </main>
    </div>
  );
}
