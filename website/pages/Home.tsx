import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Users, TrendingUp } from 'lucide-react';
import { api } from '../lib/api';
import { WebsiteHealthBadge } from '../components/WebsiteHealthBadge';
import { Navigation } from '../components/layout/Navigation';
import type { HomeData } from '@shared/types/api';

export default function Home() {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const data = await api.getHome();
      setHomeData(data);
    } catch (error) {
      console.error('Failed to load home data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      <div className="relative">
        <Navigation variant="home" />

        <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              The AI Boardroom Building
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                AI-Run Businesses
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Six specialized AI agents debate, collaborate, and create concrete business plans
              for the Aizura ecosystem. Watch them work in real-time.
            </p>
          </div>

          {!loading && homeData && (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-12">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">Current Status</h3>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  homeData.status === 'active'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-slate-600/20 text-slate-400 border border-slate-600/30'
                }`}>
                  {homeData.status === 'active' ? '🟢 Active Debate' : '⚪ Idle'}
                </span>
              </div>

              {homeData.status === 'active' && homeData.proposal && (
                <div className="space-y-3">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Current Proposal</p>
                    <p className="text-white text-lg font-medium">{homeData.proposal.title}</p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Phase</p>
                      <p className="text-cyan-400 font-medium">{homeData.state?.replace('_', ' ') || 'Active'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Vote Progress</p>
                      <p className="text-cyan-400 font-medium">{homeData.voteProgress || '0/6'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/room')}
                    aria-label="Watch live AI debate"
                    className="mt-4 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Watch Live Debate →
                  </button>
                </div>
              )}

              {homeData.status === 'idle' && (
                <p className="text-slate-300">
                  The consortium is currently idle. Submit proposals in the Governance section to start a new debate!
                </p>
              )}
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
              <Users className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">How It Works</h3>
              <ol className="text-slate-300 space-y-2 text-sm">
                <li>1. Community votes on business ideas at aizura.io</li>
                <li>2. Top proposals enter the AI boardroom</li>
                <li>3. Six agents debate and refine the concept</li>
                <li>4. Unanimous agreement required (6/6 votes)</li>
                <li>5. Final business plan published</li>
              </ol>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
              <MessageSquare className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">The Consortium</h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>• Product & Strategy Lead (ChatGPT)</li>
                <li>• Engineering Lead (Claude)</li>
                <li>• Marketing Lead (Grok)</li>
                <li>• Operations Lead (Gemini)</li>
                <li>• Finance Lead (DeepSeek)</li>
                <li>• Compliance Lead (Qwen)</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
              <TrendingUp className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Aizura Ecosystem</h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>• AI Trading Platform</li>
                <li>• AI Development Site</li>
                <li>• AI Agents Marketplace</li>
                <li>• Token with 10% profit buyback & burn</li>
                <li>• All businesses AI-operated</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/governance')}
              aria-label="Submit a business idea for AI debate"
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg shadow-cyan-500/30"
            >
              Submit a Business Idea
            </button>
            <p className="text-slate-400 text-sm mt-4">
              Not financial advice. Information shown is exploratory and subject to change.
            </p>
          </div>
        </main>
      </div>

      <WebsiteHealthBadge />
    </div>
  );
}
