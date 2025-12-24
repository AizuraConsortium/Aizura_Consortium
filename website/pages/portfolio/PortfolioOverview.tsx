import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, DollarSign, Zap } from 'lucide-react';

export default function PortfolioOverview() {
  const businesses = [
    { name: 'AI Traders', status: 'Live', path: '/portfolio/ai-traders', revenue: '$45k/mo', growth: '+23%' },
    { name: 'AI Web Dev Platform', status: 'Live', path: '/portfolio/ai-web-dev', revenue: '$32k/mo', growth: '+18%' },
    { name: 'AI Business Factory', status: 'Internal', path: '/portfolio/ai-business-factory', revenue: 'N/A', growth: 'Q3 2026' },
    { name: 'Coinfusion', status: 'In Progress', path: '/portfolio/coinfusion', revenue: 'Pending', growth: 'Q4 2026' },
    { name: 'Q4 2026 Flagship', status: 'Coming Soon', path: '/portfolio/flagship-q4-2026', revenue: 'TBA', growth: 'Q4 2026' },
  ];

  return (
    <PageLayout title="Portfolio" description="All ecosystem businesses and their metrics">
      <div className="space-y-12">
        <section className="grid md:grid-cols-4 gap-6" id="metrics">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center">
            <TrendingUp className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">$77k</div>
            <div className="text-sm text-slate-400">Monthly Revenue</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center">
            <Users className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">12.5k</div>
            <div className="text-sm text-slate-400">Active Users</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center">
            <DollarSign className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">$340k</div>
            <div className="text-sm text-slate-400">Total Revenue</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center">
            <Zap className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">+21%</div>
            <div className="text-sm text-slate-400">Avg Growth Rate</div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8">All Businesses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <Link
                key={business.path}
                to={business.path}
                className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{business.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    business.status === 'Live' ? 'bg-green-500/20 text-green-400' :
                    business.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                    business.status === 'Internal' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-slate-600/20 text-slate-400'
                  }`}>
                    {business.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Revenue</span>
                    <span className="text-white">{business.revenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Growth</span>
                    <span className="text-cyan-400">{business.growth}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
