import { useState } from 'react';
import { Info } from 'lucide-react';

interface AllocationSegment {
  label: string;
  percentage: number;
  amount: number;
  color: string;
  description: string;
}

export function TokenAllocationPie() {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  const totalSupply = 100_000_000;

  const allocations: AllocationSegment[] = [
    {
      label: 'Airdrop',
      percentage: 33,
      amount: 33_000_000,
      color: 'from-cyan-500 to-cyan-600',
      description: 'Community airdrop for early supporters and contributors',
    },
    {
      label: 'Use-to-Earn',
      percentage: 22,
      amount: 22_000_000,
      color: 'from-green-500 to-green-600',
      description: 'Ongoing rewards for platform usage across all businesses',
    },
    {
      label: 'Staking Rewards',
      percentage: 15,
      amount: 15_000_000,
      color: 'from-purple-500 to-purple-600',
      description: 'Years 1-4 staking pool, then 15% of monthly profit',
    },
    {
      label: 'Treasury',
      percentage: 12,
      amount: 12_000_000,
      color: 'from-blue-500 to-blue-600',
      description: 'DAO-controlled treasury for ecosystem development',
    },
    {
      label: 'Team',
      percentage: 7,
      amount: 7_000_000,
      color: 'from-orange-500 to-orange-600',
      description: '36-month linear vesting, NO CLIFF',
    },
    {
      label: 'Advisors',
      percentage: 4,
      amount: 4_000_000,
      color: 'from-yellow-500 to-yellow-600',
      description: '12-month linear vesting, NO CLIFF',
    },
    {
      label: 'Liquidity',
      percentage: 4,
      amount: 4_000_000,
      color: 'from-pink-500 to-pink-600',
      description: 'Multi-chain DEX liquidity pools',
    },
    {
      label: 'Investors',
      percentage: 3,
      amount: 3_000_000,
      color: 'from-red-500 to-red-600',
      description: 'NO VESTING (immediate unlock, publicly labeled wallets)',
    },
  ];

  const calculateSegmentPath = (startAngle: number, endAngle: number) => {
    const centerX = 200;
    const centerY = 200;
    const radius = 150;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  let currentAngle = -90;

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-2xl font-bold text-white">Token Allocation</h3>
        <Info className="w-5 h-5 text-slate-400" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="relative">
          <svg viewBox="0 0 400 400" className="w-full max-w-md mx-auto">
            {allocations.map((segment, index) => {
              const startAngle = currentAngle;
              const endAngle = currentAngle + (segment.percentage / 100) * 360;
              currentAngle = endAngle;

              const isHovered = hoveredSegment === index;
              const scale = isHovered ? 1.05 : 1;

              return (
                <g
                  key={segment.label}
                  onMouseEnter={() => setHoveredSegment(index)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  style={{
                    cursor: 'pointer',
                    transform: `scale(${scale})`,
                    transformOrigin: '200px 200px',
                    transition: 'transform 0.2s',
                  }}
                >
                  <path
                    d={calculateSegmentPath(startAngle, endAngle)}
                    className={`bg-gradient-to-br ${segment.color}`}
                    fill={`url(#gradient-${index})`}
                    stroke="rgb(15, 23, 42)"
                    strokeWidth="2"
                  />
                  <defs>
                    <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={segment.color.split(' ')[0].replace('from-', '')} />
                      <stop offset="100%" stopColor={segment.color.split(' ')[2].replace('to-', '')} />
                    </linearGradient>
                  </defs>
                </g>
              );
            })}

            <circle cx="200" cy="200" r="70" fill="rgb(15, 23, 42)" />
            <text
              x="200"
              y="190"
              textAnchor="middle"
              className="text-2xl font-bold fill-white"
            >
              100M
            </text>
            <text
              x="200"
              y="215"
              textAnchor="middle"
              className="text-sm fill-slate-400"
            >
              Total Supply
            </text>
          </svg>
        </div>

        <div className="space-y-3">
          {allocations.map((segment, index) => (
            <div
              key={segment.label}
              onMouseEnter={() => setHoveredSegment(index)}
              onMouseLeave={() => setHoveredSegment(null)}
              className={`p-4 rounded-lg transition-all cursor-pointer ${
                hoveredSegment === index
                  ? 'bg-slate-700/70 scale-105'
                  : 'bg-slate-800/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full bg-gradient-to-br ${segment.color}`}
                  />
                  <span className="font-semibold text-white">{segment.label}</span>
                </div>
                <span className="text-cyan-400 font-bold">{segment.percentage}%</span>
              </div>
              <div className="ml-7 space-y-1">
                <p className="text-sm text-slate-300">
                  {segment.amount.toLocaleString()} AAIC
                </p>
                {hoveredSegment === index && (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {segment.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-cyan-400">100M</div>
            <div className="text-sm text-slate-400">Max Supply</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">55M</div>
            <div className="text-sm text-slate-400">Community (Airdrop + U2E)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">15M</div>
            <div className="text-sm text-slate-400">Staking Pool Y1-4</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">12M</div>
            <div className="text-sm text-slate-400">DAO Treasury</div>
          </div>
        </div>
      </div>
    </div>
  );
}
