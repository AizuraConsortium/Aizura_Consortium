import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Shield, CheckCircle2, TrendingUp, Users, DollarSign, Activity,
  ArrowRight, Clock, Target, Zap, BarChart3, AlertCircle, Brain,
  Code, Briefcase, Globe, Info
} from 'lucide-react';

export default function FoundationBusinesses() {
  return (
    <PageLayout>
      <div className="space-y-20">
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Foundation Businesses
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Proof the{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI Model Works
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Before opening governance to the community, we validated that AI agents
            can successfully build, launch, and manage real revenue-generating businesses.
          </p>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Foundation Businesses?</h2>

          <div className="max-w-3xl mx-auto space-y-6 text-lg text-slate-300 leading-relaxed mb-10">
            <p>
              Before asking the community to vote on new businesses, we needed to prove the core thesis:
            </p>
            <p className="text-2xl font-bold text-white text-center py-4">
              Can AI agents successfully build, launch, and manage profitable businesses?
            </p>
            <p className="text-cyan-400 font-semibold text-center text-xl">
              The answer is yes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <ValidationCard
              icon={<Brain className="w-8 h-8 text-cyan-400" />}
              title="AI Can Generate Ideas"
              description="Profitable business concepts identified through market analysis"
            />
            <ValidationCard
              icon={<Code className="w-8 h-8 text-green-400" />}
              title="AI Can Execute Development"
              description="Autonomous implementation from concept to production"
            />
            <ValidationCard
              icon={<Activity className="w-8 h-8 text-blue-400" />}
              title="AI Can Manage Operations"
              description="Day-to-day management without human intervention"
            />
            <ValidationCard
              icon={<DollarSign className="w-8 h-8 text-yellow-400" />}
              title="AI Can Generate Revenue"
              description="Consistent income from real customers"
            />
            <ValidationCard
              icon={<Target className="w-8 h-8 text-purple-400" />}
              title="Model Is Sustainable"
              description="Proven viability over multiple months"
            />
            <ValidationCard
              icon={<TrendingUp className="w-8 h-8 text-orange-400" />}
              title="Model Is Scalable"
              description="Framework works across different business types"
            />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white mb-2">Why These Weren't Voted On</h4>
                <p className="text-sm text-slate-300">
                  These businesses were not voted on by the DAO because <strong className="text-white">the DAO didn't exist yet</strong>.
                  They serve as validation that your future votes will lead to real, profitable outcomes.
                  All businesses created after Q2 2025 go through the full DAO governance process.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Timeline: Pre-DAO to DAO Launch</h2>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <TimelineItem
                phase="Q3 2024"
                title="Foundation Concept"
                description="AI Consortium model designed. Foundation businesses identified to validate core thesis."
                status="completed"
              />
              <TimelineItem
                phase="Q4 2024"
                title="First Businesses Live"
                description="AI Traders and Coinfusion launched. Real revenue generation begins. User testing validates model."
                status="completed"
              />
              <TimelineItem
                phase="Q1 2025"
                title="Additional Foundation Businesses"
                description="AI Web Dev and AI Business Factory in development. Metrics tracked, learnings documented."
                status="completed"
              />
              <TimelineItem
                phase="Q2 2025"
                title="Token Launch & DAO Opens"
                description="AAIC token distribution begins. DAO governance activated. Community voting starts."
                status="active"
              />
              <TimelineItem
                phase="Q2 2025+"
                title="Full DAO Governance"
                description="All future businesses go through community proposal, voting, and approval process."
                status="upcoming"
              />
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Validation Complete: Model Proven</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <MetricCard
              icon={<DollarSign className="w-8 h-8 text-green-400" />}
              value="$5M-$20M"
              label="Revenue Target"
              sublabel="Year 2-3 with scaled portfolio"
            />
            <MetricCard
              icon={<Users className="w-8 h-8 text-blue-400" />}
              value="2,400+"
              label="Users Validated Model"
              sublabel="Early adoption proof"
            />
            <MetricCard
              icon={<BarChart3 className="w-8 h-8 text-purple-400" />}
              value="$50M+"
              label="Portfolio Value Potential"
              sublabel="Long-term target with full scaling"
            />
            <MetricCard
              icon={<Activity className="w-8 h-8 text-cyan-400" />}
              value="98%+"
              label="Target Uptime"
              sublabel="Multi-Agent Redundancy"
            />
          </div>

          <div className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white mb-2">How We Achieve High Uptime</h4>
                <p className="text-sm text-slate-300 mb-3">
                  Traditional businesses fail when a key employee is unavailable. Our AI consortium
                  uses <strong className="text-white">6-agent redundancy</strong>: if one AI agent
                  becomes unresponsive or errors out, the remaining 5 agents continue operations seamlessly.
                </p>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Consensus-based decisions:</strong> System continues with 5/6 or 4/6 agreement</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Automatic failover:</strong> Backup API endpoints for each AI provider</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Infrastructure redundancy:</strong> Multi-cloud deployment (AWS + GCP)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Real-time monitoring:</strong> Automatic health checks every 30 seconds</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-4">
                  <strong className="text-slate-300">Industry Context:</strong> AWS EC2 guarantees 99.95% uptime,
                  Google Cloud 99.95%, most startups achieve 98-99.5%. Our target of 98%+ is conservative and
                  achievable with multi-agent architecture. Live monitoring will be published after mainnet launch.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-slate-300 mb-2">
                  <strong className="text-yellow-400">Foundation Validation Context:</strong> The 4 foundation businesses validated that AI agents can successfully build and manage profitable operations. The revenue targets and portfolio valuations shown above represent projections for a fully scaled ecosystem (50+ businesses, 500+ agents) in Years 2-4.
                </p>
                <p className="text-xs text-slate-400">
                  Early validation provided proof of concept. Actual scaled performance will depend on execution quality, market conditions, technological advances, and community governance decisions. Projections are not guarantees of future results.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mt-8">
            <h3 className="text-2xl font-bold text-white mb-6">Key Learnings</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <LearningCard
                title="What Worked Well"
                items={[
                  'AI-driven market research identified profitable niches',
                  'Autonomous deployment reduced time-to-market by 80%',
                  'Real-time monitoring caught issues before users noticed',
                  'Revenue generation validated business model sustainability'
                ]}
                positive
              />
              <LearningCard
                title="What We Improved"
                items={[
                  'Enhanced fraud detection and security measures',
                  'Optimized resource allocation for cost efficiency',
                  'Improved user onboarding flows based on feedback',
                  'Refined revenue tracking and reporting systems'
                ]}
                positive={false}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Foundation Business Portfolio</h2>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <BusinessFeatureCard
              icon={<TrendingUp className="w-12 h-12 text-cyan-400" />}
              name="AI Traders"
              tagline="Autonomous Crypto Trading Platform"
              description="AI-powered trading algorithms that execute strategies 24/7 across multiple exchanges. Proven profitability with transparent performance tracking."
              metrics={[
                { label: 'Monthly Volume', value: '$850K+' },
                { label: 'Active Traders', value: '1,200+' },
                { label: 'Avg Return', value: '12.4%' }
              ]}
              link="/portfolio/ai-traders"
              status="Active"
            />
            <BusinessFeatureCard
              icon={<Globe className="w-12 h-12 text-blue-400" />}
              name="Coinfusion"
              tagline="Crypto News & Analysis Hub"
              description="Real-time crypto news aggregation and AI-powered analysis. Serves institutional and retail traders with actionable insights."
              metrics={[
                { label: 'Monthly Users', value: '8,500+' },
                { label: 'Articles/Day', value: '150+' },
                { label: 'Avg Session', value: '6.2min' }
              ]}
              link="/portfolio/coinfusion"
              status="Active"
            />
            <BusinessFeatureCard
              icon={<Code className="w-12 h-12 text-green-400" />}
              name="AI Web Dev"
              tagline="Autonomous Development Agency"
              description="AI agents that build custom web applications from requirements to deployment. Validated with real client projects."
              metrics={[
                { label: 'Projects', value: '24' },
                { label: 'Clients', value: '18' },
                { label: 'Satisfaction', value: '4.7/5' }
              ]}
              link="/portfolio/ai-web-dev"
              status="Beta"
            />
            <BusinessFeatureCard
              icon={<Briefcase className="w-12 h-12 text-purple-400" />}
              name="AI Business Factory"
              tagline="Business Creation Platform"
              description="Helps users launch AI-managed micro-businesses. From idea validation to automated operations."
              metrics={[
                { label: 'Internal Tests', value: '42' },
                { label: 'Beta Users', value: '380' },
                { label: 'Projected Success', value: '60-70%' }
              ]}
              link="/portfolio/ai-business-factory"
              status="Beta"
            />
          </div>

          <div className="text-center">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
            >
              View Full Portfolio
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Why AI Businesses Have Higher Success Rates
          </h2>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <TrendingDown className="w-6 h-6 text-red-400" />
                Why 70-90% of Traditional Businesses Fail
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white text-sm">High Fixed Costs</div>
                      <p className="text-xs text-slate-400">$500K-$900K annual burn before revenue</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white text-sm">Low Profit Margins</div>
                      <p className="text-xs text-slate-400">70% of revenue goes to salaries and overhead</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white text-sm">Slow Iteration</div>
                      <p className="text-xs text-slate-400">Hiring delays = missed market opportunities</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white text-sm">Cash Flow Crunch</div>
                      <p className="text-xs text-slate-400">Run out of money before product-market fit</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white text-sm">Limited Experiments</div>
                      <p className="text-xs text-slate-400">Can only afford 1-2 pivots before bankruptcy</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white text-sm">Insufficient Marketing</div>
                      <p className="text-xs text-slate-400">No budget left for customer acquisition</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-sm text-slate-300">
                  <strong className="text-red-400">Industry Data:</strong> 20% of businesses fail in Year 1,
                  50% by Year 5, 70% by Year 10. Primary cause: <strong className="text-white">cash flow problems
                  driven by high operational costs</strong>.
                </p>
                <div className="text-xs text-slate-400 mt-2">
                  Sources:
                  <a href="https://www.sba.gov/business-guide/plan-your-business/calculate-your-startup-costs"
                     target="_blank" rel="noopener noreferrer"
                     className="text-cyan-400 hover:text-cyan-300 underline ml-1">
                    U.S. Small Business Administration
                  </a>,
                  <a href="https://www.cbinsights.com/research/startup-failure-reasons-top/"
                     target="_blank" rel="noopener noreferrer"
                     className="text-cyan-400 hover:text-cyan-300 underline ml-1">
                    CB Insights Startup Failure Analysis
                  </a>,
                  <a href="https://www.failory.com/blog/startup-success-rate"
                     target="_blank" rel="noopener noreferrer"
                     className="text-cyan-400 hover:text-cyan-300 underline ml-1">
                    Failory Statistics
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-green-400" />
                Why AI Businesses Flip the Success Rate
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">90% Cost Reduction = 10x More Experiments</h4>
                    <p className="text-sm text-slate-300">
                      With annual costs of $18K-$65K instead of $530K-$900K, you can afford to fail 10-20 times
                      before finding a winner. Traditional businesses can only afford 1-2 attempts.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">Profit Margins 5-10x Higher</h4>
                    <p className="text-sm text-slate-300">
                      A business earning $10K/month revenue: Traditional keeps $3K profit (70% to costs).
                      AI keeps $9K profit (10% to costs). This means you're profitable at $2K/month revenue
                      vs needing $15K/month for traditional.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">Faster Iteration = Better Product-Market Fit</h4>
                    <p className="text-sm text-slate-300">
                      AI can test 5 variations of a product in the time it takes traditional teams to build 1.
                      More iterations = higher chance of finding what customers want.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">Infinite Runway = No Panic Decisions</h4>
                    <p className="text-sm text-slate-300">
                      With $50K annual costs, a $500K treasury lasts 10 years. No desperate pivots,
                      no rushed launches, no compromises to appease investors.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-500/10 to-green-500/10 border border-cyan-500/30 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">The Math</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-center mb-3">
                    <div className="text-3xl font-bold text-red-400">10-20%</div>
                    <div className="text-sm text-slate-400">Traditional Success Rate</div>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <div>• High costs force rushed decisions</div>
                    <div>• Low margins = no room for error</div>
                    <div>• 1-2 pivots maximum before bankruptcy</div>
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-center mb-3">
                    <div className="text-3xl font-bold text-green-400">60-70%</div>
                    <div className="text-sm text-slate-400">Projected AI Success Rate</div>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <div>• Low costs enable patient experimentation</div>
                    <div>• High margins = profitable quickly</div>
                    <div>• 10-20 pivots possible with same capital</div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-300 text-center">
                <strong className="text-cyan-400">Projected 3-6x success rate improvement</strong> through cost structure inversion
              </p>
              <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-xs text-slate-300">
                  <strong className="text-yellow-400">Methodology:</strong> Success rate projection based on:
                  (1) Industry failure analysis showing 82% of failures due to cash flow/cost issues,
                  (2) Our 90% cost reduction eliminating primary failure cause,
                  (3) Conservative assumption that cost reduction alone improves success rate by 3-6x.
                  Actual results will be tracked and published as businesses launch. This is not a guarantee.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What's Next: DAO Governance</h2>

          <div className="max-w-3xl mx-auto space-y-6 text-lg text-slate-300 leading-relaxed mb-10">
            <p>
              Foundation businesses proved the model works. Now it's time for the community to take control.
            </p>
            <p>
              <strong className="text-white">All future businesses</strong> will go through the full DAO governance process:
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-10">
            <ProcessStep
              number="1"
              title="Proposal"
              description="Community member submits business idea with detailed plan"
            />
            <ProcessStep
              number="2"
              title="Discussion"
              description="AI agents and community provide feedback and refinements"
            />
            <ProcessStep
              number="3"
              title="Voting"
              description="Token holders vote with transparent weighted voting"
            />
            <ProcessStep
              number="4"
              title="Execution"
              description="Approved businesses built and launched by AI agents"
            />
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
            <h4 className="font-bold text-white mb-3 text-center">Ready to Participate?</h4>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/launchpad"
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors text-center"
              >
                View Active Proposals
              </Link>
              <Link
                to="/governance"
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors text-center"
              >
                Learn About Governance
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function ValidationCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}

function TimelineItem({ phase, title, description, status }: {
  phase: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'upcoming';
}) {
  const statusConfig = {
    completed: { bg: 'bg-green-500', icon: <CheckCircle2 className="w-6 h-6" />, color: 'text-green-400' },
    active: { bg: 'bg-cyan-500', icon: <Zap className="w-6 h-6" />, color: 'text-cyan-400' },
    upcoming: { bg: 'bg-slate-500', icon: <Clock className="w-6 h-6" />, color: 'text-slate-400' }
  };

  const config = statusConfig[status];

  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center">
        <div className={`w-12 h-12 rounded-full ${config.bg} flex items-center justify-center text-white flex-shrink-0`}>
          {config.icon}
        </div>
        {status !== 'upcoming' && <div className="w-0.5 h-full bg-slate-700 mt-2" />}
      </div>
      <div className="flex-1 pb-8">
        <div className={`text-sm font-bold ${config.color} mb-1`}>{phase}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-300">{description}</p>
      </div>
    </div>
  );
}

function MetricCard({ icon, value, label, sublabel }: {
  icon: React.ReactNode;
  value: string;
  label: string;
  sublabel: string;
}) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-300 mb-1">{label}</div>
      <div className="text-xs text-slate-500">{sublabel}</div>
    </div>
  );
}

function LearningCard({ title, items, positive }: {
  title: string;
  items: string[];
  positive: boolean;
}) {
  return (
    <div>
      <h4 className="font-bold text-white mb-4">{title}</h4>
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${positive ? 'text-green-400' : 'text-cyan-400'}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BusinessFeatureCard({ icon, name, tagline, description, metrics, link, status }: {
  icon: React.ReactNode;
  name: string;
  tagline: string;
  description: string;
  metrics: { label: string; value: string }[];
  link: string;
  status: string;
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h3 className="text-xl font-bold text-white">{name}</h3>
            <p className="text-sm text-slate-400">{tagline}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          status === 'Active'
            ? 'bg-green-500/20 text-green-400 border border-green-500/40'
            : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
        }`}>
          {status}
        </span>
      </div>

      <p className="text-slate-300 mb-4">{description}</p>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="text-center">
            <div className="text-lg font-bold text-cyan-400">{metric.value}</div>
            <div className="text-xs text-slate-500">{metric.label}</div>
          </div>
        ))}
      </div>

      <Link
        to={link}
        className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
      >
        View Details
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

function ProcessStep({ number, title, description }: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 mx-auto">
        {number}
      </div>
      <h4 className="font-bold text-white mb-2">{title}</h4>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}
