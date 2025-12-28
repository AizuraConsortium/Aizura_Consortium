import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Project</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/ecosystem" className="text-sm text-slate-400 hover:text-white transition-colors">
                  About / Overview
                </Link>
              </li>
              <li>
                <Link to="/ecosystem/how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/ecosystem/roadmap" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Roadmap
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Launchpad</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/launchpad" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Launchpad
                </Link>
              </li>
              <li>
                <Link to="/launchpad/submit" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Submit Proposal
                </Link>
              </li>
              <li>
                <Link to="/launchpad/voting-rewards" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Voting & Rewards
                </Link>
              </li>
              <li>
                <Link to="/launchpad/lifecycle" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Lifecycle
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Token</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/token" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Token Overview
                </Link>
              </li>
              <li>
                <Link to="/token/tokenomics" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Tokenomics
                </Link>
              </li>
              <li>
                <Link to="/token/airdrop" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Airdrop
                </Link>
              </li>
              <li>
                <Link to="/token/transparency" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Transparency
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Governance</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/governance" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Governance
                </Link>
              </li>
              <li>
                <Link to="/governance/rules" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Rules
                </Link>
              </li>
              <li>
                <Link to="/governance/live" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Live Governance
                </Link>
              </li>
              <li>
                <Link to="/governance/treasury" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Treasury
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Community</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/community" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Community Hub
                </Link>
              </li>
              <li>
                <Link to="/community/social" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Social & Channels
                </Link>
              </li>
              <li>
                <Link to="/community/faq" className="text-sm text-slate-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/community/contact" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/news" className="text-sm text-slate-400 hover:text-white transition-colors">
                  News & Updates
                </Link>
              </li>
              <li>
                <Link to="/resources/litepaper" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Litepaper
                </Link>
              </li>
              <li>
                <Link to="/developers/documentation" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/security/bug-bounty" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Bug Bounty
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-semibold text-white">Autonomous AI Consortium (AAIC)</span>
            </div>
            <span className="text-xs text-slate-500">AAIC by Aizura | © {currentYear}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <Link to="/legal/terms" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <span>•</span>
            <Link to="/legal/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/legal/disclaimer" className="hover:text-white transition-colors">
              Disclaimer
            </Link>
            <span>•</span>
            <Link to="/legal/risk-disclosure" className="hover:text-white transition-colors">
              Risk Disclosure
            </Link>
            <span>•</span>
            <Link to="/legal/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
