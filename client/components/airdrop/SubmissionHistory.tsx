import { useState, useEffect } from 'react';
import { FileText, CheckCircle, XCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

interface Submission {
  id: string;
  contentType: string;
  title: string;
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  pointsAwarded: number;
  adminNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
}

interface SubmissionHistoryProps {
  userId: string;
}

export function SubmissionHistory({ userId }: SubmissionHistoryProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    loadSubmissions();
  }, [userId]);

  async function loadSubmissions() {
    try {
      const response = await api.get(`/api/client/airdrop/content/submissions`);
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error('Failed to load submissions:', error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'pending':
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'approved':
        return 'bg-green-600/20 border-green-500/30 text-green-300';
      case 'rejected':
        return 'bg-red-600/20 border-red-500/30 text-red-300';
      case 'pending':
      default:
        return 'bg-yellow-600/20 border-yellow-500/30 text-yellow-300';
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const filteredSubmissions = filter === 'all'
    ? submissions
    : submissions.filter(s => s.status === filter);

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Submission History</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filter === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filter === 'rejected'
                ? 'bg-red-600 text-white'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400 mb-2">No submissions yet</p>
          <p className="text-sm text-slate-500">
            {filter === 'all'
              ? 'Submit quality content to earn airdrop points'
              : `No ${filter} submissions`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getStatusIcon(submission.status)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h4 className="text-base font-semibold text-white mb-1">
                        {submission.title}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-1 border rounded ${getStatusBadge(submission.status)}`}>
                          {submission.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-400">
                          {submission.contentType}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-400">
                          {formatDate(submission.submittedAt)}
                        </span>
                      </div>
                    </div>

                    {submission.status === 'approved' && (
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-green-400">
                          +{submission.pointsAwarded}
                        </div>
                        <div className="text-xs text-slate-400">points</div>
                      </div>
                    )}
                  </div>

                  <a
                    href={submission.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors break-all"
                  >
                    {submission.url}
                  </a>

                  {submission.adminNotes && (
                    <div className={`mt-3 p-3 rounded-lg border ${
                      submission.status === 'rejected'
                        ? 'bg-red-600/10 border-red-500/20'
                        : 'bg-blue-600/10 border-blue-500/20'
                    }`}>
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-white mb-1">Admin Notes:</p>
                          <p className="text-xs text-slate-300">{submission.adminNotes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {submission.status === 'rejected' && (
                    <button
                      onClick={() => window.location.href = '/dashboard/airdrop?submit=true'}
                      className="mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Resubmit Content →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredSubmissions.length > 0 && (
        <div className="mt-6 p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
          <p className="text-xs text-slate-300">
            <strong className="text-white">Review Time:</strong> Most submissions are reviewed within 24-48 hours.
            You'll be notified once your submission has been reviewed.
          </p>
        </div>
      )}
    </div>
  );
}
