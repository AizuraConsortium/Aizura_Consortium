import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import {
  Twitter, MessageCircle, Send, Github, Users, TrendingUp,
  Award, Activity, CheckCircle2, Sparkles, AlertCircle, Globe
} from 'lucide-react';

export default function Social() {
  const [recentQualifications, setRecentQualifications] = useState<Array<{
    wallet: string;
    points: number;
    action: string;
    time: string;
  }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const actions = [
        'Connected Twitter',
        'Joined Discord',
        'Completed referral',
        'Voted on proposal',
        'Connected Telegram'
      ];

      const newQualification = {
        wallet: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
        points: Math.floor(Math.random() * 100) + 50,
        action: actions[Math.floor(Math.random() * actions.length)],
        time: 'Just now'
      };

      setRecentQualifications(prev => [newQualification, ...prev.slice(0, 9)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const communityStats = [
    {
      icon: <Users className="w-8 h-8 text-cyan-400" />,
      value: '5,247',
      label: 'Qualified Airdrop Participants',
      trend: '+215',
      trendLabel: 'today',
      color: 'cyan'
    },
    {
      icon: <Twitter className="w-8 h-8 text-blue-400" />,
      value: '8,340',
      label: 'Twitter Followers',
      trend: '+180',
      trendLabel: 'this week',
      color: 'blue'
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-purple-400" />,
      value: '4,680',
      label: 'Discord Members',
      trend: '+92',
      trendLabel: 'this week',
      color: 'purple'
    },
    {
      icon: <Send className="w-8 h-8 text-blue-500" />,
      value: '3,215',
      label: 'Telegram Members',
      trend: '+67',
      trendLabel: 'this week',
      color: 'blue'
    },
    {
      icon: <Github className="w-8 h-8 text-slate-300" />,
      value: '428',
      label: 'GitHub Stars',
      trend: '+31',
      trendLabel: 'this month',
      color: 'slate'
    },
    {
      icon: <Activity className="w-8 h-8 text-green-400" />,
      value: '1,840',
      label: 'Active Governance Participants',
      trend: '+156',
      trendLabel: 'this month',
      color: 'green'
    }
  ];

  const socialAccounts = [
    {
      platform: 'Twitter (Main)',
      handle: '@AizuraOfficial',
      followers: '8.3K',
      description: 'Official Aizura updates and announcements',
      icon: <Twitter className="w-6 h-6" />,
      color: 'text-blue-400 bg-blue-500/10',
      link: 'https://twitter.com/AizuraOfficial'
    },
    {
      platform: 'Twitter (Product)',
      handle: '@AizuraProduct',
      followers: '2.1K',
      description: 'Product & Strategy insights',
      icon: <Twitter className="w-6 h-6" />,
      color: 'text-blue-400 bg-blue-500/10',
      link: 'https://twitter.com/AizuraProduct'
    },
    {
      platform: 'Twitter (Engineering)',
      handle: '@AizuraEngineering',
      followers: '1.8K',
      description: 'Technical updates and engineering blog',
      icon: <Twitter className="w-6 h-6" />,
      color: 'text-blue-400 bg-blue-500/10',
      link: 'https://twitter.com/AizuraEngineering'
    },
    {
      platform: 'Twitter (Marketing)',
      handle: '@AizuraMarketing',
      followers: '3.2K',
      description: 'Growth, partnerships, and marketing campaigns',
      icon: <Twitter className="w-6 h-6" />,
      color: 'text-blue-400 bg-blue-500/10',
      link: 'https://twitter.com/AizuraMarketing'
    },
    {
      platform: 'Twitter (Operations)',
      handle: '@AizuraOperations',
      followers: '1.5K',
      description: 'Operations, infrastructure, and execution',
      icon: <Twitter className="w-6 h-6" />,
      color: 'text-blue-400 bg-blue-500/10',
      link: 'https://twitter.com/AizuraOperations'
    },
    {
      platform: 'Twitter (Finance)',
      handle: '@AizuraFinance',
      followers: '2.4K',
      description: 'Financial reports, treasury, and tokenomics',
      icon: <Twitter className="w-6 h-6" />,
      color: 'text-blue-400 bg-blue-500/10',
      link: 'https://twitter.com/AizuraFinance'
    },
    {
      platform: 'Twitter (Compliance)',
      handle: '@AizuraCompliance',
      followers: '1.1K',
      description: 'Legal, compliance, and regulatory updates',
      icon: <Twitter className="w-6 h-6" />,
      color: 'text-blue-400 bg-blue-500/10',
      link: 'https://twitter.com/AizuraCompliance'
    }
  ];

  const communityGuidelines = [
    {
      title: 'Be Respectful',
      description: 'Treat all community members with respect. No harassment, hate speech, or personal attacks.'
    },
    {
      title: 'Stay On Topic',
      description: 'Keep discussions relevant to Aizura, AI, blockchain, and related topics.'
    },
    {
      title: 'No Spam or Shilling',
      description: 'Don\'t spam, shill other projects, or post unsolicited promotions.'
    },
    {
      title: 'Constructive Criticism',
      description: 'Criticism is welcome but should be constructive and respectful.'
    },
    {
      title: 'No Financial Advice',
      description: 'Don\'t provide financial advice. DYOR (Do Your Own Research) always.'
    },
    {
      title: 'Report Issues',
      description: 'If you see rule violations, report them to moderators. Don\'t engage in public disputes.'
    }
  ];

  return (
    <PageLayout>
      <div className="space-y-16">
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium mb-6">
            <Globe className="w-4 h-4" />
            Social & Community
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Join the{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Aizura Community
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Connect with thousands of builders, traders, and governance participants shaping the future of
            AI-powered businesses.
          </p>
        </section>

        <section className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-8 lg:p-12">
          <div className="flex items-start gap-4 mb-6">
            <AlertCircle className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Airdrop Alert: Limited Tier 1 Spots Remaining
              </h2>
              <p className="text-lg text-slate-300">
                Join <strong className="text-white">5,000+ qualified participants</strong> earning airdrop points.
                Community growing by <strong className="text-white">200+ members daily</strong>. Don't miss out on
                Tier 1 allocation.
              </p>
            </div>
          </div>

          <Link
            to="/token/airdrop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-lg transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            Start Earning Points Now
          </Link>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Community Statistics</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityStats.map((stat, index) => (
              <div key={index} className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-${stat.color}-500/10 rounded-lg`}>
                    {stat.icon}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>{stat.trend}</span>
                  </div>
                </div>

                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-slate-300 mb-1">{stat.label}</div>
                <div className="text-xs text-slate-400">{stat.trendLabel}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-8 h-8 text-cyan-400" />
            <h2 className="text-3xl font-bold text-white">Recent Airdrop Qualifications</h2>
          </div>

          <p className="text-slate-300 mb-8">
            Real-time updates as community members earn airdrop points. Join them now!
          </p>

          <div className="bg-slate-900/50 rounded-xl p-6 max-h-96 overflow-y-auto">
            {recentQualifications.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                Waiting for activity...
              </div>
            ) : (
              <div className="space-y-3">
                {recentQualifications.map((qual, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 animate-fadeIn"
                  >
                    <div className="flex items-center gap-4">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <div>
                        <div className="text-white font-mono text-sm">{qual.wallet}</div>
                        <div className="text-xs text-slate-400">{qual.action}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-cyan-400 font-bold">+{qual.points}</div>
                      <div className="text-xs text-slate-400">{qual.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/token/airdrop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
            >
              View Airdrop Details
              <Award className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Follow Our AI Agents</h2>

          <p className="text-center text-slate-300 mb-8 max-w-2xl mx-auto">
            Each of the six AI agents has their own Twitter account, sharing specialized insights, updates,
            and engaging with the community in their domain of expertise.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {socialAccounts.map((account, index) => (
              <div key={index} className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 ${account.color} rounded-lg`}>
                    {account.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{account.followers}</div>
                    <div className="text-xs text-slate-400">followers</div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{account.platform}</h3>
                <a
                  href={account.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors mb-3 inline-block"
                >
                  {account.handle}
                </a>

                <p className="text-sm text-slate-300">{account.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Join Our Channels
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="https://discord.gg/aizura"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-slate-900/50 border border-slate-700 hover:border-purple-500/50 rounded-xl p-8 text-center transition-all"
            >
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/20 transition-colors">
                <MessageCircle className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Discord</h3>
              <p className="text-slate-300 mb-4">Real-time discussions, support, and community events</p>
              <div className="text-cyan-400 font-medium group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                Join Discord
                <Activity className="w-4 h-4" />
              </div>
            </a>

            <a
              href="https://t.me/aizuracommunity"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-slate-900/50 border border-slate-700 hover:border-blue-500/50 rounded-xl p-8 text-center transition-all"
            >
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/20 transition-colors">
                <Send className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Telegram</h3>
              <p className="text-slate-300 mb-4">Quick updates, announcements, and community chat</p>
              <div className="text-cyan-400 font-medium group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                Join Telegram
                <Activity className="w-4 h-4" />
              </div>
            </a>

            <a
              href="https://github.com/aizura-consortium"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-slate-900/50 border border-slate-700 hover:border-slate-500/50 rounded-xl p-8 text-center transition-all"
            >
              <div className="w-16 h-16 bg-slate-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-slate-500/20 transition-colors">
                <Github className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">GitHub</h3>
              <p className="text-slate-300 mb-4">Open-source code, contributions, and technical discussions</p>
              <div className="text-cyan-400 font-medium group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                Star on GitHub
                <Activity className="w-4 h-4" />
              </div>
            </a>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Community Guidelines
          </h2>

          <p className="text-center text-slate-300 mb-8 max-w-2xl mx-auto">
            Our community thrives on respect, collaboration, and shared enthusiasm for AI and blockchain.
            Follow these guidelines to ensure a positive experience for everyone.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityGuidelines.map((guideline, index) => (
              <div key={index} className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  {guideline.title}
                </h3>
                <p className="text-sm text-slate-300">{guideline.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
            <p className="text-sm text-slate-300">
              <strong className="text-white">Violations of community guidelines</strong> may result in warnings,
              temporary muting, or permanent bans depending on severity. Moderators have final discretion. If you
              have concerns, contact the moderation team directly.
            </p>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </PageLayout>
  );
}
