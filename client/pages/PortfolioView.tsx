import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Briefcase, TrendingUp, CheckCircle, Clock, AlertCircle, ExternalLink } from 'lucide-react';

export default function PortfolioView() {
  const portfolioOverview = {
    totalBusinesses: 4,
    revenueGenerating: 2,
    preRevenue: 2,
    yourExposure: 'Governance + Voting Participation'
  };

  const businesses = [
    {
      id: '1',
      name: 'AI Traders',
      status: 'generating_revenue',
      exposureSource: 'Voted on proposal',
      revenueStatus: 'Active - $12,500/mo',
      progress: 100
    },
    {
      id: '2',
      name: 'Coinfusion',
      status: 'generating_revenue',
      exposureSource: 'Voted on proposal',
      revenueStatus: 'Active - $8,300/mo',
      progress: 100
    },
    {
      id: '3',
      name: 'AI Web Dev Platform',
      status: 'pre_revenue',
      exposureSource: 'Submitted proposal',
      revenueStatus: 'Development - 65% complete',
      progress: 65
    },
    {
      id: '4',
      name: 'Automated Content Generation',
      status: 'pre_revenue',
      exposureSource: 'Submitted proposal',
      revenueStatus: 'Planning - 25% complete',
      progress: 25
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio</h1>
          <p className="text-slate-400">Businesses you're exposed to through governance participation</p>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white mb-2">Important: You Don't Own Equity Directly</h3>
              <p className="text-sm text-slate-300">
                Your portfolio exposure is through governance rights and reward participation, not direct equity ownership.
                Value accrues through token buybacks, burns, and ecosystem distributions.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="text-sm text-slate-400 mb-2">Total Businesses</div>
            <div className="text-3xl font-bold text-white">{portfolioOverview.totalBusinesses}</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <div className="text-sm text-slate-400 mb-2">Revenue-Generating</div>
            <div className="text-3xl font-bold text-green-400">{portfolioOverview.revenueGenerating}</div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <div className="text-sm text-slate-400 mb-2">Pre-Revenue</div>
            <div className="text-3xl font-bold text-blue-400">{portfolioOverview.preRevenue}</div>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
            <div className="text-sm text-slate-400 mb-2">Your Exposure</div>
            <div className="text-sm font-bold text-cyan-400">{portfolioOverview.yourExposure}</div>
          </div>
        </div>

        <div className="space-y-4">
          {businesses.map((business) => (
            <div
              key={business.id}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Briefcase className="w-6 h-6 text-cyan-400" />
                    <h3 className="font-bold text-white text-lg">{business.name}</h3>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      business.status === 'generating_revenue'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {business.status === 'generating_revenue' ? (
                        <>
                          <TrendingUp className="w-4 h-4 inline mr-1" />
                          Revenue-Generating
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 inline mr-1" />
                          Pre-Revenue
                        </>
                      )}
                    </span>
                    <span className="text-sm text-slate-400">
                      Exposure: {business.exposureSource}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-400">Status</span>
                  <span className="text-white font-medium">{business.revenueStatus}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${business.progress}%` }}
                  />
                </div>
              </div>

              <Link
                to={`/portfolio/${business.id}`}
                className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium"
              >
                View Business Details
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl p-8 text-center">
          <Briefcase className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">View Full Portfolio</h3>
          <p className="text-slate-300 mb-6">
            Explore all businesses in the ecosystem and their performance
          </p>
          <a
            href="/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
          >
            Open Portfolio
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
