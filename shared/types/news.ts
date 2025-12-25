/**
 * News Type Definitions
 *
 * Domain types for news article system used across website and client applications.
 * Follows established patterns from portfolio.ts and models.ts
 */

import type { Database } from './database.types';

// Extract base types from database schema
export type NewsArticleRow = Database['public']['Tables']['news_articles']['Row'];
export type NewsArticleInsert = Database['public']['Tables']['news_articles']['Insert'];
export type NewsArticleUpdate = Database['public']['Tables']['news_articles']['Update'];

// News category enum
export type NewsCategory =
  | 'Development Updates'
  | 'Partnerships'
  | 'Governance'
  | 'Community'
  | 'Press Releases';

// News article domain model (matches database but with domain logic)
export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  category: NewsCategory;
  author: string;
  featured_image: string | null;
  published: boolean;
  featured: boolean;
  read_time: number;
  views: number;
  publish_date: string | null;
  created_at: string;
  updated_at: string;
}

// Compact version for list displays (dashboard widget)
export interface NewsArticleCompact {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: NewsCategory;
  featured_image: string | null;
  read_time: number;
  publish_date: string | null;
}

// Filters for querying news articles
export interface NewsFilters {
  category?: NewsCategory;
  featured?: boolean;
  published?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  order?: 'asc' | 'desc';
  sort?: 'publish_date' | 'views' | 'created_at' | 'title';
}

// API response types
export interface NewsListResponse {
  articles: NewsArticle[];
  total: number;
  hasMore: boolean;
  filters?: NewsFilters;
}

export interface NewsCompactListResponse {
  articles: NewsArticleCompact[];
  total: number;
}

// Category metadata for UI
export interface NewsCategoryMetadata {
  name: NewsCategory;
  description: string;
  color: string;
  icon: string;
}

// Constants
export const NEWS_CATEGORIES: NewsCategory[] = [
  'Development Updates',
  'Partnerships',
  'Governance',
  'Community',
  'Press Releases',
];

export const NEWS_CATEGORY_METADATA: Record<NewsCategory, NewsCategoryMetadata> = {
  'Development Updates': {
    name: 'Development Updates',
    description: 'Technical progress and feature releases',
    color: 'cyan',
    icon: 'Code',
  },
  'Partnerships': {
    name: 'Partnerships',
    description: 'Collaborations and integrations',
    color: 'blue',
    icon: 'Handshake',
  },
  'Governance': {
    name: 'Governance',
    description: 'DAO decisions and proposals',
    color: 'green',
    icon: 'Vote',
  },
  'Community': {
    name: 'Community',
    description: 'Community highlights and events',
    color: 'yellow',
    icon: 'Users',
  },
  'Press Releases': {
    name: 'Press Releases',
    description: 'Official announcements and media',
    color: 'red',
    icon: 'Megaphone',
  },
};

// Validation helpers
export function isValidNewsCategory(category: string): category is NewsCategory {
  return NEWS_CATEGORIES.includes(category as NewsCategory);
}

// Type guards
export function isNewsArticle(value: unknown): value is NewsArticle {
  if (typeof value !== 'object' || value === null) return false;
  const article = value as Partial<NewsArticle>;
  return (
    typeof article.id === 'string' &&
    typeof article.slug === 'string' &&
    typeof article.title === 'string' &&
    typeof article.excerpt === 'string' &&
    isValidNewsCategory(article.category || '') &&
    typeof article.published === 'boolean'
  );
}
