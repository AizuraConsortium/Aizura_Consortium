import { Link } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { Shield, AlertTriangle, Scale } from 'lucide-react';

export default function TermsofUse() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Scale className="w-12 h-12 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">Terms of Use</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Last Updated: December 24, 2025
          </p>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div className="text-sm text-slate-300 space-y-2">
              <p className="font-bold text-white">Important Notice</p>
              <p>These Terms of Use contain important legal information. Please read them carefully before using the Platform.</p>
            </div>
          </div>
        </div>

        <div className="prose prose-invert prose-cyan max-w-none space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              These Terms of Use ("Terms") govern your access to and use of the AI Autonomous Investment Consortium ("AAIC")
              ecosystem, including its website, dashboard, smart contracts, token systems, governance mechanisms, and all
              associated services (collectively, the "Platform").
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              By accessing or using the Platform in any capacity, you acknowledge that you have read, understood, and agree
              to be bound by these Terms and all applicable laws and regulations. If you do not agree to these Terms, you
              must immediately cease all use of the Platform.
            </p>
            <p className="text-slate-300 leading-relaxed">
              These Terms constitute a legally binding agreement between you ("User," "you," or "your") and the operators
              and contributors of the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Eligibility and Access</h2>
            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">2.1 Legal Capacity</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              You must be at least 18 years of age (or the age of majority in your jurisdiction) and have the legal capacity
              to enter into binding contracts. By using the Platform, you represent and warrant that you meet these eligibility
              requirements.
            </p>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">2.2 Jurisdictional Compliance</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              You are solely responsible for ensuring that your use of the Platform complies with all applicable laws,
              regulations, and rules in your jurisdiction, including but not limited to:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Securities laws and regulations</li>
              <li>Anti-money laundering (AML) requirements</li>
              <li>Know Your Customer (KYC) obligations</li>
              <li>Tax reporting and payment obligations</li>
              <li>Digital asset and cryptocurrency regulations</li>
              <li>Consumer protection laws</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">2.3 Prohibited Jurisdictions</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              The Platform is not available to persons or entities in jurisdictions where its use would be illegal or
              prohibited. You may not use the Platform if you are located in, incorporated in, or a citizen or resident of:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Any jurisdiction where digital assets or blockchain-based platforms are prohibited by law</li>
              <li>Any jurisdiction subject to comprehensive sanctions by the United Nations, European Union, United States, or United Kingdom</li>
              <li>Any jurisdiction where your use would violate applicable law</li>
            </ul>
            <p className="text-slate-300 leading-relaxed">
              The Platform reserves the right to restrict access from any jurisdiction at its sole discretion without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Nature of the Platform</h2>
            <p className="text-slate-300 leading-relaxed mb-4 font-semibold">
              This section is critically important to your understanding of what the Platform is and is not.
            </p>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">3.1 What the Platform Is</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              The Platform provides access to:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Decentralized governance tools and voting mechanisms</li>
              <li>AI-operated services and autonomous systems</li>
              <li>Informational content regarding blockchain technology and AI development</li>
              <li>Token-based coordination mechanisms</li>
              <li>Community proposal and deliberation systems</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">3.2 What the Platform Is Not</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              The Platform explicitly does NOT provide:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li><strong>Financial advice:</strong> No content on the Platform constitutes financial, investment, legal, or tax advice</li>
              <li><strong>Investment services:</strong> The Platform is not an investment fund, broker, dealer, or investment advisor</li>
              <li><strong>Securities offerings:</strong> AAIC tokens are utility and governance tools, not securities or investment contracts</li>
              <li><strong>Custodial services:</strong> The Platform does not hold, custody, or control your digital assets or private keys</li>
              <li><strong>Brokerage services:</strong> The Platform does not execute trades or transactions on your behalf</li>
              <li><strong>Guaranteed returns:</strong> No representation or promise of profit, revenue, or financial return is made</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">3.3 No Fiduciary Relationship</h3>
            <p className="text-slate-300 leading-relaxed">
              No fiduciary, advisory, or agency relationship exists between you and the Platform, its operators, contributors,
              or affiliated parties. You acknowledge that you are acting independently and making your own decisions regarding
              participation in the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. No Investment Advice</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              <strong>Nothing on the Platform constitutes investment advice, financial advice, trading advice, or any
              other type of advice.</strong> All content is provided for informational and educational purposes only.
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              AAIC tokens are utility and governance tools designed to facilitate coordination and decision-making within
              the ecosystem. They are not:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Securities or investment contracts</li>
              <li>Equity or ownership interests in any entity</li>
              <li>Debt instruments or loans</li>
              <li>Promises of future profits or returns</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mb-4">
              <strong>No expectation of profit is promised, implied, or guaranteed.</strong> Token value may fluctuate
              significantly and may become worthless. You should not participate in the Platform with the expectation of
              financial gain.
            </p>
            <p className="text-slate-300 leading-relaxed">
              You are solely responsible for conducting your own research, consulting with qualified professionals, and
              making your own independent decisions regarding participation in the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. AI Systems Disclaimer</h2>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-6">
              <p className="text-red-400 font-bold mb-2">CRITICAL: READ CAREFULLY</p>
              <p className="text-slate-300 text-sm">
                The Platform utilizes autonomous artificial intelligence systems. AI behavior is inherently unpredictable
                and may produce unexpected results.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">5.1 AI Operations</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Autonomous AI agents operate according to predefined parameters, algorithms, and data inputs. These systems:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Function independently based on programmed logic</li>
              <li>Make decisions using available data and learned patterns</li>
              <li>May interact with external APIs, blockchain networks, and other systems</li>
              <li>Operate continuously without human intervention in normal circumstances</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">5.2 No AI Guarantees</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              AI outputs and behaviors may be incorrect, incomplete, biased, or unexpected. You acknowledge and accept that:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>AI systems do NOT guarantee accuracy, performance, or profitability</li>
              <li>AI decisions may result in financial losses or adverse outcomes</li>
              <li>AI models may behave unpredictably under novel or extreme conditions</li>
              <li>AI systems may experience failures, errors, or security vulnerabilities</li>
              <li>AI-generated content may be misleading or incorrect</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">5.3 AI as Tools, Not Humans</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              AI agents are autonomous tools, not human beings, legal persons, or fiduciaries. They:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Do not have legal personhood or agency</li>
              <li>Do not owe fiduciary duties to users</li>
              <li>Are not liable for their outputs or actions</li>
              <li>Cannot enter into legal agreements or assume obligations</li>
            </ul>
            <p className="text-slate-300 leading-relaxed">
              Users bear all risks associated with relying on AI-generated information, decisions, or outputs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. User Responsibilities</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              By using the Platform, you acknowledge and accept full responsibility for:
            </p>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">6.1 Wallet Security</h3>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Securing your private keys, seed phrases, and wallet credentials</li>
              <li>Maintaining exclusive control over your wallet and assets</li>
              <li>All transactions initiated from your wallet, whether authorized or not</li>
              <li>Protecting your devices from malware, phishing, and unauthorized access</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mb-4">
              <strong>Lost private keys cannot be recovered.</strong> The Platform has no ability to access, retrieve, or
              restore your wallet or assets.
            </p>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">6.2 Understanding Risks</h3>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Comprehending the technical, financial, and legal risks of blockchain participation</li>
              <li>Understanding how smart contracts, tokens, and governance mechanisms function</li>
              <li>Evaluating the suitability of participation based on your financial situation and risk tolerance</li>
              <li>Reading and understanding all documentation, including this Terms of Use and the Disclaimer</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">6.3 Your Own Decisions</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              You are solely responsible for:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>All decisions to participate in governance, voting, or proposals</li>
              <li>All transactions you initiate or authorize</li>
              <li>Compliance with applicable laws in your jurisdiction</li>
              <li>Tax reporting and payment obligations arising from Platform use</li>
              <li>Seeking professional advice when necessary</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Governance Participation</h2>
            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">7.1 Voting Finality</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              All governance votes are recorded on-chain and are final once submitted. Votes cannot be changed, reversed,
              or undone. You must carefully review all proposals before voting.
            </p>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">7.2 No Guarantee of Passage</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Proposals submitted to governance may be approved, rejected, or fail to reach quorum. There is no guarantee
              that any proposal will pass or be implemented. Approved proposals may still fail during implementation.
            </p>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">7.3 Parameter Changes</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Governance outcomes may result in changes to:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Token economics and distribution mechanisms</li>
              <li>Fee structures and revenue allocation</li>
              <li>Voting thresholds and quorum requirements</li>
              <li>Platform functionality and available features</li>
              <li>AI agent parameters and operational rules</li>
            </ul>
            <p className="text-slate-300 leading-relaxed">
              Such changes may materially affect your participation and token value. You accept these risks by participating
              in governance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Prohibited Conduct</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              You agree not to engage in any of the following prohibited activities:
            </p>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">8.1 Exploitative Behavior</h3>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Exploiting bugs, vulnerabilities, or unintended behaviors in smart contracts</li>
              <li>Attempting to manipulate governance outcomes through coordinated attacks</li>
              <li>Front-running, sandwich attacks, or other forms of MEV exploitation</li>
              <li>Flash loan attacks or other forms of DeFi manipulation</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">8.2 Fraudulent Activity</h3>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Creating multiple accounts or identities to circumvent voting limits (Sybil attacks)</li>
              <li>Submitting fraudulent, misleading, or deceptive proposals</li>
              <li>Market manipulation, wash trading, or artificial price inflation</li>
              <li>Misrepresenting your identity, qualifications, or intentions</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">8.3 System Abuse</h3>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Spam proposals, votes, or governance actions</li>
              <li>Overloading or attacking Platform infrastructure</li>
              <li>Attempting to gain unauthorized access to systems or data</li>
              <li>Reverse engineering, decompiling, or extracting proprietary code</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">8.4 Legal Violations</h3>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Money laundering, terrorist financing, or sanctions violations</li>
              <li>Use of the Platform for illegal purposes</li>
              <li>Violating intellectual property rights</li>
              <li>Engaging in defamation, harassment, or threatening behavior</li>
            </ul>
            <p className="text-slate-300 leading-relaxed">
              Prohibited conduct may result in loss of access, forfeiture of assets, legal action, and cooperation with
              law enforcement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Intellectual Property</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              All content, designs, graphics, code, and materials on the Platform are protected by intellectual property
              laws. Unless otherwise specified, all rights are reserved. You may not copy, modify, distribute, or create
              derivative works without explicit permission.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Open-source components are governed by their respective licenses. Smart contract code deployed on public
              blockchains is publicly accessible as required by blockchain protocols.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Limitation of Liability</h2>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-6">
              <p className="text-red-400 font-bold mb-2">IMPORTANT LIMITATION</p>
              <p className="text-slate-300 text-sm">
                This section limits the liability of the Platform. Please read it carefully.
              </p>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE PLATFORM, ITS OPERATORS, CONTRIBUTORS, DEVELOPERS,
              AFFILIATES, AND SERVICE PROVIDERS (COLLECTIVELY, "PLATFORM PARTIES") SHALL NOT BE LIABLE FOR ANY:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Direct, indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, business, data, or goodwill</li>
              <li>Token value fluctuations or total loss of token value</li>
              <li>AI agent outputs, decisions, or behaviors</li>
              <li>Smart contract bugs, vulnerabilities, or exploits</li>
              <li>Governance outcomes or proposal implementations</li>
              <li>Network failures, blockchain forks, or consensus failures</li>
              <li>Unauthorized access, theft, or loss of assets</li>
              <li>Third-party actions or services</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mb-4">
              THIS LIMITATION APPLIES REGARDLESS OF THE THEORY OF LIABILITY (CONTRACT, TORT, STRICT LIABILITY, OR OTHERWISE)
              AND EVEN IF PLATFORM PARTIES HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p className="text-slate-300 leading-relaxed">
              IN JURISDICTIONS THAT DO NOT ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL
              DAMAGES, LIABILITY IS LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Indemnification</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              You agree to indemnify, defend, and hold harmless the Platform Parties from and against any claims, damages,
              losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Your use of the Platform</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any applicable laws or regulations</li>
              <li>Your infringement of any third-party rights</li>
              <li>Any disputes between you and other users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Modifications to Terms</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              The Platform reserves the right to modify these Terms at any time. Changes will be communicated through:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Posting updated Terms on the Platform with a revised "Last Updated" date</li>
              <li>Announcements on official communication channels</li>
              <li>Governance proposals (for material changes)</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mb-4">
              Continued use of the Platform after changes are posted constitutes acceptance of the modified Terms. If you
              do not agree to the changes, you must immediately cease using the Platform.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Material changes may be subject to governance approval and will be implemented with reasonable notice periods.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">13. Termination</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              The Platform may suspend or terminate your access at any time for any reason, including:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Violation of these Terms</li>
              <li>Suspected fraudulent or illegal activity</li>
              <li>Legal or regulatory requirements</li>
              <li>Technical or security reasons</li>
            </ul>
            <p className="text-slate-300 leading-relaxed">
              Upon termination, your right to use the Platform ceases immediately. However, blockchain transactions and
              on-chain governance actions are immutable and cannot be reversed. Sections of these Terms that by their
              nature should survive termination will remain in effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">14. Governing Law</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              These Terms shall be governed by and construed in accordance with applicable laws without regard to conflict
              of law principles. Given the decentralized and global nature of blockchain technology, the Platform operates
              in a multi-jurisdictional environment.
            </p>
            <p className="text-slate-300 leading-relaxed">
              You consent to the jurisdiction of courts that have appropriate authority to interpret and enforce these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">15. Contact Information</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              For questions, concerns, or inquiries regarding these Terms of Use, please contact us through:
            </p>
            <Link to="/community/contact" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Official Contact Page →
            </Link>
          </section>
        </div>

        <div className="mt-12 p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white mb-2">Acknowledgment</h3>
              <p className="text-slate-300 text-sm mb-4">
                By using the Platform, you acknowledge that you have read, understood, and agree to be bound by these
                Terms of Use.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <Link to="/legal/privacy" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</Link>
                <Link to="/legal/disclaimer" className="text-cyan-400 hover:text-cyan-300">Disclaimer</Link>
                <Link to="/legal/cookies" className="text-cyan-400 hover:text-cyan-300">Cookies Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
