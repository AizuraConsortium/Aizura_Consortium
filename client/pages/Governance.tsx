import { useEffect, useState } from 'react';
import { ThumbsUp, ThumbsDown, Plus, Home, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { CardSkeleton } from '@shared/components/skeletons';
import { FormField } from '@shared/components/ui';

export default function Governance() {
  const { session } = useAuth();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProposal, setNewProposal] = useState({ title: '', summary: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      const data = await api.getProposals(session?.access_token);
      setProposals(data.proposals);
    } catch (error) {
      console.error('Failed to load proposals:', error);
      setError('Failed to load proposals');
    } finally {
      setLoading(false);
    }
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
    try {
      const token = session?.access_token;
      if (!token) {
        setError('Please sign in to vote');
        return;
      }
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
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-slate-900">Client Portal</h1>
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className="flex items-center space-x-2 text-slate-600 hover:text-slate-900"
                >
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/proposals"
                  className="flex items-center space-x-2 text-slate-600 hover:text-slate-900"
                >
                  <FileText className="w-4 h-4" />
                  <span>My Proposals</span>
                </Link>
                <Link
                  to="/governance"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Governance</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Governance</h1>
            <p className="text-slate-600">
              Submit and vote on business proposals for the Aizura Consortium
            </p>
          </div>

          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            aria-label="Create new proposal"
            aria-expanded={showCreateForm}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" aria-hidden="true" />
            <span>New Proposal</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        {showCreateForm && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Create New Proposal</h3>
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
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
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
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {submitting ? 'Submitting...' : 'Submit Proposal'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="text-slate-600 hover:text-slate-900 transition-colors"
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
                className="bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 transition-colors shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{proposal.title}</h3>
                    <p className="text-slate-600">{proposal.summary}</p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(proposal.status)} ml-4 flex-shrink-0`}>
                    {proposal.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <ThumbsUp className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-slate-900">{proposal.votes_for || 0}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ThumbsDown className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-slate-900">{proposal.votes_against || 0}</span>
                    </div>
                    {proposal.voting_ends_at && (
                      <span className="text-sm text-slate-500">
                        Ends: {new Date(proposal.voting_ends_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {proposal.status === 'queued' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleVote(proposal.id, 'for')}
                        aria-label={`Vote for ${proposal.title}`}
                        className="flex items-center space-x-2 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg transition-colors border border-green-200"
                      >
                        <ThumbsUp className="w-4 h-4" aria-hidden="true" />
                        <span>For</span>
                      </button>
                      <button
                        onClick={() => handleVote(proposal.id, 'against')}
                        aria-label={`Vote against ${proposal.title}`}
                        className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg transition-colors border border-red-200"
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
              <div className="text-center text-slate-500 py-12 bg-white border border-slate-200 rounded-xl">
                No proposals yet. Be the first to submit one!
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
