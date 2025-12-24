import { useState, useEffect } from 'react';
import { Check, Bell, Mail, Smartphone } from 'lucide-react';
import type { NotificationPreference, NotificationCategory } from '../../../shared/types/notifications';
import { categoryLabels } from '../../../shared/types/notifications';

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await fetch('/api/client/notification-preferences', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (
    category: NotificationCategory,
    field: 'in_app_enabled' | 'email_enabled' | 'push_enabled',
    value: boolean
  ) => {
    setSaving(category);
    try {
      const response = await fetch(`/api/client/notification-preferences/${category}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });

      if (response.ok) {
        setPreferences((prev) =>
          prev.map((pref) =>
            pref.category === category ? { ...pref, [field]: value } : pref
          )
        );
      }
    } catch (error) {
      console.error('Error updating preference:', error);
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const getCategoryDescription = (category: NotificationCategory): string => {
    const descriptions: Record<NotificationCategory, string> = {
      governance: 'Updates about governance proposals, votes, and decisions',
      launchpad: 'Status changes for proposals you submitted or are tracking',
      voting: 'Confirmations and outcomes of your votes',
      rewards: 'Reward distributions, claims, and vesting milestones',
      ecosystem: 'New businesses, milestones, and major announcements',
      security: 'Critical security alerts and platform updates (cannot be disabled)',
    };
    return descriptions[category];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Notification Preferences</h2>
        <p className="text-slate-400">
          Choose how you want to receive notifications. Security notifications cannot be disabled.
        </p>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left p-4 font-semibold text-slate-300">Category</th>
                <th className="text-center p-4 font-semibold text-slate-300">
                  <div className="flex items-center justify-center gap-2">
                    <Bell className="w-4 h-4" />
                    <span className="hidden sm:inline">In-App</span>
                  </div>
                </th>
                <th className="text-center p-4 font-semibold text-slate-300">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="hidden sm:inline">Email</span>
                  </div>
                </th>
                <th className="text-center p-4 font-semibold text-slate-300">
                  <div className="flex items-center justify-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <span className="hidden sm:inline">Push</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {preferences.map((pref) => {
                const isSecurityCategory = pref.category === 'security';
                const isSaving = saving === pref.category;

                return (
                  <tr key={pref.category} className="border-b border-slate-700 last:border-0">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-white mb-1">
                          {categoryLabels[pref.category as NotificationCategory]}
                        </div>
                        <div className="text-sm text-slate-400">
                          {getCategoryDescription(pref.category as NotificationCategory)}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <ToggleSwitch
                        enabled={pref.in_app_enabled}
                        onChange={(value) =>
                          updatePreference(pref.category as NotificationCategory, 'in_app_enabled', value)
                        }
                        disabled={isSecurityCategory || isSaving}
                      />
                    </td>
                    <td className="p-4 text-center">
                      <ToggleSwitch
                        enabled={pref.email_enabled}
                        onChange={(value) =>
                          updatePreference(pref.category as NotificationCategory, 'email_enabled', value)
                        }
                        disabled={isSecurityCategory || isSaving}
                      />
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center">
                        <span className="text-xs text-slate-500">Coming Soon</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-white mb-1">Important Notes</h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>Security notifications are always enabled for your protection</li>
              <li>Email notifications are sent to your registered email address</li>
              <li>Push notifications will be available in a future update</li>
              <li>Changes take effect immediately</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

function ToggleSwitch({ enabled, onChange, disabled }: ToggleSwitchProps) {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${enabled ? 'bg-cyan-600' : 'bg-slate-600'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}
      `}
      role="switch"
      aria-checked={enabled}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${enabled ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
}
