import { PageLayout } from '../../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import {
  Code, ExternalLink, ArrowRight, CheckCircle2, Clock,
  Shield, Users, Sparkles, Eye, TrendingUp,
  Layers, Rocket, MonitorSmartphone
} from 'lucide-react';

export default function AIWebDevelopmentPlatform() {
  return (
    <PageLayout>
      <div className="space-y-20">
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live — V1
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            AI Web Development Platform
          </h1>

          <p className="text-2xl text-cyan-400 mb-6 font-medium">
            AI-powered web development that builds production-ready applications from prompts.
          </p>

          <p className="text-lg text-slate-300 mb-8">
            V2 with advanced features coming soon
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors">
              Try Platform
              <ExternalLink className="w-5 h-5" />
            </button>
            <a
              href="#roadmap"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
            >
              View Roadmap
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">What is the AI Web Development Platform?</h2>

          <p className="text-lg text-slate-300 mb-6 max-w-3xl mx-auto">
            The AI Web Development Platform allows users to describe web applications in natural language,
            and autonomous AI agents write the code, deploy infrastructure, and deliver production-ready
            applications — without traditional development teams.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <FeatureCard
              icon={<Code className="w-8 h-8 text-blue-400" />}
              title="Natural Language Input"
              description="Describe your app in plain English — AI handles the rest"
            />
            <FeatureCard
              icon={<Rocket className="w-8 h-8 text-green-400" />}
              title="Rapid Deployment"
              description="From concept to live application in minutes"
            />
            <FeatureCard
              icon={<Layers className="w-8 h-8 text-purple-400" />}
              title="Full Stack"
              description="Frontend, backend, database, and hosting included"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-cyan-400" />}
              title="Production Quality"
              description="Built with security, performance, and best practices"
            />
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How It Works</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <StepCard
              number="1"
              title="Describe Your Vision"
              items={[
                'Write your app requirements in natural language',
                'No coding or technical knowledge required',
                'Include features, design preferences, and functionality',
                'AI interprets and validates your requirements'
              ]}
            />
            <StepCard
              number="2"
              title="AI Builds Your App"
              items={[
                'AI agents generate full codebase architecture',
                'Frontend components created with modern frameworks',
                'Backend APIs and database schemas built automatically',
                'Best practices and security built-in from the start'
              ]}
            />
            <StepCard
              number="3"
              title="Review & Iterate"
              items={[
                'Preview your application in real-time',
                'Request changes or additions in natural language',
                'AI refactors and updates the codebase instantly',
                'Iterate until the app matches your vision'
              ]}
            />
            <StepCard
              number="4"
              title="Deploy & Scale"
              items={[
                'One-click deployment to production infrastructure',
                'Automatic scaling and performance optimization',
                'Continuous monitoring and maintenance',
                'Easy updates through conversational interface'
              ]}
            />
          </div>

          <div className="mt-8 p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">The Key Difference</h3>
                <p className="text-slate-300">
                  Unlike traditional no-code platforms with rigid templates, our AI writes real code
                  that can be customized infinitely. You get full ownership and flexibility without
                  platform lock-in.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Current Version: V1</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                V1 Includes
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>React frontends with modern component architecture</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Express.js backends with RESTful APIs</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>PostgreSQL databases with optimized schemas</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Responsive design with Tailwind CSS</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Authentication and user management</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Basic hosting and deployment</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-yellow-400" />
                V1 Limitations
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Limited to web applications (no mobile apps yet)</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Standard tech stack (custom frameworks coming in V2)</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Basic integrations (advanced APIs and services in V2)</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Manual scaling for high-traffic applications</span>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-slate-700/30 border border-slate-600 rounded-lg">
                <p className="text-sm text-slate-300 italic">
                  We believe in transparent capabilities. V1 is powerful for most use cases, and
                  V2 will expand to enterprise-scale needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Use Cases</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UseCaseCard
              title="SaaS Products"
              description="Build subscription platforms, dashboards, and business tools without development teams"
              examples={['Project management tools', 'Analytics dashboards', 'CRM systems']}
            />
            <UseCaseCard
              title="E-Commerce"
              description="Launch online stores with product catalogs, checkout, and order management"
              examples={['Online marketplaces', 'Digital product stores', 'Subscription boxes']}
            />
            <UseCaseCard
              title="Internal Tools"
              description="Create custom business applications for operations, workflows, and data management"
              examples={['Admin panels', 'Inventory systems', 'Workflow automation']}
            />
            <UseCaseCard
              title="Marketing Sites"
              description="Deploy landing pages, portfolio sites, and content platforms"
              examples={['Product launches', 'Portfolio sites', 'Blog platforms']}
            />
            <UseCaseCard
              title="Community Platforms"
              description="Build forums, social networks, and collaborative spaces"
              examples={['Member communities', 'Discussion boards', 'Event platforms']}
            />
            <UseCaseCard
              title="MVPs & Prototypes"
              description="Validate ideas quickly with functional prototypes and minimum viable products"
              examples={['Startup MVPs', 'Proof of concepts', 'Demo applications']}
            />
          </div>
        </section>

        <section id="roadmap" className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Roadmap</h2>

          <div className="space-y-6">
            <RoadmapPhase
              phase="V2"
              timeline="Coming Soon"
              status="planned"
              features={[
                'Mobile app development (iOS and Android)',
                'Custom framework and language support',
                'Advanced third-party integrations (payments, analytics, CRM)',
                'AI-powered automated testing and quality assurance',
                'Team collaboration and version control',
                'Enterprise-grade security and compliance features',
                'Custom design systems and brand integration',
                'Performance optimization and auto-scaling',
              ]}
            />

            <RoadmapPhase
              phase="Future Vision"
              timeline="2027+"
              status="vision"
              features={[
                'Multi-platform development (web, mobile, desktop, blockchain)',
                'Real-time collaborative editing with AI assistance',
                'Predictive maintenance and self-healing applications',
                'Integration with the broader AI Business Factory ecosystem',
                'AI learns from every app built to improve future outputs',
                'Custom AI agents specialized for different industries',
              ]}
            />
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Role in the Ecosystem
          </h2>

          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-slate-300 mb-8 text-center">
              The AI Web Development Platform is a key revenue driver for the ecosystem.
            </p>

            <div className="space-y-4">
              <FlowItem
                icon={<Code className="w-6 h-6 text-blue-400" />}
                title="Subscription Revenue"
                description="Monthly and annual plans generate recurring revenue for the treasury"
              />
              <FlowItem
                icon={<TrendingUp className="w-6 h-6 text-green-400" />}
                title="Treasury Distribution"
                description="Platform revenue flows into ecosystem treasury for token holder benefit"
              />
              <FlowItem
                icon={<Users className="w-6 h-6 text-purple-400" />}
                title="Token Utility"
                description="Token holders receive governance rights and revenue share from platform success"
              />
              <FlowItem
                icon={<Sparkles className="w-6 h-6 text-yellow-400" />}
                title="Ecosystem Growth"
                description="More users and revenue strengthen the entire ecosystem and token value"
              />
            </div>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Status & Transparency
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatusCard
              icon={<CheckCircle2 className="w-8 h-8 text-green-400" />}
              label="Status"
              value="Live"
              valueColor="text-green-400"
            />
            <StatusCard
              icon={<MonitorSmartphone className="w-8 h-8 text-cyan-400" />}
              label="Platform"
              value="Web Apps"
              valueColor="text-cyan-400"
            />
            <StatusCard
              icon={<Users className="w-8 h-8 text-blue-400" />}
              label="Access"
              value="Public"
              valueColor="text-blue-400"
            />
            <StatusCard
              icon={<Eye className="w-8 h-8 text-purple-400" />}
              label="Next Version"
              value="V2 Coming"
              valueColor="text-purple-400"
            />
          </div>

          <div className="mt-8 text-center space-y-4">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              View Portfolio Overview
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/governance"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors ml-3"
            >
              Participate in Governance
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Build faster. Scale easier. Own everything.
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            The AI Web Development Platform makes building production applications as simple as
            describing what you want in plain English.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg transition-colors">
              Start Building
            </button>
            <Link
              to="/token/airdrop"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Join the Ecosystem
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-300">{description}</p>
    </div>
  );
}

