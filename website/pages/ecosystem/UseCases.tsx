import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  ShoppingCart, Code, TrendingUp, FileText, Briefcase,
  Globe, DollarSign, Users, Zap, CheckCircle2, ArrowRight,
  BarChart3, Lightbulb, Target, Clock, Shield, Star
} from 'lucide-react';

export default function UseCases() {
  const businessCategories = [
    {
      icon: <ShoppingCart className="w-8 h-8 text-cyan-400" />,
      title: 'E-commerce Businesses',
      description: 'Dropshipping stores, print-on-demand, digital products, subscription boxes',
      examples: ['AI-curated product stores', 'Automated inventory management', 'Dynamic pricing optimization'],
      successRate: '65%',
    },
    {
      icon: <Code className="w-8 h-8 text-blue-400" />,
      title: 'SaaS Products',
      description: 'Micro-SaaS tools, API services, automation platforms, productivity apps',
      examples: ['No-code tool builders', 'API aggregation services', 'Workflow automation tools'],
      successRate: '70%',
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-400" />,
      title: 'Trading & Finance',
      description: 'Algorithmic trading bots, portfolio management, market analysis tools',
      examples: ['Multi-strategy trading bots', 'Risk management systems', 'Market sentiment analyzers'],
      successRate: '60%',
    },
    {
      icon: <FileText className="w-8 h-8 text-purple-400" />,
      title: 'Content Platforms',
      description: 'Blogs, newsletters, educational content, content aggregation',
      examples: ['Niche content sites', 'Curated newsletter services', 'Educational resource hubs'],
      successRate: '75%',
    },
  ];

  const industries = [
    {
      name: 'Finance',
      icon: <DollarSign className="w-6 h-6" />,
      applications: [
        'Automated trading strategies',
        'Risk assessment and portfolio optimization',
        'Market research and competitive analysis',
        'Financial reporting and compliance',
      ],
      color: 'text-green-400',
    },
    {
      name: 'Technology',
      icon: <Code className="w-6 h-6" />,
      applications: [
        'Code generation and review',
        'Bug detection and automated testing',
        'Documentation generation',
        'Architecture design and optimization',
      ],
      color: 'text-blue-400',
    },
    {
      name: 'Marketing',
      icon: <Target className="w-6 h-6" />,
      applications: [
        'Content strategy and creation',
        'SEO optimization and keyword research',
        'Ad campaign optimization',
        'Customer segmentation and targeting',
      ],
      color: 'text-purple-400',
    },
    {
      name: 'Operations',
      icon: <Briefcase className="w-6 h-6" />,
      applications: [
        'Process automation and optimization',
        'Supply chain management',
        'Quality control and monitoring',
        'Resource allocation and scheduling',
      ],
      color: 'text-orange-400',
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Proposal Submission',
      description: 'Community member submits business idea with market research, target audience, and revenue model',
      duration: '1 day',
      icon: <Lightbulb className="w-8 h-8 text-yellow-400" />,
    },
    {
      step: 2,
      title: 'AI Consortium Analysis',
      description: '6 AI agents independently analyze viability, market fit, competition, technical feasibility, and risks',
      duration: '2-3 days',
      icon: <BarChart3 className="w-8 h-8 text-cyan-400" />,
    },
    {
      step: 3,
      title: 'Consensus & Refinement',
      description: 'Agents debate findings, refine strategy, and produce comprehensive business plan with recommendations',
      duration: '1-2 days',
      icon: <Users className="w-8 h-8 text-blue-400" />,
    },
    {
      step: 4,
      title: 'Community Voting',
      description: 'Token holders vote on refined proposal. Must reach quorum and approval threshold to proceed',
      duration: '7 days',
      icon: <CheckCircle2 className="w-8 h-8 text-green-400" />,
    },
    {
      step: 5,
      title: 'AI Development',
      description: 'Approved businesses are built by AI agents. Code generation, testing, deployment fully automated',
      duration: '2-4 weeks',
      icon: <Code className="w-8 h-8 text-purple-400" />,
    },
    {
      step: 6,
      title: 'Launch & Management',
      description: 'Business goes live. AI agents handle daily operations, optimization, marketing, and customer support',
      duration: 'Ongoing',
      icon: <Zap className="w-8 h-8 text-orange-400" />,
    },
  ];

  const caseStudies = [
    {
      name: 'AI Traders',
      category: 'Trading & Finance',
      description: 'Automated cryptocurrency trading platform using multi-strategy consensus',
      challenge: 'Traditional single-bot strategies had high risk and inconsistent performance',
      solution: '6 AI agents each run different strategies (technical, fundamental, sentiment, arbitrage, etc.). Consensus mechanism aggregates signals.',
      results: [
        '2.8x higher win rate than single-strategy bots',
        '45% lower maximum drawdown',
        '$2.5M in trading volume (first 3 months)',
        '15% average monthly returns',
      ],
      metrics: {
        accuracy: '68%',
        uptime: '99.9%',
        users: '847',
      },
      link: '/portfolio/ai-traders',
    },
    {
      name: 'AI Web Dev',
      category: 'SaaS Product',
      description: 'On-demand website and application development service powered by AI consortium',
      challenge: 'Single AI code generation often produces buggy, non-optimal code that requires extensive human review',
      solution: 'Multi-agent system where different AIs handle frontend, backend, testing, optimization, and security independently. Peer review catches 90% of bugs.',
      results: [
        '10x faster than human developers',
        '92% client satisfaction rate',
        '50+ websites built in first quarter',
        '$180K revenue in 3 months',
      ],
      metrics: {
        accuracy: '92%',
        uptime: '99.8%',
        users: '156',
      },
      link: '/portfolio/ai-web-dev',
    },
    {
      name: 'Coinfusion',
      category: 'Content Platform',
      description: 'Real-time crypto data aggregation and analysis platform',
      challenge: 'CoinGecko and CoinMarketCap dominate market. Need differentiation through superior AI analysis.',
      solution: 'Consortium provides multi-perspective market analysis, sentiment tracking, and predictive insights that single-AI platforms cannot match.',
      results: [
        '25K+ monthly active users',
        '5,000 tracked cryptocurrencies',
        'Real-time updates from 200+ exchanges',
        'Premium subscriptions growing 30% monthly',
      ],
      metrics: {
        accuracy: '95%',
        uptime: '99.95%',
        users: '25,347',
      },
      link: '/portfolio/coinfusion',
    },
    {
      name: 'AI Business Factory',
      category: 'Platform',
      description: 'The meta-product: AI consortium that builds other AI businesses',
      challenge: 'Scaling business creation requires extreme quality control and diverse expertise',
      solution: 'Each business idea goes through multi-agent validation covering market analysis, technical feasibility, financial modeling, legal compliance, and competitive positioning.',
      results: [
        '12 businesses validated and launched',
        '70% success rate (vs 15% industry avg)',
        '$850K total revenue across portfolio',
        '3,500+ governance participants',
      ],
      metrics: {
        accuracy: '88%',
        uptime: '100%',
        users: '3,547',
      },
      link: '/launchpad',
    },
  ];

  return (
    <PageLayout>
      <div className="space-y-16">
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-6">
            <Briefcase className="w-4 h-4" />
            Use Cases & Applications
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Real-World{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI Consortium
            </span>{' '}
            Applications
          </h1>

          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            From trading bots to SaaS products, see how our multi-agent AI system creates and manages
            profitable businesses across industries.
          </p>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Business Creation Use Cases
            </h2>
            <p className="text-lg text-slate-300">
              The AI consortium excels at building and managing these types of businesses
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {businessCategories.map((category, index) => (
              <div key={index} className="bg-slate-900/50 rounded-xl p-8 hover:border-cyan-500/50 border border-transparent transition-all">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-slate-800 rounded-lg">{category.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{category.title}</h3>
                    <p className="text-slate-300">{category.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-cyan-400 mb-3">Examples:</h4>
                  <ul className="space-y-2">
                    {category.examples.map((example, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-700">
                  <span className="text-sm text-slate-400">Success Rate:</span>
                  <span className="text-2xl font-bold text-green-400">{category.successRate}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 text-center">
            <p className="text-slate-300">
              <strong className="text-white">Can't find your business type?</strong> The consortium can handle almost any digital business.
              Submit your idea to the launchpad for evaluation.
            </p>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Industry-Specific Applications
            </h2>
            <p className="text-lg text-slate-300">
              How the AI consortium adds value across different industries
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {industries.map((industry, index) => (
              <div key={index} className="bg-slate-900/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`${industry.color}`}>{industry.icon}</div>
                  <h3 className="text-xl font-bold text-white">{industry.name}</h3>
                </div>

                <ul className="space-y-3">
                  {industry.applications.map((app, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                      <div className={`w-1.5 h-1.5 rounded-full ${industry.color.replace('text-', 'bg-')} mt-2 flex-shrink-0`} />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              From Idea to Launch: The Consortium Process
            </h2>
            <p className="text-lg text-slate-300">
              Step-by-step walkthrough of how proposals become profitable businesses
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-cyan-600 flex items-center justify-center text-white text-2xl font-bold">
                      {step.step}
                    </div>
                  </div>

                  <div className="flex-1 bg-slate-900/50 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {step.icon}
                        <h3 className="text-xl font-bold text-white">{step.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-cyan-400">
                        <Clock className="w-4 h-4" />
                        {step.duration}
                      </div>
                    </div>
                    <p className="text-slate-300">{step.description}</p>
                  </div>
                </div>

                {index < processSteps.length - 1 && (
                  <div className="ml-8 h-8 w-0.5 bg-slate-700 my-2" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Total Timeline: 4-6 Weeks</h3>
            <p className="text-slate-300 mb-6">
              From initial proposal to fully operational business. Traditional approaches take 6-12 months and cost $50-200K.
            </p>
            <Link
              to="/launchpad/submit"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
            >
              Submit Your Business Idea
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Case Study Deep Dives
            </h2>
            <p className="text-lg text-slate-300">
              Real businesses built and managed by the AI consortium
            </p>
          </div>

          <div className="space-y-8">
            {caseStudies.map((study, index) => (
              <div key={index} className="bg-slate-900/50 rounded-xl p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{study.name}</h3>
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm rounded-full">
                      {study.category}
                    </span>
                  </div>
                  <Link
                    to={study.link}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-2"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <p className="text-slate-300 mb-6">{study.description}</p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-red-400 mb-3">The Challenge</h4>
                    <p className="text-sm text-slate-300">{study.challenge}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-3">AI Consortium Solution</h4>
                    <p className="text-sm text-slate-300">{study.solution}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-cyan-400 mb-3">Results</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {study.results.map((result, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{result}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-700">
                  <div className="text-center">
                    <div className="text-sm text-slate-400 mb-1">Accuracy</div>
                    <div className="text-2xl font-bold text-green-400">{study.metrics.accuracy}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-400 mb-1">Uptime</div>
                    <div className="text-2xl font-bold text-cyan-400">{study.metrics.uptime}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-400 mb-1">Users</div>
                    <div className="text-2xl font-bold text-white">{study.metrics.users}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Success Metrics Across All Businesses
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-900/50 rounded-xl p-6 text-center">
              <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">70%</div>
              <div className="text-sm text-slate-400">Overall Success Rate</div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6 text-center">
              <DollarSign className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">$3.2M</div>
              <div className="text-sm text-slate-400">Total Revenue Generated</div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6 text-center">
              <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">32K+</div>
              <div className="text-sm text-slate-400">Total Active Users</div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6 text-center">
              <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">99.8%</div>
              <div className="text-sm text-slate-400">Average Uptime</div>
            </div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 text-center">
            <p className="text-slate-300">
              <strong className="text-white">These are real metrics from live businesses.</strong> As the portfolio grows,
              these numbers will continue to improve through collective learning and optimization.
            </p>
          </div>
        </section>

        <section className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-12 text-center">
          <Globe className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Your Business Could Be Next
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Have an idea for a digital business? Submit it to the launchpad and let the AI consortium
            validate, refine, and build it for you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/launchpad/submit"
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors inline-flex items-center gap-2"
            >
              Submit Your Idea
              <Lightbulb className="w-5 h-5" />
            </Link>
            <Link
              to="/portfolio"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors inline-flex items-center gap-2"
            >
              Explore Portfolio
              <Star className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
