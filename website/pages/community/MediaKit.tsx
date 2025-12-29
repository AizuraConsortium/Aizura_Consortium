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
                Aizura Consortium is not a speculative token — it's an AI-native economic engine. AI agents autonomously build and operate businesses with 90% cost reduction vs traditional startups. Failure is capped. Success scales. Revenue flows back to token holders through buybacks, burns, and rewards.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-cyan-400 mb-2">Medium (100 words)</h3>
              <p className="text-slate-300 bg-slate-900/50 p-4 rounded-lg leading-relaxed">
                Aizura Consortium is not a speculative token — it's an AI-native economic engine that inverts traditional startup economics. AI agents reduce operational costs by 90% ($18K-$65K vs $530K-$900K annually), making failure cheap and success scalable. Community members propose business ideas, token holders vote through decentralized governance, and six specialized AI agents (Product, Engineering, Marketing, Operations, Finance, Compliance) build and operate approved businesses autonomously. Revenue flows back to the ecosystem through buybacks, burns, staking rewards, and treasury growth. This creates a sustainable flywheel where AI execution meets human creativity at minimal cost.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-cyan-400 mb-2">Long (200 words)</h3>
              <p className="text-slate-300 bg-slate-900/50 p-4 rounded-lg leading-relaxed">
                Aizura Consortium is not a speculative token — it's an AI-native economic engine that fundamentally inverts traditional startup economics. Traditional startups burn $530K-$900K annually on salaries, managers, and slow iteration cycles. Aizura's AI agents operate businesses for just $18K-$65K per year — a 90% cost reduction. This means failure is capped, success scales infinitely, and even if 100 businesses fail, one scaled winner covers them all.
                <br /><br />
                The process begins when community members propose business ideas. Token holders vote through decentralized governance. Approved proposals are built and operated autonomously by six specialized AI agents: Product Lead, Engineering Lead, Marketing Lead, Operations Lead, Finance Lead, and Compliance Lead. These agents collaborate 24/7, making decisions and scaling successful ventures from 5 agents → 50 agents → 500+ agents as revenue proves viability.
                <br /><br />
                Revenue flows back to the ecosystem through transparent allocation: 15% Buyback, 15% Burn (until 79M burned, reaching 21M final supply for Bitcoin parity), 15% Staking Support, 15% Use-to-Earn Support, 25% Treasury, and 15% Variable (governance-controlled). This creates a self-sustaining flywheel where successful businesses fund the next generation of AI-managed ventures.
                <br /><br />
                The AAIC token provides governance rights and value capture. Token holders control strategic direction while AI agents handle execution, combining human creativity with AI efficiency at minimal cost.
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
              <FactItem label="Max Supply" value="100,000,000 AAIC" />
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
