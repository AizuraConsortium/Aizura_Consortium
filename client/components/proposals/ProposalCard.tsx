import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { ProposalStatusBadge, ProposalVoteDisplay } from '@shared/components/governance';

interface ProposalCardProps {
  proposal: {
    id: string;
    title: string;
    summary: string;
    status: string;
    votes_for: number;
    votes_against: number;
    voting_ends_at?: string;
  };
  onVote?: (proposalId: string, vote: 'for' | 'against') => void;
}

export function ProposalCard({ proposal, onVote }: ProposalCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 transition-colors shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-2">{proposal.title}</h3>
          <p className="text-slate-600">{proposal.summary}</p>
        </div>

        <ProposalStatusBadge status={proposal.status} />
      </div>

      <div className="flex items-center justify-between">
        <ProposalVoteDisplay
          votesFor={proposal.votes_for}
          votesAgainst={proposal.votes_against}
          votingEndsAt={proposal.voting_ends_at}
          variant="light"
        />

        {proposal.status === 'queued' && onVote && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onVote(proposal.id, 'for')}
              aria-label={`Vote for ${proposal.title}`}
              className="flex items-center space-x-2 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg transition-colors border border-green-200"
            >
              <ThumbsUp className="w-4 h-4" aria-hidden="true" />
              <span>For</span>
            </button>
            <button
              onClick={() => onVote(proposal.id, 'against')}
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
  );
}
