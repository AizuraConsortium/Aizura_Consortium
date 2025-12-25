/**
 * News Controller (Client Module)
 *
 * Pure request/response handler for client news operations.
 * Delegates all business logic to the service layer.
 * Authentication handled by middleware (optional for news).
 * Follows pattern from portfolioController.ts
 */

import { Request, Response } from 'express';
import { newsService, NewsService } from '../services/newsService.js';
import { ErrorLogger } from '../../shared/services/errorLogger.js';

const errorLogger = ErrorLogger.getInstance();

export class NewsController {
  private newsService: NewsService;

  constructor(service?: NewsService) {
    this.newsService = service || newsService;
  }

  /**
   * GET /api/client/news
   * Get latest news articles in compact format
   * Public endpoint (no auth required)
   */
  async getLatestNews(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 5;

      const response = await this.newsService.getLatestNews(limit);

      res.json(response);
    } catch (error) {
      console.error('Error fetching latest news:', error);

      await errorLogger.logBackendError(
        'NEWS_FETCH_ERROR',
        'Failed to fetch latest news articles',
        {
          requestPath: req.path,
          requestMethod: req.method,
          metadata: {
            limit: req.query.limit,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        }
      );

      res.status(500).json({
        error: 'Failed to fetch news articles',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/client/news/all
   * Get all published articles with filtering
   * Public endpoint (no auth required)
   */
  async getAllNews(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        category: req.query.category as any,
        featured: req.query.featured === 'true' ? true : undefined,
        search: req.query.search as string | undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
        offset: req.query.offset ? parseInt(req.query.offset as string, 10) : 0,
        order: req.query.order as 'asc' | 'desc' | undefined,
        sort: req.query.sort as any,
      };

      const response = await this.newsService.getPublishedArticles(filters);

      res.json(response);
    } catch (error) {
      console.error('Error fetching all news:', error);

      await errorLogger.logBackendError(
        'NEWS_LIST_ERROR',
        'Failed to fetch news article list',
        {
          requestPath: req.path,
          requestMethod: req.method,
          metadata: {
            filters: req.query,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        }
      );

      res.status(500).json({
        error: 'Failed to fetch news articles',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/client/news/:id
   * Get specific article by ID
   * Public endpoint (no auth required)
   */
  async getArticleById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const article = await this.newsService.getArticleById(id);

      res.json(article);
    } catch (error) {
      console.error('Error fetching article by ID:', error);

      const statusCode = error instanceof Error && error.message === 'Article not found' ? 404 : 500;

      res.status(statusCode).json({
        error: error instanceof Error ? error.message : 'Failed to fetch article',
      });
    }
  }

  /**
   * GET /api/client/news/slug/:slug
   * Get specific article by slug
   * Public endpoint (no auth required)
   */
  async getArticleBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      const article = await this.newsService.getArticleBySlug(slug);

      res.json(article);
    } catch (error) {
      console.error('Error fetching article by slug:', error);

      const statusCode = error instanceof Error && error.message === 'Article not found' ? 404 : 500;

      res.status(statusCode).json({
        error: error instanceof Error ? error.message : 'Failed to fetch article',
      });
    }
  }

  /**
   * GET /api/client/news/featured
   * Get featured articles
   * Public endpoint (no auth required)
   */
  async getFeaturedArticles(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 3;

      const articles = await this.newsService.getFeaturedArticles(limit);

      res.json({ articles });
    } catch (error) {
      console.error('Error fetching featured articles:', error);

      res.status(500).json({
        error: 'Failed to fetch featured articles',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const newsController = new NewsController();
