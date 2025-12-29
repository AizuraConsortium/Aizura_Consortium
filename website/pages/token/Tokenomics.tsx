import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Shield, TrendingUp, Lock, Coins, Users, BarChart3, Flame, DollarSign,
  CheckCircle2, AlertTriangle, Eye, Target, Zap, ArrowRight, Clock, Sparkles
} from 'lucide-react';

export default function Tokenomics() {
  return (
    <PageLayout>
      <div className="space-y-20">
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Sustainable Economics
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            A sustainable,{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              revenue-backed
            </span>{' '}
            token economy
          </h1>

          <div className="space-y-4 text-lg text-slate-300 max-w-3xl mx-auto mb-8">
            <p>
              <span className="font-semibold text-white">Autonomous AI Consortium (AAIC)</span> is not a hype token, a one-time sale, or a perpetual inflation machine.
            </p>
            <p className="text-cyan-400 font-medium">
              It's a BEP-20 productive asset backed by AI-run businesses, designed for long-term sustainability.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <PrincipleCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              text="No public token sale"
              positive
            />
            <PrincipleCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              text="Fixed max supply"
              positive
            />
            <PrincipleCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              text="Revenue-backed rewards"
              positive
            />
            <PrincipleCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              text="Transparent governance"
              positive
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Core Principles</h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <CorePrinciple
              title="Airdrop + Usage Distribution"
              description="No token sale. Initial distribution via airdrop and usage-based rewards to real participants."
            />
            <CorePrinciple
              title="Bootstrap Inflation"
              description="Early inflation for 4 years to bootstrap participation, then pure revenue-backed rewards."
            />
            <CorePrinciple
              title="Real Revenue Backing"
              description="Long-term rewards funded by actual business revenues, not endless token printing."
            />
            <CorePrinciple
              title="Governed Sustainability"
              description="Governance can adjust parameters but cannot break sustainability rules or mint beyond cap."
            />
          </div>
        </section>

        <section className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Revenue-Backed Economics: Why AI Changes Everything
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-3xl mx-auto text-lg">
            AAIC token value is backed by real AI business revenues. Here's the economic foundation that makes this possible:
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-400" />
                Traditional Business Economics
              </h3>
              <div className="space-y-3 text-slate-300 text-sm">
                <p><strong className="text-white">Fixed Costs:</strong> $500K-$900K/year</p>
                <p><strong className="text-white">Problem:</strong> High burn rate forces rushed decisions and frequent fundraising</p>
                <p><strong className="text-white">Result:</strong> Most fail before finding product-market fit</p>
              </div>
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-xs text-slate-300">
                  Token rewards require either dilution or unsustainable spending
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-cyan-400" />
                AI-Native Business Economics
              </h3>
              <div className="space-y-3 text-slate-300 text-sm">
                <p><strong className="text-white">Fixed Costs:</strong> $18K-$65K/year (90% reduction)</p>
                <p><strong className="text-white">Advantage:</strong> Minimal burn = extended runway and 10x more experiments</p>
                <p><strong className="text-white">Result:</strong> Failed businesses cost little. Successful ones scale infinitely.</p>
              </div>
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-xs text-slate-300">
                  Real profit margins fund sustainable rewards without dilution
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 max-w-4xl mx-auto text-center">
            <p className="text-lg text-slate-300">
              <strong className="text-white">This cost advantage is the entire economic model.</strong> AI doesn't just
              improve margins — it fundamentally inverts the risk/reward profile, making sustainable, revenue-backed
              token rewards economically viable.
            </p>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Token Specifications</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Coins className="w-6 h-6 text-cyan-400" />
                Token Identity
              </h3>
              <div className="space-y-3">
                <ParameterRow label="Name" value="Autonomous AI Consortium" />
                <ParameterRow label="Symbol" value="AAIC" />
                <ParameterRow label="Standard" value="BEP-20 (EVM ERC-20 compatible)" />
                <ParameterRow label="Decimals" value="18" />
                <ParameterRow label="Canonical Chain" value="BNB Chain" highlight />
                <ParameterRow label="Max Supply" value="100,000,000 AAIC" highlight />
                <ParameterRow label="Initial Circulation" value="~16M AAIC (16%)" sublabel="Airdrop 8M + Investors 8M" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Core Characteristics</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white mb-1">Minting</div>
                      One-time mint at deployment → permanently disabled
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white mb-1">Transfers</div>
                      Enabled at launch
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white mb-1">Burning</div>
                      Enabled (irreversible, target: 21M AAIC burned)
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <h4 className="text-sm font-bold text-white mb-2">Why BEP-20?</h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  <li className="flex items-start gap-1">
                    <span className="text-cyan-400">•</span>
                    <span>Battle-tested, universally supported</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-cyan-400">•</span>
                    <span>Native Axelar ITS compatibility for cross-chain</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-cyan-400">•</span>
                    <span>Full governance framework support (OpenZeppelin)</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-cyan-400">•</span>
                    <span>DEX/CEX integration ready</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Strategy</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-white text-sm mb-1">Canonical Chain: BNB Chain</div>
                  <p className="text-xs text-slate-400">Governance + treasury + voting execution</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-white text-sm mb-1">Supply Minted Once</div>
                  <p className="text-xs text-slate-400">Immutable, no future minting</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-white text-sm mb-1">Cross-Chain via Axelar</div>
                  <p className="text-xs text-slate-400">Representations only, never source-of-truth</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Supply & Distribution</h2>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Global Parameters</h3>
              <div className="space-y-4">
                <ParameterRow label="Token Name" value="Autonomous AI Consortium" sublabel="Symbol: AAIC" />
                <ParameterRow label="Max Supply" value="100,000,000" sublabel="Fixed Hard Cap" highlight />
                <ParameterRow label="Initial Circulation" value="~16%" sublabel="~16,000,000 AAIC" />
              </div>

              <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="text-sm text-slate-300">
                  <span className="font-bold text-cyan-400">Why 16% initial?</span> Airdrop (8M unlocked) + Early Investors (8M immediate) provides initial liquidity for governance while maintaining strong token value alignment.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Token Allocation (100M Total)</h3>
              <div className="space-y-3">
                <AllocationBar label="Use-to-Earn Pool (4 years)" percent={22} tokens="22M" color="cyan" />
                <AllocationBar label="Team" percent={16} tokens="16M" color="purple" />
                <AllocationBar label="Staking Rewards Pool (4 years)" percent={15} tokens="15M" color="green" />
                <AllocationBar label="Treasury Reserve" percent={15} tokens="15M" color="blue" />
                <AllocationBar label="Airdrop" percent={8} tokens="8M" color="yellow" />
                <AllocationBar label="Early / Private Investors" percent={8} tokens="8M" color="orange" />
                <AllocationBar label="Market Ops / CEX Readiness" percent={7} tokens="7M" color="pink" />
                <AllocationBar label="Liquidity Provisioning" percent={6} tokens="6M" color="cyan" />
                <AllocationBar label="Advisors / Strategic Contributors" percent={3} tokens="3M" color="yellow" />
              </div>

              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-yellow-400 mb-1">Investor Protection Note</p>
                    <p className="text-xs text-slate-300">
                      While early investors have no enforced vesting, wallets are labeled publicly for transparency. Voluntary lock options available through vesting vault contracts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-8 lg:p-12 mt-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Target className="w-7 h-7 text-blue-400" />
              Deploy-Time Token Distribution (Exact Recipients)
            </h3>
            <p className="text-slate-300 mb-8 max-w-3xl">
              At deployment, tokens are distributed to smart contract vaults and wallets according to this exact allocation:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h4 className="font-bold text-cyan-400 mb-4">Smart Contract Vaults</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-white font-semibold">TreasuryVault</span>
                      <span className="text-cyan-400 font-bold">28,000,000</span>
                    </div>
                    <p className="text-xs text-slate-400">Treasury 15M + Liquidity 6M + MarketOps 7M</p>
                  </div>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-white font-semibold">UseToEarnRewardsVault</span>
                      <span className="text-cyan-400 font-bold">22,000,000</span>
                    </div>
                    <p className="text-xs text-slate-400">48 months = 458,333 AAIC/month</p>
                  </div>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-white font-semibold">StakingRewardsVault</span>
                      <span className="text-cyan-400 font-bold">15,000,000</span>
                    </div>
                    <div className="text-xs text-slate-400 space-y-1 ml-4">
                      <div className="flex justify-between">
                        <span>Year 1: 4,500,000</span>
                        <span className="text-slate-500">(375k/month)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Year 2: 3,750,000</span>
                        <span className="text-slate-500">(313k/month)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Year 3: 3,750,000</span>
                        <span className="text-slate-500">(313k/month)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Year 4: 3,000,000</span>
                        <span className="text-slate-500">(250k/month)</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-white font-semibold">MerkleAirdropDistributor</span>
                      <span className="text-cyan-400 font-bold">8,000,000</span>
                    </div>
                    <p className="text-xs text-slate-400">100% unlocked at claim</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h4 className="font-bold text-yellow-400 mb-4">Team & Contributor Vaults</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-white font-semibold">TeamVestingVault</span>
                      <span className="text-yellow-400 font-bold">16,000,000</span>
                    </div>
                    <p className="text-xs text-slate-400">4 wallets, 36 months linear vesting</p>
                  </div>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-white font-semibold">AdvisorVestingVault</span>
                      <span className="text-yellow-400 font-bold">3,000,000</span>
                    </div>
                    <p className="text-xs text-slate-400">12 months linear vesting</p>
                  </div>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-white font-semibold">Investor Wallets</span>
                      <span className="text-orange-400 font-bold">8,000,000</span>
                    </div>
                    <p className="text-xs text-slate-400">No vesting - immediate</p>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-xs text-slate-300">
                    <span className="font-bold text-green-400">Total Accounted:</span> 100,000,000 AAIC
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 lg:p-12 mt-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="w-7 h-7 text-cyan-400" />
              Multi-Chain Presence
            </h3>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
                    V1 LAUNCH
                  </div>
                  <span className="text-sm text-slate-400">Pre-Airdrop</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">BNB Chain</div>
                      <p className="text-xs text-slate-400">Canonical (source of truth, governance, treasury)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Base</div>
                      <p className="text-xs text-slate-400">Retail + builder adoption</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Avalanche</div>
                      <p className="text-xs text-slate-400">DeFi liquidity depth, institutional capital</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Sui</div>
                      <p className="text-xs text-slate-400">Next-gen / parallel execution narrative</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Hyperliquid</div>
                      <p className="text-xs text-slate-400">Trader-heavy audience (AI Traders integration)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-bold">
                    V2 EXPANSION
                  </div>
                  <span className="text-sm text-slate-400">Late 2026</span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 p-3 bg-slate-800/30 border border-slate-600 rounded-lg opacity-70">
                    <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Optimism</div>
                      <p className="text-xs text-slate-400">Ethereum alignment, governance & public goods</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-800/30 border border-slate-600 rounded-lg opacity-70">
                    <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Fantom</div>
                      <p className="text-xs text-slate-400">DeFi-native users, cheap execution</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-800/30 border border-slate-600 rounded-lg opacity-70">
                    <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Solana</div>
                      <p className="text-xs text-slate-400">High-performance, retail-friendly</p>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-white mb-2">Why This V1 Set?</h4>
                  <ul className="space-y-1 text-xs text-slate-300">
                    <li className="flex items-start gap-1">
                      <span className="text-cyan-400">•</span>
                      <span>Small (5 chains) → manageable security</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-cyan-400">•</span>
                      <span>Diverse narratives (execution, adoption, capital, future tech, traders)</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-cyan-400">•</span>
                      <span>No liquidity fragmentation</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-cyan-400">•</span>
                      <span>Easy to explain</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-cyan-400">•</span>
                      <span>Ahead of 95% of projects</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-slate-300">
                    <span className="font-bold text-white">Cross-Chain Architecture:</span> All non-BNB chains use Axelar representations. BNB Chain remains the sole governance chain through 2026. Cross-chain governance is optional for late 2026 consideration.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock className="w-6 h-6 text-yellow-400" />
              Vesting & Lockups
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <VestingCard
                title="Team (16%)"
                items={['36 months linear vesting', 'No cliff', 'Total: 16,000,000 AAIC']}
              />
              <VestingCard
                title="Advisors (3%)"
                items={['12 months linear vesting', 'No cliff', 'Total: 3,000,000 AAIC']}
              />
              <VestingCard
                title="Early / Private Investors (8%)"
                items={['No vesting - Immediate unlocking', 'Public wallet labeling for transparency', 'Total: 8,000,000 AAIC']}
              />
              <VestingCard
                title="Treasury (15%)"
                items={['Fully locked', 'Usage only via governance vote', 'Total: 15,000,000 AAIC']}
              />
              <VestingCard
                title="Airdrop (8%)"
                items={['No lockup', '100% unlocked at claim', 'Total: 8,000,000 AAIC']}
              />
              <VestingCard
                title="U2E + Staking Pools (37%)"
                items={['Emissions over 4 years', 'Smart contract controlled', 'Total: 37,000,000 AAIC']}
              />
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <Zap className="w-8 h-8 text-cyan-400" />
            Points-Based Use-to-Earn Distribution
          </h2>

          <p className="text-center text-slate-300 mb-10 max-w-3xl mx-auto">
            Users earn points for actions across ecosystem platforms. Monthly AAIC distribution is based on your share of total points earned.
          </p>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Core Formula</h3>
            <div className="bg-slate-900/50 rounded-lg p-6 mb-6">
              <div className="text-center space-y-4">
                <div className="text-2xl font-mono text-cyan-400">
                  User Reward = (User Points / Total Points) × Monthly U2E Budget
                </div>
                <div className="text-lg text-slate-400">
                  Monthly U2E Budget: <span className="text-white font-bold">458,333 AAIC</span> (22M over 48 months)
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-6">
              <h4 className="font-bold text-white mb-4">Example Calculation</h4>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Monthly budget:</span>
                    <span className="font-mono text-white">458,333 AAIC</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Total points issued:</span>
                    <span className="font-mono text-white">1,000,000,000</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Your points earned:</span>
                    <span className="font-mono text-cyan-400">10,000,000</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Your share:</span>
                    <span className="font-mono text-cyan-400">1% of total</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300 pt-2 border-t border-slate-700">
                    <span className="font-bold text-white">Your reward:</span>
                    <span className="font-mono text-2xl text-green-400">4,583 AAIC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Why Points vs Fixed Rates?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white text-sm">Scales Infinitely</div>
                    <p className="text-xs text-slate-400">Works even with 10M users</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white text-sm">Fair Relative Rewards</div>
                    <p className="text-xs text-slate-400">Regardless of participation level</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white text-sm">Flexible Action Weighting</div>
                    <p className="text-xs text-slate-400">Adjusted by governance</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white text-sm">Anti-Farm Protections</div>
                    <p className="text-xs text-slate-400">Dynamic caps prevent abuse</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Action Categories (Examples)</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Trading on AI Traders</span>
                  <span className="font-mono text-cyan-400">100 pts/trade</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Business creation</span>
                  <span className="font-mono text-cyan-400">5,000 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Governance voting</span>
                  <span className="font-mono text-cyan-400">500 pts/vote</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Platform usage</span>
                  <span className="font-mono text-cyan-400">Variable</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-xs text-slate-300">
                  <span className="font-bold text-yellow-400">Note:</span> Point values are subject to governance adjustment to maintain balance.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-orange-400" />
              Anti-Abuse Protections
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <div className="font-semibold text-white text-sm mb-1">Hard Caps</div>
                <p className="text-xs text-slate-400">Per action category limits</p>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <div className="font-semibold text-white text-sm mb-1">Point Decay</div>
                <p className="text-xs text-slate-400">On repetitive actions</p>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <div className="font-semibold text-white text-sm mb-1">Daily Maximums</div>
                <p className="text-xs text-slate-400">Per-wallet point caps</p>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <div className="font-semibold text-white text-sm mb-1">Idempotency Keys</div>
                <p className="text-xs text-slate-400">Prevent duplicate claims</p>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <div className="font-semibold text-white text-sm mb-1">Rate Limiting</div>
                <p className="text-xs text-slate-400">Action frequency controls</p>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <div className="font-semibold text-white text-sm mb-1">Anomaly Detection</div>
                <p className="text-xs text-slate-400">AI-powered review system</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/token/u2e-explained"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
            >
              Learn More About U2E
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Staking Rewards - Full Math & Emissions</h2>

          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-2xl p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-6">
                <Coins className="w-8 h-8 text-green-400" />
                <div>
                  <h3 className="text-2xl font-bold text-white">Staking Pool: 15,000,000 AAIC over 48 months</h3>
                  <p className="text-slate-400 text-sm">Tapered emission schedule for sustainable rewards</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Tapered Emission Schedule</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded">
                      <div>
                        <div className="text-white font-semibold">Year 1</div>
                        <div className="text-xs text-slate-400">30% of pool</div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold">4,500,000</div>
                        <div className="text-xs text-slate-500">375k/month</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded">
                      <div>
                        <div className="text-white font-semibold">Year 2</div>
                        <div className="text-xs text-slate-400">25% of pool</div>
                      </div>
                      <div className="text-right">
                        <div className="text-cyan-400 font-bold">3,750,000</div>
                        <div className="text-xs text-slate-500">312.5k/month</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded">
                      <div>
                        <div className="text-white font-semibold">Year 3</div>
                        <div className="text-xs text-slate-400">25% of pool</div>
                      </div>
                      <div className="text-right">
                        <div className="text-cyan-400 font-bold">3,750,000</div>
                        <div className="text-xs text-slate-500">312.5k/month</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded">
                      <div>
                        <div className="text-white font-semibold">Year 4</div>
                        <div className="text-xs text-slate-400">20% of pool</div>
                      </div>
                      <div className="text-right">
                        <div className="text-blue-400 font-bold">3,000,000</div>
                        <div className="text-xs text-slate-500">250k/month</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Combined User Rewards Outflow</h4>
                  <p className="text-sm text-slate-400 mb-4">U2E + Staking combined distribution per month:</p>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                      <div className="text-sm text-slate-300 mb-1">Year 1</div>
                      <div className="text-2xl font-bold text-green-400">833,333 AAIC/month</div>
                      <div className="text-xs text-slate-500">458k U2E + 375k Staking</div>
                    </div>
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                      <div className="text-sm text-slate-300 mb-1">Year 4</div>
                      <div className="text-2xl font-bold text-blue-400">708,333 AAIC/month</div>
                      <div className="text-xs text-slate-500">458k U2E + 250k Staking</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  APY Mathematics (Market-Based)
                </h4>
                <p className="text-sm text-slate-400 mb-4">
                  Annual staking rewards in Year 1 = 4,500,000 AAIC
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="text-xs text-slate-400 mb-1">10M staked</div>
                    <div className="text-xl font-bold text-green-400">≈45% APY</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="text-xs text-slate-400 mb-1">20M staked</div>
                    <div className="text-xl font-bold text-cyan-400">≈22.5% APY</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="text-xs text-slate-400 mb-1">30M staked</div>
                    <div className="text-xl font-bold text-blue-400">≈15% APY</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="text-xs text-slate-400 mb-1">45M staked</div>
                    <div className="text-xl font-bold text-purple-400">≈10% APY</div>
                  </div>
                </div>

                <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg mb-4">
                  <p className="text-sm text-white font-semibold mb-2">Target APY Band: 10-15% with healthy staking participation</p>
                  <p className="text-xs text-slate-400">Market will naturally find equilibrium based on supply and demand</p>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-yellow-400 mb-1">APY is NOT fixed</p>
                      <p className="text-xs text-slate-300">
                        Actual yields depend on: Total tokens staked • Remaining emissions in pool • Time elapsed in emission schedule • Market conditions
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-6 mt-6">
                <h4 className="font-bold text-white mb-3">Why This Works</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Honest math - no promises we can't keep</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Decreases naturally as intended</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Market finds equilibrium APY</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Sustainable through emissions period</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-bold">
                  PHASE 2
                </div>
                <h3 className="text-2xl font-bold text-white">Transition Phase (After Year 4)</h3>
              </div>

              <div className="space-y-4 text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <p>All staking emissions are exhausted</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <p>100% of tokens are in circulation</p>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                  <p className="font-bold text-white">
                    From here: Staking rewards funded ONLY by business revenues, platform fees,
                    and ecosystem profits
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <p className="font-bold text-cyan-400">No new tokens are minted. Ever.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-500/10 to-green-500/10 border border-cyan-500/30 rounded-2xl p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-bold">
                  PHASE 3
                </div>
                <h3 className="text-2xl font-bold text-white">Revenue-Backed Dynamic APY (Forever)</h3>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
                <h4 className="font-bold text-white mb-3">Dynamic APY Formula</h4>
                <div className="bg-slate-900/50 rounded-lg p-4 font-mono text-cyan-400 text-center text-lg">
                  APY = (Annual Distributable Revenue / Total Staked Value)
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    High Revenue Scenario
                  </h4>
                  <p className="text-slate-300">
                    When businesses perform well and generate strong revenue, APY increases naturally.
                    Stakers benefit directly from ecosystem success.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    Low Revenue Scenario
                  </h4>
                  <p className="text-slate-300">
                    During slow periods, APY decreases. This is honest, sustainable, and
                    impossible to rug. Real economics, not token printing.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-sm text-slate-300">
                  <span className="font-bold text-green-400">Why this works:</span> Honest,
                  sustainable, institution-friendly, and impossible to rug. Governance can vote on
                  the percentage of revenue distributed, but cannot mint new tokens.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Revenue Distribution Model (Post-Business Costs)</h2>

          <p className="text-center text-slate-300 mb-8 max-w-3xl mx-auto">
            After operational expenses are paid, net profit is allocated according to this model. Simple, strong, and marketable.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <RevenueCard
              icon={<Coins className="w-8 h-8 text-blue-400" />}
              label="Treasury"
              percent={25}
              description="Long-term sustainability fund"
            />
            <RevenueCard
              icon={<TrendingUp className="w-8 h-8 text-green-400" />}
              label="Buyback"
              percent={15}
              description="Market support and demand creation"
            />
            <RevenueCard
              icon={<Flame className="w-8 h-8 text-orange-400" />}
              label="Burn"
              percent={15}
              description="Until 21M target, then redirected"
            />
            <RevenueCard
              icon={<Users className="w-8 h-8 text-cyan-400" />}
              label="Staking Support"
              percent={15}
              description="Buyback for staking rewards"
            />
            <RevenueCard
              icon={<Zap className="w-8 h-8 text-yellow-400" />}
              label="Use-to-Earn Support"
              percent={15}
              description="Buyback for U2E rewards"
            />
            <RevenueCard
              icon={<Target className="w-8 h-8 text-purple-400" />}
              label="Variable Bucket"
              percent={15}
              description="Governance-adjustable initiatives"
            />
          </div>

          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6 mb-6">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              Revenue Flow
            </h4>
            <div className="flex items-center gap-2 text-sm text-slate-300 flex-wrap justify-center">
              <span className="px-3 py-1 bg-slate-800 rounded font-semibold">Business Revenue</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
              <span className="px-3 py-1 bg-slate-800 rounded font-semibold">Operational Costs</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded font-bold">Net Profit</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded font-bold">6 Allocation Buckets</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded font-bold">Token Economy</span>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 mb-6">
            <h4 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Revenue Allocation Breakdown
            </h4>
            <p className="text-sm text-slate-300 mb-3">
              85% fixed allocation + 15% variable allocation (governance-controlled):
            </p>
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between p-2 bg-slate-900/50 rounded">
                <span className="text-slate-300">Buyback</span>
                <span className="font-mono text-white">15%</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-900/50 rounded">
                <span className="text-slate-300">Burn</span>
                <span className="font-mono text-white">15%</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-900/50 rounded">
                <span className="text-slate-300">Staking Support</span>
                <span className="font-mono text-white">15%</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-900/50 rounded">
                <span className="text-slate-300">U2E Support</span>
                <span className="font-mono text-white">15%</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-900/50 rounded">
                <span className="text-slate-300">Treasury</span>
                <span className="font-mono text-white">20%</span>
              </div>
              <div className="flex justify-between p-2 bg-blue-500/20 rounded border border-blue-500/30">
                <span className="text-slate-300">Variable (Governance)</span>
                <span className="font-mono text-white">15%</span>
              </div>
            </div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6">
            <h4 className="font-bold text-white mb-3">Why This Model Works</h4>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Simple, strong, marketable structure</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Fixed minimums prevent over-allocation</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Burn budget continues until 21M target</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>After burn target: Variable 15% redirected by governance</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Variable bucket allows adaptation</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Staking + U2E = 30% for perpetual rewards</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400 italic">
              After burn target is reached, the 15% burn allocation becomes part of the variable bucket, which governance can direct to staking/U2E rewards or other approved purposes.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Buyback & Burn Mechanism</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                Buyback Process
              </h3>
              <div className="space-y-4">
                <ProcessStep
                  number="1"
                  title="Revenue Collection"
                  description="Ecosystem revenue flows into treasury"
                />
                <ProcessStep
                  number="2"
                  title="Allocation"
                  description="15% allocated to buyback program"
                />
                <ProcessStep
                  number="3"
                  title="Execution"
                  description="Periodic buybacks (monthly/quarterly)"
                />
                <ProcessStep
                  number="4"
                  title="Distribution"
                  description="Some burned, some recycled per governance"
                />
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-400" />
                Burn Mechanics
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-white mb-1">15% Direct Burns</div>
                    <div className="text-sm text-slate-300">
                      15% of net profit used to buy AAIC and burn until 21M target
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-white mb-1">Buyback Burns</div>
                    <div className="text-sm text-slate-300">
                      Portion of bought-back tokens also burned
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-white mb-1">Full Transparency</div>
                    <div className="text-sm text-slate-300">
                      All burns tracked on-chain and displayed publicly
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <h4 className="text-sm font-bold text-slate-400 mb-3">Tracked Metrics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Max Supply</span>
                    <span className="font-mono text-white">100,000,000</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Burn Target</span>
                    <span className="font-mono text-orange-400">21,000,000</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Total Burned</span>
                    <span className="font-mono text-orange-400">Live Data</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Circulating Supply</span>
                    <span className="font-mono text-cyan-400">Live Data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <DollarSign className="w-8 h-8 text-green-400" />
            Revenue Requirements for Perpetual Rewards (After Year 4)
          </h2>

          <p className="text-center text-slate-300 mb-8 max-w-3xl mx-auto">
            After 4 years, emissions end. Rewards are funded entirely by revenue buybacks. Here's the transparent, honest math.
          </p>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mb-8">
            <div className="text-center mb-6">
              <p className="text-lg text-slate-300 mb-4">
                In revenue split: <span className="font-bold text-cyan-400">Staking (15%) + U2E (15%) = 30%</span> of net profit
              </p>
              <div className="bg-slate-900/50 rounded-lg p-6 mb-4">
                <div className="text-xl font-mono text-cyan-400 mb-2">
                  Required Profit = (Desired Monthly Token Distribution × Token Price) / 0.30
                </div>
              </div>
            </div>

            <h3 className="font-bold text-white mb-4 text-center">
              To maintain Year-4 level distribution (708,333 AAIC/month):
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-2">If AAIC price is</div>
                  <div className="text-3xl font-bold text-white mb-3">$0.25</div>
                  <div className="text-sm text-slate-400 mb-1">Required monthly profit:</div>
                  <div className="text-2xl font-bold text-green-400">$590,278</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-2">If AAIC price is</div>
                  <div className="text-3xl font-bold text-white mb-3">$0.50</div>
                  <div className="text-sm text-slate-400 mb-1">Required monthly profit:</div>
                  <div className="text-2xl font-bold text-green-400">$1,180,556</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-2">If AAIC price is</div>
                  <div className="text-3xl font-bold text-white mb-3">$1.00</div>
                  <div className="text-sm text-slate-400 mb-1">Required monthly profit:</div>
                  <div className="text-2xl font-bold text-green-400">$2,361,111</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-2">If AAIC price is</div>
                  <div className="text-3xl font-bold text-white mb-3">$2.00</div>
                  <div className="text-sm text-slate-400 mb-1">Required monthly profit:</div>
                  <div className="text-2xl font-bold text-green-400">$4,722,222</div>
                </div>
              </div>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6">
              <h4 className="font-bold text-white mb-3">Transparent, Honest Math</h4>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Scales with token price: Higher price = more profit needed OR distribute fewer tokens</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Always sustainable because backed by real revenue</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Anyone can calculate and verify the economics</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-cyan-400" />
              Governance Flexibility
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <ArrowRight className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">Can adjust % of profit to rewards (currently 30%)</span>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">Can reduce token distribution if profit insufficient</span>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">Can increase if highly profitable</span>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">Always sustainable - no death spirals</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <Flame className="w-8 h-8 text-orange-400" />
            Burn Target Timeline (21M AAIC)
          </h2>

          <p className="text-center text-slate-300 mb-8 max-w-3xl mx-auto">
            Burn allocation: 15% of net profit used to buy AAIC and burn until 21M target is reached.
          </p>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mb-8">
            <h3 className="font-bold text-white mb-6 text-center">Core Formula</h3>
            <div className="bg-slate-900/50 rounded-lg p-6 mb-6">
              <div className="text-center space-y-3">
                <div className="text-lg font-mono text-orange-400">
                  Burn tokens per month = (0.15 × Monthly Profit) / AAIC Price
                </div>
                <div className="text-lg font-mono text-orange-400">
                  Time to reach 21M = 21,000,000 / Monthly Burn Rate
                </div>
              </div>
            </div>

            <h3 className="font-bold text-white mb-4">Example Scenarios:</h3>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-6">
                <div className="font-bold text-cyan-400 mb-3">If Monthly Profit = $1,000,000:</div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-slate-900/50 rounded">
                    <div className="text-xs text-slate-400 mb-1">At $1.00/AAIC</div>
                    <div className="text-sm font-bold text-white">150,000 burned/month</div>
                    <div className="text-xs text-orange-400 mt-1">140 months (11.7 years)</div>
                  </div>
                  <div className="text-center p-3 bg-slate-900/50 rounded">
                    <div className="text-xs text-slate-400 mb-1">At $0.50/AAIC</div>
                    <div className="text-sm font-bold text-white">300,000 burned/month</div>
                    <div className="text-xs text-orange-400 mt-1">70 months (5.8 years)</div>
                  </div>
                  <div className="text-center p-3 bg-slate-900/50 rounded">
                    <div className="text-xs text-slate-400 mb-1">At $2.00/AAIC</div>
                    <div className="text-sm font-bold text-white">75,000 burned/month</div>
                    <div className="text-xs text-orange-400 mt-1">280 months (23.3 years)</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-lg p-6">
                <div className="font-bold text-green-400 mb-3">If Monthly Profit = $2,000,000:</div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-slate-900/50 rounded">
                    <div className="text-xs text-slate-400 mb-1">At $1.00/AAIC</div>
                    <div className="text-sm font-bold text-white">300,000 burned/month</div>
                    <div className="text-xs text-orange-400 mt-1">70 months (5.8 years)</div>
                  </div>
                  <div className="text-center p-3 bg-slate-900/50 rounded">
                    <div className="text-xs text-slate-400 mb-1">At $0.50/AAIC</div>
                    <div className="text-sm font-bold text-white">600,000 burned/month</div>
                    <div className="text-xs text-orange-400 mt-1">35 months (2.9 years)</div>
                  </div>
                  <div className="text-center p-3 bg-slate-900/50 rounded">
                    <div className="text-xs text-slate-400 mb-1">At $2.00/AAIC</div>
                    <div className="text-sm font-bold text-white">150,000 burned/month</div>
                    <div className="text-xs text-orange-400 mt-1">140 months (11.7 years)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Why Profit-Linked Burn Works</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Credible - tied to real revenue</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Sustainable - doesn't promise unrealistic timelines</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Transparent - anyone can calculate</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">No hype - honest about 5-15 year realistic timeline</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">After 21M Burned</h3>
              <p className="text-sm text-slate-300 mb-4">
                The 15% burn allocation redirects to governance-voted purposes.
              </p>
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                <p className="text-sm text-green-400 font-semibold">
                  Most likely outcome: Additional staking/U2E rewards, increasing long-term APY and user rewards.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Token Utility</h2>

          <p className="text-center text-slate-300 mb-8 max-w-2xl mx-auto">
            AAIC is required for meaningful participation in the ecosystem. Real utility, not fake promises.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UtilityCard
              icon={<Target className="w-8 h-8 text-cyan-400" />}
              title="Proposal Submission"
              description="Required to submit new business proposals to the ecosystem"
            />
            <UtilityCard
              icon={<Users className="w-8 h-8 text-blue-400" />}
              title="Governance Voting"
              description="Vote on proposals, parameter changes, and treasury allocation"
            />
            <UtilityCard
              icon={<Coins className="w-8 h-8 text-green-400" />}
              title="Staking Rewards"
              description="Stake tokens to earn revenue share from ecosystem businesses"
            />
            <UtilityCard
              icon={<Sparkles className="w-8 h-8 text-purple-400" />}
              title="Premium AI Services"
              description="Access advanced AI tools and priority service across platforms"
            />
            <UtilityCard
              icon={<TrendingUp className="w-8 h-8 text-yellow-400" />}
              title="Fee Reductions"
              description="Reduced fees across all ecosystem platforms and services"
            />
            <UtilityCard
              icon={<Shield className="w-8 h-8 text-orange-400" />}
              title="Treasury Control"
              description="Governance control over treasury funds and parameter adjustments"
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Governance Safeguards</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                Governance CAN Change
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Revenue distribution percentages (within bounds)</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Staking parameters and reward schedules</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Treasury fund allocation for proposals</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Fee structures across platforms</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Voting thresholds and proposal requirements</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Governance CANNOT Change
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                  <span className="font-bold">Max supply of 100,000,000 AAIC</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                  <span className="font-bold">Mint any new tokens (minting permanently disabled at deployment)</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Vesting schedules for team and contributors</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Core sustainability principles</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Smart contract security guarantees</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <h4 className="font-bold text-white mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              Anti-Hyperinflation Rules
            </h4>
            <p className="text-slate-300">
              The tokenomics contract enforces hard caps at the protocol level. No governance vote
              can override these fundamental protections. This makes the system trustless and
              institutional-grade.
            </p>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <Eye className="w-8 h-8 text-cyan-400" />
            Transparency Metrics
          </h2>

          <p className="text-center text-slate-300 mb-8">
            All key metrics are publicly available and updated in real-time. Full transparency, always.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              label="Circulating Supply"
              value="Live Data"
              sublabel="Updated real-time"
              color="cyan"
            />
            <MetricCard
              label="Total Burned"
              value="Live Data"
              sublabel="Cumulative burns"
              color="orange"
            />
            <MetricCard
              label="Monthly Revenue"
              value="Live Data"
              sublabel="Ecosystem earnings"
              color="green"
            />
            <MetricCard
              label="Current APY"
              value="Live Data"
              sublabel="Historical tracking"
              color="purple"
            />
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/token/transparency"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors"
            >
              View Full Transparency Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
            Important Disclaimer
          </h2>

          <div className="space-y-4 text-slate-300">
            <p>
              <span className="font-bold text-white">This is not financial advice.</span> AAIC is
              a utility token for ecosystem participation, not an investment product.
            </p>
            <p>
              Token value is directly tied to ecosystem performance. If businesses underperform,
              token value and rewards will decrease accordingly.
            </p>
            <p>
              <span className="font-bold text-white">Risks acknowledged:</span> Cryptocurrency
              markets are volatile. Regulatory landscapes are evolving. AI business performance
              is not guaranteed. Only participate with amounts you can afford to lose.
            </p>
            <p className="text-cyan-400 font-medium">
              We prioritize honesty over hype. This model is designed for long-term sustainability,
              not short-term pump-and-dump schemes.
            </p>
          </div>
        </section>

        <section className="bg-linear-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Why This Model Is Strong
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <StrengthCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Scales With Success"
              description="More revenue = higher rewards"
            />
            <StrengthCard
              icon={<Shield className="w-6 h-6" />}
              title="Survives Low Periods"
              description="No death spiral mechanics"
            />
            <StrengthCard
              icon={<CheckCircle2 className="w-6 h-6" />}
              title="No Ponzinomics"
              description="Real revenue backing"
            />
            <StrengthCard
              icon={<Users className="w-6 h-6" />}
              title="Serious Users"
              description="Attracts long-term holders"
            />
            <StrengthCard
              icon={<Zap className="w-6 h-6" />}
              title="Works Without Hype"
              description="Fundamentals-driven value"
            />
            <StrengthCard
              icon={<Eye className="w-6 h-6" />}
              title="Full Transparency"
              description="All metrics public"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/token/staking"
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Explore Staking
            </Link>
            <Link
              to="/governance"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
            >
              View Governance
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function PrincipleCard({ icon, text, positive }: { icon: React.ReactNode; text: string; positive: boolean }) {
  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg ${positive ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
      <div className={positive ? 'text-green-400' : 'text-red-400'}>{icon}</div>
      <span className="text-sm text-white font-medium">{text}</span>
    </div>
  );
}

function CorePrinciple({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
      <h4 className="font-bold text-white mb-2">{title}</h4>
      <p className="text-sm text-slate-300">{description}</p>
    </div>
  );
}

function ParameterRow({ label, value, sublabel, highlight }: { label: string; value: string; sublabel?: string; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-3 border-b border-slate-700 ${highlight ? 'bg-cyan-500/5' : ''}`}>
      <span className="text-slate-400">{label}</span>
      <div className="text-right">
        <div className={`font-bold ${highlight ? 'text-cyan-400 text-lg' : 'text-white'}`}>{value}</div>
        {sublabel && <div className="text-xs text-slate-500">{sublabel}</div>}
      </div>
    </div>
  );
}

function AllocationBar({ label, percent, tokens, color }: { label: string; percent: number; tokens: string; color: string }) {
  const colorMap: Record<string, string> = {
    cyan: 'bg-cyan-600',
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    yellow: 'bg-yellow-600',
    orange: 'bg-orange-600',
    pink: 'bg-pink-600',
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-white font-bold">{percent}%</span>
      </div>
      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${colorMap[color]}`} style={{ width: `${percent}%` }} />
      </div>
      <div className="text-xs text-slate-500 text-right">{tokens} AAIC</div>
    </div>
  );
}

function VestingCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
      <h4 className="font-bold text-white mb-4">{title}</h4>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
            <Clock className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RevenueCard({ icon, label, percent, description }: { icon: React.ReactNode; label: string; percent: number; description: string }) {
  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6">
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="text-3xl font-bold text-white text-center mb-1">{percent}%</div>
      <div className="text-sm font-medium text-slate-300 text-center mb-2">{label}</div>
      <div className="text-xs text-slate-400 text-center">{description}</div>
    </div>
  );
}

function ProcessStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
        {number}
      </div>
      <div>
        <h5 className="font-bold text-white mb-1">{title}</h5>
        <p className="text-sm text-slate-300">{description}</p>
      </div>
    </div>
  );
}

function UtilityCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h4 className="font-bold text-white mb-2">{title}</h4>
      <p className="text-sm text-slate-300">{description}</p>
    </div>
  );
}

function MetricCard({ label, value, sublabel, color }: { label: string; value: string; sublabel: string; color: string }) {
  const colorMap: Record<string, string> = {
    cyan: 'text-cyan-400',
    orange: 'text-orange-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
  };

  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6 text-center">
      <div className="text-sm text-slate-400 mb-2">{label}</div>
      <div className={`text-2xl font-bold mb-1 ${colorMap[color]}`}>{value}</div>
      <div className="text-xs text-slate-500">{sublabel}</div>
    </div>
  );
}

function StrengthCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="flex justify-center text-cyan-400 mb-3">{icon}</div>
      <h4 className="font-bold text-white text-sm mb-1 text-center">{title}</h4>
      <p className="text-xs text-slate-400 text-center">{description}</p>
    </div>
  );
}
