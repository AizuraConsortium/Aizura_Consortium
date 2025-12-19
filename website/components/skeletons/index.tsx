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

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto animate-pulse">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {Array.from({ length: 7 }).map((_, index) => (
              <th key={index} className="px-6 py-3 text-left">
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="h-4 w-4 bg-gray-200 rounded ml-auto"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
