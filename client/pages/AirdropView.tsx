import { useState, useEffect } from 'react';
import { UserStatsHero } from '../components/airdrop/UserStatsHero';
import { PointsBreakdown } from '../components/airdrop/PointsBreakdown';
import { LeaderboardTable } from '../components/airdrop/LeaderboardTable';
import { SocialConnections } from '../components/airdrop/SocialConnections';
import { ReferralCard } from '../components/airdrop/ReferralCard';
import { ContentSubmissionForm } from '../components/airdrop/ContentSubmissionForm';
import { SubmissionHistory } from '../components/airdrop/SubmissionHistory';
import { DailyTasks } from '../components/airdrop/DailyTasks';
import { AirdropEstimate } from '../components/airdrop/AirdropEstimate';
import { ReferralLeaderboard } from '../components/airdrop/ReferralLeaderboard';
import { useAuth } from '../contexts/AuthContext';

export function AirdropView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'tasks' | 'history' | 'referral-leaders'>('overview');
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false);

  useEffect(() => {
    document.title = 'Airdrop - Aizura';
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
          <p className="text-slate-300 mb-6">
            Please sign in to access the airdrop dashboard and start earning AAIC tokens.
          </p>
          <a
            href="/client/auth/sign-in"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">AAIC Token Airdrop</h1>
            <p className="text-slate-400">
              Earn points through social engagement, referrals, and quality content contributions
            </p>
          </div>
          <button
            onClick={() => setIsSubmissionFormOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            Submit Content
          </button>
        </div>

        <UserStatsHero userId={user.id} />

        <div className="border-b border-white/10">
          <nav className="flex gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'overview'
                  ? 'text-blue-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Overview
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'leaderboard'
                  ? 'text-blue-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Leaderboard
              {activeTab === 'leaderboard' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'tasks'
                  ? 'text-blue-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Tasks
              {activeTab === 'tasks' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'history'
                  ? 'text-blue-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              History
              {activeTab === 'history' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('referral-leaders')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'referral-leaders'
                  ? 'text-blue-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Referral Leaders
              {activeTab === 'referral-leaders' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
              )}
            </button>
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <PointsBreakdown userId={user.id} />
              <ReferralCard userId={user.id} />
              <AirdropEstimate userId={user.id} />
            </div>
            <div className="space-y-8">
              <SocialConnections userId={user.id} />
              <DailyTasks userId={user.id} />
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardTable currentUserId={user.id} />
        )}

        {activeTab === 'tasks' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DailyTasks userId={user.id} />
            <SocialConnections userId={user.id} />
          </div>
        )}

        {activeTab === 'history' && (
          <SubmissionHistory userId={user.id} />
        )}

        {activeTab === 'referral-leaders' && (
          <ReferralLeaderboard userId={user.id} />
        )}
      </div>

      {isSubmissionFormOpen && (
        <ContentSubmissionForm
          userId={user.id}
          onClose={() => setIsSubmissionFormOpen(false)}
          onSuccess={() => {
            setIsSubmissionFormOpen(false);
            setActiveTab('history');
          }}
        />
      )}
    </div>
  );
}
