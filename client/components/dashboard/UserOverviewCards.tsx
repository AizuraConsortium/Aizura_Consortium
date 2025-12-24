import { Coins, Vote, CheckCircle, Award, Briefcase } from 'lucide-react';

interface UserOverviewCardsProps {
  tokenBalance: string;
  votingPower: string;
  activeVotes: number;
  rewardsEarned: string;
  portfolioCount: number;
}

export function UserOverviewCards({
  tokenBalance,
  votingPower,
  activeVotes,
  rewardsEarned,
  portfolioCount
}: UserOverviewCardsProps) {
  const cards = [
    {
      label: 'Token Balance',
      value: tokenBalance,
      subtext: 'AAIC',
      icon: Coins,
      color: 'cyan'
    },
    {
      label: 'Voting Power',
      value: votingPower,
      subtext: '% of circulating',
      icon: Vote,
      color: 'blue'
    },
    {
      label: 'Active Votes',
      value: activeVotes.toString(),
      subtext: 'Proposals',
      icon: CheckCircle,
      color: 'green'
    },
    {
      label: 'Rewards Earned',
      value: rewardsEarned,
      subtext: 'Lifetime',
      icon: Award,
      color: 'yellow'
    },
    {
      label: 'Portfolio Exposure',
      value: portfolioCount.toString(),
      subtext: 'Businesses',
      icon: Briefcase,
      color: 'purple'
    }
  ];

  const colorMap = {
    cyan: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/30 text-cyan-400',
    blue: 'from-blue-500/10 to-cyan-500/10 border-blue-500/30 text-blue-400',
    green: 'from-green-500/10 to-cyan-500/10 border-green-500/30 text-green-400',
    yellow: 'from-yellow-500/10 to-orange-500/10 border-yellow-500/30 text-yellow-400',
    purple: 'from-purple-500/10 to-blue-500/10 border-purple-500/30 text-purple-400'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-gradient-to-br ${colorMap[card.color as keyof typeof colorMap]} border rounded-xl p-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <card.icon className="w-8 h-8" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{card.value}</div>
          <div className="text-sm text-slate-400">{card.subtext}</div>
          <div className="text-xs text-slate-500 mt-2">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
