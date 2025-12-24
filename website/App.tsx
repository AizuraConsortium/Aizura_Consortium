import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import { SkipNavigation } from '@shared/components/SkipNavigation';
import { ToastProvider } from '@shared/components/ToastProvider';

import Home from './pages/Home';
import Room from './pages/Room';
import PlanViewer from './pages/PlanViewer';
import About from './pages/About';
import NotFound from './pages/NotFound';

import EcosystemOverview from './pages/ecosystem/EcosystemOverview';
import HowItWorks from './pages/ecosystem/HowItWorks';
import AIConsortium from './pages/ecosystem/AIConsortium';
import Roadmap from './pages/ecosystem/Roadmap';

import LaunchpadOverview from './pages/launchpad/LaunchpadOverview';
import SubmitProposal from './pages/launchpad/SubmitProposal';
import VotingRewards from './pages/launchpad/VotingRewards';
import ProposalLifecycle from './pages/launchpad/ProposalLifecycle';
import ProposalDetail from './pages/launchpad/ProposalDetail';

import PortfolioOverview from './pages/portfolio/PortfolioOverview';
import AITraders from './pages/portfolio/AITraders';
import AIBusinessFactory from './pages/portfolio/AIBusinessFactory';
import AIWebDev from './pages/portfolio/AIWebDev';
import Coinfusion from './pages/portfolio/Coinfusion';
import FlagshipQ4 from './pages/portfolio/FlagshipQ4';

import TokenOverview from './pages/token/TokenOverview';
import Tokenomics from './pages/token/Tokenomics';
import Airdrop from './pages/token/Airdrop';
import Staking from './pages/token/Staking';
import Transparency from './pages/token/Transparency';

import GovernanceOverview from './pages/governance/GovernanceOverview';
import GovernanceRules from './pages/governance/GovernanceRules';
import LiveGovernance from './pages/governance/LiveGovernance';
import Treasury from './pages/governance/Treasury';

import CommunityHub from './pages/community/CommunityHub';
import FAQ from './pages/community/FAQ';
import MediaKit from './pages/community/MediaKit';
import Contact from './pages/community/Contact';

import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import Disclaimer from './pages/legal/Disclaimer';
import Cookies from './pages/legal/Cookies';

import SmartContracts from './pages/blockchain/SmartContracts';
import Security from './pages/blockchain/Security';

import Documentation from './pages/developers/Documentation';

import Litepaper from './pages/resources/Litepaper';

import SignIn from './pages/auth/SignIn';

export default function App() {
  return (
    <ErrorBoundary theme="dark" appName="Website" enableLogging>
      <ToastProvider>
        <BrowserRouter>
          <SkipNavigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room" element={<Room />} />
            <Route path="/plan/:topicId" element={<PlanViewer />} />
            <Route path="/about" element={<About />} />

            <Route path="/ecosystem" element={<EcosystemOverview />} />
            <Route path="/ecosystem/how-it-works" element={<HowItWorks />} />
            <Route path="/ecosystem/ai-consortium" element={<AIConsortium />} />
            <Route path="/ecosystem/roadmap" element={<Roadmap />} />

            <Route path="/launchpad" element={<LaunchpadOverview />} />
            <Route path="/launchpad/submit" element={<SubmitProposal />} />
            <Route path="/launchpad/voting-rewards" element={<VotingRewards />} />
            <Route path="/launchpad/lifecycle" element={<ProposalLifecycle />} />
            <Route path="/launchpad/:proposalId" element={<ProposalDetail />} />

            <Route path="/portfolio" element={<PortfolioOverview />} />
            <Route path="/portfolio/ai-traders" element={<AITraders />} />
            <Route path="/portfolio/ai-business-factory" element={<AIBusinessFactory />} />
            <Route path="/portfolio/ai-web-dev" element={<AIWebDev />} />
            <Route path="/portfolio/coinfusion" element={<Coinfusion />} />
            <Route path="/portfolio/flagship-q4-2026" element={<FlagshipQ4 />} />

            <Route path="/token" element={<TokenOverview />} />
            <Route path="/token/tokenomics" element={<Tokenomics />} />
            <Route path="/token/airdrop" element={<Airdrop />} />
            <Route path="/token/staking" element={<Staking />} />
            <Route path="/token/transparency" element={<Transparency />} />

            <Route path="/governance" element={<GovernanceOverview />} />
            <Route path="/governance/rules" element={<GovernanceRules />} />
            <Route path="/governance/live" element={<LiveGovernance />} />
            <Route path="/governance/treasury" element={<Treasury />} />

            <Route path="/community" element={<CommunityHub />} />
            <Route path="/community/faq" element={<FAQ />} />
            <Route path="/community/media-kit" element={<MediaKit />} />
            <Route path="/community/contact" element={<Contact />} />

            <Route path="/legal/terms" element={<Terms />} />
            <Route path="/legal/privacy" element={<Privacy />} />
            <Route path="/legal/disclaimer" element={<Disclaimer />} />
            <Route path="/legal/cookies" element={<Cookies />} />

            <Route path="/blockchain/smart-contracts" element={<SmartContracts />} />
            <Route path="/blockchain/security" element={<Security />} />

            <Route path="/developers/documentation" element={<Documentation />} />

            <Route path="/resources/litepaper" element={<Litepaper />} />

            <Route path="/auth/sign-in" element={<SignIn />} />
            <Route path="/app" element={<div className="min-h-screen bg-slate-900 text-white flex items-center justify-center"><p>Dashboard coming soon</p></div>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}
