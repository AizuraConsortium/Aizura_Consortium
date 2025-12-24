import { Link } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { Cookie, Settings, Eye, Shield, Info, CheckCircle2, XCircle } from 'lucide-react';

export default function CookiePolicy() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Cookie className="w-12 h-12 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">Cookie Policy</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Last Updated: December 24, 2025
          </p>
        </div>

        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
            <div className="text-sm text-slate-300 space-y-2">
              <p className="font-bold text-white">About Cookies</p>
              <p>This Cookie Policy explains how and why we use cookies and similar technologies on the Aizura Consortium platform.</p>
            </div>
          </div>
        </div>

        <div className="prose prose-invert prose-cyan max-w-none space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies?</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit websites.
              They help websites remember information about your visit, making your experience more efficient and personalized.
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              Cookies can be "session cookies" (temporary, deleted when you close your browser) or "persistent cookies"
              (remain on your device until they expire or you delete them).
            </p>
            <p className="text-slate-300 leading-relaxed">
              Similar technologies include local storage, web beacons, pixels, and other tracking mechanisms that serve
              similar purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Cookies</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We use cookies and similar technologies for the following purposes:
            </p>

            <div className="space-y-6">
              <CookieCategoryCard
                title="Essential Cookies"
                required={true}
                description="Necessary for the Platform to function properly. These cannot be disabled."
                examples={[
                  'Authentication and security tokens',
                  'Session management',
                  'Wallet connection preferences',
                  'User interface preferences'
                ]}
              />

              <CookieCategoryCard
                title="Functional Cookies"
                required={false}
                description="Enable enhanced functionality and personalization."
                examples={[
                  'Language preferences',
                  'Display settings and themes',
                  'Previously viewed proposals',
                  'Saved filters and preferences'
                ]}
              />

              <CookieCategoryCard
                title="Analytics Cookies"
                required={false}
                description="Help us understand how visitors use the Platform."
                examples={[
                  'Page views and navigation patterns',
                  'Feature usage statistics',
                  'Performance metrics',
                  'Error tracking and diagnostics'
                ]}
              />

              <CookieCategoryCard
                title="Performance Cookies"
                required={false}
                description="Collect information about Platform performance and reliability."
                examples={[
                  'Load times and responsiveness',
                  'Technical error logging',
                  'Browser compatibility data',
                  'Network performance metrics'
                ]}
              />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Third-Party Cookies</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Some cookies on the Platform are set by third-party services we use:
            </p>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
              <ThirdPartyItem
                name="Analytics Providers"
                purpose="Understand user behavior and improve the Platform"
                control="You can opt out through browser settings or provider opt-out mechanisms"
              />
              <ThirdPartyItem
                name="Blockchain Infrastructure"
                purpose="Connect to blockchain networks and wallet providers"
                control="Required for core Platform functionality when using blockchain features"
              />
              <ThirdPartyItem
                name="Content Delivery Networks"
                purpose="Deliver Platform content efficiently and securely"
                control="Essential for Platform performance"
              />
            </div>

            <p className="text-slate-300 leading-relaxed mt-4">
              Third-party cookies are governed by the privacy policies of those third parties. We encourage you to
              review their policies for more information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Managing Cookie Preferences</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              You have control over cookie usage on the Platform:
            </p>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">4.1 Browser Settings</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Most browsers allow you to:
            </p>
            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li>View cookies stored on your device</li>
              <li>Delete all or specific cookies</li>
              <li>Block third-party cookies</li>
              <li>Block all cookies (may affect functionality)</li>
              <li>Set cookies to expire when you close your browser</li>
            </ul>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 my-6">
              <h4 className="font-bold text-white mb-3">Browser Cookie Settings</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies and Website Data</li>
                <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">4.2 Platform Cookie Preferences</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              You can manage your cookie preferences for non-essential cookies through our cookie consent banner
              when you first visit the Platform. You can update your preferences at any time through the Platform settings.
            </p>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">4.3 Do Not Track</h3>
            <p className="text-slate-300 leading-relaxed">
              Some browsers have "Do Not Track" features. We respect these signals where technically feasible.
              However, blockchain interactions are public by design and cannot be made private.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Impact of Disabling Cookies</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Blocking or deleting cookies may affect your experience on the Platform:
            </p>

            <div className="space-y-4">
              <ImpactItem
                icon={<CheckCircle2 className="w-5 h-5 text-green-400" />}
                title="Essential Cookies Disabled"
                description="Platform may not function correctly. You may be unable to connect your wallet, vote, or access key features."
                severity="high"
              />
              <ImpactItem
                icon={<Info className="w-5 h-5 text-yellow-400" />}
                title="Functional Cookies Disabled"
                description="You may lose preferences and customizations. The Platform will still work but may be less convenient."
                severity="medium"
              />
              <ImpactItem
                icon={<Eye className="w-5 h-5 text-blue-400" />}
                title="Analytics Cookies Disabled"
                description="No impact on functionality. We'll have limited visibility into how users interact with the Platform."
                severity="low"
              />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Local Storage and Similar Technologies</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              In addition to cookies, we use other browser storage mechanisms:
            </p>

            <ul className="list-disc pl-8 text-slate-300 space-y-2 mb-4">
              <li><strong>Local Storage:</strong> Stores larger amounts of data locally for improved performance</li>
              <li><strong>Session Storage:</strong> Temporary storage cleared when you close your browser</li>
              <li><strong>IndexedDB:</strong> Database storage for complex application data</li>
              <li><strong>Web3 Provider Storage:</strong> Wallet connection preferences and cached blockchain data</li>
            </ul>

            <p className="text-slate-300 leading-relaxed">
              These technologies serve similar purposes to cookies and can be managed through browser settings or
              by clearing browser data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Blockchain and Wallet Tracking</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Important distinctions about blockchain privacy:
            </p>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white mb-2">Blockchain Transparency</p>
                  <p className="text-sm text-slate-300 mb-3">
                    Your wallet address and all blockchain transactions are public and permanent. This is inherent
                    to blockchain technology and is not affected by cookie settings.
                  </p>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Wallet connections are visible on-chain</li>
                    <li>• Votes and proposals are publicly recorded</li>
                    <li>• Token transactions are transparent</li>
                    <li>• No cookie setting can make blockchain data private</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Updates to This Cookie Policy</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We may update this Cookie Policy to reflect changes in technology, legal requirements, or our practices.
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              Updates will be posted on this page with a revised "Last Updated" date. Significant changes will be
              announced through the Platform or official communication channels.
            </p>
            <p className="text-slate-300 leading-relaxed">
              We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Contact Us</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              If you have questions about this Cookie Policy or our use of cookies, please contact us:
            </p>
            <Link
              to="/community/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              Contact Us
            </Link>
          </section>
        </div>

        <div className="mt-12 p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
          <div className="flex items-start gap-4">
            <Cookie className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white mb-2">Related Policies</h3>
              <p className="text-slate-300 text-sm mb-4">
                For more information about how we protect your privacy and handle your data, please review:
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <Link to="/legal/privacy" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</Link>
                <Link to="/legal/terms" className="text-cyan-400 hover:text-cyan-300">Terms of Use</Link>
                <Link to="/legal/disclaimer" className="text-cyan-400 hover:text-cyan-300">Disclaimer</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function CookieCategoryCard({ title, required, description, examples }: {
  title: string;
  required: boolean;
  description: string;
  examples: string[];
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          required
            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
        }`}>
          {required ? 'Required' : 'Optional'}
        </span>
      </div>
      <p className="text-slate-300 mb-4">{description}</p>
      <div>
        <h4 className="text-sm font-semibold text-cyan-400 mb-2">Examples:</h4>
        <ul className="space-y-1">
          {examples.map((example, idx) => (
            <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>{example}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ThirdPartyItem({ name, purpose, control }: {
  name: string;
  purpose: string;
  control: string;
}) {
  return (
    <div className="pb-4 border-b border-slate-600 last:border-0 last:pb-0">
      <h4 className="font-bold text-white mb-2">{name}</h4>
      <p className="text-sm text-slate-300 mb-2"><strong>Purpose:</strong> {purpose}</p>
      <p className="text-sm text-slate-400"><strong>Control:</strong> {control}</p>
    </div>
  );
}

function ImpactItem({ icon, title, description, severity }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}) {
  const colors = {
    high: 'border-red-500/30 bg-red-500/10',
    medium: 'border-yellow-500/30 bg-yellow-500/10',
    low: 'border-blue-500/30 bg-blue-500/10'
  };

  return (
    <div className={`border rounded-xl p-4 ${colors[severity]}`}>
      <div className="flex items-start gap-3">
        {icon}
        <div>
          <h4 className="font-bold text-white mb-1">{title}</h4>
          <p className="text-sm text-slate-300">{description}</p>
        </div>
      </div>
    </div>
  );
}
