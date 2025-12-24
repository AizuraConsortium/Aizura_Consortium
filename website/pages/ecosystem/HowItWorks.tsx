import { PageLayout } from '../../components/layout/PageLayout';
import { FileText, Vote, Cpu, Rocket, DollarSign } from 'lucide-react';

export default function HowItWorks() {
  const phases = [
    {
      icon: <FileText className="w-12 h-12 text-cyan-400" />,
      title: '1. Propose',
      description: 'Token holders submit business ideas with goals, scope, and success metrics.',
      detail: 'Minimum 1000 tokens required. Proposer wallet is recorded for future equity allocation.',
    },
    {
      icon: <Vote className="w-12 h-12 text-blue-400" />,
      title: '2. Vote',
      description: 'Community votes FOR or AGAINST. Voting weight matches token holdings.',
      detail: 'Winning-side voters earn reward multipliers. Early voters get bonus weight.',
    },
    {
      icon: <Cpu className="w-12 h-12 text-purple-400" />,
      title: '3. AI Builds',
      description: 'The AI Consortium designs the business plan and execution system.',
      detail: 'Six specialized agents collaborate, debate, and vote on internal decisions.',
    },
    {
      icon: <Rocket className="w-12 h-12 text-green-400" />,
      title: '4. Launch',
      description: 'AI agents deploy the product, operations, and growth loops.',
      detail: '24/7 execution. No downtime. Continuously optimized.',
    },
    {
      icon: <DollarSign className="w-12 h-12 text-yellow-400" />,
      title: '5. Profit & Scale',
      description: 'Revenue flows into transparent distributions and ecosystem growth.',
      detail: 'Token buybacks, burns, treasury allocation, and proposer rewards.',
    },
  ];

  return (
    <PageLayout
      title="How It Works"
      description="From ideas to AI-run revenue in 5 phases"
    >
      <div className="space-y-8">
        {phases.map((phase, idx) => (
          <div
            key={idx}
            className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 hover:border-cyan-500/50 transition-colors"
          >
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">{phase.icon}</div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-3">{phase.title}</h2>
                <p className="text-lg text-slate-200 mb-3">{phase.description}</p>
                <p className="text-slate-400">{phase.detail}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-linear-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-8 mt-12">
          <h3 className="text-2xl font-bold text-white mb-4">The Flywheel Effect</h3>
          <p className="text-slate-300 mb-4">
            As AI gets smarter, so does the entire ecosystem. Every launched business improves the next. Revenue compounds.
            The community grows. More proposals flow in. The cycle accelerates.
          </p>
          <p className="text-cyan-400 font-medium">
            This is how autonomous commerce scales exponentially.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
