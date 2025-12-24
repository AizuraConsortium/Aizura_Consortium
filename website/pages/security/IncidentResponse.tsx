import { useState } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import {
  Shield, AlertTriangle, Clock, CheckCircle2, XCircle,
  Lock, Mail, FileText, ArrowRight, Key
} from 'lucide-react';

export default function IncidentResponse() {
  const [formData, setFormData] = useState({
    category: '',
    severity: '',
    title: '',
    description: '',
    reporter_email: '',
    reporter_name: '',
    contact_method: '',
    affected_systems: '',
    steps_to_reproduce: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const slaResponse = [
    {
      severity: 'Critical',
      response: '< 1 hour',
      resolution: '< 24 hours',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
    },
    {
      severity: 'High',
      response: '< 4 hours',
      resolution: '< 72 hours',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
    },
    {
      severity: 'Medium',
      response: '< 24 hours',
      resolution: '< 7 days',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
    },
    {
      severity: 'Low',
      response: '< 48 hours',
      resolution: '< 14 days',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Report Received',
      description: 'Incident logged in our tracking system and assigned a unique ID',
      icon: <FileText className="w-6 h-6" />,
    },
    {
      step: 2,
      title: 'Initial Triage',
      description: 'Security team assesses severity and impact within SLA timeframe',
      icon: <AlertTriangle className="w-6 h-6" />,
    },
    {
      step: 3,
      title: 'Investigation',
      description: 'Root cause analysis, impact assessment, and evidence gathering',
      icon: <Shield className="w-6 h-6" />,
    },
    {
      step: 4,
      title: 'Remediation',
      description: 'Fix deployed, systems secured, and verification testing performed',
      icon: <CheckCircle2 className="w-6 h-6" />,
    },
    {
      step: 5,
      title: 'Disclosure',
      description: 'Public disclosure if appropriate, lessons learned documented',
      icon: <FileText className="w-6 h-6" />,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/security_incidents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit incident report');
      }

      setSubmitted(true);
      setFormData({
        category: '',
        severity: '',
        title: '',
        description: '',
        reporter_email: '',
        reporter_name: '',
        contact_method: '',
        affected_systems: '',
        steps_to_reproduce: '',
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Security Incident Response
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Report a{' '}
            <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
              Security Incident
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Help us keep the Aizura ecosystem secure. Report vulnerabilities, suspicious activity, or security concerns.
            Anonymous submissions are accepted and encouraged.
          </p>
        </section>

        <section className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Critical Security Issues</h3>
              <p className="text-slate-300 mb-4">
                If you've discovered a <strong className="text-red-400">critical vulnerability</strong> that could lead
                to immediate loss of funds or system compromise, please use our encrypted communication channel:
              </p>
              <a
                href="mailto:security@aizura.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
              >
                <Mail className="w-5 h-5" />
                security@aizura.com
              </a>
              <p className="text-sm text-slate-400 mt-3">
                Use our PGP key for encrypted communications (see below)
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Response Time SLAs
            </h2>
            <p className="text-lg text-slate-300">
              Our commitment to security incident response times
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {slaResponse.map((sla) => (
              <div
                key={sla.severity}
                className={`${sla.bgColor} border ${sla.borderColor} rounded-xl p-6`}
              >
                <h3 className={`text-xl font-bold ${sla.color} mb-4`}>{sla.severity}</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Initial Response</div>
                    <div className="text-2xl font-bold text-white">{sla.response}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Target Resolution</div>
                    <div className="text-lg font-bold text-white">{sla.resolution}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-slate-900/50 rounded-xl p-6">
            <p className="text-sm text-slate-400">
              <strong className="text-white">Note:</strong> SLAs represent our target response and resolution times.
              Actual times may vary based on complexity and severity. Critical incidents receive immediate attention
              24/7.
            </p>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Incident Handling Process
            </h2>
            <p className="text-lg text-slate-300">
              How we handle security incidents from report to resolution
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {processSteps.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-cyan-600 flex items-center justify-center text-white text-2xl font-bold">
                      {step.step}
                    </div>
                  </div>

                  <div className="flex-1 bg-slate-900/50 rounded-xl p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-cyan-400">{step.icon}</div>
                      <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-slate-300">{step.description}</p>
                  </div>
                </div>

                {index < processSteps.length - 1 && (
                  <div className="ml-8 h-8 w-0.5 bg-slate-700 my-2" />
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Submit an Incident Report
            </h2>
            <p className="text-lg text-slate-300">
              Fill out the form below to report a security incident. All fields marked with * are required.
            </p>
          </div>

          {submitted ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Report Submitted Successfully</h3>
              <p className="text-slate-300 mb-6">
                Thank you for reporting this security incident. Our security team has been notified and will
                investigate according to our SLA commitments.
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
                    <option value="Smart Contract Bug">Smart Contract Bug</option>
                    <option value="Security Vulnerability">Security Vulnerability</option>
                    <option value="Suspicious Activity">Suspicious Activity</option>
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
                    <option value="Critical">Critical - Immediate threat</option>
                    <option value="High">High - Significant risk</option>
                    <option value="Medium">Medium - Moderate impact</option>
                    <option value="Low">Low - Minor issue</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
                  Incident Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Brief summary of the incident"
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
                  placeholder="Provide as much detail as possible about the incident"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div>
                <label htmlFor="affected_systems" className="block text-sm font-medium text-white mb-2">
                  Affected Systems
                </label>
                <input
                  type="text"
                  id="affected_systems"
                  name="affected_systems"
                  value={formData.affected_systems}
                  onChange={handleChange}
                  placeholder="Which systems, contracts, or components are affected?"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label htmlFor="steps_to_reproduce" className="block text-sm font-medium text-white mb-2">
                  Steps to Reproduce
                </label>
                <textarea
                  id="steps_to_reproduce"
                  name="steps_to_reproduce"
                  value={formData.steps_to_reproduce}
                  onChange={handleChange}
                  rows={4}
                  placeholder="If applicable, provide steps to reproduce the issue"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Contact Information (Optional - Anonymous Reports Accepted)
                </h3>
                <p className="text-sm text-slate-400 mb-6">
                  Providing contact information helps us follow up with questions or provide updates. However, anonymous
                  reports are fully supported and encouraged.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
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
                      placeholder="Optional"
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

                <div className="mt-6">
                  <label htmlFor="contact_method" className="block text-sm font-medium text-white mb-2">
                    Preferred Contact Method
                  </label>
                  <input
                    type="text"
                    id="contact_method"
                    name="contact_method"
                    value={formData.contact_method}
                    onChange={handleChange}
                    placeholder="Email, Telegram, Discord, etc."
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
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
                    Submit Report
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Security Contact Information
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-900/50 rounded-xl p-6">
              <Mail className="w-10 h-10 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Email</h3>
              <a
                href="mailto:security@aizura.com"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                security@aizura.com
              </a>
              <p className="text-sm text-slate-400 mt-3">
                For all security-related communications
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6">
              <Key className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">PGP Key</h3>
              <p className="text-slate-300 mb-3">
                Fingerprint: <code className="text-sm bg-slate-800 px-2 py-1 rounded">XXXX XXXX XXXX XXXX</code>
              </p>
              <a
                href="/security/pgp-key.asc"
                className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
              >
                Download Public Key →
              </a>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Disclosure Policy
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Our commitment to transparent security practices
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Responsible Disclosure</h3>
              <p className="text-slate-300">
                We follow responsible disclosure practices. Critical vulnerabilities are fixed before public disclosure.
                We coordinate disclosure timing with security researchers and provide credit where requested.
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Public Incident Log</h3>
              <p className="text-slate-300 mb-4">
                Resolved incidents are published in our public incident log (coming soon) to maintain transparency and
                help the community learn from security issues.
              </p>
              <p className="text-sm text-slate-400">
                Note: No incidents have been reported or resolved yet. This section will be populated as incidents occur.
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Timeline</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span>0-90 days: Private remediation period</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span>After fix: Coordinated public disclosure</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span>Post-mortem published with lessons learned</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
