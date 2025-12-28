import { Check, Clock } from 'lucide-react';

interface Chain {
  name: string;
  logo: string;
  phase: 'v1' | 'v2';
  status: 'live' | 'coming';
}

export function CrossChainTimeline() {
  const chains: Chain[] = [
    { name: 'BNB Chain', logo: '🔶', phase: 'v1', status: 'live' },
    { name: 'Base', logo: '🔵', phase: 'v1', status: 'live' },
    { name: 'Avalanche', logo: '🔺', phase: 'v1', status: 'live' },
    { name: 'Sui', logo: '💧', phase: 'v1', status: 'live' },
    { name: 'Hyperliquid', logo: '⚡', phase: 'v1', status: 'live' },
    { name: 'Optimism', logo: '🔴', phase: 'v2', status: 'coming' },
    { name: 'Fantom', logo: '👻', phase: 'v2', status: 'coming' },
    { name: 'Solana', logo: '🟣', phase: 'v2', status: 'coming' },
  ];

  const v1Chains = chains.filter(c => c.phase === 'v1');
  const v2Chains = chains.filter(c => c.phase === 'v2');

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
      <h3 className="text-2xl font-bold text-white mb-2">Cross-Chain Deployment Timeline</h3>
      <p className="text-slate-400 mb-8">
        AAIC will launch on multiple chains via Axelar bridges, maintaining a fixed 100M supply across all networks.
      </p>

      <div className="space-y-8">
        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Phase V1: Pre-Airdrop Launch</h4>
              <p className="text-sm text-slate-400">Q1 2025 - Before token distribution</p>
            </div>
          </div>

          <div className="ml-6 pl-6 border-l-2 border-cyan-500/30">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
              {v1Chains.map((chain, index) => (
                <div
                  key={chain.name}
                  className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/30 rounded-lg p-4 hover:border-cyan-500/60 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{chain.logo}</span>
                      <div>
                        <h5 className="font-bold text-white">{chain.name}</h5>
                        {index === 0 && (
                          <p className="text-xs text-cyan-400">Canonical</p>
                        )}
                      </div>
                    </div>
                    <Check className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>Ready for Launch</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-8">
              <h5 className="font-bold text-white mb-2">V1 Features</h5>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>• Axelar ITS bridge integration</li>
                <li>• Lock/unlock mechanism from BNB Chain</li>
                <li>• All governance happens on BNB Chain</li>
                <li>• Shared 100M supply across all chains</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Phase V2: Expansion</h4>
              <p className="text-sm text-slate-400">Q4 2026 - Additional chain support</p>
            </div>
          </div>

          <div className="ml-6 pl-6 border-l-2 border-purple-500/30">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
              {v2Chains.map((chain) => (
                <div
                  key={chain.name}
                  className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 border border-slate-600 rounded-lg p-4 opacity-75"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl opacity-50">{chain.logo}</span>
                      <div>
                        <h5 className="font-bold text-white">{chain.name}</h5>
                      </div>
                    </div>
                    <Clock className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-2 h-2 bg-slate-400 rounded-full" />
                    <span>Coming Late 2026</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h5 className="font-bold text-white mb-2">V2 Additions</h5>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>• Expanded DeFi ecosystem integration</li>
                <li>• Additional liquidity pools and trading venues</li>
                <li>• Broader user base and accessibility</li>
                <li>• Same bridge security and supply controls</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-slate-700">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="text-3xl font-bold text-cyan-400 mb-2">8</div>
            <div className="text-sm text-slate-400">Total Chains</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="text-3xl font-bold text-green-400 mb-2">5</div>
            <div className="text-sm text-slate-400">V1 Launch Chains</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="text-3xl font-bold text-blue-400 mb-2">100M</div>
            <div className="text-sm text-slate-400">Fixed Supply (All Chains)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
