import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Activity, XCircle, CheckCircle2, Clock, Users,
  Vote, Shield, BarChart3, AlertCircle, Info,
  ArrowRight, ChevronDown, Target
} from 'lucide-react';
import { useState } from 'react';

export default function LiveGovernance() {
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);

  const stats = {
    activeProposals: 3,
    totalPassed: 24,
    totalRejected: 8,
    currentQuorum: 23.4,
    circulatingSupply: 100000000,
    tokensParticipating: 23400000,
  };

  return (
    <PageLayout>
      <div className="space-y-12">
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-6">
            <Activity className="w-4 h-4" />
            Live Governance
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            All governance proposals and votes are{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              visible in real time
            </span>
          </h1>

          <p className="text-lg text-slate-300 mb-2">
            Track every proposal, vote, and governance decision as they happen
          </p>
          <p className="text-sm text-slate-400">
            Voting requires a connected wallet. Viewing is public.
          </p>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Governance Statistics</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              icon={<Activity className="w-6 h-6 text-cyan-400" />}
              label="Active Proposals"
              value={stats.activeProposals.toString()}
              color="cyan"
            />
            <StatCard
              icon={<CheckCircle2 className="w-6 h-6 text-green-400" />}
              label="Total Passed"
              value={stats.totalPassed.toString()}
              color="green"
            />
            <StatCard
              icon={<XCircle className="w-6 h-6 text-red-400" />}
              label="Total Rejected"
              value={stats.totalRejected.toString()}
              color="red"
            />
            <StatCard
              icon={<BarChart3 className="w-6 h-6 text-blue-400" />}
              label="Current Quorum"
              value={`${stats.currentQuorum}%`}
              color="blue"
              subtitle={stats.currentQuorum >= 20 ? 'Above minimum' : 'Below minimum'}
            />
            <StatCard
              icon={<Users className="w-6 h-6 text-purple-400" />}
              label="Circulating Supply"
              value={formatNumber(stats.circulatingSupply)}
              color="purple"
              subtitle="AAIC tokens"
            />
            <StatCard
              icon={<Vote className="w-6 h-6 text-yellow-400" />}
              label="Tokens Participating"
              value={formatNumber(stats.tokensParticipating)}
              color="yellow"
              subtitle={`${((stats.tokensParticipating / stats.circulatingSupply) * 100).toFixed(1)}% of supply`}
            />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Governance Proposals</h2>
              <p className="text-sm text-slate-400">Filter by status to view specific proposals</p>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <FilterButton
                label="Active"
                count={3}
                active={statusFilter === 'active'}
                onClick={() => setStatusFilter('active')}
              />
              <FilterButton
                label="Passed"
                count={24}
                active={statusFilter === 'passed'}
                onClick={() => setStatusFilter('passed')}
              />
              <FilterButton
                label="Rejected"
                count={8}
                active={statusFilter === 'rejected'}
                onClick={() => setStatusFilter('rejected')}
              />
              <FilterButton
                label="Executed"
                count={22}
                active={statusFilter === 'executed'}
                onClick={() => setStatusFilter('executed')}
              />
            </div>
          </div>

          <div className="space-y-6">
            <GovernanceProposalCard
              id={1}
              title="Adjust Revenue Distribution Parameters"
              category="Treasury"
              status="active"
              votesFor={234000000}
              votesAgainst={45000000}
              quorum={23.4}
              timeRemaining="8 days 4 hours"
              isExpanded={selectedProposal === 1}
              onToggle={() => setSelectedProposal(selectedProposal === 1 ? null : 1)}
              description="Proposal to adjust the revenue distribution ratio between treasury (40%), buyback (30%), and ecosystem rewards (30%). This change will optimize capital allocation based on current market conditions and ecosystem growth metrics."
              rationale="Current distribution favors treasury accumulation during bear market. With improving conditions, increasing buyback allocation will provide better value capture for token holders while maintaining healthy treasury reserves."
              parameters={[
                { name: 'Treasury Allocation', current: '50%', proposed: '40%' },
                { name: 'Buyback Allocation', current: '20%', proposed: '30%' },
                { name: 'Ecosystem Rewards', current: '30%', proposed: '30%' },
              ]}
              risks="Reduced treasury accumulation rate may limit future strategic opportunities. However, current treasury balance ($12M) provides sufficient runway for 18+ months."
            />

            <GovernanceProposalCard
              id={2}
              title="Deploy New AI Agent: Market Research Specialist"
              category="AI Development"
              status="active"
              votesFor={189000000}
              votesAgainst={67000000}
              quorum={21.2}
              timeRemaining="11 days 2 hours"
              isExpanded={selectedProposal === 2}
              onToggle={() => setSelectedProposal(selectedProposal === 2 ? null : 2)}
              description="Proposal to develop and deploy a specialized AI agent focused on comprehensive market research for new business proposals. This agent will analyze market conditions, competitive landscape, and opportunity sizing."
              rationale="Current proposal evaluation lacks systematic market research. This agent will provide data-driven insights to improve decision quality and reduce risk of launching businesses in saturated markets."
              parameters={[
                { name: 'Development Budget', current: 'N/A', proposed: '$50,000' },
                { name: 'Training Dataset Size', current: 'N/A', proposed: '10TB market data' },
                { name: 'Monthly Operating Cost', current: 'N/A', proposed: '$2,500' },
              ]}
              risks="Initial development cost and potential delays in deployment. Agent effectiveness may require iterative refinement based on real-world results."
            />

            <GovernanceProposalCard
              id={3}
              title="Strategic Partnership: CloudFlow Infrastructure"
              category="Partnerships"
              status="active"
              votesFor={156000000}
              votesAgainst={98000000}
              quorum={19.8}
              timeRemaining="4 days 18 hours"
              isExpanded={selectedProposal === 3}
              onToggle={() => setSelectedProposal(selectedProposal === 3 ? null : 3)}
              description="Proposal to establish a strategic partnership with CloudFlow Infrastructure to provide discounted cloud computing resources for AI agent operations. Partnership includes 40% discount on compute costs and priority support."
              rationale="Current cloud infrastructure costs represent 35% of operating expenses. This partnership would reduce costs by $180,000 annually while improving performance and reliability."
              parameters={[
                { name: 'Contract Duration', current: 'N/A', proposed: '24 months' },
                { name: 'Cost Savings', current: 'N/A', proposed: '$180,000/year' },
                { name: 'Migration Timeline', current: 'N/A', proposed: '90 days' },
              ]}
              risks="Migration complexity and potential service disruption during transition. Vendor lock-in concerns mitigated by standard APIs and data portability guarantees."
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Governance History</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Proposal</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Result</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Participation</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Execution</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Date</th>
                </tr>
              </thead>
              <tbody>
                <HistoryRow
                  proposal="Platform Upgrade to v2.5"
                  category="Platform"
                  result="passed"
                  participation="28.3%"
                  execution="executed"
                  date="2025-12-18"
                />
                <HistoryRow
                  proposal="Increase Proposal Threshold to 100k"
                  category="Governance"
                  result="rejected"
                  participation="22.1%"
                  execution="archived"
                  date="2025-12-15"
                />
                <HistoryRow
                  proposal="Launch AI Trading Business"
                  category="Business"
                  result="passed"
                  participation="31.7%"
                  execution="executed"
                  date="2025-12-10"
                />
                <HistoryRow
                  proposal="Quarterly Treasury Report Q4"
                  category="Treasury"
                  result="passed"
                  participation="25.8%"
                  execution="executed"
                  date="2025-12-05"
                />
                <HistoryRow
                  proposal="Emergency Pause Implementation"
                  category="Security"
                  result="passed"
                  participation="34.2%"
                  execution="executed"
                  date="2025-11-28"
                />
                <HistoryRow
                  proposal="Reduce Voting Period to 7 Days"
                  category="Governance"
                  result="rejected"
                  participation="19.8%"
                  execution="archived"
                  date="2025-11-22"
                />
              </tbody>
            </table>
          </div>

          <div className="text-center mt-6">
            <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors">
              View Full History
            </button>
          </div>
        </section>

        <section className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <Info className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-white mb-2">How Governance Works</h3>
              <p className="text-slate-300">
                Governance decisions define how the ecosystem evolves. AI agents operate strictly within
                these rules and cannot override community decisions.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <InfoCard
              icon={<Shield className="w-5 h-5 text-cyan-400" />}
              title="Token-weighted voting"
              description="Your voting power is proportional to tokens held"
            />
            <InfoCard
              icon={<Clock className="w-5 h-5 text-blue-400" />}
              title="14-day voting period"
              description="Standard duration for DAO governance proposals"
            />
            <InfoCard
              icon={<Target className="w-5 h-5 text-green-400" />}
              title="20% quorum required"
              description="Minimum participation for DAO governance proposals"
            />
            <InfoCard
              icon={<CheckCircle2 className="w-5 h-5 text-purple-400" />}
              title="60% approval threshold"
              description="Clear majority required for proposal passage"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              to="/governance"
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              Read Governance Rules
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/launchpad"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              Explore Launchpad
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function StatCard({ icon, label, value, color, subtitle }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  subtitle?: string;
}) {
  const colorMap: Record<string, string> = {
    cyan: 'bg-cyan-500/20',
    green: 'bg-green-500/20',
    red: 'bg-red-500/20',
    blue: 'bg-blue-500/20',
    purple: 'bg-purple-500/20',
    yellow: 'bg-yellow-500/20',
  };

  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6">
      <div className={`w-12 h-12 ${colorMap[color]} rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <div className="text-sm text-slate-400 mb-1">{label}</div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
    </div>
  );
}

function FilterButton({ label, count, active, onClick }: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2 ${
        active
          ? 'bg-cyan-600 text-white'
          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
      }`}
    >
      {label}
      <span className={`px-2 py-0.5 rounded-full text-xs ${
        active ? 'bg-cyan-700' : 'bg-slate-600'
      }`}>
        {count}
      </span>
    </button>
  );
}

