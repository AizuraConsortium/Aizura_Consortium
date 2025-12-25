export function ProfileHeaderSkeleton() {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 animate-pulse">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-shrink-0">
          <div className="w-32 h-32 bg-slate-700/50 rounded-full" />
        </div>

        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="h-9 w-48 bg-slate-700/50 rounded-lg" />
              <div className="h-5 w-full max-w-2xl bg-slate-700/50 rounded-lg" />
              <div className="h-5 w-3/4 bg-slate-700/50 rounded-lg" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-4">
              <div className="h-6 w-32 bg-slate-700/50 rounded-lg" />
              <div className="h-6 w-32 bg-slate-700/50 rounded-lg" />
            </div>
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-24 bg-slate-700/50 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BadgeCollectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-7 w-32 bg-slate-700/50 rounded-lg animate-pulse" />
        <div className="h-5 w-24 bg-slate-700/50 rounded-lg animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl border bg-slate-900/30 border-slate-800/50 animate-pulse"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-800/50" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 bg-slate-800/50 rounded" />
                <div className="h-4 w-full bg-slate-800/50 rounded" />
                <div className="h-4 w-3/4 bg-slate-800/50 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActivityTimelineSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 w-20 bg-slate-700/50 rounded-lg animate-pulse" />
        ))}
      </div>

      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-slate-700/50 animate-pulse" />
              {i < 5 && <div className="w-0.5 flex-1 bg-slate-700/30 mt-2" />}
            </div>
            <div className="flex-1 pb-6 space-y-2">
              <div className="h-5 w-48 bg-slate-700/50 rounded animate-pulse" />
              <div className="h-4 w-32 bg-slate-700/50 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
