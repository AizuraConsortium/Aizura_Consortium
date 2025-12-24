import { Link } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { Shield, Eye, Lock, AlertTriangle, Database, UserCheck, Globe, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Shield className="w-12 h-12 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Last Updated: December 24, 2025
          </p>
        </div>

        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <Eye className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
            <div className="text-sm text-slate-300 space-y-2">
              <p className="font-bold text-white">Your Privacy Matters</p>
              <p>This Privacy Policy explains how we collect, use, store, and protect your information when you use the Aizura Consortium platform.</p>
            </div>
          </div>
        </div>

        <div className="prose prose-invert prose-cyan max-w-none space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              This Privacy Policy ("Policy") describes how the AI Autonomous Investment Consortium ("AAIC," "we," "us," or "our")
              collects, uses, stores, and protects your personal information when you access or use our website, dashboard,
              blockchain-based services, and all associated platforms (collectively, the "Platform").
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              By using the Platform, you consent to the data practices described in this Policy. If you do not agree with
              this Policy, please do not use the Platform.
            </p>
            <p className="text-slate-300 leading-relaxed">
              We are committed to protecting your privacy and handling your data transparently, securely, and in compliance
              with applicable data protection laws, including the General Data Protection Regulation (GDPR) and other
              relevant regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">2.1 Information You Provide Directly</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              We collect information that you voluntarily provide when using the Platform:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li><strong>Wallet Address:</strong> Your blockchain wallet address when you connect to the Platform</li>
              <li><strong>Governance Participation:</strong> Votes, proposals, and comments you submit</li>
              <li><strong>Communication Data:</strong> Messages sent through contact forms or support channels</li>
              <li><strong>Profile Information:</strong> Optional display names or profile details you choose to provide</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">2.2 Automatically Collected Information</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              We automatically collect certain technical information when you use the Platform:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the Platform</li>
              <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
              <li><strong>Log Data:</strong> IP addresses, access times, referring URLs</li>
              <li><strong>Performance Metrics:</strong> Load times, errors, and technical diagnostics</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">2.3 Blockchain Data</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Blockchain transactions are public and permanent by design:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Your wallet address and transaction history are publicly visible on the blockchain</li>
              <li>Governance votes and proposals are recorded on-chain and are immutable</li>
              <li>Token holdings and transfers are transparent and verifiable by anyone</li>
              <li>We have no ability to modify, delete, or hide blockchain data</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">2.4 Cookies and Tracking Technologies</h3>
            <p className="text-slate-300 leading-relaxed">
              We use cookies and similar technologies to enhance your experience. See our{' '}
              <Link to="/legal/cookies" className="text-cyan-400 hover:text-cyan-300 underline">
                Cookie Policy
              </Link>{' '}
              for detailed information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We use the collected information for the following purposes:
            </p>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">3.1 Platform Operation</h3>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>To provide, operate, and maintain the Platform</li>
              <li>To authenticate your wallet and verify transactions</li>
              <li>To display your governance participation and voting history</li>
              <li>To enable proposal submissions and voting functionality</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">3.2 Communication</h3>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>To respond to your inquiries and support requests</li>
              <li>To send important notifications about governance votes and proposals</li>
              <li>To provide updates about platform changes or new features</li>
              <li>To communicate airdrop eligibility and claim information</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">3.3 Improvement and Analytics</h3>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>To analyze usage patterns and improve user experience</li>
              <li>To identify and fix technical issues and bugs</li>
              <li>To develop new features and functionality</li>
              <li>To monitor Platform performance and security</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">3.4 Security and Fraud Prevention</h3>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>To detect and prevent fraudulent activity, Sybil attacks, and abuse</li>
              <li>To enforce our Terms of Use and protect Platform integrity</li>
              <li>To comply with legal obligations and respond to lawful requests</li>
              <li>To protect the rights and safety of users and the Platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. How We Share Your Information</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We do not sell your personal information. We may share information in the following limited circumstances:
            </p>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">4.1 Public Blockchain Data</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Your wallet address, votes, proposals, and transactions are recorded on public blockchains and are visible
              to anyone. This is inherent to blockchain technology and cannot be changed.
            </p>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">4.2 Service Providers</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              We may share information with trusted third-party service providers who assist with:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Web hosting and infrastructure services</li>
              <li>Analytics and performance monitoring</li>
              <li>Customer support and communication tools</li>
              <li>Security and fraud prevention services</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mb-4">
              These providers are contractually obligated to protect your information and use it only for specified purposes.
            </p>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">4.3 Legal Requirements</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              We may disclose information if required by law or in response to:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Valid legal process (subpoenas, court orders, warrants)</li>
              <li>Law enforcement requests and investigations</li>
              <li>Regulatory compliance obligations</li>
              <li>Protection of rights, property, or safety</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">4.4 Business Transfers</h3>
            <p className="text-slate-300 leading-relaxed">
              In the event of a merger, acquisition, or asset sale, your information may be transferred to the acquiring
              entity. We will provide notice before your information becomes subject to a different privacy policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Data Storage and Security</h2>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">5.1 Security Measures</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure server infrastructure and access controls</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Monitoring for suspicious activity and unauthorized access</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">5.2 Your Responsibility</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              You are responsible for:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Securing your wallet private keys and seed phrases</li>
              <li>Protecting your devices from malware and unauthorized access</li>
              <li>Using strong passwords and enabling two-factor authentication where available</li>
              <li>Reviewing transaction details before signing with your wallet</li>
            </ul>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 my-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-bold mb-2">Important Security Warning</p>
                  <p className="text-slate-300 text-sm">
                    We will never ask for your private keys, seed phrases, or wallet passwords. Anyone claiming to represent
                    us and requesting this information is a scammer.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">5.3 Data Retention</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              We retain your information for as long as necessary to:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Provide Platform services and functionality</li>
              <li>Comply with legal and regulatory obligations</li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Maintain security and prevent fraud</li>
            </ul>
            <p className="text-slate-300 leading-relaxed">
              Note: Blockchain data is permanent and immutable. We cannot delete information recorded on public blockchains.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights and Choices</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Depending on your jurisdiction, you may have the following rights regarding your personal information:
            </p>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">6.1 Access and Portability</h3>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Request access to the personal information we hold about you</li>
              <li>Request a copy of your data in a portable format</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">6.2 Correction and Deletion</h3>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Request correction of inaccurate or incomplete information</li>
              <li>Request deletion of your personal information (subject to legal obligations)</li>
              <li>Note: Blockchain data cannot be modified or deleted once recorded</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">6.3 Objection and Restriction</h3>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Object to processing of your personal information</li>
              <li>Request restriction of processing under certain circumstances</li>
              <li>Opt out of marketing communications (you will still receive essential service notifications)</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">6.4 Withdraw Consent</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Where processing is based on consent, you may withdraw consent at any time. This will not affect the
              lawfulness of processing before withdrawal.
            </p>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">6.5 Exercising Your Rights</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              To exercise any of these rights, please contact us through our{' '}
              <Link to="/community/contact" className="text-cyan-400 hover:text-cyan-300 underline">
                official contact page
              </Link>.
              We will respond to your request within the timeframe required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. International Data Transfers</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              The Platform operates globally and may transfer information across borders. Blockchain data is distributed
              across nodes worldwide. By using the Platform, you consent to the transfer of your information to countries
              that may have different data protection laws than your jurisdiction.
            </p>
            <p className="text-slate-300 leading-relaxed">
              When transferring data internationally, we implement appropriate safeguards to protect your information
              in accordance with applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              The Platform is not intended for individuals under the age of 18 (or the age of majority in your jurisdiction).
              We do not knowingly collect personal information from children.
            </p>
            <p className="text-slate-300 leading-relaxed">
              If we become aware that we have collected information from a child without proper consent, we will take
              steps to delete that information promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Third-Party Links and Services</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              The Platform may contain links to third-party websites, services, or applications. This Privacy Policy
              does not apply to those external services.
            </p>
            <p className="text-slate-300 leading-relaxed">
              We are not responsible for the privacy practices of third parties. We encourage you to review the privacy
              policies of any third-party services you access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology,
              legal requirements, or other factors.
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              Changes will be communicated through:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>Posting the updated Policy with a revised "Last Updated" date</li>
              <li>Announcing significant changes on the Platform or through official channels</li>
              <li>Providing direct notice for material changes (if contact information is available)</li>
            </ul>
            <p className="text-slate-300 leading-relaxed">
              Your continued use of the Platform after changes are posted constitutes acceptance of the updated Policy.
              We encourage you to review this Policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices,
              please contact us:
            </p>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white">Get in Touch</h3>
              </div>
              <Link
                to="/community/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
              >
                Visit Contact Page
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Data Protection Officer</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              For GDPR-related inquiries or concerns, you may contact our Data Protection Officer through the
              official contact channels.
            </p>
            <p className="text-slate-300 leading-relaxed">
              If you believe your data rights have been violated, you have the right to lodge a complaint with
              your local data protection authority.
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
          <div className="flex items-start gap-4">
            <Lock className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white mb-2">Your Privacy is Protected</h3>
              <p className="text-slate-300 text-sm mb-4">
                We are committed to transparency and protecting your personal information in accordance with
                applicable data protection laws.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <Link to="/legal/terms" className="text-cyan-400 hover:text-cyan-300">Terms of Use</Link>
                <Link to="/legal/cookies" className="text-cyan-400 hover:text-cyan-300">Cookie Policy</Link>
                <Link to="/legal/disclaimer" className="text-cyan-400 hover:text-cyan-300">Disclaimer</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
