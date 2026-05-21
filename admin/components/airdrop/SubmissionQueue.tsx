import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Loader2, Filter } from 'lucide-react';
import { api } from '../../lib/api';
import { SubmissionReview } from './SubmissionReview';

interface Submission {
  id: string;
  userId: string;
  userEmail: string;
  contentType: string;
  title: string;
  url: string;
  description: string;
  screenshotUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  expectedPoints: number;
}

export function SubmissionQueue() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'user'>('date');

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function loadSubmissions() {
    try {
      const data = await api.get<{ submissions: Submission[] }>('/admin/airdrop/submissions?status=pending');
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error('Failed to load submissions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleBulkAction(action: 'approve' | 'reject') {
    if (selectedIds.size === 0) return;

    const confirmed = confirm(
      `${action === 'approve' ? 'Approve' : 'Reject'} ${selectedIds.size} submissions?`
    );
    if (!confirmed) return;

    try {
      await api.post(`/admin/airdrop/submissions/bulk-${action}`, {
        submissionIds: Array.from(selectedIds),
      });
      setSelectedIds(new Set());
      loadSubmissions();
    } catch (error) {
      console.error(`Failed to ${action} submissions:`, error);
    }
  }

  function toggleSelection(id: string) {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  }

  function toggleSelectAll() {
    if (selectedIds.size === filteredSubmissions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSubmissions.map(s => s.id)));
    }
  }

  const filteredSubmissions = submissions
    .filter(s => filterType === 'all' || s.contentType === filterType)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      } else if (sortBy === 'type') {
        return a.contentType.localeCompare(b.contentType);
      } else {
        return a.userEmail.localeCompare(b.userEmail);
      }
    });

  const contentTypes = ['all', ...Array.from(new Set(submissions.map(s => s.contentType)))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-700 border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {contentTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'type' | 'user')}
            className="bg-slate-700 border border-white/10 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="type">Sort by Type</option>
            <option value="user">Sort by User</option>
          </select>
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">
              {selectedIds.size} selected
            </span>
            <button
              onClick={() => handleBulkAction('approve')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Approve Selected
            </button>
            <button
              onClick={() => handleBulkAction('reject')}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Reject Selected
            </button>
          </div>
        )}
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filteredSubmissions.length && filteredSubmissions.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Title</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Submitted</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Points</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No pending submissions
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(submission.id)}
                        onChange={() => toggleSelection(submission.id)}
                        className="rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs px-2 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded">
                        {submission.contentType}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="max-w-xs">
                        <p className="text-sm font-medium text-white truncate">
                          {submission.title}
                        </p>
                        <a
                          href={submission.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300 truncate block"
                        >
                          {submission.url}
                        </a>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-slate-300">{submission.userEmail}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-slate-400">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-green-400">
                        +{submission.expectedPoints}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSubmission && (
        <SubmissionReview
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onSuccess={() => {
            setSelectedSubmission(null);
            loadSubmissions();
          }}
        />
      )}
    </div>
  );
}
