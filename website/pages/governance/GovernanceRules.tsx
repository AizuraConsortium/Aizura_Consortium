import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Vote, ArrowRight, CheckCircle2, Shield, Users, Scale, Clock, AlertCircle, FileText, Target
} from 'lucide-react';

export default function GovernanceRules() {
  return (
    <PageLayout>
      <div className="space-y-20">
        <section className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Governance Rules
          </h1>

          <p className="text-2xl text-cyan-400 mb-6 font-medium">
            Thresholds, quorum requirements, and voting parameters that govern the ecosystem.
          </p>

          <p className="text-lg text-slate-300 mb-8">
            Transparent rules ensure fair, effective governance by token holders.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/launchpad/submit-proposal"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Submit Proposal
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/governance"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
            >
              View Active Proposals
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Voting Parameters</h2>

          <p className="text-lg text-slate-300 mb-8 max-w-3xl mx-auto text-center">
            All proposals must meet minimum thresholds to be valid and pass.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ParameterCard
              icon={<Users className="w-8 h-8 text-cyan-400" />}
              label="Minimum Quorum"
              value="20%"
              description="of total token supply must participate"
            />
            <ParameterCard
              icon={<Target className="w-8 h-8 text-green-400" />}
              label="Approval Threshold"
              value="66%"
              description="of votes cast must be 'yes'"
            />
            <ParameterCard
              icon={<Clock className="w-8 h-8 text-blue-400" />}
              label="Voting Period"
              value="7 Days"
              description="standard duration for most proposals"
            />
            <ParameterCard
              icon={<Shield className="w-8 h-8 text-purple-400" />}
              label="Proposal Threshold"
              value="1000 Tokens"
              description="minimum to submit a proposal"
            />
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Proposal Types & Requirements</h2>

          <div className="space-y-6">
            <ProposalTypeCard
              type="Standard Proposal"
              icon={<FileText className="w-6 h-6 text-blue-400" />}
              requirements={[
                { label: 'Quorum', value: '20% of supply' },
                { label: 'Approval', value: '66% yes votes' },
                { label: 'Voting Period', value: '7 days' },
                { label: 'Execution Delay', value: '48 hours after passage' }
              ]}
              examples={[
                'New business proposals',
                'Portfolio adjustments',
                'Revenue allocation changes',
                'Strategic partnerships'
              ]}
            />

            <ProposalTypeCard
              type="Critical Proposal"
              icon={<AlertCircle className="w-6 h-6 text-red-400" />}
              requirements={[
                { label: 'Quorum', value: '30% of supply' },
                { label: 'Approval', value: '75% yes votes' },
                { label: 'Voting Period', value: '14 days' },
                { label: 'Execution Delay', value: '7 days after passage' }
              ]}
              examples={[
                'Governance rule changes',
                'Treasury spending over $1M',
                'Security-critical updates',
                'Emergency interventions'
              ]}
            />

            <ProposalTypeCard
              type="Fast-Track Proposal"
              icon={<Clock className="w-6 h-6 text-yellow-400" />}
              requirements={[
                { label: 'Quorum', value: '15% of supply' },
                { label: 'Approval', value: '80% yes votes' },
                { label: 'Voting Period', value: '48 hours' },
                { label: 'Execution Delay', value: 'Immediate' }
              ]}
              examples={[
                'Time-sensitive opportunities',
                'Bug fixes and patches',
                'Urgent market responses',
                'Security hotfixes'
              ]}
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Voting Power</h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <RuleCard
              title="1 Token = 1 Vote"
              description="Voting power is directly proportional to token holdings. No quadratic voting or complex mechanisms — simple and transparent."
            />
            <RuleCard
              title="Delegation Supported"
              description="Token holders can delegate voting power to trusted addresses without transferring tokens. Delegated votes count toward quorum."
            />
            <RuleCard
              title="Vote Privacy"
              description="Votes are public and on-chain. Transparency ensures accountability and prevents hidden coordination."
            />
            <RuleCard
              title="No Vote Buying"
              description="Vote buying, bribing, or coercion is strictly prohibited and may result in governance exclusion."
            />
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Submission Requirements</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <RequirementCard
              title="Proposal Content"
              items={[
                'Clear, concise title and summary',
                'Detailed description of proposed action',
                'Expected outcomes and success metrics',
                'Resource requirements and timeline',
                'Risk assessment and mitigation plan'
              ]}
            />
            <RequirementCard
              title="Submitter Qualifications"
              items={[
                'Hold minimum 1000 tokens',
                'Tokens must be held for at least 30 days',
                'Cannot have active unresolved proposals',
                'Must include contact information',
                'Subject to community standards and etiquette'
              ]}
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Proposal Lifecycle</h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <PhaseCard
              phase="1. Submission"
              description="Proposal is submitted on-chain with required token stake. Community can view and provide initial feedback."
              duration="Immediate"
            />
            <PhaseCard
              phase="2. Review Period"
              description="Community discussion and debate. Submitter may answer questions and clarify details. AI agents provide analysis."
              duration="3 days"
            />
            <PhaseCard
              phase="3. Voting Period"
              description="Token holders cast votes. Quorum and approval thresholds must be met for proposal to pass."
              duration="7 days (standard)"
            />
            <PhaseCard
              phase="4. Execution Delay"
              description="If passed, proposal enters execution delay period. This allows for final review and prevents instant execution."
              duration="48 hours (standard)"
            />
            <PhaseCard
              phase="5. Execution"
              description="Proposal is executed on-chain or by AI agents. Results are tracked and reported to community."
              duration="Varies"
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Checks & Balances
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            <CheckItem
              title="Emergency Pause"
              description="Critical security issues can trigger emergency pause requiring 75% approval to resume."
            />
            <CheckItem
              title="Veto Rights"
              description="Proposals that threaten ecosystem security or violate core principles can be vetoed by guardian multisig."
            />
            <CheckItem
              title="Dispute Resolution"
              description="Community can challenge proposal validity through dispute resolution process."
            />
            <CheckItem
              title="Rule Amendments"
              description="Governance rules themselves can be changed through critical proposals requiring higher thresholds."
            />
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Best Practices</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BestPracticeCard
              icon={<FileText className="w-6 h-6 text-cyan-400" />}
              title="Clear Communication"
              description="Write proposals in plain language. Avoid jargon. State goals and methods explicitly."
            />
            <BestPracticeCard
              icon={<Users className="w-6 h-6 text-green-400" />}
              title="Community Engagement"
              description="Discuss ideas in forums before formal submission. Build consensus early."
            />
            <BestPracticeCard
              icon={<Scale className="w-6 h-6 text-blue-400" />}
              title="Balanced Approach"
              description="Consider both short-term and long-term impacts. Balance innovation with stability."
            />
            <BestPracticeCard
              icon={<CheckCircle2 className="w-6 h-6 text-purple-400" />}
              title="Success Metrics"
              description="Define measurable outcomes. Specify how success will be evaluated."
            />
            <BestPracticeCard
              icon={<Shield className="w-6 h-6 text-yellow-400" />}
              title="Risk Management"
              description="Identify potential risks and mitigation strategies. Be honest about uncertainties."
            />
            <BestPracticeCard
              icon={<Target className="w-6 h-6 text-red-400" />}
              title="Scope Control"
              description="Keep proposals focused. One proposal per issue. Avoid bundling unrelated items."
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Rule Evolution
          </h2>

          <div className="max-w-3xl mx-auto text-lg text-slate-300 space-y-4">
            <p>
              Governance rules are not set in stone. As the ecosystem matures and learns from experience,
              these rules can be updated through critical proposals.
            </p>
            <p>
              Changes to governance rules require higher thresholds (30% quorum, 75% approval) to ensure
              broad community support for any modifications to how decisions are made.
            </p>
            <p>
              This balance between stability and adaptability ensures governance remains effective as
              the ecosystem grows and evolves.
            </p>
          </div>
        </section>

        <section className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Your voice shapes the future.
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Fair, transparent governance rules ensure every token holder has a real say in ecosystem decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/launchpad/submit-proposal"
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Submit a Proposal
            </Link>
            <Link
              to="/governance"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
            >
              View Active Votes
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function ParameterCard({
  icon,
  label,
  value,
  description
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <div className="text-sm text-slate-400 mb-2">{label}</div>
      <div className="text-2xl font-bold text-white mb-2">{value}</div>
      <p className="text-xs text-slate-300">{description}</p>
    </div>
  );
}

function ProposalTypeCard({
  type,
  icon,
  requirements,
  examples
}: {
  type: string;
  icon: React.ReactNode;
  requirements: { label: string; value: string }[];
  examples: string[];
}) {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="text-2xl font-bold text-white">{type}</h3>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {requirements.map((req, idx) => (
          <div key={idx} className="bg-slate-700/30 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">{req.label}</div>
            <div className="text-lg font-semibold text-white">{req.value}</div>
          </div>
        ))}
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Examples:</h4>
        <ul className="space-y-2">
          {examples.map((example, idx) => (
            <li key={idx} className="flex items-start gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
              <span className="text-sm">{example}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RuleCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-300">{description}</p>
    </div>
  );
}

function RequirementCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-slate-300">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PhaseCard({ phase, description, duration }: { phase: string; description: string; duration: string }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-bold text-white">{phase}</h3>
        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm font-medium rounded-full">
          {duration}
        </span>
      </div>
      <p className="text-slate-300">{description}</p>
    </div>
  );
}

function CheckItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg">
      <Shield className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
        <p className="text-sm text-slate-300">{description}</p>
      </div>
    </div>
  );
}

function BestPracticeCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <p className="text-sm text-slate-300">{description}</p>
    </div>
  );
}
