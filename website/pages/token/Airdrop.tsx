import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Award, Users, Vote, TrendingUp, Shield, CheckCircle2,
  Clock, Target, Zap, Lock, Unlock, AlertTriangle, BarChart3,
  ArrowRight, ExternalLink, Gift, Activity, Calendar, Info,
  FileText, Lightbulb, Trophy, Eye, Ban, Wallet, Share2, Flame,
  Star, Medal, Crown
} from 'lucide-react';

type PhaseStatus = 'active' | 'upcoming' | 'completed';

interface AirdropPhase {
  number: number;
  title: string;
  status: PhaseStatus;
  description: string;
  eligibleActions: string[];
  distributionLogic?: string;
  notes: string[];
}

const AIRDROP_PHASES: AirdropPhase[] = [
  {
    number: 1,
    title: 'Early Ecosystem Participants',
    status: 'active',
    description: 'Rewards for early platform users and contributors who helped shape the ecosystem before public launch',
    eligibleActions: [
      'Early platform users who tested core features',
      'Early governance participants',
      'Testers of live portfolio products (AI Traders, AI Web Dev)',
      'Contributors during pre-public phase'
    ],
    notes: [
      'Snapshot-based allocation',
      'One-time claim window',
      'Higher weighting for quality contributions'
    ]
  },
  {
    number: 2,
    title: 'Governance & Launchpad Participation',
    status: 'active',
    description: 'Ongoing rewards for active governance participants who vote, propose, and engage consistently',
    eligibleActions: [
      'Voting on proposals (weighted by consistency)',
      'Submitting quality proposals',
      'Participating in governance discussions',
      'Long-term engagement (not one-off actions)'
    ],
    distributionLogic: 'Weighted by participation quality and consistency. Regular voters earn more than one-time voters.',
    notes: [
      'Ongoing allocation',
      'Rewards consistent participation',
      'Anti-gaming mechanisms in place'
    ]
  },
  {
    number: 3,
    title: 'Ecosystem Usage',
    status: 'upcoming',
    description: 'Rewards for users who actively use AI-managed products and contribute to ecosystem growth',
    eligibleActions: [
      'Using AI-managed products from the portfolio',
      'Paying fees within the ecosystem',
      'Providing valuable feedback and data',
      'Contributing to product improvement'
    ],
    distributionLogic: 'Gradual and sustainable. Rewards genuine usage patterns, not gaming attempts.',
    notes: [
      'Rolling allocation',
      'Long-term sustainable model',
      'Usage verified on-chain where possible'
    ]
  },
  {
    number: 4,
    title: 'Special Community Allocations',
    status: 'upcoming',
    description: 'Strategic allocations for builders, researchers, partners, and special community programs',
    eligibleActions: [
      'Strategic community partnerships',
      'Developer and researcher grants',
      'Educational content creators',
      'Ecosystem ambassadors'
    ],
    notes: [
      'Announced progressively',
      'Disclosed transparently before activation',
      'Subject to governance approval'
    ]
  }
];

const MOCK_TRANSPARENCY_DATA = {
  totalAirdropAllocation: 3000000000,
  distributedSoFar: 450000000,
  remainingTokens: 2550000000,
  eligibleWallets: 12847,
  nextSnapshotDate: 'Jan 15, 2026',
  totalParticipants: 5284,
  tier1SpotsRemaining: 127,
  snapshotDays: 42
};

const LEADERBOARD_DATA = [
  { rank: 1, address: '0x1234...5678', score: 9850, tier: 'Diamond', multiplier: '3.2x', badge: '👑' },
  { rank: 2, address: '0xabcd...efgh', score: 8920, tier: 'Platinum', multiplier: '2.8x', badge: '💎' },
  { rank: 3, address: '0x9876...5432', score: 7845, tier: 'Platinum', multiplier: '2.5x', badge: '💎' },
  { rank: 4, address: '0xfedc...ba98', score: 6720, tier: 'Gold', multiplier: '2.2x', badge: '🏆' },
  { rank: 5, address: '0x5555...6666', score: 5890, tier: 'Gold', multiplier: '2.0x', badge: '🏆' },
  { rank: 6, address: '0x3333...4444', score: 4950, tier: 'Silver', multiplier: '1.7x', badge: '🥈' },
  { rank: 7, address: '0x7777...8888', score: 4120, tier: 'Silver', multiplier: '1.5x', badge: '🥈' },
  { rank: 8, address: '0x2222...3333', score: 3580, tier: 'Bronze', multiplier: '1.3x', badge: '🥉' },
  { rank: 9, address: '0x4444...5555', score: 2940, tier: 'Bronze', multiplier: '1.2x', badge: '🥉' },
  { rank: 10, address: '0x6666...7777', score: 2150, tier: 'Bronze', multiplier: '1.1x', badge: '🥉' },
];

