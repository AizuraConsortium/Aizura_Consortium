export function MessageSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 animate-pulse"
        >
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0"></div>

            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-24 bg-slate-700 rounded"></div>
                <div className="h-3 w-16 bg-slate-700 rounded"></div>
                <div className="h-5 w-20 bg-slate-700 rounded"></div>
              </div>

              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-slate-700 rounded"></div>
                <div className="h-3 w-full bg-slate-700 rounded"></div>
                <div className="h-3 w-5/6 bg-slate-700 rounded"></div>
                <div className="h-3 w-4/5 bg-slate-700 rounded"></div>
              </div>

              <div className="h-3 w-16 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
