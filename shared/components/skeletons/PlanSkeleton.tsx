interface PlanSkeletonProps {
  theme?: 'light' | 'dark';
}

export function PlanSkeleton({ theme = 'dark' }: PlanSkeletonProps) {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-slate-800' : 'bg-white';
  const borderColor = isDark ? 'border-slate-700' : 'border-gray-200';
  const primarySkeleton = isDark ? 'bg-slate-700' : 'bg-gray-300';
  const secondaryBg = isDark ? 'bg-slate-900/50' : 'bg-gray-50';

  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className={`h-8 w-64 ${primarySkeleton} rounded`} />
          <div className={`h-6 w-32 ${primarySkeleton} rounded-full`} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className={`${cardBg} border ${borderColor} rounded-xl p-8 space-y-4`}>
            <div className={`h-6 w-3/4 ${primarySkeleton} rounded`} />
            <div className={`h-4 w-full ${primarySkeleton} rounded`} />
            <div className={`h-4 w-5/6 ${primarySkeleton} rounded`} />
            <div className={`h-4 w-full ${primarySkeleton} rounded`} />
            <div className={`h-4 w-4/5 ${primarySkeleton} rounded`} />

            <div className="pt-4">
              <div className={`h-6 w-2/3 ${primarySkeleton} rounded`} />
              <div className="mt-2 space-y-2">
                <div className={`h-4 w-full ${primarySkeleton} rounded`} />
                <div className={`h-4 w-full ${primarySkeleton} rounded`} />
                <div className={`h-4 w-3/4 ${primarySkeleton} rounded`} />
              </div>
            </div>

            <div className="pt-4">
              <div className={`h-6 w-1/2 ${primarySkeleton} rounded`} />
              <div className="mt-2 space-y-2">
                <div className={`h-4 w-full ${primarySkeleton} rounded`} />
                <div className={`h-4 w-5/6 ${primarySkeleton} rounded`} />
                <div className={`h-4 w-full ${primarySkeleton} rounded`} />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className={`${cardBg} border ${borderColor} rounded-xl p-6 space-y-4`}>
            <div className={`h-6 w-3/4 ${primarySkeleton} rounded`} />

            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 p-3 ${secondaryBg} rounded-lg`}
              >
                <div className={`h-5 w-5 ${primarySkeleton} rounded shrink-0`} />
                <div className="flex-1 space-y-2">
                  <div className={`h-4 w-full ${primarySkeleton} rounded`} />
                  <div className={`h-3 w-2/3 ${primarySkeleton} rounded`} />
                  <div className={`h-3 w-1/2 ${primarySkeleton} rounded`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
