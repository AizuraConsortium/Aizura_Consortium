import { PageLayout } from '../../components/layout/PageLayout';
import { Mail, MessageSquare, Twitter, Github, Send, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-12">
        <section className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-6">
            <Mail className="w-4 h-4" />
            Get in Touch
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Contact{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Aizura Consortium
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Have questions? Need support? Want to collaborate? We're here to help.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                Thank you! Your message has been received. We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Select a category</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="media">Media / Press</option>
                  <option value="proposal">Proposal Question</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Other Ways to Reach Us</h3>

              <div className="space-y-6">
                <ContactMethod
                  icon={<MessageSquare className="w-6 h-6 text-cyan-400" />}
                  title="Discord Community"
                  description="Join our Discord server for real-time discussions and support"
                  action="Join Discord"
                />

                <ContactMethod
                  icon={<Twitter className="w-6 h-6 text-cyan-400" />}
                  title="Twitter / X"
                  description="Follow us for updates, announcements, and ecosystem news"
                  action="Follow on X"
                />

                <ContactMethod
                  icon={<Github className="w-6 h-6 text-cyan-400" />}
                  title="GitHub"
                  description="Contribute to our open-source projects and documentation"
                  action="View on GitHub"
                />
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-2">Response Time</h4>
                  <p className="text-sm text-slate-300">
                    We typically respond within 24-48 hours. For urgent technical issues, please include
                    "URGENT" in your subject line.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Before You Contact Us</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Check our <a href="/community/faq" className="text-cyan-400 hover:text-cyan-300 underline">FAQ page</a> for common questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Review the <a href="/about" className="text-cyan-400 hover:text-cyan-300 underline">documentation</a> for technical questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Search Discord for existing discussions on your topic</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function ContactMethod({ icon, title, description, action }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
}) {
  return (
    <div className="flex items-start gap-4 pb-6 border-b border-slate-700 last:border-0 last:pb-0">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <h4 className="font-bold text-white mb-1">{title}</h4>
        <p className="text-sm text-slate-400 mb-3">{description}</p>
        <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">
          {action} →
        </button>
      </div>
    </div>
  );
}
