import { useState } from 'react';
import { ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@shared/styles/theme';
import { ProposalStatusBadge, ProposalVoteDisplay } from '../governance';
import type { Proposal } from '@shared/types/models';

export interface ProposalCardProps {
  proposal: Proposal;
  variant?: 'light' | 'dark';
  onVote?: (proposalId: string, vote: 'for' | 'against') => void;
  showVoteButtons?: boolean;
  showMetadata?: boolean;
  expandable?: boolean;
  onClick?: (proposal: Proposal) => void;
}

/**
 * ProposalCard Component
 *
 * Flexible, reusable proposal card with:
 * - Light and dark variant support
 * - Optional vote buttons
 * - Optional metadata display
 * - Expandable details
 * - Status badges
 * - Vote progress display
 * - Click handler for navigation
 *
 * @example
 * ```tsx
 * // Simple light card
 * <ProposalCard proposal={proposal} variant="light" />
 *
 * // Dark card with voting
 * <ProposalCard
 *   proposal={proposal}
 *   variant="dark"
 *   showVoteButtons
 *   onVote={handleVote}
 * />
 *
 * // Expandable with metadata
 * <ProposalCard
 *   proposal={proposal}
 *   expandable
 *   showMetadata
 *   onClick={(p) => navigate(`/proposals/${p.id}`)}
 * />
 * ```
 */
export function ProposalCard({
  proposal,
  variant = 'light',
  onVote,
  showVoteButtons = true,
  showMetadata = false,
  expandable = false,
  onClick,
}: ProposalCardProps) {
  const [expanded, setExpanded] = useState(false);

  const cardClasses = cn(
    'rounded-xl p-6 transition-colors shadow-sm',
    variant === 'light'
      ? 'bg-white border border-slate-200 hover:border-blue-300'
      : 'bg-slate-800 border border-slate-700 hover:border-cyan-500/50',
    onClick && 'cursor-pointer'
  );

  const titleClasses = cn(
    'text-xl font-bold mb-2',
    variant === 'light' ? 'text-slate-900' : 'text-white'
  );

  const summaryClasses = cn(
    variant === 'light' ? 'text-slate-600' : 'text-slate-300'
  );

  const metadataClasses = cn(
    'text-sm mt-3 pt-3 border-t',
    variant === 'light'
      ? 'text-slate-500 border-slate-200'
      : 'text-slate-400 border-slate-700'
  );

  const shouldShowVoteButtons =
    showVoteButtons && proposal.status === 'queued' && onVote;

  const handleCardClick = () => {
    if (onClick) {
      onClick(proposal);
    }
  };

  const handleVoteClick = (e: React.MouseEvent, vote: 'for' | 'against') => {
    e.stopPropagation();
    if (onVote) {
      onVote(proposal.id, vote);
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <div className={cardClasses} onClick={handleCardClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={titleClasses}>{proposal.title}</h3>
          {proposal.summary && (
            <p className={cn(summaryClasses, expandable && !expanded && 'line-clamp-2')}>
              {proposal.summary}
            </p>
          )}

          {expandable && proposal.summary && proposal.summary.length > 150 && (
            <button
              onClick={handleExpandClick}
              className={cn(
                'flex items-center space-x-1 text-sm font-medium mt-2 transition-colors',
                variant === 'light'
                  ? 'text-blue-600 hover:text-blue-700'
                  : 'text-cyan-400 hover:text-cyan-300'
              )}
            >
              {expanded ? (
                <>
                  <span>Show less</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Show more</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>

        <ProposalStatusBadge status={proposal.status} variant={variant} />
      </div>

      {showMetadata && (
        <div className={metadataClasses}>
          <div className="flex flex-wrap gap-4">
            {proposal.created_at && (
              <span>
                Created: {new Date(proposal.created_at).toLocaleDateString()}
              </span>
            )}
            {proposal.voting_ends_at && (
              <span>
                Voting ends: {new Date(proposal.voting_ends_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        <ProposalVoteDisplay
          votesFor={proposal.votes_for}
          votesAgainst={proposal.votes_against}
          votingEndsAt={proposal.voting_ends_at}
          variant={variant}
        />

        {shouldShowVoteButtons && (
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => handleVoteClick(e, 'for')}
              aria-label={`Vote for ${proposal.title}`}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors border',
                variant === 'light'
                  ? 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                  : 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30'
              )}
            >
              <ThumbsUp className="w-4 h-4" aria-hidden="true" />
              <span>For</span>
            </button>
            <button
              onClick={(e) => handleVoteClick(e, 'against')}
              aria-label={`Vote against ${proposal.title}`}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors border',
                variant === 'light'
                  ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                  : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30'
              )}
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
