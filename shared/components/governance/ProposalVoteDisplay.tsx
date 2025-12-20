import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface ProposalVoteDisplayProps {
  votesFor: number;
  votesAgainst: number;
  votingEndsAt?: string;
  variant?: 'light' | 'dark';
}

export function ProposalVoteDisplay({
  votesFor,
  votesAgainst,
  votingEndsAt,
  variant = 'light'
}: ProposalVoteDisplayProps) {
  const textColorClass = variant === 'dark' ? 'text-white' : 'text-slate-900';
  const mutedTextClass = variant === 'dark' ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2">
        <ThumbsUp className={`w-5 h-5 ${variant === 'dark' ? 'text-green-500' : 'text-green-600'}`} />
        <span className={`font-medium ${textColorClass}`}>{votesFor || 0}</span>
      </div>
      <div className="flex items-center space-x-2">
        <ThumbsDown className={`w-5 h-5 ${variant === 'dark' ? 'text-red-500' : 'text-red-600'}`} />
        <span className={`font-medium ${textColorClass}`}>{votesAgainst || 0}</span>
      </div>
      {votingEndsAt && (
        <span className={`text-sm ${mutedTextClass}`}>
          Ends: {new Date(votingEndsAt).toLocaleDateString()}
        </span>
      )}
    </div>
  );
}
