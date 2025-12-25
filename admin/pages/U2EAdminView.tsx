import { useEffect, useState } from 'react';
import { Power, Settings, TrendingUp } from 'lucide-react';
import { api } from '../lib/api';
import { LoadingSpinner } from '../../shared/components/LoadingSpinner';
import { ErrorAlert } from '../../shared/components/ErrorAlert';
import { Button } from '../../shared/components/ui/Button';
import { BusinessManager } from '../components/u2e/BusinessManager';
import { RateEditor } from '../components/u2e/RateEditor';
import { U2EAnalytics } from '../components/u2e/U2EAnalytics';

interface U2EOverview {
  config: {
    is_active: boolean;
    global_multiplier: number;
    min_payout_threshold: number;
  };
  active_users: number;
  businesses: Array<{
    id: string;
    business_name: string;
    display_name: string;
    is_active: boolean;
    integration_type: string;
  }>;
}

export function U2EAdminView() {
  const [overview, setOverview] = useState<U2EOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'businesses' | 'rates'>('analytics');

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<U2EOverview>('/admin/u2e/overview');
      setOverview(data);
    } catch (err) {
      setError('Failed to load U2E overview');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSystem = async () => {
    if (!overview) return;

    const newState = !overview.config.is_active;
    const confirmMessage = newState
      ? 'Are you sure you want to ACTIVATE the U2E system? This will start tracking and calculating rewards for all users.'
      : 'Are you sure you want to DEACTIVATE the U2E system? No new rewards will be calculated while inactive.';

    if (!confirm(confirmMessage)) return;

    try {
      setToggling(true);
      await api.post('/admin/u2e/system/toggle', { is_active: newState });
      await loadOverview();
    } catch (err) {
      alert('Failed to toggle system');
      console.error(err);
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorAlert message={error || 'Failed to load U2E data'} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Settings className="w-8 h-8 text-blue-600" />
              U2E System Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage the Use-to-Earn reward system
            </p>
          </div>

          <Button
            onClick={toggleSystem}
            disabled={toggling}
            variant={overview.config.is_active ? 'secondary' : 'primary'}
            className="flex items-center gap-2"
          >
            <Power className="w-4 h-4" />
            {toggling
              ? 'Processing...'
              : overview.config.is_active
              ? 'Deactivate System'
              : 'Activate System'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              System Status
            </h3>
            <div
              className={`w-3 h-3 rounded-full ${
                overview.config.is_active ? 'bg-green-500' : 'bg-gray-400'
              }`}
            ></div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {overview.config.is_active ? 'Active' : 'Inactive'}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Active Users
          </h3>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {overview.active_users.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Users with U2E activity
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Global Multiplier
          </h3>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {overview.config.global_multiplier}x
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Applied to all rewards
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'analytics'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('businesses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'businesses'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Business Management
            </button>
            <button
              onClick={() => setActiveTab('rates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'rates'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Reward Rates
            </button>
          </nav>
        </div>
      </div>

      <div>
        {activeTab === 'analytics' && <U2EAnalytics />}
        {activeTab === 'businesses' && (
          <BusinessManager businesses={overview.businesses} onUpdate={loadOverview} />
        )}
        {activeTab === 'rates' && <RateEditor />}
      </div>
    </div>
  );
}
