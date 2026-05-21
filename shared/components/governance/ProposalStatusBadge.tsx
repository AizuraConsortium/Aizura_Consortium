import type { ProposalStatus } from '@shared/types/models';

interface ProposalStatusBadgeProps {
  status: ProposalStatus;
  variant?: 'light' | 'dark';
}

export function ProposalStatusBadge({ status }: ProposalStatusBadgeProps) {
  const getStatusColor = (status: ProposalStatus): string => {
    switch (status) {
      case 'adopted':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_debate':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'queued':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        const exhaustiveCheck: never = status;
        void exhaustiveCheck;
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
