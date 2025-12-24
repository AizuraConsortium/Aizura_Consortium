interface MessageSkeletonProps {
  count?: number;
  theme?: 'light' | 'dark';
}

export function MessageSkeleton({ count = 3, theme = 'dark' }: MessageSkeletonProps) {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-slate-900/50' : 'bg-white';
  const borderColor = isDark ? 'border-slate-700/50' : 'border-gray-200';
  const primarySkeleton = isDark ? 'bg-slate-700' : 'bg-gray-300';
  const secondarySkeleton = isDark ? 'bg-slate-600' : 'bg-gray-200';

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${cardBg} rounded-lg p-4 border ${borderColor} animate-pulse`}
        >
          <div className="flex items-start space-x-3">
            <div className={`w-10 h-10 rounded-full ${primarySkeleton} shrink-0`} />

            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center space-x-2">
                <div className={`h-4 w-24 ${primarySkeleton} rounded`} />
                <div className={`h-3 w-16 ${secondarySkeleton} rounded`} />
                <div className={`h-5 w-20 ${primarySkeleton} rounded`} />
              </div>

              <div className="space-y-2">
                <div className={`h-4 w-3/4 ${secondarySkeleton} rounded`} />
                <div className={`h-3 w-full ${secondarySkeleton} rounded`} />
                <div className={`h-3 w-5/6 ${secondarySkeleton} rounded`} />
                <div className={`h-3 w-4/5 ${secondarySkeleton} rounded`} />
              </div>

              <div className={`h-3 w-16 ${secondarySkeleton} rounded`} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
