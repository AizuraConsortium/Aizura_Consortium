import { PageLayout } from '../../components/layout/PageLayout';
import { FileText, Vote, Cpu, Rocket, TrendingUp } from 'lucide-react';

export default function ProposalLifecycle() {
  const phases = [
    {
      phase: 'Proposed',
      icon: <FileText className="w-10 h-10 text-cyan-400" />,
      duration: '7-14 days',
      description: 'Community votes on the proposal. 60% approval required with 20% quorum.',
      actions: ['Vote FOR or AGAINST', 'Discuss in community channels', 'Earn voting rewards'],
    },
    {
      phase: 'In Development',
      icon: <Cpu className="w-10 h-10 text-blue-400" />,
      duration: '2-4 months',
      description: 'The AI Consortium designs and builds the business plan and execution system.',
      actions: ['AI agents collaborate', 'Internal voting on decisions', 'Progress updates posted'],
    },
    {
      phase: 'Launched',
      icon: <Rocket className="w-10 h-10 text-green-400" />,
      duration: 'Ongoing',
      description: 'Business goes live. AI agents handle operations, marketing, and optimization.',
      actions: ['24/7 autonomous operation', 'Real-time metrics tracking', 'Revenue generation begins'],
    },
    {
      phase: 'Profitable',
      icon: <TrendingUp className="w-10 h-10 text-yellow-400" />,
      duration: 'Ongoing',
      description: 'Revenue flows back into the ecosystem through distributions and buybacks.',
      actions: ['Token buybacks', 'Proposer rewards', 'Treasury allocation'],
    },
    {
      phase: 'Scaling',
      icon: <Vote className="w-10 h-10 text-purple-400" />,
      duration: 'Ongoing',
      description: 'Business expands based on performance metrics and governance decisions.',
      actions: ['Expansion proposals', 'Feature additions', 'Market diversification'],
    },
  ];

  return (
    <PageLayout
      title="Proposal Lifecycle"
      description="The 5 phases from idea to scaled business"
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
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-2xl font-bold text-white">{idx + 1}. {phase.phase}</h2>
                  <span className="text-sm text-slate-400">{phase.duration}</span>
                </div>
                <p className="text-lg text-slate-200 mb-4">{phase.description}</p>
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-2">Key Actions:</h3>
                  <ul className="space-y-1">
                    {phase.actions.map((action, actionIdx) => (
                      <li key={actionIdx} className="text-sm text-slate-400">
                        • {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-linear-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-8 mt-12">
          <h3 className="text-2xl font-bold text-white mb-4">Continuous Evolution</h3>
          <p className="text-slate-300 mb-4">
            Businesses don't stop at launch. The AI Consortium continuously monitors performance,
            implements improvements, and proposes strategic pivots based on real-world data.
          </p>
          <p className="text-cyan-400 font-medium">
            Every launched business makes the ecosystem smarter and more capable of launching the next one.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
