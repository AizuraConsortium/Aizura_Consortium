import { useState } from 'react';
import { SubmissionQueue } from '../components/airdrop/SubmissionQueue';
import { UserLookup } from '../components/airdrop/UserLookup';
import { AnalyticsDashboard } from '../components/airdrop/AnalyticsDashboard';
import { FlaggedUsers } from '../components/airdrop/FlaggedUsers';
import { FileText, Users, BarChart3, AlertTriangle } from 'lucide-react';

type TabType = 'submissions' | 'users' | 'analytics' | 'flagged';

export default function AirdropAdmin() {
  const [activeTab, setActiveTab] = useState<TabType>('submissions');

  const tabs = [
    { id: 'submissions', label: 'Content Submissions', icon: FileText },
    { id: 'users', label: 'User Lookup', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'flagged', label: 'Flagged Users', icon: AlertTriangle },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Airdrop Administration</h1>
          <p className="text-slate-400">
            Manage content submissions, review users, and monitor airdrop activity
          </p>
        </div>

        <div className="border-b border-white/10">
          <nav className="flex gap-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`pb-4 px-2 font-medium transition-colors relative flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-blue-400'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          {activeTab === 'submissions' && <SubmissionQueue />}
          {activeTab === 'users' && <UserLookup />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'flagged' && <FlaggedUsers />}
        </div>
      </div>
    </div>
  );
}
