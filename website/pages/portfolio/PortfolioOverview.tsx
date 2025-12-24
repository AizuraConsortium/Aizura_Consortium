import { useState } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  TrendingUp, Users, DollarSign, Zap, Building2, Rocket, Code,
  Filter, ArrowRight, CircleDot, Sparkles, BarChart3, TrendingDown
} from 'lucide-react';

type StatusFilter = 'all' | 'live' | 'development' | 'coming-soon';
type CategoryFilter = 'all' | 'trading' | 'saas' | 'infrastructure' | 'data';
type TimelineFilter = 'all' | 'live' | '2026' | '2027+';

interface Project {
  name: string;
  tagline: string;
  description: string;
  status: 'live' | 'development' | 'coming-soon';
  category: 'trading' | 'saas' | 'infrastructure' | 'data';
  path: string;
  version: string;
  revenue: string;
  timeline: string;
  icon: React.ReactNode;
  revenueContributing: boolean;
}

export default function PortfolioOverview() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('all');

  const projects: Project[] = [
    {
      name: 'AI Traders',
      tagline: 'Autonomous AI agents trading crypto markets',
      description: 'AI-powered trading platform with autonomous execution and real-time market analysis',
      status: 'live',
      category: 'trading',
      path: '/portfolio/ai-traders',
      version: 'V1 Live',
      revenue: '$45k/mo',
      timeline: 'live',
      icon: <TrendingUp className="w-6 h-6" />,
      revenueContributing: true,
    },
    {
      name: 'AI Web Development',
      tagline: 'AI-powered development tools and platforms',
      description: 'Advanced AI coding assistants and automated development workflows',
      status: 'live',
      category: 'saas',
      path: '/portfolio/ai-web-dev',
      version: 'V1 Live',
      revenue: '$32k/mo',
      timeline: 'live',
      icon: <Code className="w-6 h-6" />,
      revenueContributing: true,
    },
    {
      name: 'AI Business Factory',
      tagline: 'Consortium engine commercialization',
      description: 'The core AI system that builds and operates businesses, being packaged for external use',
      status: 'development',
      category: 'infrastructure',
      path: '/portfolio/ai-business-factory',
      version: 'Internal → Public Q3 2026',
      revenue: 'Pre-revenue',
      timeline: '2026',
      icon: <Building2 className="w-6 h-6" />,
      revenueContributing: false,
    },
    {
      name: 'Coinfusion',
      tagline: 'Crypto data aggregation platform',
      description: 'Real-time cryptocurrency data, analytics, and market intelligence platform',
      status: 'development',
      category: 'data',
      path: '/portfolio/coinfusion',
      version: 'In Development',
      revenue: 'Pre-revenue',
      timeline: '2026',
      icon: <BarChart3 className="w-6 h-6" />,
      revenueContributing: false,
    },
    {
      name: 'Q4 2026 Flagship',
      tagline: 'Major ecosystem launch',
      description: 'Large-scale project designed to significantly expand ecosystem reach and revenue',
      status: 'coming-soon',
      category: 'saas',
      path: '/portfolio/flagship-q4-2026',
      version: 'Coming Soon',
      revenue: 'TBA',
      timeline: '2026',
      icon: <Rocket className="w-6 h-6" />,
      revenueContributing: false,
    },
  ];

  const filteredProjects = projects.filter(project => {
    if (statusFilter !== 'all' && project.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && project.category !== categoryFilter) return false;
    if (timelineFilter !== 'all' && project.timeline !== timelineFilter) return false;
    return true;
  });

  const liveCount = projects.filter(p => p.status === 'live').length;
  const devCount = projects.filter(p => p.status === 'development').length;
  const comingSoonCount = projects.filter(p => p.status === 'coming-soon').length;

  return (
    <PageLayout>
      <div className="space-y-20">
        <section className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            A growing portfolio of{' '}
            <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI-managed businesses
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-4">
            Each business is proposed by the community, built and operated by autonomous AI agents,
            and governed by token holders.
          </p>
          <p className="text-lg text-cyan-400 font-medium">
            Some products are live today. Others are scaling. More are coming.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Portfolio Snapshot</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<Building2 className="w-10 h-10 text-cyan-400" />}
              value={projects.length.toString()}
              label="Total Businesses"
              sublabel="In Portfolio"
            />
            <StatCard
              icon={<CircleDot className="w-10 h-10 text-green-400" />}
              value={liveCount.toString()}
              label="Live Businesses"
              sublabel="Generating Revenue"
            />
            <StatCard
              icon={<Code className="w-10 h-10 text-yellow-400" />}
              value={devCount.toString()}
              label="In Development"
              sublabel="Building Now"
            />
            <StatCard
              icon={<Rocket className="w-10 h-10 text-blue-400" />}
              value={comingSoonCount.toString()}
              label="Coming Soon"
              sublabel="Planned"
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <StatCard
              icon={<DollarSign className="w-10 h-10 text-green-400" />}
              value="$77k"
              label="Monthly Revenue"
              sublabel="Live (Estimated)"
              badge="Live"
            />
            <StatCard
              icon={<TrendingUp className="w-10 h-10 text-cyan-400" />}
              value="12"
              label="Proposals Approved"
              sublabel="By Governance"
            />
            <StatCard
              icon={<Users className="w-10 h-10 text-purple-400" />}
              value="6"
              label="AI Agents Deployed"
              sublabel="Autonomous Systems"
            />
            <StatCard
              icon={<Zap className="w-10 h-10 text-yellow-400" />}
              value="+21%"
              label="Avg Growth Rate"
              sublabel="Month over Month"
            />
          </div>
        </section>

        <section>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <h2 className="text-3xl font-bold text-white">All Businesses</h2>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">Filters:</span>
              </div>

              <FilterGroup label="Status">
                <FilterButton active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>All</FilterButton>
                <FilterButton active={statusFilter === 'live'} onClick={() => setStatusFilter('live')}>Live</FilterButton>
                <FilterButton active={statusFilter === 'development'} onClick={() => setStatusFilter('development')}>In Dev</FilterButton>
                <FilterButton active={statusFilter === 'coming-soon'} onClick={() => setStatusFilter('coming-soon')}>Coming</FilterButton>
              </FilterGroup>

              <FilterGroup label="Category">
                <FilterButton active={categoryFilter === 'all'} onClick={() => setCategoryFilter('all')}>All</FilterButton>
                <FilterButton active={categoryFilter === 'trading'} onClick={() => setCategoryFilter('trading')}>Trading</FilterButton>
                <FilterButton active={categoryFilter === 'saas'} onClick={() => setCategoryFilter('saas')}>SaaS</FilterButton>
                <FilterButton active={categoryFilter === 'infrastructure'} onClick={() => setCategoryFilter('infrastructure')}>Infra</FilterButton>
                <FilterButton active={categoryFilter === 'data'} onClick={() => setCategoryFilter('data')}>Data</FilterButton>
              </FilterGroup>

              <FilterGroup label="Timeline">
                <FilterButton active={timelineFilter === 'all'} onClick={() => setTimelineFilter('all')}>All</FilterButton>
                <FilterButton active={timelineFilter === 'live'} onClick={() => setTimelineFilter('live')}>Live</FilterButton>
                <FilterButton active={timelineFilter === '2026'} onClick={() => setTimelineFilter('2026')}>2026</FilterButton>
                <FilterButton active={timelineFilter === '2027+'} onClick={() => setTimelineFilter('2027+')}>2027+</FilterButton>
              </FilterGroup>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.path} project={project} />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No projects match the selected filters.</p>
            </div>
          )}
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            How portfolio value compounds across the ecosystem
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <FlowStep
              number="1"
              title="Businesses Generate Revenue"
              description="Live AI-managed businesses produce real revenue from customers and users"
            />
            <FlowStep
              number="2"
              title="Revenue Flows to Treasury"
              description="Earnings are collected in the ecosystem treasury, fully transparent and governed"
            />
            <FlowStep
              number="3"
              title="Governed Distribution"
              description="Token holders vote on how revenue is allocated across ecosystem priorities"
            />
            <FlowStep
              number="4"
              title="Token Buybacks"
              description="Portions used to buy back tokens from the market, creating demand"
            />
            <FlowStep
              number="5"
              title="Strategic Burns"
              description="Deflationary mechanism removes tokens from circulation, increasing scarcity"
            />
            <FlowStep
              number="6"
              title="Rewards & Growth"
              description="Proposers, voters, and contributors earn rewards. New proposals funded."
            />
          </div>

          <div className="flex items-center justify-center gap-3 text-cyan-400 font-medium text-lg mb-8">
            <TrendingUp className="w-5 h-5" />
            <span>Ecosystem grows → Token utility + value increase</span>
          </div>

          <div className="text-center">
            <Link
              to="/token/tokenomics"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              See token mechanics
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="bg-linear-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Every business here started as a proposal.
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            The community proposes. Token holders vote. AI agents build and operate. Everyone benefits from the upside.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/launchpad"
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors"
            >
              View Launchpad
            </Link>
            <Link
              to="/launchpad/submit"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Submit a Proposal
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function StatCard({
  icon,
  value,
  label,
  sublabel,
  badge
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
}) {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center relative">
      {badge && (
        <span className="absolute top-3 right-3 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
          {badge}
        </span>
      )}
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-300">{label}</div>
      {sublabel && <div className="text-xs text-slate-500 mt-1">{sublabel}</div>}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2">
      <span className="text-xs text-slate-400">{label}:</span>
      <div className="flex gap-1">{children}</div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
        active
          ? 'bg-cyan-600 text-white'
          : 'text-slate-400 hover:text-white hover:bg-slate-700'
      }`}
    >
      {children}
    </button>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const statusConfig = {
    live: { color: 'green', label: '🟢 Live', bg: 'bg-green-500/20 text-green-400' },
    development: { color: 'yellow', label: '🟡 In Development', bg: 'bg-yellow-500/20 text-yellow-400' },
    'coming-soon': { color: 'blue', label: '🔵 Coming Soon', bg: 'bg-blue-500/20 text-blue-400' },
  };

  const status = statusConfig[project.status];

  return (
    <Link
      to={project.path}
      className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all hover:scale-105 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-slate-700/50 rounded-lg text-cyan-400">
          {project.icon}
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.bg}`}>
          {status.label}
        </span>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
        {project.name}
      </h3>

      <p className="text-sm text-cyan-400 mb-3 font-medium">{project.tagline}</p>

      <p className="text-sm text-slate-300 mb-4 line-clamp-2">{project.description}</p>

      <div className="space-y-2 text-xs mb-4">
        <div className="flex justify-between">
          <span className="text-slate-400">Version</span>
          <span className="text-white font-medium">{project.version}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Revenue</span>
          <span className={project.revenueContributing ? 'text-green-400 font-medium' : 'text-slate-400'}>
            {project.revenue}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-700">
        <div className="text-xs text-slate-400 mb-2">Governance</div>
        <div className="text-xs text-slate-300">Governed by token holders</div>
      </div>

      <div className="mt-4 flex items-center justify-between text-cyan-400 text-sm font-medium">
        <span>View Project</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

function FlowStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="relative">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
          {number}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
          <p className="text-sm text-slate-300">{description}</p>
        </div>
      </div>
    </div>
  );
}
