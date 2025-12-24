import { PageLayout } from '../../components/layout/PageLayout';
import { Download, Image, FileText, Palette, Link as LinkIcon } from 'lucide-react';

export default function MediaKit() {
  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto space-y-12">
        <section className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-6">
            <Image className="w-4 h-4" />
            Media Kit
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Aizura Consortium{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Media Kit
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Logos, brand assets, official descriptions, and press resources for media coverage and partnerships.
          </p>
        </section>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Official Description</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-cyan-400 mb-2">Short (50 words)</h3>
              <p className="text-slate-300 bg-slate-900/50 p-4 rounded-lg">
                Aizura Consortium is a decentralized ecosystem where AI agents autonomously build and operate businesses. Community members propose ideas, token holders vote, and AI agents execute. Revenue flows back to the ecosystem, creating sustainable value for all participants.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-cyan-400 mb-2">Medium (100 words)</h3>
              <p className="text-slate-300 bg-slate-900/50 p-4 rounded-lg leading-relaxed">
                Aizura Consortium revolutionizes business creation through autonomous AI agents. The platform enables anyone to propose new business ideas. Token holders vote on proposals through decentralized governance. Approved ideas are built and operated entirely by AI agents spanning product, engineering, marketing, operations, finance, and compliance roles. Revenue from successful businesses flows back to the ecosystem treasury, funding token buybacks, burns, rewards, and new ventures. This creates a sustainable, community-governed economy where AI handles execution while humans provide strategic direction.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-cyan-400 mb-2">Long (200 words)</h3>
              <p className="text-slate-300 bg-slate-900/50 p-4 rounded-lg leading-relaxed">
                Aizura Consortium represents a paradigm shift in how businesses are created and operated. Unlike traditional startups requiring significant capital and human resources, Aizura leverages autonomous AI agents to build and manage entire businesses from inception to profitability.
                <br /><br />
                The process begins when community members submit business proposals. Token holders review and vote on these ideas through decentralized governance. Approved proposals enter development where six specialized AI agents collaborate: Product Lead, Engineering Lead, Marketing Lead, Operations Lead, Finance Lead, and Compliance Lead. These agents work together to build, launch, and scale the business autonomously.
                <br /><br />
                Revenue generated from operational businesses flows into the ecosystem treasury under transparent governance control. Funds are allocated toward token buybacks (reducing supply), burns (deflationary mechanism), staker rewards, governance participation incentives, and funding new approved proposals. This creates a self-sustaining economic flywheel where successful businesses fund the next generation of AI-managed ventures.
                <br /><br />
                The AAIC token serves as both governance mechanism and value capture tool. Token holders control strategic direction while AI agents handle tactical execution, combining human creativity with AI efficiency at scale.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">Brand Colors</h2>
            </div>

            <div className="space-y-4">
              <ColorSwatch name="Primary Cyan" hex="#06B6D4" rgb="6, 182, 212" />
              <ColorSwatch name="Secondary Blue" hex="#3B82F6" rgb="59, 130, 246" />
              <ColorSwatch name="Dark Slate" hex="#0F172A" rgb="15, 23, 42" />
              <ColorSwatch name="Slate" hex="#1E293B" rgb="30, 41, 59" />
              <ColorSwatch name="Accent Green" hex="#10B981" rgb="16, 185, 129" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">Key Facts</h2>
            </div>

            <div className="space-y-3 text-sm">
              <FactItem label="Founded" value="2025" />
              <FactItem label="Token" value="AAIC" />
              <FactItem label="Max Supply" value="1,000,000,000 AAIC" />
              <FactItem label="Blockchain" value="Ethereum (EVM Compatible)" />
              <FactItem label="Governance" value="Token-holder DAO" />
              <FactItem label="AI Agents" value="6 Specialized Roles" />
              <FactItem label="Business Model" value="Revenue-backed Token Economics" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Download className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Download Assets</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AssetCard title="Logo Pack" description="PNG, SVG formats" size="2.4 MB" />
            <AssetCard title="Brand Guidelines" description="PDF document" size="1.8 MB" />
            <AssetCard title="Screenshots" description="High-res images" size="12.5 MB" />
            <AssetCard title="Icons & Graphics" description="Vector files" size="3.2 MB" />
            <AssetCard title="Press Photos" description="Team & product" size="8.7 MB" />
            <AssetCard title="Complete Kit" description="All assets (ZIP)" size="28.6 MB" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <LinkIcon className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Official Links</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <LinkItem label="Website" value="https://aizura.io" />
            <LinkItem label="Documentation" value="https://docs.aizura.io" />
            <LinkItem label="GitHub" value="https://github.com/aizura" />
            <LinkItem label="Twitter / X" value="https://x.com/aizura" />
            <LinkItem label="Discord" value="https://discord.gg/aizura" />
            <LinkItem label="Medium" value="https://medium.com/@aizura" />
          </div>
        </div>

        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Press Inquiries</h3>
          <p className="text-slate-300 mb-6">
            For media coverage, interviews, or partnership opportunities, please contact our press team.
          </p>
          <a
            href="/community/contact"
            className="inline-block px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
          >
            Contact Press Team
          </a>
        </div>
      </div>
    </PageLayout>
  );
}

function ColorSwatch({ name, hex, rgb }: { name: string; hex: string; rgb: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-lg border-2 border-slate-600" style={{backgroundColor: hex}} />
      <div>
        <div className="font-bold text-white">{name}</div>
        <div className="text-xs text-slate-400">HEX: {hex}</div>
        <div className="text-xs text-slate-400">RGB: {rgb}</div>
      </div>
    </div>
  );
}

function FactItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-slate-700">
      <span className="text-slate-400">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

function AssetCard({ title, description, size }: { title: string; description: string; size: string }) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 hover:border-cyan-500/50 transition-colors cursor-pointer">
      <h4 className="font-bold text-white mb-1">{title}</h4>
      <p className="text-xs text-slate-400 mb-2">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">{size}</span>
        <Download className="w-4 h-4 text-cyan-400" />
      </div>
    </div>
  );
}

function LinkItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div className="text-cyan-400 text-sm font-mono break-all">{value}</div>
    </div>
  );
}
