/**
 * News Service (Client Module)
 *
 * Business logic layer for client news operations.
 * Validates business rules and delegates to repositories.
 * Follows pattern from portfolioService.ts
 */

import { newsRepository } from '../../shared/services/supabase/repositories/news.js';
import { validateNewsFilters } from '../../../shared/utils/validation/news-validators.js';
import type {
  NewsArticle,
  NewsFilters,
  NewsListResponse,
  NewsCompactListResponse,
} from '../../../shared/types/news.js';

/**
 * Service for managing client news operations
 */
export class NewsService {
  /**
   * Get latest news articles in compact format (for dashboard widget)
   */
  async getLatestNews(limit: number = 5): Promise<NewsCompactListResponse> {
    if (limit < 1 || limit > 50) {
      throw new Error('Limit must be between 1 and 50');
    }

    const articles = await newsRepository.getLatestArticlesCompact(limit);

    return {
      articles,
      total: articles.length,
    };
  }

  /**
   * Get all published news articles with filtering
   */
  async getPublishedArticles(filters?: NewsFilters): Promise<NewsListResponse> {
    if (filters) {
      const validation = validateNewsFilters(filters);
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).join('; ');
        throw new Error(`Invalid filters: ${errorMessage}`);
      }
    }

    const appliedFilters: NewsFilters = {
      limit: filters?.limit || 10,
      offset: filters?.offset || 0,
      order: filters?.order || 'desc',
      sort: filters?.sort || 'publish_date',
      ...filters,
    };

    const [articles, total] = await Promise.all([
      newsRepository.getPublishedArticles(appliedFilters),
      newsRepository.getPublishedCount(appliedFilters),
    ]);

    const hasMore = (appliedFilters.offset || 0) + articles.length < total;

    return {
      articles,
      total,
      hasMore,
      filters: appliedFilters,
    };
  }

  /**
   * Get article by ID
   */
  async getArticleById(articleId: string): Promise<NewsArticle> {
    if (!articleId || articleId.trim() === '') {
      throw new Error('Article ID is required');
    }

    const article = await newsRepository.getArticleById(articleId);

    if (!article) {
      throw new Error('Article not found');
    }

    newsRepository.incrementViews(articleId).catch((error) => {
      console.error('Failed to increment article views:', error);
    });

    return article;
  }

  /**
   * Get article by slug
   */
  async getArticleBySlug(slug: string): Promise<NewsArticle> {
    if (!slug || slug.trim() === '') {
      throw new Error('Article slug is required');
    }

    const article = await newsRepository.getArticleBySlug(slug);

    if (!article) {
      throw new Error('Article not found');
    }

    newsRepository.incrementViews(article.id).catch((error) => {
      console.error('Failed to increment article views:', error);
    });

    return article;
  }

  /**
   * Get featured articles
   */
  async getFeaturedArticles(limit: number = 3): Promise<NewsArticle[]> {
    if (limit < 1 || limit > 10) {
      throw new Error('Limit must be between 1 and 10');
    }

    return newsRepository.getFeaturedArticles(limit);
  }

  /**
   * Get articles by category
   */
  async getArticlesByCategory(
    category: string,
    limit?: number
  ): Promise<NewsArticle[]> {
    if (!category || category.trim() === '') {
      throw new Error('Category is required');
    }

    return newsRepository.getArticlesByCategory(category, limit);
  }
}

export const newsService = new NewsService();
