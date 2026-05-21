import { PageLayout } from '../../components/layout/PageLayout';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft, Clock, CheckCircle2, XCircle, TrendingUp, Target,
  Users, Vote, Shield, AlertTriangle, Zap, Info,
  Copy, ExternalLink, ThumbsUp, ThumbsDown, Award,
  Activity, Briefcase, Code, DollarSign,
  Lock
} from 'lucide-react';

type ProposalStatus = 'proposed' | 'approved' | 'in_development' | 'launched' | 'profitable' | 'rejected' | 'cancelled';

interface ProposalData {
  id: string;
  title: string;
  summary: string;
  category: string;
  status: ProposalStatus;
  proposer: string;
  proposalCount: number;
  successRate: number;
  votingEnds: Date;
  votesFor: number;
  votesAgainst: number;
  quorum: number;
  problem: string;
  solution: string;
  aiSuitability: string;
  expectedImpact: string;
  businessConcept: string;
  targetMarket: string;
  competitiveAdvantage: string;
  aiArchitecture: string;
  agentRoles: string[];
  executionPlan: string;
  dependencies: string[];
  metrics: Array<{ name: string; target: string; timeframe: string }>;
  risks: Array<{ type: string; description: string; mitigation: string }>;
  proposerReward: string;
  voterReward: string;
  ecosystemBenefit: string;
  relatedProposals: Array<{ id: string; title: string; status: string }>;
}

