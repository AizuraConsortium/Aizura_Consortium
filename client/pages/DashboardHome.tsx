import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { UserOverviewCards } from '../components/dashboard/UserOverviewCards';
import { ActiveParticipation } from '../components/dashboard/ActiveParticipation';
import { RewardsPreview } from '../components/dashboard/RewardsPreview';
import { EcosystemFeed } from '../components/dashboard/EcosystemFeed';
import { useAuth } from '../contexts/AuthContext';

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

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

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
      </div>
    </DashboardLayout>
  );
}
