import { PageLayout } from '../../components/layout/PageLayout';
import { useState, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, Users, Flame,
  PieChart, Lock, Activity, Zap, ExternalLink, ArrowUpRight,
  ArrowDownRight, AlertCircle, BarChart3, Coins
} from 'lucide-react';

type TimeFrame = '1D' | '7D' | '30D' | '90D' | '1Y' | 'ALL';

const generateMockPriceData = (timeframe: TimeFrame) => {
  const now = Date.now();
  let points = 24;
  let interval = 3600000;

  switch (timeframe) {
    case '1D': points = 24; interval = 3600000; break;
    case '7D': points = 168; interval = 3600000; break;
    case '30D': points = 30; interval = 86400000; break;
    case '90D': points = 90; interval = 86400000; break;
    case '1Y': points = 365; interval = 86400000; break;
    case 'ALL': points = 500; interval = 86400000; break;
  }

  const basePrice = 1.25;
  const volatility = 0.08;

  return Array.from({ length: points }, (_, i) => {
    const timestamp = now - (points - i - 1) * interval;
    const trend = (i / points) * 0.3;
    const noise = (Math.random() - 0.5) * volatility;
    const price = basePrice * (1 + trend + noise);

    return {
      timestamp,
      price: Number(price.toFixed(4)),
      volume: Math.floor(Math.random() * 5000000) + 1000000,
    };
  });
};

const generateRecentTransactions = () => {
  const types = ['Buy', 'Sell', 'Transfer', 'Stake', 'Unstake'];
  const now = Date.now();

  return Array.from({ length: 20 }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const amount = Math.floor(Math.random() * 50000) + 1000;
    const usdValue = (amount * 1.25).toFixed(2);

    return {
      id: `0x${Math.random().toString(16).slice(2, 10)}`,
      type,
      amount: amount.toLocaleString(),
      usdValue,
      from: `0x${Math.random().toString(16).slice(2, 10)}`,
      to: `0x${Math.random().toString(16).slice(2, 10)}`,
      timestamp: now - i * 45000,
      txHash: `0x${Math.random().toString(16).slice(2)}`,
    };
  });
};

