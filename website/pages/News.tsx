import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import {
  Newspaper, Search, Filter, Calendar, Clock, TrendingUp,
  ArrowRight, Rss, Mail, CheckCircle2
} from 'lucide-react';

interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  featured_image: string | null;
  read_time: number;
  publish_date: string;
  featured: boolean;
}

export default function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const categories = [
    'All',
    'Development Updates',
    'Partnerships',
    'Governance',
    'Community',
    'Press Releases'
  ];

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, selectedCategory]);

  const fetchArticles = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/news_articles?published=eq.true&order=publish_date.desc`,
        {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredArticles(filtered);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribing(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/newsletter_subscribers`,
        {
          method: 'POST',
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        setSubscribed(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
    } finally {
      setSubscribing(false);
    }
  };

  const featuredArticles = filteredArticles.filter(a => a.featured).slice(0, 2);
  const regularArticles = filteredArticles.filter(a => !a.featured || featuredArticles.length >= 2);

  return (
    <PageLayout>
      <div className="space-y-16">
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-6">
            <Newspaper className="w-4 h-4" />
            News & Updates
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Latest from{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Aizura
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Development updates, partnerships, governance decisions, and community highlights.
            Stay informed about everything happening in the ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/rss"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
            >
              <Rss className="w-5 h-5" />
              RSS Feed
            </a>
            <a
              href="#newsletter"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              <Mail className="w-5 h-5" />
              Subscribe to Newsletter
            </a>
          </div>
        </section>

        <section className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Filter className="w-5 h-5 text-slate-400" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {searchTerm || selectedCategory !== 'All' ? (
            <div className="mt-4 text-sm text-slate-400">
              Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </div>
          ) : null}
        </section>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
            <p className="text-slate-400 mt-4">Loading articles...</p>
          </div>
        ) : (
          <>
            {featuredArticles.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-cyan-400" />
                  Featured Articles
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {featuredArticles.map((article) => (
                    <Link
                      key={article.id}
                      to={`/news/${article.slug}`}
                      className="group bg-slate-800/30 backdrop-blur border border-slate-700 hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all"
                    >
                      {article.featured_image && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={article.featured_image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3 text-sm">
                          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full font-medium">
                            {article.category}
                          </span>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Calendar className="w-4 h-4" />
                            {new Date(article.publish_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                          {article.title}
                        </h3>

                        <p className="text-slate-300 mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>{article.author}</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {article.read_time} min read
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-cyan-400 font-medium group-hover:gap-3 transition-all">
                            Read More
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section>
              {featuredArticles.length > 0 && (
                <h2 className="text-2xl font-bold text-white mb-6">All Articles</h2>
              )}

              {regularArticles.length === 0 ? (
                <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-2xl p-12 text-center">
                  <Newspaper className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">
                    {searchTerm || selectedCategory !== 'All'
                      ? 'No articles found matching your filters.'
                      : 'No articles available yet.'}
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularArticles.map((article) => (
                    <Link
                      key={article.id}
                      to={`/news/${article.slug}`}
                      className="group bg-slate-800/30 backdrop-blur border border-slate-700 hover:border-cyan-500/50 rounded-xl overflow-hidden transition-all"
                    >
                      {article.featured_image && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={article.featured_image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3 text-xs">
                          <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded-full">
                            {article.category}
                          </span>
                          <div className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3" />
                            {article.read_time} min
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {article.title}
                        </h3>

                        <p className="text-sm text-slate-300 mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-sm">
                          <div className="text-slate-400">
                            {new Date(article.publish_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-cyan-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        <section id="newsletter" className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 lg:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <Mail className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Never Miss an Update
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Get weekly ecosystem updates, governance alerts, and exclusive insights delivered to your inbox.
            </p>

            {subscribed ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 inline-flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <div className="text-left">
                  <p className="text-green-400 font-bold">Successfully subscribed!</p>
                  <p className="text-sm text-slate-300">Check your email to confirm your subscription.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="flex-1 px-6 py-4 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors whitespace-nowrap"
                >
                  {subscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}

            <p className="text-sm text-slate-400 mt-4">
              No spam, ever. Unsubscribe anytime with one click.
            </p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
