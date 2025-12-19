import { useEffect, useState } from 'react';
import { ThumbsUp, ThumbsDown, Plus, LogIn } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/AuthModal';
import { CardSkeleton } from '@shared/components/skeletons';
import { Navigation } from '../components/Navigation';
import { FormField } from '@shared/components/ui';

export default function Governance() {
  const { user, session, signOut } = useAuth();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [newProposal, setNewProposal] = useState({ title: '', summary: '' });
  const [submitting, setSubmitting] = useState(false);
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

  const handleSignIn = () => {
    setShowAuthModal(true);
  };

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProposal.title || !newProposal.summary) return;

    if (newProposal.title.length > 200) {
      setError('Title must be 200 characters or less');
      return;
    }

    if (newProposal.summary.length > 5000) {
      setError('Summary must be 5000 characters or less');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = session?.access_token;
      await api.createProposal(newProposal.title, newProposal.summary, token);
      setNewProposal({ title: '', summary: '' });
      setShowCreateForm(false);
      loadProposals();
    } catch (error: any) {
      console.error('Failed to create proposal:', error);
      setError(error.message || 'Failed to create proposal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (proposalId: string, vote: 'for' | 'against') => {
    if (!user || !session) {
      setShowAuthModal(true);
      return;
    }

    try {
      const token = session.access_token;
      await api.voteOnProposal(proposalId, vote, token);
      loadProposals();
    } catch (error: any) {
      console.error('Failed to vote:', error);
      setError(error.message || 'Failed to vote');
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

      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-end">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-400">{user.email}</span>
                <button
                  onClick={signOut}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                aria-label="Sign in to vote on proposals"
                className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>Sign In to Vote</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <main id="main-content" className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Governance</h1>
            <p className="text-slate-300">
              Submit and vote on business proposals for the Aizura Consortium
            </p>
          </div>

          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            aria-label="Create new proposal"
            aria-expanded={showCreateForm}
            className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" aria-hidden="true" />
            <span>New Proposal</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-6 text-red-400" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        {showCreateForm && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Create New Proposal</h3>
            <form onSubmit={handleCreateProposal} className="space-y-4">
              <FormField
                label="Title"
                htmlFor="proposal-title"
                required
                characterCount={{ current: newProposal.title.length, max: 200 }}
              >
                <input
                  id="proposal-title"
                  type="text"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="AI-Powered Travel Booking Platform"
                  maxLength={200}
                  required
                  aria-label="Proposal title"
                />
              </FormField>

              <FormField
                label="Summary"
                htmlFor="proposal-summary"
                required
                characterCount={{ current: newProposal.summary.length, max: 5000 }}
              >
                <textarea
                  id="proposal-summary"
                  value={newProposal.summary}
                  onChange={(e) => setNewProposal({ ...newProposal, summary: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 h-32"
                  placeholder="Describe your business idea in detail..."
                  maxLength={5000}
                  required
                  aria-label="Proposal summary"
                />
              </FormField>

              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {submitting ? 'Submitting...' : 'Submit Proposal'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
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

                <div className="flex items-center justify-between">
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

                  {proposal.status === 'queued' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleVote(proposal.id, 'for')}
                        aria-label={`Vote for ${proposal.title}`}
                        className="flex items-center space-x-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-lg transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" aria-hidden="true" />
                        <span>For</span>
                      </button>
                      <button
                        onClick={() => handleVote(proposal.id, 'against')}
                        aria-label={`Vote against ${proposal.title}`}
                        className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors"
                      >
                        <ThumbsDown className="w-4 h-4" aria-hidden="true" />
                        <span>Against</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {proposals.length === 0 && (
              <div className="text-center text-slate-400 py-12">
                No proposals yet. Be the first to submit one!
              </div>
            )}
          </div>
        )}
      </main>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
