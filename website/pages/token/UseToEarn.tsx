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
import { LiveRatesTable } from '../../components/u2e/LiveRatesTable';
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
      answer: 'Use-to-Earn (U2E) is a revolutionary model where users earn AAIC tokens simply by using ecosystem services. Unlike failed "play-to-earn" schemes, U2E rewards are backed by real business revenue, making them sustainable indefinitely.'
    },
    {
      question: 'How is U2E different from Play-to-Earn?',
      answer: 'Play-to-Earn models collapsed because rewards weren\'t backed by real value - they relied on new users buying tokens. U2E rewards come from actual business profits enabled by AI cost reduction. This creates a sustainable system that can operate as long as businesses remain profitable.'
    },
    {
      question: 'When will I receive my U2E rewards?',
      answer: 'Rewards accrue automatically in real-time as you use ecosystem services. You can view your accumulated rewards in your dashboard and claim them at any time. There are no manual claims required - the system tracks everything automatically.'
    },
    {
      question: 'Can reward rates change?',
      answer: 'Yes, reward rates adjust based on business profitability to ensure long-term sustainability. If a business becomes more profitable, rates may increase. If margins tighten, rates may decrease. This dynamic adjustment is key to maintaining an infinite reward system.'
    },
    {
      question: 'Is there a minimum usage requirement?',
      answer: 'No, there\'s no minimum. You earn rewards for any usage, whether it\'s one transaction or thousands. However, consistent users who actively use multiple ecosystem services will naturally earn more over time.'
    },
    {
      question: 'How are rewards calculated?',
      answer: 'Each business has specific reward rates per action (e.g., 5 AAIC per trade, 10 AAIC per project). Rates are set based on the business\'s profit margins and the value you create through usage. All rates are publicly visible and transparent.'
    },
    {
      question: 'What happens in Phase 3 (Year 4+)?',
      answer: 'In Phase 3, rewards transition to being 100% backed by revenue buybacks instead of token supply. This creates true infinite sustainability - as long as businesses generate profits, rewards continue indefinitely. The token supply becomes deflationary as buybacks exceed emissions.'
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
              <h3 className="font-bold text-white mb-2">2. AI Tracks Usage</h3>
              <p className="text-sm text-slate-300">
                System automatically tracks your usage events and calculates rewards in real-time
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

        {/* Live Reward Rates */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Current Reward Rates
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Transparent, live rates for all ecosystem businesses
            </p>
          </div>

          <LiveRatesTable />
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
