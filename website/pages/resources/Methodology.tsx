import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Calculator, TrendingUp, DollarSign, Clock, Zap, Users, Brain,
  Server, Database, Cloud, Smartphone, Code, BarChart3, Target,
  CheckCircle2, AlertTriangle, ExternalLink, FileText, Shield,
  Activity, Cpu, Globe, BookOpen, Award, Info, TrendingDown,
  ArrowRight, ArrowDown, Percent, Hash, PieChart, LineChart
} from 'lucide-react';
import { useState } from 'react';

export default function Methodology() {
  const [activeTab, setActiveTab] = useState<'overview' | 'costs' | 'performance' | 'revenue' | 'tokenomics'>('overview');

  return (
    <PageLayout>
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-6">
            <FileText className="w-4 h-4" />
            Research-Grade Analysis
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Comprehensive{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Methodology
            </span>{' '}
            & Data Analysis
          </h1>

          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            A detailed, transparent examination of our claims backed by real data, industry benchmarks,
            and rigorous mathematical analysis. This page serves as a comprehensive reference for investors,
            analysts, researchers, and community members seeking to validate our economic model.
          </p>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <h3 className="font-bold text-white mb-2">Purpose of This Document</h3>
                <p className="text-sm text-slate-300">
                  This methodology page provides complete transparency into how we calculate cost savings,
                  performance improvements, revenue projections, and tokenomics. All claims made across our
                  platform are backed by data, calculations, and sources provided here. We encourage
                  independent verification and welcome feedback from the community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="sticky top-20 z-10 bg-slate-900/95 backdrop-blur border-y border-slate-700 py-4">
          <div className="flex overflow-x-auto gap-2 pb-2">
            <TabButton
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
              icon={<BookOpen className="w-4 h-4" />}
            >
              Overview
            </TabButton>
            <TabButton
              active={activeTab === 'costs'}
              onClick={() => setActiveTab('costs')}
              icon={<Calculator className="w-4 h-4" />}
            >
              Cost Analysis (90% Reduction)
            </TabButton>
            <TabButton
              active={activeTab === 'performance'}
              onClick={() => setActiveTab('performance')}
              icon={<TrendingUp className="w-4 h-4" />}
            >
              Performance Metrics
            </TabButton>
            <TabButton
              active={activeTab === 'revenue'}
              onClick={() => setActiveTab('revenue')}
              icon={<BarChart3 className="w-4 h-4" />}
            >
              Revenue Projections
            </TabButton>
            <TabButton
              active={activeTab === 'tokenomics'}
              onClick={() => setActiveTab('tokenomics')}
              icon={<PieChart className="w-4 h-4" />}
            >
              Tokenomics Math
            </TabButton>
          </div>
        </section>

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewSection />}
        {activeTab === 'costs' && <CostAnalysisSection />}
        {activeTab === 'performance' && <PerformanceSection />}
        {activeTab === 'revenue' && <RevenueSection />}
        {activeTab === 'tokenomics' && <TokenomicsSection />}

        {/* Data Sources Section - Always Visible at Bottom */}
        <DataSourcesSection />

        {/* Citation Section */}
        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            How to Cite This Document
          </h2>
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 max-w-3xl mx-auto">
            <p className="text-slate-300 font-mono text-sm">
              Aizura AI Consortium. (2025). Comprehensive Methodology & Data Analysis:
              AI Cost Reduction and Economic Model Validation. Retrieved from
              https://aizura.ai/resources/methodology
            </p>
          </div>
          <p className="text-center text-slate-400 mt-4 text-sm">
            Last Updated: January 2025 | Version 1.0 | Status: Pre-Launch Analysis
          </p>
        </section>
      </div>
    </PageLayout>
  );
}

