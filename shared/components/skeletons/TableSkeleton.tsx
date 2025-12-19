interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  theme?: 'light' | 'dark';
}

export function TableSkeleton({ rows = 5, columns = 4, theme = 'light' }: TableSkeletonProps) {
  const isDark = theme === 'dark';
  const borderColor = isDark ? 'border-slate-700' : 'border-gray-200';
  const headerBg = isDark ? 'bg-slate-800' : 'bg-gray-50';
  const divideColor = isDark ? 'divide-slate-700' : 'divide-gray-200';
  const primarySkeleton = isDark ? 'bg-slate-700' : 'bg-gray-300';
  const secondarySkeleton = isDark ? 'bg-slate-800' : 'bg-gray-200';

  return (
    <div className="w-full animate-pulse">
      <div className={`overflow-hidden border ${borderColor} rounded-lg`}>
        <div className={`${headerBg} border-b ${borderColor}`}>
          <div className="flex items-center space-x-4 px-6 py-3">
            {Array.from({ length: columns }).map((_, i) => (
              <div
                key={i}
                className={`h-4 ${primarySkeleton} rounded`}
                style={{ width: `${100 / columns}%` }}
              />
            ))}
          </div>
        </div>

        <div className={`divide-y ${divideColor}`}>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex items-center space-x-4 px-6 py-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className={`h-4 ${secondarySkeleton} rounded`}
                  style={{ width: `${100 / columns}%` }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
