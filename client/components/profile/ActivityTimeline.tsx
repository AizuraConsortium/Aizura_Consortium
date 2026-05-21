import { useState, useEffect } from 'react';
import { Timeline, TimelineItem } from '@shared/components/ui/Timeline';
import { Badge } from '@shared/components/ui/Badge';
import { Button } from '@shared/components/ui/Button';
import {
  User,
  CheckCircle,
  Twitter,
  MessageCircle,
  Github,
  Send,
  Users,
  FileText,
  Award,
  LogIn,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../lib/api';

interface ActivityTimelineProps {
  userId: string;
}

interface PointTransaction {
  id: string;
  amount: number;
  reason: string;
  reference_type: string;
  created_at: string;
  metadata?: {
    platform?: string;
    proposal_id?: string;
    content_type?: string;
    [key: string]: any;
  };
}

interface ActivityFilter {
  label: string;
  value: string | null;
}

const FILTERS: ActivityFilter[] = [
  { label: 'All', value: null },
  { label: 'Social', value: 'social' },
  { label: 'Governance', value: 'governance' },
  { label: 'Referrals', value: 'referral' },
  { label: 'Content', value: 'content' },
  { label: 'Login', value: 'login' },
];

function getActivityIcon(type: string, metadata?: any): JSX.Element {
  const iconProps = { className: 'w-4 h-4' };

  switch (type) {
    case 'social_connection':
      const platform = metadata?.platform;
      if (platform === 'twitter') return <Twitter {...iconProps} />;
      if (platform === 'discord') return <MessageCircle {...iconProps} />;
      if (platform === 'github') return <Github {...iconProps} />;
      if (platform === 'telegram') return <Send {...iconProps} />;
      return <User {...iconProps} />;

    case 'governance_vote':
      return <CheckCircle {...iconProps} />;

    case 'referral':
    case 'referral_milestone':
      return <Users {...iconProps} />;

    case 'content_submission':
    case 'content_approved':
      return <FileText {...iconProps} />;

    case 'login_streak':
    case 'daily_login':
      return <LogIn {...iconProps} />;

    default:
      return <Award {...iconProps} />;
  }
}

function getActivityColor(type: string): string {
  switch (type) {
    case 'social_connection':
      return 'bg-blue-500 text-white';
    case 'governance_vote':
      return 'bg-green-500 text-white';
    case 'referral':
    case 'referral_milestone':
      return 'bg-purple-500 text-white';
    case 'content_submission':
    case 'content_approved':
      return 'bg-yellow-500 text-white';
    case 'login_streak':
    case 'daily_login':
      return 'bg-cyan-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

function getActivityDescription(reason: string, metadata?: any): string {
  switch (reason) {
    case 'social_connection':
      const platform = metadata?.platform;
      return `Connected ${platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'social'} account`;

    case 'governance_vote':
      return 'Voted on a proposal';

    case 'referral':
      return 'Referred a new user';

    case 'referral_milestone':
      return 'Reached referral milestone';

    case 'content_submission':
      return 'Submitted content';

    case 'content_approved':
      return 'Content approved';

    case 'login_streak':
      return `Login streak: ${metadata?.streak || 0} days`;

    case 'daily_login':
      return 'Daily login';

    default:
      return reason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}

function matchesFilter(type: string, filter: string | null): boolean {
  if (!filter) return true;

  switch (filter) {
    case 'social':
      return type === 'social_connection';
    case 'governance':
      return type === 'governance_vote';
    case 'referral':
      return type.includes('referral');
    case 'content':
      return type.includes('content');
    case 'login':
      return type.includes('login');
    default:
      return true;
  }
}

export function ActivityTimeline({ userId }: ActivityTimelineProps) {
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const limit = 20;

  useEffect(() => {
    loadActivities(true);
  }, [userId, activeFilter]);

  async function loadActivities(reset: boolean = false) {
    try {
      const currentOffset = reset ? 0 : offset;

      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const data = await api.get<{ transactions: PointTransaction[] }>(
        `/api/client/airdrop/point-history?limit=${limit}&offset=${currentOffset}`
      );

      const newTransactions = data.transactions || [];

      if (reset) {
        setTransactions(newTransactions);
        setOffset(limit);
      } else {
        setTransactions([...transactions, ...newTransactions]);
        setOffset(currentOffset + limit);
      }

      setHasMore(newTransactions.length === limit);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load activities';
      setError(errorMessage);
      console.error('Failed to load activities:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  const handleRetry = () => {
    loadActivities(true);
  };

  const handleLoadMore = () => {
    loadActivities(false);
  };

  const filteredTransactions = transactions.filter(t =>
    matchesFilter(t.reference_type, activeFilter)
  );

  const timelineItems: TimelineItem[] = filteredTransactions.map((transaction) => ({
    id: transaction.id,
    icon: getActivityIcon(transaction.reference_type, transaction.metadata),
    iconColor: getActivityColor(transaction.reference_type),
    title: getActivityDescription(transaction.reason, transaction.metadata),
    timestamp: transaction.created_at,
    metadata: transaction.amount !== 0 ? (
      <Badge
        variant="label"
        size="sm"
        className={
          transaction.amount > 0
            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
        }
      >
        {transaction.amount > 0 ? '+' : ''}{transaction.amount} pts
      </Badge>
    ) : undefined,
  }));

  return (
    <div className="space-y-4" role="region" aria-label="Activity timeline">
      <div className="flex items-center gap-2 flex-wrap" role="toolbar" aria-label="Activity filters">
        {FILTERS.map((filter) => (
          <Button
            key={filter.label}
            variant={activeFilter === filter.value ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveFilter(filter.value)}
            aria-pressed={activeFilter === filter.value}
            className="transition-all duration-200"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {error && (
        <div
          className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 animate-in fade-in duration-300"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-red-400 font-medium mb-2">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRetry}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}

      <Timeline
        items={timelineItems}
        loading={loading || loadingMore}
        onLoadMore={hasMore ? handleLoadMore : undefined}
        hasMore={hasMore}
      />

      {!loading && !error && filteredTransactions.length === 0 && (
        <div className="text-center py-12 text-slate-400 animate-in fade-in duration-300">
          <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No activity yet</p>
          <p className="text-sm mt-2">
            Start earning points by connecting social accounts, voting on proposals, and more!
          </p>
        </div>
      )}
    </div>
  );
}
