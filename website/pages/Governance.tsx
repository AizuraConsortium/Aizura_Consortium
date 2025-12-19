import { useEffect, useState } from 'react';
import { ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';
import { api } from '../lib/api';
import { CardSkeleton } from '@shared/components/skeletons';
import { Navigation } from '../components/Navigation';

export default function Governance() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      const data = await api.getProposals();
      setProposals(data.proposals);
    } catch (error) {
      console.error('Failed to load proposals:', error);
      setError('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'adopted':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_debate':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

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

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-6 text-red-400" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            <CardSkeleton count={3} />
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div
                key={proposal.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{proposal.title}</h3>
                    <p className="text-slate-300">{proposal.summary}</p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(proposal.status)} ml-4 flex-shrink-0`}>
                    {proposal.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <ThumbsUp className="w-5 h-5 text-green-500" />
                    <span className="font-medium">{proposal.votes_for || 0}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ThumbsDown className="w-5 h-5 text-red-500" />
                    <span className="font-medium">{proposal.votes_against || 0}</span>
                  </div>
                  {proposal.voting_ends_at && (
                    <span className="text-sm text-slate-400">
                      Ends: {new Date(proposal.voting_ends_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {proposals.length === 0 && (
              <div className="text-center text-slate-400 py-12">
                No proposals yet.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
