import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Shield, Users, Cpu, Vote, CheckCircle2, XCircle, Clock,
  ArrowRight, AlertTriangle, Eye, Lock, Unlock, TrendingUp,
  FileText, BarChart3, Target, Zap, Info, BookOpen, Activity
} from 'lucide-react';
import { TOKENOMICS } from '../../../shared/constants/tokenomics';

export default function GovernanceOverview() {
  return (
    <PageLayout>
      <div className="space-y-20">
        <section className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Decentralized, But Not Chaotic
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Governed by token holders.{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Executed by autonomous AI.
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Major ecosystem decisions are made through transparent, token-based governance.
            AI agents execute within the boundaries defined by the community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/governance/live"
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              <Activity className="w-5 h-5" />
              View Live Governance
            </Link>
            <button
              onClick={() => document.getElementById('governance-rules')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Governance Rules
            </button>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">Two layers of decision-making</h2>
          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            A clear separation between human governance and AI execution ensures accountability and efficiency
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-cyan-500/20 rounded-xl">
                  <Users className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Layer 1</h3>
                  <div className="text-sm text-cyan-400 font-medium">Community Governance (Human)</div>
                </div>
              </div>

              <p className="text-slate-300 mb-4">Token holders vote on:</p>

              <div className="space-y-3">
                <GovernanceItem text="New business approvals" />
                <GovernanceItem text="Treasury usage" />
                <GovernanceItem text="Revenue distribution parameters" />
                <GovernanceItem text="Platform upgrades" />
                <GovernanceItem text="Strategic direction" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Cpu className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Layer 2</h3>
                  <div className="text-sm text-purple-400 font-medium">AI Execution (Autonomous)</div>
                </div>
              </div>

              <p className="text-slate-300 mb-4">AI agents:</p>

              <div className="space-y-3">
                <GovernanceItem text="Build approved businesses" />
                <GovernanceItem text="Operate within approved constraints" />
                <GovernanceItem text="Optimize performance" />
                <GovernanceItem text="Cannot override governance decisions" />
              </div>
            </div>
          </div>

          <div className="mt-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
              <p className="text-lg text-white font-bold">
                AI agents do not control governance. Governance controls AI.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Who can participate in governance?
          </h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <ParticipationCard
              icon={<Vote className="w-8 h-8 text-cyan-400" />}
              title="Governance Power"
              description="Token-weighted voting ensures stake alignment"
              highlight="1 token = 1 vote"
            />
            <ParticipationCard
              icon={<Users className="w-8 h-8 text-green-400" />}
              title="Any Token Holder Can Vote"
              description="No minimum required to participate in votes"
              highlight="Universal participation"
            />
            <ParticipationCard
              icon={<FileText className="w-8 h-8 text-blue-400" />}
              title="Proposal Creation"
              description="Creating proposals requires meeting a threshold"
              highlight="50,000 AAIC minimum"
            />
          </div>
        </section>

        <section className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-2xl p-8 lg:p-12">
          <div className="flex items-start gap-4 mb-6">
            <Info className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Two Types of Proposals</h3>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
                <h4 className="text-xl font-bold text-white">1. DAO Governance (Protocol Changes)</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Minimum:</span>
                  <span className="font-medium text-white">{TOKENOMICS.GOVERNANCE.DAO.minTokens.toLocaleString()} AAIC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Voting:</span>
                  <span className="font-medium text-white">{TOKENOMICS.GOVERNANCE.DAO.votingDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Quorum:</span>
                  <span className="font-medium text-white">{TOKENOMICS.GOVERNANCE.DAO.quorumPercentage}%</span>
                </div>
              </div>
              <div className="mt-4 text-xs text-slate-400">
                For protocol-level changes, treasury rules, revenue distribution
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-cyan-400" />
                <h4 className="text-xl font-bold text-white">2. Launchpad (Business Proposals)</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Deposit:</span>
                  <span className="font-medium text-white">{TOKENOMICS.GOVERNANCE.LAUNCHPAD.depositAmount.toLocaleString()} AAIC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Voting:</span>
                  <span className="font-medium text-white">{TOKENOMICS.GOVERNANCE.LAUNCHPAD.votingDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Quorum:</span>
                  <span className="font-medium text-white">{TOKENOMICS.GOVERNANCE.LAUNCHPAD.quorumPercentage}%</span>
                </div>
              </div>
              <div className="mt-4 text-xs text-slate-400">
                For new AI business proposals (deposit refundable if quorum reached)
              </div>
            </div>
          </div>
        </section>

        <section id="governance-rules" className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Governance Proposal Rules</h2>

          <div className="space-y-8">
            <RuleSection
              icon={<FileText className="w-6 h-6 text-cyan-400" />}
              title="Proposal Creation Requirements"
              rules={[
                'Minimum tokens to submit a governance proposal: 50,000 AAIC',
                'One active governance proposal per wallet (recommended)',
                'Proposal must fit an allowed category',
              ]}
            />

            <RuleSection
              icon={<CheckCircle2 className="w-6 h-6 text-green-400" />}
              title="Allowed Governance Topics"
              rules={[
                'Revenue distribution adjustments (within safety bounds)',
                'Buyback & burn ratios (within limits)',
                'Treasury allocation',
                'New AI agent development',
                'Platform upgrades',
                'Strategic partnerships',
              ]}
            />

            <RuleSection
              icon={<XCircle className="w-6 h-6 text-red-400" />}
              title="Explicitly Forbidden"
              rules={[
                'Increasing max token supply',
                'Removing vesting rules',
                'Bypassing governance safeguards',
                'Granting unilateral control to any party',
              ]}
              danger
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How Voting Works</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <VotingMechanicCard
              icon={<BarChart3 className="w-8 h-8 text-cyan-400" />}
              title="Voting Power"
              items={[
                'Voting power proportional to tokens held',
                'Snapshot-based at proposal start',
                'Tokens do not need to be locked to vote',
              ]}
            />
            <VotingMechanicCard
              icon={<Clock className="w-8 h-8 text-blue-400" />}
              title="Voting Period"
              items={[
                'Standard voting duration: 14 days',
                'Countdown visible on all proposals',
                'No extensions after voting starts',
              ]}
            />
            <VotingMechanicCard
              icon={<Users className="w-8 h-8 text-green-400" />}
              title="Quorum Requirement"
              items={[
                'Minimum participation: 20% of circulating supply',
                'Must be met for proposal to pass',
                'Real-time quorum tracking',
              ]}
            />
            <VotingMechanicCard
              icon={<Target className="w-8 h-8 text-purple-400" />}
              title="Approval Threshold"
              items={[
                'Quorum must be met',
                '≥ 60% FOR votes required',
                'Clear majority needed to pass',
              ]}
            />
            <VotingMechanicCard
              icon={<Vote className="w-8 h-8 text-yellow-400" />}
              title="Vote Changes"
              items={[
                'Can change vote during voting period',
                'Latest vote counts',
                'Transparent vote history',
              ]}
            />
            <VotingMechanicCard
              icon={<Eye className="w-8 h-8 text-orange-400" />}
              title="Public Results"
              items={[
                'All votes publicly visible',
                'Real-time vote tallies',
                'Complete transparency',
              ]}
            />
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">From Vote to Execution</h2>

          <div className="max-w-3xl mx-auto bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
            <div className="space-y-6">
              <ExecutionStep
                number="1"
                title="Proposal Passes Governance"
                description="Quorum and approval threshold are met"
              />
              <ExecutionStep
                number="2"
                title="Results Finalized On-Chain"
                description="Voting results recorded permanently and immutably"
              />
              <ExecutionStep
                number="3"
                title="Execution Queued"
                description="Changes prepared for implementation with time delay if required"
              />
              <ExecutionStep
                number="4"
                title="AI Agents or Smart Contracts Execute"
                description="Approved changes implemented automatically"
              />
              <ExecutionStep
                number="5"
                title="Status Updated Publicly"
                description="Execution confirmation visible to all stakeholders"
              />
            </div>

            <div className="mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">
                  <span className="font-bold text-white">Important:</span> Failed proposals are archived
                  and cannot be silently retried. This prevents governance spam and ensures accountability.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            Built-in Safeguards
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            Multiple layers of protection prevent governance attacks and ensure system integrity
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SafeguardCard
              icon={<Lock className="w-6 h-6 text-cyan-400" />}
              title="Fixed Max Supply"
              description="Token supply cannot be increased through governance"
            />
            <SafeguardCard
              icon={<TrendingUp className="w-6 h-6 text-green-400" />}
              title="Emission Caps"
              description="Strict limits on token emission rates and schedules"
            />
            <SafeguardCard
              icon={<BarChart3 className="w-6 h-6 text-blue-400" />}
              title="Treasury Usage Limits"
              description="Prevents unauthorized or excessive treasury spending"
            />
            <SafeguardCard
              icon={<Clock className="w-6 h-6 text-purple-400" />}
              title="Time Delays on Critical Changes"
              description="Major changes have mandatory waiting periods"
            />
            <SafeguardCard
              icon={<FileText className="w-6 h-6 text-yellow-400" />}
              title="Public Proposal Archive"
              description="All proposals permanently recorded and searchable"
            />
            <SafeguardCard
              icon={<AlertTriangle className="w-6 h-6 text-orange-400" />}
              title="Emergency Mechanisms"
              description="Strictly limited and transparent pause capabilities"
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <Eye className="w-8 h-8 text-cyan-400" />
            Transparent by Default
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            Every aspect of governance is publicly visible and auditable in real-time
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <TransparencyCard
              icon={<FileText className="w-6 h-6 text-cyan-400" />}
              title="All Proposals"
              description="Past & present"
            />
            <TransparencyCard
              icon={<Vote className="w-6 h-6 text-green-400" />}
              title="Voting Results"
              description="Real-time tallies"
            />
            <TransparencyCard
              icon={<Users className="w-6 h-6 text-blue-400" />}
              title="Quorum & Participation"
              description="Live metrics"
            />
            <TransparencyCard
              icon={<TrendingUp className="w-6 h-6 text-purple-400" />}
              title="Treasury Movements"
              description="All transactions"
            />
            <TransparencyCard
              icon={<Target className="w-6 h-6 text-yellow-400" />}
              title="Parameter Changes"
              description="Complete history"
            />
          </div>

          <div className="text-center">
            <Link
              to="/governance/live"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
            >
              View Live Governance Activity
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-8 lg:p-12 text-center">
          <Zap className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Governance only works if people participate
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Your voice matters. Token holders shape the future of the ecosystem through active participation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/governance/live"
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors"
            >
              View Active Proposals
            </Link>
            <Link
              to="/governance/treasury-guardrails"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-lg transition-colors"
            >
              <Shield className="w-5 h-5" />
              Treasury Guardrails
            </Link>
            <Link
              to="/auth/sign-in"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Connect Wallet
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function GovernanceItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
      <span className="text-slate-300">{text}</span>
    </div>
  );
}

function ParticipationCard({ icon, title, description, highlight }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight: string;
}) {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-3">{description}</p>
      <div className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-medium">
        {highlight}
      </div>
    </div>
  );
}

function RuleSection({ icon, title, rules, danger }: {
  icon: React.ReactNode;
  title: string;
  rules: string[];
  danger?: boolean;
}) {
  return (
    <div className={`border rounded-xl p-6 ${
      danger
        ? 'bg-red-500/5 border-red-500/30'
        : 'bg-slate-700/30 border-slate-600'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <ul className="space-y-2">
        {rules.map((rule, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
            <span className={danger ? 'text-red-400' : 'text-cyan-400'}>•</span>
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VotingMechanicCard({ icon, title, items }: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="font-bold text-white mb-4 text-center">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-3 h-3 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExecutionStep({ number, title, description }: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
        {number}
      </div>
      <div className="flex-1 pt-1">
        <h4 className="font-bold text-white mb-1">{title}</h4>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function SafeguardCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6">
      <div className="mb-3">{icon}</div>
      <h4 className="font-bold text-white mb-2 text-sm">{title}</h4>
      <p className="text-xs text-slate-400">{description}</p>
    </div>
  );
}

function TransparencyCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6 text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <h4 className="font-bold text-white mb-2 text-sm">{title}</h4>
      <p className="text-xs text-slate-400">{description}</p>
    </div>
  );
}
