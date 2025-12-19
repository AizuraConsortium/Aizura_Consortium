interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="w-full animate-pulse">
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-4 px-6 py-3">
            {Array.from({ length: columns }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-300 rounded"
                style={{ width: `${100 / columns}%` }}
              />
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex items-center space-x-4 px-6 py-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="h-4 bg-gray-200 rounded"
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
