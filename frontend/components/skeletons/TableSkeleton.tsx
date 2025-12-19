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
