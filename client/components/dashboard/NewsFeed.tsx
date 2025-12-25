import { useState, useEffect, memo } from 'react';
import { Newspaper, Calendar, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { formatRelativeTime } from '@shared/utils/formatters';
import type { NewsArticleCompact } from '@shared/types/news';

interface NewsFeedProps {
  limit?: number;
}

const NewsArticleItem = memo(({ article }: { article: NewsArticleCompact }) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Development Updates': 'bg-cyan-500/20 text-cyan-400',
      'Partnerships': 'bg-blue-500/20 text-blue-400',
      'Governance': 'bg-green-500/20 text-green-400',
      'Community': 'bg-yellow-500/20 text-yellow-400',
      'Press Releases': 'bg-red-500/20 text-red-400',
    };
    return colors[category] || 'bg-slate-500/20 text-slate-400';
  };

  return (
    <a
      href={`/news/${article.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
      aria-label={`Read article: ${article.title}`}
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pb-4 border-b border-slate-700 last:border-0 last:pb-0 hover:bg-slate-700/30 -mx-2 px-2 py-2 rounded-lg transition-colors">
        {article.featured_image && (
          <div className="flex-shrink-0 w-full sm:w-20 h-32 sm:h-20 rounded-lg overflow-hidden bg-slate-700">
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
              {article.category}
            </span>
            {article.publish_date && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatRelativeTime(article.publish_date)}
              </span>
            )}
          </div>

          <h4 className="text-sm font-semibold text-white mb-1 line-clamp-2 group-hover:text-cyan-400 transition-colors">
            {article.title}
          </h4>

          <p className="text-xs text-slate-400 line-clamp-2 mb-2">
            {article.excerpt}
          </p>

          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            {article.read_time} min read
          </div>
        </div>
      </div>
    </a>
  );
});

NewsArticleItem.displayName = 'NewsArticleItem';

export function NewsFeed({ limit = 5 }: NewsFeedProps) {
  const [articles, setArticles] = useState<NewsArticleCompact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, [limit]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getLatestNews(limit);
      setArticles(response.articles);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news articles');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Newspaper className="w-6 h-6 text-cyan-400" />
          <h3 className="text-lg font-bold text-white" id="news-feed-heading">
            Latest News
          </h3>
        </div>
        {!loading && !error && articles.length > 0 && (
          <a
            href="/news"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
            aria-label="View all news articles"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </a>
        )}
      </div>

      {loading && (
        <div className="space-y-4" aria-label="Loading news articles">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-3 sm:gap-4 pb-4 border-b border-slate-700 last:border-0 animate-pulse">
              <div className="flex-shrink-0 w-full sm:w-20 h-32 sm:h-20 bg-slate-700 rounded-lg"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-slate-700 rounded w-1/4"></div>
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700 rounded w-full"></div>
                <div className="h-3 bg-slate-700 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-12" role="alert">
          <AlertCircle className="w-12 h-12 text-red-400 mb-4" aria-hidden="true" />
          <p className="text-slate-300 font-medium mb-2">Failed to load news</p>
          <p className="text-slate-500 text-sm mb-4">{error}</p>
          <button
            onClick={fetchNews}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            aria-label="Retry loading news"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Newspaper className="w-16 h-16 text-slate-600 mb-4" aria-hidden="true" />
          <p className="text-slate-400">No news articles available yet.</p>
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <>
          <div className="space-y-4" aria-labelledby="news-feed-heading">
            {articles.map((article) => (
              <NewsArticleItem key={article.id} article={article} />
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700 text-center">
            <a
              href="/news"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded px-2 py-1"
              aria-label="View all news articles"
            >
              View All News
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </>
      )}
    </div>
  );
}
