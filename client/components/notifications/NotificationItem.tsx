import { Link } from 'react-router-dom';
import {
  Vote, Briefcase, Trophy, Bell, Shield, TrendingUp,
  Check, Archive, AlertTriangle
} from 'lucide-react';
import type { Notification, NotificationPriority } from '../../../shared/types/notifications';
import { notificationCategoryMap } from '../../../shared/types/notifications';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onArchive: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead, onArchive }: NotificationItemProps) {
  const isUnread = !notification.read_at;
  const category = notificationCategoryMap[notification.type];

  const handleClick = () => {
    if (isUnread) {
      onMarkAsRead(notification.id);
    }
  };

  const icon = getIconForCategory(category);
  const priorityColor = getPriorityColor(notification.priority);

  const timeAgo = getTimeAgo(new Date(notification.created_at));

  return (
    <div
      className={`p-4 hover:bg-slate-700/30 transition-colors ${
        isUnread ? 'bg-slate-700/20' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${priorityColor}`}>
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`text-sm font-medium ${isUnread ? 'text-white' : 'text-slate-300'}`}>
              {notification.title}
            </h4>
            {isUnread && (
              <span className="flex-shrink-0 w-2 h-2 bg-cyan-400 rounded-full"></span>
            )}
          </div>

          <p className="text-sm text-slate-400 mb-2 line-clamp-2">
            {notification.message}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">{timeAgo}</span>
            <div className="flex items-center gap-2">
              {notification.action_url && (
                <Link
                  to={notification.action_url}
                  onClick={handleClick}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  {notification.action_label || 'View'}
                </Link>
              )}
              {isUnread && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                  className="p-1 rounded hover:bg-slate-600 transition-colors"
                  title="Mark as read"
                >
                  <Check className="w-3 h-3 text-slate-400" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(notification.id);
                }}
                className="p-1 rounded hover:bg-slate-600 transition-colors"
                title="Archive"
              >
                <Archive className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getIconForCategory(category: string) {
  const iconMap: Record<string, JSX.Element> = {
    governance: <Vote className="w-5 h-5" />,
    launchpad: <Briefcase className="w-5 h-5" />,
    voting: <Vote className="w-5 h-5" />,
    rewards: <Trophy className="w-5 h-5" />,
    ecosystem: <TrendingUp className="w-5 h-5" />,
    security: <Shield className="w-5 h-5" />,
  };

  return iconMap[category] || <Bell className="w-5 h-5" />;
}

function getPriorityColor(priority: NotificationPriority): string {
  const colorMap: Record<NotificationPriority, string> = {
    critical: 'bg-red-500/20 text-red-400',
    high: 'bg-orange-500/20 text-orange-400',
    medium: 'bg-cyan-500/20 text-cyan-400',
    low: 'bg-slate-500/20 text-slate-400',
  };

  return colorMap[priority] || colorMap.medium;
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  return date.toLocaleDateString();
}