const MOCK_PROPOSAL: ProposalData = {
  id: 'ai-powered-defi-risk-engine',
  title: 'AI-Powered DeFi Risk Assessment Engine',
  summary: 'An autonomous AI system that analyzes and scores DeFi protocol risk in real-time',
  category: 'Data',
  status: 'proposed',
  proposer: '0x742d...3f8a',
  proposalCount: 3,
  successRate: 66,
  votingEnds: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
  votesFor: 287000000,
  votesAgainst: 53000000,
  quorum: 28.3,
  problem: 'DeFi users face constant risk assessment challenges across 1000+ protocols. Manual analysis is slow, inconsistent, and prone to missing critical vulnerabilities. This creates barrier to entry and leads to preventable losses.',
  solution: 'An AI-powered risk engine that continuously monitors DeFi protocols, analyzes smart contract code, tracks liquidity metrics, and provides real-time risk scores accessible via API and dashboard.',
  aiSuitability: 'This business is ideal for AI management because it requires 24/7 monitoring, real-time data processing, pattern recognition across massive datasets, and rapid response to emerging threats—all tasks where AI excels.',
  expectedImpact: 'Creates new revenue stream ($500K-$2M annual projected), establishes AAIC as DeFi safety infrastructure, attracts institutional users, and demonstrates AI consortium capability in high-value data services.',
  businessConcept: 'The DeFi Risk Assessment Engine operates as a subscription-based service providing real-time risk analysis across major DeFi protocols. It combines on-chain data monitoring, smart contract analysis, liquidity tracking, and historical vulnerability patterns to generate comprehensive risk scores. The service targets three customer segments: individual traders seeking safer investments, DeFi aggregators needing risk data for their platforms, and institutional investors requiring due diligence automation. Revenue model includes tiered API access ($99-$999/month), white-label licensing for platforms ($5K-$20K/month), and premium analytics for institutions ($50K+/year). The business differentiates through 24/7 autonomous operation, cross-chain coverage, and ML-powered predictive risk modeling that improves continuously.',
  targetMarket: 'Primary: DeFi traders and investors ($15B+ total addressable market). Secondary: DeFi aggregators and portfolio managers. Tertiary: Institutional crypto investors and risk management firms.',
  competitiveAdvantage: 'First fully autonomous AI-operated risk platform. Competitors require human analysts. Our system operates 24/7 with zero human intervention, processes data faster, and costs 90% less to operate.',
  aiArchitecture: 'Multi-agent system architecture with specialized agents for different risk dimensions. Data collection agents monitor on-chain activity across 15+ chains. Analysis agents evaluate smart contract security using trained models. Scoring agents synthesize inputs into unified risk metrics. API agents handle customer queries and deliver real-time data. All agents coordinate through a central orchestration layer with fallback mechanisms.',
  agentRoles: [
    'Data Collection Agent: Monitors blockchain transactions, liquidity pools, and protocol events',
    'Smart Contract Analyzer: Reviews code for known vulnerabilities and suspicious patterns',
    'Liquidity Risk Agent: Tracks depth, concentration, and withdrawal patterns',
    'Historical Pattern Agent: Compares current metrics against past exploit signatures',
    'Scoring Engine: Synthesizes multi-dimensional risk into unified scores',
    'API Service Agent: Delivers real-time data to customers with <100ms latency',
    'Learning Agent: Continuously improves models based on new data and outcomes'
  ],
  executionPlan: 'Phase 1 (Months 1-2): AI consortium designs system architecture, selects data sources, and trains initial models on historical DeFi exploit data. Phase 2 (Months 3-4): MVP deployment covering top 50 DeFi protocols with basic risk scoring. Beta testing with 100 early users. Phase 3 (Months 5-6): Production launch with tiered pricing, API documentation, and customer onboarding automation. Phase 4 (Months 7-12): Scale to 500+ protocols, add predictive capabilities, expand to institutional features. All operations fully automated—no human hiring required.',
  dependencies: [
    'On-chain data feeds (The Graph, Dune Analytics)',
    'Smart contract analysis APIs (Certik, OpenZeppelin)',
    'Cloud infrastructure for ML model training and inference',
    'Real-time database for storing risk metrics and historical data',
    'Payment processing for subscription billing'
  ],
  metrics: [
    { name: 'Paying Customers', target: '500+', timeframe: '12 months' },
    { name: 'Monthly Recurring Revenue', target: '$50K+', timeframe: '12 months' },
    { name: 'Protocol Coverage', target: '500+ protocols', timeframe: '9 months' },
    { name: 'API Uptime', target: '99.9%', timeframe: 'Ongoing' },
    { name: 'Risk Score Accuracy', target: '85%+', timeframe: '6 months' }
  ],
  risks: [
    {
      type: 'Market Risk',
      description: 'DeFi market downturn could reduce demand for risk assessment services',
      mitigation: 'Low operating costs mean profitability possible at modest scale. Risk assessment becomes more valuable during market uncertainty.'
    },
    {
      type: 'Technical Risk',
      description: 'AI models may produce inaccurate risk scores, damaging reputation',
      mitigation: 'Conservative initial scoring, clear disclaimers, continuous model improvement, human audit spot-checks in early phase'
    },
    {
      type: 'Competition Risk',
      description: 'Existing players may launch AI-powered features',
      mitigation: 'First-mover advantage, superior cost structure, continuous improvement through autonomous learning'
    },
    {
      type: 'Data Risk',
      description: 'Reliance on external data sources creates dependencies',
      mitigation: 'Multi-source redundancy, self-hosted data collection for critical metrics, fallback mechanisms'
    }
  ],
  proposerReward: '5-15% equity in resulting business based on performance',
  voterReward: 'Share of voter reward pool (proportional to voting power)',
  ecosystemBenefit: 'New revenue stream, enhanced reputation, demonstration of AI capability',
  relatedProposals: [
    { id: 'ai-trading-bot-platform', title: 'AI Trading Bot Platform', status: 'launched' },
    { id: 'defi-yield-optimizer', title: 'DeFi Yield Optimizer', status: 'profitable' },
    { id: 'nft-valuation-engine', title: 'NFT Valuation Engine', status: 'rejected' }
  ]
};

