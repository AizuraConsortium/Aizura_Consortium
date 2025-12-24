import { useState } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import {
  AlertTriangle, TrendingDown, Code, Scale, Briefcase,
  Users, Server, Shield, CheckCircle2
} from 'lucide-react';

export default function RiskDisclosure() {
  const [acknowledged, setAcknowledged] = useState(false);

  const riskCategories = [
    {
      icon: <TrendingDown className="w-8 h-8 text-red-400" />,
      title: 'Market Risks',
      color: 'red',
      risks: [
        {
          title: 'Cryptocurrency Volatility',
          description: 'AAIC token value may fluctuate dramatically. Prices can rise or fall by 50% or more in a single day. You may lose your entire investment.'
        },
        {
          title: 'Token Value May Go to Zero',
          description: 'There is no guarantee that AAIC will maintain any value. The token could become worthless. Never invest more than you can afford to lose completely.'
        },
        {
          title: 'No Guarantee of Liquidity',
          description: 'You may not be able to sell your tokens when you want to. Low trading volume could make it impossible to exit your position. Liquidity can disappear suddenly.'
        },
        {
          title: 'Market Manipulation Risks',
          description: 'Cryptocurrency markets are susceptible to manipulation, pump-and-dump schemes, wash trading, and coordinated buying/selling that can artificially affect prices.'
        },
        {
          title: 'No Price Floor or Support',
          description: 'There is no mechanism, promise, or entity supporting a minimum price. No buybacks, no treasury support, no price protection of any kind exists.'
        },
      ],
    },
    {
      icon: <Code className="w-8 h-8 text-orange-400" />,
      title: 'Technical Risks',
      color: 'orange',
      risks: [
        {
          title: 'Smart Contract Bugs or Exploits',
          description: 'Smart contracts may contain bugs, vulnerabilities, or design flaws that could be exploited. Funds could be stolen, locked, or destroyed. Audits do not guarantee security.'
        },
        {
          title: 'Blockchain Network Issues',
          description: 'The underlying blockchain (Ethereum, BSC, etc.) may experience congestion, downtime, forks, or attacks. Transactions may fail, delay, or execute at unexpected times.'
        },
        {
          title: 'Oracle Failures',
          description: 'Price feeds and external data sources may fail, provide incorrect data, or be manipulated. This could cause incorrect execution of smart contracts.'
        },
        {
          title: 'Wallet Security',
          description: 'You are solely responsible for securing your private keys and wallet. Lost keys mean lost funds permanently. Compromised keys mean stolen funds. No recovery is possible.'
        },
        {
          title: 'Software Bugs',
          description: 'The platform, frontend, backend, or any component may contain bugs that cause loss of funds, incorrect data, or system failures.'
        },
        {
          title: 'Upgrade Risks',
          description: 'System upgrades or migrations may fail, introduce new bugs, or cause temporary or permanent loss of functionality or access to funds.'
        },
      ],
    },
    {
      icon: <Scale className="w-8 h-8 text-yellow-400" />,
      title: 'Regulatory Risks',
      color: 'yellow',
      risks: [
        {
          title: 'Changing Regulations',
          description: 'Cryptocurrency regulations are evolving rapidly. New laws or regulations may restrict, prohibit, or heavily regulate the platform, tokens, or your ability to participate.'
        },
        {
          title: 'Service Restrictions by Jurisdiction',
          description: 'The platform may become unavailable in certain jurisdictions due to legal or regulatory requirements. Your access may be terminated without notice.'
        },
        {
          title: 'Securities Law Uncertainty',
          description: 'Regulators may determine that AAIC or platform activities constitute unregistered securities, leading to legal action, fines, or shutdown of operations.'
        },
        {
          title: 'Tax Implications',
          description: 'You are solely responsible for determining and paying all applicable taxes. Tax treatment of cryptocurrency is complex and varies by jurisdiction. Consult a tax professional.'
        },
        {
          title: 'Enforcement Actions',
          description: 'Government agencies may take enforcement action against the platform, team members, or participants. This could result in asset freezing, legal proceedings, or platform shutdown.'
        },
      ],
    },
    {
      icon: <Briefcase className="w-8 h-8 text-purple-400" />,
      title: 'Business Risks',
      color: 'purple',
      risks: [
        {
          title: 'AI-Managed Businesses May Fail',
          description: 'Businesses created and managed by the AI consortium may fail to launch, fail to generate revenue, or become unprofitable. Most startups fail. AI does not change this.'
        },
        {
          title: 'Revenue Projections Not Guaranteed',
          description: 'Any projections, estimates, or forecasts of revenue, profits, or token value are speculative. Actual results may differ dramatically. No promises or guarantees are made.'
        },
        {
          title: 'Product-Market Fit Risk',
          description: 'The ecosystem may fail to achieve product-market fit. Businesses may not attract users or generate demand. The entire model could prove non-viable.'
        },
        {
          title: 'Competition',
          description: 'Other projects may copy, improve upon, or out-compete Aizura. First-mover advantage may not materialize. Superior alternatives may emerge.'
        },
        {
          title: 'Dependency on Third Parties',
          description: 'The platform relies on third-party services (AI APIs, blockchain networks, hosting providers, etc.). Failures, price increases, or termination of these services could severely impact operations.'
        },
        {
          title: 'Team Risk',
          description: 'Anonymous team members may abandon the project, act maliciously, or prove incompetent. There is no recourse against anonymous developers.'
        },
      ],
    },
    {
      icon: <Users className="w-8 h-8 text-blue-400" />,
      title: 'Governance Risks',
      color: 'blue',
      risks: [
        {
          title: 'Unpredictable Proposal Outcomes',
          description: 'Community governance means decisions are made by token holders. Proposals may pass or fail based on community sentiment, not rationality. Bad decisions may be made.'
        },
        {
          title: 'Governance Attacks',
          description: 'Large token holders could manipulate voting, pass malicious proposals, or extract value. Sybil attacks, bribing, and collusion are possible.'
        },
        {
          title: 'Voter Apathy',
          description: 'Low participation rates may allow small groups to control decisions. Important proposals may fail to reach quorum. Governance may become ineffective.'
        },
        {
          title: 'Irreversible Decisions',
          description: 'Some governance decisions may be irreversible once executed. Smart contract changes, fund transfers, or parameter adjustments cannot always be undone.'
        },
        {
          title: 'Conflict of Interest',
          description: 'Community decisions may not benefit all holders equally. Some decisions may benefit certain groups at the expense of others.'
        },
      ],
    },
    {
      icon: <Server className="w-8 h-8 text-green-400" />,
      title: 'Operational Risks',
      color: 'green',
      risks: [
        {
          title: 'Platform Downtime',
          description: 'The platform may experience downtime due to maintenance, technical issues, attacks, or other causes. You may be unable to access your funds or execute transactions.'
        },
        {
          title: 'Data Loss',
          description: 'User data, transaction history, or other information may be lost due to database failures, attacks, or errors. Backups may fail or be incomplete.'
        },
        {
          title: 'Third-Party Service Failures',
          description: 'External services (node providers, APIs, hosting, etc.) may fail, causing platform unavailability or malfunction. We do not control these services.'
        },
        {
          title: 'Scaling Limitations',
          description: 'The platform may not scale to handle increased usage. High traffic could cause slow performance, failed transactions, or service degradation.'
        },
        {
          title: 'Backup and Recovery Risks',
          description: 'Disaster recovery processes may fail. Backups may be corrupted, incomplete, or inaccessible. Recovery from catastrophic failures is not guaranteed.'
        },
      ],
    },
  ];

  return (
    <PageLayout>
      <div className="space-y-16">
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            Important Legal Notice
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
              Risk Disclosure
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Read this entire document carefully before participating in the Aizura ecosystem. Your participation
            constitutes acceptance of all risks described below.
          </p>
        </section>

        <section className="bg-red-500/20 border-2 border-red-500 rounded-2xl p-8 lg:p-12">
          <div className="flex items-start gap-6">
            <AlertTriangle className="w-12 h-12 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                MANDATORY ACKNOWLEDGMENT
              </h2>
              <p className="text-xl text-white font-bold mb-4">
                BY USING THIS PLATFORM, YOU ACKNOWLEDGE AND ACCEPT ALL RISKS DESCRIBED BELOW
              </p>
              <p className="text-lg text-slate-200 mb-4">
                Participation in the Aizura ecosystem involves substantial risks. You may lose your entire investment.
                You may lose access to your funds. You may face legal, tax, or regulatory consequences.
              </p>
              <p className="text-lg text-slate-200">
                <strong>If you do not fully understand and accept these risks, DO NOT PARTICIPATE.</strong>
              </p>
            </div>
          </div>
        </section>

        {riskCategories.map((category, index) => (
          <section key={index} className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className={`p-3 bg-${category.color}-500/10 rounded-lg`}>
                {category.icon}
              </div>
              <h2 className="text-3xl font-bold text-white">{category.title}</h2>
            </div>

            <div className="space-y-6">
              {category.risks.map((risk, riskIndex) => (
                <div key={riskIndex} className={`bg-${category.color}-500/5 border border-${category.color}-500/20 rounded-xl p-6`}>
                  <h3 className="text-xl font-bold text-white mb-3">{risk.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{risk.description}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="flex items-center gap-4 mb-8">
            <Shield className="w-10 h-10 text-slate-400" />
            <h2 className="text-3xl font-bold text-white">Additional Risks & Non-Exhaustive Clause</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">This List Is Not Exhaustive</h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                The risks described above are not a complete list of all possible risks. Other risks not described
                here may exist or emerge in the future. Technology, markets, regulations, and circumstances change
                constantly.
              </p>
              <p className="text-slate-300 leading-relaxed">
                <strong className="text-white">You accept all risks, known and unknown, foreseen and unforeseen,
                by participating in this platform.</strong>
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">No Risk Mitigation Guarantee</h3>
              <p className="text-slate-300 leading-relaxed">
                While we implement security measures, audits, testing, and best practices, none of these eliminate
                risk. All systems can fail. All security can be breached. All businesses can collapse.
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Emerging Risks</h3>
              <p className="text-slate-300 leading-relaxed mb-3">
                New types of risks may emerge that we cannot currently anticipate, including:
              </p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Novel attack vectors against blockchain or AI systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Unexpected interactions between smart contracts or systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Regulatory changes that fundamentally alter the landscape</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Economic or geopolitical events affecting cryptocurrency markets</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Technological breakthroughs that obsolete current systems</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-red-500/20 border-2 border-red-500 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              NO LIABILITY - NO WARRANTIES - NO GUARANTEES
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900/70 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Platform Liability</h3>
              <p className="text-slate-200 leading-relaxed">
                <strong>THE PLATFORM, ITS OPERATORS, CONTRIBUTORS, DEVELOPERS, AND ALL ASSOCIATED PARTIES ACCEPT
                NO LIABILITY FOR ANY LOSSES, DAMAGES, OR CONSEQUENCES ARISING FROM YOUR USE OF THIS PLATFORM.</strong>
              </p>
              <p className="text-slate-300 mt-3">
                This includes but is not limited to: loss of funds, loss of data, loss of access, lost profits,
                financial losses, legal consequences, tax consequences, regulatory consequences, or any other
                damages of any kind.
              </p>
            </div>

            <div className="bg-slate-900/70 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">User Responsibility</h3>
              <p className="text-slate-200 leading-relaxed">
                <strong>YOU ARE SOLELY RESPONSIBLE FOR YOUR DECISIONS AND OUTCOMES.</strong>
              </p>
              <p className="text-slate-300 mt-3">
                You are responsible for: conducting your own research, understanding the risks, securing your
                private keys, determining tax obligations, complying with applicable laws, and accepting all
                consequences of your participation.
              </p>
            </div>

            <div className="bg-slate-900/70 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">No Warranties or Guarantees</h3>
              <p className="text-slate-200 leading-relaxed">
                <strong>NO WARRANTIES OR GUARANTEES OF ANY KIND ARE PROVIDED.</strong>
              </p>
              <p className="text-slate-300 mt-3">
                The platform is provided "AS IS" without warranties of any kind, express or implied, including
                but not limited to warranties of merchantability, fitness for a particular purpose, accuracy,
                availability, or non-infringement. No promises, projections, or representations are guaranteed.
              </p>
            </div>

            <div className="bg-slate-900/70 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Indemnification</h3>
              <p className="text-slate-200 leading-relaxed">
                By using this platform, you agree to indemnify and hold harmless the platform, its operators,
                contributors, and associated parties from any claims, losses, damages, liabilities, and expenses
                (including legal fees) arising from your use of the platform or your violation of these terms.
              </p>
            </div>

            <div className="bg-slate-900/70 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Limitation of Liability</h3>
              <p className="text-slate-200 leading-relaxed">
                To the maximum extent permitted by law, in no event shall the platform, its operators, or
                contributors be liable for any indirect, incidental, special, consequential, or punitive damages,
                or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data,
                use, goodwill, or other intangible losses.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Risk Acknowledgment
            </h2>
            <p className="text-lg text-slate-300">
              Confirm you have read and understand all risks before proceeding
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-900/50 rounded-xl p-8">
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                    className="w-6 h-6 rounded border-slate-600 text-cyan-600 focus:ring-cyan-500 focus:ring-offset-slate-900 cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium mb-2">
                    I have read and understand all risks described on this page
                  </p>
                  <p className="text-sm text-slate-400">
                    I acknowledge that: (1) I may lose my entire investment, (2) no warranties or guarantees are
                    provided, (3) I am solely responsible for my decisions and outcomes, (4) the platform accepts
                    no liability for any losses, (5) this list of risks is not exhaustive, and (6) I accept all
                    risks, known and unknown.
                  </p>
                </div>
              </label>

              {acknowledged && (
                <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <p className="text-green-400 font-medium">
                    Risk acknowledgment recorded. You may proceed to use the platform.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-400">
                Last updated: December 24, 2024
              </p>
            </div>
          </div>
        </section>

        <section className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Seek Professional Advice</h3>
              <p className="text-slate-300 mb-3">
                This risk disclosure does not constitute financial, legal, tax, or investment advice. You should
                consult with qualified professionals before making any decisions related to cryptocurrency, blockchain
                technology, or financial investments.
              </p>
              <p className="text-slate-300">
                <strong className="text-white">If you do not understand these risks or cannot afford to lose your
                entire investment, do not participate.</strong>
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