const FAQ_ITEMS = [
  {
    question: 'Is there a token sale?',
    answer: 'No. AAIC has no public or private token sale. All distribution is through the airdrop for participants.'
  },
  {
    question: 'Do I need to buy tokens?',
    answer: 'No. Tokens are earned through ecosystem participation—voting, proposing, using products, and contributing.'
  },
  {
    question: 'Can eligibility rules change?',
    answer: 'Yes, through governance. However, retroactive changes are not allowed—your earned rewards are protected.'
  },
  {
    question: 'When can I claim?',
    answer: 'Claim windows open progressively by phase. Connect your wallet to check your eligibility and claim status.'
  },
  {
    question: 'Are there risks?',
    answer: 'Airdrop tokens may be subject to vesting. Check vesting details before claiming. Market risks apply to all crypto.'
  }
];

function useCountdown(days: number) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [days]);

  return timeLeft;
}

export default function Airdrop() {
  const [isWalletConnected] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<number>(1);
  const countdown = useCountdown(MOCK_TRANSPARENCY_DATA.snapshotDays);

  return (
    <PageLayout>
      <div className="space-y-16">
        <section className="relative overflow-hidden bg-gradient-to-br from-cyan-900/20 via-blue-900/20 to-slate-900/20 border-2 border-cyan-500/30 rounded-3xl p-12 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-400/50 rounded-full text-cyan-300 text-sm font-medium mb-6">
              <Ban className="w-4 h-4" />
              NO TOKEN SALE
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              No token sale.
              <br />
              Only an airdrop for participants.
            </h1>

            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              AAIC tokens are distributed to users who engage with the ecosystem—proposing ideas, voting, contributing, and helping it grow.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {isWalletConnected ? (
                <button className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors inline-flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  View Your Eligibility
                </button>
              ) : (
                <button className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors inline-flex items-center justify-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Connect Wallet to Check Eligibility
                </button>
              )}
              <a
                href="#how-it-works"
                className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
              >
                How the Airdrop Works
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            <p className="text-sm text-cyan-300 font-medium">
              <Shield className="w-4 h-4 inline mr-2" />
              Designed for long-term alignment, not short-term hype
            </p>
          </div>
        </section>

        <section className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-2xl p-8">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame className="w-6 h-6 text-orange-400" />
                <div className="text-4xl font-bold text-white">{MOCK_TRANSPARENCY_DATA.totalParticipants.toLocaleString()}</div>
              </div>
              <p className="text-sm text-slate-300">Participants already qualified and growing rapidly!</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                <div className="text-4xl font-bold text-yellow-400">{MOCK_TRANSPARENCY_DATA.tier1SpotsRemaining}</div>
              </div>
              <p className="text-sm text-slate-300">Tier 1 allocation spots remaining</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-6 h-6 text-cyan-400" />
                <div className="text-4xl font-bold text-cyan-400">{countdown.days}d {countdown.hours}h</div>
              </div>
              <p className="text-sm text-slate-300">Until next snapshot - Time is running out!</p>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Clock className="w-8 h-8 text-cyan-400" />
              <h3 className="text-2xl font-bold text-white">Snapshot Countdown</h3>
            </div>

            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-1">{countdown.days}</div>
                <div className="text-sm text-slate-400">Days</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-1">{countdown.hours}</div>
                <div className="text-sm text-slate-400">Hours</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-1">{countdown.minutes}</div>
                <div className="text-sm text-slate-400">Minutes</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-1">{countdown.seconds}</div>
                <div className="text-sm text-slate-400">Seconds</div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-slate-300 mb-4">
                Check your eligibility now before the next snapshot! Every action counts toward your allocation.
              </p>
              <button className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors inline-flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Check Eligibility Before It's Too Late
              </button>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <h2 className="text-3xl font-bold text-white">Qualification Leaderboard</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm text-slate-400">Live Rankings</span>
            </div>
          </div>

          <p className="text-slate-300 mb-6">
            Top participants earn higher multipliers and tier upgrades. Your ranking is based on participation quality,
            consistency, and contribution value.
          </p>

          <div className="bg-slate-900/50 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400">Rank</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400">Address</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-slate-400">Score</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-slate-400">Tier</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-slate-400">Multiplier</th>
                </tr>
              </thead>
              <tbody>
                {LEADERBOARD_DATA.map((entry) => (
                  <tr key={entry.rank} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{entry.badge}</span>
                        <span className="text-white font-bold">#{entry.rank}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <code className="text-cyan-400 font-mono text-sm">{entry.address}</code>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-white font-semibold">{entry.score.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        entry.tier === 'Diamond' ? 'bg-purple-500/20 text-purple-400' :
                        entry.tier === 'Platinum' ? 'bg-blue-500/20 text-blue-400' :
                        entry.tier === 'Gold' ? 'bg-yellow-500/20 text-yellow-400' :
                        entry.tier === 'Silver' ? 'bg-slate-500/20 text-slate-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {entry.tier}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-green-400 font-bold">{entry.multiplier}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-center">
            <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2">
              <Eye className="w-4 h-4" />
              View Full Leaderboard (1,000+ Entries)
            </button>
          </div>
        </section>

        <section className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/30 rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-400/50 rounded-full text-cyan-300 text-sm font-medium mb-4">
              <Share2 className="w-4 h-4" />
              BOOST YOUR ALLOCATION
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
              Share to Earn: Referral Multipliers
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Invite friends to participate and earn bonus allocation multipliers. The more qualified users you refer,
              the higher your rewards!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-900/50 rounded-xl p-6 text-center">
              <Medal className="w-12 h-12 text-orange-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-2">+5%</div>
              <div className="text-sm text-slate-400 mb-3">Per Qualified Referral</div>
              <p className="text-xs text-slate-500">Your friend must complete at least 3 actions to qualify</p>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6 text-center ring-2 ring-cyan-500">
              <Star className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-cyan-400 mb-2">+50%</div>
              <div className="text-sm text-slate-400 mb-3">At 10 Qualified Referrals</div>
              <p className="text-xs text-slate-500">Unlock mega multiplier bonus tier</p>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6 text-center">
              <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-yellow-400 mb-2">+2% Lifetime</div>
              <div className="text-sm text-slate-400 mb-3">Of Referee's Staking Rewards</div>
              <p className="text-xs text-slate-500">Earn passive income from your referrals forever</p>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4 text-center">Your Referral Link</h3>
            <div className="flex gap-3">
              <input
                type="text"
                readOnly
                value="https://aizura.com/ref/0x1234...5678"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 font-mono text-sm"
              />
              <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Copy & Share
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">12</div>
                <div className="text-xs text-slate-400">Total Referrals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">8</div>
                <div className="text-xs text-slate-400">Qualified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400 mb-1">+40%</div>
                <div className="text-xs text-slate-400">Your Bonus</div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-slate-400">
            Referrals must connect wallet and complete genuine participation to qualify. Gaming attempts will be detected and penalized.
          </div>
        </section>

        <section id="why-airdrop" className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why an airdrop instead of a token sale?
            </h2>
            <p className="text-lg text-slate-300">
              This distribution model aligns incentives and rewards real participation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <ReasonCard
              icon={<Users className="w-8 h-8 text-cyan-400" />}
              title="Rewards Real Usage"
              description="Tokens go to those who participate in governance, propose ideas, and use the ecosystem—not speculators."
            />
            <ReasonCard
              icon={<Shield className="w-8 h-8 text-green-400" />}
              title="Avoids VC Dominance"
              description="No private sales or insider allocations. Distribution is transparent and community-focused."
            />
            <ReasonCard
              icon={<Vote className="w-8 h-8 text-blue-400" />}
              title="Distributes Voting Power"
              description="Governance power spreads broadly across active participants, not concentrated in a few hands."
            />
            <ReasonCard
              icon={<TrendingUp className="w-8 h-8 text-yellow-400" />}
              title="Aligns Incentives"
              description="Long-term success benefits those who helped build the ecosystem, creating sustainable growth."
            />
          </div>

          <div className="mt-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 text-center">
            <p className="text-lg font-bold text-cyan-300">
              "Those who help build the ecosystem, own it."
            </p>
          </div>
        </section>

        <section id="how-it-works" className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Airdrop Distribution Phases
            </h2>
            <p className="text-lg text-slate-300">
              Multi-phase distribution over time, rewarding different types of participation
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              {AIRDROP_PHASES.map((phase) => (
                <PhaseSelector
                  key={phase.number}
                  phase={phase}
                  isSelected={selectedPhase === phase.number}
                  onClick={() => setSelectedPhase(phase.number)}
                />
              ))}
            </div>

            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
              <PhaseDetail phase={AIRDROP_PHASES[selectedPhase - 1]} />
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-slate-300">
                  <strong className="text-white">Special allocations are disclosed transparently when activated.</strong>
                  {' '}All phase 4 allocations will be announced publicly and subject to governance review before distribution.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Who is eligible?
            </h2>
            <p className="text-lg text-slate-300">
              Clear criteria to prevent confusion and set proper expectations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                Eligibility Depends On
              </h3>
              <ul className="space-y-3">
                <EligibilityItem
                  icon={<Activity className="w-4 h-4 text-cyan-400" />}
                  text="Wallet activity within the ecosystem"
                />
                <EligibilityItem
                  icon={<Vote className="w-4 h-4 text-cyan-400" />}
                  text="Governance participation (voting, proposing)"
                />
                <EligibilityItem
                  icon={<Target className="w-4 h-4 text-cyan-400" />}
                  text="Launchpad usage and engagement"
                />
                <EligibilityItem
                  icon={<Zap className="w-4 h-4 text-cyan-400" />}
                  text="Product usage within the portfolio"
                />
                <EligibilityItem
                  icon={<Trophy className="w-4 h-4 text-cyan-400" />}
                  text="Contribution quality (not spam or gaming)"
                />
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Ban className="w-6 h-6 text-red-400" />
                Explicitly NOT Required
              </h3>
              <ul className="space-y-3">
                <NotRequiredItem text="No token purchase required" />
                <NotRequiredItem text="No private sale access needed" />
                <NotRequiredItem text="No KYC for basic eligibility" />
                <NotRequiredItem text="No minimum wallet balance" />
                <NotRequiredItem text="No social media requirements" />
              </ul>
            </div>
          </div>

          <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-slate-300">
                  <strong className="text-white">Important:</strong>
                  {' '}Eligibility rules may evolve through governance to adapt to ecosystem needs. However,
                  <strong className="text-cyan-400"> retroactive changes are not allowed</strong>—your earned rewards are protected.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How are airdrop rewards calculated?
            </h2>
            <p className="text-lg text-slate-300">
              Transparent methodology without revealing exploitable formulas
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6 mb-8">
            <CalculationCard
              icon={<BarChart3 className="w-6 h-6 text-blue-400" />}
              title="Participation Score (Non-Linear)"
              description="Your score increases with quality engagement, not just quantity. Consistent participation over time is weighted more heavily than sporadic bursts."
            />
            <CalculationCard
              icon={<Shield className="w-6 h-6 text-green-400" />}
              title="Anti-Sybil Logic"
              description="Multiple accounts from the same source are detected and penalized. The system rewards genuine users, not gaming attempts."
            />
            <CalculationCard
              icon={<Clock className="w-6 h-6 text-yellow-400" />}
              title="Long-Term Weighting"
              description="Actions sustained over months count more than one-time participation. Loyalty and commitment are valued."
            />
          </div>

          <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-white mb-4">Examples (Illustrative)</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <ComparisonRow
                better="Voting consistently on 10+ proposals"
                worse="Voting once on 1 proposal"
              />
              <ComparisonRow
                better="Successful proposals that launch businesses"
                worse="Rejected or low-quality proposals"
              />
              <ComparisonRow
                better="Long-term usage patterns over months"
                worse="Short activity spikes then abandonment"
              />
              <ComparisonRow
                better="Quality contributions and feedback"
                worse="Spam or gaming attempts"
              />
            </div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 text-center">
            <Lightbulb className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
            <p className="text-lg font-bold text-white mb-2">
              There is no single "best trick"
            </p>
            <p className="text-slate-300">
              The system rewards genuine engagement across multiple dimensions. Participate authentically, and you'll be rewarded fairly.
            </p>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How to claim your airdrop
            </h2>
            <p className="text-lg text-slate-300">
              Simple process once your allocation is ready
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <ClaimStep
                number={1}
                icon={<Wallet className="w-8 h-8 text-cyan-400" />}
                title="Connect Wallet"
                description="Use your eligible wallet"
              />
              <ClaimStep
                number={2}
                icon={<Eye className="w-8 h-8 text-blue-400" />}
                title="Check Eligibility"
                description="View your allocation"
              />
              <ClaimStep
                number={3}
                icon={<FileText className="w-8 h-8 text-green-400" />}
                title="Review Details"
                description="Check vesting terms"
              />
              <ClaimStep
                number={4}
                icon={<Gift className="w-8 h-8 text-yellow-400" />}
                title="Claim Tokens"
                description="Execute claim transaction"
              />
              <ClaimStep
                number={5}
                icon={<Activity className="w-8 h-8 text-cyan-400" />}
                title="Use Tokens"
                description="Vote, stake, or hold"
              />
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-300">
                    <strong className="text-white">Important:</strong>
                    {' '}Some allocations may be subject to vesting or lockup periods.
                    Vesting details will be clearly shown before you claim. Read carefully.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Vesting & Long-Term Alignment
            </h2>
            <p className="text-lg text-slate-300">
              Designed to create governors, not short-term sellers
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6 mb-8">
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-yellow-400" />
                Vesting Rules
              </h3>
              <p className="text-slate-300 mb-4">
                Not all airdropped tokens are instantly liquid. This prevents dumping and ensures long-term alignment with ecosystem success.
              </p>
              <div className="space-y-3">
                <VestingFactor label="Phase" description="Different phases have different vesting schedules" />
                <VestingFactor label="Allocation Size" description="Larger allocations may have longer vesting periods" />
                <VestingFactor label="Role" description="Contributors and proposers may have different vesting than voters" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Unlock className="w-5 h-5 text-cyan-400" />
                Example Vesting Schedule (Illustrative)
              </h3>
              <div className="space-y-4">
                <VestingBar percentage={25} label="Unlocked at claim" color="green" />
                <VestingBar percentage={75} label="Vested linearly over 6-12 months" color="cyan" />
              </div>
              <p className="text-sm text-slate-400 mt-4">
                Actual vesting terms vary by phase and allocation type. Your specific terms will be displayed before claiming.
              </p>
            </div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 text-center">
            <p className="text-lg font-bold text-cyan-300">
              "The airdrop is designed to create long-term governors, not short-term sellers."
            </p>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <BarChart3 className="w-8 h-8 text-cyan-400" />
              Airdrop Transparency
            </h2>
            <p className="text-lg text-slate-300">
              Public metrics for full accountability
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <TransparencyMetric
              label="Total Airdrop Allocation"
              value={formatNumber(MOCK_TRANSPARENCY_DATA.totalAirdropAllocation)}
              subtext="30% of total supply"
              icon={<Award className="w-6 h-6 text-cyan-400" />}
            />
            <TransparencyMetric
              label="Distributed So Far"
              value={formatNumber(MOCK_TRANSPARENCY_DATA.distributedSoFar)}
              subtext={`${((MOCK_TRANSPARENCY_DATA.distributedSoFar / MOCK_TRANSPARENCY_DATA.totalAirdropAllocation) * 100).toFixed(1)}% of allocation`}
              icon={<CheckCircle2 className="w-6 h-6 text-green-400" />}
            />
            <TransparencyMetric
              label="Remaining Tokens"
              value={formatNumber(MOCK_TRANSPARENCY_DATA.remainingTokens)}
              subtext="Available for distribution"
              icon={<Gift className="w-6 h-6 text-yellow-400" />}
            />
            <TransparencyMetric
              label="Eligible Wallets"
              value={MOCK_TRANSPARENCY_DATA.eligibleWallets.toLocaleString()}
              subtext="Across all phases"
              icon={<Users className="w-6 h-6 text-blue-400" />}
            />
          </div>

          <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 text-center">
            <Calendar className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
            <p className="text-sm text-slate-400 mb-1">Next Snapshot Date</p>
            <p className="text-2xl font-bold text-white mb-4">{MOCK_TRANSPARENCY_DATA.nextSnapshotDate}</p>
            <Link
              to="/token/transparency"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View Full Token Transparency
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-300">
              Quick answers to common questions
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4 mb-8">
            {FAQ_ITEMS.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/community/faq#airdrop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              Read Full FAQ
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-12 text-center">
          <Award className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            The ecosystem rewards participation
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Start engaging today to earn your share of the airdrop. Vote on proposals, submit ideas, and help build the future of AI governance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isWalletConnected ? (
              <button className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors">
                Check Your Eligibility
              </button>
            ) : (
              <button className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors">
                Connect Wallet
              </button>
            )}
            <Link
              to="/launchpad"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              Explore the Launchpad
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/governance"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              View Governance
              <Vote className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function ReasonCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-300">{description}</p>
    </div>
  );
}

function PhaseSelector({ phase, isSelected, onClick }: {
  phase: AirdropPhase;
  isSelected: boolean;
  onClick: () => void;
}) {
  const statusColors = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    completed: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        isSelected
          ? 'bg-cyan-600/20 border-cyan-500'
          : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-slate-400">Phase {phase.number}</span>
        <span className={`px-2 py-1 rounded text-xs font-medium border ${statusColors[phase.status]}`}>
          {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
        </span>
      </div>
      <h3 className="font-bold text-white">{phase.title}</h3>
    </button>
  );
}

function PhaseDetail({ phase }: { phase: AirdropPhase }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-3">{phase.title}</h3>
        <p className="text-slate-300">{phase.description}</p>
      </div>

      <div>
        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          Eligible Actions
        </h4>
        <ul className="space-y-2">
          {phase.eligibleActions.map((action, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {phase.distributionLogic && (
        <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
          <h4 className="font-bold text-white mb-2 text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Distribution Logic
          </h4>
          <p className="text-sm text-slate-300">{phase.distributionLogic}</p>
        </div>
      )}

      <div>
        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-cyan-400" />
          Important Notes
        </h4>
        <ul className="space-y-2">
          {phase.notes.map((note, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function EligibilityItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-3 text-slate-300">
      {icon}
      <span>{text}</span>
    </li>
  );
}

function NotRequiredItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-slate-400">
      <Ban className="w-4 h-4 text-red-400 flex-shrink-0" />
      <span>{text}</span>
    </li>
  );
}

function CalculationCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">{icon}</div>
        <div>
          <h3 className="font-bold text-white mb-2">{title}</h3>
          <p className="text-sm text-slate-300">{description}</p>
        </div>
      </div>
    </div>
  );
}

function ComparisonRow({ better, worse }: { better: string; worse: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
        <span>{better}</span>
      </div>
      <div className="text-slate-500 font-bold">{'>'}</div>
      <div className="flex-1 flex items-center gap-2">
        <Ban className="w-4 h-4 text-red-400 flex-shrink-0" />
        <span className="text-slate-400">{worse}</span>
      </div>
    </div>
  );
}

function ClaimStep({ number, icon, title, description }: {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 text-center">
      <div className="w-12 h-12 bg-slate-800 border border-slate-600 rounded-full flex items-center justify-center mx-auto mb-3 text-cyan-400 font-bold">
        {number}
      </div>
      <div className="mb-3 flex justify-center">{icon}</div>
      <h3 className="font-bold text-white mb-1 text-sm">{title}</h3>
      <p className="text-xs text-slate-400">{description}</p>
    </div>
  );
}

function VestingFactor({ label, description }: { label: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
      <div>
        <div className="font-medium text-white text-sm">{label}</div>
        <div className="text-xs text-slate-400">{description}</div>
      </div>
    </div>
  );
}

function VestingBar({ percentage, label, color }: {
  percentage: number;
  label: string;
  color: 'green' | 'cyan';
}) {
  const colors = {
    green: 'bg-green-500',
    cyan: 'bg-cyan-500'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-slate-300">{label}</span>
        <span className="text-sm font-bold text-white">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-3">
        <div
          className={`h-3 rounded-full ${colors[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function TransparencyMetric({ label, value, subtext, icon }: {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-slate-500">{subtext}</div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-700/50 transition-colors"
      >
        <span className="font-bold text-white">{question}</span>
        <ArrowRight
          className={`w-5 h-5 text-cyan-400 transition-transform flex-shrink-0 ml-4 ${
            isOpen ? 'rotate-90' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t border-slate-600 bg-slate-800/30">
          <p className="text-slate-300">{answer}</p>
        </div>
      )}
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
