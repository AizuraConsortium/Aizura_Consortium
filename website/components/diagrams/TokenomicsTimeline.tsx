import { useState } from 'react';
import { Calendar, TrendingUp, Flame, Lock, Unlock, Clock } from 'lucide-react';

export function TokenomicsTimeline() {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  const phases = [
    {
      id: 0,
      label: 'Genesis',
      timeframe: 'Month 0',
      supply: 16_000_000,
      description: 'Initial token distribution',
      details: [
        '8M AAIC Airdrop (immediate unlock)',
        '8M AAIC Investors (immediate unlock)',
        'Initial liquidity provision',
        'Launch on exchanges',
      ],
      color: 'from-cyan-500 to-blue-500',
      borderColor: 'border-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      id: 1,
      label: 'Year 1',
      timeframe: 'Months 1-12',
      supply: 47_000_000,
      description: 'Aggressive growth phase',
      details: [
        '31M AAIC emissions',
        '21M U2E rewards (458K/month)',
        '10M Team & Advisors vesting',
        'Foundation businesses launch',
      ],
      color: 'from-blue-500 to-green-500',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      id: 2,
      label: 'Year 2',
      timeframe: 'Months 13-24',
      supply: 61_000_000,
      description: 'Stabilization phase',
      details: [
        '14M AAIC emissions',
        '5.5M U2E rewards (458K/month)',
        '5.5M Team & Advisors vesting',
        '3M TreasuryVault vesting',
        'Ecosystem expansion',
      ],
      color: 'from-green-500 to-yellow-500',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      id: 3,
      label: 'Year 3',
      timeframe: 'Months 25-36',
      supply: 75_000_000,
      description: 'Maturity phase',
      details: [
        '14M AAIC emissions',
        '5.5M U2E rewards (458K/month)',
        '5.5M Team & Advisors vesting',
        '3M TreasuryVault vesting',
        'Revenue generation begins',
      ],
      color: 'from-yellow-500 to-orange-500',
      borderColor: 'border-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      id: 4,
      label: 'Year 4',
      timeframe: 'Months 37-48',
      supply: 81_000_000,
      description: 'Transition to sustainability',
      details: [
        '6M AAIC emissions',
        '5.5M U2E rewards (458K/month)',
        '0.5M Team & Advisors vesting (final)',
        'Peak supply reached',
        'Prepare for burn phase',
      ],
      color: 'from-orange-500 to-red-500',
      borderColor: 'border-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      id: 5,
      label: 'Post-Year 4',
      timeframe: 'Month 49+',
      supply: 81_000_000,
      description: 'Revenue-backed deflationary model',
      details: [
        'No new emissions',
        'U2E funded by 20% revenue',
        '15% revenue allocated to burns',
        '15% revenue for buybacks',
        'Gradual supply reduction to 21M',
      ],
      color: 'from-red-500 to-pink-500',
      borderColor: 'border-red-500',
      bgColor: 'bg-red-500/10',
    },
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-6 h-6 text-cyan-400" />
        <h3 className="text-2xl font-bold text-white">Tokenomics Timeline</h3>
      </div>
      <p className="text-slate-400 mb-8">
        Interactive timeline showing emission phases, vesting schedules, and the transition to revenue-backed model
      </p>

      <div className="space-y-6 mb-8">
        {phases.map((phase, idx) => (
          <div key={phase.id}>
            <button
              onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
              className={`w-full text-left transition-all ${
                selectedPhase === phase.id ? 'scale-[1.02]' : ''
              }`}
            >
              <div
                className={`bg-slate-700/30 border-2 ${phase.borderColor} rounded-xl p-6 hover:bg-slate-700/50 transition-colors`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${phase.color} rounded-lg flex items-center justify-center`}
                    >
                      {phase.id === 5 ? (
                        <Flame className="w-6 h-6 text-white" />
                      ) : phase.id === 0 ? (
                        <Unlock className="w-6 h-6 text-white" />
                      ) : (
                        <Clock className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">{phase.label}</h4>
                      <p className="text-sm text-slate-400">{phase.timeframe}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-400">
                      {(phase.supply / 1_000_000).toFixed(0)}M
                    </div>
                    <div className="text-xs text-slate-500">
                      {phase.id === 5 ? 'starts at' : 'cumulative'}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-300 mb-3">{phase.description}</p>

                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${phase.color} transition-all`}
                    style={{ width: phase.id === 5 ? '100%' : `${(phase.supply / 81_000_000) * 100}%` }}
                  />
                </div>
              </div>
            </button>

            {selectedPhase === phase.id && (
              <div className={`mt-4 ${phase.bgColor} border ${phase.borderColor} rounded-lg p-6`}>
                <h5 className="font-bold text-white mb-3">Phase Details</h5>
                <ul className="space-y-2">
                  {phase.details.map((detail, detailIdx) => (
                    <li key={detailIdx} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {idx < phases.length - 1 && (
              <div className="flex justify-center py-2">
                <div className="h-8 w-0.5 bg-gradient-to-b from-slate-600 to-transparent" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-cyan-500">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <div className="text-sm text-slate-400">Emission Phase</div>
          </div>
          <div className="text-xl font-bold text-white">Years 0-4</div>
          <div className="text-xs text-slate-500 mt-1">Growing supply to 81M</div>
        </div>

        <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-orange-500">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <div className="text-sm text-slate-400">Burn Phase</div>
          </div>
          <div className="text-xl font-bold text-white">Post-Year 4</div>
          <div className="text-xs text-slate-500 mt-1">Reducing to 21M target</div>
        </div>

        <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-green-400" />
            <div className="text-sm text-slate-400">Vesting</div>
          </div>
          <div className="text-xl font-bold text-white">Ongoing</div>
          <div className="text-xs text-slate-500 mt-1">Team & Treasury unlock</div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h5 className="font-bold text-white mb-2">Timeline Key Points</h5>
        <ul className="space-y-1 text-sm text-slate-300">
          <li>• Years 0-1: Rapid growth to incentivize early adoption and ecosystem building</li>
          <li>• Years 2-4: Gradual emission slowdown as ecosystem matures</li>
          <li>• Post-Year 4: Revenue-backed model eliminates new emissions</li>
          <li>• Ongoing burns funded by 15% of portfolio profits until 21M supply reached</li>
          <li>• Click on any phase above to see detailed breakdown</li>
        </ul>
      </div>
    </div>
  );
}
