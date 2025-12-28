import { GitBranch, Users, Clock, Shield, Zap } from 'lucide-react';

export function GovernanceTree() {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-6 h-6 text-cyan-400" />
        <h3 className="text-2xl font-bold text-white">Governance Decision Tree</h3>
      </div>
      <p className="text-slate-400 mb-8">
        Choose the right governance path based on your proposal type
      </p>

      <div className="space-y-8">
        <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border-2 border-cyan-500/50 rounded-xl p-6 text-center">
          <h4 className="text-2xl font-bold text-white mb-2">
            What type of proposal do you have?
          </h4>
          <p className="text-slate-300">Choose your governance path below</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-2 border-blue-500 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white">DAO Governance</h4>
              </div>

              <p className="text-slate-300 mb-6">
                For ecosystem-wide changes affecting all token holders
              </p>

              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h5 className="font-bold text-white mb-3">Requirements</h5>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                      <span><strong className="text-white">50,000 AAIC</strong> minimum to propose</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                      <span><strong className="text-white">14 days</strong> voting period</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                      <span><strong className="text-white">20% quorum</strong> required</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                      <span><strong className="text-white">Simple majority</strong> to pass</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h5 className="font-bold text-white mb-3">Use Cases</h5>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>Tokenomics changes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>Revenue distribution adjustments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>Treasury fund allocation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>Governance parameter changes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>Protocol upgrades</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-sm text-slate-300">
                    <strong className="text-white">Higher stakes, longer timeframe.</strong> For critical decisions
                    requiring broad community consensus.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-2 border-green-500 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-500 rounded-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white">Launchpad</h4>
              </div>

              <p className="text-slate-300 mb-6">
                For new business proposals to be built by AI consortium
              </p>

              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h5 className="font-bold text-white mb-3">Requirements</h5>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span><strong className="text-white">1,000 AAIC</strong> deposit (refundable)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span><strong className="text-white">7 days</strong> voting period</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span><strong className="text-white">5% quorum</strong> required</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span><strong className="text-white">Simple majority</strong> to pass</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h5 className="font-bold text-white mb-3">Use Cases</h5>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>New AI-driven business ideas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>SaaS platform proposals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>DeFi protocol launches</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Market expansion proposals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Product feature additions</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-sm text-slate-300">
                    <strong className="text-white">Lower barrier, faster execution.</strong> Designed for rapid
                    iteration and business experimentation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600 rounded-xl p-6">
          <h4 className="font-bold text-white mb-4">Decision Helper</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold mb-1">
                  Choose DAO Governance if:
                </p>
                <p className="text-sm text-slate-300">
                  Your proposal affects core protocol mechanics, tokenomics, treasury allocation, or requires
                  high-stakes community consensus.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold mb-1">
                  Choose Launchpad if:
                </p>
                <p className="text-sm text-slate-300">
                  You want to propose a new business idea, product, or service that the AI consortium should
                  build and operate.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-700/30 rounded-xl p-6">
            <h5 className="font-bold text-white mb-3">Both Paths Include</h5>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Transparent on-chain voting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Community discussion period</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Automatic execution if approved</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Voting rewards for participants</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-700/30 rounded-xl p-6">
            <h5 className="font-bold text-white mb-3">Voting Power</h5>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>1 AAIC = 1 vote (base power)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Staked tokens get boosted power</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Winning-side voters earn multipliers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Delegation supported</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