function GovernanceProposalCard({
  id: _id, title, category, status, votesFor, votesAgainst, quorum, timeRemaining,
  isExpanded, onToggle, description, rationale, parameters, risks
}: {
  id: number;
  title: string;
  category: string;
  status: 'active' | 'passed' | 'rejected' | 'executed';
  votesFor: number;
  votesAgainst: number;
  quorum: number;
  timeRemaining: string;
  isExpanded: boolean;
  onToggle: () => void;
  description?: string;
  rationale?: string;
  parameters?: Array<{ name: string; current: string; proposed: string }>;
  risks?: string;
}) {
  const statusConfig = {
    active: { icon: <Activity className="w-4 h-4" />, label: 'Active', color: 'text-green-400', bg: 'bg-green-500/20' },
    passed: { icon: <CheckCircle2 className="w-4 h-4" />, label: 'Passed', color: 'text-blue-400', bg: 'bg-blue-500/20' },
    rejected: { icon: <XCircle className="w-4 h-4" />, label: 'Rejected', color: 'text-red-400', bg: 'bg-red-500/20' },
    executed: { icon: <CheckCircle2 className="w-4 h-4" />, label: 'Executed', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  };

  const config = statusConfig[status];
  const total = votesFor + votesAgainst;
  const percentage = Math.round((votesFor / total) * 100);
  const quorumMet = quorum >= 20;
  const approvalMet = percentage >= 60;

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded">
              {category}
            </span>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${config.bg} ${config.color}`}>
              {config.icon}
              <span>{config.label}</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        </div>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-green-400 font-medium">For: {formatNumber(votesFor)}</span>
            <span className="text-red-400 font-medium">Against: {formatNumber(votesAgainst)}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-cyan-500 h-3 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-slate-400">{percentage}% approval</span>
            <span className={`text-xs font-medium ${approvalMet ? 'text-green-400' : 'text-yellow-400'}`}>
              {approvalMet ? 'Threshold met' : 'Needs 60%'}
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">Quorum Progress</span>
            <span className={`text-sm font-medium ${quorumMet ? 'text-green-400' : 'text-yellow-400'}`}>
              {quorum}% / 20%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${quorumMet ? 'bg-green-500' : 'bg-yellow-500'}`}
              style={{ width: `${Math.min(quorum * 5, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-700 pt-4 space-y-4 mb-4">
          <div>
            <h4 className="text-sm font-bold text-white mb-2">Description</h4>
            <p className="text-sm text-slate-300">{description}</p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-2">Rationale</h4>
            <p className="text-sm text-slate-300">{rationale}</p>
          </div>

          {parameters && parameters.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-white mb-2">Parameters Being Changed</h4>
              <div className="bg-slate-700/30 rounded-lg p-4 space-y-2">
                {parameters.map((param, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{param.name}</span>
                    <span className="text-slate-300">
                      <span className="text-slate-500">{param.current}</span>
                      {' → '}
                      <span className="text-cyan-400 font-medium">{param.proposed}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              Risk Considerations
            </h4>
            <p className="text-sm text-slate-300">{risks}</p>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
            <h4 className="text-sm font-bold text-white mb-3">Voting Breakdown</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-400 mb-1">Total Votes</div>
                <div className="text-lg font-bold text-white">{formatNumber(total)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Unique Voters</div>
                <div className="text-lg font-bold text-white">1,247</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock className="w-4 h-4" />
          <span>{timeRemaining}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onToggle}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-2"
          >
            {isExpanded ? 'Hide Details' : 'View Details'}
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          {status === 'active' && (
            <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors">
              Vote
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function HistoryRow({ proposal, category, result, participation, execution, date }: {
  proposal: string;
  category: string;
  result: 'passed' | 'rejected';
  participation: string;
  execution: 'executed' | 'archived' | 'pending';
  date: string;
}) {
  return (
    <tr className="border-b border-slate-700/50 hover:bg-slate-700/20">
      <td className="py-4 px-4">
        <div className="text-sm font-medium text-white">{proposal}</div>
      </td>
      <td className="py-4 px-4">
        <span className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded">{category}</span>
      </td>
      <td className="py-4 px-4">
        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
          result === 'passed'
            ? 'bg-green-500/20 text-green-400'
            : 'bg-red-500/20 text-red-400'
        }`}>
          {result === 'passed' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          {result}
        </span>
      </td>
      <td className="py-4 px-4 text-sm text-slate-300">{participation}</td>
      <td className="py-4 px-4">
        <span className={`text-xs px-2 py-1 rounded ${
          execution === 'executed'
            ? 'bg-cyan-500/20 text-cyan-400'
            : execution === 'pending'
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-slate-600 text-slate-400'
        }`}>
          {execution}
        </span>
      </td>
      <td className="py-4 px-4 text-sm text-slate-400">{date}</td>
    </tr>
  );
}

function InfoCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toString();
}
