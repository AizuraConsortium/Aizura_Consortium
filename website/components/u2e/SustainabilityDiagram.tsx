import { useState } from 'react';
import {
  Cpu,
  DollarSign,
  Users,
  TrendingUp,
  Repeat,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export function SustainabilityDiagram() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const flowSteps = [
    {
      id: 1,
      icon: <Users className="w-6 h-6" />,
      title: 'Users Use Service',
      description: 'Real customers use AI-powered platforms for genuine value',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      icon: <Cpu className="w-6 h-6" />,
      title: 'AI Reduces Costs',
      description: 'AI automation achieves 90% cost reduction vs traditional ops',
      color: 'from-cyan-500 to-green-500'
    },
    {
      id: 3,
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Business Profits',
      description: 'Low costs + real revenue = sustainable profit margins',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 4,
      icon: <Zap className="w-6 h-6" />,
      title: 'Rewards Distributed',
      description: 'Portion of profits funds user rewards via token buybacks',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 5,
      icon: <Repeat className="w-6 h-6" />,
      title: 'Cycle Repeats',
      description: 'Sustainable loop continues indefinitely',
      color: 'from-teal-500 to-blue-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Sustainable model */}
      <div>
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-3">How U2E Stays Sustainable</h3>
          <p className="text-slate-300 max-w-2xl mx-auto">
            AI cost reduction creates profit margins that enable perpetual rewards
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 md:p-8">
          <div className="grid md:grid-cols-5 gap-4 md:gap-2">
            {flowSteps.map((step, index) => (
              <div key={step.id} className="relative">
                <div
                  className={`group cursor-pointer ${
                    activeStep === step.id ? 'scale-105' : ''
                  } transition-transform`}
                  onMouseEnter={() => setActiveStep(step.id)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  {/* Step card */}
                  <div className={`bg-gradient-to-br ${step.color} p-4 rounded-xl text-center relative ${
                    activeStep === step.id ? 'shadow-xl' : 'opacity-90'
                  }`}>
                    {/* Icon */}
                    <div className="flex justify-center mb-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white">
                        {step.icon}
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-white text-sm mb-2">{step.title}</h4>

                    {/* Step number */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white text-slate-900 rounded-full flex items-center justify-center text-xs font-bold">
                      {step.id}
                    </div>
                  </div>

                  {/* Description (shows on hover) */}
                  <div className={`mt-4 text-sm text-slate-300 text-center transition-opacity ${
                    activeStep === step.id ? 'opacity-100' : 'opacity-0 md:opacity-70'
                  }`}>
                    {step.description}
                  </div>
                </div>

                {/* Arrow (desktop only) */}
                {index < flowSteps.length - 1 && (
                  <div className="hidden md:flex absolute top-10 -right-4 z-10 items-center justify-center">
                    <div className="text-cyan-400">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path
                          d="M4 16H28M28 16L20 8M28 16L20 24"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison: Sustainable vs Unsustainable */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Unsustainable (Play-to-Earn) */}
        <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <h4 className="text-lg font-bold text-white">Unsustainable (Play-to-Earn)</h4>
          </div>

          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">✗</span>
              <span className="text-slate-300">
                <strong>No real revenue</strong> - only token sales fund rewards
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">✗</span>
              <span className="text-slate-300">
                <strong>Token price collapse</strong> - rewards become worthless
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">✗</span>
              <span className="text-slate-300">
                <strong>Death spiral</strong> - when rewards end, users leave
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">✗</span>
              <span className="text-slate-300">
                <strong>Limited lifespan</strong> - 6-18 months typical
              </span>
            </li>
          </ul>

          <div className="mt-4 pt-4 border-t border-red-500/20">
            <p className="text-xs text-slate-400">
              Examples: Axie Infinity ($3B → $41M), StepN collapsed in 3 months
            </p>
          </div>
        </div>

        {/* Sustainable (Aizura U2E) */}
        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <h4 className="text-lg font-bold text-white">Sustainable (Aizura U2E)</h4>
          </div>

          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span className="text-slate-300">
                <strong>Real business revenue</strong> - actual paying customers
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span className="text-slate-300">
                <strong>AI cost advantage</strong> - 90% savings enable rewards
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span className="text-slate-300">
                <strong>Self-reinforcing</strong> - more users = more revenue = better rewards
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span className="text-slate-300">
                <strong>Infinite lifespan</strong> - works as long as businesses profit
              </span>
            </li>
          </ul>

          <div className="mt-4 pt-4 border-t border-green-500/20">
            <p className="text-xs text-slate-400">
              Revenue-backed model can sustain indefinitely
            </p>
          </div>
        </div>
      </div>

      {/* Key differentiator */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <TrendingUp className="w-6 h-6 text-cyan-400" />
          <h4 className="text-lg font-bold text-white">The AI Advantage</h4>
        </div>
        <p className="text-slate-300 text-sm max-w-3xl mx-auto">
          Traditional businesses can't share 10-20% of revenue as rewards because margins are too thin.
          But AI automation reduces operational costs by 90%, creating profit margins that enable
          sustainable reward sharing without sacrificing business viability.
        </p>
      </div>
    </div>
  );
}