export default function LiveMetrics() {
  const [timeframe, setTimeframe] = useState<TimeFrame>('7D');
  const priceData = useMemo(() => generateMockPriceData(timeframe), [timeframe]);
  const transactions = useMemo(() => generateRecentTransactions(), []);

  const currentPrice = 1.25;
  const priceChange24h = 8.43;
  const marketCap = 375000000;
  const volume24h = 12500000;
  const circulatingSupply = 30000000;
  const totalSupply = 100000000;
  const holders = 8547;
  const totalBurned = 5000000;
  const treasuryBalance = 5000000;
  const totalStaked = 150000000;
  const stakingAPY = 18.5;

  const latestPrice = priceData[priceData.length - 1]?.price || currentPrice;
  const oldestPrice = priceData[0]?.price || currentPrice;
  const priceChangePercent = ((latestPrice - oldestPrice) / oldestPrice * 100).toFixed(2);
  const isPositive = Number(priceChangePercent) >= 0;

  const maxPrice = Math.max(...priceData.map(d => d.price));
  const minPrice = Math.min(...priceData.map(d => d.price));
  const priceRange = maxPrice - minPrice;

  const topHolders = [
    { rank: 1, address: '0x1234...5678', balance: '25,000,000', percentage: 2.5 },
    { rank: 2, address: '0xabcd...efgh', balance: '18,500,000', percentage: 1.85 },
    { rank: 3, address: '0x9876...5432', balance: '15,200,000', percentage: 1.52 },
    { rank: 4, address: '0xfedc...ba98', balance: '12,800,000', percentage: 1.28 },
    { rank: 5, address: '0x5555...6666', balance: '10,500,000', percentage: 1.05 },
  ];

  const dexVolumes = [
    { name: 'Uniswap V3', volume: 7500000, percentage: 60, logo: '🦄' },
    { name: 'SushiSwap', volume: 3125000, percentage: 25, logo: '🍣' },
    { name: 'PancakeSwap', volume: 1875000, percentage: 15, logo: '🥞' },
  ];

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <PageLayout>
      <div className="space-y-8">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Pre-Launch Mode: Simulated Data</h3>
              <p className="text-sm text-slate-300">
                These metrics are simulated to demonstrate the dashboard functionality. Upon token launch,
                this page will automatically connect to live blockchain data via smart contract events and DEX APIs.
                All numbers shown here are for visualization purposes only.
              </p>
            </div>
          </div>
        </div>

        <section>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8">
            Live Token{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Metrics
            </span>
          </h1>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Price</span>
                <DollarSign className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">${currentPrice}</div>
              <div className={`flex items-center gap-1 text-sm font-medium ${priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(priceChange24h)}% (24h)
              </div>
            </div>

            <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Market Cap</span>
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                ${(marketCap / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-slate-400">
                FDV: ${(currentPrice * totalSupply / 1000000).toFixed(0)}M
              </div>
            </div>

            <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">24h Volume</span>
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                ${(volume24h / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-slate-400">
                Vol/MCap: {((volume24h / marketCap) * 100).toFixed(1)}%
              </div>
            </div>

            <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Holders</span>
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {holders.toLocaleString()}
              </div>
              <div className="text-sm text-green-400">+124 today</div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Price Chart</h2>
            <div className="flex gap-2">
              {(['1D', '7D', '30D', '90D', '1Y', 'ALL'] as TimeFrame[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                    timeframe === tf
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-white">
                ${latestPrice.toFixed(4)}
              </div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
                isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {isPositive ? '+' : ''}{priceChangePercent}%
              </div>
            </div>
            <div className="text-sm text-slate-400 mt-1">
              {timeframe} change
            </div>
          </div>

          <div className="relative h-80">
            <svg className="w-full h-full" viewBox="0 0 800 320" preserveAspectRatio="none">
              <defs>
                <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={isPositive ? "#06b6d4" : "#ef4444"} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={isPositive ? "#06b6d4" : "#ef4444"} stopOpacity="0" />
                </linearGradient>
              </defs>

              <path
                d={priceData.map((point, i) => {
                  const x = (i / (priceData.length - 1)) * 800;
                  const y = 320 - ((point.price - minPrice) / priceRange) * 280;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                fill="none"
                stroke={isPositive ? "#06b6d4" : "#ef4444"}
                strokeWidth="2"
              />

              <path
                d={`
                  ${priceData.map((point, i) => {
                    const x = (i / (priceData.length - 1)) * 800;
                    const y = 320 - ((point.price - minPrice) / priceRange) * 280;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  L 800 320 L 0 320 Z
                `}
                fill="url(#priceGradient)"
              />
            </svg>

            <div className="absolute inset-0 flex items-end justify-between px-4 pb-2 text-xs text-slate-500">
              <span>{new Date(priceData[0]?.timestamp).toLocaleDateString()}</span>
              <span>{new Date(priceData[priceData.length - 1]?.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Coins className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">Token Supply</h2>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300">Circulating Supply</span>
                  <span className="text-white font-semibold">{(circulatingSupply / 1000000).toFixed(0)}M AAIC</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    style={{ width: `${(circulatingSupply / totalSupply) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {((circulatingSupply / totalSupply) * 100).toFixed(1)}% of total supply
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Total Supply</div>
                  <div className="text-xl font-bold text-white">{(totalSupply / 1000000).toFixed(0)}M</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Max Supply</div>
                  <div className="text-xl font-bold text-white">{(totalSupply / 1000000).toFixed(0)}M</div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Flame className="w-6 h-6 text-orange-400" />
              <h2 className="text-2xl font-bold text-white">Burn Statistics</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-1">Total Burned</div>
                <div className="text-3xl font-bold text-orange-400 mb-2">
                  {(totalBurned / 1000000).toFixed(2)}M AAIC
                </div>
                <div className="text-xs text-slate-400">
                  ${(totalBurned * currentPrice / 1000000).toFixed(2)}M USD value
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Burn Rate</div>
                  <div className="text-xl font-bold text-white">0.5%</div>
                  <div className="text-xs text-slate-400">of supply</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Next Burn</div>
                  <div className="text-xl font-bold text-white">7 days</div>
                  <div className="text-xs text-slate-400">~250K AAIC</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Staking Overview</h2>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300">Total Staked</span>
                  <span className="text-white font-semibold">{(totalStaked / 1000000).toFixed(0)}M AAIC</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: `${(totalStaked / circulatingSupply) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {((totalStaked / circulatingSupply) * 100).toFixed(1)}% of circulating supply
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Current APY</div>
                  <div className="text-2xl font-bold text-green-400">{stakingAPY}%</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Stakers</div>
                  <div className="text-2xl font-bold text-white">2,341</div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white">Treasury</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-1">Total Balance</div>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {(treasuryBalance / 1000000).toFixed(2)}M AAIC
                </div>
                <div className="text-xs text-slate-400">
                  ${(treasuryBalance * currentPrice / 1000000).toFixed(2)}M USD value
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Allocated</div>
                  <div className="text-xl font-bold text-white">2.5M</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Available</div>
                  <div className="text-xl font-bold text-white">2.5M</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Top Holders</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Rank</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Address</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Balance</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {topHolders.map((holder) => (
                  <tr key={holder.rank} className="border-b border-slate-800 hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4 text-slate-300">#{holder.rank}</td>
                    <td className="py-3 px-4">
                      <code className="text-cyan-400 font-mono text-sm">{holder.address}</code>
                    </td>
                    <td className="py-3 px-4 text-right text-white font-medium">{holder.balance} AAIC</td>
                    <td className="py-3 px-4 text-right text-slate-300">{holder.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Trading Volume by DEX</h2>
          </div>

          <div className="space-y-4">
            {dexVolumes.map((dex) => (
              <div key={dex.name} className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{dex.logo}</span>
                    <div>
                      <div className="font-semibold text-white">{dex.name}</div>
                      <div className="text-sm text-slate-400">
                        ${(dex.volume / 1000000).toFixed(2)}M (24h)
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{dex.percentage}%</div>
                    <div className="text-xs text-slate-400">of volume</div>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: `${dex.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Recent Transactions</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm text-slate-400">Live</span>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-slate-900/50 rounded-lg p-4 hover:bg-slate-900/70 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      tx.type === 'Buy' ? 'bg-green-500/20 text-green-400' :
                      tx.type === 'Sell' ? 'bg-red-500/20 text-red-400' :
                      tx.type === 'Stake' ? 'bg-purple-500/20 text-purple-400' :
                      tx.type === 'Unstake' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {tx.type}
                    </span>
                    <span className="text-white font-semibold">{tx.amount} AAIC</span>
                    <span className="text-slate-400 text-sm">${tx.usdValue}</span>
                  </div>
                  <span className="text-sm text-slate-400">{formatTime(tx.timestamp)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <code className="font-mono">{tx.txHash.slice(0, 16)}...</code>
                  <a
                    href={`https://etherscan.io/tx/${tx.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <ExternalLink className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Track on Major Platforms</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-6 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white mb-1">CoinGecko</div>
                <div className="text-sm text-slate-400">Price tracking and charts</div>
              </div>
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded">
                Coming Soon
              </span>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-6 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white mb-1">CoinMarketCap</div>
                <div className="text-sm text-slate-400">Market data and analytics</div>
              </div>
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded">
                Coming Soon
              </span>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-6 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white mb-1">DexTools</div>
                <div className="text-sm text-slate-400">DEX trading analytics</div>
              </div>
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded">
                Coming Soon
              </span>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-6 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white mb-1">Etherscan</div>
                <div className="text-sm text-slate-400">Blockchain explorer</div>
              </div>
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded">
                Coming Soon
              </span>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
