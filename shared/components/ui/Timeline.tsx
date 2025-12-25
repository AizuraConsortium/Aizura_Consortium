import { ReactNode } from 'react';
import { cn } from '@shared/styles/theme';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';
import { Button } from './Button';

export interface TimelineItem {
  id: string;
  icon?: ReactNode;
  iconColor?: string;
  title: string;
  description?: string;
  timestamp: string;
  metadata?: ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  className?: string;
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInHours / 24;

  if (diffInHours < 1) {
    const minutes = Math.floor(diffInMs / (1000 * 60));
    return minutes <= 1 ? 'Just now' : `${minutes} minutes ago`;
  }

  if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  if (diffInDays < 2) {
    return 'Yesterday';
  }

  if (diffInDays < 7) {
    return `${Math.floor(diffInDays)} days ago`;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

function groupItemsByDate(items: TimelineItem[]): Map<string, TimelineItem[]> {
  const groups = new Map<string, TimelineItem[]>();

  items.forEach((item) => {
    const date = new Date(item.timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    let groupKey: string;
    if (isToday) {
      groupKey = 'Today';
    } else if (isYesterday) {
      groupKey = 'Yesterday';
    } else {
      groupKey = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }

    const group = groups.get(groupKey) || [];
    group.push(item);
    groups.set(groupKey, group);
  });

  return groups;
}

export function Timeline({
  items,
  loading = false,
  onLoadMore,
  hasMore = false,
  className = '',
}: TimelineProps) {
  const groupedItems = groupItemsByDate(items);

  if (loading && items.length === 0) {
    return (
      <div className={cn('flex items-center justify-center py-8', className)}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={cn('text-center py-8 text-gray-500', className)}>
        <p>No activity yet</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {Array.from(groupedItems.entries()).map(([dateLabel, dateItems]) => (
        <div key={dateLabel}>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            {dateLabel}
          </h3>
          <div className="relative">
            <div
              className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"
              aria-hidden="true"
            />
            <ul className="space-y-4">
              {dateItems.map((item, index) => (
                <li key={item.id} className="relative flex gap-3">
                  <div
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-full ring-4 ring-white dark:ring-gray-900 flex-shrink-0 z-10',
                      item.iconColor || 'bg-blue-500 text-white'
                    )}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {item.description}
                          </p>
                        )}
                        {item.metadata && (
                          <div className="mt-2">
                            {item.metadata}
                          </div>
                        )}
                      </div>
                      <time
                        className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0"
                        dateTime={item.timestamp}
                      >
                        {formatDate(item.timestamp)}
                      </time>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="secondary"
            onClick={onLoadMore}
            loading={loading}
            size="sm"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
