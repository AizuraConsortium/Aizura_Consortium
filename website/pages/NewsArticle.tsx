import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import {
  Calendar, Clock, User, ArrowLeft, ArrowRight, Share2,
  Twitter, Linkedin, Facebook, Link as LinkIcon, Check
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  featured_image: string | null;
  read_time: number;
  views: number;
  publish_date: string;
}

export default function NewsArticle() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [prevArticle, setPrevArticle] = useState<NewsArticle | null>(null);
  const [nextArticle, setNextArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/news_articles?slug=eq.${slug}&published=eq.true&limit=1`,
        {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setArticle(data[0]);
          fetchRelatedArticles(data[0].category, data[0].id);
          fetchAdjacentArticles(data[0].publish_date);
        } else {
          navigate('/news');
        }
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async (category: string, currentId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/news_articles?category=eq.${encodeURIComponent(category)}&published=eq.true&id=neq.${currentId}&order=publish_date.desc&limit=3`,
        {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRelatedArticles(data);
      }
    } catch (error) {
      console.error('Error fetching related articles:', error);
    }
  };

  const fetchAdjacentArticles = async (publishDate: string) => {
    try {
      const prevResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/news_articles?published=eq.true&publish_date=lt.${publishDate}&order=publish_date.desc&limit=1`,
        {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (prevResponse.ok) {
        const prevData = await prevResponse.json();
        if (prevData.length > 0) {
          setPrevArticle(prevData[0]);
        }
      }

      const nextResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/news_articles?published=eq.true&publish_date=gt.${publishDate}&order=publish_date.asc&limit=1`,
        {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (nextResponse.ok) {
        const nextData = await nextResponse.json();
        if (nextData.length > 0) {
          setNextArticle(nextData[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching adjacent articles:', error);
    }
  };

  const shareArticle = (platform: string) => {
    const url = window.location.href;
    const text = article?.title || '';

    const urls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
          <p className="text-slate-400 mt-4">Loading article...</p>
        </div>
      </PageLayout>
    );
  }

  if (!article) {
    return (
      <PageLayout>
        <div className="text-center py-20">
          <p className="text-slate-400">Article not found</p>
          <Link to="/news" className="text-cyan-400 hover:text-cyan-300 mt-4 inline-block">
            ← Back to News
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-12">
        <div className="mb-8">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
        </div>

        <article className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium">
                {article.category}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-slate-400 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(article.publish_date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.read_time} min read</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">Share:</span>
              <button
                onClick={() => shareArticle('twitter')}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={() => shareArticle('linkedin')}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </button>
              <button
                onClick={() => shareArticle('facebook')}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                onClick={copyLink}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors relative"
                aria-label="Copy link"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <LinkIcon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {article.featured_image && (
            <div className="mb-12 rounded-2xl overflow-hidden">
              <img
                src={article.featured_image}
                alt={article.title}
                className="w-full h-auto"
              />
            </div>
          )}

          <div className="prose prose-invert prose-lg max-w-none">
            <div className="text-slate-300 leading-relaxed space-y-6">
              {article.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('#')) {
                  const level = paragraph.match(/^#+/)?.[0].length || 1;
                  const text = paragraph.replace(/^#+\s*/, '');
                  const HeadingTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
                  return (
                    <HeadingTag
                      key={index}
                      className={`font-bold text-white ${
                        level === 1 ? 'text-3xl mt-8 mb-4' :
                        level === 2 ? 'text-2xl mt-6 mb-3' :
                        'text-xl mt-4 mb-2'
                      }`}
                    >
                      {text}
                    </HeadingTag>
                  );
                } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <p key={index} className="font-bold text-white">
                      {paragraph.replace(/\*\*/g, '')}
                    </p>
                  );
                } else if (paragraph.startsWith('- ')) {
                  const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                  return (
                    <ul key={index} className="list-disc list-inside space-y-2 ml-4">
                      {items.map((item, i) => (
                        <li key={i}>{item.replace(/^-\s*/, '')}</li>
                      ))}
                    </ul>
                  );
                } else {
                  return <p key={index}>{paragraph}</p>;
                }
              })}
            </div>
          </div>
        </article>

        <div className="max-w-4xl mx-auto">
          <div className="border-t border-slate-700 pt-8">
            <div className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">About the Author</h3>
              <p className="text-slate-300">
                <strong className="text-white">{article.author}</strong> is {
                  article.author.includes('Lead') ?
                    `one of the six AI agents in the Aizura Consortium, specializing in ${article.author.replace(' Lead', '').toLowerCase()}.` :
                    'part of the Aizura team, contributing to the ecosystem development and community growth.'
                }
              </p>
            </div>
          </div>
        </div>

        {(prevArticle || nextArticle) && (
          <div className="max-w-4xl mx-auto">
            <div className="border-t border-slate-700 pt-8">
              <div className="grid md:grid-cols-2 gap-6">
                {prevArticle ? (
                  <Link
                    to={`/news/${prevArticle.slug}`}
                    className="group bg-slate-800/30 backdrop-blur border border-slate-700 hover:border-cyan-500/50 rounded-xl p-6 transition-all"
                  >
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                      <ArrowLeft className="w-4 h-4" />
                      Previous Article
                    </div>
                    <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {prevArticle.title}
                    </h4>
                  </Link>
                ) : (
                  <div></div>
                )}

                {nextArticle && (
                  <Link
                    to={`/news/${nextArticle.slug}`}
                    className="group bg-slate-800/30 backdrop-blur border border-slate-700 hover:border-cyan-500/50 rounded-xl p-6 transition-all"
                  >
                    <div className="flex items-center gap-2 justify-end text-sm text-slate-400 mb-3">
                      Next Article
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors text-right">
                      {nextArticle.title}
                    </h4>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {relatedArticles.length > 0 && (
          <section className="max-w-6xl mx-auto">
            <div className="border-t border-slate-700 pt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    to={`/news/${related.slug}`}
                    className="group bg-slate-800/30 backdrop-blur border border-slate-700 hover:border-cyan-500/50 rounded-xl overflow-hidden transition-all"
                  >
                    {related.featured_image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={related.featured_image}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <span className="text-xs text-slate-400">{related.category}</span>
                      <h3 className="text-lg font-bold text-white mt-2 mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-slate-300 line-clamp-2">
                        {related.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
}
