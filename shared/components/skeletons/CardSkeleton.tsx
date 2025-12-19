interface CardSkeletonProps {
  count?: number;
  hasImage?: boolean;
  theme?: 'light' | 'dark';
}

export function CardSkeleton({ count = 1, hasImage = false, theme = 'light' }: CardSkeletonProps) {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-slate-800' : 'bg-white';
  const borderColor = isDark ? 'border-slate-700' : 'border-gray-200';
  const primarySkeleton = isDark ? 'bg-slate-700' : 'bg-gray-300';
  const secondarySkeleton = isDark ? 'bg-slate-800' : 'bg-gray-200';

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${cardBg} border ${borderColor} rounded-lg p-6 animate-pulse`}
        >
          {hasImage && (
            <div className={`w-full h-48 ${primarySkeleton} rounded-lg mb-4`} />
          )}

          <div className="space-y-3">
            <div className={`h-6 ${primarySkeleton} rounded w-3/4`} />

            <div className="space-y-2">
              <div className={`h-4 ${secondarySkeleton} rounded w-full`} />
              <div className={`h-4 ${secondarySkeleton} rounded w-5/6`} />
              <div className={`h-4 ${secondarySkeleton} rounded w-4/6`} />
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <div className={`h-8 ${primarySkeleton} rounded w-20`} />
              <div className={`h-8 ${secondarySkeleton} rounded w-24`} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
