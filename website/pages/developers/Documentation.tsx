import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Code, BookOpen, Wallet, Vote, Lock, Coins,
  Terminal, Globe, Shield, Zap, Database,
  GitBranch, CheckCircle2, AlertTriangle, ExternalLink
} from 'lucide-react';
import { useState } from 'react';

export default function Documentation() {
  const [activeTab, setActiveTab] = useState('quickstart');

  const tabs = [
    { id: 'quickstart', label: 'Quick Start', icon: <Zap className="w-4 h-4" /> },
    { id: 'wallet', label: 'Wallet Integration', icon: <Wallet className="w-4 h-4" /> },
    { id: 'contracts', label: 'Smart Contracts', icon: <Code className="w-4 h-4" /> },
    { id: 'api', label: 'API Reference', icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <PageLayout>
      <div className="space-y-16">
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Developer Documentation
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Build on{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Aizura
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Comprehensive guides, API references, and code examples to integrate Aizura smart contracts
            and services into your application.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#quickstart"
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              Get Started
            </a>
            <a
              href="https://github.com/aizura-consortium"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <GitBranch className="w-4 h-4" />
              GitHub
              <span className="text-xs text-slate-400">(Coming Soon)</span>
            </a>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
            <Terminal className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Installation</h3>
            <p className="text-sm text-slate-300 mb-4">
              Quick setup with npm or yarn. Get started in under 5 minutes.
            </p>
            <a href="#quickstart" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium inline-flex items-center gap-1">
              View Guide
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
            <Code className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Smart Contracts</h3>
            <p className="text-sm text-slate-300 mb-4">
              Interact with governance, staking, and token contracts.
            </p>
            <a href="#contracts" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium inline-flex items-center gap-1">
              View Examples
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
            <Database className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">API Reference</h3>
            <p className="text-sm text-slate-300 mb-4">
              RESTful API for querying proposals, votes, and statistics.
            </p>
            <a href="#api" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium inline-flex items-center gap-1">
              API Docs
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </section>

        <section>
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-10">
            {activeTab === 'quickstart' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Quick Start Guide</h2>
                  <p className="text-slate-300 mb-6">
                    Get up and running with Aizura in minutes. This guide covers installation, basic setup,
                    and your first interaction with our contracts.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">1. Install Dependencies</h3>
                  <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                    <code className="text-sm text-cyan-400 font-mono">
                      npm install ethers @aizura/sdk wagmi viem
                    </code>
                  </div>
                  <p className="text-sm text-slate-400 mt-2">
                    Or with yarn: <code className="text-cyan-400">yarn add ethers @aizura/sdk wagmi viem</code>
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">2. Initialize the SDK</h3>
                  <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-slate-300 font-mono">
{`import { AizuraSDK } from '@aizura/sdk';
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const aizura = new AizuraSDK({
  provider,
  signer,
  network: 'mainnet', // or 'goerli' for testnet
});`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">3. Check Token Balance</h3>
                  <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-slate-300 font-mono">
{`const balance = await aizura.token.balanceOf(userAddress);
console.log('AAIC Balance:', ethers.utils.formatEther(balance));

const votingPower = await aizura.governance.getVotingPower(userAddress);
console.log('Voting Power:', ethers.utils.formatEther(votingPower));`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">4. Vote on a Proposal</h3>
                  <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-slate-300 font-mono">
{`const proposalId = 1;
const support = true; // true for yes, false for no

const tx = await aizura.governance.castVote(proposalId, support);
await tx.wait();

console.log('Vote cast successfully!');`}
                    </pre>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-semibold mb-2">SDK Coming Soon</h4>
                      <p className="text-sm text-slate-300">
                        The Aizura SDK is currently in development. For now, you can interact directly with our
                        smart contracts using ethers.js or web3.js. Full SDK documentation will be available before
                        mainnet launch.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'wallet' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Wallet Integration</h2>
                  <p className="text-slate-300 mb-6">
                    Connect users' wallets and interact with the Ethereum blockchain. Supports MetaMask,
                    WalletConnect, Coinbase Wallet, and more.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Using wagmi (Recommended)</h3>
                  <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto mb-4">
                    <pre className="text-sm text-slate-300 font-mono">
{`import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

const { chains, provider } = configureChains(
  [mainnet],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: 'your-project-id',
      },
    }),
  ],
  provider,
});

function App() {
  return (
    <WagmiConfig client={client}>
      <YourApp />
    </WagmiConfig>
  );
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Connect Wallet Component</h3>
                  <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-slate-300 font-mono">
{`import { useConnect, useAccount, useDisconnect } from 'wagmi';

function ConnectWallet() {
  const { connect, connectors, isLoading } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div>
        <p>Connected: {address}</p>
        <button onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
          disabled={isLoading}
        >
          Connect {connector.name}
        </button>
      ))}
    </div>
  );
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Read Contract Data</h3>
                  <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-slate-300 font-mono">
{`import { useContractRead } from 'wagmi';
import { AAIC_TOKEN_ADDRESS, AAIC_TOKEN_ABI } from './constants';

function TokenBalance({ address }) {
  const { data: balance } = useContractRead({
    address: AAIC_TOKEN_ADDRESS,
    abi: AAIC_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address],
    watch: true, // auto-refresh
  });

  return (
    <div>
      Balance: {balance ? ethers.utils.formatEther(balance) : '0'} AAIC
    </div>
  );
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Write to Contract</h3>
                  <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-slate-300 font-mono">
{`import { useContractWrite, usePrepareContractWrite } from 'wagmi';

function VoteButton({ proposalId, support }) {
  const { config } = usePrepareContractWrite({
    address: GOVERNANCE_ADDRESS,
    abi: GOVERNANCE_ABI,
    functionName: 'castVote',
    args: [proposalId, support],
  });

  const { write, isLoading, isSuccess } = useContractWrite(config);

  return (
    <button onClick={() => write?.()} disabled={isLoading}>
      {isLoading ? 'Voting...' : 'Cast Vote'}
    </button>
  );
}`}
                    </pre>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-semibold mb-2">Best Practices</h4>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Always handle wallet connection errors gracefully</li>
                        <li>• Check network before transactions (mainnet vs testnet)</li>
                        <li>• Display gas estimates before submitting transactions</li>
                        <li>• Implement proper loading and success states</li>
                        <li>• Never store private keys in client-side code</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contracts' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Smart Contract Interactions</h2>
                  <p className="text-slate-300 mb-6">
                    Learn how to interact with Aizura's core smart contracts for governance, staking, and token operations.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <Coins className="w-6 h-6 text-cyan-400" />
                    Token Contract
                  </h3>
                  <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto mb-4">
                    <pre className="text-sm text-slate-300 font-mono">
{`// Transfer tokens
await tokenContract.transfer(recipientAddress, amount);

// Approve spending
await tokenContract.approve(spenderAddress, amount);

// Check allowance
const allowance = await tokenContract.allowance(owner, spender);

// Delegate voting power
await tokenContract.delegate(delegateAddress);

// Get voting power
const votes = await tokenContract.getVotes(address);`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <Vote className="w-6 h-6 text-blue-400" />
                    Governance Contract
                  </h3>
                  <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto mb-4">
                    <pre className="text-sm text-slate-300 font-mono">
{`// Create a proposal
const proposalId = await governanceContract.propose(
  targets,
  values,
  calldatas,
  description
);

// Vote on a proposal
await governanceContract.castVote(proposalId, support);

// Vote with reason
await governanceContract.castVoteWithReason(
  proposalId,
  support,
  "I support this because..."
);

// Queue proposal for execution
await governanceContract.queue(proposalId);

// Execute approved proposal
await governanceContract.execute(proposalId);

// Get proposal state
const state = await governanceContract.state(proposalId);
// 0: Pending, 1: Active, 2: Canceled, 3: Defeated,
// 4: Succeeded, 5: Queued, 6: Expired, 7: Executed`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <Lock className="w-6 h-6 text-purple-400" />
                    Staking Contract
                  </h3>
                  <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto mb-4">
                    <pre className="text-sm text-slate-300 font-mono">
{`// Stake tokens
await stakingContract.stake(amount, lockPeriod);

// Check staking balance
const stakedBalance = await stakingContract.balanceOf(address);

// Calculate pending rewards
const rewards = await stakingContract.pendingRewards(address);

// Claim rewards (without unstaking)
await stakingContract.claimRewards();

// Unstake tokens (after lock period)
await stakingContract.unstake(amount);

// Emergency unstake (with penalty)
await stakingContract.emergencyUnstake();`}
                    </pre>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Contract Addresses</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">AAIC Token:</span>
                      <code className="text-cyan-400 font-mono">Coming Soon</code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Governance:</span>
                      <code className="text-cyan-400 font-mono">Coming Soon</code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Staking:</span>
                      <code className="text-cyan-400 font-mono">Coming Soon</code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Treasury:</span>
                      <code className="text-cyan-400 font-mono">Coming Soon</code>
                    </div>
                  </div>
                  <Link
                    to="/blockchain/smart-contracts"
                    className="mt-4 inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                  >
                    View All Contracts
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">API Reference</h2>
                  <p className="text-slate-300 mb-6">
                    Query proposals, voting data, and ecosystem metrics through our RESTful API.
                  </p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-semibold mb-2">Base URL</h4>
                      <code className="text-sm text-cyan-400">https://api.aizura.com/v1</code>
                      <p className="text-sm text-slate-400 mt-2">
                        All endpoints require HTTPS. Rate limit: 100 requests/minute per IP.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Proposals</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">GET</span>
                        <code className="text-sm text-slate-300">/proposals</code>
                      </div>
                      <p className="text-sm text-slate-400 mb-3">Get all proposals with optional filters</p>
                      <div className="bg-slate-950 rounded p-3">
                        <pre className="text-xs text-slate-300 font-mono">
{`// Query Parameters
?status=active       // Filter by status (pending, active, succeeded, etc.)
&page=1              // Pagination
&limit=20            // Items per page
&sort=created_desc   // Sort order

// Example Response
{
  "data": [
    {
      "id": 1,
      "title": "Launch AI Trading Bot V2",
      "description": "Proposal to fund...",
      "proposer": "0x1234...5678",
      "status": "active",
      "votesFor": "1000000",
      "votesAgainst": "50000",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "pages": 8
  }
}`}
                        </pre>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">GET</span>
                        <code className="text-sm text-slate-300">/proposals/:id</code>
                      </div>
                      <p className="text-sm text-slate-400 mb-3">Get detailed information about a specific proposal</p>
                      <div className="bg-slate-950 rounded p-3">
                        <pre className="text-xs text-slate-300 font-mono">
{`// Example Response
{
  "id": 1,
  "title": "Launch AI Trading Bot V2",
  "description": "Full proposal text...",
  "proposer": "0x1234...5678",
  "status": "active",
  "votesFor": "1000000",
  "votesAgainst": "50000",
  "quorum": "5000000",
  "threshold": "51",
  "startBlock": 18500000,
  "endBlock": 18600000,
  "createdAt": "2024-01-15T10:00:00Z",
  "votes": [
    {
      "voter": "0xabcd...efgh",
      "support": true,
      "weight": "50000",
      "timestamp": "2024-01-16T14:30:00Z"
    }
  ]
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Statistics</h3>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">GET</span>
                      <code className="text-sm text-slate-300">/stats</code>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">Get ecosystem statistics and metrics</p>
                    <div className="bg-slate-950 rounded p-3">
                      <pre className="text-xs text-slate-300 font-mono">
{`{
  "tokenPrice": "1.25",
  "marketCap": "125000000",
  "totalSupply": "100000000",
  "circulatingSupply": "30000000",
  "totalStaked": "15000000",
  "totalProposals": 150,
  "activeProposals": 8,
  "totalVoters": 4521,
  "treasury": {
    "total": "5000000",
    "allocated": "2500000",
    "available": "2500000"
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-semibold mb-2">API Status</h4>
                      <p className="text-sm text-slate-300">
                        The Aizura API is currently in development and will be available before mainnet launch.
                        Documentation shown here represents the planned API structure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-10">
          <h2 className="text-3xl font-bold text-white mb-6">Additional Resources</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/blockchain/smart-contracts"
              className="bg-slate-900/50 rounded-xl p-6 hover:bg-slate-900/70 transition-colors"
            >
              <Code className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Smart Contracts</h3>
              <p className="text-sm text-slate-300 mb-3">
                Detailed documentation for all 9 core smart contracts
              </p>
              <span className="text-cyan-400 text-sm font-medium inline-flex items-center gap-1">
                View Contracts
                <ExternalLink className="w-3 h-3" />
              </span>
            </Link>

            <Link
              to="/blockchain/security"
              className="bg-slate-900/50 rounded-xl p-6 hover:bg-slate-900/70 transition-colors"
            >
              <Shield className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Security</h3>
              <p className="text-sm text-slate-300 mb-3">
                AI-powered audits and bug bounty program
              </p>
              <span className="text-cyan-400 text-sm font-medium inline-flex items-center gap-1">
                Security Center
                <ExternalLink className="w-3 h-3" />
              </span>
            </Link>

            <a
              href="https://github.com/aizura-consortium"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900/50 rounded-xl p-6 hover:bg-slate-900/70 transition-colors"
            >
              <GitBranch className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">GitHub</h3>
              <p className="text-sm text-slate-300 mb-3">
                Open-source contracts and example applications
              </p>
              <span className="text-slate-500 text-sm font-medium">
                Coming Soon
              </span>
            </a>
          </div>
        </section>

        <section className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 lg:p-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Help?</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Join our developer community on Discord, ask questions, and get support from the team and other developers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/community/contact"
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              Contact Support
            </Link>
            <Link
              to="/community/faq"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              View FAQ
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
