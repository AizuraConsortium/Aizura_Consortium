import { useState } from 'react';
import { Rocket, TrendingUp, Infinity, CheckCircle } from 'lucide-react';

interface Phase {
  id: number;
  title: string;
  period: string;
  status: 'completed' | 'current' | 'upcoming';
  description: string;
  features: string[];
  icon: React.ReactNode;
  color: string;
}

export function PhaseTimeline() {
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);

  // Note: Adjust phases based on actual launch date
  const phases: Phase[] = [
    {
      id: 1,
      title: 'Phase 1: Launch & Growth',
      period: 'Years 0-2',
      status: 'current',
      description: 'Initial rewards funded from token supply to bootstrap ecosystem',
      features: [
        'Fixed reward rates from token treasury',
        'Establish user base and usage patterns',
        'Collect data on sustainable rates',
        'Build initial revenue streams'
      ],
      icon: <Rocket className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: 'Phase 2: Transition',
      period: 'Years 2-4',
      status: 'upcoming',
      description: 'Gradual shift from token-funded to revenue-backed rewards',
      features: [
        '50% rewards from token supply',
        '50% rewards from revenue buybacks',
        'Dynamic rate adjustments begin',
        'Prove sustainability model'
      ],
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-cyan-500 to-green-500'
    },
    {
      id: 3,
      title: 'Phase 3: Sustainability',
      period: 'Year 4+',
      status: 'upcoming',
      description: 'Fully revenue-backed model with infinite sustainability',
      features: [
        '100% rewards from revenue buybacks',
        'Rates adjust based on profitability',
        'Perpetual reward system',
        'True sustainable tokenomics'
      ],
      icon: <Infinity className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-3">Three-Phase Sustainability Model</h3>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Our reward system evolves over time, transitioning from token-funded to fully revenue-backed
          rewards, ensuring long-term sustainability.
        </p>
      </div>

      {/* Timeline visualization */}
      <div className="relative">
        {/* Connection line */}
        <div className="absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 via-green-500 to-emerald-500 opacity-30 hidden md:block" />

        <div className="grid md:grid-cols-3 gap-6">
          {phases.map((phase) => (
            <div
              key={phase.id}
              className={`relative bg-slate-800/50 border rounded-xl p-6 transition-all duration-300 ${
                phase.status === 'current'
                  ? 'border-cyan-500 shadow-lg shadow-cyan-500/20'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
              onMouseEnter={() => setHoveredPhase(phase.id)}
              onMouseLeave={() => setHoveredPhase(null)}
            >
              {/* Phase indicator */}
              <div className="absolute -top-4 left-6">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center shadow-lg ${
                    phase.status === 'current' ? 'ring-4 ring-cyan-500/30 animate-pulse' : ''
                  }`}
                >
                  <span className="text-white font-bold">{phase.id}</span>
                </div>
              </div>

              {/* Status badge */}
              <div className="flex justify-end mb-4">
                {phase.status === 'current' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    Current Phase
                  </span>
                ) : phase.status === 'completed' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-700/50 text-slate-400 border border-slate-600 rounded-full text-xs font-medium">
                    Upcoming
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">{phase.title}</h4>
                  <p className="text-sm text-cyan-400 font-medium">{phase.period}</p>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {phase.description}
                </p>

                {/* Features */}
                <div
                  className={`space-y-2 transition-all duration-300 ${
                    hoveredPhase === phase.id ? 'opacity-100' : 'opacity-70'
                  }`}
                >
                  {phase.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hover indicator */}
              {hoveredPhase === phase.id && (
                <div className={`absolute inset-0 bg-gradient-to-br ${phase.color} opacity-5 rounded-xl pointer-events-none`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Key takeaway */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-green-500/10 border border-cyan-500/30 rounded-xl p-6 text-center">
        <h4 className="text-lg font-bold text-white mb-2">The Path to Infinite Sustainability</h4>
        <p className="text-slate-300 text-sm max-w-3xl mx-auto">
          Unlike failed "play-to-earn" models that ran out of funding, our phased approach ensures rewards
          are eventually backed 100% by actual business revenue. This creates a perpetual reward system that
          can last indefinitely as long as businesses remain profitable.
        </p>
      </div>
    </div>
  );
}
