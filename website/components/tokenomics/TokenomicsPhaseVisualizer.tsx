import { useState } from 'react';
import { Clock, TrendingUp, Zap, DollarSign, CheckCircle2, Info } from 'lucide-react';

interface Phase {
  id: number;
  title: string;
  period: string;
  status: 'active' | 'upcoming' | 'future';
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  mechanisms: string[];
  highlights: string[];
}

export function TokenomicsPhaseVisualizer() {
  const [selectedPhase, setSelectedPhase] = useState<number>(1);

  const phases: Phase[] = [
    {
      id: 1,
      title: 'Fixed Token Supply',
      period: 'Years 0-2',
      status: 'active',
      icon: <Clock className="w-6 h-6" />,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      description: 'Initial bootstrap phase where U2E rewards come from a fixed allocation of pre-minted tokens.',
      mechanisms: [
        'Rewards distributed from initial 300M AAIC allocation',
        'Fixed reward rates per action type',
        'Predictable reward structure',
        'No dependency on business revenue'
      ],
      highlights: [
        'Immediate rewards available',
        'Encourages early adoption',
        'Fixed supply ensures no inflation',
        'Simple and transparent'
      ]
    },
    {
      id: 2,
      title: 'Hybrid Transition',
      period: 'Years 2-4',
      status: 'upcoming',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      description: 'Gradual transition period mixing fixed supply rewards with revenue-backed rewards.',
      mechanisms: [
        'Blend of fixed allocation + revenue buybacks',
        'Gradual reduction of fixed rewards',
        'Increasing revenue-backed component',
        'Smooth transition to sustainability'
      ],
      highlights: [
        'Risk-balanced approach',
        'Tests revenue sustainability',
        'Community adapts gradually',
        'No sudden changes'
      ]
    },
    {
      id: 3,
      title: '100% Revenue-Backed',
      period: 'Year 4+',
      status: 'future',
      icon: <Zap className="w-6 h-6" />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      description: 'Fully sustainable model where all U2E rewards come from ecosystem revenue buybacks.',
      mechanisms: [
        'Business revenue → token buybacks → reward distribution',
        'Dynamic reward rates based on revenue',
        'Completely sustainable model',
        'No reliance on token emissions'
      ],
      highlights: [
        'Self-sustaining ecosystem',
        'Scales with business success',
        'Honest economics',
        'Long-term viability'
      ]
    }
  ];

  const currentPhase = phases.find(p => p.id === selectedPhase)!;

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="absolute top-8 left-0 right-0 h-1 bg-slate-700" />

        <div className="relative z-10 grid grid-cols-3 gap-4">
          {phases.map((phase, index) => (
            <button
              key={phase.id}
              onClick={() => setSelectedPhase(phase.id)}
              className={`group transition-all ${
                selectedPhase === phase.id ? 'scale-105' : 'hover:scale-102'
              }`}
            >
              <div className={`relative`}>
                <div
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 transition-all ${
                    selectedPhase === phase.id
                      ? `${phase.bgColor} ${phase.borderColor} border-2 ${phase.color}`
                      : 'bg-slate-800 border-2 border-slate-700 text-slate-500'
                  }`}
                >
                  {phase.icon}
                </div>

                {index < phases.length - 1 && (
                  <div className="absolute top-8 left-[calc(50%+32px)] w-[calc(100%-32px)] h-1 bg-slate-700 group-hover:bg-slate-600 transition-colors" />
                )}
              </div>

              <div className="text-center">
                <div className={`text-xs font-medium mb-1 ${
                  selectedPhase === phase.id ? phase.color : 'text-slate-500'
                }`}>
                  Phase {phase.id}
                </div>
                <div className={`font-bold mb-1 transition-colors ${
                  selectedPhase === phase.id ? 'text-white' : 'text-slate-400'
                }`}>
                  {phase.title}
                </div>
                <div className="text-xs text-slate-500">{phase.period}</div>
                <div className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium border ${
                  phase.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                  phase.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                  'bg-slate-500/20 text-slate-400 border-slate-500/30'
                }`}>
                  {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={`${currentPhase.bgColor} ${currentPhase.borderColor} border rounded-2xl p-8 transition-all`}>
        <div className="flex items-start gap-4 mb-6">
          <div className={`${currentPhase.bgColor} ${currentPhase.borderColor} ${currentPhase.color} border-2 p-3 rounded-xl`}>
            {currentPhase.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2">
              Phase {currentPhase.id}: {currentPhase.title}
            </h3>
            <p className="text-slate-300">{currentPhase.description}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <DollarSign className={`w-5 h-5 ${currentPhase.color}`} />
              Reward Mechanisms
            </h4>
            <ul className="space-y-2">
              {currentPhase.mechanisms.map((mechanism, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className={`w-4 h-4 ${currentPhase.color} flex-shrink-0 mt-0.5`} />
                  <span>{mechanism}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <Zap className={`w-5 h-5 ${currentPhase.color}`} />
              Key Highlights
            </h4>
            <ul className="space-y-2">
              {currentPhase.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className={`w-4 h-4 ${currentPhase.color} flex-shrink-0 mt-0.5`} />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white mb-2">Why This 3-Phase Model?</h4>
            <p className="text-sm text-slate-300 mb-3">
              The phased approach balances immediate user incentives with long-term sustainability.
              Phase 1 attracts early users with guaranteed rewards. Phase 2 tests and validates
              revenue sustainability. Phase 3 ensures the system works indefinitely without token emissions.
            </p>
            <p className="text-sm text-slate-400 italic">
              This model is honest, transparent, and designed to last decades—not just months.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
