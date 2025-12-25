import { PageLayout } from '../../components/layout/PageLayout';
import { Shield, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';

export default function U2ETerms() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-12">
        <section className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium mb-6">
            <FileText className="w-4 h-4" />
            Legal Terms
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Use-to-Earn (U2E){' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Program Terms
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Terms and conditions governing participation in the AAIC Use-to-Earn reward program
          </p>
          <p className="text-sm text-slate-500 mt-4">
            Last Updated: December 2024 | Version 1.0
          </p>
        </section>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white mb-2">Important Notice</h3>
              <p className="text-sm text-slate-300">
                By participating in the Use-to-Earn (U2E) program, you agree to these terms in their entirety.
                If you do not agree with any part of these terms, you must not participate in the program.
              </p>
            </div>
          </div>
        </div>

        <Section title="1. Program Overview" icon={<Shield className="w-6 h-6" />}>
          <p className="text-slate-300 mb-4">
            The Use-to-Earn (U2E) Program (the "Program") is a reward initiative operated by Aizura Consortium
            (the "Consortium," "we," "us," or "our") that distributes AAIC tokens to users based on their
            genuine usage of ecosystem products and services.
          </p>
          <SubSection title="1.1 Eligible Platforms">
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
                <span>AI Traders – Autonomous trading platform</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
                <span>AI Business Factory – Business creation and management platform</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
                <span>AI Web Dev – Autonomous web development tool</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
                <span>Future platforms as announced and added to the Program</span>
              </li>
            </ul>
          </SubSection>
        </Section>

        <Section title="2. Eligibility Requirements">
          <SubSection title="2.1 Participant Eligibility">
            <p className="text-slate-300 mb-3">To participate in the Program, you must:</p>
            <ul className="space-y-2 text-slate-300 list-disc list-inside ml-4">
              <li>Be at least 18 years of age (or legal age in your jurisdiction)</li>
              <li>Have a valid, active account with the Consortium</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not be located in a restricted jurisdiction</li>
              <li>Complete any required identity verification</li>
              <li>Accept and comply with platform Terms of Service</li>
            </ul>
          </SubSection>

          <SubSection title="2.2 Restricted Jurisdictions">
            <p className="text-slate-300">
              The Program is not available to residents or entities located in jurisdictions where
              participation would violate applicable laws, including but not limited to sanctioned
              countries and regions with restrictive cryptocurrency regulations.
            </p>
          </SubSection>
        </Section>

        <Section title="3. Reward Calculation and Distribution">
          <SubSection title="3.1 Reward Rates">
            <p className="text-slate-300 mb-3">
              Reward rates are determined based on:
            </p>
            <ul className="space-y-2 text-slate-300 list-disc list-inside ml-4">
              <li>Action type (e.g., trade execution, business creation)</li>
              <li>Current phase of tokenomics model (Phase 1, 2, or 3)</li>
              <li>Governance-approved rate schedules</li>
              <li>Available reward pool balance</li>
            </ul>
          </SubSection>

          <SubSection title="3.2 Rate Changes">
            <p className="text-slate-300 mb-3">
              We reserve the right to modify reward rates at any time:
            </p>
            <ul className="space-y-2 text-slate-300 list-disc list-inside ml-4">
              <li>Changes may occur via governance vote</li>
              <li>Administrative adjustments within predefined bounds</li>
              <li>Emergency modifications for system integrity</li>
              <li>Phase transitions (e.g., Phase 1 to Phase 2)</li>
            </ul>
            <p className="text-slate-300 mt-3">
              Notice of rate changes will be provided when feasible, but immediate changes may occur
              without prior notice in exceptional circumstances.
            </p>
          </SubSection>

          <SubSection title="3.3 Calculation Transparency">
            <p className="text-slate-300">
              Rewards are calculated using the formula: <code className="text-cyan-400 bg-slate-900 px-2 py-1 rounded">Total Rewards = Σ (Action Count × Reward Rate)</code>.
              Detailed breakdowns are available in your U2E Dashboard.
            </p>
          </SubSection>
        </Section>

        <Section title="4. Fraud Prevention and Abuse">
          <SubSection title="4.1 Prohibited Activities">
            <p className="text-slate-300 mb-3">The following activities are strictly prohibited:</p>
            <ul className="space-y-2 text-slate-300 list-disc list-inside ml-4">
              <li>Creating fake or spam actions to earn rewards</li>
              <li>Using bots, scripts, or automation to generate artificial usage</li>
              <li>Coordinating with others to manipulate reward systems</li>
              <li>Exploiting bugs or vulnerabilities for unintended rewards</li>
              <li>Creating multiple accounts (sybil attacks)</li>
              <li>Wash trading or circular transactions</li>
              <li>Any activity intended to game or abuse the system</li>
            </ul>
          </SubSection>

          <SubSection title="4.2 Detection and Penalties">
            <p className="text-slate-300 mb-3">
              We employ multiple fraud detection mechanisms:
            </p>
            <ul className="space-y-2 text-slate-300 list-disc list-inside ml-4">
              <li>Automated pattern analysis</li>
              <li>Idempotency key validation</li>
              <li>Rate limiting and velocity checks</li>
              <li>Manual review of flagged accounts</li>
            </ul>
            <p className="text-slate-300 mt-3 font-medium text-white">
              Penalties for violations:
            </p>
            <ul className="space-y-2 text-slate-300 list-disc list-inside ml-4 mt-2">
              <li>First offense: Warning and reward forfeiture</li>
              <li>Repeat offenses: Temporary suspension</li>
              <li>Serious violations: Permanent ban and legal action</li>
            </ul>
          </SubSection>
        </Section>

        <Section title="5. Claiming and Token Distribution">
          <SubSection title="5.1 Claim Process">
            <p className="text-slate-300 mb-3">
              Rewards accrue automatically but must be claimed:
            </p>
            <ul className="space-y-2 text-slate-300 list-disc list-inside ml-4">
              <li>Claims available after U2E system activation</li>
              <li>Historical usage credited retroactively</li>
              <li>Claims subject to verification and approval</li>
              <li>Gas fees and transaction costs paid by claimant</li>
            </ul>
          </SubSection>

          <SubSection title="5.2 Distribution Timeline">
            <p className="text-slate-300">
              Token distribution occurs according to the following schedule:
            </p>
            <ul className="space-y-2 text-slate-300 list-disc list-inside ml-4 mt-2">
              <li>Pre-activation: Rewards tracked but not claimable</li>
              <li>Post-activation: Claims processed within 72 hours</li>
              <li>On-chain settlement: Subject to network congestion</li>
            </ul>
          </SubSection>
        </Section>

        <Section title="6. Disclaimers and Limitations">
          <SubSection title="6.1 No Guarantees">
            <p className="text-slate-300 mb-3 font-medium text-white">
              IMPORTANT: The Program provides no guarantees regarding:
            </p>
            <ul className="space-y-2 text-slate-300 list-disc list-inside ml-4">
              <li>Continued operation or availability</li>
              <li>Reward amounts or token value</li>
              <li>Future rate structures</li>
              <li>Program modifications or termination</li>
              <li>Token liquidity or market demand</li>
            </ul>
          </SubSection>

          <SubSection title="6.2 Not Financial Advice">
            <p className="text-slate-300">
              Participation in the Program does not constitute financial advice, investment
              recommendation, or an offer to sell securities. AAIC tokens are utility tokens, not
              investment products.
            </p>
          </SubSection>

          <SubSection title="6.3 Tax Responsibilities">
            <p className="text-slate-300">
              You are solely responsible for:
            </p>
            <ul className="space-y-2 text-slate-300 list-disc list-inside ml-4 mt-2">
              <li>Determining applicable tax obligations</li>
              <li>Reporting rewards as taxable income (if required)</li>
              <li>Paying all taxes, fees, and duties</li>
              <li>Maintaining accurate records</li>
            </ul>
            <p className="text-slate-300 mt-3">
              We do not provide tax advice. Consult a tax professional for guidance.
            </p>
          </SubSection>
        </Section>

        <Section title="7. Program Changes and Termination">
          <SubSection title="7.1 Modification Rights">
            <p className="text-slate-300">
              We reserve the right to modify, suspend, or terminate the Program at any time:
            </p>
            <ul className="space-y-2 text-slate-300 list-disc list-inside ml-4 mt-2">
              <li>With or without prior notice</li>
              <li>For any reason or no reason</li>
              <li>Temporarily or permanently</li>
              <li>In whole or in part</li>
            </ul>
          </SubSection>

          <SubSection title="7.2 Accrued Rewards">
            <p className="text-slate-300">
              In the event of Program termination:
            </p>
            <ul className="space-y-2 text-slate-300 list-disc list-inside ml-4 mt-2">
              <li>Accrued rewards will be honored (subject to verification)</li>
              <li>Claim period will be announced</li>
              <li>Unclaimed rewards may be forfeited after deadline</li>
            </ul>
          </SubSection>
        </Section>

        <Section title="8. Dispute Resolution">
          <SubSection title="8.1 Appeals Process">
            <p className="text-slate-300 mb-3">
              If you dispute a Program decision:
            </p>
            <ul className="space-y-2 text-slate-300 list-disc list-inside ml-4">
              <li>Submit appeal via official support channels</li>
              <li>Provide detailed evidence and explanation</li>
              <li>Await review (typically 48-72 hours)</li>
              <li>Accept final decision as binding</li>
            </ul>
          </SubSection>

          <SubSection title="8.2 Arbitration">
            <p className="text-slate-300">
              Disputes not resolved through appeals shall be settled through binding arbitration
              in accordance with the main Terms of Service. Class action waiver applies.
            </p>
          </SubSection>
        </Section>

        <Section title="9. Liability and Indemnification">
          <SubSection title="9.1 Limitation of Liability">
            <p className="text-slate-300 mb-3 font-medium text-white">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <ul className="space-y-2 text-slate-300 list-disc list-inside ml-4">
              <li>We are not liable for lost rewards, token value fluctuations, or market losses</li>
              <li>No liability for system downtime, errors, or technical failures</li>
              <li>No liability for third-party actions or platform integrations</li>
              <li>Total liability limited to rewards actually earned and claimed</li>
            </ul>
          </SubSection>

          <SubSection title="9.2 Indemnification">
            <p className="text-slate-300">
              You agree to indemnify and hold harmless the Consortium, its affiliates, and representatives
              from any claims, damages, or expenses arising from your Program participation, including
              violations of these terms.
            </p>
          </SubSection>
        </Section>

        <Section title="10. Miscellaneous">
          <SubSection title="10.1 Entire Agreement">
            <p className="text-slate-300">
              These terms, together with the main Terms of Service and Privacy Policy, constitute
              the entire agreement regarding Program participation.
            </p>
          </SubSection>

          <SubSection title="10.2 Severability">
            <p className="text-slate-300">
              If any provision is found unenforceable, the remaining provisions remain in full effect.
            </p>
          </SubSection>

          <SubSection title="10.3 Contact Information">
            <p className="text-slate-300 mb-3">
              For questions regarding these terms:
            </p>
            <ul className="space-y-1 text-slate-300">
              <li>Email: legal@aaic.io</li>
              <li>Support: support@aaic.io</li>
              <li>Documentation: docs.aaic.io</li>
            </ul>
          </SubSection>
        </Section>

        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
          <h3 className="font-bold text-white mb-3">Acceptance of Terms</h3>
          <p className="text-sm text-slate-300">
            By using any eligible platform or claiming U2E rewards, you acknowledge that you have read,
            understood, and agree to be bound by these U2E Program Terms, the main Terms of Service,
            and all applicable policies.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}

function Section({ title, icon, children }: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        {icon}
        {title}
      </h2>
      <div className="space-y-6">
        {children}
      </div>
    </section>
  );
}

function SubSection({ title, children }: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
      {children}
    </div>
  );
}
