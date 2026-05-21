import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, Shield, TrendingDown, TrendingUp, Scale, Cpu, Users,
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

        <section className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <Scale className="w-8 h-8 text-red-400" />
            Legal Disclaimers
          </h2>

          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">No Liability</h3>
              <p className="text-slate-300 mb-3">
                <strong className="text-white">THE PLATFORM, ITS OPERATORS, CONTRIBUTORS, DEVELOPERS, AND ALL ASSOCIATED PARTIES ACCEPT ABSOLUTELY NO LIABILITY FOR ANY LOSSES, DAMAGES, OR CONSEQUENCES ARISING FROM YOUR USE OF THIS PLATFORM OR PARTICIPATION IN THIS ECOSYSTEM.</strong>
              </p>
              <p className="text-slate-300">
                This includes without limitation: loss of funds, loss of access, loss of data, lost profits, business interruption, financial losses of any kind, legal consequences, tax consequences, regulatory consequences, reputational harm, or any other direct, indirect, incidental, special, consequential, or punitive damages. To the maximum extent permitted by applicable law, you agree that the platform and its operators shall have no liability whatsoever.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Securities Law Disclaimer</h3>
              <p className="text-slate-300 mb-3">
                <strong className="text-white">AAIC IS NOT A SECURITY.</strong> The AAIC token is a utility and governance token. It is not an investment contract, equity security, debt instrument, or any other form of security as defined under U.S. or international securities laws.
              </p>
              <p className="text-slate-300">
                AAIC tokens grant governance rights and ecosystem utility. They do not represent ownership, equity, shares, units, or interests in any entity. No dividends, profits, or returns are promised or guaranteed. Token holders have no rights to the assets, revenues, or profits of any business or entity. This is not an offering of securities and should not be viewed as an investment opportunity.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">No Financial Advice</h3>
              <p className="text-slate-300">
                Nothing on this platform constitutes financial, investment, legal, tax, or professional advice of any kind. All information is provided for general educational and informational purposes only. You should not rely on any information provided here to make financial or investment decisions. Always conduct your own research and consult with qualified professional advisors (financial advisors, accountants, lawyers) before making any financial decisions.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Forward-Looking Statements</h3>
              <p className="text-slate-300">
                This platform may contain forward-looking statements, projections, estimates, predictions, and statements about future events. These are subject to significant risks, uncertainties, and assumptions. Actual results may differ materially from any forward-looking statements. We undertake no obligation to update or revise any forward-looking statements. Do not rely on projections, roadmaps, timelines, or future plans as guarantees or promises.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Third-Party Links and Services</h3>
              <p className="text-slate-300">
                This platform may contain links to third-party websites, services, or resources. We do not endorse, control, or assume responsibility for any third-party sites or services. Your use of third-party services is at your own risk and subject to their terms and conditions. We are not liable for any harm or losses resulting from your use of third-party services.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Force Majeure</h3>
              <p className="text-slate-300">
                We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including but not limited to: acts of God, war, terrorism, civil unrest, government actions, epidemics or pandemics, natural disasters, internet or telecommunications failures, blockchain network issues, cyberattacks, third-party service failures, or any other events constituting force majeure. In such events, we reserve the right to suspend or terminate operations without liability.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Jurisdiction-Specific Disclaimers</h3>
              <p className="text-slate-300 mb-3">
                <strong className="text-white">United States:</strong> This platform is not registered with the SEC or any U.S. regulatory authority. AAIC tokens may not be available to U.S. persons depending on regulatory determinations. U.S. persons participate at their own risk and should consult legal counsel regarding applicable laws.
              </p>
              <p className="text-slate-300 mb-3">
                <strong className="text-white">European Union:</strong> This platform may not comply with MiCA (Markets in Crypto-Assets Regulation) or other EU directives. EU residents should be aware that consumer protections may not apply.
              </p>
              <p className="text-slate-300 mb-3">
                <strong className="text-white">Other Jurisdictions:</strong> Cryptocurrency regulations vary significantly by country. You are solely responsible for determining whether your participation is legal in your jurisdiction. We make no representations about the lawfulness of this platform in any jurisdiction.
              </p>
              <p className="text-slate-300">
                <strong className="text-white">Service Restrictions:</strong> We reserve the right to restrict or prohibit access from any jurisdiction at any time without notice, for any reason including legal or regulatory requirements.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">AS-IS and No Warranties</h3>
              <p className="text-slate-300">
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY. WE DISCLAIM ALL WARRANTIES INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, ACCURACY, COMPLETENESS, AVAILABILITY, SECURITY, COMPATIBILITY, OR ERROR-FREE OPERATION. We do not warrant that the platform will be uninterrupted, secure, or free from bugs, viruses, or other harmful components.
              </p>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Comprehensive Release and Indemnification</h3>
              <p className="text-slate-300 mb-3">
                By using this platform, you RELEASE, WAIVE, DISCHARGE, and COVENANT NOT TO SUE the platform, its operators, contributors, developers, affiliates, and all associated parties from any and all liabilities, claims, demands, actions, or causes of action arising out of or related to your use of the platform.
              </p>
              <p className="text-slate-300">
                You agree to INDEMNIFY, DEFEND, and HOLD HARMLESS the platform and its operators from any claims, losses, damages, liabilities, costs, or expenses (including reasonable attorneys' fees) arising from: (1) your use of the platform, (2) your violation of these terms, (3) your violation of any law or regulation, or (4) your violation of any third-party rights.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Acknowledgment Required</h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            By proceeding to use this platform, you acknowledge that you have read, understood, and agreed to all disclaimers, risk disclosures, and terms stated on this page and throughout the platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/legal/risk-disclosure"
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-5 h-5" />
              Read Full Risk Disclosure
            </Link>
            <Link
              to="/ecosystem"
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              Explore the Ecosystem
              <ArrowRight className="w-5 h-5" />
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
