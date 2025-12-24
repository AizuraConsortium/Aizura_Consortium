import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Menu, X, ChevronDown } from 'lucide-react';
import { DropdownMenu } from './DropdownMenu';
import type { DropdownSection } from './DropdownMenu';

interface NavigationProps {
  onConnectWallet?: () => void;
}

export function Navigation({ onConnectWallet }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const ecosystemDropdown: DropdownSection[] = [
    {
      items: [
        { label: 'Overview', path: '/ecosystem', description: 'AI-managed businesses governed by token holders' },
        { label: 'How It Works', path: '/ecosystem/how-it-works', description: 'The lifecycle from idea to revenue' },
        { label: 'AI Consortium', path: '/ecosystem/ai-consortium', description: 'The 6 AI collaboration model' },
        { label: 'Roadmap', path: '/ecosystem/roadmap', description: 'Timeline and upcoming launches' },
      ],
    },
  ];

  const ecosystemCTA = {
    items: [
      { label: 'Explore Live Portfolio', path: '/portfolio' },
      { label: 'Join Airdrop', path: '/token/airdrop' },
    ],
  };

  const launchpadDropdown: DropdownSection[] = [
    {
      items: [
        { label: 'Launchpad Overview', path: '/launchpad', description: 'View all proposals and participate' },
        { label: 'Submit a Proposal', path: '/launchpad/submit', description: 'Submit your business idea' },
        { label: 'Voting & Rewards', path: '/launchpad/voting-rewards', description: 'How voting weight works' },
        { label: 'Proposal Lifecycle', path: '/launchpad/lifecycle', description: 'The 5 phases explained' },
      ],
    },
  ];

  const launchpadCTA = {
    items: [
      { label: 'View Active Proposals', path: '/launchpad?status=active' },
    ],
  };

  const governanceDropdown: DropdownSection[] = [
    {
      items: [
        { label: 'Governance Overview', path: '/governance', description: 'Human governance vs AI decisions' },
        { label: 'Governance Rules', path: '/governance/rules', description: 'Thresholds and requirements' },
        { label: 'Live Governance', path: '/governance/live', description: 'Real-time proposal votes' },
        { label: 'Treasury & Distributions', path: '/governance/treasury', description: 'Revenue allocation' },
      ],
    },
  ];

  const governanceCTA = {
    items: [
      { label: 'Connect Wallet to Vote', path: '/app' },
    ],
  };

  const portfolioDropdown: DropdownSection[] = [
    {
      items: [
        { label: 'Portfolio Overview', path: '/portfolio', description: 'All businesses and metrics' },
        { label: 'AI Traders', path: '/portfolio/ai-traders', description: 'V1 live, V2 planned Q3 2026' },
        { label: 'AI Business Factory', path: '/portfolio/ai-business-factory', description: 'Consortium Engine' },
        { label: 'AI Web Development', path: '/portfolio/ai-web-dev', description: 'V1 live, V2 advanced coming' },
        { label: 'Coinfusion', path: '/portfolio/coinfusion', description: 'Crypto data platform' },
        { label: 'Q4 2026 Flagship', path: '/portfolio/flagship-q4-2026', description: 'Major project coming soon' },
      ],
    },
  ];

  const portfolioCTA = {
    items: [
      { label: 'See Portfolio Stats', path: '/portfolio#metrics' },
    ],
  };

  const tokenDropdown: DropdownSection[] = [
    {
      items: [
        { label: 'Token Overview', path: '/token', description: 'Utility and governance rights' },
        { label: 'Tokenomics', path: '/token/tokenomics', description: 'Supply and distribution' },
        { label: 'Token Utility', path: '/token/utility', description: '10+ ways to use AAIC' },
        { label: 'Live Metrics', path: '/token/live-metrics', description: 'Real-time price and stats' },
        { label: 'Where to Buy', path: '/token/where-to-buy', description: 'DEX and CEX listings' },
        { label: 'Airdrop', path: '/token/airdrop', description: 'No token sale, only airdrop' },
        { label: 'Staking', path: '/token/staking', description: 'Coming soon' },
        { label: 'Transparency', path: '/token/transparency', description: 'Metrics and distributions' },
      ],
    },
  ];

  const communityDropdown: DropdownSection[] = [
    {
      items: [
        { label: 'Community Hub', path: '/community', description: 'Social links and updates' },
        { label: 'FAQ', path: '/community/faq', description: 'Frequently asked questions' },
        { label: 'Media Kit', path: '/community/media-kit', description: 'Logos and brand assets' },
        { label: 'Contact', path: '/community/contact', description: 'AI-managed support' },
      ],
    },
  ];

  const developersDropdown: DropdownSection[] = [
    {
      items: [
        { label: 'Documentation', path: '/developers/documentation', description: 'Integration guides and API reference' },
        { label: 'Smart Contracts', path: '/blockchain/smart-contracts', description: 'Contract addresses and ABIs' },
        { label: 'Security', path: '/blockchain/security', description: 'Audits and bug bounty program' },
        { label: 'Litepaper', path: '/resources/litepaper', description: 'Technical documentation' },
      ],
    },
  ];

  const toggleMobileSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Sparkles className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold text-white hidden sm:block">AAIC</span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              <Link to="/" className="px-3 py-2 text-sm font-medium text-slate-200 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/room" className="px-3 py-2 text-sm font-medium text-slate-200 hover:text-white transition-colors">
                Live Room
              </Link>
              <DropdownMenu label="Ecosystem" sections={ecosystemDropdown} ctaStrip={ecosystemCTA} />
              <DropdownMenu label="Launchpad" sections={launchpadDropdown} ctaStrip={launchpadCTA} />
              <DropdownMenu label="Governance" sections={governanceDropdown} ctaStrip={governanceCTA} />
              <DropdownMenu label="Portfolio" sections={portfolioDropdown} ctaStrip={portfolioCTA} />
              <DropdownMenu label="Token" sections={tokenDropdown} />
              <DropdownMenu label="Community" sections={communityDropdown} />
              <DropdownMenu label="Developers" sections={developersDropdown} />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/launchpad"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Launchpad
            </Link>
            <button
              onClick={onConnectWallet}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Connect Wallet
            </button>
            <Link to="/auth/sign-in" className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-800 border-t border-slate-700 max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/"
              className="block px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/room"
              className="block px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Live Room
            </Link>

            <MobileDropdown
              label="Ecosystem"
              items={ecosystemDropdown[0].items}
              isExpanded={expandedSection === 'ecosystem'}
              onToggle={() => toggleMobileSection('ecosystem')}
              onItemClick={() => setMobileMenuOpen(false)}
            />

            <MobileDropdown
              label="Launchpad"
              items={launchpadDropdown[0].items}
              isExpanded={expandedSection === 'launchpad'}
              onToggle={() => toggleMobileSection('launchpad')}
              onItemClick={() => setMobileMenuOpen(false)}
            />

            <MobileDropdown
              label="Governance"
              items={governanceDropdown[0].items}
              isExpanded={expandedSection === 'governance'}
              onToggle={() => toggleMobileSection('governance')}
              onItemClick={() => setMobileMenuOpen(false)}
            />

            <MobileDropdown
              label="Portfolio"
              items={portfolioDropdown[0].items}
              isExpanded={expandedSection === 'portfolio'}
              onToggle={() => toggleMobileSection('portfolio')}
              onItemClick={() => setMobileMenuOpen(false)}
            />

            <MobileDropdown
              label="Token"
              items={tokenDropdown[0].items}
              isExpanded={expandedSection === 'token'}
              onToggle={() => toggleMobileSection('token')}
              onItemClick={() => setMobileMenuOpen(false)}
            />

            <MobileDropdown
              label="Community"
              items={communityDropdown[0].items}
              isExpanded={expandedSection === 'community'}
              onToggle={() => toggleMobileSection('community')}
              onItemClick={() => setMobileMenuOpen(false)}
            />

            <MobileDropdown
              label="Developers"
              items={developersDropdown[0].items}
              isExpanded={expandedSection === 'developers'}
              onToggle={() => toggleMobileSection('developers')}
              onItemClick={() => setMobileMenuOpen(false)}
            />

            <div className="pt-4 mt-4 border-t border-slate-700 space-y-2">
              <Link
                to="/launchpad"
                className="block px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Launchpad
              </Link>
              <button
                onClick={() => {
                  onConnectWallet?.();
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg"
              >
                Connect Wallet
              </button>
              <Link
                to="/auth/sign-in"
                className="block px-4 py-2 text-sm font-medium text-slate-300 hover:text-white text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

interface MobileDropdownProps {
  label: string;
  items: Array<{ label: string; path: string; description?: string }>;
  isExpanded: boolean;
  onToggle: () => void;
  onItemClick: () => void;
}

function MobileDropdown({ label, items, isExpanded, onToggle, onItemClick }: MobileDropdownProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 rounded"
      >
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      {isExpanded && (
        <div className="pl-4 mt-1 space-y-1">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded"
              onClick={onItemClick}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
