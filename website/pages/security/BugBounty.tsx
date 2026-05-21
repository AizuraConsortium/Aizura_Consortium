import { useState } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import {
  Shield, DollarSign, Award, CheckCircle2, XCircle,
  AlertTriangle, ArrowRight, Star, Trophy, Lock
} from 'lucide-react';

export default function BugBounty() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: '',
    category: '',
    reporter_email: '',
    reporter_name: '',
    wallet_address: '',
    proof_of_concept: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const rewardTiers = [
    {
      severity: 'Critical',
      reward: '$10,000 - $50,000',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      examples: [
        'Direct theft of funds',
        'Unauthorized minting or burning',
        'Complete platform compromise',
        'Private key exposure',
      ],
    },
    {
      severity: 'High',
      reward: '$5,000 - $10,000',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      examples: [
        'Theft of funds under specific conditions',
        'Smart contract logic errors',
        'Authentication bypass',
        'Data integrity compromise',
      ],
    },
    {
      severity: 'Medium',
      reward: '$1,000 - $5,000',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      examples: [
        'Temporary denial of service',
        'Access control issues',
        'Information disclosure',
        'Logic errors with limited impact',
      ],
    },
    {
      severity: 'Low',
      reward: '$250 - $1,000',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      examples: [
        'UI/UX security issues',
        'Minor information leaks',
        'Best practice violations',
        'Low-severity logic errors',
      ],
    },
  ];

  const inScope = [
    'Smart contracts deployed on mainnet',
    'Frontend applications (website, client dashboard, admin panel)',
    'Backend APIs and services',
    'Authentication and authorization systems',
    'Database security',
    'Infrastructure and deployment pipelines',
  ];

  const outOfScope = [
    'Bugs in third-party dependencies (report to original maintainer)',
    'Social engineering attacks',
    'Physical attacks',
    'Denial of service attacks (DoS/DDoS)',
    'Issues already known and being fixed',
    'Issues in test or development environments',
    'Clickjacking on pages with no sensitive actions',
    'CSRF on forms with no security impact',
  ];

  const hallOfFame: Array<{ name: string; severity: string; reward: string; date: string }> = [
    // Placeholder - will be populated with real submissions
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/bug_bounty_submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit bug bounty report');
      }

      setSubmitted(true);
      setFormData({
        title: '',
        description: '',
        severity: '',
        category: '',
        reporter_email: '',
        reporter_name: '',
        wallet_address: '',
        proof_of_concept: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <PageLayout>
      <div className="space-y-16">
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Bug Bounty Program
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Earn Up To{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              $50,000
            </span>{' '}
            for Security Research
          </h1>

          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Help secure the Aizura ecosystem and get rewarded. We value responsible security research and
            welcome contributions from the global security community.
          </p>
        </section>

        <section className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 lg:p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <DollarSign className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">$50K</div>
              <div className="text-sm text-slate-400">Maximum Reward</div>
            </div>
            <div>
              <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">Hall of Fame</div>
              <div className="text-sm text-slate-400">Public Recognition</div>
            </div>
            <div>
              <Lock className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">Anonymous</div>
              <div className="text-sm text-slate-400">Submissions Welcome</div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Reward Tiers
            </h2>
            <p className="text-lg text-slate-300">
              Rewards are determined by severity and impact. All rewards can be paid in USD or AAIC tokens.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {rewardTiers.map((tier) => (
              <div
                key={tier.severity}
                className={`${tier.bgColor} border ${tier.borderColor} rounded-xl p-8`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-2xl font-bold ${tier.color}`}>{tier.severity}</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{tier.reward}</div>
                    <div className="text-sm text-slate-400">or equivalent AAIC</div>
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-white mb-3">Examples:</h4>
                <ul className="space-y-2">
                  {tier.examples.map((example, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                      <div className={`w-1.5 h-1.5 rounded-full ${tier.color.replace('text-', 'bg-')} mt-2 flex-shrink-0`} />
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-slate-900/50 rounded-xl p-6">
            <p className="text-slate-300">
              <strong className="text-white">Final reward amounts</strong> are determined by our security team based
              on impact, exploitability, and quality of the report. Rewards are paid within 30 days of acceptance.
            </p>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Program Scope
            </h2>
            <p className="text-lg text-slate-300">
              What's included and excluded from our bug bounty program
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
                <h3 className="text-2xl font-bold text-white">In Scope</h3>
              </div>
              <ul className="space-y-3">
                {inScope.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-8 h-8 text-red-400" />
                <h3 className="text-2xl font-bold text-white">Out of Scope</h3>
              </div>
              <ul className="space-y-3">
                {outOfScope.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Submission Guidelines
            </h2>
            <p className="text-lg text-slate-300">
              Follow these guidelines to ensure your submission is processed quickly
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-900/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Required Information</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Clear vulnerability description</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Steps to reproduce</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Proof of concept (code, screenshots, videos)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Impact assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Suggested remediation (optional but appreciated)</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Responsible Disclosure</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Report vulnerabilities privately first</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Allow 90 days for remediation before disclosure</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Do not exploit vulnerabilities beyond PoC</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Do not access or modify user data</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Act in good faith and follow our terms</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Legal Safe Harbor</h3>
                <p className="text-slate-300">
                  We will not pursue legal action against security researchers who follow responsible disclosure
                  practices and act in good faith. Your research is protected under our safe harbor policy as long
                  as you comply with these guidelines.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Submit a Bug Report
            </h2>
            <p className="text-lg text-slate-300">
              Found a vulnerability? Submit it using the form below. Anonymous submissions are accepted.
            </p>
          </div>

          {submitted ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Submission Received</h3>
              <p className="text-slate-300 mb-6">
                Thank you for your bug bounty submission. Our security team will review it and respond within
                5 business days. If accepted, reward payment will be processed within 30 days.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
              >
                Submit Another Report
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-white mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Select a category</option>
                    <option value="Smart Contract">Smart Contract</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="severity" className="block text-sm font-medium text-white mb-2">
                    Severity *
                  </label>
                  <select
                    id="severity"
                    name="severity"
                    value={formData.severity}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Select severity</option>
                    <option value="Critical">Critical - Direct fund theft possible</option>
                    <option value="High">High - Significant security risk</option>
                    <option value="Medium">Medium - Moderate impact</option>
                    <option value="Low">Low - Minor security issue</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
                  Vulnerability Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Brief summary of the vulnerability"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                  Detailed Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Provide a detailed description including impact, affected components, and steps to reproduce"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div>
                <label htmlFor="proof_of_concept" className="block text-sm font-medium text-white mb-2">
                  Proof of Concept
                </label>
                <textarea
                  id="proof_of_concept"
                  name="proof_of_concept"
                  value={formData.proof_of_concept}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Provide code, steps to reproduce, screenshots, or links to demonstrate the vulnerability"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Contact & Reward Information (Optional)
                </h3>
                <p className="text-sm text-slate-400 mb-6">
                  Anonymous submissions are accepted. Providing contact information allows us to follow up with
                  questions and process reward payments.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="reporter_name" className="block text-sm font-medium text-white mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="reporter_name"
                      name="reporter_name"
                      value={formData.reporter_name}
                      onChange={handleChange}
                      placeholder="Optional - for Hall of Fame"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="reporter_email" className="block text-sm font-medium text-white mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="reporter_email"
                      name="reporter_email"
                      value={formData.reporter_email}
                      onChange={handleChange}
                      placeholder="your@email.com (optional)"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="wallet_address" className="block text-sm font-medium text-white mb-2">
                    Wallet Address (for reward payment)
                  </label>
                  <input
                    type="text"
                    id="wallet_address"
                    name="wallet_address"
                    value={formData.wallet_address}
                    onChange={handleChange}
                    placeholder="0x... (optional)"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Provide a wallet address to receive AAIC token rewards, or we'll contact you for USD payment details if accepted
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-8 py-4 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-lg text-lg transition-colors inline-flex items-center justify-center gap-2"
              >
                {submitting ? (
                  'Submitting...'
                ) : (
                  <>
                    Submit Bug Report
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Security Researchers Hall of Fame
            </h2>
            <p className="text-lg text-slate-300">
              Recognizing contributors who help secure the Aizura ecosystem
            </p>
          </div>

          {hallOfFame.length === 0 ? (
            <div className="bg-slate-900/50 rounded-xl p-12 text-center">
              <Star className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">
                No entries yet. Be the first security researcher to earn a spot in our Hall of Fame!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hallOfFame.map((entry: any, idx: number) => (
                <div key={idx} className="bg-slate-900/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-8 h-8 text-yellow-400" />
                    <h3 className="text-xl font-bold text-white">{entry.name}</h3>
                  </div>
                  <p className="text-slate-300 text-sm mb-3">{entry.finding}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{entry.date}</span>
                    <span className="text-green-400 font-bold">{entry.reward}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Payment Process & Timeline
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Review Process</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-24 text-cyan-400 font-medium">Day 1-5:</div>
                  <div className="text-slate-300">Initial review and severity assessment</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 text-cyan-400 font-medium">Day 5-14:</div>
                  <div className="text-slate-300">Verification and impact analysis</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 text-cyan-400 font-medium">Day 14-30:</div>
                  <div className="text-slate-300">Fix development and deployment</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 text-cyan-400 font-medium">Day 30:</div>
                  <div className="text-slate-300">Reward payment processed</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Payment Options</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">AAIC Tokens:</strong> Paid directly to your wallet address</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">USD Payment:</strong> Via wire transfer, crypto stablecoin, or other agreed method</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Anonymous Payments:</strong> Crypto payments require no identity verification</span>
                </li>
              </ul>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">No Doxing Policy</h3>
              <p className="text-slate-300">
                We respect researcher privacy. You can submit anonymously and receive payment via cryptocurrency
                without revealing your identity. We will never share your personal information without explicit
                permission.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
