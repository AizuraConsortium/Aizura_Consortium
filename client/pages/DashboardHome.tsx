import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { UserOverviewCards } from '../components/dashboard/UserOverviewCards';
import { ActiveParticipation } from '../components/dashboard/ActiveParticipation';
import { RewardsPreview } from '../components/dashboard/RewardsPreview';
import { EcosystemFeed } from '../components/dashboard/EcosystemFeed';
import { NewsFeed } from '../components/dashboard/NewsFeed';
import { useAuth } from '../contexts/AuthContext';
import { Gift, Trophy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

export default function DashboardHome() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({
    tokenBalance: '0',
    votingPower: '0',
    activeVotes: 0,
    rewardsEarned: '0',
    portfolioCount: 0
  });

  const [activeParticipation, setActiveParticipation] = useState<any[]>([]);
  const [rewards, setRewards] = useState({
    pending: '0',
    claimable: '0',
    lastDistribution: 'N/A'
  });
  const [ecosystemFeed, setEcosystemFeed] = useState<any[]>([]);
  const [airdropStats, setAirdropStats] = useState<{
    totalPoints: number;
    rank: number;
    totalUsers: number;
  } | null>(null);

  useEffect(() => {
    fetchDashboardData();
    fetchAirdropStats();
  }, [user]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchDashboardData();
        fetchAirdropStats();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchAirdropStats = async () => {
    try {
      const response = await api.get('/client/airdrop/stats');
      if (response.ok) {
        const data = await response.json();
        setAirdropStats({
          totalPoints: data.totalPoints || 0,
          rank: data.rank || 0,
          totalUsers: data.totalUsers || 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch airdrop stats:', error);
    }
  };

  const fetchDashboardData = async () => {
    setUserStats({
      tokenBalance: '125,450',
      votingPower: '0.12',
      activeVotes: 3,
      rewardsEarned: '8,230',
      portfolioCount: 4
    });

    setActiveParticipation([
      {
        id: '1',
        title: 'AI Trading Bot for DeFi Markets',
        type: 'voted',
        status: 'active',
        timeRemaining: '5 days',
        votesFor: 67,
        votesAgainst: 33
      },
      {
        id: '2',
        title: 'Automated Content Generation Platform',
        type: 'submitted',
        status: 'pending',
        timeRemaining: '12 days',
        votesFor: 45,
        votesAgainst: 55
      },
      {
        id: '3',
        title: 'Update Revenue Distribution Parameters',
        type: 'governance',
        status: 'active',
        timeRemaining: '3 days',
        votesFor: 78,
        votesAgainst: 22
      }
    ]);

    setRewards({
      pending: '1,245',
      claimable: '523',
      lastDistribution: '7'
    });

    setEcosystemFeed([
      {
        id: '1',
        type: 'proposal',
        title: 'AI Web Dev Platform approved with 85% votes',
        timestamp: '2 hours ago'
      },
      {
        id: '2',
        type: 'business',
        title: 'AI Traders launched and generating revenue',
        timestamp: '5 hours ago'
      },
      {
        id: '3',
        type: 'governance',
        title: 'Treasury allocation vote completed',
        timestamp: '1 day ago'
      },
      {
        id: '4',
        type: 'proposal',
        title: 'New proposal: Blockchain Analytics Dashboard',
        timestamp: '1 day ago'
      },
      {
        id: '5',
        type: 'business',
        title: 'Coinfusion reached 10,000 users milestone',
        timestamp: '2 days ago'
      }
    ]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Welcome back, {user?.email || 'User'}</p>
        </div>

        <UserOverviewCards
          tokenBalance={userStats.tokenBalance}
          votingPower={userStats.votingPower}
          activeVotes={userStats.activeVotes}
          rewardsEarned={userStats.rewardsEarned}
          portfolioCount={userStats.portfolioCount}
        />

        {airdropStats && (
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Gift className="w-6 h-6 text-green-400" />
                  <h2 className="text-xl font-bold text-white">AAIC Token Airdrop</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Your Points</p>
                    <p className="text-2xl font-bold text-white">
                      {airdropStats.totalPoints.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Your Rank</p>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <p className="text-2xl font-bold text-white">
                        #{airdropStats.rank.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Total Participants</p>
                    <p className="text-2xl font-bold text-white">
                      {airdropStats.totalUsers.toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-4">
                  Earn points through social engagement, referrals, and quality content submissions to maximize your airdrop allocation.
                </p>
                <Link
                  to="/app/airdrop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  View Airdrop Details
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold text-white mb-4">Active Participation</h2>
          <ActiveParticipation items={activeParticipation} />
        </div>

        <RewardsPreview
          pending={rewards.pending}
          claimable={rewards.claimable}
          lastDistribution={rewards.lastDistribution}
        />

        <EcosystemFeed items={ecosystemFeed} />

        <NewsFeed limit={5} />
      </div>
    </DashboardLayout>
  );
}
