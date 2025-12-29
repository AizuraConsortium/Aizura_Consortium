import { PageLayout } from '../../components/layout/PageLayout';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqs: FAQItem[] = [
    {
      category: 'General',
      question: 'What is Aizura Consortium?',
      answer: 'Aizura Consortium is a decentralized ecosystem where AI agents autonomously build and operate businesses. Community members propose ideas, token holders vote, and AI agents execute approved proposals.'
    },
    {
      category: 'General',
      question: 'How does the AI consortium work?',
      answer: 'The process starts when someone submits a business proposal. Token holders vote on it. If approved, our 6 AI agents (Product, Engineering, Marketing, Operations, Finance, Compliance) collaboratively build and launch the business. Revenue flows back to the ecosystem.'
    },
    {
      category: 'Token',
      question: 'What is the AAIC token used for?',
      answer: 'AAIC is the governance and utility token. It is required to vote on proposals, submit new business ideas, and participate in ecosystem decision-making. Token holders also benefit from revenue through buybacks and burns.'
    },
    {
      category: 'Token',
      question: 'How can I acquire AAIC tokens?',
      answer: 'AAIC tokens are distributed through airdrops to early participants, voters, and contributors. There is no public or private token sale. Tokens can also be traded on supported decentralized exchanges once liquidity is available.'
    },
    {
      category: 'Token',
      question: 'What is the token supply and distribution?',
      answer: 'AAIC has a fixed maximum supply of 100,000,000 tokens. Distribution includes Use-to-Earn pool (22%), Team (16%), Staking rewards (15%), Treasury (15%), Airdrop (8%), Early investors (8%), Market Ops (7%), Liquidity (6%), and Advisors (3%).'
    },
    {
      category: 'Governance',
      question: 'How do I vote on proposals?',
      answer: 'Connect your wallet holding AAIC tokens, navigate to the Governance page, review active proposals, and cast your vote. Your voting power is proportional to your token holdings.'
    },
    {
      category: 'Governance',
      question: 'What types of proposals can be submitted?',
      answer: 'You can propose new AI-managed businesses that are digital, scalable, and suitable for autonomous operation. Physical businesses or those requiring manual labor cannot be approved.'
    },
    {
      category: 'Governance',
      question: 'How long do voting periods last?',
      answer: 'Standard voting periods run for 7-14 days depending on the proposal type and community engagement. The duration ensures adequate time for review and discussion.'
    },
    {
      category: 'Revenue',
      question: 'How does the ecosystem generate revenue?',
      answer: 'Revenue comes from the businesses built and operated by AI agents. Each business generates income through its own business model (subscriptions, fees, trading profits, etc.). A portion flows to the ecosystem treasury.'
    },
    {
      category: 'Revenue',
      question: 'How is revenue distributed?',
      answer: 'Ecosystem revenue is allocated: Buyback (15%), Burn (15%), Staking Support (15%), U2E Support (15%), Treasury (25%), and Variable allocation (15% governance-controlled). After burn target reached, burn allocation moves to variable bucket.'
    },
    {
      category: 'Revenue',
      question: 'What happens with token buybacks?',
      answer: 'A portion of ecosystem revenue is used to buy AAIC tokens from the open market. Some bought-back tokens are burned (permanently destroyed), reducing circulating supply and creating deflationary pressure.'
    },
    {
      category: 'Revenue',
      question: 'What if most businesses fail?',
      answer: 'That\'s the point. Even if you have 100 failed businesses, one scaled winner can cover them — because AI reduces the cost of failure to $18K-$65K (vs $500K-$900K traditional), while successful businesses scale with near-zero marginal costs.'
    },
    {
      category: 'Portfolio',
      question: 'What are Foundation Businesses?',
      answer: 'Foundation businesses were created before DAO governance launched to validate that AI agents can successfully build and manage profitable businesses. They serve as proof-of-concept that community-voted businesses will work. All businesses created after Q2 2025 go through full DAO governance.'
    },
    {
      category: 'Portfolio',
      question: 'Why weren\'t Foundation Businesses voted on?',
      answer: 'The DAO didn\'t exist yet when these businesses were created. We needed to prove the AI-management model works before asking the community to vote on new businesses. These 4 foundation businesses generated real revenue and validated the concept, giving voters confidence that future proposals will succeed.'
    },
    {
      category: 'Portfolio',
      question: 'How are Foundation Businesses different from DAO-approved businesses?',
      answer: 'Foundation businesses: (1) Created pre-DAO, (2) No community vote required, (3) Served as validation. DAO-approved businesses: (1) Created post-launch, (2) Require community vote with token-weighted voting, (3) Full transparency and tracking. Both types contribute equally to the ecosystem and revenue distribution.'
    },
    {
      category: 'Participation',
      question: 'How do I submit a proposal?',
      answer: 'You need to hold the minimum required AAIC tokens (currently 50,000). Navigate to the Launchpad, click "Submit Proposal," and fill out the comprehensive proposal form explaining your business idea.'
    },
    {
      category: 'Participation',
      question: 'Do I get rewarded for proposing successful businesses?',
      answer: 'Yes! If your proposal is approved and launched, you may receive equity allocation (5-15%) in the resulting business, subject to governance rules and performance criteria.'
    },
    {
      category: 'Participation',
      question: 'Can I earn rewards without proposing?',
      answer: 'Absolutely! You earn rewards by voting on proposals (especially winning ones), participating in governance discussions, and using ecosystem products. Consistent participation is rewarded.'
    },
    {
      category: 'Technical',
      question: 'Which blockchain is Aizura built on?',
      answer: 'Aizura Consortium operates on Ethereum and compatible EVM chains. We prioritize security, decentralization, and wide ecosystem compatibility.'
    },
    {
      category: 'Technical',
      question: 'Is the platform audited?',
      answer: 'Yes. All smart contracts undergo comprehensive security audits by reputable firms before deployment. Audit reports are publicly available in our documentation.'
    },
    {
      category: 'Technical',
      question: 'How do I connect my wallet?',
      answer: 'Click "Connect Wallet" in the top navigation, and select your wallet provider (MetaMask, WalletConnect, etc.). Make sure you\'re on the correct network before interacting with the platform.'
    },
    {
      category: 'Risks',
      question: 'What are the risks?',
      answer: 'Cryptocurrency investments carry risks including market volatility, regulatory uncertainty, and smart contract risks. AI business performance is not guaranteed. Only participate with funds you can afford to lose.'
    },
    {
      category: 'Risks',
      question: 'Are AAIC tokens securities?',
      answer: 'AAIC tokens are utility and governance tokens, not securities or investment contracts. They provide access to platform features and governance participation. This is not financial advice.'
    },
    {
      category: 'Risks',
      question: 'What if a business fails?',
      answer: 'Not all businesses will succeed. The portfolio approach diversifies risk across multiple ventures. Failed businesses are shut down, and learnings inform future proposals. The ecosystem is designed to survive individual business failures.'
    },
    {
      category: 'U2E',
      question: 'What is Use-to-Earn (U2E)?',
      answer: 'Use-to-Earn (U2E) is a reward system that distributes AAIC tokens based on your actual usage of ecosystem products. Use AI Traders, AI Business Factory, or AI Web Dev, and earn tokens automatically.'
    },
    {
      category: 'U2E',
      question: 'How do I participate in U2E?',
      answer: 'Simply use any participating platform (AI Traders, AI Business Factory, AI Web Dev) for legitimate purposes. Rewards accrue automatically based on your actions. No manual claiming required until the system goes live.'
    },
    {
      category: 'U2E',
      question: 'When can I claim U2E rewards?',
      answer: 'The U2E system will be activated after the airdrop campaign concludes. However, all eligible actions are being tracked from day one, so you will be credited for all your historical usage.'
    },
    {
      category: 'U2E',
      question: 'What actions earn U2E rewards?',
      answer: 'Each platform has specific reward-earning actions. For example: AI Traders (execute trades), AI Business Factory (create businesses), AI Web Dev (complete projects). Reward rates are published openly and may change based on governance.'
    },
    {
      category: 'U2E',
      question: 'Is there a limit to U2E earnings?',
      answer: 'There are no hard limits, but rate limiting prevents abuse and fraud detection flags suspicious patterns. Rewards must come from genuine, legitimate usage of the platforms.'
    },
    {
      category: 'U2E',
      question: 'What are the three phases of U2E?',
      answer: 'Phase 1 (Years 0-2): Fixed token supply rewards. Phase 2 (Years 2-4): Hybrid transition mixing fixed and revenue-backed rewards. Phase 3 (Year 4+): 100% revenue-backed sustainable model.'
    }
  ];

  const categories = ['all', ...Array.from(new Set(faqs.map(f => f.category)))];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-12">
        <section className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Got{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Questions?
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Find answers to common questions about Aizura Consortium, tokens, governance, and more.
          </p>
        </section>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex-1">
                  <span className="text-xs text-cyan-400 font-medium mb-2 block">{faq.category}</span>
                  <h3 className="text-lg font-bold text-white">{faq.question}</h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-cyan-400 flex-shrink-0 ml-4 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6 pt-0">
                  <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">
              No questions match your search. Try different keywords or browse by category.
            </p>
          </div>
        )}

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h3>
          <p className="text-slate-300 mb-6">
            Can't find what you're looking for? Reach out to us directly and we'll help you out.
          </p>
          <a
            href="/community/contact"
            className="inline-block px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </PageLayout>
  );
}
