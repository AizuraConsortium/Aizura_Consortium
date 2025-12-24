import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, CheckCircle2, Wallet, Coins, FileText, Target,
  Cpu, TrendingUp, AlertCircle, Shield, ArrowRight, Info, Lightbulb,
  Users, BarChart3, Clock, Sparkles
} from 'lucide-react';
import { useState } from 'react';

export default function SubmitProposal() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    summary: '',
    problemStatement: '',
    solutionOverview: '',
    targetMarket: '',
    aiSuitability: '',
    aiRoles: '',
    keyMetrics: '',
    revenueTargets: '',
    timeline: '',
    risks: '',
    proposerBackground: '',
    agreeToTerms: false,
  });

  const isWalletConnected = false;
  const userTokenBalance = 0;
  const minTokens = 1000;
  const hasActiveProposal = false;

  const eligibilityChecks = [
    { label: 'Wallet connected', met: isWalletConnected, icon: <Wallet className="w-4 h-4" /> },
    { label: `Hold minimum ${minTokens} AAIC tokens`, met: userTokenBalance >= minTokens, icon: <Coins className="w-4 h-4" /> },
    { label: 'No active proposal from this wallet', met: !hasActiveProposal, icon: <FileText className="w-4 h-4" /> },
    { label: 'Agree to proposal terms', met: formData.agreeToTerms, icon: <Shield className="w-4 h-4" /> },
  ];

  const allEligibilityMet = eligibilityChecks.every(check => check.met);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting proposal:', formData);
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-6">
            <Lightbulb className="w-4 h-4" />
            Submit a Business Proposal
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Propose the Next{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI-Run Business
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Proposals approved by the community are built and operated by autonomous AI agents.
          </p>
        </section>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Important Notice</h3>
              <p className="text-sm text-slate-300">
                Submitting a proposal does not guarantee approval. Only proposals that pass governance
                voting proceed to development. Physical or manual businesses cannot be managed by AI
                and are explicitly excluded.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-400" />
            Eligibility Requirements
          </h2>

          <div className="space-y-3 mb-6">
            {eligibilityChecks.map((check, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 p-4 rounded-lg ${
                  check.met
                    ? 'bg-green-500/10 border border-green-500/30'
                    : 'bg-red-500/10 border border-red-500/30'
                }`}
              >
                <div className={check.met ? 'text-green-400' : 'text-red-400'}>
                  {check.icon}
                </div>
                <span className={`font-medium ${check.met ? 'text-green-400' : 'text-red-400'}`}>
                  {check.label}
                </span>
                {check.met ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 ml-auto" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400 ml-auto" />
                )}
              </div>
            ))}
          </div>

          {!isWalletConnected && (
            <div className="text-center py-4">
              <button className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors inline-flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </button>
              <p className="text-sm text-slate-400 mt-3">
                Connect your wallet to check eligibility and submit proposals
              </p>
            </div>
          )}

          {isWalletConnected && userTokenBalance < minTokens && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 text-center">
              <Coins className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Insufficient Token Balance</h3>
              <p className="text-sm text-slate-300 mb-4">
                You need {minTokens} AAIC tokens to submit a proposal. You currently have {userTokenBalance}.
              </p>
              <Link
                to="/token/overview"
                className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
              >
                Learn How to Acquire Tokens
              </Link>
            </div>
          )}
        </div>

        {allEligibilityMet && (
          <>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">What Makes a Strong Proposal?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <TipCard
                  icon={<Target className="w-6 h-6 text-cyan-400" />}
                  title="Clear Value Proposition"
                  description="Define the problem, target market, and why this opportunity exists now"
                />
                <TipCard
                  icon={<BarChart3 className="w-6 h-6 text-green-400" />}
                  title="Measurable Success Metrics"
                  description="Specific KPIs: revenue targets, user growth, market share goals"
                />
                <TipCard
                  icon={<Clock className="w-6 h-6 text-blue-400" />}
                  title="Realistic Scope"
                  description="Can it be built and launched within 3-6 months? Is it technically feasible?"
                />
                <TipCard
                  icon={<TrendingUp className="w-6 h-6 text-purple-400" />}
                  title="Clear Revenue Model"
                  description="How will it generate income? What's the monetization strategy?"
                />
                <TipCard
                  icon={<Cpu className="w-6 h-6 text-yellow-400" />}
                  title="AI Suitability"
                  description="Explain why AI agents can successfully manage this business autonomously"
                />
                <TipCard
                  icon={<Users className="w-6 h-6 text-orange-400" />}
                  title="Market Validation"
                  description="Evidence of demand, competitive analysis, and unique positioning"
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-cyan-400" />
                  Basic Information
                </h3>

                <div className="space-y-6">
                  <FormField
                    label="Proposal Title"
                    required
                    description="A clear, concise title that captures the essence of your business"
                  >
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      placeholder="e.g., AI-Powered Social Media Manager"
                      maxLength={100}
                    />
                  </FormField>

                  <FormField
                    label="Category"
                    required
                    description="Select the category that best fits your business"
                  >
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="">Select a category</option>
                      <option value="trading">Trading</option>
                      <option value="saas">SaaS</option>
                      <option value="infrastructure">Infrastructure</option>
                      <option value="data_analytics">Data / Analytics</option>
                      <option value="other">Other</option>
                    </select>
                  </FormField>

                  <FormField
                    label="One-Line Summary"
                    required
                    description="A single sentence that captures what this business does"
                  >
                    <input
                      type="text"
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      placeholder="e.g., Autonomous social media management that creates and schedules content"
                      maxLength={200}
                    />
                  </FormField>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-cyan-400" />
                  Business Description
                </h3>

                <div className="space-y-6">
                  <FormField
                    label="Problem Statement"
                    required
                    description="What problem does this solve? Why does it matter?"
                  >
                    <textarea
                      value={formData.problemStatement}
                      onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[120px]"
                      placeholder="Describe the problem your business will solve..."
                    />
                  </FormField>

                  <FormField
                    label="Solution Overview"
                    required
                    description="What business are you proposing? How does it solve the problem?"
                  >
                    <textarea
                      value={formData.solutionOverview}
                      onChange={(e) => setFormData({ ...formData, solutionOverview: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[120px]"
                      placeholder="Describe your proposed business and how it works..."
                    />
                  </FormField>

                  <FormField
                    label="Target Users / Market"
                    required
                    description="Who are the customers? What is the market size and opportunity?"
                  >
                    <textarea
                      value={formData.targetMarket}
                      onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[120px]"
                      placeholder="Define your target market and customers..."
                    />
                  </FormField>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Cpu className="w-6 h-6 text-cyan-400" />
                  AI Suitability
                </h3>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-300">
                      This section is critical. You must clearly explain why AI agents can manage
                      this business autonomously. Physical or manual businesses are not suitable.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <FormField
                    label="Why is this business suitable for AI management?"
                    required
                    description="Explain what makes this business ideal for autonomous AI operation"
                  >
                    <textarea
                      value={formData.aiSuitability}
                      onChange={(e) => setFormData({ ...formData, aiSuitability: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[120px]"
                      placeholder="e.g., Fully digital product, scalable automation, decision-making based on data patterns..."
                    />
                  </FormField>

                  <FormField
                    label="AI Roles Required"
                    required
                    description="What AI agent roles are needed? (e.g., Research, Operations, Marketing, Support)"
                  >
                    <textarea
                      value={formData.aiRoles}
                      onChange={(e) => setFormData({ ...formData, aiRoles: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[100px]"
                      placeholder="List the AI agent roles needed and their responsibilities..."
                    />
                  </FormField>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-cyan-400" />
                  Success Criteria
                </h3>

                <div className="space-y-6">
                  <FormField
                    label="Key Metrics"
                    required
                    description="What specific metrics will measure success? (e.g., MRR, user count, conversion rate)"
                  >
                    <textarea
                      value={formData.keyMetrics}
                      onChange={(e) => setFormData({ ...formData, keyMetrics: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[100px]"
                      placeholder="Define measurable success metrics..."
                    />
                  </FormField>

                  <FormField
                    label="Revenue Targets"
                    required
                    description="What are the revenue goals? (e.g., $10k MRR in 6 months, $100k ARR in year 1)"
                  >
                    <textarea
                      value={formData.revenueTargets}
                      onChange={(e) => setFormData({ ...formData, revenueTargets: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[100px]"
                      placeholder="Specify revenue targets and timeline..."
                    />
                  </FormField>

                  <FormField
                    label="Timeline Expectations"
                    required
                    description="How long to build, launch, and reach profitability?"
                  >
                    <textarea
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[100px]"
                      placeholder="Outline the expected timeline for key milestones..."
                    />
                  </FormField>

                  <FormField
                    label="Risk Considerations"
                    required
                    description="What are the main risks and how can they be mitigated?"
                  >
                    <textarea
                      value={formData.risks}
                      onChange={(e) => setFormData({ ...formData, risks: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[100px]"
                      placeholder="Identify potential risks and mitigation strategies..."
                    />
                  </FormField>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-cyan-400" />
                  Proposer Information
                </h3>

                <div className="space-y-6">
                  <FormField
                    label="Wallet Address"
                    description="Your wallet address will be recorded for equity allocation and rewards"
                  >
                    <input
                      type="text"
                      value="0x1234...5678"
                      readOnly
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-400 focus:outline-none cursor-not-allowed"
                    />
                  </FormField>

                  <FormField
                    label="Background / Experience (Optional)"
                    description="Share relevant background or expertise (helps build credibility)"
                  >
                    <textarea
                      value={formData.proposerBackground}
                      onChange={(e) => setFormData({ ...formData, proposerBackground: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[100px]"
                      placeholder="Describe your relevant background or expertise..."
                    />
                  </FormField>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-yellow-400" />
                  Equity & Reward Disclosure
                </h3>

                <div className="space-y-4 mb-6">
                  <p className="text-slate-300">
                    If this proposal is approved and launched, the proposer may receive an equity
                    allocation in the resulting business, subject to governance rules and performance
                    criteria.
                  </p>

                  <div className="bg-slate-900/50 rounded-lg p-4 space-y-2">
                    <div className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">
                        <span className="font-bold text-white">Equity Range:</span> 5-15% of the business
                      </span>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">
                        <span className="font-bold text-white">Determined by:</span> Vote margin, engagement, and business performance
                      </span>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">
                        <span className="font-bold text-white">Vesting:</span> Performance-based allocation over time
                      </span>
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded border-slate-600 bg-slate-900/50 text-cyan-600 focus:ring-cyan-500 focus:ring-offset-slate-900"
                  />
                  <span className="text-sm text-slate-300">
                    I understand and agree to the equity allocation terms and proposal submission
                    requirements. I acknowledge that approval is not guaranteed and is subject to
                    community governance.
                  </span>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={!allEligibilityMet}
                  className={`flex-1 px-8 py-4 font-bold rounded-lg text-lg transition-colors inline-flex items-center justify-center gap-2 ${
                    allEligibilityMet
                      ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  Submit Proposal
                </button>
                <Link
                  to="/launchpad"
                  className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </form>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-cyan-400" />
                What Happens Next?
              </h3>

              <div className="space-y-4">
                <TimelineStep
                  number="1"
                  title="Proposal Listed Publicly"
                  description="Your proposal appears on the Launchpad for all community members to review"
                />
                <TimelineStep
                  number="2"
                  title="Voting Opens"
                  description="Community members with tokens can vote FOR or AGAINST your proposal"
                />
                <TimelineStep
                  number="3"
                  title="Voting Period"
                  description="7-14 days of active voting, depending on community engagement"
                />
                <TimelineStep
                  number="4"
                  title="Result Executed Automatically"
                  description="If approved, AI agents begin development. If rejected, proposal is archived"
                />
                <TimelineStep
                  number="5"
                  title="Status Updates"
                  description="Track progress through development, launch, and profitability phases"
                />
              </div>

              <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="text-sm text-slate-300">
                  <span className="font-bold text-cyan-400">Track your proposal:</span> After
                  submission, you'll be redirected to your proposal's detail page where you can
                  monitor votes and community feedback in real-time.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}

function TipCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{icon}</div>
        <div>
          <h4 className="font-bold text-white mb-1 text-sm">{title}</h4>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, required, description, children }: {
  label: string;
  required?: boolean;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {description && (
        <p className="text-xs text-slate-400 mb-2">{description}</p>
      )}
      {children}
    </div>
  );
}

function TimelineStep({ number, title, description }: { number: string; title: string; description: string }) {
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
