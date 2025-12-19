interface ListSkeletonProps {
  items?: number;
  hasAvatar?: boolean;
  hasActions?: boolean;
  theme?: 'light' | 'dark';
}

export function ListSkeleton({ items = 5, hasAvatar = false, hasActions = false, theme = 'light' }: ListSkeletonProps) {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-slate-800' : 'bg-white';
  const borderColor = isDark ? 'border-slate-700' : 'border-gray-200';
  const primarySkeleton = isDark ? 'bg-slate-700' : 'bg-gray-300';
  const secondarySkeleton = isDark ? 'bg-slate-800' : 'bg-gray-200';

  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          className={`flex items-center space-x-4 p-4 ${cardBg} border ${borderColor} rounded-lg`}
        >
          {hasAvatar && (
            <div className="flex-shrink-0">
              <div className={`h-12 w-12 ${primarySkeleton} rounded-full`} />
            </div>
          )}

          <div className="flex-1 space-y-2">
            <div className={`h-4 ${primarySkeleton} rounded w-1/3`} />
            <div className={`h-3 ${secondarySkeleton} rounded w-2/3`} />
          </div>

          {hasActions && (
            <div className="flex-shrink-0 flex space-x-2">
              <div className={`h-8 w-8 ${primarySkeleton} rounded`} />
              <div className={`h-8 w-8 ${primarySkeleton} rounded`} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
