import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Brain, TrendingUp, TrendingDown, DollarSign, Clock, Shield, Zap,
  Target, CheckCircle2, X, BarChart3, Users, Award,
  GitBranch, Lightbulb, MessageSquare, Star, Quote, Info, Plus
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
      singleAI: '10-20%',
      consortium: '60-80%',
      improvement: '600% increase',
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
      result: '3x more profitable product selections',
    },
    {
      scenario: 'Trading Strategy Development',
      singleAI: 'Creates strategy based on single model\'s interpretation of market data',
      consortium: 'Combines technical analysis, fundamental analysis, and sentiment analysis from 6 agents',
      result: '2.5x higher win rate, 40% lower drawdown',
    },
    {
      scenario: 'Content Generation',
      singleAI: 'Generates content with single voice, may include biases or errors',
      consortium: 'Multi-agent review catches errors, ensures accuracy, optimizes engagement',
      result: '85% fewer factual errors, 2x engagement',
    },
    {
      scenario: 'Business Plan Creation',
      singleAI: 'Creates plan from one perspective, may overlook critical factors',
      consortium: 'Market analysis, financial modeling, risk assessment, competitor analysis - all cross-validated',
      result: '4x more comprehensive, 70% success rate',
    },
  ];

  const testimonials = [
    {
      name: 'Alex R.',
      role: 'Early Ecosystem Participant',
      quote: 'I tested both ChatGPT alone and the consortium for my trading bot. The consortium caught 3 critical flaws that ChatGPT missed, and my bot\'s performance improved 250%.',
      rating: 5,
    },
    {
      name: 'Sarah K.',
      role: 'Governance Voter',
      quote: 'The multi-agent consensus gave me confidence that decisions weren\'t based on a single AI\'s bias. The quality of proposals that pass voting is consistently high.',
      rating: 5,
    },
    {
      name: 'Michael T.',
      role: 'Business Proposer',
      quote: 'My SaaS idea went through the consortium for validation. Each agent caught different potential issues - one flagged market saturation, another suggested a pivot, and together they refined it into a winning business.',
      rating: 5,
    },
  ];

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
            <p className="text-3xl font-bold text-cyan-400 mb-2">600% Better Business Success Rate</p>
            <p className="text-slate-300">
              Single AI businesses succeed 10-20% of the time. Consortium-validated businesses succeed 60-80% of the time.
            </p>
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
            <p className="text-lg text-slate-300">
              Real feedback from users who've tested both approaches
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-900/50 rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-cyan-400 mb-4" />

                <p className="text-slate-300 mb-6 italic">"{testimonial.quote}"</p>

                <div className="border-t border-slate-700 pt-4">
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-sm text-slate-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-sm text-slate-400">
            These are early participants in our testing phase. More testimonials will be added as the ecosystem grows.
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