function StepCard({ number, title, items }: { number: string; title: string; items: string[] }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
          {number}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UseCaseCard({ title, description, examples }: { title: string; description: string; examples: string[] }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-300 mb-4 text-sm">{description}</p>
      <div className="space-y-2">
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Examples:</p>
        <ul className="space-y-1">
          {examples.map((example, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
              <div className="w-1 h-1 bg-cyan-400 rounded-full" />
              {example}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RoadmapPhase({
  phase,
  timeline,
  status,
  features
}: {
  phase: string;
  timeline: string;
  status: 'planned' | 'vision';
  features: string[];
}) {
  const statusConfig = {
    planned: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Planned' },
    vision: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Vision' },
  };

  const config = statusConfig[status];

  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">{phase}</h3>
          <p className="text-slate-400">{timeline}</p>
        </div>
        <span className={`px-3 py-1 ${config.bg} ${config.text} text-sm font-medium rounded-full w-fit`}>
          {config.label}
        </span>
      </div>

      <ul className="space-y-3">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 text-slate-300">
            <ArrowRight className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FlowItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
        <p className="text-sm text-slate-300">{description}</p>
      </div>
    </div>
  );
}

function StatusCard({
  icon,
  label,
  value,
  valueColor
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor: string;
}) {
  return (
    <div className="bg-slate-700/30 backdrop-blur border border-slate-600 rounded-xl p-6 text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="text-sm text-slate-400 mb-1">{label}</div>
      <div className={`text-lg font-bold ${valueColor}`}>{value}</div>
    </div>
  );
}
