import { useState } from 'react';
import { XCircle, Activity } from 'lucide-react';
import { api } from '../../lib/api';
import { Button } from '../../../shared/components/ui/Button';

interface Business {
  id: string;
  business_name: string;
  display_name: string;
  is_active: boolean;
  integration_type: string;
}

interface BusinessManagerProps {
  businesses: Business[];
  onUpdate: () => void;
}

export function BusinessManager({ businesses, onUpdate }: BusinessManagerProps) {
  const [toggling, setToggling] = useState<string | null>(null);

  const toggleBusiness = async (businessName: string, currentState: boolean) => {
    if (!confirm(`Are you sure you want to ${currentState ? 'deactivate' : 'activate'} this business?`)) {
      return;
    }

    try {
      setToggling(businessName);
      await api.post('/admin/u2e/business/toggle', {
        business_name: businessName,
        is_active: !currentState,
      });
      await onUpdate();
    } catch (err) {
      alert('Failed to toggle business');
      console.error(err);
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Integrated Businesses
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage which businesses can earn U2E rewards
        </p>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {businesses.map((business) => (
          <div key={business.id} className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${business.is_active ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                {business.is_active ? (
                  <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {business.display_name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {business.integration_type} • {business.business_name}
                </div>
              </div>
            </div>

            <Button
              onClick={() => toggleBusiness(business.business_name, business.is_active)}
              disabled={toggling === business.business_name}
              variant={business.is_active ? 'secondary' : 'primary'}
              size="sm"
            >
              {toggling === business.business_name
                ? 'Processing...'
                : business.is_active
                ? 'Deactivate'
                : 'Activate'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
