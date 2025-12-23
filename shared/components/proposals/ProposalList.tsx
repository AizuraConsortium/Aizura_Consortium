import { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@shared/styles/theme';
import { CardSkeleton } from '../skeletons';
import { ProposalCard } from './ProposalCard';
import type { Proposal } from '@shared/types/models';

export interface ProposalListProps {
  proposals: Proposal[];
  loading: boolean;
  error?: string | null;
  onVote?: (proposalId: string, vote: 'for' | 'against') => void;
  variant?: 'light' | 'dark';
  showVoteButtons?: boolean;
  showMetadata?: boolean;
  expandable?: boolean;
  emptyMessage?: string;
  skeletonCount?: number;
  itemRenderer?: (proposal: Proposal) => ReactNode;
  onProposalClick?: (proposal: Proposal) => void;
  className?: string;
}

/**
 * ProposalList Component
 *
 * Reusable list component for displaying proposals with:
 * - Skeleton loading states
 * - Error states with retry
 * - Empty states with custom messages
 * - Custom item rendering
 * - Responsive layout
 * - Light/dark variants
 * - Optional vote buttons
 * - Optional metadata display
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ProposalList
 *   proposals={proposals}
 *   loading={loading}
 *   error={error}
 *   variant="light"
 * />
 *
 * // With voting
 * <ProposalList
 *   proposals={proposals}
 *   loading={loading}
 *   showVoteButtons
 *   onVote={handleVote}
 * />
 *
 * // Custom rendering
 * <ProposalList
 *   proposals={proposals}
 *   loading={loading}
 *   itemRenderer={(proposal) => (
 *     <CustomProposalCard proposal={proposal} />
 *   )}
 * />
 * ```
 */
export function ProposalList({
  proposals,
  loading,
  error,
  onVote,
  variant = 'light',
  showVoteButtons = true,
  showMetadata = false,
  expandable = false,
  emptyMessage = 'No proposals yet.',
  skeletonCount = 3,
  itemRenderer,
  onProposalClick,
  className,
}: ProposalListProps) {
  const containerClasses = cn('space-y-4', className);

  const emptyClasses = cn(
    'text-center py-12 rounded-xl',
    variant === 'light'
      ? 'text-slate-500 bg-white border border-slate-200'
      : 'text-slate-400 bg-slate-800 border border-slate-700'
  );

  const errorClasses = cn(
    'rounded-xl p-4 mb-6 border',
    variant === 'light'
      ? 'bg-red-50 border-red-200 text-red-700'
      : 'bg-red-500/10 border-red-500/50 text-red-400'
  );

  if (loading) {
    return (
      <div className={containerClasses}>
        <CardSkeleton count={skeletonCount} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={errorClasses} role="alert" aria-live="assertive">
        <div className="flex items-start space-x-3">
          <AlertCircle
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="flex-1">
            <p className="font-medium">Error loading proposals</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className={emptyClasses}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {proposals.map((proposal) =>
        itemRenderer ? (
          <div key={proposal.id}>{itemRenderer(proposal)}</div>
        ) : (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            variant={variant}
            onVote={onVote}
            showVoteButtons={showVoteButtons}
            showMetadata={showMetadata}
            expandable={expandable}
            onClick={onProposalClick}
          />
        )
      )}
    </div>
  );
}
