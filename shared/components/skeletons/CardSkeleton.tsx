interface CardSkeletonProps {
  count?: number;
  hasImage?: boolean;
}

export function CardSkeleton({ count = 1, hasImage = false }: CardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse"
        >
          {hasImage && (
            <div className="w-full h-48 bg-gray-300 rounded-lg mb-4" />
          )}

          <div className="space-y-3">
            <div className="h-6 bg-gray-300 rounded w-3/4" />

            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <div className="h-8 bg-gray-300 rounded w-20" />
              <div className="h-8 bg-gray-200 rounded w-24" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
