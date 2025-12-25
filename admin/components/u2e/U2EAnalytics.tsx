import { BarChart3, Users, DollarSign, Activity } from 'lucide-react';

export function U2EAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Users
            </h3>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">-</div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Users with U2E activity
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Rewards
            </h3>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">- AAIC</div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            All-time distributed
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Actions
            </h3>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">-</div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Tracked events
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Avg per User
            </h3>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">- AAIC</div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Average rewards earned
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Analytics Dashboard
        </h3>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Detailed analytics charts will be available here</p>
          <p className="text-sm mt-2">Growth trends, business performance, and user engagement metrics</p>
        </div>
      </div>
    </div>
  );
}
