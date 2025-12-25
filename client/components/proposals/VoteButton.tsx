import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@shared/components/ToastProvider';
import { api } from '../../lib/api';

interface VoteButtonProps {
  proposalId: string;
  currentVote?: 'for' | 'against' | null;
  onVoteChange?: () => void;
  disabled?: boolean;
  variant?: 'light' | 'dark';
}

export function VoteButton({
  proposalId,
  currentVote: initialVote,
  onVoteChange,
  disabled = false,
  variant = 'dark'
}: VoteButtonProps) {
  const { session } = useAuth();
  const { showSuccess, showError } = useToast();
  const [voting, setVoting] = useState(false);
  const [userVote, setUserVote] = useState<'for' | 'against' | null>(initialVote || null);
  const [loadingVote, setLoadingVote] = useState(false);

  useEffect(() => {
    if (session && proposalId && initialVote === undefined) {
      setLoadingVote(true);
      api.getUserVote(proposalId, session.access_token)
        .then(data => setUserVote(data.vote))
        .catch(() => setUserVote(null))
        .finally(() => setLoadingVote(false));
    }
  }, [proposalId, session, initialVote]);

  const handleVote = async (vote: 'for' | 'against') => {
    if (!session) {
      showError('Authentication Required', 'Please sign in to vote on proposals');
      return;
    }

    if (voting || disabled) return;

    const previousVote = userVote;

    try {
      setVoting(true);
      setUserVote(vote);

      await api.voteOnProposal(proposalId, vote, session.access_token);

      showSuccess(
        'Vote Recorded',
        `You voted ${vote.toUpperCase()} on this proposal`
      );

      if (onVoteChange) {
        onVoteChange();
      }
    } catch (error) {
      setUserVote(previousVote);
      showError(
        'Vote Failed',
        error instanceof Error ? error.message : 'Failed to record your vote. Please try again.'
      );
    } finally {
      setVoting(false);
    }
  };

  if (loadingVote) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        <span className="ml-2 text-sm text-slate-400">Loading vote status...</span>
      </div>
    );
  }

  const buttonBaseClasses = "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border disabled:opacity-50 disabled:cursor-not-allowed";

  const forButtonClasses = variant === 'dark'
    ? userVote === 'for'
      ? 'bg-green-500/20 border-green-500 text-green-400'
      : 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30'
    : userVote === 'for'
      ? 'bg-green-100 border-green-500 text-green-700'
      : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200';

  const againstButtonClasses = variant === 'dark'
    ? userVote === 'against'
      ? 'bg-red-500/20 border-red-500 text-red-400'
      : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30'
    : userVote === 'against'
      ? 'bg-red-100 border-red-500 text-red-700'
      : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200';

  return (
    <div className="space-y-3">
      {userVote && (
        <div className={`text-sm ${variant === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
          Current vote:
          <span className={`ml-2 font-medium ${
            userVote === 'for'
              ? variant === 'dark' ? 'text-green-400' : 'text-green-600'
              : variant === 'dark' ? 'text-red-400' : 'text-red-600'
          }`}>
            {userVote.toUpperCase()}
          </span>
          {!disabled && <span className="ml-1 text-xs opacity-75">(click to change)</span>}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={() => handleVote('for')}
          disabled={voting || disabled}
          className={`${buttonBaseClasses} ${forButtonClasses}`}
          aria-label="Vote for this proposal"
        >
          {voting && userVote === 'for' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ThumbsUp className="w-4 h-4" />
          )}
          <span>{userVote === 'for' ? 'Voted FOR' : 'Vote FOR'}</span>
        </button>

        <button
          onClick={() => handleVote('against')}
          disabled={voting || disabled}
          className={`${buttonBaseClasses} ${againstButtonClasses}`}
          aria-label="Vote against this proposal"
        >
          {voting && userVote === 'against' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ThumbsDown className="w-4 h-4" />
          )}
          <span>{userVote === 'against' ? 'Voted AGAINST' : 'Vote AGAINST'}</span>
        </button>
      </div>
    </div>
  );
}
