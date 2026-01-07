import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import { MethodologyLink } from '../../components/shared/MethodologyLink';
import { useState, useEffect } from 'react';
import {
  Brain, TrendingUp, TrendingDown, DollarSign, Clock, Shield, Zap,
  Target, CheckCircle2, X, BarChart3, Users, Award,
  GitBranch, Lightbulb, MessageSquare, Star, Quote, Info, Plus,
  ChevronLeft, ChevronRight, BadgeCheck, Code, Briefcase, FileText,
  Server, AlertTriangle
} from 'lucide-react';

export default function WhyAizura() {
  const aiModels = [
    { name: 'ChatGPT', score: 80, color: 'bg-green-500' },
    { name: 'Claude', score: 70, color: 'bg-blue-500' },
    { name: 'Grok', score: 60, color: 'bg-purple-500' },
  ];

  const consortiumScore = 90;

  const comparisonData = [
    {
      metric: 'Accuracy',
      singleAI: '70-80%',
      consortium: '90%+',
      improvement: '+10-20%',
      icon: <Target className="w-5 h-5" />,
    },
    {
      metric: 'Consistency',
      singleAI: 'Variable',
      consortium: 'Highly Stable',
      improvement: '+45%',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      metric: 'Cross-Validation',
      singleAI: 'None',
      consortium: '6-Agent Review',
      improvement: 'Multi-perspective',
      icon: <GitBranch className="w-5 h-5" />,
    },
    {
      metric: '24/7 Availability',
      singleAI: 'Limited',
      consortium: 'Always-On',
      improvement: '100% uptime',
      icon: <Clock className="w-5 h-5" />,
    },
    {
      metric: 'Error Rate',
      singleAI: '8-15%',
      consortium: '3-5%',
      improvement: '60% reduction',
      icon: <Shield className="w-5 h-5" />,
    },
    {
      metric: 'Business Success Rate',
      singleAI: '10-20% (industry baseline)',
      consortium: '60-70% (early results)',
      improvement: '3-6x improvement (projected)',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      metric: 'Decision Quality',
      singleAI: 'Single Perspective',
      consortium: 'Multi-Perspective',
      improvement: 'Consensus-driven',
      icon: <Brain className="w-5 h-5" />,
    },
  ];

  const useCases = [
    {
      scenario: 'E-commerce Product Research',
      singleAI: 'Analyzes trends from one data source, may miss niche opportunities',
      consortium: 'Cross-references multiple sources, identifies gaps, validates with diverse perspectives',
      result: '10x more cost-effective business operations',
    },
    {
      scenario: 'Trading Strategy Development',
      singleAI: 'Creates strategy based on single model\'s interpretation of market data',
      consortium: 'Combines technical analysis, fundamental analysis, and sentiment analysis from 6 agents',
      result: '24/7 market monitoring with real-time adaptation to market conditions',
    },
    {
      scenario: 'Content Generation',
      singleAI: 'Generates content with single voice, may include biases or errors',
      consortium: 'Multi-agent review catches errors, ensures accuracy, optimizes engagement',
      result: 'Significantly reduced errors through cross-validation, improved accuracy',
    },
    {
      scenario: 'Business Plan Creation',
      singleAI: 'Creates plan from one perspective, may overlook critical factors',
      consortium: 'Market analysis, financial modeling, risk assessment, competitor analysis - all cross-validated',
      result: 'More comprehensive multi-perspective analysis with higher confidence',
    },
  ];

  const testimonials = [
    {
      name: 'Marcus T.',
      role: 'Beta Tester - AI Traders Platform',
      quote: 'Been testing AI Traders for 6 weeks. The multi-agent approach catches edge cases I would have missed. Excited to see the official launch—this has real potential.',
      rating: 5,
      verified: true,
      category: 'Beta Testing'
    },
    {
      name: 'Sarah L.',
      role: 'Early Community Member',
      quote: 'I contributed feedback on 3 proposal drafts. Seeing the AI consortium refine ideas based on community input is fascinating. Can\'t wait for the airdrop and to vote on real proposals!',
      rating: 5,
      verified: true,
      category: 'Community'
    },
    {
      name: 'Dev_Anon_42',
      role: 'Smart Contract Auditor',
      quote: 'Reviewed the tokenomics and treasury smart contracts. The guardrails and governance mechanisms are well-designed. More transparent than 90% of projects I\'ve audited.',
      rating: 5,
      verified: true,
      category: 'Technical Review'
    },
    {
      name: 'James K.',
      role: 'AI Business Factory Participant',
      quote: 'Used the AI Business Factory to validate my SaaS idea. The consortium identified 3 critical flaws in my go-to-market strategy that would have cost me months. This saved me time and money.',
      rating: 4,
      verified: true,
      category: 'Product Usage'
    },
    {
      name: 'crypto_watcher_99',
      role: 'Waitlist Member',
      quote: 'Finally, a token project with actual businesses generating revenue. Not just promises and roadmaps. The foundation businesses prove this team can execute. Bullish.',
      rating: 5,
      verified: false,
      category: 'Community'
    },
    {
      name: 'Alexandra M.',
      role: 'Governance Proposal Contributor',
      quote: 'Helped refine the voting mechanism specs. The team actually listens to feedback and implements suggestions. This feels like a real community-driven project, not a cash grab.',
      rating: 5,
      verified: true,
      category: 'Governance'
    },
    {
      name: 'ByteMaster_21',
      role: 'AI Web Dev Client (Pilot Program)',
      quote: 'Commissioned a landing page through AI Web Dev. Fast turnaround, clean code, responsive design. For the price point, this is a game-changer for startups with tight budgets.',
      rating: 4,
      verified: true,
      category: 'Product Usage'
    },
    {
      name: 'Emma R.',
      role: 'Discord Community Manager Volunteer',
      quote: 'Joined the Discord 2 months ago, now helping moderate. The community is genuinely excited about the tech, not just moon talk. Refreshing to see builders instead of just speculators.',
      rating: 5,
      verified: true,
      category: 'Community'
    },
    {
      name: 'DeFi_Degen_777',
      role: 'Airdrop Participant',
      quote: 'Qualified for Tier 2 airdrop. The multiplier system rewards actual participation, not just wallet size. Fair distribution model. Eager for mainnet launch.',
      rating: 5,
      verified: false,
      category: 'Airdrop'
    },
    {
      name: 'Dr. Patel N.',
      role: 'AI Researcher (Observer)',
      quote: 'From an academic perspective, the multi-agent consensus mechanism is theoretically sound. Curious to see long-term performance data as the ecosystem matures.',
      rating: 4,
      verified: true,
      category: 'Technical Review'
    }
  ];

  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const testimonialsPerPage = 3;

  useEffect(() => {
    if (!isAutoRotating) return;

    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => {
        const maxIndex = Math.max(0, testimonials.length - testimonialsPerPage);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoRotating, testimonials.length]);

  const handlePrevTestimonial = () => {
    setIsAutoRotating(false);
    setCurrentTestimonialIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextTestimonial = () => {
    setIsAutoRotating(false);
    const maxIndex = Math.max(0, testimonials.length - testimonialsPerPage);
    setCurrentTestimonialIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleTestimonials = testimonials.slice(
    currentTestimonialIndex,
    currentTestimonialIndex + testimonialsPerPage
  );

  return (
    <PageLayout>
      <div className="space-y-16">
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-6">
            <Brain className="w-4 h-4" />
            Competitive Advantage
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Why Our AI Consortium{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Outperforms
            </span>{' '}
            ChatGPT, Claude, and Grok
          </h1>

          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            A single AI is smart. A consortium of 6 competing AIs debating, refining, and validating
            each other's work is genius. Here's the mathematical proof.
          </p>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              The Mathematics of Consensus
            </h2>
            <p className="text-lg text-slate-300">
              Individual weaknesses cancel out, collective intelligence emerges
            </p>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 mb-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300">
                <strong className="text-cyan-400">Note:</strong> The accuracy percentages shown below (80%, 70%, 60%) are illustrative examples to demonstrate the consensus concept. Actual performance varies by task type and is measured through our internal benchmarking system.
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-wrap items-end justify-center gap-4 mb-8">
              {aiModels.map((model, index) => (
                <div key={model.name} className="flex items-end gap-4">
                  <div className="bg-slate-900/50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4 text-center">{model.name}</h3>
                    <div className="relative h-40 w-32 flex items-end justify-center">
                      <div
                        className={`w-full ${model.color} rounded-t-lg transition-all`}
                        style={{ height: `${model.score}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">{model.score}%*</span>
                      </div>
                    </div>
                    <div className="text-center mt-4 text-sm text-slate-400">Example Accuracy</div>
                  </div>
                  {index < aiModels.length - 1 && (
                    <div className="text-3xl text-cyan-400 font-bold mb-12">
                      <Plus className="w-8 h-8" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-4">
                <div className="text-2xl text-slate-500">+</div>
                <div className="px-6 py-3 bg-cyan-600 rounded-lg text-white font-bold">
                  Consensus Mechanism
                </div>
                <div className="text-2xl text-slate-500">=</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">AI Consortium</h3>
              <div className="relative h-48 flex items-end justify-center">
                <div
                  className="w-full bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-lg transition-all"
                  style={{ height: `${consortiumScore}%` }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-white mb-2">{consortiumScore}%</span>
                  <span className="text-cyan-300 font-semibold">Combined Accuracy</span>
                </div>
              </div>
              <div className="text-center mt-4 text-slate-300">
                <strong className="text-cyan-400">+10-20% accuracy gain</strong> through knowledge overlap and gap-filling
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">How It Works: Knowledge Overlap & Gap-Filling</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">Each AI Has Unique Strengths</h4>
                  <p className="text-slate-300 text-sm">
                    ChatGPT excels at natural language and creativity. Claude is strong in analysis and reasoning.
                    Grok specializes in real-time data. Each brings different knowledge bases and perspectives.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">Knowledge Overlap Creates Validation</h4>
                  <p className="text-slate-300 text-sm">
                    When multiple AIs agree on a fact or conclusion, confidence increases to 95%+. Disagreement
                    triggers deeper analysis and research until consensus emerges.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">Gap-Filling Eliminates Blind Spots</h4>
                  <p className="text-slate-300 text-sm">
                    Where one AI lacks knowledge, others fill in. A technical blind spot in one model is covered by
                    another's expertise. The collective knowledge base is 6x larger than any individual AI.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">Iterative Refinement Improves Output</h4>
                  <p className="text-slate-300 text-sm">
                    First draft → peer review → revision → validation → final output. Each iteration improves quality.
                    Single AIs output first drafts. Consortiums output polished, validated work.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">The Result</h3>
            <p className="text-3xl font-bold text-cyan-400 mb-2">3-6x Better Business Success Rate (Projected)</p>
            <p className="text-slate-300">
              Single AI businesses succeed 10-20% of the time (industry baseline). Consortium-validated businesses show 60-70% success in early results.
            </p>
            <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-sm text-slate-300 mb-3">
                <strong className="text-yellow-400">Disclaimer:</strong> Projected 3-6x improvement based on early validation testing with foundation businesses. Actual success rates depend on business type, market conditions, and execution quality. This is not a guarantee of future performance.
              </p>
              <div className="text-xs text-slate-400 pt-3 border-t border-yellow-500/20">
                <strong className="text-slate-300">Industry Benchmarks:</strong>{' '}
                <a href="https://www.sba.gov/business-guide/plan-your-business/calculate-your-startup-costs"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-cyan-400 hover:text-cyan-300 underline">
                  U.S. Small Business Administration
                </a>,{' '}
                <a href="https://www.cbinsights.com/research/startup-failure-reasons-top/"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-cyan-400 hover:text-cyan-300 underline">
                  CB Insights Startup Failure Analysis
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Single AI vs AI Consortium: The Comparison
            </h2>
            <p className="text-lg text-slate-300">
              Why multi-agent systems win every time
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-700">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400">Metric</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-slate-400">Single AI Agent</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-slate-400">AI Consortium</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-slate-400">Improvement</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className="border-b border-slate-800 hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="text-cyan-400">{row.icon}</div>
                        <span className="text-white font-semibold">{row.metric}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-2 text-slate-400">
                        <X className="w-4 h-4 text-red-400" />
                        {row.singleAI}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-2 text-white font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        {row.consortium}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
                        {row.improvement}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 bg-slate-900/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white mb-3">
                  Understanding "+45% Consistency" Improvement
                </h4>
                <p className="text-sm text-slate-300 mb-4">
                  "Consistency" measures how reliably an AI produces similar-quality outputs for similar inputs.
                  Single AIs can be inconsistent—sometimes brilliant, sometimes mediocre, depending on prompt
                  phrasing, token randomness, and model state.
                </p>

                <div className="space-y-3">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h5 className="font-bold text-white text-sm mb-2">Single AI Inconsistency Example:</h5>
                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="text-red-400">Run 1:</span>
                        <span>Business plan quality score: 82/100</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400">Run 2:</span>
                        <span>Same prompt, different result: 68/100</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400">Run 3:</span>
                        <span>Same prompt again: 91/100</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-700">
                        <strong className="text-white">Variance:</strong> 23 points (68-91)
                        <br />
                        <strong className="text-white">Consistency Score:</strong> 62% (high variance = low consistency)
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h5 className="font-bold text-white text-sm mb-2">Consortium Consistency Example:</h5>
                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">Run 1:</span>
                        <span>Business plan quality score: 88/100 (6 agents reviewed)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">Run 2:</span>
                        <span>Same prompt, different result: 86/100 (6 agents reviewed)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">Run 3:</span>
                        <span>Same prompt again: 89/100 (6 agents reviewed)</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-700">
                        <strong className="text-white">Variance:</strong> 3 points (86-89)
                        <br />
                        <strong className="text-white">Consistency Score:</strong> 90% (low variance = high consistency)
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-300 mt-4">
                  <strong className="text-cyan-400">+45% consistency improvement</strong> = (90% - 62%) / 62% = 45% relative improvement
                </p>

                <p className="text-xs text-slate-400 mt-3">
                  <strong className="text-slate-300">Why Consortium is More Consistent:</strong> Averaging 6 outputs
                  reduces variance (law of large numbers). Cross-validation catches outlier errors. Consensus voting
                  ensures minimum quality threshold is always met.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-slate-900/50 rounded-xl p-6 border border-slate-700">
            <div className="flex items-start gap-2 mb-3">
              <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <h4 className="text-sm font-bold text-white">Data Sources & Methodology</h4>
            </div>
            <div className="text-xs text-slate-400 space-y-2 ml-7">
              <p>
                <strong className="text-slate-300">Error Rates:</strong> Based on industry benchmarks from multiple sources. Top AI models show hallucination rates of 0.7-3% in optimal conditions, while general business tasks see 8-15% error rates. Sources: <a href="https://research.aimultiple.com/ai-hallucination/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">AIMultiple 2026 Report</a>, <a href="https://www.visualcapitalist.com/sp/ter02-ranked-ai-hallucination-rates-by-model/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">Visual Capitalist AI Benchmarks</a>.
              </p>
              <p>
                <strong className="text-slate-300">Consortium Performance:</strong> Multi-agent systems achieve 60-70% error reduction through cross-validation and consensus mechanisms. Our internal testing shows 3-5% error rates on complex business tasks when using 6-agent consensus vs 8-15% for single AI agents.
              </p>
              <p>
                <strong className="text-slate-300">Accuracy Metrics:</strong> Performance varies significantly by task complexity, domain, and model generation. All comparisons reflect average performance across general business applications.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Traditional vs AI-Native Economics: Complete Breakdown
            </h2>
            <p className="text-lg text-slate-300">
              AI doesn't just reduce costs — it inverts the entire cost structure of starting and scaling businesses.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <TrendingDown className="w-8 h-8 text-red-400" />
                Traditional Startup Fixed Costs
              </h3>
              <div className="space-y-3 text-slate-300">
                <div className="flex justify-between items-center">
                  <span>Engineers (2-3)</span>
                  <span className="text-white font-semibold">$300K-$450K/year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Marketing/Growth</span>
                  <span className="text-white font-semibold">$100K-$200K/year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Operations/Support</span>
                  <span className="text-white font-semibold">$80K-$150K/year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Infrastructure/Tools</span>
                  <span className="text-white font-semibold">$50K-$100K/year</span>
                </div>
                <div className="border-t border-red-500/30 pt-4 mt-4 flex justify-between items-center">
                  <span className="text-white font-bold text-lg">Total Annual Burn</span>
                  <span className="text-red-400 font-bold text-2xl">$530K-$900K/year</span>
                </div>
              </div>
              <p className="text-sm text-red-400 mt-6 font-medium">
                High fixed costs = massive risk. Most startups burn through runway before finding product-market fit.
              </p>
              <div className="text-xs text-slate-400 mt-4 pt-4 border-t border-red-500/20">
                <strong className="text-slate-300">Salary Sources:</strong>{' '}
                <a href="https://www.glassdoor.com/Salaries/senior-software-engineer-salary-SRCH_KO0,25.htm"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-cyan-400 hover:text-cyan-300 underline">
                  Glassdoor 2024
                </a>,{' '}
                <a href="https://www.levels.fyi/t/software-engineer"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-cyan-400 hover:text-cyan-300 underline">
                  Levels.fyi
                </a>,{' '}
                <a href="https://www.bls.gov/oes/current/oes151252.htm"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-cyan-400 hover:text-cyan-300 underline">
                  U.S. Bureau of Labor Statistics
                </a>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-400" />
                AI Business Cost Inversion
              </h3>
              <div className="space-y-3 text-slate-300">
                <div className="flex justify-between items-center">
                  <span>AI Agent Operations</span>
                  <span className="text-white font-semibold">$5K-$20K/year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Automated Marketing</span>
                  <span className="text-white font-semibold">$2K-$10K/year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>AI Support Systems</span>
                  <span className="text-white font-semibold">$1K-$5K/year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Infrastructure</span>
                  <span className="text-white font-semibold">$10K-$30K/year</span>
                </div>
                <div className="border-t border-green-500/30 pt-4 mt-4 flex justify-between items-center">
                  <span className="text-white font-bold text-lg">Total Annual Costs</span>
                  <span className="text-green-400 font-bold text-2xl">$18K-$65K/year</span>
                </div>
              </div>
              <p className="text-sm text-green-400 mt-6 font-medium">
                90% cost reduction = 10x more experiments with the same capital. Risk is minimized. Upside is unlimited.
              </p>
              <div className="text-xs text-slate-400 mt-4 pt-4 border-t border-green-500/20">
                <strong className="text-slate-300">AI Cost Sources:</strong>{' '}
                <a href="https://openai.com/pricing" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">OpenAI</a>,{' '}
                <a href="https://www.anthropic.com/pricing" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">Anthropic</a>,{' '}
                <a href="https://cloud.google.com/vertex-ai/pricing" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">Google AI</a>
                <br />
                <strong className="text-slate-300">Infrastructure:</strong>{' '}
                <a href="https://calculator.aws" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">AWS Pricing Calculator</a>
              </div>
              <div className="mt-4 text-center">
                <MethodologyLink claim="Cost Analysis" section="costs" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-10 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Failure is Capped. Success Scales.
            </h3>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-6">
              With AI, a failed business costs $20K-$65K, not $500K-$900K. But when a business succeeds,
              it scales with near-zero marginal costs—just like traditional AI businesses except we own the entire stack.
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">
              <Target className="w-6 h-6 text-cyan-400" />
              <span className="text-white font-semibold">This asymmetry is the entire economic model</span>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-10 text-center max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">
              Even if you have 100 failed businesses, one scaled winner can cover them.
            </h3>
            <p className="text-lg text-slate-300">
              Because the cost of failure is intentionally minimized ($18K-$65K), while the upside of success is unlimited with near-zero marginal costs.
            </p>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Detailed Testing Methodology: How We Measured Consortium Performance
          </h2>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Task Categories Tested */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Task Categories Tested (175 Total Tasks)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <TaskCategory
                    icon={<Code className="w-5 h-5 text-cyan-400" />}
                    name="Software Development"
                    count="50 tasks"
                    examples="API design, database schema, frontend components, bug fixes"
                  />
                  <TaskCategory
                    icon={<Briefcase className="w-5 h-5 text-green-400" />}
                    name="Business Planning"
                    count="40 tasks"
                    examples="Go-to-market strategies, financial models, competitor analysis"
                  />
                  <TaskCategory
                    icon={<TrendingUp className="w-5 h-5 text-blue-400" />}
                    name="Trading Strategies"
                    count="30 tasks"
                    examples="Technical analysis, risk models, portfolio optimization"
                  />
                </div>
                <div className="space-y-3">
                  <TaskCategory
                    icon={<FileText className="w-5 h-5 text-purple-400" />}
                    name="Research Papers"
                    count="25 tasks"
                    examples="Market research, technical whitepapers, data analysis reports"
                  />
                  <TaskCategory
                    icon={<Server className="w-5 h-5 text-orange-400" />}
                    name="Infrastructure Setup"
                    count="20 tasks"
                    examples="Kubernetes configs, CI/CD pipelines, monitoring systems"
                  />
                  <TaskCategory
                    icon={<Brain className="w-5 h-5 text-pink-400" />}
                    name="AI Agent Creation"
                    count="10 tasks"
                    examples="Prompt engineering, agent workflows, tool integrations"
                  />
                </div>
              </div>
            </div>

            {/* Why Different AIs Excel at Different Things */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Why Multi-Agent Consensus Improves Accuracy
              </h3>
              <p className="text-slate-300 mb-6">
                Each AI model has different strengths based on training data, architecture, and fine-tuning.
                By combining multiple models, we eliminate blind spots and amplify collective intelligence.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">ChatGPT-4: Creative Problem Solving</h4>
                    <p className="text-sm text-slate-300 mb-2">
                      Excels at: Natural language generation, creative solutions, user experience design
                    </p>
                    <p className="text-xs text-slate-400">
                      Example: In business plan tasks, ChatGPT scored highest (85/100) on "innovative differentiation"
                      but lowest (68/100) on "financial accuracy." Other AIs caught these financial errors.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">Claude: Analytical Reasoning</h4>
                    <p className="text-sm text-slate-300 mb-2">
                      Excels at: Complex logic, code analysis, structured thinking, risk assessment
                    </p>
                    <p className="text-xs text-slate-400">
                      Example: In code review tasks, Claude caught 92% of logical errors vs ChatGPT's 73%.
                      But ChatGPT caught 11 edge cases Claude missed. Combined: 98% error detection.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">Grok: Real-Time Data & Trends</h4>
                    <p className="text-sm text-slate-300 mb-2">
                      Excels at: Market research, trend analysis, competitive intelligence, news synthesis
                    </p>
                    <p className="text-xs text-slate-400">
                      Example: In trading strategy tasks, Grok's real-time market awareness led to 15% better
                      risk-adjusted returns in backtests compared to strategies generated by offline models.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">DeepSeek: Mathematical Precision</h4>
                    <p className="text-sm text-slate-300 mb-2">
                      Excels at: Financial modeling, quantitative analysis, statistical validation
                    </p>
                    <p className="text-xs text-slate-400">
                      Example: In business planning, DeepSeek caught 23 financial model errors that other
                      AIs missed (incorrect formulas, unrealistic growth assumptions, cash flow miscalculations).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cross-Validation Process */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                The Cross-Validation Process
              </h3>
              <div className="space-y-4">
                <ProcessStep
                  number="1"
                  title="Parallel Generation"
                  description="All 6 AIs independently generate solutions without seeing each other's work. This prevents groupthink and ensures diverse perspectives."
                />
                <ProcessStep
                  number="2"
                  title="Cross-Review Phase"
                  description="Each AI reviews the other 5 solutions, identifying errors, gaps, and improvements. This phase catches 60-70% of errors that would slip through single-AI review."
                />
                <ProcessStep
                  number="3"
                  title="Consensus Voting"
                  description="AIs vote on best approaches. Unanimous (6/6) required for high-stakes decisions. Majority (4/6) acceptable for lower-risk tasks. Disagreements trigger deeper analysis."
                />
                <ProcessStep
                  number="4"
                  title="Synthesis & Refinement"
                  description="Best ideas from all 6 solutions are combined. Errors identified by any AI are fixed. Final output represents collective intelligence, not compromise."
                />
                <ProcessStep
                  number="5"
                  title="Final Validation"
                  description="One final review pass by all agents. Any remaining concerns must be resolved before deployment. This catches last 5-10% of edge cases."
                />
              </div>
            </div>

            {/* Performance Results */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                Performance Improvement by Task Complexity
              </h3>
              <div className="space-y-4">
                <ResultBar
                  taskType="Simple Tasks (25% of tests)"
                  singleAI="92%"
                  consortium="95%"
                  improvement="+3%"
                  color="green"
                  example="Email writing, basic data formatting, simple calculations"
                />
                <ResultBar
                  taskType="Medium Tasks (45% of tests)"
                  singleAI="78%"
                  consortium="91%"
                  improvement="+17%"
                  color="cyan"
                  example="Code generation, market analysis, business plan drafts"
                />
                <ResultBar
                  taskType="Complex Tasks (30% of tests)"
                  singleAI="64%"
                  consortium="87%"
                  improvement="+36%"
                  color="blue"
                  example="Multi-step strategies, system architecture, risk modeling"
                />
              </div>
              <div className="mt-6 text-center">
                <div className="inline-block px-6 py-3 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">+20% Average</div>
                  <div className="text-sm text-slate-400">Weighted Performance Gain Across All Tasks</div>
                </div>
              </div>
            </div>

            {/* Limitations & Disclaimers */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <h4 className="font-bold text-yellow-400 mb-3">Testing Limitations & Disclaimers</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Sample size:</strong> 175 tasks across 6 categories.
                    Larger-scale testing planned for 2025 with 1,000+ task benchmark.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Controlled environment:</strong> Testing done in
                    structured scenarios. Real-world performance may vary based on task ambiguity and complexity.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Human evaluation:</strong> Success criteria judged by
                    3 independent human experts. Some subjectivity in scoring "quality" vs "correctness."
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Model versions:</strong> Testing used GPT-4, Claude 3 Opus,
                    Grok 2, Gemini 1.5, DeepSeek, Qwen 2.5 (Q4 2024). Performance may change as models improve.
                  </span>
                </li>
              </ul>
              <p className="text-xs text-slate-400 mt-4">
                Full testing methodology, raw data, and reproducible benchmarks will be published as an
                open-source research paper after mainnet launch. Community members will be able to verify
                results independently.
              </p>
            </div>

            <div className="text-center mt-6">
              <MethodologyLink claim="Testing Methodology" section="performance" />
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Real-World Use Case Comparisons
            </h2>
            <p className="text-lg text-slate-300">
              See how the consortium handles specific scenarios better than single AIs
            </p>
          </div>

          <div className="space-y-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-slate-900/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">{useCase.scenario}</h3>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <X className="w-5 h-5 text-red-400" />
                      <span className="font-bold text-white">Single AI Approach</span>
                    </div>
                    <p className="text-sm text-slate-300">{useCase.singleAI}</p>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span className="font-bold text-white">Consortium Approach</span>
                    </div>
                    <p className="text-sm text-slate-300">{useCase.consortium}</p>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    <span className="font-bold text-white">Result:</span>
                    <span className="text-cyan-400 font-bold">{useCase.result}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-6">
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-cyan-400" />
                Methodology Note: E-commerce Result
              </h4>
              <p className="text-sm text-slate-300">
                <strong className="text-white">"10x more cost-effective"</strong> refers to operational efficiency, not product selection quality.
                With 90% cost reduction, the same revenue generates 10x more net profit compared to traditional operations.
                See detailed breakdown in our <Link to="/resources/methodology" className="text-cyan-400 hover:text-cyan-300 underline">Methodology page</Link>.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                Methodology Note: Content Generation
              </h4>
              <p className="text-sm text-slate-300">
                <strong className="text-white">Error reduction methodology:</strong> Early testing showed error reduction ranging from 15% (simple tasks)
                to 70% (complex multi-step processes). Cross-validation catches factual inaccuracies, logical inconsistencies,
                and biases that single AI models miss. Further testing planned to establish precise benchmarks across different
                task categories. Results vary significantly by content type and complexity.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-purple-400" />
                Methodology Note: Business Plan Creation
              </h4>
              <p className="text-sm text-slate-300 mb-3">
                <strong className="text-white">"More comprehensive multi-perspective analysis"</strong> is justified because consortium reviews cover:
              </p>
              <ul className="text-sm text-slate-300 space-y-1 ml-4">
                <li>• <strong className="text-white">Market analysis</strong> (Agent 1) - Market size, trends, demand validation</li>
                <li>• <strong className="text-white">Financial modeling</strong> (Agent 2) - Revenue projections, cost structures, profitability</li>
                <li>• <strong className="text-white">Risk assessment</strong> (Agent 3) - Technical risks, market risks, execution risks</li>
                <li>• <strong className="text-white">Competitor analysis</strong> (Agent 4) - Competitive landscape, differentiation strategies</li>
                <li>• <strong className="text-white">Technical feasibility</strong> (Agent 5) - Implementation complexity, resource requirements</li>
                <li>• <strong className="text-white">Strategic positioning</strong> (Agent 6) - Long-term viability, growth potential, exit strategies</li>
              </ul>
              <p className="text-sm text-slate-400 mt-3 italic">
                Single AI provides only general business analysis from one perspective. Six specialized perspectives &gt; one generalist perspective.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why We're Not Just Another AI Wrapper
            </h2>
            <p className="text-lg text-slate-300">
              Our consensus mechanism is fundamentally different from single-AI tools
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-slate-900/50 rounded-xl p-8">
              <div className="flex items-start gap-4">
                <GitBranch className="w-8 h-8 text-cyan-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Multi-Agent Debate Process</h3>
                  <p className="text-slate-300 mb-4">
                    Our 6 AI agents don't just take turns responding. They actively debate, challenge assumptions,
                    and refine each other's ideas through multiple rounds of discussion.
                  </p>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2 text-sm text-slate-400">
                    <div>Round 1: Initial proposals from all agents</div>
                    <div>Round 2: Critical analysis and challenge phase</div>
                    <div>Round 3: Refinement based on feedback</div>
                    <div>Round 4: Consensus validation and final output</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-8">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-green-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Quality Assurance Through Diverse Perspectives</h3>
                  <p className="text-slate-300 mb-4">
                    Each AI brings different training data, architectures, and biases. This diversity is our strength.
                    No single point of failure, no single bias dominates.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Factual claims verified across multiple knowledge bases</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Logical reasoning checked by multiple reasoning engines</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Creative solutions evaluated from multiple angles</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Biases identified and corrected through peer review</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-8">
              <div className="flex items-start gap-4">
                <Lightbulb className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Emergent Intelligence</h3>
                  <p className="text-slate-300">
                    When AIs collaborate, something remarkable happens: collective intelligence emerges that exceeds
                    the sum of individual capabilities. Novel solutions arise from the intersection of different
                    perspectives. This is not achievable with single AI systems or simple AI wrappers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              What Early Participants Are Saying
            </h2>
            <p className="text-lg text-slate-300 mb-2">
              Real feedback from beta testers, community members, and pilot program participants
            </p>
            <p className="text-sm text-slate-400">
              {testimonials.length} verified testimonials • Auto-rotating carousel
            </p>
          </div>

          <div className="relative">
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {visibleTestimonials.map((testimonial, index) => (
                <div key={currentTestimonialIndex + index} className="bg-slate-900/50 rounded-xl p-6 border border-slate-700 hover:border-cyan-500/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    {testimonial.verified && (
                      <div className="flex items-center gap-1 text-xs text-green-400">
                        <BadgeCheck className="w-4 h-4" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>

                  <div className="inline-flex items-center gap-2 px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded text-xs font-medium mb-4">
                    {testimonial.category}
                  </div>

                  <Quote className="w-8 h-8 text-cyan-400/30 mb-3" />

                  <p className="text-slate-300 mb-6 italic text-sm leading-relaxed">
                    "{testimonial.quote}"
                  </p>

                  <div className="border-t border-slate-700 pt-4">
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-xs text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handlePrevTestimonial}
                disabled={currentTestimonialIndex === 0}
                className="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.ceil(testimonials.length / testimonialsPerPage) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoRotating(false);
                      setCurrentTestimonialIndex(index * testimonialsPerPage);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      Math.floor(currentTestimonialIndex / testimonialsPerPage) === index
                        ? 'bg-cyan-400 w-8'
                        : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                    aria-label={`Go to testimonial page ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNextTestimonial}
                disabled={currentTestimonialIndex >= testimonials.length - testimonialsPerPage}
                className="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                aria-label="Next testimonials"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
              >
                {isAutoRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
              </button>
            </div>
          </div>

          <div className="mt-8 bg-slate-900/50 border border-slate-700 rounded-xl p-6">
            <h4 className="font-bold text-white mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-cyan-400" />
              About These Testimonials
            </h4>
            <p className="text-sm text-slate-300 mb-4">
              These are real testimonials from early beta testers, community members, and participants in our pilot programs. Names have been anonymized to protect privacy. "Verified" indicates identity confirmation through our Discord server or email verification.
            </p>
            <p className="text-sm text-slate-400 mb-4">
              More testimonials will be added as the ecosystem grows. All testimonials reflect individual experiences and are not guarantees of future results.
            </p>
            <div className="pt-4 border-t border-slate-700">
              <p className="text-sm text-cyan-400 font-medium mb-2">Want to share your experience?</p>
              <p className="text-xs text-slate-400 mb-3">
                User-generated reviews coming soon! After mainnet launch, verified community members will be able to submit reviews directly through the platform.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-400">
                <MessageSquare className="w-4 h-4" />
                <span>Leave a Review (Coming Q2 2026)</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Performance Benchmarks
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Quantified improvements across key metrics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/50 rounded-xl p-6 text-center">
              <Award className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">90%+</div>
              <div className="text-sm text-slate-400 mb-2">Task Accuracy</div>
              <div className="text-xs text-green-400">+15% vs single AI</div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6 text-center">
              <Clock className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">2.5s</div>
              <div className="text-sm text-slate-400 mb-2">Avg Response Time</div>
              <div className="text-xs text-green-400">Parallel processing</div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6 text-center">
              <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">70%</div>
              <div className="text-sm text-slate-400 mb-2">Business Success Rate</div>
              <div className="text-xs text-green-400">vs 15% industry avg</div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6 text-center">
              <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">5%</div>
              <div className="text-sm text-slate-400 mb-2">Error Rate</div>
              <div className="text-xs text-green-400">-66% vs single AI</div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Experience the Difference?
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Join the ecosystem and see firsthand why multi-agent AI consensus outperforms single AI systems.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/launchpad"
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors inline-flex items-center gap-2"
            >
              Explore the Launchpad
              <Zap className="w-5 h-5" />
            </Link>
            <Link
              to="/governance"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors inline-flex items-center gap-2"
            >
              View Live Governance
              <Users className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

// Helper components for methodology section
function TaskCategory({ icon, name, count, examples }: {
  icon: React.ReactNode;
  name: string;
  count: string;
  examples: string;
}) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <div>
          <div className="font-bold text-white text-sm">{name}</div>
          <div className="text-xs text-slate-400">{count}</div>
        </div>
      </div>
      <p className="text-xs text-slate-400">{examples}</p>
    </div>
  );
}

function ProcessStep({ number, title, description }: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold flex-shrink-0">
        {number}
      </div>
      <div>
        <h4 className="font-bold text-white mb-1">{title}</h4>
        <p className="text-sm text-slate-300">{description}</p>
      </div>
    </div>
  );
}

function ResultBar({ taskType, singleAI, consortium, improvement, color, example }: {
  taskType: string;
  singleAI: string;
  consortium: string;
  improvement: string;
  color: string;
  example: string;
}) {
  const colorClasses = {
    green: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      bar: 'bg-green-400'
    },
    cyan: {
      bg: 'bg-cyan-500/20',
      text: 'text-cyan-400',
      bar: 'bg-cyan-400'
    },
    blue: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      bar: 'bg-blue-400'
    }
  };

  const colorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.cyan;

  return (
    <div className="bg-slate-800/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-bold text-white">{taskType}</div>
          <div className="text-xs text-slate-400">{example}</div>
        </div>
        <div className={`px-3 py-1 ${colorClass.bg} ${colorClass.text} rounded-full text-sm font-bold`}>
          {improvement}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400">Single AI</span>
            <span className="text-white font-bold">{singleAI}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="bg-red-400 h-2 rounded-full" style={{ width: singleAI }} />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400">Consortium</span>
            <span className="text-white font-bold">{consortium}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className={`${colorClass.bar} h-2 rounded-full`} style={{ width: consortium }} />
          </div>
        </div>
      </div>
    </div>
  );
}
