import { useState, useEffect } from 'react';
import { X, ExternalLink, CheckCircle, XCircle, AlertCircle, Loader2, User } from 'lucide-react';
import { api } from '../../lib/api';

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

interface UserInfo {
  totalPoints: number;
  submissionsCount: number;
  joinedAt: string;
  lastActivity: string;
}

interface SubmissionReviewProps {
  submission: Submission;
  onClose: () => void;
  onSuccess: () => void;
}

export function SubmissionReview({ submission, onClose, onSuccess }: SubmissionReviewProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [pointsAdjustment, setPointsAdjustment] = useState(submission.expectedPoints);
  const [reason, setReason] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | 'request-changes' | null>(null);

  useEffect(() => {
    loadUserInfo();
  }, [submission.userId]);

  async function loadUserInfo() {
    try {
      const data = await api.get<UserInfo>(`/admin/airdrop/users/${submission.userId}/summary`);
      setUserInfo(data);
    } catch (error) {
      console.error('Failed to load user info:', error);
    } finally {
      setLoadingUser(false);
    }
  }

  async function handleSubmit() {
    if (!action) return;

    if (action === 'reject' && !reason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setProcessing(true);

    try {
      await api.post(`/admin/airdrop/submissions/${submission.id}/${action}`, {
        points: pointsAdjustment,
        reason: reason.trim() || undefined,
      });
      onSuccess();
    } catch (error) {
      console.error(`Failed to ${action} submission:`, error);
      const message = error instanceof Error ? error.message : `Failed to ${action} submission`;
      alert(message);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-800 border border-white/10 rounded-2xl max-w-4xl w-full my-8">
        <div className="sticky top-0 bg-slate-800 border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">Review Submission</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Content Type
                </label>
                <span className="inline-block px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded text-sm">
                  {submission.contentType}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Title
                </label>
                <p className="text-white font-medium">{submission.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Content URL
                </label>
                <a
                  href={submission.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors break-all"
                >
                  {submission.url}
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                </a>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Description
                </label>
                <p className="text-slate-300 whitespace-pre-wrap">{submission.description}</p>
              </div>

              {submission.screenshotUrl && (
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Screenshot
                  </label>
                  <a
                    href={submission.screenshotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors"
                  >
                    <img
                      src={submission.screenshotUrl}
                      alt="Content screenshot"
                      className="w-full h-auto"
                    />
                  </a>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Points Award
                </label>
                <input
                  type="range"
                  min="0"
                  max={submission.expectedPoints * 2}
                  step="50"
                  value={pointsAdjustment}
                  onChange={(e) => setPointsAdjustment(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-slate-400">
                    Default: {submission.expectedPoints} pts
                  </span>
                  <span className="text-lg font-bold text-white">
                    {pointsAdjustment} pts
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-white">User Info</h3>
                </div>
                {loadingUser ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                  </div>
                ) : userInfo ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-400">Email</p>
                      <p className="text-sm text-white">{submission.userEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Total Points</p>
                      <p className="text-sm font-medium text-white">
                        {userInfo.totalPoints.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Past Submissions</p>
                      <p className="text-sm font-medium text-white">
                        {userInfo.submissionsCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Joined</p>
                      <p className="text-sm text-white">
                        {new Date(userInfo.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Last Activity</p>
                      <p className="text-sm text-white">
                        {new Date(userInfo.lastActivity).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Failed to load user info</p>
                )}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-2">Submitted</p>
                <p className="text-sm text-white">
                  {new Date(submission.submittedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Admin Notes {action === 'reject' && <span className="text-red-400">*</span>}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                action === 'reject'
                  ? 'Provide a reason for rejection...'
                  : 'Add optional notes for the user...'
              }
              rows={3}
              className="w-full bg-slate-700 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setAction('approve');
                setTimeout(() => handleSubmit(), 0);
              }}
              disabled={processing}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing && action === 'approve' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Approve
                </>
              )}
            </button>

            <button
              onClick={() => {
                setAction('request-changes');
                setTimeout(() => handleSubmit(), 0);
              }}
              disabled={processing}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing && action === 'request-changes' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <AlertCircle className="w-5 h-5" />
                  Request Changes
                </>
              )}
            </button>

            <button
              onClick={() => {
                setAction('reject');
                setTimeout(() => handleSubmit(), 0);
              }}
              disabled={processing}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing && action === 'reject' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  Reject
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
