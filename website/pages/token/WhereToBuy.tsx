import { PageLayout } from '../../components/layout/PageLayout';
import {
  AlertCircle, ExternalLink, Wallet, Shield, TrendingUp,
  ChevronRight, Copy, CheckCircle2, Zap, Info
} from 'lucide-react';
import { useState } from 'react';

export default function WhereToBuy() {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [selectedDex, setSelectedDex] = useState('uniswap');

  const contractAddress = '0x0000000000000000000000000000000000000000';

  const copyAddress = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const dexes = [
    {
      id: 'uniswap',
      name: 'Uniswap V3',
      logo: '🦄',
      pair: 'AAIC/WETH',
      liquidity: '$2.5M',
      volume24h: '$7.5M',
      fee: '0.3%',
      slippage: '0.5-1%',
      url: 'https://app.uniswap.org',
    },
    {
      id: 'sushiswap',
      name: 'SushiSwap',
      logo: '🍣',
      pair: 'AAIC/WETH',
      liquidity: '$1.2M',
      volume24h: '$3.1M',
      fee: '0.3%',
      slippage: '0.5-1%',
      url: 'https://app.sushi.com',
    },
    {
      id: 'pancakeswap',
      name: 'PancakeSwap',
      logo: '🥞',
      pair: 'AAIC/WBNB',
      liquidity: '$800K',
      volume24h: '$1.9M',
      fee: '0.25%',
      slippage: '0.5-1%',
      url: 'https://pancakeswap.finance',
    },
  ];

  const cexes = [
    { name: 'Binance', status: 'Listing Application Submitted' },
    { name: 'Coinbase', status: 'In Discussion' },
    { name: 'Kraken', status: 'Planned Q2 2025' },
    { name: 'KuCoin', status: 'Planned Q2 2025' },
  ];

  return (
    <PageLayout>
      <div className="space-y-8">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Token Not Yet Launched</h3>
              <p className="text-sm text-slate-300">
                AAIC token has not been launched yet. This page shows where the token will be available for purchase
                upon launch. All information is subject to change. Check back after the official launch announcement.
              </p>
            </div>
          </div>
        </div>

        <section className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Where to{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Buy AAIC
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Purchase AAIC tokens on decentralized and centralized exchanges. Always verify the contract address
            to ensure you're buying the authentic token.
          </p>

          <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="text-left">
                <div className="text-sm text-slate-400 mb-1">Official Contract Address</div>
                <code className="text-cyan-400 font-mono text-sm break-all">
                  {contractAddress === '0x0000000000000000000000000000000000000000' ? (
                    <span className="text-yellow-400">Coming Soon - Will Be Published Upon Launch</span>
                  ) : (
                    contractAddress
                  )}
                </code>
              </div>
              <button
                onClick={copyAddress}
                className="p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex-shrink-0"
                disabled={contractAddress === '0x0000000000000000000000000000000000000000'}
              >
                {copiedAddress ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-cyan-400" />
            <h2 className="text-3xl font-bold text-white">Decentralized Exchanges (DEX)</h2>
          </div>

          <p className="text-slate-300 mb-6">
            DEXs allow you to trade directly from your wallet with full custody of your funds. No registration required.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {dexes.map((dex) => (
              <div
                key={dex.id}
                onClick={() => setSelectedDex(dex.id)}
                className={`bg-slate-900/50 rounded-xl p-6 cursor-pointer transition-all ${
                  selectedDex === dex.id
                    ? 'ring-2 ring-cyan-500 bg-slate-900/70'
                    : 'hover:bg-slate-900/70'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{dex.logo}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{dex.name}</h3>
                    <p className="text-sm text-slate-400">{dex.pair}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Liquidity:</span>
                    <span className="text-white font-medium">{dex.liquidity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">24h Volume:</span>
                    <span className="text-white font-medium">{dex.volume24h}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Trading Fee:</span>
                    <span className="text-white font-medium">{dex.fee}</span>
                  </div>
                </div>

                <a
                  href={dex.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-center font-medium rounded-lg transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Trade on {dex.name.split(' ')[0]}
                </a>
              </div>
            ))}
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-white font-semibold mb-2">Recommended Slippage</h4>
                <p className="text-sm text-slate-300">
                  For most trades, set slippage to <strong>0.5-1%</strong>. During high volatility, you may need
                  to increase to 2-3%. Never set slippage above 5% unless absolutely necessary.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Wallet className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl font-bold text-white">How to Buy AAIC (Step-by-Step)</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900/50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Set Up a Wallet</h3>
                  <p className="text-slate-300 mb-4">
                    Install MetaMask or another Web3 wallet. Create a new wallet or import an existing one.
                    Make sure to securely store your seed phrase.
                  </p>
                  <a
                    href="https://metamask.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                  >
                    Download MetaMask
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Get ETH or BNB</h3>
                  <p className="text-slate-300 mb-4">
                    Purchase ETH (for Ethereum DEXs) or BNB (for BSC DEXs) from a centralized exchange like
                    Coinbase or Binance. Transfer to your wallet address.
                  </p>
                  <div className="flex gap-3">
                    <span className="px-3 py-1 bg-slate-700 text-slate-300 text-sm rounded">ETH for Uniswap</span>
                    <span className="px-3 py-1 bg-slate-700 text-slate-300 text-sm rounded">BNB for PancakeSwap</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Connect to DEX</h3>
                  <p className="text-slate-300 mb-4">
                    Visit your chosen DEX (Uniswap, SushiSwap, or PancakeSwap). Click "Connect Wallet"
                    and select MetaMask. Approve the connection in your wallet.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Swap for AAIC</h3>
                  <p className="text-slate-300 mb-4">
                    In the swap interface, select ETH (or BNB) as the input token. Paste the AAIC contract
                    address in the output field. Enter the amount you want to swap, check the price, and confirm.
                  </p>
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mt-3">
                    <div className="flex items-start gap-2">
                      <Shield className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-slate-300">
                          <strong className="text-white">Always verify the contract address!</strong> Scammers create
                          fake tokens with similar names. Only use the official address published on our website.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Confirm Transaction</h3>
                  <p className="text-slate-300 mb-4">
                    Review the transaction details including gas fees. Click "Swap" then confirm in your wallet.
                    Wait for the transaction to complete (usually 15-60 seconds on Ethereum).
                  </p>
                  <p className="text-sm text-slate-400">
                    Your AAIC tokens will automatically appear in your wallet. If not visible, add the token manually
                    using the contract address.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-purple-400" />
              <h2 className="text-3xl font-bold text-white">Centralized Exchanges</h2>
            </div>
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm font-medium rounded">
              Coming Soon
            </span>
          </div>

          <p className="text-slate-300 mb-6">
            Centralized exchanges offer a simpler buying experience with fiat on-ramps and no need for Web3 wallets.
            We are actively working on listings with major platforms.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {cexes.map((cex) => (
              <div key={cex.name} className="bg-slate-900/50 rounded-lg p-6 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white mb-1">{cex.name}</div>
                  <div className="text-sm text-slate-400">{cex.status}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Wallet className="w-8 h-8 text-green-400" />
            <h2 className="text-3xl font-bold text-white">Add AAIC to MetaMask</h2>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-6 space-y-4">
            <p className="text-slate-300">
              To see AAIC in your MetaMask wallet, add it as a custom token:
            </p>

            <ol className="space-y-3 text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold">1.</span>
                <span>Open MetaMask and click "Import Tokens" at the bottom</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold">2.</span>
                <span>Select "Custom Token" tab</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold">3.</span>
                <span>Paste the AAIC contract address</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold">4.</span>
                <span>Token symbol (AAIC) and decimals (18) should auto-fill</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold">5.</span>
                <span>Click "Add Custom Token" then "Import Tokens"</span>
              </li>
            </ol>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-400 mb-1">Token Symbol</div>
                  <div className="text-white font-mono">AAIC</div>
                </div>
                <div>
                  <div className="text-slate-400 mb-1">Decimals</div>
                  <div className="text-white font-mono">18</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-8 h-8 text-yellow-400" />
            <h2 className="text-3xl font-bold text-white">Gas Fee Estimator</h2>
          </div>

          <p className="text-slate-300 mb-6">
            Gas fees vary based on network congestion. Check current rates before swapping:
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-6">
              <div className="text-sm text-slate-400 mb-2">Slow (5-10 min)</div>
              <div className="text-2xl font-bold text-white mb-1">~$5</div>
              <div className="text-xs text-slate-500">20 Gwei</div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-6 ring-2 ring-cyan-500">
              <div className="text-sm text-slate-400 mb-2">Standard (2-3 min)</div>
              <div className="text-2xl font-bold text-cyan-400 mb-1">~$8</div>
              <div className="text-xs text-slate-500">35 Gwei</div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-6">
              <div className="text-sm text-slate-400 mb-2">Fast (30 sec)</div>
              <div className="text-2xl font-bold text-white mb-1">~$12</div>
              <div className="text-xs text-slate-500">50 Gwei</div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            <Info className="w-4 h-4" />
            <span>Gas fees shown are estimates for Ethereum mainnet. Actual costs may vary.</span>
          </div>
        </section>

        <section className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-red-400" />
            <h2 className="text-3xl font-bold text-white">Security Warnings</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Always Verify Contract Address</h3>
              <p className="text-sm text-slate-300">
                Scammers create fake tokens with similar names. Only use the official contract address published
                on this website and our official social media channels. Never trust addresses from unknown sources.
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Beware of Fake Support</h3>
              <p className="text-sm text-slate-300">
                We will never ask for your seed phrase or private keys. Admins will never DM you first on Discord
                or Telegram. Any unsolicited messages offering help are likely scams.
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Double-Check URLs</h3>
              <p className="text-sm text-slate-300">
                Phishing sites copy legitimate DEX interfaces. Always verify you're on the correct URL before
                connecting your wallet. Bookmark official sites for quick access.
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Start with Small Amounts</h3>
              <p className="text-sm text-slate-300">
                If you're new to DEX trading, start with a small test transaction to understand the process.
                Only invest what you can afford to lose. Cryptocurrency trading carries significant risk.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Help?</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            If you have questions about buying AAIC or encounter any issues, join our community channels
            for support from the team and experienced community members.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/community/contact"
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              Get Support
            </a>
            <a
              href="/community/faq"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              Read FAQ
            </a>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
