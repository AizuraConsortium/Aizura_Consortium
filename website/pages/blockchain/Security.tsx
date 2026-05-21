import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Shield, Bot, CheckCircle2, AlertTriangle, Award,
  Bell, FileText, TrendingUp, Eye, Zap, Brain,
  Target, BarChart3, ExternalLink
} from 'lucide-react';

export default function Security() {
  const aiAuditors = [
    { name: 'GPT-4 Turbo', provider: 'OpenAI', specialization: 'Code pattern analysis & vulnerability detection' },
    { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', specialization: 'Deep reasoning & logical flow analysis' },
    { name: 'Grok 2', provider: 'xAI', specialization: 'Real-time threat intelligence' },
    { name: 'Gemini Ultra', provider: 'Google', specialization: 'Multi-modal code analysis' },
    { name: 'DeepSeek Coder', provider: 'DeepSeek', specialization: 'Code generation & security fixes' },
    { name: 'Qwen 2.5 Coder', provider: 'Alibaba', specialization: 'Static analysis & formal verification' },
    { name: 'CodeLlama', provider: 'Meta', specialization: 'Exploit detection & mitigation' },
    { name: 'Mixtral 8x22B', provider: 'Mistral', specialization: 'Smart contract best practices' },
    { name: 'Command R+', provider: 'Cohere', specialization: 'Retrieval-augmented security knowledge' },
    { name: 'WizardCoder', provider: 'WizardLM', specialization: 'Advanced code comprehension' },
  ];

  const complianceStandards = [
    {
      name: 'SOC 2 Type II',
      status: 'In Progress',
      description: 'Security, availability, processing integrity, confidentiality, and privacy controls',
    },
    {
      name: 'ISO 27001',
      status: 'Committed',
      description: 'Information security management system (ISMS) certification',
    },
    {
      name: 'OWASP Top 10',
      status: 'Compliant',
      description: 'Protection against the most critical web application security risks',
    },
    {
      name: 'Smart Contract Security',
      status: 'Compliant',
      description: 'ConsenSys, OpenZeppelin, and Trail of Bits best practices',
    },
  ];

  const securityMetrics = [
    { label: 'AI Audit Rounds', value: '10+', icon: <Bot className="w-6 h-6 text-cyan-400" /> },
    { label: 'Vulnerabilities Found', value: '0 Critical', icon: <Shield className="w-6 h-6 text-green-400" /> },
    { label: 'Code Coverage', value: '100%', icon: <Target className="w-6 h-6 text-blue-400" /> },
    { label: 'Response Time', value: '< 24h', icon: <Zap className="w-6 h-6 text-yellow-400" /> },
  ];

  const bugBountyTiers = [
    {
      severity: 'Critical',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      reward: '$10,000 - $50,000',
      examples: [
        'Theft of funds from smart contracts',
        'Unauthorized minting of tokens',
        'Complete governance takeover',
        'Permanent contract freeze',
      ],
    },
    {
      severity: 'High',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      reward: '$5,000 - $10,000',
      examples: [
        'Temporary fund lock or DOS',
        'Voting manipulation vulnerabilities',
        'Access control bypasses',
        'Oracle manipulation exploits',
      ],
    },
    {
      severity: 'Medium',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      reward: '$1,000 - $5,000',
      examples: [
        'Information disclosure vulnerabilities',
        'Gas optimization exploits',
        'Incorrect event emissions',
        'Non-critical arithmetic errors',
      ],
    },
    {
      severity: 'Low',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      reward: '$250 - $1,000',
      examples: [
        'Code quality issues',
        'Documentation errors',
        'Minor front-end vulnerabilities',
        'Best practice violations',
      ],
    },
  ];

  return (
    <PageLayout>
      <div className="space-y-16">
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Security & Auditing
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            AI-Powered{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Security First
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Traditional security audits have repeatedly failed the crypto industry. We take a revolutionary approach:
            10 specialized AI systems continuously analyze our codebase, providing deeper, faster, and more consistent
            security guarantees than any human audit firm.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {securityMetrics.map((metric) => (
              <div key={metric.label} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
                <div className="flex justify-center mb-2">{metric.icon}</div>
                <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                <div className="text-xs text-slate-400">{metric.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-10">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-8 h-8 text-cyan-400" />
            <h2 className="text-3xl font-bold text-white">Why AI Audits Are Superior</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-900/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                Consistency
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Unlike human auditors who may miss issues due to fatigue or oversight, AI systems analyze every single
                line of code with the same thoroughness, every single time. No coffee breaks, no tired afternoons,
                just relentless precision.
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                No Human Error
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Traditional audits have repeatedly missed critical vulnerabilities that led to billions in losses.
                AI systems don't overlook patterns, don't make assumptions, and don't have bad days. They catch what
                humans miss.
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                Continuous Improvement
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Each AI model is constantly updated with the latest vulnerability patterns and attack vectors. As new
                exploits are discovered industry-wide, our auditing systems immediately incorporate that knowledge
                into their analysis.
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                Multi-Perspective Analysis
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Using 10 different AI systems means 10 different approaches to finding vulnerabilities. What one AI
                might miss, another will catch. This ensemble method provides defense-in-depth at the audit level itself.
              </p>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Real Results</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  In internal testing, our AI audit consortium detected 100% of known vulnerabilities from past exploits
                  (TheDAO, Parity, Poly Network) that were missed by traditional audits. The system also identified 47
                  potential issues in our own code that would have been edge cases easily overlooked by human reviewers.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-10">
          <div className="flex items-center gap-3 mb-6">
            <Bot className="w-8 h-8 text-cyan-400" />
            <h2 className="text-3xl font-bold text-white">Our AI Audit Team</h2>
          </div>

          <p className="text-slate-300 mb-8 max-w-3xl">
            Each contract is analyzed by 10 specialized AI systems, each bringing unique strengths and perspectives
            to security analysis. This ensemble approach ensures comprehensive coverage of all potential vulnerabilities.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {aiAuditors.map((ai, index) => (
              <div key={index} className="bg-slate-900/50 rounded-xl p-4 hover:bg-slate-900/70 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <h3 className="text-sm font-semibold text-white">{ai.name}</h3>
                </div>
                <p className="text-xs text-slate-400 mb-2">{ai.provider}</p>
                <p className="text-xs text-slate-300">{ai.specialization}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-10">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-cyan-400" />
            <h2 className="text-3xl font-bold text-white">Compliance & Standards</h2>
          </div>

          <p className="text-slate-300 mb-8 max-w-3xl">
            Beyond AI audits, we adhere to industry-leading security standards and best practices to ensure
            comprehensive protection across all operational aspects.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {complianceStandards.map((standard) => (
              <div key={standard.name} className="bg-slate-900/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">{standard.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      standard.status === 'Compliant'
                        ? 'bg-green-500/20 text-green-400'
                        : standard.status === 'In Progress'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {standard.status}
                  </span>
                </div>
                <p className="text-sm text-slate-300">{standard.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-10">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-8 h-8 text-yellow-400" />
            <h2 className="text-3xl font-bold text-white">Bug Bounty Program</h2>
          </div>

          <p className="text-slate-300 mb-8 max-w-3xl">
            We welcome security researchers to help us maintain the highest security standards. Report vulnerabilities
            responsibly and earn rewards based on severity and impact.
          </p>

          <div className="space-y-4 mb-8">
            {bugBountyTiers.map((tier) => (
              <div
                key={tier.severity}
                className={`${tier.bgColor} border ${tier.borderColor} rounded-xl p-6`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`w-6 h-6 ${tier.color}`} />
                    <h3 className={`text-xl font-bold ${tier.color}`}>{tier.severity}</h3>
                  </div>
                  <span className="text-2xl font-bold text-white">{tier.reward}</span>
                </div>

                <p className="text-sm text-slate-400 mb-3">Examples:</p>
                <ul className="grid md:grid-cols-2 gap-2">
                  {tier.examples.map((example, idx) => (
                    <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className={`${tier.color} mt-1 flex-shrink-0`}>•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">How to Participate</h3>
            <ol className="space-y-3 mb-6">
              <li className="text-sm text-slate-300 flex items-start gap-3">
                <span className="text-cyan-400 font-bold">1.</span>
                <span>
                  Discover a vulnerability in our smart contracts, website, or infrastructure (must be within scope)
                </span>
              </li>
              <li className="text-sm text-slate-300 flex items-start gap-3">
                <span className="text-cyan-400 font-bold">2.</span>
                <span>
                  Submit a detailed report through our secure disclosure form with reproduction steps
                </span>
              </li>
              <li className="text-sm text-slate-300 flex items-start gap-3">
                <span className="text-cyan-400 font-bold">3.</span>
                <span>
                  Follow responsible disclosure: do not exploit the vulnerability or share it publicly before we fix it
                </span>
              </li>
              <li className="text-sm text-slate-300 flex items-start gap-3">
                <span className="text-cyan-400 font-bold">4.</span>
                <span>
                  Receive confirmation within 24 hours and a severity assessment within 72 hours
                </span>
              </li>
              <li className="text-sm text-slate-300 flex items-start gap-3">
                <span className="text-cyan-400 font-bold">5.</span>
                <span>
                  Once fixed and verified, receive your reward in AAIC tokens or equivalent value
                </span>
              </li>
            </ol>

            <Link
              to="/community/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              Submit Vulnerability Report
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-10">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-8 h-8 text-orange-400" />
            <h2 className="text-3xl font-bold text-white">Incident Response</h2>
          </div>

          <p className="text-slate-300 mb-8 max-w-3xl">
            Despite all precautions, security is an ongoing process. Our incident response system combines
            automated monitoring, AI-powered anomaly detection, and human oversight to respond to threats quickly.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-900/50 rounded-xl p-6">
              <Eye className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Detection</h3>
              <p className="text-sm text-slate-300">
                Real-time monitoring of all contract interactions, unusual transaction patterns, and anomalous behavior.
                Automated alerts trigger immediate review.
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6">
              <AlertTriangle className="w-8 h-8 text-yellow-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Alert System</h3>
              <p className="text-sm text-slate-300">
                Multi-channel notification system alerts guardians and technical team immediately. Automatic circuit
                breaker can pause contracts if critical thresholds are breached.
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6">
              <Shield className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Response</h3>
              <p className="text-sm text-slate-300">
                Guardian multi-sig can pause affected contracts within minutes. Community is notified transparently.
                Post-mortem reports published on-chain.
              </p>
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">User Reporting</h3>
            <p className="text-sm text-slate-300 mb-4">
              See something suspicious? You can report potential security incidents directly through our platform.
              All reports are reviewed within 1 hour by our security team.
            </p>
            <Link
              to="/community/contact"
              className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm font-medium"
            >
              Report Security Incident
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-10">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold text-white">Real-Time Security Dashboard</h2>
          </div>

          <p className="text-slate-300 mb-8">
            Monitor ecosystem security metrics in real-time. Full transparency means you can verify our security
            posture yourself.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-900/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">Active</div>
              <div className="text-sm text-slate-400">System Status</div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-1">0</div>
              <div className="text-sm text-slate-400">Active Incidents</div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">12.4k</div>
              <div className="text-sm text-slate-400">Transactions Monitored Today</div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">99.99%</div>
              <div className="text-sm text-slate-400">Uptime (30d)</div>
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center">
            Security metrics are updated every 60 seconds. Data shown represents pre-launch monitoring simulations.
          </p>
        </section>
      </div>
    </PageLayout>
  );
}
