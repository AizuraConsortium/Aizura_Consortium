import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, Shield, TrendingDown, Scale, Cpu, Users,
  Globe, DollarSign, Activity, XCircle, Info, ArrowRight,
  FileWarning, Lock, Eye, Zap, Vote
} from 'lucide-react';

export default function DisclaimerRisk() {
  return (
    <PageLayout>
      <div className="space-y-16">
        <section className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            Risk Disclosure
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Disclaimer & Risk Warning
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Participation in this ecosystem involves significant risks. Read carefully before engaging.
          </p>

          <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-6">
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-white">Important:</strong> This ecosystem is experimental and involves
              emerging technologies including AI, blockchain, and decentralized governance. All participants
              should understand the inherent risks before engaging. No guarantees of profit or success are made.
            </p>
          </div>
        </section>

        <section className="bg-red-900/10 border border-red-500/20 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <Cpu className="w-8 h-8 text-red-400" />
            Technical Risks
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            AI and blockchain technologies have inherent limitations and failure modes
          </p>

          <div className="space-y-6">
            <RiskCard
              icon={<Cpu className="w-6 h-6 text-red-400" />}
              title="AI Limitations"
              risks={[
                'AI models may produce incorrect or suboptimal decisions',
                'Agents may fail to achieve business objectives',
                'Performance depends on underlying model capabilities',
                'AI outputs can be unpredictable in edge cases',
                'Models may become outdated as technology evolves',
                'Hallucinations and reasoning errors are possible'
              ]}
            />
            <RiskCard
              icon={<XCircle className="w-6 h-6 text-orange-400" />}
              title="Model Failures"
              risks={[
                'Complete business failure is possible',
                'AI agents may make costly mistakes',
                'Unforeseen technical issues can halt operations',
                'Dependencies on third-party AI services',
                'Model training data biases may affect decisions',
                'Recovery from failures may be slow or impossible'
              ]}
            />
            <RiskCard
              icon={<Activity className="w-6 h-6 text-yellow-400" />}
              title="Infrastructure Dependencies"
              risks={[
                'Reliance on third-party AI providers (OpenAI, Anthropic, etc.)',
                'Blockchain network outages or congestion',
                'Smart contract bugs or vulnerabilities',
                'Database failures or data loss',
                'API rate limits or service disruptions',
                'Infrastructure costs may exceed revenue'
              ]}
            />
          </div>
        </section>

        <section className="bg-orange-900/10 border border-orange-500/20 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <TrendingDown className="w-8 h-8 text-orange-400" />
            Market Risks
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            Market conditions and adoption uncertainty create significant financial risk
          </p>

          <div className="space-y-6">
            <RiskCard
              icon={<Users className="w-6 h-6 text-orange-400" />}
              title="Adoption Uncertainty"
              risks={[
                'User adoption may be slower than projected',
                'Market demand for AI-built businesses is unproven',
                'Competitors may capture market share',
                'Network effects may not materialize',
                'Community may not grow as expected',
                'Early adopters may lose interest'
              ]}
            />
            <RiskCard
              icon={<DollarSign className="w-6 h-6 text-red-400" />}
              title="Revenue Variability"
              risks={[
                'Business revenue is not guaranteed',
                'Income streams may be highly volatile',
                'Market conditions may reduce profitability',
                'Operating costs may exceed revenue',
                'Seasonal fluctuations can affect income',
                'Revenue projections are speculative'
              ]}
            />
            <RiskCard
              icon={<Zap className="w-6 h-6 text-yellow-400" />}
              title="Competition"
              risks={[
                'Other projects may build similar systems',
                'Traditional businesses may adapt faster',
                'Larger entities with more resources may dominate',
                'Technology advantage may be temporary',
                'Market saturation is possible',
                'First-mover advantage may not persist'
              ]}
            />
          </div>
        </section>

        <section className="bg-purple-900/10 border border-purple-500/20 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <Users className="w-8 h-8 text-purple-400" />
            Governance Risks
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            Decentralized governance introduces coordination and decision-making challenges
          </p>

          <div className="space-y-6">
            <RiskCard
              icon={<Vote className="w-6 h-6 text-purple-400" />}
              title="Low Participation"
              risks={[
                'Voter apathy may lead to poor decisions',
                'Low quorum may prevent important proposals from passing',
                'Active minority may control outcomes',
                'Quality of governance may degrade over time',
                'Decision-making may be too slow',
                'Critical updates may be blocked'
              ]}
            />
            <RiskCard
              icon={<Scale className="w-6 h-6 text-blue-400" />}
              title="Whale Dominance"
              risks={[
                'Large token holders may control governance',
                'Decisions may favor whales over community',
                'Voting power concentration is possible',
                'Small holders may have minimal influence',
                'Governance attacks through token accumulation',
                'Note: Mitigation mechanisms are in place but not foolproof'
              ]}
              mitigation="Safeguards include proposal thresholds, time delays, and transparent voting"
            />
          </div>
        </section>

        <section className="bg-blue-900/10 border border-blue-500/20 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <Globe className="w-8 h-8 text-blue-400" />
            Regulatory Risks
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            The regulatory landscape for AI, crypto, and DAOs is evolving and uncertain
          </p>

          <div className="space-y-6">
            <RiskCard
              icon={<FileWarning className="w-6 h-6 text-blue-400" />}
              title="Jurisdictional Uncertainty"
              risks={[
                'Regulations vary significantly by country',
                'Legal status of tokens is unclear in many jurisdictions',
                'Compliance requirements may change suddenly',
                'Geographic restrictions may be imposed',
                'Tax treatment is uncertain and evolving',
                'Enforcement actions are possible'
              ]}
            />
            <RiskCard
              icon={<Cpu className="w-6 h-6 text-cyan-400" />}
              title="AI Regulation Evolution"
              risks={[
                'New AI regulations may restrict operations',
                'Liability for AI decisions is unclear',
                'Autonomous systems may face legal challenges',
                'Disclosure requirements may increase',
                'AI safety regulations may impose constraints',
                'International AI governance is emerging'
              ]}
            />
          </div>

          <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <p className="text-sm text-slate-300">
              <strong className="text-white">Note:</strong> This project does not provide legal or regulatory
              advice. Participants should consult legal professionals regarding their specific situations.
            </p>
          </div>
        </section>

        <section className="bg-yellow-900/10 border border-yellow-500/20 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <DollarSign className="w-8 h-8 text-yellow-400" />
            Economic Risks
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            Economic model uncertainties and market dynamics create financial exposure
          </p>

          <div className="space-y-6">
            <RiskCard
              icon={<TrendingDown className="w-6 h-6 text-red-400" />}
              title="Revenue Underperformance"
              risks={[
                'Businesses may not generate expected revenue',
                'Profit margins may be lower than anticipated',
                'Market conditions may worsen',
                'Operating costs may increase',
                'Business models may fail to validate',
                'Economic downturns may reduce income'
              ]}
            />
            <RiskCard
              icon={<Activity className="w-6 h-6 text-orange-400" />}
              title="Dynamic APY Variability"
              risks={[
                'Staking rewards will fluctuate with revenue',
                'APY is not fixed or guaranteed',
                'Returns may be zero or negative',
                'Rewards depend on business performance',
                'Market conditions affect reward rates',
                'No minimum return is promised'
              ]}
            />
            <RiskCard
              icon={<TrendingDown className="w-6 h-6 text-yellow-400" />}
              title="Token Volatility"
              risks={[
                'Token price may be highly volatile',
                'Market manipulation is possible',
                'Liquidity may be insufficient',
                'Price may go to zero',
                'Pump and dump schemes may occur',
                'No price floor or guarantees exist'
              ]}
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            What We Do to Mitigate Risks
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-2xl mx-auto">
            While risks cannot be eliminated, several mechanisms help reduce exposure
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MitigationCard
              icon={<Eye className="w-6 h-6 text-cyan-400" />}
              title="Transparency"
              description="All operations, votes, and financial flows are publicly visible and auditable"
            />
            <MitigationCard
              icon={<Lock className="w-6 h-6 text-green-400" />}
              title="Governance Safeguards"
              description="Built-in protections prevent malicious proposals and require community approval"
            />
            <MitigationCard
              icon={<Users className="w-6 h-6 text-blue-400" />}
              title="Multi-Agent Validation"
              description="Six AI agents debate decisions, reducing single-point-of-failure risk"
            />
            <MitigationCard
              icon={<Shield className="w-6 h-6 text-purple-400" />}
              title="Progressive Decentralization"
              description="Gradual transfer of control as ecosystem matures and stabilizes"
            />
            <MitigationCard
              icon={<TrendingUp className="w-6 h-6 text-yellow-400" />}
              title="Diversified Portfolio"
              description="Multiple businesses reduce dependency on any single revenue source"
            />
            <MitigationCard
              icon={<Activity className="w-6 h-6 text-orange-400" />}
              title="Continuous Monitoring"
              description="Real-time performance tracking and alerts for issues"
            />
          </div>
        </section>

        <section className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Final Warning
          </h2>

          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-6">
              <p className="text-lg font-bold text-white mb-3">
                Participation implies understanding and acceptance of risk
              </p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>You may lose your entire investment</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>No profits or returns are guaranteed</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Technology may fail in unexpected ways</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Regulatory changes may impact operations</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Market conditions may change dramatically</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 text-center">
              <p className="text-lg font-bold text-cyan-400 mb-4">
                The ecosystem prioritizes transparency over guarantees
              </p>
              <p className="text-slate-300">
                Honest disclosure of risks is more valuable than false promises. Participate only with capital
                you can afford to lose and after understanding all risks outlined here.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Proceed?</h3>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            If you understand the risks and wish to explore the ecosystem, start with these resources
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/ecosystem"
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              Explore the Ecosystem
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/community/faq"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
            >
              Read FAQ
            </Link>
          </div>
        </section>

        <section className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-white mb-2">Disclaimer Update Policy</h4>
              <p className="text-sm text-slate-300">
                This risk disclosure may be updated as the ecosystem evolves and new risks emerge.
                Material changes will be communicated to the community. Last updated: December 2025.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function RiskCard({ icon, title, risks, mitigation }: {
  icon: React.ReactNode;
  title: string;
  risks: string[];
  mitigation?: string;
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="flex items-start gap-4 mb-4">
        {icon}
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <ul className="space-y-2 ml-10">
        {risks.map((risk, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{risk}</span>
          </li>
        ))}
      </ul>
      {mitigation && (
        <div className="mt-4 ml-10 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
          <p className="text-xs text-green-400">
            <strong>Mitigation:</strong> {mitigation}
          </p>
        </div>
      )}
    </div>
  );
}

function MitigationCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
      <div className="mb-3">{icon}</div>
      <h4 className="font-bold text-white mb-2 text-sm">{title}</h4>
      <p className="text-xs text-slate-400">{description}</p>
    </div>
  );
}
