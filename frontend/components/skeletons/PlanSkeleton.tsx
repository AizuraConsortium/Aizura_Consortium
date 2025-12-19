export function PlanSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-700 rounded"></div>
          <div className="h-6 w-32 bg-slate-700 rounded-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 space-y-4">
            <div className="h-6 w-3/4 bg-slate-700 rounded"></div>
            <div className="h-4 w-full bg-slate-700 rounded"></div>
            <div className="h-4 w-5/6 bg-slate-700 rounded"></div>
            <div className="h-4 w-full bg-slate-700 rounded"></div>
            <div className="h-4 w-4/5 bg-slate-700 rounded"></div>

            <div className="pt-4">
              <div className="h-6 w-2/3 bg-slate-700 rounded"></div>
              <div className="mt-2 space-y-2">
                <div className="h-4 w-full bg-slate-700 rounded"></div>
                <div className="h-4 w-full bg-slate-700 rounded"></div>
                <div className="h-4 w-3/4 bg-slate-700 rounded"></div>
              </div>
            </div>

            <div className="pt-4">
              <div className="h-6 w-1/2 bg-slate-700 rounded"></div>
              <div className="mt-2 space-y-2">
                <div className="h-4 w-full bg-slate-700 rounded"></div>
                <div className="h-4 w-5/6 bg-slate-700 rounded"></div>
                <div className="h-4 w-full bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
            <div className="h-6 w-3/4 bg-slate-700 rounded"></div>

            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-slate-900/50 rounded-lg"
              >
                <div className="h-5 w-5 bg-slate-700 rounded flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full bg-slate-700 rounded"></div>
                  <div className="h-3 w-2/3 bg-slate-700 rounded"></div>
                  <div className="h-3 w-1/2 bg-slate-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
