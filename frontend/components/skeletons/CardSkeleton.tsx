export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6 animate-pulse"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 space-y-3">
              <div className="h-6 w-3/4 bg-slate-700 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-700 rounded"></div>
                <div className="h-4 w-5/6 bg-slate-700 rounded"></div>
                <div className="h-4 w-4/5 bg-slate-700 rounded"></div>
              </div>
            </div>

            <div className="h-8 w-24 bg-slate-700 rounded-full ml-4 flex-shrink-0"></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5 bg-slate-700 rounded"></div>
                <div className="h-4 w-8 bg-slate-700 rounded"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5 bg-slate-700 rounded"></div>
                <div className="h-4 w-8 bg-slate-700 rounded"></div>
              </div>
              <div className="h-4 w-32 bg-slate-700 rounded"></div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="h-10 w-20 bg-slate-700 rounded-lg"></div>
              <div className="h-10 w-24 bg-slate-700 rounded-lg"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
