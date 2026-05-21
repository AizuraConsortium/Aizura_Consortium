import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  TrendingUp, ExternalLink, ArrowRight, CheckCircle2, Clock,
  Shield, Users, Target, Sparkles, Eye, BarChart3,
  Search, Database, Bell, Activity, Globe
} from 'lucide-react';

export default function Coinfusion() {
  return (
    <PageLayout>
      <div className="space-y-20">
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live — Active Development
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Coinfusion
          </h1>

          <p className="text-2xl text-cyan-400 mb-6 font-medium">
            Next-generation crypto market intelligence platform.
          </p>

          <p className="text-lg text-slate-300 mb-8">
            The CoinMarketCap/CoinGecko alternative built by AI, powered by real-time data and advanced analytics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors">
              Visit Platform
              <ExternalLink className="w-5 h-5" />
            </button>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Explore Features
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">What is Coinfusion?</h2>

          <p className="text-lg text-slate-300 mb-6 max-w-3xl mx-auto">
            Coinfusion is a comprehensive crypto market data platform that aggregates real-time price feeds,
            on-chain analytics, project information, and market intelligence. Built with a focus on accuracy,
            transparency, and user experience, Coinfusion aims to be the go-to resource for crypto market data.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <FeatureCard
              icon={<Activity className="w-8 h-8 text-green-400" />}
              title="Real-Time Data"
              description="Live price feeds from major exchanges, updated continuously"
            />
            <FeatureCard
              icon={<Database className="w-8 h-8 text-blue-400" />}
              title="Deep Analytics"
              description="On-chain metrics, trading volumes, and market trends"
            />
            <FeatureCard
              icon={<Search className="w-8 h-8 text-purple-400" />}
              title="Advanced Search"
              description="Powerful filtering and discovery tools for tokens and projects"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-cyan-400" />}
              title="Transparency First"
              description="Verified data sources and clear methodology"
            />
          </div>
        </section>

        <section id="features">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Core Features</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <StepCard
              icon={<TrendingUp className="w-6 h-6 text-cyan-400" />}
              title="Market Overview"
              items={[
                'Global market cap and 24h volume tracking',
                'Top gainers and losers across all assets',
                'Market dominance charts and trends',
                'Historical data and price charts'
              ]}
            />
            <StepCard
              icon={<BarChart3 className="w-6 h-6 text-green-400" />}
              title="Token Profiles"
              items={[
                'Detailed price and volume data for thousands of tokens',
                'Project descriptions and key metrics',
                'Social links and community statistics',
                'Supply information and distribution'
              ]}
            />
            <StepCard
              icon={<Bell className="w-6 h-6 text-yellow-400" />}
              title="Price Alerts"
              items={[
                'Custom price alerts for any token',
                'Volume spike notifications',
                'New listing announcements',
                'Portfolio tracking and alerts'
              ]}
            />
            <StepCard
              icon={<Database className="w-6 h-6 text-blue-400" />}
              title="Exchange Data"
              items={[
                'Exchange rankings by volume and trust score',
                'Trading pair information across platforms',
                'Liquidity depth and spread analysis',
                'Exchange reserves and proof of funds'
              ]}
            />
          </div>

          <div className="mt-8 p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">What Makes Coinfusion Different</h3>
                <p className="text-slate-300">
                  Built by AI agents with a focus on data accuracy and user experience. No paid placements,
                  no fake volume, no misleading metrics. Just clean, reliable data you can trust.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Current Status</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                Live Now
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Real-time price tracking for 10,000+ cryptocurrencies</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Exchange rankings and verified volume data</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Portfolio tracking and watchlists</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Mobile-responsive interface</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>API access for developers</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-yellow-400" />
                Coming Soon
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Advanced on-chain analytics and wallet tracking</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                  <span>DeFi protocol tracking and TVL rankings</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                  <span>NFT market data and floor price tracking</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                  <span>AI-powered market insights and predictions</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Social sentiment analysis</span>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-slate-700/30 border border-slate-600 rounded-lg">
                <p className="text-sm text-slate-300 italic">
                  We're actively developing new features based on community feedback and market needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">For Different Users</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <UseCaseCard
              icon={<Users className="w-8 h-8 text-blue-400" />}
              title="Retail Investors"
              description="Track your portfolio, discover new tokens, and stay informed with real-time market data."
            />
            <UseCaseCard
              icon={<Target className="w-8 h-8 text-green-400" />}
              title="Traders"
              description="Advanced charts, volume analysis, and price alerts to inform your trading decisions."
            />
            <UseCaseCard
              icon={<Globe className="w-8 h-8 text-purple-400" />}
              title="Developers"
              description="API access to comprehensive market data for building applications and services."
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Competitive Advantages
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            <AdvantageItem
              title="No Paid Listings"
              description="Projects can't pay for rankings or inflated metrics. Data is objective and transparent."
            />
            <AdvantageItem
              title="Verified Volume Data"
              description="Advanced filtering removes wash trading and fake volume from exchange rankings."
            />
            <AdvantageItem
              title="Open Source Methodology"
              description="Our ranking and data collection methods are transparent and community-auditable."
            />
            <AdvantageItem
              title="AI-Powered Quality Control"
              description="Automated systems detect anomalies and data inconsistencies in real-time."
            />
            <AdvantageItem
              title="Community Governed"
              description="Token holders can propose improvements and vote on platform changes."
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Role in the Ecosystem
          </h2>

          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-slate-300 mb-8 text-center">
              Coinfusion is a strategic business in the portfolio, generating revenue and providing market intelligence.
            </p>

            <div className="space-y-4">
              <FlowItem
                icon={<TrendingUp className="w-6 h-6 text-green-400" />}
                title="Revenue Generation"
                description="Advertising, premium subscriptions, and API access generate income for the treasury"
              />
              <FlowItem
                icon={<Database className="w-6 h-6 text-blue-400" />}
                title="Market Intelligence"
                description="Platform data informs strategic decisions across the entire ecosystem"
              />
              <FlowItem
                icon={<Users className="w-6 h-6 text-purple-400" />}
                title="User Acquisition"
                description="Brings new users into the ecosystem and increases token visibility"
              />
              <FlowItem
                icon={<Sparkles className="w-6 h-6 text-yellow-400" />}
                title="Brand Recognition"
                description="Establishes the consortium as a major player in crypto infrastructure"
              />
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Status & Transparency
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatusCard
              icon={<CheckCircle2 className="w-8 h-8 text-green-400" />}
              label="Status"
              value="Live"
              valueColor="text-green-400"
            />
            <StatusCard
              icon={<Activity className="w-8 h-8 text-cyan-400" />}
              label="Development"
              value="Active"
              valueColor="text-cyan-400"
            />
            <StatusCard
              icon={<Users className="w-8 h-8 text-blue-400" />}
              label="Access"
              value="Public"
              valueColor="text-blue-400"
            />
            <StatusCard
              icon={<Eye className="w-8 h-8 text-purple-400" />}
              label="Business Model"
              value="Freemium"
              valueColor="text-purple-400"
            />
          </div>

          <div className="mt-8 text-center space-y-4">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              View Portfolio Overview
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/governance"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors ml-3"
            >
              Participate in Governance
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Trusted data. Transparent methodology. Built by AI.
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Coinfusion is building the next generation of crypto market intelligence, free from
            conflicts of interest and paid placements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors">
              Explore Platform
            </button>
            <Link
              to="/token/airdrop"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Join the Ecosystem
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-300">{description}</p>
    </div>
  );
}

function StepCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UseCaseCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-300 text-sm">{description}</p>
    </div>
  );
}

function AdvantageItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg">
      <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
        <p className="text-sm text-slate-300">{description}</p>
      </div>
    </div>
  );
}

function FlowItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
        <p className="text-sm text-slate-300">{description}</p>
      </div>
    </div>
  );
}

function StatusCard({
  icon,
  label,
  value,
  valueColor
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor: string;
}) {
  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6 text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="text-sm text-slate-400 mb-1">{label}</div>
      <div className={`text-lg font-bold ${valueColor}`}>{value}</div>
    </div>
  );
}
