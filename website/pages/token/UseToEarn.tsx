import { useState, useEffect } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Zap,
  TrendingUp,
  Coins,
  Shield,
  ChevronDown,
  Sparkles,
  DollarSign,
  Users,
  Activity
} from 'lucide-react';
import { PhaseTimeline } from '../../components/u2e/PhaseTimeline';
import { ComparisonTable } from '../../components/u2e/ComparisonTable';
import { RealExamplesCarousel } from '../../components/u2e/RealExamplesCarousel';
import { SustainabilityDiagram } from '../../components/u2e/SustainabilityDiagram';
import { U2ECalculator } from '../../components/tokenomics/U2ECalculator';

interface U2EStats {
  total_rewards_distributed: number;
  active_businesses: number;
  active_users: number;
  avg_monthly_earnings: number;
  total_usage_events: number;
  last_updated: string;
}

export default function UseToEarn() {
  const [stats, setStats] = useState<U2EStats | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const response = await fetch('/api/website/u2e/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load U2E stats:', error);
    }
  }

  const faqs = [
    {
      question: 'What is Use-to-Earn (U2E)?',
      answer: 'Use-to-Earn (U2E) is a revolutionary points-based reward model where users earn AAIC tokens by using ecosystem services. You earn points for actions, and monthly AAIC distribution is based on your share of total points. This scales infinitely and ensures fair rewards regardless of user base size.'
    },
    {
      question: 'How are rewards calculated with the points system?',
      answer: 'Your monthly reward = (Your Points / Total Points Issued) × 458,333 AAIC monthly budget. For example, if you earn 1M points and total points are 1B, you get 0.1% of 458,333 AAIC = 458 AAIC. The more you contribute relative to others, the more you earn.'
    },
    {
      question: 'Can point values change?',
      answer: 'Yes, point values for different actions are adjusted by governance to maintain ecosystem balance. If an action becomes too heavily farmed, governance can reduce its point value. This flexibility prevents gaming and ensures fair distribution.'
    },
    {
      question: 'Is there a limit to how many points I can earn?',
      answer: 'Yes, there are anti-abuse protections: daily per-category caps, point decay on repetitive actions, and per-wallet monthly maximums. These prevent gaming while allowing genuine users to earn fairly.'
    },
    {
      question: 'When do points reset?',
      answer: 'Points reset to 0 at the start of each month. This creates fresh competition every cycle and prevents point hoarding. Your AAIC rewards from the previous month are distributed, and you start earning points anew.'
    },
    {
      question: 'Are there retroactive rewards for pre-launch usage?',
      answer: 'No. Tracking begins after airdrop distribution, with first payments in Month 1 post-airdrop. This avoids double rewards, ensures fair competition, and prevents pre-launch gaming.'
    },
    {
      question: 'What happens after Year 4 when emissions end?',
      answer: 'Rewards transition to revenue-backed model. 15% of net profit goes to U2E support (buybacks for distribution). As long as businesses are profitable, rewards continue indefinitely with no new token minting required.'
    }
  ];

  return (
    <PageLayout>
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            World's First Sustainable U2E Model
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Use-to-Earn:{' '}
            <span className="bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
              Earn Tokens By Using Services
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Use AI-powered services and automatically earn AAIC tokens. No gimmicks, no speculation—just
            sustainable rewards backed by real business profits. This is how crypto incentives should work.
          </p>

          {/* Animated Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {stats.total_rewards_distributed.toLocaleString()}
                </div>
                <div className="text-sm text-slate-400">AAIC Distributed</div>
              </div>
              <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-xl p-4">
                <div className="text-3xl font-bold text-cyan-400 mb-1">
                  {stats.active_businesses}
                </div>
                <div className="text-sm text-slate-400">Active Businesses</div>
              </div>
              <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-xl p-4">
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {stats.active_users}
                </div>
                <div className="text-sm text-slate-400">Active Users</div>
              </div>
              <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-xl p-4">
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {Math.round(stats.avg_monthly_earnings)}
                </div>
                <div className="text-sm text-slate-400">Avg Monthly Earning</div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Start Earning Today
            </a>
            <Link
              to="#calculator"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Calculate Your Earnings
            </Link>
          </div>
        </section>

        {/* How It Works */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How Use-to-Earn Works
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Simple, transparent, and automatic. Use services, earn tokens.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">1. Use Services</h3>
              <p className="text-sm text-slate-300">
                Use any ecosystem service normally—AI Traders, Business Factory, Web Dev, etc.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">2. Points System Tracks Activity</h3>
              <p className="text-sm text-slate-300">
                Earn POINTS for each action. Monthly rewards based on your share of total points issued.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">3. Rewards Accrue</h3>
              <p className="text-sm text-slate-300">
                AAIC tokens accumulate in your account automatically—no manual claims needed
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">4. Claim Anytime</h3>
              <p className="text-sm text-slate-300">
                View your earnings in the dashboard and withdraw tokens whenever you want
              </p>
            </div>
          </div>

          {/* Points System Details */}
          <div className="mt-12 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Monthly Distribution Formula</h3>
            <div className="bg-slate-900/50 rounded-lg p-6 mb-6">
              <div className="text-center space-y-3">
                <div className="text-2xl font-mono text-cyan-400">
                  Your AAIC Reward = (Your Points / Total Points) × Monthly U2E Budget
                </div>
                <div className="text-lg text-slate-300">
                  Monthly U2E Budget = <span className="font-bold text-white">458,333 AAIC</span> (22M over 48 months)
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h4 className="font-bold text-white mb-4">Why Points?</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white text-sm">Scales Infinitely</div>
                    <p className="text-xs text-slate-400">Works with 10 users or 10 million</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white text-sm">Fair Relative Rewards</div>
                    <p className="text-xs text-slate-400">Regardless of participation</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white text-sm">Flexible Action Weighting</div>
                    <p className="text-xs text-slate-400">Adjusted by governance</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white text-sm">Anti-Abuse Protections</div>
                    <p className="text-xs text-slate-400">Built-in safeguards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Points-Based Math Examples */}
        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Concrete Math: How Your Rewards Are Calculated
          </h2>

          <div className="space-y-8">
            {/* Example 1 */}
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-bold">
                  EXAMPLE 1
                </div>
                <span className="text-slate-400 text-sm">Small User Base</span>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Monthly budget:</span>
                    <span className="font-mono text-white">458,333 AAIC</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Total points issued:</span>
                    <span className="font-mono text-white">100,000,000</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>You earned:</span>
                    <span className="font-mono text-cyan-400">1,000,000 points</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Your share:</span>
                    <span className="font-mono text-cyan-400">1% of total</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                    <span className="font-bold text-white">Your reward:</span>
                    <span className="font-mono text-2xl text-green-400">4,583 AAIC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Example 2 */}
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-bold">
                  EXAMPLE 2
                </div>
                <span className="text-slate-400 text-sm">Large User Base (100x more users)</span>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Monthly budget:</span>
                    <span className="font-mono text-white">458,333 AAIC</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Total points issued:</span>
                    <span className="font-mono text-white">10,000,000,000</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>You earned:</span>
                    <span className="font-mono text-cyan-400">1,000,000 points</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Your share:</span>
                    <span className="font-mono text-cyan-400">0.01% of total</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                    <span className="font-bold text-white">Your reward:</span>
                    <span className="font-mono text-2xl text-green-400">46 AAIC</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-sm text-slate-300">
                <span className="font-bold text-yellow-400">Note:</span> As ecosystem grows, competition increases, but monthly budget stays fixed. This ensures sustainability.
              </div>
            </div>

            {/* Example 3 */}
            <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
                  EXAMPLE 3
                </div>
                <span className="text-slate-400 text-sm">Power User (Very Active!)</span>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Monthly budget:</span>
                    <span className="font-mono text-white">458,333 AAIC</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Total points issued:</span>
                    <span className="font-mono text-white">1,000,000,000</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>You earned:</span>
                    <span className="font-mono text-cyan-400">50,000,000 points</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Your share:</span>
                    <span className="font-mono text-cyan-400">5% of total</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                    <span className="font-bold text-white">Your reward:</span>
                    <span className="font-mono text-2xl text-green-400">22,917 AAIC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Point Values */}
          <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4">Action Point Values (Examples)</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <div className="flex justify-between p-3 bg-slate-900/50 rounded">
                <span className="text-slate-300">AI Traders trade</span>
                <span className="font-mono text-cyan-400">100 pts</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-900/50 rounded">
                <span className="text-slate-300">Profitable trade</span>
                <span className="font-mono text-cyan-400">+200 pts</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-900/50 rounded">
                <span className="text-slate-300">Business created</span>
                <span className="font-mono text-cyan-400">5,000 pts</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-900/50 rounded">
                <span className="text-slate-300">Governance vote</span>
                <span className="font-mono text-cyan-400">500 pts</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-900/50 rounded">
                <span className="text-slate-300">Proposal submission</span>
                <span className="font-mono text-cyan-400">10,000 pts</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-900/50 rounded">
                <span className="text-slate-300">Comment/feedback</span>
                <span className="font-mono text-cyan-400">50 pts</span>
              </div>
            </div>
          </div>
        </section>

        {/* Why It's Sustainable */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why U2E Succeeds Where Play-to-Earn Failed
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              The secret: AI cost reduction + real business revenue = sustainable rewards
            </p>
          </div>

          <SustainabilityDiagram />
        </section>

        {/* Comparison Table */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              U2E vs Traditional vs Play-to-Earn
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              See how Use-to-Earn compares to other models
            </p>
          </div>

          <ComparisonTable />
        </section>

        {/* Dynamic Point Allocation */}
        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How Points Are Allocated Across Activities
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Instead of fixed AAIC per action, each action earns POINTS that vary by governance.
            </p>
          </div>

          <div className="space-y-8">
            {/* AI Traders */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                AI Traders
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div className="p-3 bg-slate-900/50 rounded">
                  <div className="text-slate-400 mb-1">Execute trade</div>
                  <div className="text-lg font-bold text-cyan-400">100 points</div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded">
                  <div className="text-slate-400 mb-1">Profitable trade</div>
                  <div className="text-lg font-bold text-cyan-400">+100 bonus</div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded">
                  <div className="text-slate-400 mb-1">Strategy deployed</div>
                  <div className="text-lg font-bold text-cyan-400">500 points</div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded">
                  <div className="text-slate-400 mb-1">Volume milestones</div>
                  <div className="text-lg font-bold text-cyan-400">Up to 5,000</div>
                </div>
              </div>
            </div>

            {/* AI Business Factory */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-400" />
                AI Business Factory
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div className="p-3 bg-slate-900/50 rounded">
                  <div className="text-slate-400 mb-1">Concept submitted</div>
                  <div className="text-lg font-bold text-cyan-400">1,000 points</div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded">
                  <div className="text-slate-400 mb-1">Community approved</div>
                  <div className="text-lg font-bold text-cyan-400">+10,000 bonus</div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded">
                  <div className="text-slate-400 mb-1">Business launched</div>
                  <div className="text-lg font-bold text-cyan-400">25,000 points</div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded">
                  <div className="text-slate-400 mb-1">Revenue milestone</div>
                  <div className="text-lg font-bold text-cyan-400">10k-50k points</div>
                </div>
              </div>
            </div>

            {/* AI Web Dev */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-purple-400" />
                AI Web Dev
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div className="p-3 bg-slate-900/50 rounded">
                  <div className="text-slate-400 mb-1">Project started</div>
                  <div className="text-lg font-bold text-cyan-400">500 points</div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded">
                  <div className="text-slate-400 mb-1">Project completed</div>
                  <div className="text-lg font-bold text-cyan-400">2,000 points</div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded">
                  <div className="text-slate-400 mb-1">Client satisfaction</div>
                  <div className="text-lg font-bold text-cyan-400">+1,000 bonus</div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded">
                  <div className="text-slate-400 mb-1">Deployment milestone</div>
                  <div className="text-lg font-bold text-cyan-400">3,000 points</div>
                </div>
              </div>
            </div>

            {/* Governance Participation */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-cyan-400" />
                Governance Participation
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div className="p-3 bg-slate-900/50 rounded">
                  <div className="text-slate-400 mb-1">Vote on proposal</div>
                  <div className="text-lg font-bold text-cyan-400">500 points</div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded">
                  <div className="text-slate-400 mb-1">Submit proposal</div>
                  <div className="text-lg font-bold text-cyan-400">10,000 points</div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded">
                  <div className="text-slate-400 mb-1">Comment/discussion</div>
                  <div className="text-lg font-bold text-cyan-400">50 points</div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded">
                  <div className="text-slate-400 mb-1">Early voter bonus</div>
                  <div className="text-lg font-bold text-cyan-400">+100 bonus</div>
                </div>
              </div>
            </div>

            {/* Anti-Abuse Caps */}
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-orange-400" />
                Anti-Abuse Caps
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-300">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Maximum points per category per day</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Decay on repetitive identical actions</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Per-wallet monthly point caps (dynamic)</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Anomaly detection flags suspicious patterns</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section id="calculator">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Calculate Your Earning Potential
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              See how much you could earn based on your usage patterns
            </p>
          </div>

          <U2ECalculator />
        </section>

        {/* Real Examples */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Real User Examples
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              See what actual users are earning (anonymized data)
            </p>
          </div>

          <RealExamplesCarousel />
        </section>

        {/* Retroactive Rewards */}
        <section className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            When Does Tracking Start?
          </h2>

          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mb-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full text-sm font-bold mb-4">
                  CURRENT POLICY
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">NO RETROACTIVE REWARDS</h3>
                <p className="text-slate-300">Clean start for fair competition</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-2">Tracking begins:</div>
                  <div className="text-xl font-bold text-cyan-400">After airdrop distribution</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-2">First payment:</div>
                  <div className="text-xl font-bold text-green-400">Month 1 after airdrop</div>
                </div>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6">
                <h4 className="font-bold text-white mb-3">Why No Retroactive Rewards?</h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Avoids "double rewards" optics</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Clean start for fair competition</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Simplifies implementation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    <span>Prevents gaming pre-launch</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Monthly Reset
              </h3>
              <p className="text-slate-300 text-sm">
                Points reset to 0 at the start of each month. Fresh competition every cycle ensures fairness and prevents point hoarding.
              </p>
            </div>
          </div>
        </section>

        {/* Phase Timeline */}
        <section>
          <PhaseTimeline />
        </section>

        {/* FAQ */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Everything you need to know about Use-to-Earn rewards
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-700/30 transition-colors"
                >
                  <span className="font-semibold text-white pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                      expandedFAQ === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-6 text-slate-300">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-2xl p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-slate-300 mb-8">
              Join thousands of users earning AAIC tokens simply by using our AI-powered services.
              No investment required—just use the platforms and watch rewards accumulate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/login"
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-lg transition-colors inline-block"
              >
                Create Account
              </a>
              <Link
                to="/portfolio"
                className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors inline-block"
              >
                Explore Businesses
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
