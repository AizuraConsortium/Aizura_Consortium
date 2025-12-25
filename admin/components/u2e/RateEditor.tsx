import { useEffect, useState } from 'react';
import { Edit2, Save } from 'lucide-react';
import { api } from '../../lib/api';
import { GetRewardRatesResponse } from '../../../shared/types/u2e';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';

export function RateEditor() {
  const [data, setData] = useState<GetRewardRatesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingRate, setEditingRate] = useState<string | null>(null);
  const [newRate, setNewRate] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = async () => {
    try {
      setLoading(true);
      const response = await api.get<GetRewardRatesResponse>('/client/u2e/rates');
      setData(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (rateId: string, currentRate: number) => {
    setEditingRate(rateId);
    setNewRate(currentRate.toString());
    setNotes('');
  };

  const saveRate = async (businessName: string, actionType: string) => {
    try {
      setSaving(true);
      await api.post('/admin/u2e/rates/update', {
        business_name: businessName,
        action_type: actionType,
        new_rate: parseFloat(newRate),
        notes,
      });
      setEditingRate(null);
      await loadRates();
    } catch (err) {
      alert('Failed to update rate');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!data) return <div>Failed to load rates</div>;

  const ratesByBusiness = data.rates.reduce((acc, rate) => {
    if (!acc[rate.business_name]) {
      acc[rate.business_name] = { display_name: rate.display_name, rates: [] };
    }
    acc[rate.business_name].rates.push(rate);
    return acc;
  }, {} as Record<string, { display_name: string; rates: typeof data.rates }>);

  return (
    <div className="space-y-6">
      {Object.entries(ratesByBusiness).map(([businessName, businessData]) => (
        <div key={businessName} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {businessData.display_name}
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {businessData.rates.map((rate) => {
              const rateKey = `${rate.business_name}-${rate.action_type}`;
              const isEditing = editingRate === rateKey;

              return (
                <div key={rateKey} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{rate.action_label}</div>
                    {!isEditing ? (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Current rate: {rate.rate_per_action} AAIC
                      </div>
                    ) : (
                      <div className="mt-2 space-y-2">
                        <Input
                          type="number"
                          step="0.0001"
                          value={newRate}
                          onChange={(e) => setNewRate(e.target.value)}
                          placeholder="New rate"
                          className="max-w-xs"
                        />
                        <Input
                          type="text"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Notes (optional)"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <Button size="sm" onClick={() => startEdit(rateKey, rate.rate_per_action)}>
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    ) : (
                      <>
                        <Button size="sm" variant="secondary" onClick={() => setEditingRate(null)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => saveRate(rate.business_name, rate.action_type)} disabled={saving}>
                          <Save className="w-4 h-4 mr-1" />
                          {saving ? 'Saving...' : 'Save'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