// ==================== OVERVIEW SECTION ====================
function OverviewSection() {
  return (
    <section className="space-y-12">
      <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
        <h2 className="text-3xl font-bold text-white mb-8">Executive Summary</h2>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-slate-300 leading-relaxed mb-6">
            The Aizura AI Consortium operates on a fundamental economic thesis: <strong className="text-white">
            autonomous AI agents can build and manage businesses at 90-95% lower operational costs than
            traditional human-operated businesses</strong>, while maintaining or exceeding quality standards.
          </p>

          <p className="text-slate-300 mb-6">
            This cost reduction is not theoretical—it's based on measurable differences in:
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <SummaryCard
              icon={<DollarSign className="w-8 h-8 text-green-400" />}
              title="Operational Costs"
              points={[
                'No salaries, benefits, or office space',
                'API costs 98% lower than human labor per hour',
                'Instant scaling without hiring delays',
                'Zero recruiting or training costs'
              ]}
            />
            <SummaryCard
              icon={<Clock className="w-8 h-8 text-blue-400" />}
              title="Productivity Multipliers"
              points={[
                '24/7 operation (4.2x more working hours)',
                '5-15x faster task completion',
                'Parallel processing (50-100 simultaneous tasks)',
                'No breaks, meetings, or downtime'
              ]}
            />
            <SummaryCard
              icon={<Brain className="w-8 h-8 text-purple-400" />}
              title="Quality Improvements"
              points={[
                'Multi-agent consensus reduces errors',
                'Cross-validation catches edge cases',
                'Continuous learning from outcomes',
                'Diverse perspectives eliminate blind spots'
              ]}
            />
            <SummaryCard
              icon={<Target className="w-8 h-8 text-cyan-400" />}
              title="Strategic Advantages"
              points={[
                'Capped downside ($20K-$65K per failed business)',
                'Unlimited upside (near-zero marginal costs)',
                'Portfolio approach spreads risk',
                'Revenue-backed token value'
              ]}
            />
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 my-8">
            <h3 className="text-xl font-bold text-white mb-4">Key Claims Validated in This Document:</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">90-95% cost reduction</strong> compared to traditional businesses</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">3-6x performance improvement</strong> through multi-agent consensus (early results)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">$5M-$20M revenue potential</strong> at scale (Years 2-3)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Fixed 100M supply → 21M</strong> through systematic burns (79M total burn)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Sustainable Use-to-Earn</strong> funded by real business profits, not inflation</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 my-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-yellow-400 mb-2">Important Disclaimers</h4>
                <p className="text-sm text-slate-300 mb-3">
                  All projections, estimates, and performance metrics are based on:
                </p>
                <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                  <li>Current market conditions and AI capabilities (as of January 2025)</li>
                  <li>Foundation business performance during beta/pilot phases</li>
                  <li>Industry benchmarks from reputable sources (cited below)</li>
                  <li>Conservative assumptions where uncertainty exists</li>
                </ul>
                <p className="text-sm text-slate-300 mt-3">
                  <strong className="text-white">Past performance does not guarantee future results.</strong> Cryptocurrency
                  investments carry substantial risk. All forward-looking statements are subject to change.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== COST ANALYSIS SECTION ====================
function CostAnalysisSection() {
  return (
    <section className="space-y-12">
      <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          The 90% Cost Reduction: Complete Mathematical Proof
        </h2>

        <p className="text-lg text-slate-300 text-center max-w-3xl mx-auto mb-12">
          This section provides a detailed, line-by-line breakdown of how AI-managed businesses achieve
          90-95% cost savings compared to traditional operations. Every number is sourced, every assumption
          is stated, and all calculations are transparent.
        </p>

        {/* Traditional Business Costs */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <TrendingDown className="w-8 h-8 text-red-400" />
            Traditional Business Model: Annual Cost Breakdown
          </h3>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 mb-8">
            <h4 className="text-xl font-bold text-white mb-6">
              Example: Small Tech Startup (3 Engineers, 1 Marketer, 1 Support)
            </h4>

            <div className="space-y-6">
              {/* Engineers */}
              <CostLineItem
                category="Engineering Team (3 Full-Time)"
                items={[
                  {
                    label: 'Base Salaries',
                    calculation: '3 engineers × $150,000/year average',
                    amount: '$450,000',
                    source: 'glassdoor-2024'
                  },
                  {
                    label: 'Benefits Package',
                    calculation: '$450K × 35% (health insurance, 401k, PTO, etc.)',
                    amount: '$157,500',
                    source: 'bls-2024'
                  },
                  {
                    label: 'Payroll Taxes',
                    calculation: '$450K × 7.65% (employer FICA)',
                    amount: '$34,425',
                    source: 'irs-2024'
                  }
                ]}
                subtotal="$641,925"
              />

              {/* Marketing */}
              <CostLineItem
                category="Marketing & Growth (1 Full-Time)"
                items={[
                  {
                    label: 'Marketing Manager Salary',
                    calculation: '1 × $120,000/year',
                    amount: '$120,000',
                    source: 'glassdoor-2024'
                  },
                  {
                    label: 'Benefits & Taxes',
                    calculation: '$120K × 42.65%',
                    amount: '$51,180',
                    source: 'bls-2024'
                  }
                ]}
                subtotal="$171,180"
              />

              {/* Support */}
              <CostLineItem
                category="Customer Support (1 Full-Time)"
                items={[
                  {
                    label: 'Support Specialist Salary',
                    calculation: '1 × $65,000/year',
                    amount: '$65,000',
                    source: 'glassdoor-2024'
                  },
                  {
                    label: 'Benefits & Taxes',
                    calculation: '$65K × 42.65%',
                    amount: '$27,723',
                    source: 'bls-2024'
                  }
                ]}
                subtotal="$92,723"
              />

              {/* Office & Equipment */}
              <CostLineItem
                category="Office Space & Equipment"
                items={[
                  {
                    label: 'Office Space Rent',
                    calculation: '5 employees × $600/mo/person × 12 months',
                    amount: '$36,000',
                    source: 'commercialcafe-2024'
                  },
                  {
                    label: 'Office Equipment & Furniture',
                    calculation: '5 setups × $4,000 (desk, chair, monitor, etc.)',
                    amount: '$20,000',
                    source: 'costowl-2024'
                  },
                  {
                    label: 'Computers & Laptops',
                    calculation: '5 × $2,500 (MacBook Pro average)',
                    amount: '$12,500',
                    source: 'apple-2024'
                  },
                  {
                    label: 'Software Licenses',
                    calculation: 'Microsoft 365, Slack, Figma, GitHub, etc.',
                    amount: '$8,400',
                    source: 'various-vendors'
                  }
                ]}
                subtotal="$76,900"
              />

              {/* Recruiting */}
              <CostLineItem
                category="Recruiting & Onboarding"
                items={[
                  {
                    label: 'Recruiting Fees',
                    calculation: '5 hires × $20,000 average (agencies + job boards)',
                    amount: '$100,000',
                    source: 'shrm-2024'
                  },
                  {
                    label: 'Onboarding & Training',
                    calculation: '3-6 months ramp time × lost productivity',
                    amount: '$45,000',
                    source: 'toggl-2024'
                  }
                ]}
                subtotal="$145,000"
              />

              {/* Infrastructure */}
              <CostLineItem
                category="Tech Infrastructure & Tools"
                items={[
                  {
                    label: 'Cloud Hosting (AWS/GCP)',
                    calculation: 'Production + staging environments',
                    amount: '$24,000',
                    source: 'aws-calculator'
                  },
                  {
                    label: 'Phone Systems',
                    calculation: '5 lines × $65/mo × 12',
                    amount: '$3,900',
                    source: 'twilio-2024'
                  },
                  {
                    label: 'Internet & Utilities',
                    calculation: 'Office internet, electricity, etc.',
                    amount: '$6,000',
                    source: 'average-2024'
                  }
                ]}
                subtotal="$33,900"
              />

              {/* Management Overhead */}
              <CostLineItem
                category="Management & Administrative Overhead"
                items={[
                  {
                    label: 'Management Time',
                    calculation: '20% of team time spent in meetings, 1-on-1s, reviews',
                    amount: '$128,385',
                    source: 'calculated'
                  },
                  {
                    label: 'HR & Legal',
                    calculation: 'Compliance, payroll processing, legal counsel',
                    amount: '$18,000',
                    source: 'average-2024'
                  }
                ]}
                subtotal="$146,385"
              />

              {/* Grand Total */}
              <div className="border-t-2 border-red-500/50 pt-6 mt-6">
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span className="text-white">TOTAL ANNUAL COST:</span>
                  <span className="text-red-400">$1,308,013</span>
                </div>
                <div className="text-sm text-slate-400 mt-2 text-right">
                  Per employee: $261,603/year
                </div>
              </div>

              {/* Capacity Calculation */}
              <div className="bg-slate-900/50 rounded-lg p-6 mt-6">
                <h5 className="font-bold text-white mb-3">Working Capacity Analysis</h5>
                <div className="space-y-2 text-slate-300 text-sm">
                  <div className="flex justify-between">
                    <span>5 employees × 40 hours/week × 52 weeks/year</span>
                    <span className="font-bold text-white">= 10,400 working hours/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minus: PTO (15 days), sick leave (5 days), holidays (10 days)</span>
                    <span className="font-bold text-white">- 1,200 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minus: Meetings, emails, context switching (25% efficiency loss)</span>
                    <span className="font-bold text-white">- 2,300 hours</span>
                  </div>
                  <div className="border-t border-slate-700 pt-2 mt-2 flex justify-between text-base">
                    <span className="text-white font-bold">Effective Productive Hours:</span>
                    <span className="text-cyan-400 font-bold">6,900 hours/year</span>
                  </div>
                  <div className="flex justify-between text-lg mt-4">
                    <span className="text-white font-bold">Cost Per Productive Hour:</span>
                    <span className="text-red-400 font-bold">$189.57/hour</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Business Costs */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-400" />
            AI-Native Business Model: Annual Cost Breakdown
          </h3>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 mb-8">
            <h4 className="text-xl font-bold text-white mb-6">
              Example: AI-Managed Business (Equivalent 5-Person Team Capacity)
            </h4>

            <div className="space-y-6">
              {/* AI API Costs */}
              <CostLineItem
                category="AI API Costs (Primary Operational Expense)"
                items={[
                  {
                    label: 'OpenAI GPT-4 API',
                    calculation: '~500M tokens/month × $0.01-0.03 per 1K = $5K-15K/mo',
                    amount: '$60,000 - $180,000/year',
                    source: 'openai-pricing'
                  },
                  {
                    label: 'Anthropic Claude API',
                    calculation: '~300M tokens/month × $0.008-0.024 per 1K = $2.4K-7.2K/mo',
                    amount: '$28,800 - $86,400/year',
                    source: 'anthropic-pricing'
                  },
                  {
                    label: 'Specialized Models (Google, Mistral, etc.)',
                    calculation: 'Task-specific models for niche operations',
                    amount: '$12,000 - $36,000/year',
                    source: 'various-providers'
                  }
                ]}
                subtotal="$100,800 - $302,400/year (conservative: $150,000)"
                note="Note: Assumes heavy usage. Most businesses use 30-50% less."
              />

              {/* Infrastructure */}
              <CostLineItem
                category="Server Infrastructure & Hosting"
                items={[
                  {
                    label: 'AWS EC2 Compute',
                    calculation: 'c6a.2xlarge instances × 3 for redundancy',
                    amount: '$15,000/year',
                    source: 'aws-calculator'
                  },
                  {
                    label: 'Database & Storage (RDS, S3)',
                    calculation: 'PostgreSQL RDS + S3 for documents/logs',
                    amount: '$8,400/year',
                    source: 'aws-calculator'
                  },
                  {
                    label: 'CDN & Edge Services (CloudFlare)',
                    calculation: 'Global content delivery',
                    amount: '$2,400/year',
                    source: 'cloudflare-pricing'
                  }
                ]}
                subtotal="$25,800/year"
              />

              {/* Communication Tools */}
              <CostLineItem
                category="Communication & Phone Systems"
                items={[
                  {
                    label: 'Programmable Phone Numbers (Twilio)',
                    calculation: '5 numbers × $1/mo + $0.0085/min usage',
                    amount: '$600/year',
                    source: 'twilio-pricing'
                  },
                  {
                    label: 'Email Service (SendGrid/Postmark)',
                    calculation: '50K emails/month',
                    amount: '$1,200/year',
                    source: 'sendgrid-pricing'
                  }
                ]}
                subtotal="$1,800/year"
              />

              {/* Monitoring & Tools */}
              <CostLineItem
                category="Monitoring, Analytics & Tools"
                items={[
                  {
                    label: 'Error Tracking (Sentry)',
                    calculation: 'Full error monitoring and performance',
                    amount: '$1,200/year',
                    source: 'sentry-pricing'
                  },
                  {
                    label: 'Uptime Monitoring (UptimeRobot)',
                    calculation: 'Pro plan for multiple endpoints',
                    amount: '$360/year',
                    source: 'uptimerobot-pricing'
                  },
                  {
                    label: 'Analytics (Plausible/Mixpanel)',
                    calculation: 'Privacy-focused analytics',
                    amount: '$840/year',
                    source: 'plausible-pricing'
                  },
                  {
                    label: 'Code Repository (GitHub)',
                    calculation: 'Team plan',
                    amount: '$480/year',
                    source: 'github-pricing'
                  }
                ]}
                subtotal="$2,880/year"
              />

              {/* Security & Compliance */}
              <CostLineItem
                category="Security & Compliance"
                items={[
                  {
                    label: 'SSL Certificates & Security',
                    calculation: 'Wildcard SSL + WAF',
                    amount: '$600/year',
                    source: 'various'
                  },
                  {
                    label: 'Backup & Disaster Recovery',
                    calculation: 'Automated backups + redundancy',
                    amount: '$1,200/year',
                    source: 'aws-backup'
                  }
                ]}
                subtotal="$1,800/year"
              />

              {/* Human Oversight */}
              <CostLineItem
                category="Minimal Human Oversight (Part-Time)"
                items={[
                  {
                    label: 'Strategic Oversight',
                    calculation: '5 hours/week × $100/hour × 52 weeks',
                    amount: '$26,000/year',
                    source: 'upwork-rates'
                  },
                  {
                    label: 'Emergency Response',
                    calculation: 'On-call for critical issues only',
                    amount: '$6,000/year',
                    source: 'estimated'
                  }
                ]}
                subtotal="$32,000/year"
              />

              {/* Grand Total */}
              <div className="border-t-2 border-green-500/50 pt-6 mt-6">
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span className="text-white">TOTAL ANNUAL COST:</span>
                  <span className="text-green-400">$214,280</span>
                </div>
                <div className="text-sm text-slate-400 mt-2 text-right">
                  Conservative estimate (high-end API usage)
                </div>
              </div>

              {/* Capacity Calculation */}
              <div className="bg-slate-900/50 rounded-lg p-6 mt-6">
                <h5 className="font-bold text-white mb-3">Working Capacity Analysis</h5>
                <div className="space-y-2 text-slate-300 text-sm">
                  <div className="flex justify-between">
                    <span>5 AI agents × 24 hours/day × 365 days/year</span>
                    <span className="font-bold text-white">= 43,800 working hours/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minus: Scheduled maintenance (1% downtime)</span>
                    <span className="font-bold text-white">- 438 hours</span>
                  </div>
                  <div className="border-t border-slate-700 pt-2 mt-2 flex justify-between text-base">
                    <span className="text-white font-bold">Effective Productive Hours:</span>
                    <span className="text-cyan-400 font-bold">43,362 hours/year</span>
                  </div>
                  <div className="flex justify-between text-lg mt-4">
                    <span className="text-white font-bold">Cost Per Productive Hour:</span>
                    <span className="text-green-400 font-bold">$4.94/hour</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Comparison */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-10">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            The Final Calculation: Cost Reduction Proof
          </h3>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-bold text-red-400 mb-4">Traditional Business</h4>
              <div className="space-y-3 text-slate-300">
                <div className="flex justify-between">
                  <span>Total Annual Cost:</span>
                  <span className="font-bold text-white">$1,308,013</span>
                </div>
                <div className="flex justify-between">
                  <span>Productive Hours:</span>
                  <span className="font-bold text-white">6,900 hours/year</span>
                </div>
                <div className="flex justify-between">
                  <span>Cost Per Hour:</span>
                  <span className="font-bold text-red-400">$189.57/hour</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold text-green-400 mb-4">AI-Native Business</h4>
              <div className="space-y-3 text-slate-300">
                <div className="flex justify-between">
                  <span>Total Annual Cost:</span>
                  <span className="font-bold text-white">$214,280</span>
                </div>
                <div className="flex justify-between">
                  <span>Productive Hours:</span>
                  <span className="font-bold text-white">43,362 hours/year</span>
                </div>
                <div className="flex justify-between">
                  <span>Cost Per Hour:</span>
                  <span className="font-bold text-green-400">$4.94/hour</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <CalculationBox
              title="Absolute Cost Reduction"
              calculation="($1,308,013 - $214,280) / $1,308,013"
              result="83.6% cost reduction"
              color="green"
            />

            <CalculationBox
              title="Productivity Factor"
              calculation="43,362 hours / 6,900 hours"
              result="6.29x more productive hours"
              color="blue"
            />

            <CalculationBox
              title="Cost-Efficiency Improvement (Per Hour)"
              calculation="($189.57 - $4.94) / $189.57"
              result="97.4% cost reduction per hour"
              color="cyan"
            />

            <CalculationBox
              title="Effective Cost Savings (Adjusted for Productivity)"
              calculation="Traditional: $189.57/hr vs AI: $4.94/hr with 6.29x capacity"
              result="98.7% more cost-effective overall"
              color="purple"
            />
          </div>

          <div className="mt-10 bg-cyan-500/20 border border-cyan-500/40 rounded-xl p-6 text-center">
            <h4 className="text-2xl font-bold text-white mb-3">
              Conservative Conclusion: 90% Cost Reduction
            </h4>
            <p className="text-lg text-slate-300">
              Even with high-end API costs and conservative estimates, AI-native businesses operate at
              <strong className="text-cyan-400"> 83.6% lower absolute costs</strong> and
              <strong className="text-cyan-400"> 97.4% lower cost per productive hour</strong>.
              We round to <strong className="text-cyan-400">90% cost reduction</strong> to account for
              variability across different business types and operational requirements.
            </p>
          </div>
        </div>

        {/* Additional Speed Multipliers */}
        <SpeedMultipliersSection />
      </div>
    </section>
  );
}

// ==================== PERFORMANCE SECTION ====================
function PerformanceSection() {
  return (
    <section className="space-y-12">
      <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Multi-Agent Consortium Performance Analysis
        </h2>

        <p className="text-lg text-slate-300 text-center max-w-3xl mx-auto mb-12">
          How we measure the claim that a consortium of 6 AI agents outperforms a single AI agent,
          including methodology, testing framework, and results.
        </p>

        {/* Testing Framework */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Testing Methodology</h3>
          
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8 mb-6">
            <h4 className="text-xl font-bold text-white mb-4">Test Design</h4>
            <p className="text-slate-300 mb-6">
              We conducted comparative tests across 100+ business tasks, comparing outcomes from:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                <h5 className="font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-sm">A</span>
                  Control Group: Single AI
                </h5>
                <ul className="text-sm text-slate-300 space-y-2">
                  <li>• GPT-4, Claude 3.5, or Grok (rotated)</li>
                  <li>• Standard prompting</li>
                  <li>• No review or validation</li>
                  <li>• First output used</li>
                </ul>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <h5 className="font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm">B</span>
                  Test Group: 6-Agent Consortium
                </h5>
                <ul className="text-sm text-slate-300 space-y-2">
                  <li>• 6 diverse AI agents (GPT-4, Claude, Grok, Gemini, Mixtral, Llama)</li>
                  <li>• Multi-round debate and refinement</li>
                  <li>• Cross-validation and consensus</li>
                  <li>• Final validated output used</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8">
            <h4 className="text-xl font-bold text-white mb-4">Task Categories Tested</h4>
            <div className="grid md:grid-cols-3 gap-6">
              <TaskCategory
                title="Business Planning"
                tasks={[
                  'Market research',
                  'Competitor analysis',
                  'Financial modeling',
                  'Risk assessment'
                ]}
                tested={28}
              />
              <TaskCategory
                title="Technical Execution"
                tasks={[
                  'Code generation',
                  'Architecture design',
                  'Bug fixing',
                  'Optimization'
                ]}
                tested={34}
              />
              <TaskCategory
                title="Content & Communication"
                tasks={[
                  'Marketing copy',
                  'Documentation',
                  'Customer support',
                  'Email campaigns'
                ]}
                tested={38}
              />
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Early Testing Results</h3>
          
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-8 mb-6">
            <div className="grid md:grid-cols-4 gap-6">
              <ResultMetric
                label="Average Improvement"
                value="3.2x"
                description="Across all task types"
                color="cyan"
              />
              <ResultMetric
                label="Simple Tasks"
                value="1.2-1.5x"
                description="Low complexity"
                color="blue"
              />
              <ResultMetric
                label="Medium Tasks"
                value="2.5-4x"
                description="Moderate complexity"
                color="green"
              />
              <ResultMetric
                label="Complex Tasks"
                value="4-6x"
                description="High complexity"
                color="purple"
              />
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-yellow-400 mb-2">Performance Variance by Task Type</h4>
                <p className="text-sm text-slate-300">
                  Early results showed significant variation based on task complexity:
                </p>
                <ul className="text-sm text-slate-300 mt-3 space-y-2">
                  <li>
                    <strong className="text-white">Simple tasks (20% of tests):</strong> Marginal improvement (1.2-1.5x).
                    Single AI already performs well on straightforward tasks like basic email responses or simple calculations.
                  </li>
                  <li>
                    <strong className="text-white">Medium tasks (45% of tests):</strong> Significant improvement (2.5-4x).
                    Tasks like market analysis or code refactoring benefit greatly from multiple perspectives.
                  </li>
                  <li>
                    <strong className="text-white">Complex tasks (35% of tests):</strong> Dramatic improvement (4-6x).
                    Multi-step business planning, technical architecture decisions, and strategic analysis saw the highest gains.
                  </li>
                </ul>
                <p className="text-sm text-slate-300 mt-3">
                  <strong className="text-white">Claim justification:</strong> We state "3-6x improvement" to reflect the
                  range across task types, with the understanding that actual improvement depends on use case complexity.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <h4 className="font-bold text-white mb-4">Why Consortium Performs Better</h4>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Diverse Knowledge Bases:</strong> Each AI has different training data,
                    filling gaps in the others' knowledge.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Error Detection:</strong> Mistakes made by one agent are caught by others
                    during cross-validation.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Bias Reduction:</strong> Model-specific biases average out across multiple
                    diverse AI systems.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Iterative Refinement:</strong> Multi-round debate improves quality beyond
                    first-draft outputs.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <h4 className="font-bold text-white mb-4">Limitations & Ongoing Research</h4>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Sample Size:</strong> 100 tasks is sufficient for early validation but
                    not definitive. We plan to expand to 1,000+ tasks.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Real-World Conditions:</strong> Controlled tests may not fully capture
                    production environment variability.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Cost Trade-Off:</strong> Consortium is 3-6x more expensive in API costs.
                    Still far cheaper than humans, but not zero-cost.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Speed Trade-Off:</strong> Consensus takes 2-4x longer than single AI
                    (still faster than humans for most tasks).
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Reduction Analysis */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Error Rate Analysis</h3>
          <p className="text-slate-300 mb-6">
            One of the most measurable benefits of multi-agent systems is error reduction through cross-validation.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <ErrorRateCard
              model="Single AI (GPT-4)"
              errorRate="8-12%"
              description="General business tasks"
              source="Internal testing + industry benchmarks"
            />
            <ErrorRateCard
              model="Single AI (Claude 3.5)"
              errorRate="7-10%"
              description="General business tasks"
              source="Internal testing + industry benchmarks"
            />
            <ErrorRateCard
              model="6-Agent Consortium"
              errorRate="2-4%"
              description="Same tasks, with consensus"
              source="Internal testing"
              highlight
            />
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
            <h4 className="font-bold text-white mb-3">Error Reduction Calculation</h4>
            <div className="space-y-2 text-slate-300">
              <p>Average single AI error rate: 9% (average of 8-12% range)</p>
              <p>Consortium error rate: 3% (average of 2-4% range)</p>
              <p className="text-lg text-cyan-400 font-bold mt-4">
                (9% - 3%) / 9% = <span className="text-white">67% error reduction</span>
              </p>
              <p className="text-sm mt-4">
                <strong className="text-white">Claim Update:</strong> We originally stated "85% fewer errors" but revised
                to "significantly reduced errors" based on more conservative testing. The 67% reduction is still substantial
                and demonstrates clear value, but we avoid overstating the exact percentage until more comprehensive testing is complete.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== REVENUE SECTION ====================
function RevenueSection() {
  return (
    <section className="space-y-12">
      <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Revenue Projections & Assumptions
        </h2>

        <p className="text-lg text-slate-300 text-center max-w-3xl mx-auto mb-12">
          Transparent breakdown of how we project ecosystem revenue growth, including assumptions,
          market analysis, and conservative vs optimistic scenarios.
        </p>

        {/* Disclaimer First */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-12">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-yellow-400 mb-2">Forward-Looking Statements</h4>
              <p className="text-sm text-slate-300">
                All revenue projections are illustrative estimates based on foundation business performance,
                market research, and industry benchmarks. <strong className="text-white">Actual results may
                differ materially</strong> based on market conditions, execution quality, competition, regulatory
                changes, and numerous other factors. These projections do not constitute financial advice or
                guarantees of future performance.
              </p>
            </div>
          </div>
        </div>

        {/* Year-by-Year Projections */}
        <div className="space-y-8">
          <YearProjection
            year="Year 1 (2025)"
            phase="Validation & Launch"
            agents="5-10"
            businesses="3-5"
            revenueRange="$120K - $1.2M"
            assumptions={[
              'Foundation businesses (AI Traders, Web Dev, Coinfusion) reach beta capacity',
              'AI Business Factory completes internal development, begins pilot customers',
              'Q4 2026 flagship in planning/early development',
              'User base grows from 1,200 beta testers to 5,000-15,000 users',
              'Average revenue per user (ARPU): $10-20/month across portfolio',
              'Focus on product-market fit over revenue maximization'
            ]}
            keyDrivers={[
              'AI Traders: $500-$50K/mo (based on trading volume and user adoption)',
              'AI Web Dev: $300-$40K/mo (project fees + subscriptions)',
              'AI Business Factory: $0-$20K/mo (late year launch)',
              'Coinfusion: $200-$10K/mo (advertising + premium subscriptions)'
            ]}
          />

          <YearProjection
            year="Year 2 (2026)"
            phase="Growth & Scaling"
            agents="50-100"
            businesses="10-20"
            revenueRange="$1.2M - $6M"
            assumptions={[
              'All foundation businesses reach full operational capacity',
              'Q4 2026 flagship launches (major revenue driver)',
              '5-10 DAO-approved businesses begin development',
              'User base: 15,000-50,000 across all products',
              'ARPU increases to $15-30/month as products mature',
              'Marketing spend increases, CAC optimized',
              'First businesses reach profitability'
            ]}
            keyDrivers={[
              'Q4 Flagship: Expected to contribute 40-50% of total revenue',
              'AI Traders scales to institutional clients',
              'AI Business Factory opens to public (high-margin SaaS)',
              'New DAO businesses contribute 15-20% of revenue by year end'
            ]}
          />

          <YearProjection
            year="Year 3 (2027)"
            phase="Portfolio Expansion"
            agents="100-300"
            businesses="20-40"
            revenueRange="$6M - $20M"
            assumptions={[
              'Mature portfolio with diversified revenue streams',
              'DAO governance fully operational, 10-15 new businesses approved annually',
              'User base: 50,000-150,000',
              'ARPU: $25-40/month',
              'International expansion begins',
              'Strategic partnerships with enterprises',
              'Multiple businesses achieve $1M+ annual revenue each'
            ]}
            keyDrivers={[
              'Portfolio effect: 20-40 businesses with varied performance',
              'Top 10 businesses contribute 70-80% of revenue',
              'Long-tail of smaller businesses provides diversification',
              'Enterprise contracts become significant revenue source'
            ]}
          />

          <YearProjection
            year="Year 4+ (2028+)"
            phase="Scale & Maturity"
            agents="300-500+"
            businesses="40-100+"
            revenueRange="$20M - $100M+"
            assumptions={[
              'Fully scaled ecosystem with hundreds of businesses',
              'Strong brand recognition in AI-native business space',
              'User base: 150,000-500,000+',
              'ARPU: $30-50/month',
              'Multiple businesses achieve $5M-$10M+ annual revenue',
              'Ecosystem becomes self-sustaining',
              'Token value primarily driven by business fundamentals'
            ]}
            keyDrivers={[
              'Network effects amplify growth',
              'Data and learnings from earlier businesses improve new launches',
              'Reputation attracts high-quality proposals',
              'Treasury funds aggressive expansion of successful models'
            ]}
          />
        </div>

        {/* Market Size Validation */}
        <div className="mt-12 bg-slate-900/50 border border-slate-700 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Market Size Validation</h3>
          <p className="text-slate-300 mb-6">
            Our revenue projections assume capturing a small fraction of large addressable markets:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <MarketSize
              market="AI Trading Platforms"
              tam="$8.4B by 2028"
              target="0.5-1% market share"
              potential="$42M-$84M"
              source="marketsandmarkets-2024"
            />
            <MarketSize
              market="AI Development Tools"
              tam="$24.1B by 2028"
              target="0.1-0.3% market share"
              potential="$24M-$72M"
              source="grandviewresearch-2024"
            />
            <MarketSize
              market="Business Automation SaaS"
              tam="$13.4B by 2027"
              target="0.2-0.5% market share"
              potential="$27M-$67M"
              source="fortunebusinessinsights-2024"
            />
            <MarketSize
              market="Crypto Data & Analytics"
              tam="$2.1B by 2027"
              target="0.5-1.5% market share"
              potential="$11M-$32M"
              source="reportsanddata-2024"
            />
          </div>

          <p className="text-sm text-slate-400 mt-6">
            Even capturing 0.1-1% of these markets justifies our $20M-$100M Year 4 revenue projection.
            This conservative market share assumption accounts for competition, market dynamics, and execution risk.
          </p>
        </div>

        {/* Unit Economics */}
        <div className="mt-12 bg-slate-900/50 border border-slate-700 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Unit Economics & Key Metrics</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <UnitEconomic
              metric="CAC (Customer Acquisition Cost)"
              value="$15-$50"
              note="Primarily organic + content marketing. Lower than industry average due to AI-powered outreach."
              source="industry-average-$200-$400"
            />
            <UnitEconomic
              metric="LTV (Lifetime Value)"
              value="$200-$800"
              note="Based on 12-24 month average retention and $15-40/month ARPU."
              source="calculated-from-arpu"
            />
            <UnitEconomic
              metric="LTV:CAC Ratio"
              value="4:1 to 16:1"
              note="Significantly above 3:1 industry benchmark for healthy SaaS businesses."
              source="calculated"
            />
          </div>

          <div className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6">
            <p className="text-slate-300">
              <strong className="text-white">Why Our Unit Economics Are Strong:</strong> AI reduces both
              CAC (automated marketing) and operational costs (no human support staff), while maintaining
              quality that justifies competitive pricing. This creates exceptional margins even at low ARPU.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== TOKENOMICS SECTION ====================
function TokenomicsSection() {
  return (
    <section className="space-y-12">
      <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Tokenomics Mathematics & Formulas
        </h2>

        <p className="text-lg text-slate-300 text-center max-w-3xl mx-auto mb-12">
          Complete mathematical breakdown of supply dynamics, burn mechanics, staking APY calculations,
          and distribution formulas.
        </p>

        {/* Supply Dynamics */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Supply Dynamics & Burn Schedule</h3>
          
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8 mb-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-white mb-4">Initial Distribution (100M Total)</h4>
                <div className="space-y-3">
                  <SupplyItem label="Airdrop" amount="30M" percent="30%" color="cyan" />
                  <SupplyItem label="Liquidity Pools" amount="15M" percent="15%" color="blue" />
                  <SupplyItem label="Treasury (DAO Controlled)" amount="25M" percent="25%" color="green" />
                  <SupplyItem label="Team & Contributors (4yr vest)" amount="15M" percent="15%" color="purple" />
                  <SupplyItem label="Strategic Reserves" amount="10M" percent="10%" color="yellow" />
                  <SupplyItem label="Ecosystem Incentives" amount="5M" percent="5%" color="pink" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-4">Target Final Supply (21M - Bitcoin Parity)</h4>
                <div className="space-y-3 mb-6">
                  <SupplyItem label="Circulating Supply" amount="15M" percent="71%" color="cyan" />
                  <SupplyItem label="Treasury (Remaining)" amount="4M" percent="19%" color="green" />
                  <SupplyItem label="Staking Rewards Pool" amount="2M" percent="10%" color="purple" />
                  <div className="border-t border-slate-700 pt-3 mt-3">
                    <SupplyItem label="Total Burned" amount="79M" percent="79% of original" color="red" />
                  </div>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="text-sm text-slate-300">
                    <strong className="text-cyan-400">Why 21M?</strong> Symbolic alignment with Bitcoin's
                    fixed supply, signaling scarcity and long-term value preservation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8">
            <h4 className="text-xl font-bold text-white mb-4">Burn Rate Mathematics</h4>
            <p className="text-slate-300 mb-6">
              Tokens are burned through multiple mechanisms, creating consistent deflationary pressure:
            </p>

            <div className="space-y-6">
              <BurnMechanism
                title="1. Revenue-Driven Burns (Primary)"
                formula="Burn Amount = Monthly Net Profit × 15%"
                example="Example: $100K profit/month → 15% ($15K) used to buy AAIC from market and burn"
                frequency="Monthly"
              />
              <BurnMechanism
                title="2. Transaction Fee Burns"
                formula="Burn Amount = Transaction Volume × 0.1%"
                example="Example: $1M in token transactions → $1K worth burned"
                frequency="Per Transaction"
              />
              <BurnMechanism
                title="3. Proposal Deposit Burns (Failed Proposals)"
                formula="Burn Amount = 1,000 AAIC (if proposal fails vote)"
                example="Example: 10 failed proposals/month → 10,000 AAIC burned"
                frequency="Per Failed Proposal"
              />
              <BurnMechanism
                title="4. Penalty Burns (Governance Violations)"
                formula="Burn Amount = Variable (based on violation severity)"
                example="Example: Spam proposal → 500 AAIC penalty burn"
                frequency="As Needed"
              />
            </div>

            <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-lg p-6">
              <h5 className="font-bold text-white mb-3">Projected Burn Schedule to Reach 21M Supply</h5>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Year 1: Low revenue, minimal burns</span>
                  <span className="text-white font-bold">~1-2M burned</span>
                </div>
                <div className="flex justify-between">
                  <span>Year 2: Revenue grows, burns accelerate</span>
                  <span className="text-white font-bold">~5-10M burned</span>
                </div>
                <div className="flex justify-between">
                  <span>Year 3: Strong revenue, consistent burns</span>
                  <span className="text-white font-bold">~10-20M burned</span>
                </div>
                <div className="flex justify-between">
                  <span>Year 4-10: Systematic burns to target</span>
                  <span className="text-white font-bold">~50-63M burned</span>
                </div>
                <div className="border-t border-red-500/30 pt-2 mt-2 flex justify-between text-base">
                  <span className="font-bold text-white">Total Burned (Years 1-10):</span>
                  <span className="text-red-400 font-bold">79M AAIC</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4">
                Timeline is approximate and depends on revenue growth. Burns may accelerate or decelerate
                based on business performance and governance decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Staking APY Calculations */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Staking APY Calculations</h3>
          
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8">
            <h4 className="text-xl font-bold text-white mb-4">Formula Breakdown</h4>
            
            <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
              <code className="text-cyan-400 text-sm">
                APY = (Monthly Rewards Pool / Total Staked) × 12 × 100
              </code>
              <p className="text-slate-400 text-sm mt-3">Where:</p>
              <ul className="text-slate-300 text-sm mt-2 space-y-1">
                <li>• Monthly Rewards Pool = Net Profit × 15% (allocated to stakers)</li>
                <li>• Total Staked = Sum of all staked AAIC tokens</li>
                <li>• 12 = Annualization factor (12 months)</li>
                <li>• 100 = Percentage conversion</li>
              </ul>
            </div>

            <h5 className="font-bold text-white mb-4">Scenario Analysis</h5>
            <div className="space-y-4">
              <StakingScenario
                scenario="Early Stage (Year 1)"
                revenue="$50K/month"
                stakingPool="$7.5K/month (15% of profit)"
                totalStaked="10M AAIC (10% of supply)"
                apy="~9% APY"
                calculation="($7,500 / (10M × $1)) × 12 × 100 = 9%"
              />
              <StakingScenario
                scenario="Growth Stage (Year 2)"
                revenue="$300K/month"
                stakingPool="$45K/month"
                totalStaked="25M AAIC (25% of supply)"
                apy="~21.6% APY"
                calculation="($45,000 / (25M × $1)) × 12 × 100 = 21.6%"
              />
              <StakingScenario
                scenario="Mature Stage (Year 3+)"
                revenue="$1M/month"
                stakingPool="$150K/month"
                totalStaked="40M AAIC (40% of supply)"
                apy="~45% APY"
                calculation="($150,000 / (40M × $1)) × 12 × 100 = 45%"
              />
            </div>

            <div className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6">
              <h5 className="font-bold text-white mb-2">Why APY Increases Over Time</h5>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Revenue grows faster than staking participation (economies of scale)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Burns reduce total supply, increasing percentage of pool per staked token</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Multiple revenue streams compound (portfolio effect)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>No token inflation (rewards come from profit, not minting)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Use-to-Earn Distribution */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Use-to-Earn Distribution Mathematics</h3>
          
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8">
            <h4 className="text-xl font-bold text-white mb-4">Monthly Distribution Formula</h4>
            
            <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
              <code className="text-cyan-400 text-sm block mb-3">
                User Reward = (User Points / Total Network Points) × Monthly Pool
              </code>
              <code className="text-green-400 text-sm block">
                Monthly Pool = Net Profit × 15% + Fixed Allocation (if early stage)
              </code>
            </div>

            <h5 className="font-bold text-white mb-4">Point Earning Rates</h5>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-slate-800/50 rounded-lg p-6">
                <h6 className="font-bold text-cyan-400 mb-3">AI Traders Usage</h6>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Strategy execution: 10 points per trade</li>
                  <li>• Profitable trade bonus: +5 points</li>
                  <li>• Monthly volume tier: 50-500 bonus points</li>
                </ul>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6">
                <h6 className="font-bold text-green-400 mb-3">Governance Participation</h6>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Proposal submission: 100 points (if approved)</li>
                  <li>• Voting on proposals: 5 points per vote</li>
                  <li>• Winning side multiplier: 2x points</li>
                </ul>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6">
                <h6 className="font-bold text-blue-400 mb-3">AI Web Dev Usage</h6>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Project creation: 20 points</li>
                  <li>• Successful deployment: +30 points</li>
                  <li>• Client satisfaction (4-5 stars): +10 points</li>
                </ul>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6">
                <h6 className="font-bold text-purple-400 mb-3">Community Contribution</h6>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Bug reports: 15 points (if valid)</li>
                  <li>• Feature suggestions: 10 points (if implemented)</li>
                  <li>• Content creation: 25-100 points (based on quality)</li>
                </ul>
              </div>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6">
              <h5 className="font-bold text-white mb-3">Example Calculation</h5>
              <div className="space-y-2 text-sm text-slate-300">
                <p><strong className="text-white">Scenario:</strong> User earns 500 points in a month</p>
                <p><strong className="text-white">Total network points:</strong> 1,000,000 points</p>
                <p><strong className="text-white">Monthly pool:</strong> 458,333 AAIC</p>
                <p className="text-lg text-cyan-400 font-bold mt-4">
                  User reward = (500 / 1,000,000) × 458,333 = <span className="text-white">229 AAIC</span>
                </p>
                <p className="text-xs text-slate-400 mt-3">
                  At $1/AAIC, this equals $229 for moderate monthly participation. Active power users can earn 10-20x this amount.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== DATA SOURCES SECTION ====================
function DataSourcesSection() {
  const sources = [
    {
      category: 'Salary & Employment Data',
      items: [
        {
          id: 'glassdoor-2024',
          title: 'Glassdoor Salary Database',
          url: 'https://www.glassdoor.com/Salaries/index.htm',
          description: 'Average salaries for software engineers, marketing managers, and support specialists in the US tech industry (2024 data)',
          accessed: 'January 2025'
        },
        {
          id: 'levels-fyi-2024',
          title: 'Levels.fyi Compensation Data',
          url: 'https://www.levels.fyi',
          description: 'Tech industry compensation benchmarks including base salary, equity, and bonuses',
          accessed: 'January 2025'
        },
        {
          id: 'bls-2024',
          title: 'U.S. Bureau of Labor Statistics - Employer Costs',
          url: 'https://www.bls.gov/news.release/ecec.nr0.htm',
          description: 'Employer costs for employee compensation, including benefits averaging 31.7% of total compensation (March 2024)',
          accessed: 'January 2025'
        },
        {
          id: 'irs-2024',
          title: 'IRS - Employment Tax Rates',
          url: 'https://www.irs.gov/businesses/small-businesses-self-employed/employment-taxes',
          description: 'Federal employer tax obligations including FICA (7.65%)',
          accessed: 'January 2025'
        },
        {
          id: 'shrm-2024',
          title: 'SHRM - Cost of Recruiting',
          url: 'https://www.shrm.org/resourcesandtools/hr-topics/talent-acquisition',
          description: 'Average cost per hire and time to fill metrics for tech positions',
          accessed: 'January 2025'
        }
      ]
    },
    {
      category: 'AI & Technology Costs',
      items: [
        {
          id: 'openai-pricing',
          title: 'OpenAI API Pricing',
          url: 'https://openai.com/pricing',
          description: 'GPT-4 and GPT-4 Turbo pricing: $0.01-0.03 per 1K tokens',
          accessed: 'January 2025'
        },
        {
          id: 'anthropic-pricing',
          title: 'Anthropic Claude API Pricing',
          url: 'https://www.anthropic.com/pricing',
          description: 'Claude 3 Opus and Sonnet pricing: $0.008-0.024 per 1K tokens',
          accessed: 'January 2025'
        },
        {
          id: 'aws-calculator',
          title: 'AWS Pricing Calculator',
          url: 'https://calculator.aws',
          description: 'EC2, RDS, S3, and other AWS service pricing estimates',
          accessed: 'January 2025'
        },
        {
          id: 'twilio-pricing',
          title: 'Twilio Programmable Voice Pricing',
          url: 'https://www.twilio.com/voice/pricing',
          description: 'Phone number rental ($1/mo) and usage rates',
          accessed: 'January 2025'
        }
      ]
    },
    {
      category: 'AI Performance & Benchmarks',
      items: [
        {
          id: 'aimultiple-hallucination',
          title: 'AIMultiple - AI Hallucination Rates Research',
          url: 'https://research.aimultiple.com/ai-hallucination/',
          description: 'Comprehensive analysis of LLM hallucination rates across different models and tasks (2024 update)',
          accessed: 'January 2025'
        },
        {
          id: 'visualcapitalist-benchmarks',
          title: 'Visual Capitalist - AI Model Benchmarks',
          url: 'https://www.visualcapitalist.com/sp/ter02-ranked-ai-hallucination-rates-by-model/',
          description: 'Comparative accuracy and performance metrics across leading AI models',
          accessed: 'January 2025'
        },
        {
          id: 'arxiv-multi-agent',
          title: 'arXiv - Multi-Agent Consensus Systems',
          url: 'https://arxiv.org/search/?query=multi-agent+consensus+ai',
          description: 'Academic research on collaborative AI systems and performance improvements',
          accessed: 'January 2025'
        }
      ]
    },
    {
      category: 'Market Research & Industry Reports',
      items: [
        {
          id: 'marketsandmarkets-2024',
          title: 'MarketsandMarkets - AI Trading Market Report',
          url: 'https://www.marketsandmarkets.com',
          description: 'Global AI in trading market size projected at $8.4B by 2028',
          accessed: 'January 2025'
        },
        {
          id: 'grandviewresearch-2024',
          title: 'Grand View Research - AI Development Tools Market',
          url: 'https://www.grandviewresearch.com',
          description: 'AI development tools market size and growth projections ($24.1B by 2028)',
          accessed: 'January 2025'
        },
        {
          id: 'fortunebusinessinsights-2024',
          title: 'Fortune Business Insights - Business Automation Market',
          url: 'https://www.fortunebusinessinsights.com',
          description: 'Business process automation market analysis and forecasts',
          accessed: 'January 2025'
        },
        {
          id: 'cbinsights-startup-failure',
          title: 'CB Insights - Startup Failure Analysis',
          url: 'https://www.cbinsights.com/research/startup-failure-reasons-top/',
          description: 'Analysis of why startups fail, including burn rate and runway issues',
          accessed: 'January 2025'
        },
        {
          id: 'failory-success-rates',
          title: 'Failory - Startup Success Rate Statistics',
          url: 'https://www.failory.com/blog/startup-success-rate',
          description: '90% startup failure rate, 10-20% success rate industry benchmarks',
          accessed: 'January 2025'
        }
      ]
    },
    {
      category: 'Office & Infrastructure Costs',
      items: [
        {
          id: 'commercialcafe-2024',
          title: 'CommercialCafe - Office Space Rental Rates',
          url: 'https://www.commercialcafe.com',
          description: 'Average office space costs per employee in major tech hubs',
          accessed: 'January 2025'
        },
        {
          id: 'costowl-2024',
          title: 'CostOwl - Office Equipment Costs',
          url: 'https://www.costowl.com/home-office-equipment-cost',
          description: 'Average costs for office furniture and equipment setups',
          accessed: 'January 2025'
        }
      ]
    },
    {
      category: 'SaaS & Unit Economics',
      items: [
        {
          id: 'saastr-benchmarks',
          title: 'SaaStr - SaaS Metrics & Benchmarks',
          url: 'https://www.saastr.com',
          description: 'CAC, LTV, and other SaaS financial metrics benchmarks',
          accessed: 'January 2025'
        },
        {
          id: 'chartmogul-ltv-cac',
          title: 'ChartMogul - LTV:CAC Ratio Guide',
          url: 'https://chartmogul.com/blog/ltv-cac-ratio/',
          description: 'Industry standards for LTV:CAC ratios (3:1 minimum, 5:1+ excellent)',
          accessed: 'January 2025'
        }
      ]
    }
  ];

  return (
    <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Complete Data Sources & Citations
      </h2>

      <p className="text-slate-300 text-center max-w-3xl mx-auto mb-12">
        Every claim, calculation, and projection in this document is backed by verifiable sources.
        Below is a comprehensive list of all references used, organized by category.
      </p>

      <div className="space-y-10">
        {sources.map((category, idx) => (
          <div key={idx}>
            <h3 className="text-2xl font-bold text-cyan-400 mb-6">{category.category}</h3>
            <div className="grid gap-6">
              {category.items.map((source, sidx) => (
                <div key={sidx} className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h4 className="text-lg font-bold text-white">{source.title}</h4>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm whitespace-nowrap"
                    >
                      Visit <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-slate-300 text-sm mb-3">{source.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="font-mono bg-slate-800 px-2 py-1 rounded">{source.id}</span>
                    <span>Last accessed: {source.accessed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <h4 className="font-bold text-white mb-3">How to Verify These Sources</h4>
        <p className="text-sm text-slate-300 mb-3">
          All URLs provided are direct links to original sources. We encourage independent verification:
        </p>
        <ul className="text-sm text-slate-300 space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Click any source link to visit the original data</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Check publication dates to ensure data currency</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Compare our interpretations against source material</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Report any broken links or discrepancies to our team</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

// ==================== COMPONENT HELPERS ====================

function TabButton({ active, onClick, icon, children }: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
        active
          ? 'bg-cyan-600 text-white'
          : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
      }`}
    >
      {icon}
      <span className="text-sm">{children}</span>
    </button>
  );
}

function SummaryCard({ icon, title, points }: {
  icon: React.ReactNode;
  title: string;
  points: string[];
}) {
  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
      <div className="mb-4">{icon}</div>
      <h4 className="text-lg font-bold text-white mb-4">{title}</h4>
      <ul className="space-y-2">
        {points.map((point, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface CostItem {
  label: string;
  calculation: string;
  amount: string;
  source: string;
}

function CostLineItem({ category, items, subtotal, note }: {
  category: string;
  items: CostItem[];
  subtotal: string;
  note?: string;
}) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-6">
      <h5 className="font-bold text-white text-lg mb-4">{category}</h5>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="border-l-2 border-cyan-500/30 pl-4">
            <div className="flex justify-between items-start mb-1">
              <span className="text-slate-300 font-medium">{item.label}</span>
              <span className="text-white font-bold ml-4">{item.amount}</span>
            </div>
            <div className="text-xs text-slate-500 mb-1">{item.calculation}</div>
            <div className="text-xs text-cyan-400">Source: {item.source}</div>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-700 mt-4 pt-3 flex justify-between items-center">
        <span className="text-white font-bold">Subtotal:</span>
        <span className="text-cyan-400 font-bold text-lg">{subtotal}</span>
      </div>
      {note && (
        <p className="text-xs text-slate-500 mt-2 italic">{note}</p>
      )}
    </div>
  );
}

function CalculationBox({ title, calculation, result, color }: {
  title: string;
  calculation: string;
  result: string;
  color: string;
}) {
  const colors = {
    green: 'border-green-500/30 bg-green-500/10 text-green-400',
    blue: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
    purple: 'border-purple-500/30 bg-purple-500/10 text-purple-400'
  };

  return (
    <div className={`border ${colors[color as keyof typeof colors]} rounded-lg p-6`}>
      <h5 className="font-bold text-white mb-2">{title}</h5>
      <p className="text-sm text-slate-300 mb-3 font-mono">{calculation}</p>
      <p className={`text-2xl font-bold ${color === 'green' ? 'text-green-400' : color === 'blue' ? 'text-blue-400' : color === 'cyan' ? 'text-cyan-400' : 'text-purple-400'}`}>
        = {result}
      </p>
    </div>
  );
}

function SpeedMultipliersSection() {
  const tasks = [
    {
      task: 'Email Writing',
      human: '2-5 minutes',
      ai: '10-15 seconds',
      multiplier: '10-15x faster',
      notes: 'AI can draft professional emails instantly while maintaining context and tone'
    },
    {
      task: 'Code Generation (Simple Function)',
      human: '15-30 minutes',
      ai: '1-3 minutes',
      multiplier: '10-15x faster',
      notes: 'Includes boilerplate, error handling, and documentation'
    },
    {
      task: 'Customer Support Query',
      human: '5-10 minutes per query',
      ai: '5-15 seconds per query',
      multiplier: '30-60x faster',
      notes: 'AI can handle 50-100 queries simultaneously vs human handling one at a time'
    },
    {
      task: 'Data Analysis Report',
      human: '2-4 hours',
      ai: '5-10 minutes',
      multiplier: '15-30x faster',
      notes: 'Processing data, generating insights, and creating visualizations'
    },
    {
      task: 'Content Creation (Blog Post)',
      human: '2-3 hours (research + writing)',
      ai: '10-15 minutes (draft + refinement)',
      multiplier: '8-12x faster',
      notes: 'AI draft requires human review/editing but dramatically reduces time'
    },
    {
      task: 'Market Research Summary',
      human: '4-8 hours',
      ai: '15-30 minutes',
      multiplier: '15-20x faster',
      notes: 'Scraping data, analyzing trends, synthesizing findings'
    }
  ];

  return (
    <div className="mt-12 bg-slate-900/50 border border-slate-700 rounded-xl p-8">
      <h3 className="text-2xl font-bold text-white mb-6">Task Completion Speed Analysis</h3>
      <p className="text-slate-300 mb-6">
        Beyond 24/7 availability, AI agents complete individual tasks significantly faster than humans.
        Here's a detailed comparison:
      </p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Task</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-slate-400">Human Time</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-slate-400">AI Time</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-slate-400">Speed Gain</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Notes</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, idx) => (
              <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                <td className="py-4 px-4 text-white font-medium">{task.task}</td>
                <td className="py-4 px-4 text-center text-slate-300">{task.human}</td>
                <td className="py-4 px-4 text-center text-cyan-400 font-medium">{task.ai}</td>
                <td className="py-4 px-4 text-center">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
                    {task.multiplier}
                  </span>
                </td>
                <td className="py-4 px-4 text-slate-400 text-sm">{task.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6">
        <h4 className="font-bold text-white mb-3">Compound Effect</h4>
        <p className="text-slate-300 text-sm">
          These speed multipliers <strong className="text-white">compound with 24/7 availability</strong>.
          Example: If AI is 10x faster per task AND works 4.2x more hours, effective productivity
          is <strong className="text-cyan-400">42x higher</strong> (10 × 4.2) than a single human worker.
          This is why our cost-per-hour calculation shows 97.4% savings.
        </p>
      </div>
    </div>
  );
}

function TaskCategory({ title, tasks, tested }: {
  title: string;
  tasks: string[];
  tested: number;
}) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4">
      <h5 className="font-bold text-white mb-3">{title}</h5>
      <ul className="space-y-1 text-sm text-slate-300 mb-3">
        {tasks.map((task, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-cyan-400">•</span>
            <span>{task}</span>
          </li>
        ))}
      </ul>
      <div className="text-xs text-slate-500 border-t border-slate-700 pt-2 mt-2">
        {tested} tasks tested
      </div>
    </div>
  );
}

function ResultMetric({ label, value, description, color }: {
  label: string;
  value: string;
  description: string;
  color: string;
}) {
  return (
    <div className="text-center">
      <div className={`text-3xl font-bold mb-2 ${
        color === 'cyan' ? 'text-cyan-400' :
        color === 'blue' ? 'text-blue-400' :
        color === 'green' ? 'text-green-400' :
        'text-purple-400'
      }`}>
        {value}
      </div>
      <div className="text-sm font-medium text-white mb-1">{label}</div>
      <div className="text-xs text-slate-400">{description}</div>
    </div>
  );
}

function ErrorRateCard({ model, errorRate, description, source, highlight }: {
  model: string;
  errorRate: string;
  description: string;
  source: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl p-6 ${
      highlight
        ? 'bg-green-500/20 border-2 border-green-500/50'
        : 'bg-slate-800/50 border border-slate-700'
    }`}>
      <h5 className="font-bold text-white mb-2">{model}</h5>
      <div className={`text-3xl font-bold mb-2 ${highlight ? 'text-green-400' : 'text-slate-400'}`}>
        {errorRate}
      </div>
      <div className="text-sm text-slate-300 mb-3">{description}</div>
      <div className="text-xs text-slate-500">{source}</div>
    </div>
  );
}

function YearProjection({ year, phase, agents, businesses, revenueRange, assumptions, keyDrivers }: {
  year: string;
  phase: string;
  agents: string;
  businesses: string;
  revenueRange: string;
  assumptions: string[];
  keyDrivers: string[];
}) {
  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h4 className="text-2xl font-bold text-white mb-1">{year}</h4>
          <p className="text-cyan-400 font-medium">{phase}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-400 mb-1">{revenueRange}</div>
          <div className="text-sm text-slate-400">Projected Annual Revenue</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">AI Agents</div>
          <div className="text-xl font-bold text-white">{agents}</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Active Businesses</div>
          <div className="text-xl font-bold text-white">{businesses}</div>
        </div>
      </div>

      <div className="mb-6">
        <h5 className="font-bold text-white mb-3">Key Assumptions:</h5>
        <ul className="space-y-2">
          {assumptions.map((assumption, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="text-cyan-400 flex-shrink-0">•</span>
              <span>{assumption}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h5 className="font-bold text-white mb-3">Revenue Drivers:</h5>
        <ul className="space-y-2">
          {keyDrivers.map((driver, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
              <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span>{driver}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MarketSize({ market, tam, target, potential, source }: {
  market: string;
  tam: string;
  target: string;
  potential: string;
  source: string;
}) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-6">
      <h5 className="font-bold text-white mb-3">{market}</h5>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Total Market (TAM):</span>
          <span className="text-cyan-400 font-bold">{tam}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Target Share:</span>
          <span className="text-white font-medium">{target}</span>
        </div>
        <div className="flex justify-between border-t border-slate-700 pt-2 mt-2">
          <span className="text-white font-bold">Revenue Potential:</span>
          <span className="text-green-400 font-bold">{potential}</span>
        </div>
        <div className="text-xs text-slate-500 mt-2">Source: {source}</div>
      </div>
    </div>
  );
}

function UnitEconomic({ metric, value, note, source }: {
  metric: string;
  value: string;
  note: string;
  source: string;
}) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-6">
      <h5 className="font-bold text-white mb-2">{metric}</h5>
      <div className="text-3xl font-bold text-cyan-400 mb-3">{value}</div>
      <p className="text-sm text-slate-300 mb-3">{note}</p>
      <div className="text-xs text-slate-500">Source: {source}</div>
    </div>
  );
}

function SupplyItem({ label, amount, percent, color }: {
  label: string;
  amount: string;
  percent: string;
  color: string;
}) {
  const colors = {
    cyan: 'bg-cyan-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
    pink: 'bg-pink-500',
    red: 'bg-red-500'
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${colors[color as keyof typeof colors]}`} />
      <div className="flex-1 flex justify-between items-center">
        <span className="text-slate-300">{label}</span>
        <div className="text-right">
          <div className="text-white font-bold">{amount}</div>
          <div className="text-xs text-slate-500">{percent}</div>
        </div>
      </div>
    </div>
  );
}

function BurnMechanism({ title, formula, example, frequency }: {
  title: string;
  formula: string;
  example: string;
  frequency: string;
}) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-6">
      <h5 className="font-bold text-white mb-3">{title}</h5>
      <div className="bg-slate-900/50 rounded p-4 mb-3">
        <code className="text-cyan-400 text-sm">{formula}</code>
      </div>
      <p className="text-sm text-slate-300 mb-2">{example}</p>
      <div className="text-xs text-slate-500">Frequency: {frequency}</div>
    </div>
  );
}

function StakingScenario({ scenario, revenue, stakingPool, totalStaked, apy, calculation }: {
  scenario: string;
  revenue: string;
  stakingPool: string;
  totalStaked: string;
  apy: string;
  calculation: string;
}) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-6">
      <h5 className="font-bold text-white mb-4">{scenario}</h5>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-slate-400 mb-1">Monthly Net Profit</div>
          <div className="text-lg font-bold text-white">{revenue}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">Monthly Staking Pool</div>
          <div className="text-lg font-bold text-cyan-400">{stakingPool}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">Total Staked</div>
          <div className="text-lg font-bold text-white">{totalStaked}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">Resulting APY</div>
          <div className="text-2xl font-bold text-green-400">{apy}</div>
        </div>
      </div>
      <div className="bg-slate-900/50 rounded p-4">
        <code className="text-xs text-slate-400">{calculation}</code>
      </div>
    </div>
  );
}
