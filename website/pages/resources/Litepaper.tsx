import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  FileText, Download, BookOpen, TrendingUp, Users, Code, Cpu, DollarSign,
  Shield, Coins, Vote, Target, AlertTriangle, Calendar
} from 'lucide-react';

export default function Litepaper() {
  const sections = [
    { id: 'executive', label: 'Executive Summary', icon: <FileText className="w-4 h-4" /> },
    { id: 'economics', label: 'AI Economics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'problem', label: 'Problem Statement', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'solution', label: 'Solution Architecture', icon: <Code className="w-4 h-4" /> },
    { id: 'tokenomics', label: 'Tokenomics', icon: <Coins className="w-4 h-4" /> },
    { id: 'governance', label: 'Governance Model', icon: <Vote className="w-4 h-4" /> },
    { id: 'revenue', label: 'Revenue Model', icon: <Target className="w-4 h-4" /> },
    { id: 'risks', label: 'Risk Factors', icon: <Shield className="w-4 h-4" /> },
    { id: 'roadmap', label: 'Roadmap', icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <PageLayout>
      <div className="space-y-16">
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Technical Litepaper
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Aizura AI{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Consortium
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            A Decentralized Ecosystem of AI-Managed Businesses Governed by Token Holders
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <button
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2"
              onClick={() => window.print()}
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <span className="text-sm text-slate-400">Version 1.0 | December 2024</span>
          </div>

          <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-300">
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                >
                  {section.icon}
                  {section.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="executive" className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-10 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-cyan-400" />
            <h2 className="text-3xl font-bold text-white">Executive Summary</h2>
          </div>

          <div className="prose prose-invert prose-slate max-w-none">
            <h3 className="text-2xl font-bold text-white mb-6">The 3-Pillar Framework</h3>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 text-center">
                <Users className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-white mb-2">Humans Propose & Govern</h4>
                <p className="text-sm text-slate-300">Community submits business ideas. Token holders vote on which to pursue.</p>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 text-center">
                <Cpu className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-white mb-2">AI Agents Execute & Operate</h4>
                <p className="text-sm text-slate-300">Autonomous AI builds, launches, and scales approved businesses.</p>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 text-center">
                <DollarSign className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-white mb-2">Profits Return to Ecosystem</h4>
                <p className="text-sm text-slate-300">Revenue funds buybacks, burns, rewards, and treasury growth.</p>
              </div>
            </div>

            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              Aizura AI Consortium represents a fundamental shift in how businesses are created, managed, and governed.
              By combining the collective intelligence of multiple AI systems with decentralized governance,
              we enable a community-driven ecosystem that creates a self-sustaining economic flywheel.
            </p>

            <div className="grid md:grid-cols-3 gap-6 my-8">
              <div className="bg-slate-900/50 rounded-xl p-6">
                <div className="text-3xl font-bold text-cyan-400 mb-2">6</div>
                <div className="text-sm text-slate-300">Specialized AI Agents</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">1B</div>
                <div className="text-sm text-slate-300">Total Token Supply</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
                <div className="text-sm text-slate-300">Community Distribution</div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Key Highlights</h3>
            <ul className="space-y-2 text-slate-300">
              <li>• <strong className="text-white">No Token Sale:</strong> 100% airdrop and participation-based distribution</li>
              <li>• <strong className="text-white">AI Consortium Model:</strong> 6 specialized AI agents collaborate on every business</li>
              <li>• <strong className="text-white">Community Governance:</strong> Token holders control which businesses get built</li>
              <li>• <strong className="text-white">Revenue Sharing:</strong> Ecosystem profits distributed to stakers and participants</li>
              <li>• <strong className="text-white">Deflationary Mechanics:</strong> Regular token buybacks and burns</li>
            </ul>

            <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Even if you have 100 failed businesses, one scaled winner can cover them.
              </h3>
              <p className="text-lg text-slate-300">
                Because the cost of failure is intentionally minimized ($18K-$65K), while the upside of success is unlimited with near-zero marginal costs.
              </p>
            </div>
          </div>
        </section>

        <section id="economics" className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-10 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-cyan-400" />
            <h2 className="text-3xl font-bold text-white">Why AI Changes Business Economics</h2>
          </div>

          <div className="prose prose-invert prose-slate max-w-none">
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              The economic model is not incremental improvement — it's complete inversion of traditional startup costs.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-red-400">Traditional Startup Model (BROKEN)</span>
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex justify-between items-center">
                    <span>Engineers (2-3)</span>
                    <span className="font-semibold text-white">$300K-$450K/year</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Marketing/Growth</span>
                    <span className="font-semibold text-white">$100K-$200K/year</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Operations/Support</span>
                    <span className="font-semibold text-white">$80K-$150K/year</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Infrastructure</span>
                    <span className="font-semibold text-white">$50K-$100K/year</span>
                  </li>
                  <li className="flex justify-between items-center pt-3 border-t border-red-500/30">
                    <span className="font-bold text-white text-lg">Total Fixed Costs</span>
                    <span className="font-bold text-red-400 text-lg">$530K-$900K/year</span>
                  </li>
                </ul>
                <p className="text-sm text-red-400 mt-6 font-medium">
                  High fixed costs = massive risk. Most startups burn through runway before finding product-market fit.
                </p>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-green-400">AI-Native Model (INVERTED)</span>
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex justify-between items-center">
                    <span>AI Agent Operations</span>
                    <span className="font-semibold text-white">$5K-$20K/year</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Automated Marketing</span>
                    <span className="font-semibold text-white">$2K-$10K/year</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>AI Support Systems</span>
                    <span className="font-semibold text-white">$1K-$5K/year</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Infrastructure</span>
                    <span className="font-semibold text-white">$10K-$30K/year</span>
                  </li>
                  <li className="flex justify-between items-center pt-3 border-t border-green-500/30">
                    <span className="font-bold text-white text-lg">Total Annual Costs</span>
                    <span className="font-bold text-green-400 text-lg">$18K-$65K/year</span>
                  </li>
                </ul>
                <p className="text-sm text-green-400 mt-6 font-medium">
                  90% cost reduction = 10x more experiments with the same capital. Risk is minimized. Upside is unlimited.
                </p>
              </div>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-8 text-center">
              <p className="text-lg text-slate-300 leading-relaxed">
                <strong className="text-white text-xl">Result:</strong> Failures are capped at $18K-$65K. Success scales with near-zero marginal costs.
                Even if 100 businesses fail, one scaled winner can cover them all. This asymmetry is the entire economic model.
              </p>
            </div>
          </div>
        </section>

        <section id="problem" className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-10 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-orange-400" />
            <h2 className="text-3xl font-bold text-white">Problem Statement</h2>
          </div>

          <div className="prose prose-invert prose-slate max-w-none">
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              Traditional business creation faces fundamental limitations that prevent most great ideas from ever
              becoming reality. These systemic barriers waste human potential and capital.
            </p>

            <div className="space-y-6">
              <div className="bg-slate-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">High Barriers to Entry</h3>
                <p className="text-slate-300">
                  Starting a business requires significant capital, technical expertise across multiple domains,
                  and months or years of full-time work. Most people with good ideas lack one or more of these resources,
                  meaning 99% of potentially valuable businesses never get built.
                </p>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Single Points of Failure</h3>
                <p className="text-slate-300">
                  Traditional businesses rely on individual humans making critical decisions. When founders burn out,
                  make poor choices, or abandon projects, businesses fail regardless of their underlying merit.
                  Human limitations become business limitations.
                </p>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">AI Limitations</h3>
                <p className="text-slate-300">
                  While AI tools like ChatGPT and Claude are powerful, each has blind spots and weaknesses. A business
                  built using only one AI system inherits that system's limitations. Critical errors in reasoning,
                  code, or strategy can go undetected when only one perspective is considered.
                </p>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Misaligned Incentives</h3>
                <p className="text-slate-300">
                  Venture capital and traditional funding create misalignment between builders, investors, and users.
                  VCs demand rapid growth and exits, often at the expense of product quality and long-term sustainability.
                  Early investors gain disproportionate upside while later participants bear the risk.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="solution" className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-10 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl font-bold text-white">Solution Architecture</h2>
          </div>

          <div className="prose prose-invert prose-slate max-w-none">
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              Aizura solves these problems through a multi-layer architecture that combines AI consensus,
              decentralized governance, and automated execution.
            </p>

            <h3 className="text-2xl font-semibold text-white mt-8 mb-4">1. The AI Consortium</h3>
            <p className="text-slate-300 mb-4">
              Six specialized AI agents work together on every business, each contributing unique expertise:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Product Strategy Agent</h4>
                <p className="text-sm text-slate-300">Market analysis, product-market fit, competitive positioning</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Engineering Agent</h4>
                <p className="text-sm text-slate-300">Architecture design, code generation, deployment automation</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Marketing Agent</h4>
                <p className="text-sm text-slate-300">Growth strategies, content creation, user acquisition</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Operations Agent</h4>
                <p className="text-sm text-slate-300">Process optimization, customer support, incident management</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Finance Agent</h4>
                <p className="text-sm text-slate-300">Budget management, revenue tracking, financial reporting</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Compliance Agent</h4>
                <p className="text-sm text-slate-300">Legal compliance, risk assessment, regulatory monitoring</p>
              </div>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 mb-8">
              <h4 className="text-white font-semibold mb-3">The Power of Consensus</h4>
              <p className="text-slate-300 mb-3">
                When ChatGPT scores 80% on a task, Claude 70%, and Grok 60%, a single AI approach gets at best 80% accuracy.
                Our consortium model achieves 90% or higher by combining their strengths—what one AI misses, another catches.
              </p>
              <p className="text-slate-300">
                This ensemble method has demonstrated 5-10% accuracy improvements and over 600% better overall results
                compared to single-AI agent systems in controlled testing.
              </p>
            </div>

            <h3 className="text-2xl font-semibold text-white mt-8 mb-4">2. Decentralized Governance</h3>
            <p className="text-slate-300 mb-4">
              The community controls which businesses get built through a transparent, on-chain governance system:
            </p>

            <ol className="space-y-3 text-slate-300 mb-8">
              <li><strong className="text-white">Proposal Submission:</strong> Anyone holding 50,000 AAIC can submit a business proposal</li>
              <li><strong className="text-white">Community Discussion:</strong> 7-day discussion period for feedback and refinement</li>
              <li><strong className="text-white">Voting Period:</strong> 14-day voting period for token holders to decide</li>
              <li><strong className="text-white">Execution:</strong> Approved proposals enter the build queue for AI agents</li>
              <li><strong className="text-white">Milestone Releases:</strong> Funds released based on verified progress</li>
            </ol>

            <h3 className="text-2xl font-semibold text-white mt-8 mb-4">3. Autonomous Execution</h3>
            <p className="text-slate-300 mb-4">
              Once approved, the AI consortium autonomously builds and launches the business:
            </p>

            <ul className="space-y-2 text-slate-300">
              <li>• Complete technical implementation (code, infrastructure, deployment)</li>
              <li>• Marketing and user acquisition campaigns</li>
              <li>• Ongoing operations and customer support</li>
              <li>• Performance monitoring and optimization</li>
              <li>• Financial management and reporting</li>
            </ul>
          </div>
        </section>

        <section id="tokenomics" className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-10 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Coins className="w-8 h-8 text-yellow-400" />
            <h2 className="text-3xl font-bold text-white">Tokenomics</h2>
          </div>

          <div className="prose prose-invert prose-slate max-w-none">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-900/50 rounded-xl p-6">
                <div className="text-sm text-slate-400 mb-1">Total Supply</div>
                <div className="text-3xl font-bold text-white">100,000,000 AAIC</div>
                <div className="text-sm text-slate-400 mt-2">Fixed maximum supply, no inflation</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-6">
                <div className="text-sm text-slate-400 mb-1">Distribution Model</div>
                <div className="text-3xl font-bold text-cyan-400">100% Airdrop</div>
                <div className="text-sm text-slate-400 mt-2">No public or private sale</div>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-white mt-8 mb-4">Token Distribution</h3>

            <div className="space-y-4 mb-8">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">Use-to-Earn Pool</span>
                  <span className="text-cyan-400 font-bold">22%</span>
                </div>
                <p className="text-sm text-slate-300">22M AAIC distributed over 48 months to active users</p>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">Team</span>
                  <span className="text-purple-400 font-bold">16%</span>
                </div>
                <p className="text-sm text-slate-300">36-month linear vesting, NO CLIFF</p>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">Staking Rewards</span>
                  <span className="text-green-400 font-bold">15%</span>
                </div>
                <p className="text-sm text-slate-300">15M AAIC pool for staking rewards over 48 months</p>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">Treasury Reserve</span>
                  <span className="text-blue-400 font-bold">15%</span>
                </div>
                <p className="text-sm text-slate-300">DAO-controlled treasury for ecosystem development</p>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">Airdrop</span>
                  <span className="text-yellow-400 font-bold">8%</span>
                </div>
                <p className="text-sm text-slate-300">Community airdrop, 100% unlocked immediately</p>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">Early / Private Investors</span>
                  <span className="text-orange-400 font-bold">8%</span>
                </div>
                <p className="text-sm text-slate-300">NO VESTING - immediate unlock with public wallet labeling</p>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">Market Ops / CEX Readiness</span>
                  <span className="text-pink-400 font-bold">7%</span>
                </div>
                <p className="text-sm text-slate-300">Market operations and exchange listings</p>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">Liquidity Provisioning</span>
                  <span className="text-cyan-400 font-bold">6%</span>
                </div>
                <p className="text-sm text-slate-300">DEX liquidity pools on BNB Chain and other platforms</p>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">Advisors & Strategic Contributors</span>
                  <span className="text-indigo-400 font-bold">3%</span>
                </div>
                <p className="text-sm text-slate-300">12-month linear vesting, NO CLIFF</p>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-white mt-8 mb-4">Deflationary Mechanics</h3>
            <p className="text-slate-300 mb-4">
              AAIC incorporates multiple deflationary mechanisms to reduce circulating supply over time:
            </p>

            <ul className="space-y-2 text-slate-300">
              <li>• <strong className="text-white">Revenue Buybacks:</strong> 20% of ecosystem revenue used to buy tokens from the market</li>
              <li>• <strong className="text-white">Token Burns:</strong> 10% of bought-back tokens permanently burned</li>
              <li>• <strong className="text-white">Governance Burns:</strong> Failed proposal deposits burned</li>
              <li>• <strong className="text-white">Transaction Fees:</strong> Small percentage of transaction volume burned</li>
            </ul>

            <Link to="/token/tokenomics" className="inline-flex items-center gap-2 mt-6 text-cyan-400 hover:text-cyan-300 font-medium">
              View Detailed Tokenomics
              <FileText className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section id="governance" className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-10 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Vote className="w-8 h-8 text-green-400" />
            <h2 className="text-3xl font-bold text-white">Governance Model</h2>
          </div>

          <div className="prose prose-invert prose-slate max-w-none">
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              Aizura employs a hybrid governance model where humans decide what to build and AI agents decide how to build it.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Human Governance</h3>
                <p className="text-slate-300 mb-3">Token holders control strategic decisions:</p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Which businesses to build</li>
                  <li>• Budget allocations</li>
                  <li>• Revenue distribution parameters</li>
                  <li>• Protocol upgrades</li>
                  <li>• Emergency actions</li>
                </ul>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">AI Governance</h3>
                <p className="text-slate-300 mb-3">AI consortium handles tactical execution:</p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Technical implementation</li>
                  <li>• Resource optimization</li>
                  <li>• Day-to-day operations</li>
                  <li>• Performance monitoring</li>
                  <li>• Automated responses</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-white mt-8 mb-4">Voting Mechanics</h3>

            <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-3">Voting Power Calculation</h4>
              <p className="text-slate-300 mb-4">
                Voting power = Base tokens + Staking multiplier + Participation bonus
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• <strong className="text-white">Base:</strong> 1 token = 1 vote</li>
                <li>• <strong className="text-white">Staking Bonus:</strong> Up to 2x multiplier for longer lock periods</li>
                <li>• <strong className="text-white">Participation:</strong> +10% bonus for consistent voting history</li>
              </ul>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-3">Proposal Requirements</h4>
              <ul className="space-y-2 text-slate-300">
                <li>• Minimum 50,000 AAIC to submit</li>
                <li>• 10% quorum required (100M votes)</li>
                <li>• 51% approval threshold</li>
                <li>• 48-hour timelock before execution</li>
              </ul>
            </div>

            <Link to="/governance" className="inline-flex items-center gap-2 mt-6 text-cyan-400 hover:text-cyan-300 font-medium">
              View Governance Dashboard
              <Vote className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section id="revenue" className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-10 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold text-white">Revenue Model</h2>
          </div>

          <div className="prose prose-invert prose-slate max-w-none">
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              Revenue flows from AI-managed businesses back to the ecosystem, creating sustainable value for token holders.
            </p>

            <h3 className="text-2xl font-semibold text-white mt-8 mb-4">Revenue Sources</h3>

            <div className="space-y-4 mb-8">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Business Revenue</h4>
                <p className="text-sm text-slate-300">
                  Each AI-managed business generates revenue through its own business model (subscriptions, fees, trading profits, etc.).
                  A percentage flows to the ecosystem treasury based on governance parameters.
                </p>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Platform Fees</h4>
                <p className="text-sm text-slate-300">
                  Small fees on proposal submissions, voting participation, and certain ecosystem interactions
                  contribute to sustainable operations.
                </p>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Token Appreciation</h4>
                <p className="text-sm text-slate-300">
                  As the ecosystem grows and generates more value, token price appreciation benefits all holders.
                  Deflationary mechanics further support price stability.
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-white mt-8 mb-4">Revenue Distribution</h3>

            <div className="space-y-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">Stakers</span>
                  <span className="text-cyan-400 font-bold">35%</span>
                </div>
                <p className="text-sm text-slate-300">Distributed proportionally to staked token holders</p>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">Treasury</span>
                  <span className="text-blue-400 font-bold">25%</span>
                </div>
                <p className="text-sm text-slate-300">Funding future proposals and ecosystem development</p>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">Token Buybacks</span>
                  <span className="text-green-400 font-bold">20%</span>
                </div>
                <p className="text-sm text-slate-300">Market purchases to support token price</p>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">Token Burns</span>
                  <span className="text-orange-400 font-bold">10%</span>
                </div>
                <p className="text-sm text-slate-300">Permanent removal from circulation</p>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">Governance Participants</span>
                  <span className="text-purple-400 font-bold">10%</span>
                </div>
                <p className="text-sm text-slate-300">Rewards for active voters and proposers</p>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Even if you have 100 failed businesses, one scaled winner can cover them.
              </h3>
              <p className="text-lg text-slate-300">
                Because the cost of failure is intentionally minimized ($18K-$65K), while the upside of success is unlimited with near-zero marginal costs.
              </p>
            </div>
          </div>
        </section>

        <section id="risks" className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-10 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-red-400" />
            <h2 className="text-3xl font-bold text-white">Risk Factors</h2>
          </div>

          <div className="prose prose-invert prose-slate max-w-none">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
              <p className="text-slate-300">
                <strong className="text-white">Important:</strong> This section outlines known and potential risks.
                Participation in this ecosystem carries significant risk. Only participate with funds you can afford to lose.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Technical Risks</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Smart contract bugs or exploits despite audits</li>
                  <li>• AI system failures or unexpected behavior</li>
                  <li>• Infrastructure outages or service disruptions</li>
                  <li>• Oracle manipulation or data feed failures</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Market Risks</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• High volatility in token price</li>
                  <li>• Potential for complete loss of investment</li>
                  <li>• Liquidity risks during market stress</li>
                  <li>• Broader cryptocurrency market downturns</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Regulatory Risks</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Changing regulatory landscape for crypto and AI</li>
                  <li>• Potential restrictions or bans in certain jurisdictions</li>
                  <li>• Tax implications and reporting requirements</li>
                  <li>• Compliance challenges for global operations</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Business Risks</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• AI-managed businesses may fail to achieve product-market fit</li>
                  <li>• Revenue projections may not materialize</li>
                  <li>• Competition from traditional and crypto businesses</li>
                  <li>• Technology limitations or advancements that make approach obsolete</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Governance Risks</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Whale voters controlling governance outcomes</li>
                  <li>• Voter apathy leading to centralization</li>
                  <li>• Malicious proposals approved by majority</li>
                  <li>• Coordination failures in emergency situations</li>
                </ul>
              </div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 mt-8">
              <p className="text-slate-300">
                <strong className="text-white">Non-Exhaustive:</strong> This list does not cover all possible risks.
                Unknown and unforeseen risks may emerge. By participating, you acknowledge and accept all risks,
                known and unknown.
              </p>
            </div>

            <Link to="/legal/disclaimer" className="inline-flex items-center gap-2 mt-6 text-cyan-400 hover:text-cyan-300 font-medium">
              Full Risk Disclosure
              <AlertTriangle className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section id="roadmap" className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-10 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-8 h-8 text-indigo-400" />
            <h2 className="text-3xl font-bold text-white">Roadmap</h2>
          </div>

          <div className="prose prose-invert prose-slate max-w-none">
            <div className="space-y-6">
              <div className="bg-slate-900/50 rounded-xl p-6 border-l-4 border-green-500">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded">COMPLETED</span>
                  <h3 className="text-xl font-semibold text-white">Q4 2024</h3>
                </div>
                <ul className="space-y-2 text-slate-300">
                  <li>✓ AI Consortium framework development</li>
                  <li>✓ Initial business launches (AI Traders V1, AI Web Dev V1)</li>
                  <li>✓ Smart contract architecture design</li>
                  <li>✓ Website and brand identity</li>
                </ul>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border-l-4 border-cyan-500">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm font-medium rounded">IN PROGRESS</span>
                  <h3 className="text-xl font-semibold text-white">Q1 2025</h3>
                </div>
                <ul className="space-y-2 text-slate-300">
                  <li>• Smart contract audits and deployment</li>
                  <li>• Airdrop campaign launch</li>
                  <li>• Community building and engagement</li>
                  <li>• Testnet governance trials</li>
                </ul>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border-l-4 border-blue-500">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-medium rounded">UPCOMING</span>
                  <h3 className="text-xl font-semibold text-white">Q2 2025</h3>
                </div>
                <ul className="space-y-2 text-slate-300">
                  <li>• Mainnet token launch</li>
                  <li>• DEX liquidity provision</li>
                  <li>• Governance system activation</li>
                  <li>• First community proposals</li>
                  <li>• Staking contracts live</li>
                </ul>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border-l-4 border-purple-500">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm font-medium rounded">PLANNED</span>
                  <h3 className="text-xl font-semibold text-white">Q3-Q4 2025</h3>
                </div>
                <ul className="space-y-2 text-slate-300">
                  <li>• Multiple approved businesses launched</li>
                  <li>• CEX listings</li>
                  <li>• Cross-chain expansion</li>
                  <li>• Advanced AI capabilities integration</li>
                  <li>• Revenue distribution begins</li>
                </ul>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border-l-4 border-indigo-500">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-sm font-medium rounded">FUTURE</span>
                  <h3 className="text-xl font-semibold text-white">2026 & Beyond</h3>
                </div>
                <ul className="space-y-2 text-slate-300">
                  <li>• Portfolio of 20+ autonomous businesses</li>
                  <li>• Advanced governance mechanisms</li>
                  <li>• Ecosystem expansion to new markets</li>
                  <li>• Strategic partnerships and integrations</li>
                  <li>• Continuous AI model improvements</li>
                </ul>
              </div>
            </div>

            <Link to="/ecosystem/roadmap" className="inline-flex items-center gap-2 mt-8 text-cyan-400 hover:text-cyan-300 font-medium">
              View Detailed Roadmap
              <Calendar className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 lg:p-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join the Revolution</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Be part of the first truly autonomous business ecosystem. Where AI builds, humans govern,
            and everyone benefits.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/token/airdrop"
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              Join Airdrop
            </Link>
            <Link
              to="/launchpad"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              View Launchpad
            </Link>
            <Link
              to="/community"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              Join Community
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
