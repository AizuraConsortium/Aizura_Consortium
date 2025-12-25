import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { api } from '../../lib/api';
import { GetBusinessBreakdownResponse, BusinessUsageSummary } from '../../../shared/types/u2e';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { ErrorAlert } from '../../../shared/components/ErrorAlert';

export function BusinessBreakdownTable() {
  const [data, setData] = useState<GetBusinessBreakdownResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedBusiness, setExpandedBusiness] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<GetBusinessBreakdownResponse>('/client/u2e/breakdown');
      setData(response);
    } catch (err) {
      setError('Failed to load business breakdown');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !data) {
    return <ErrorAlert message={error || 'Failed to load data'} />;
  }

  if (data.businesses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No usage data yet. Start using AAIC ecosystem platforms to earn rewards!
        </p>
      </div>
    );
  }

  const toggleBusiness = (businessId: string) => {
    setExpandedBusiness(expandedBusiness === businessId ? null : businessId);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Rewards by Platform
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Total: {data.total_rewards.toFixed(2)} AAIC
        </p>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {data.businesses.map((business) => (
          <div key={business.business_id}>
            <button
              onClick={() => toggleBusiness(business.business_id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {expandedBusiness === business.business_id ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {business.display_name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {business.total_usage.toLocaleString()} actions
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {business.total_rewards.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  AAIC earned
                </div>
              </div>
            </button>

            {expandedBusiness === business.business_id && (
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
                      <th className="pb-2">Action Type</th>
                      <th className="pb-2 text-right">Count</th>
                      <th className="pb-2 text-right">Rewards</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {business.actions.map((action, idx) => (
                      <tr
                        key={idx}
                        className="border-t border-gray-200 dark:border-gray-700"
                      >
                        <td className="py-2 text-gray-900 dark:text-white">
                          {action.action_label}
                        </td>
                        <td className="py-2 text-right text-gray-600 dark:text-gray-400">
                          {action.count.toLocaleString()}
                        </td>
                        <td className="py-2 text-right font-medium text-gray-900 dark:text-white">
                          {action.rewards.toFixed(4)} AAIC
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