export default function ProposalDetail() {
  useParams<{ proposalId: string }>();
  const [activeTab, setActiveTab] = useState<'concept' | 'execution' | 'risks'>('concept');
  const [userVote, setUserVote] = useState<'for' | 'against' | null>(null);
  const [isLoggedIn] = useState(false);
  const [votingPower] = useState(0);

  const proposal = MOCK_PROPOSAL;
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const approvalRate = Math.round((proposal.votesFor / totalVotes) * 100);
  const quorumMet = proposal.quorum >= 20;
  const canVote = isLoggedIn && votingPower >= 1 && !userVote && proposal.status === 'proposed';

  const timeRemaining = getTimeRemaining(proposal.votingEnds);

  return (
    <PageLayout>
      <div className="space-y-8">
        <Link
          to="/launchpad"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Launchpad
        </Link>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <CategoryBadge category={proposal.category} />
                <StatusBadge status={proposal.status} />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{proposal.title}</h1>
              <p className="text-lg text-slate-300">{proposal.summary}</p>
            </div>

            <div className="flex flex-col gap-2 lg:items-end">
              {proposal.status === 'proposed' && (
                <div className="flex items-center gap-2 text-yellow-400">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">{timeRemaining}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>ID:</span>
                <code className="bg-slate-700/50 px-2 py-1 rounded">{proposal.id}</code>
                <button className="text-cyan-400 hover:text-cyan-300">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-2 border-cyan-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Vote className="w-7 h-7 text-cyan-400" />
            Voting Panel
          </h2>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-slate-300">FOR vs AGAINST</span>
                <span className="text-sm font-medium text-white">{approvalRate}% approval</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-4 mb-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-cyan-500 h-4 rounded-full transition-all relative"
                  style={{ width: `${approvalRate}%` }}
                >
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white">
                    {approvalRate}%
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-400 font-medium">FOR: {formatNumber(proposal.votesFor)}</span>
                <span className="text-red-400 font-medium">AGAINST: {formatNumber(proposal.votesAgainst)}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-slate-300">Quorum Progress</span>
                <span className={`text-sm font-medium ${quorumMet ? 'text-green-400' : 'text-yellow-400'}`}>
                  {proposal.quorum}% / 20% {quorumMet ? '✓' : ''}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${quorumMet ? 'bg-green-500' : 'bg-yellow-500'}`}
                  style={{ width: `${Math.min(proposal.quorum * 5, 100)}%` }}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 p-4 bg-slate-800/50 rounded-xl">
              <div>
                <div className="text-xs text-slate-400 mb-1">Total Votes Cast</div>
                <div className="text-xl font-bold text-white">{formatNumber(totalVotes)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Time Remaining</div>
                <div className="text-xl font-bold text-white">{timeRemaining}</div>
              </div>
            </div>

            {!isLoggedIn ? (
              <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 text-center">
                <Lock className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-300 mb-4">Connect your wallet to participate in voting</p>
                <Link
                  to="/auth/sign-in"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
                >
                  Connect Wallet to Vote
                </Link>
              </div>
            ) : votingPower === 0 ? (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                <p className="text-slate-300 mb-2">You need at least 1 AAIC token to vote</p>
                <p className="text-sm text-slate-400">Your current voting power: 0 AAIC</p>
              </div>
            ) : userVote ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="text-lg font-bold text-white mb-2">Vote Submitted</p>
                <p className="text-slate-300">
                  You voted <span className={userVote === 'for' ? 'text-green-400' : 'text-red-400'}>
                    {userVote.toUpperCase()}
                  </span> with {formatNumber(votingPower)} AAIC
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <span className="text-sm text-slate-400">Your Voting Power: </span>
                  <span className="text-lg font-bold text-cyan-400">{formatNumber(votingPower)} AAIC</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setUserVote('for')}
                    disabled={!canVote}
                    className="px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <ThumbsUp className="w-5 h-5" />
                    Vote FOR
                  </button>
                  <button
                    onClick={() => setUserVote('against')}
                    disabled={!canVote}
                    className="px-6 py-4 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <ThumbsDown className="w-5 h-5" />
                    Vote AGAINST
                  </button>
                </div>
                <p className="text-xs text-slate-400 text-center">
                  Votes are final and cannot be changed once submitted
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Proposal Summary</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <SummaryCard
              icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
              title="Problem Statement"
              content={proposal.problem}
            />
            <SummaryCard
              icon={<Zap className="w-6 h-6 text-yellow-400" />}
              title="Proposed Solution"
              content={proposal.solution}
            />
            <SummaryCard
              icon={<Cpu className="w-6 h-6 text-purple-400" />}
              title="Why AI is Suited"
              content={proposal.aiSuitability}
            />
            <SummaryCard
              icon={<TrendingUp className="w-6 h-6 text-green-400" />}
              title="Expected Impact"
              content={proposal.expectedImpact}
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Full Proposal Details</h2>

          <div className="flex gap-2 mb-6 overflow-x-auto">
            <TabButton
              active={activeTab === 'concept'}
              onClick={() => setActiveTab('concept')}
              icon={<Briefcase className="w-4 h-4" />}
              label="Business Concept"
            />
            <TabButton
              active={activeTab === 'execution'}
              onClick={() => setActiveTab('execution')}
              icon={<Code className="w-4 h-4" />}
              label="AI Execution"
            />
            <TabButton
              active={activeTab === 'risks'}
              onClick={() => setActiveTab('risks')}
              icon={<Shield className="w-4 h-4" />}
              label="Risks & Metrics"
            />
          </div>

          <div className="bg-slate-700/30 rounded-xl p-6">
            {activeTab === 'concept' && (
              <div className="space-y-6">
                <DetailSection title="Business Concept" content={proposal.businessConcept} />
                <DetailSection title="Target Market" content={proposal.targetMarket} />
                <DetailSection title="Competitive Advantage" content={proposal.competitiveAdvantage} />
              </div>
            )}

            {activeTab === 'execution' && (
              <div className="space-y-6">
                <DetailSection title="AI Architecture" content={proposal.aiArchitecture} />
                <div>
                  <h4 className="font-bold text-white mb-3">AI Agent Roles</h4>
                  <ul className="space-y-2">
                    {proposal.agentRoles.map((role, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                        <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>{role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <DetailSection title="Execution Plan" content={proposal.executionPlan} />
                <div>
                  <h4 className="font-bold text-white mb-3">Dependencies</h4>
                  <ul className="space-y-2">
                    {proposal.dependencies.map((dep, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{dep}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'risks' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-white mb-4">Success Metrics</h4>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {proposal.metrics.map((metric, idx) => (
                      <MetricCard key={idx} {...metric} />
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-4">Risks & Mitigation</h4>
                  <div className="space-y-4">
                    {proposal.risks.map((risk, idx) => (
                      <RiskCard key={idx} {...risk} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Proposer Information</h2>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg font-bold text-white">{proposal.proposer}</span>
                <button className="text-cyan-400 hover:text-cyan-300">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-slate-400">Proposals Submitted</div>
                  <div className="text-lg font-bold text-white">{proposal.proposalCount}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Success Rate</div>
                  <div className="text-lg font-bold text-green-400">{proposal.successRate}%</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Reputation</div>
                  <div className="text-lg font-bold text-cyan-400">Good</div>
                </div>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                <p className="text-sm text-slate-300">
                  <Info className="w-4 h-4 inline mr-2 text-cyan-400" />
                  Proposer wallet is recorded for future equity & rewards distribution
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Award className="w-7 h-7 text-yellow-400" />
            Rewards & Incentives
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <RewardCard
              title="If Proposal PASSES"
              items={[
                { label: 'Proposer', value: proposal.proposerReward, color: 'cyan' },
                { label: 'Voters (winning side)', value: proposal.voterReward, color: 'green' },
                { label: 'Ecosystem', value: proposal.ecosystemBenefit, color: 'blue' }
              ]}
              positive
            />
            <RewardCard
              title="If Proposal FAILS"
              items={[
                { label: 'No penalties', value: 'Proposal archived transparently', color: 'slate' },
                { label: 'Voter rewards', value: 'Not distributed', color: 'slate' },
                { label: 'Learning', value: 'Community feedback preserved', color: 'slate' }
              ]}
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Governance Rules</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <RuleCard icon={<Clock className="w-5 h-5 text-cyan-400" />} label="Voting Duration" value="7 days" />
            <RuleCard icon={<Target className="w-5 h-5 text-green-400" />} label="Approval Threshold" value="≥ 60% FOR" />
            <RuleCard icon={<Users className="w-5 h-5 text-blue-400" />} label="Quorum" value="≥ 5% supply" />
            <RuleCard icon={<Vote className="w-5 h-5 text-purple-400" />} label="Voting Method" value="Snapshot-based" />
          </div>

          <Link
            to="/governance"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Read full governance rules
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Proposal Timeline</h2>

          <div className="space-y-4">
            <TimelineStep
              icon={<FileText className="w-5 h-5" />}
              title="Submitted"
              date="Dec 15, 2025"
              completed
            />
            <TimelineStep
              icon={<Vote className="w-5 h-5" />}
              title="Voting Started"
              date="Dec 16, 2025"
              completed
            />
            <TimelineStep
              icon={<Clock className="w-5 h-5" />}
              title="Voting Ends"
              date="Dec 30, 2025"
              current
            />
            <TimelineStep
              icon={<Code className="w-5 h-5" />}
              title="Development Phase"
              date="If approved"
            />
            <TimelineStep
              icon={<Activity className="w-5 h-5" />}
              title="Launch"
              date="Target: Q1 2026"
            />
            <TimelineStep
              icon={<DollarSign className="w-5 h-5" />}
              title="Profitability"
              date="Target: Q3 2026"
            />
          </div>
        </section>

        {proposal.relatedProposals.length > 0 && (
          <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Related Proposals</h2>

            <div className="grid md:grid-cols-3 gap-4">
              {proposal.relatedProposals.map((related) => (
                <Link
                  key={related.id}
                  to={`/launchpad/${related.id}`}
                  className="bg-slate-700/30 border border-slate-600 hover:border-cyan-500 rounded-xl p-4 transition-colors"
                >
                  <StatusBadge status={related.status as ProposalStatus} small />
                  <h3 className="font-bold text-white mt-2 mb-1">{related.title}</h3>
                </Link>
              ))}
            </div>

            <div className="text-center mt-6">
              <Link
                to="/launchpad"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
              >
                View All Proposals
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        <section className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-8 text-center">
          {proposal.status === 'proposed' ? (
            <>
              <Vote className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Your vote shapes the ecosystem
              </h2>
              <p className="text-lg text-slate-300 mb-6">
                Make an informed decision based on the proposal details above
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-lg transition-colors inline-flex items-center justify-center gap-2">
                  <ThumbsUp className="w-5 h-5" />
                  Vote FOR
                </button>
                <button className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-lg transition-colors inline-flex items-center justify-center gap-2">
                  <ThumbsDown className="w-5 h-5" />
                  Vote AGAINST
                </button>
              </div>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                This proposal is closed
              </h2>
              <p className="text-lg text-slate-300 mb-6">
                Voting has ended for this proposal
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/governance/live"
                  className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors"
                >
                  View Governance History
                </Link>
                <Link
                  to="/portfolio"
                  className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
                >
                  Explore Portfolio
                </Link>
              </div>
            </>
          )}
        </section>
      </div>
    </PageLayout>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    Trading: 'bg-green-500/20 text-green-400',
    SaaS: 'bg-blue-500/20 text-blue-400',
    Infra: 'bg-purple-500/20 text-purple-400',
    Data: 'bg-cyan-500/20 text-cyan-400',
    Other: 'bg-slate-500/20 text-slate-400'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[category] || colors.Other}`}>
      {category}
    </span>
  );
}

function StatusBadge({ status, small }: { status: ProposalStatus; small?: boolean }) {
  const config = {
    proposed: { icon: Activity, label: 'Voting Open', color: 'text-green-400', bg: 'bg-green-500/20' },
    approved: { icon: CheckCircle2, label: 'Approved', color: 'text-blue-400', bg: 'bg-blue-500/20' },
    in_development: { icon: Code, label: 'In Development', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    launched: { icon: Activity, label: 'Launched', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
    profitable: { icon: TrendingUp, label: 'Profitable', color: 'text-purple-400', bg: 'bg-purple-500/20' },
    rejected: { icon: XCircle, label: 'Rejected', color: 'text-red-400', bg: 'bg-red-500/20' },
    cancelled: { icon: XCircle, label: 'Cancelled', color: 'text-slate-400', bg: 'bg-slate-500/20' }
  };

  const { icon: Icon, label, color, bg } = config[status];
  const sizeClass = small ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center gap-2 ${sizeClass} rounded-full ${bg} ${color} font-medium`}>
      <Icon className={small ? 'w-3 h-3' : 'w-4 h-4'} />
      {label}
    </span>
  );
}

function SummaryCard({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="font-bold text-white">{title}</h3>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">{content}</p>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2 whitespace-nowrap ${
        active
          ? 'bg-cyan-600 text-white'
          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function DetailSection({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h4 className="font-bold text-white mb-3">{title}</h4>
      <p className="text-sm text-slate-300 leading-relaxed">{content}</p>
    </div>
  );
}

function MetricCard({ name, target, timeframe }: { name: string; target: string; timeframe: string }) {
  return (
    <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
      <div className="text-xs text-slate-400 mb-1">{name}</div>
      <div className="text-lg font-bold text-cyan-400 mb-1">{target}</div>
      <div className="text-xs text-slate-500">{timeframe}</div>
    </div>
  );
}

function RiskCard({ type, description, mitigation }: { type: string; description: string; mitigation: string }) {
  return (
    <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-yellow-400" />
        <h5 className="font-bold text-white text-sm">{type}</h5>
      </div>
      <p className="text-sm text-slate-300 mb-3">{description}</p>
      <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
        <div className="text-xs font-medium text-green-400 mb-1">Mitigation:</div>
        <p className="text-xs text-slate-300">{mitigation}</p>
      </div>
    </div>
  );
}

function RewardCard({ title, items, positive }: {
  title: string;
  items: Array<{ label: string; value: string; color: string }>;
  positive?: boolean;
}) {
  return (
    <div className={`border rounded-xl p-6 ${
      positive
        ? 'bg-green-500/5 border-green-500/30'
        : 'bg-slate-700/30 border-slate-600'
    }`}>
      <h3 className="font-bold text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx}>
            <div className="text-sm font-medium text-slate-400 mb-1">{item.label}</div>
            <div className={`text-sm text-${item.color}-400`}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RuleCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div className="text-sm font-bold text-white">{value}</div>
    </div>
  );
}

function TimelineStep({ icon, title, date, completed, current }: {
  icon: React.ReactNode;
  title: string;
  date: string;
  completed?: boolean;
  current?: boolean;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        completed
          ? 'bg-green-500 text-white'
          : current
          ? 'bg-cyan-600 text-white'
          : 'bg-slate-700 text-slate-400'
      }`}>
        {icon}
      </div>
      <div className="flex-1 pt-2">
        <h4 className="font-bold text-white mb-1">{title}</h4>
        <p className="text-sm text-slate-400">{date}</p>
      </div>
      {completed && <CheckCircle2 className="w-5 h-5 text-green-400 mt-2" />}
      {current && <Activity className="w-5 h-5 text-cyan-400 mt-2 animate-pulse" />}
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
  return num.toString();
}

function getTimeRemaining(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h remaining`;
  return 'Ending soon';
}

const Cpu = Code;
const FileText = Briefcase;
