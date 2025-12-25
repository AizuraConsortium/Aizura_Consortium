/**
 * News Repository
 *
 * Manages news article data access with proper error handling,
 * type safety, and query optimization.
 * Follows pattern from portfolio.ts and proposals.ts repositories.
 */

import { BaseRepository, type OperationContext } from './BaseRepository.js';
import { NotFoundError } from './errors/RepositoryError.js';
import type {
  NewsArticle,
  NewsArticleCompact,
  NewsFilters,
} from '../../../../../shared/types/news.js';
import type { Database } from '../../../../../shared/types/database.types.js';

type NewsArticleRow = Database['public']['Tables']['news_articles']['Row'];
type NewsArticleInsert = Database['public']['Tables']['news_articles']['Insert'];
type NewsArticleUpdate = Database['public']['Tables']['news_articles']['Update'];

/**
 * News Repository Class
 */
class NewsRepository extends BaseRepository {
  constructor(client?: import('@supabase/supabase-js').SupabaseClient) {
    super('news_articles', client);
  }

  /**
   * Get published news articles with filtering and pagination
   */
  async getPublishedArticles(filters?: NewsFilters): Promise<NewsArticle[]> {
    const context: OperationContext = {
      operation: 'getPublishedArticles',
      table: 'news_articles',
      metadata: { filters },
    };

    return this.execute(async () => {
      let query = this.client
        .from('news_articles')
        .select('*')
        .eq('published', true);

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.featured !== undefined) {
        query = query.eq('featured', filters.featured);
      }

      if (filters?.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%,content.ilike.%${filters.search}%`
        );
      }

      const sortField = filters?.sort || 'publish_date';
      const sortOrder = filters?.order || 'desc';
      query = query.order(sortField, { ascending: sortOrder === 'asc' });

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(
          filters.offset,
          filters.offset + (filters.limit || 10) - 1
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as NewsArticle[];
    }, context);
  }

  /**
   * Get latest published articles (compact format for dashboard)
   */
  async getLatestArticlesCompact(limit: number = 5): Promise<NewsArticleCompact[]> {
    const context: OperationContext = {
      operation: 'getLatestArticlesCompact',
      table: 'news_articles',
      metadata: { limit },
    };

    return this.execute(async () => {
      const { data, error } = await this.client
        .from('news_articles')
        .select('id, slug, title, excerpt, category, featured_image, read_time, publish_date')
        .eq('published', true)
        .order('publish_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as NewsArticleCompact[];
    }, context);
  }

  /**
   * Get article by ID
   */
  async getArticleById(articleId: string): Promise<NewsArticle | null> {
    const context: OperationContext = {
      operation: 'getArticleById',
      table: 'news_articles',
      metadata: { articleId },
    };

    return this.execute(async () => {
      const { data, error } = await this.client
        .from('news_articles')
        .select('*')
        .eq('id', articleId)
        .eq('published', true)
        .maybeSingle();

      if (error) throw error;
      return data as NewsArticle | null;
    }, context);
  }

  /**
   * Get article by slug
   */
  async getArticleBySlug(slug: string): Promise<NewsArticle | null> {
    const context: OperationContext = {
      operation: 'getArticleBySlug',
      table: 'news_articles',
      metadata: { slug },
    };

    return this.execute(async () => {
      const { data, error } = await this.client
        .from('news_articles')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (error) throw error;
      return data as NewsArticle | null;
    }, context);
  }

  /**
   * Increment article view count
   */
  async incrementViews(articleId: string): Promise<void> {
    const context: OperationContext = {
      operation: 'incrementViews',
      table: 'news_articles',
      metadata: { articleId },
    };

    return this.execute(async () => {
      const { error } = await this.client.rpc('increment_article_views', {
        article_id: articleId,
      });

      if (error) throw error;
    }, context);
  }

  /**
   * Get total count of published articles (for pagination)
   */
  async getPublishedCount(filters?: NewsFilters): Promise<number> {
    const context: OperationContext = {
      operation: 'getPublishedCount',
      table: 'news_articles',
      metadata: { filters },
    };

    return this.execute(async () => {
      let query = this.client
        .from('news_articles')
        .select('id', { count: 'exact', head: true })
        .eq('published', true);

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`
        );
      }

      const { count, error } = await query;

      if (error) throw error;
      return count || 0;
    }, context);
  }

  /**
   * Get featured articles
   */
  async getFeaturedArticles(limit: number = 3): Promise<NewsArticle[]> {
    const context: OperationContext = {
      operation: 'getFeaturedArticles',
      table: 'news_articles',
      metadata: { limit },
    };

    return this.execute(async () => {
      const { data, error } = await this.client
        .from('news_articles')
        .select('*')
        .eq('published', true)
        .eq('featured', true)
        .order('publish_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as NewsArticle[];
    }, context);
  }

  /**
   * Get articles by category
   */
  async getArticlesByCategory(
    category: string,
    limit?: number
  ): Promise<NewsArticle[]> {
    const context: OperationContext = {
      operation: 'getArticlesByCategory',
      table: 'news_articles',
      metadata: { category, limit },
    };

    return this.execute(async () => {
      let query = this.client
        .from('news_articles')
        .select('*')
        .eq('published', true)
        .eq('category', category)
        .order('publish_date', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as NewsArticle[];
    }, context);
  }
}

export const newsRepository = new NewsRepository();
export { NewsRepository };
