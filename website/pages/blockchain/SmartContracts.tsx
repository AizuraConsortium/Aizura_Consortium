import { PageLayout } from '../../components/layout/PageLayout';
import {
  Code, Shield, Lock, Coins, Vote, Award,
  PieChart, AlertTriangle, ExternalLink, Copy, CheckCircle2
} from 'lucide-react';
import { useState } from 'react';

interface ContractInfo {
  name: string;
  icon: React.ReactNode;
  address: string;
  purpose: string;
  functionality: string[];
  security: string[];
  interactions: string[];
}

export default function SmartContracts() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = (address: string, contractName: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(contractName);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const contracts: ContractInfo[] = [
    {
      name: 'AAIC Token Contract',
      icon: <Coins className="w-8 h-8 text-cyan-400" />,
      address: '0x0000000000000000000000000000000000000000',
      purpose: 'Core ERC-20 token with governance extensions enabling voting rights and delegation mechanisms.',
      functionality: [
        'Standard ERC-20 transfer and approval functions',
        'Vote delegation (EIP-712 signatures supported)',
        'Snapshot-based voting power calculation',
        'Permit functionality for gasless approvals',
        'Burn mechanism for token deflationary pressure',
        'Maximum supply cap enforcement (1B tokens)',
      ],
      security: [
        'Non-upgradable contract for immutability',
        'Transfer limits during initial launch phase',
        'Anti-whale mechanisms for fair distribution',
        'Reentrancy guards on all state-changing functions',
        'Integer overflow protection via Solidity 0.8+',
      ],
      interactions: [
        'Called by Staking Contract for reward distributions',
        'Interacts with Governance Contract for voting power',
        'Burns tokens sent to Revenue Distribution Contract',
        'Integrates with Vesting Contract for locked allocations',
      ],
    },
    {
      name: 'Governance Contract',
      icon: <Vote className="w-8 h-8 text-blue-400" />,
      address: '0x0000000000000000000000000000000000000000',
      purpose: 'Handles proposal submission, voting, timelock execution, and governance parameter management.',
      functionality: [
        'Proposal creation with description and executable actions',
        'Multi-phase voting (Discussion, Voting, Queue, Execution)',
        'Quadratic voting weight calculation',
        'Quorum and threshold validation',
        'Timelock delay for security (48 hours minimum)',
        'Emergency veto mechanism for critical issues',
        'Proposal cancellation by proposer before voting starts',
      ],
      security: [
        'Minimum token threshold to submit proposals (50,000 AAIC)',
        'Timelock prevents immediate malicious execution',
        'Guardian role for emergency pause/cancel',
        'Vote delegation prevents double voting',
        'Snapshot prevents same-block manipulation',
      ],
      interactions: [
        'Reads voting power from AAIC Token Contract',
        'Executes approved proposals via Treasury Contract',
        'Logs all events for transparency and auditing',
        'Integrates with Launchpad Contract for business proposals',
      ],
    },
    {
      name: 'Treasury Contract',
      icon: <PieChart className="w-8 h-8 text-green-400" />,
      address: '0x0000000000000000000000000000000000000000',
      purpose: 'Multi-signature treasury managing ecosystem funds, revenue collection, and automated distribution logic.',
      functionality: [
        'Multi-sig approval for large transactions (3-of-5 threshold)',
        'Revenue collection from all ecosystem businesses',
        'Automated distribution according to governance parameters',
        'Budget allocation for approved proposals',
        'Emergency fund access with timelocks',
        'Whitelisted contract addresses for automated payments',
        'Transaction history and audit trail',
      ],
      security: [
        'Multi-signature requirement for manual withdrawals',
        'Daily spending limits for automated distributions',
        'Role-based access control (RBAC)',
        'Whitelist-only contract interactions',
        'Emergency pause functionality',
      ],
      interactions: [
        'Receives revenue from ecosystem businesses',
        'Sends funds to Revenue Distribution Contract',
        'Allocates budgets for approved Launchpad proposals',
        'Funds buyback operations for token economics',
      ],
    },
    {
      name: 'Staking Contract',
      icon: <Lock className="w-8 h-8 text-purple-400" />,
      address: '0x0000000000000000000000000000000000000000',
      purpose: 'Token locking mechanism with tiered APY rewards and governance power multiplication.',
      functionality: [
        'Multiple lock period options (30, 90, 180, 365 days)',
        'Variable APY based on lock duration (5-25%)',
        'Auto-compound option for maximizing returns',
        'Early withdrawal with penalty mechanism',
        'Boosted voting power during staking period',
        'Reward distribution from ecosystem revenue',
        'Claim rewards without unstaking',
      ],
      security: [
        'Lock period enforcement with timestamp validation',
        'Penalty calculation for early withdrawals (10-30%)',
        'Reentrancy protection on stake/unstake',
        'Maximum stake limits per address initially',
        'Emergency withdrawal in extreme scenarios',
      ],
      interactions: [
        'Locks AAIC tokens from user wallets',
        'Receives rewards from Revenue Distribution Contract',
        'Reports staking status to Governance Contract for vote boosting',
        'Calculates and distributes APY from Treasury allocations',
      ],
    },
    {
      name: 'Airdrop Distribution Contract',
      icon: <Award className="w-8 h-8 text-yellow-400" />,
      address: '0x0000000000000000000000000000000000000000',
      purpose: 'Merkle tree-based airdrop system for fair and gas-efficient token distribution to qualified participants.',
      functionality: [
        'Merkle proof verification for eligibility',
        'Multi-tier airdrop allocation (based on participation level)',
        'Claim window with start and end timestamps',
        'Batch claim support for multiple rounds',
        'Referral bonus system integration',
        'Unclaimed token recovery after deadline',
        'Anti-bot and anti-Sybil mechanisms',
      ],
      security: [
        'Merkle root commitment on-chain',
        'One-time claim per address per round',
        'Claim period enforcement',
        'Signature validation for claim requests',
        'Rate limiting on claim transactions',
      ],
      interactions: [
        'Receives allocated AAIC tokens from Treasury',
        'Transfers tokens to verified claimants',
        'Returns unclaimed tokens to Treasury after deadline',
        'Logs all claims for transparency',
      ],
    },
    {
      name: 'Vesting Contract',
      icon: <Lock className="w-8 h-8 text-indigo-400" />,
      address: '0x0000000000000000000000000000000000000000',
      purpose: 'Time-locked token release for team, contributors, and proposal creators with cliff and linear vesting schedules.',
      functionality: [
        'Customizable vesting schedules per beneficiary',
        'Cliff period before first release (6-12 months typical)',
        'Linear vesting over specified duration',
        'Early termination with unvested token return',
        'Multiple beneficiary support',
        'Vesting status query for transparency',
        'Partial release claims as tokens vest',
      ],
      security: [
        'Immutable vesting schedule once created',
        'Cliff enforcement prevents early access',
        'Only beneficiary can claim vested tokens',
        'Admin cannot alter schedules post-creation',
        'Emergency revoke only for unvested portions',
      ],
      interactions: [
        'Holds AAIC tokens allocated from Treasury',
        'Releases tokens to beneficiaries over time',
        'Integrates with Governance Contract (vested tokens have reduced voting power)',
        'Returns unvested tokens if beneficiary is terminated',
      ],
    },
    {
      name: 'Revenue Distribution Contract',
      icon: <PieChart className="w-8 h-8 text-orange-400" />,
      address: '0x0000000000000000000000000000000000000000',
      purpose: 'Automated revenue splitting for buybacks, burns, staker rewards, and treasury reallocation.',
      functionality: [
        'Receives revenue from Treasury Contract',
        'Automatic percentage-based splitting',
        'Buyback execution via DEX integration (Uniswap V3)',
        'Token burn mechanism (send to 0x000...dead)',
        'Staker reward distribution calculation',
        'Governance participant reward allocation',
        'Dynamic rebalancing based on governance votes',
      ],
      security: [
        'Only Treasury Contract can trigger distributions',
        'Percentage validation (must sum to 100%)',
        'Slippage protection on buyback swaps',
        'Maximum gas price limits for DEX interactions',
        'Emergency pause for market volatility',
      ],
      interactions: [
        'Receives funds from Treasury Contract',
        'Executes buybacks on Uniswap V3',
        'Burns AAIC tokens by sending to dead address',
        'Distributes rewards to Staking Contract',
        'Allocates governance rewards to voters',
      ],
    },
    {
      name: 'Launchpad Contract',
      icon: <Code className="w-8 h-8 text-pink-400" />,
      address: '0x0000000000000000000000000000000000000000',
      purpose: 'Business proposal submission, deposit management, refund logic, and equity allocation tracking.',
      functionality: [
        'Proposal submission with required AAIC deposit',
        'Deposit lock during governance vote period',
        'Refund mechanism for rejected proposals',
        'Equity allocation recording for approved proposals',
        'Proposer reputation tracking',
        'Milestone-based fund release for approved businesses',
        'Integration with Governance Contract for vote results',
      ],
      security: [
        'Minimum token balance required to submit',
        'Deposit held until voting concludes',
        'Only Governance Contract can approve/reject',
        'Refund includes transaction fees compensation',
        'Anti-spam measures (cooldown between submissions)',
      ],
      interactions: [
        'Locks AAIC tokens as proposal deposits',
        'Queries Governance Contract for proposal status',
        'Requests funding from Treasury for approved proposals',
        'Tracks equity allocations for proposers',
      ],
    },
    {
      name: 'Emergency Pause Contract',
      icon: <AlertTriangle className="w-8 h-8 text-red-400" />,
      address: '0x0000000000000000000000000000000000000000',
      purpose: 'Circuit breaker system for immediate response to security incidents across all ecosystem contracts.',
      functionality: [
        'Global emergency pause mechanism',
        'Individual contract pause capability',
        'Multi-sig guardian approval required',
        'Automated pause triggers based on anomaly detection',
        'Gradual unpause with phased re-enabling',
        'Incident reporting and logging',
        'Post-mortem report storage on-chain',
      ],
      security: [
        'Guardian multi-sig (4-of-7 threshold)',
        'Pause can be triggered by any guardian in emergency',
        'Unpause requires majority guardian approval',
        'Time-delay before full system restoration',
        'Cannot be paused indefinitely (max 30 days)',
      ],
      interactions: [
        'Can pause all other ecosystem contracts',
        'Integrates with monitoring systems for auto-pause',
        'Logs all pause/unpause events with reasons',
        'Coordinates with incident response procedures',
      ],
    },
  ];

  return (
    <PageLayout>
      <div className="space-y-16">
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-6">
            <Code className="w-4 h-4" />
            Smart Contract Architecture
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Blockchain{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Infrastructure
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Our ecosystem is powered by 9 core smart contracts that work together to create a secure,
            transparent, and fully decentralized autonomous organization.
          </p>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 text-left">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Security First</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  All contracts undergo comprehensive AI-powered audits by 10+ specialized systems before deployment.
                  Every contract is designed with defense-in-depth principles, including reentrancy guards, access controls,
                  and emergency pause mechanisms.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          {contracts.map((contract, index) => (
            <div
              key={contract.name}
              className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-10 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-slate-700/50 rounded-xl flex-shrink-0">
                  {contract.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{contract.name}</h2>
                  <p className="text-slate-300 leading-relaxed">{contract.purpose}</p>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs text-slate-400 mb-1">Contract Address</p>
                    <p className="text-sm text-slate-200 font-mono truncate">
                      {contract.address === '0x0000000000000000000000000000000000000000' ? (
                        <span className="text-yellow-400">Coming Soon - Pre-Launch</span>
                      ) : (
                        contract.address
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(contract.address, contract.name)}
                      className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                      title="Copy address"
                      disabled={contract.address === '0x0000000000000000000000000000000000000000'}
                    >
                      {copiedAddress === contract.name ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={contract.address === '0x0000000000000000000000000000000000000000'
                        ? '#'
                        : `https://etherscan.io/address/${contract.address}`}
                      target={contract.address === '0x0000000000000000000000000000000000000000' ? '_self' : '_blank'}
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg transition-colors ${
                        contract.address === '0x0000000000000000000000000000000000000000'
                          ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                      }`}
                      title="View on Etherscan"
                      onClick={(e) => contract.address === '0x0000000000000000000000000000000000000000' && e.preventDefault()}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Core Functionality
                  </h3>
                  <ul className="space-y-2">
                    {contract.functionality.map((item, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-cyan-400 mt-1 flex-shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Security Measures
                  </h3>
                  <ul className="space-y-2">
                    {contract.security.map((item, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-green-400 mt-1 flex-shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
                    <PieChart className="w-4 h-4" />
                    Contract Interactions
                  </h3>
                  <ul className="space-y-2">
                    {contract.interactions.map((item, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-purple-400 mt-1 flex-shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-10">
          <h2 className="text-3xl font-bold text-white mb-6">Developer Resources</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">ABI Documentation</h3>
              <p className="text-sm text-slate-300 mb-4">
                Access the Application Binary Interface for each contract to interact programmatically.
              </p>
              <a
                href="/developers/documentation#abi"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
              >
                View ABI Docs
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Integration Guides</h3>
              <p className="text-sm text-slate-300 mb-4">
                Step-by-step tutorials for integrating Aizura contracts into your application.
              </p>
              <a
                href="/developers/documentation"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
              >
                View Integration Guides
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Security Audits</h3>
              <p className="text-sm text-slate-300 mb-4">
                Review our comprehensive AI-powered security audit reports and methodology.
              </p>
              <a
                href="/blockchain/security"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
              >
                View Security Reports
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">GitHub Repository</h3>
              <p className="text-sm text-slate-300 mb-4">
                Explore our open-source smart contracts and contribute to the ecosystem.
              </p>
              <span className="inline-flex items-center gap-2 text-slate-500 text-sm font-medium">
                Coming Soon
              </span>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
