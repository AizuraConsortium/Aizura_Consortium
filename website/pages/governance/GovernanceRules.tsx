import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Vote, ArrowRight, CheckCircle2, Shield, Users, Scale, Clock, AlertCircle, FileText, Target,
  Info, Eye, XCircle, AlertTriangle
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
              value="60%"
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

        <section className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <Vote className="w-8 h-8 text-cyan-400" />
            Business Launchpad Proposals (Different from DAO Governance)
          </h2>

          <p className="text-lg text-slate-300 mb-8 max-w-3xl mx-auto text-center">
            The Launchpad has SEPARATE voting rules for business proposals
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-cyan-400" />
                Launchpad Rules
              </h3>
              <div className="space-y-3 text-sm">
                <LaunchpadParameter label="Deposit to Submit" value="1,000 AAIC" sublabel="(refundable if quorum reached)" />
                <LaunchpadParameter label="Voting Period" value="7 days" />
                <LaunchpadParameter label="Quorum" value="5% of circulating supply" />
                <LaunchpadParameter label="Approval Threshold" value="≥ 60% FOR" />
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-400" />
                Deposit Outcome
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-medium">If quorum reached</div>
                    <div className="text-slate-400">Deposit returned in full</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-medium">If spam/low participation</div>
                    <div className="text-slate-400">Up to 20% slashed (adjustable by governance)</div>
                  </div>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 mt-2">
                  <p className="text-xs text-slate-300">
                    Slashed funds go to treasury
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 max-w-5xl mx-auto mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Why Different Rules?</h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Lower barrier for business experimentation</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Deposit prevents spam without blocking innovation</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Lower quorum acknowledges specialized interest</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Slash mechanism protects against low-effort proposals</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 max-w-5xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4">DAO Governance (Protocol-Level) Rules</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-slate-400 mb-1">Proposal Threshold</div>
                <div className="font-bold text-white">50,000 AAIC</div>
                <div className="text-xs text-slate-500">No deposit, just minimum holding</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-slate-400 mb-1">Voting Delay</div>
                <div className="font-bold text-white">1 day</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-slate-400 mb-1">Voting Period</div>
                <div className="font-bold text-white">14 days</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-slate-400 mb-1">Quorum</div>
                <div className="font-bold text-white">20% of circulating</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-slate-400 mb-1">Approval</div>
                <div className="font-bold text-white">≥ 60% FOR</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-slate-400 mb-1">Timelock Delay</div>
                <div className="font-bold text-white">48 hours</div>
                <div className="text-xs text-slate-500">After passage</div>
              </div>
            </div>
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
                { label: 'Approval', value: '60% yes votes' },
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
                { label: 'Approval', value: '60% yes votes' },
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

        <section className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <Shield className="w-8 h-8 text-red-400" />
            Guardian System
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-3xl mx-auto">
            Multi-signature guardian system provides emergency safeguards during early ecosystem phases,
            transitioning to fully decentralized governance over time.
          </p>

          <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Guardian Powers & Limitations</h3>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <h4 className="font-bold text-green-400 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    What Guardians CAN Do
                  </h4>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 font-bold">•</span>
                      <span><strong className="text-white">Emergency Pause:</strong> Halt critical contracts during active exploits or attacks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 font-bold">•</span>
                      <span><strong className="text-white">Timelock Veto:</strong> Cancel malicious proposals within 48-hour execution delay</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 font-bold">•</span>
                      <span><strong className="text-white">Parameter Adjustments:</strong> Modify guardrail ranges in emergency situations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 font-bold">•</span>
                      <span><strong className="text-white">Security Responses:</strong> Execute pre-approved emergency procedures</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-red-400 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    What Guardians CANNOT Do
                  </h4>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Change tokenomics or supply schedule</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Mint additional tokens beyond the 100M cap</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Access treasury funds without governance approval</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Override completed governance proposals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>Change core immutable guardrails</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-yellow-400 mb-2">Emergency Powers Only</h4>
                    <p className="text-sm text-slate-300">
                      Guardian powers are strictly limited to emergency situations. All guardian actions are logged publicly on-chain
                      and must be justified to the community. Abuse of guardian powers can result in removal via governance vote.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Guardian Structure & Timeline</h3>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-blue-400 text-lg">Year 1: Launch Phase</h4>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full border border-blue-500/30">
                      2-of-3 Multisig
                    </span>
                  </div>
                  <div className="space-y-3 text-sm text-slate-300">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-white">Structure:</strong> 2-of-3 multisig guardian wallet</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-white">Composition:</strong> Core team members with proven track records</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-white">Purpose:</strong> Rapid response to early-stage security threats</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-white">Timeline:</strong> Genesis through end of Year 1</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-purple-400 text-lg">Year 2+: Mature Phase</h4>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-full border border-purple-500/30">
                      3-of-5 Multisig
                    </span>
                  </div>
                  <div className="space-y-3 text-sm text-slate-300">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-white">Structure:</strong> 3-of-5 multisig guardian wallet</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-white">Composition:</strong> Mix of core team and elected community guardians</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-white">Selection:</strong> Community nominees approved by governance vote</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-white">Timeline:</strong> Year 2 onward, with annual guardian elections</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-green-400 text-lg">Year 3+: Decentralization Path</h4>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">
                      Progressive Transfer
                    </span>
                  </div>
                  <div className="space-y-3 text-sm text-slate-300">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-white">Goal:</strong> Transition to fully elected, community-controlled guardian system</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-white">Process:</strong> Gradual reduction of founding team guardian slots</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-white">End State:</strong> All guardian positions filled by governance-elected community members</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-white">Sunset:</strong> Guardian system may be fully deprecated when ecosystem matures</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Transparency Requirements</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-900/50 rounded-lg p-6 text-center">
                  <Eye className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                  <h4 className="font-bold text-white mb-2">Public Logging</h4>
                  <p className="text-sm text-slate-300">
                    All guardian actions are logged on-chain and visible to the entire community
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-6 text-center">
                  <Users className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                  <h4 className="font-bold text-white mb-2">Justification Reports</h4>
                  <p className="text-sm text-slate-300">
                    Guardians must publish detailed reports explaining every action taken
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-6 text-center">
                  <Target className="w-8 h-8 text-green-400 mx-auto mb-4" />
                  <h4 className="font-bold text-white mb-2">Community Review</h4>
                  <p className="text-sm text-slate-300">
                    Guardian actions subject to community review and potential removal vote
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 text-center">
              <Info className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
              <p className="text-slate-300">
                <strong className="text-white">Guardian Philosophy:</strong> Guardians are emergency backstops, not rulers.
                Their power is narrow, temporary, and designed to transition to full community control. Any guardian action
                can be challenged and reversed by governance vote.
              </p>
            </div>
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

function LaunchpadParameter({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-400">{label}:</span>
      <div className="text-right">
        <div className="font-bold text-white">{value}</div>
        {sublabel && <div className="text-xs text-slate-500">{sublabel}</div>}
      </div>
    </div>
  );
}
