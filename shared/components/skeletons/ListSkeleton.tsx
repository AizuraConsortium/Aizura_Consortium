interface ListSkeletonProps {
  items?: number;
  hasAvatar?: boolean;
  hasActions?: boolean;
}

export function ListSkeleton({ items = 5, hasAvatar = false, hasActions = false }: ListSkeletonProps) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg"
        >
          {hasAvatar && (
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-gray-300 rounded-full" />
            </div>
          )}

          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>

          {hasActions && (
            <div className="flex-shrink-0 flex space-x-2">
              <div className="h-8 w-8 bg-gray-300 rounded" />
              <div className="h-8 w-8 bg-gray-300 rounded" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
