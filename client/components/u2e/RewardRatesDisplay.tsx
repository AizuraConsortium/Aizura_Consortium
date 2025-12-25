import { useEffect, useState } from 'react';
import { Coins, TrendingUp } from 'lucide-react';
import { api } from '../../lib/api';
import { GetRewardRatesResponse } from '../../../shared/types/u2e';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { ErrorAlert } from '../../../shared/components/ErrorAlert';

export function RewardRatesDisplay() {
  const [data, setData] = useState<GetRewardRatesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<GetRewardRatesResponse>('/client/u2e/rates');
      setData(response);
    } catch (err) {
      setError('Failed to load reward rates');
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
    return <ErrorAlert message={error || 'Failed to load rates'} />;
  }

  const ratesByBusiness = data.rates.reduce((acc, rate) => {
    if (!acc[rate.business_name]) {
      acc[rate.business_name] = {
        display_name: rate.display_name,
        rates: [],
      };
    }
    acc[rate.business_name].rates.push(rate);
    return acc;
  }, {} as Record<string, { display_name: string; rates: typeof data.rates }>);

  return (
    <div className="space-y-6">
      {data.global_multiplier !== 1.0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                Global Multiplier Active
              </h4>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                All rewards are currently multiplied by {data.global_multiplier}x
              </p>
            </div>
          </div>
        </div>
      )}

      {Object.entries(ratesByBusiness).map(([businessName, businessData]) => (
        <div
          key={businessName}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-blue-600" />
              {businessData.display_name}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Base Rate
                  </th>
                  {data.global_multiplier !== 1.0 && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Effective Rate
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {businessData.rates.map((rate, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {rate.action_label}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                      {rate.rate_per_action} AAIC
                    </td>
                    {data.global_multiplier !== 1.0 && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-green-600 dark:text-green-400">
                        {(rate.rate_per_action * data.global_multiplier).toFixed(4)} AAIC
                      </td>
                    )}
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {rate.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Note:</strong> Reward rates are subject to change. All changes are announced
          in advance and tracked with full history. Rates shown are currently active.
        </p>
      </div>
    </div>
  );
}
