/**
 * News Validation Utilities
 *
 * Validation functions for news article data.
 * Follows patterns from business-validators.ts
 */

import { isEmpty } from '../validators';
import type { NewsCategory, NewsFilters } from '../../types/news';
import { NEWS_CATEGORIES } from '../../types/news';

export interface NewsValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate news article title
 */
export function validateNewsTitle(title: string): NewsValidationResult {
  const errors: Record<string, string> = {};

  if (isEmpty(title)) {
    errors.title = 'Title is required';
  } else if (title.length < 10) {
    errors.title = 'Title must be at least 10 characters';
  } else if (title.length > 200) {
    errors.title = 'Title must not exceed 200 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate news article excerpt
 */
export function validateNewsExcerpt(excerpt: string): NewsValidationResult {
  const errors: Record<string, string> = {};

  if (isEmpty(excerpt)) {
    errors.excerpt = 'Excerpt is required';
  } else if (excerpt.length < 50) {
    errors.excerpt = 'Excerpt must be at least 50 characters';
  } else if (excerpt.length > 500) {
    errors.excerpt = 'Excerpt must not exceed 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate news category
 */
export function validateNewsCategory(category: string): NewsValidationResult {
  const errors: Record<string, string> = {};

  if (isEmpty(category)) {
    errors.category = 'Category is required';
  } else if (!NEWS_CATEGORIES.includes(category as NewsCategory)) {
    errors.category = `Invalid category. Must be one of: ${NEWS_CATEGORIES.join(', ')}`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate slug format
 */
export function validateNewsSlug(slug: string): NewsValidationResult {
  const errors: Record<string, string> = {};
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  if (isEmpty(slug)) {
    errors.slug = 'Slug is required';
  } else if (!slugRegex.test(slug)) {
    errors.slug = 'Slug must be lowercase letters, numbers, and hyphens only';
  } else if (slug.length < 3) {
    errors.slug = 'Slug must be at least 3 characters';
  } else if (slug.length > 200) {
    errors.slug = 'Slug must not exceed 200 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate news filters
 */
export function validateNewsFilters(filters: NewsFilters): NewsValidationResult {
  const errors: Record<string, string> = {};

  if (filters.category && !NEWS_CATEGORIES.includes(filters.category)) {
    errors.category = 'Invalid category filter';
  }

  if (filters.limit !== undefined) {
    if (filters.limit < 1) {
      errors.limit = 'Limit must be at least 1';
    } else if (filters.limit > 100) {
      errors.limit = 'Limit must not exceed 100';
    }
  }

  if (filters.offset !== undefined && filters.offset < 0) {
    errors.offset = 'Offset cannot be negative';
  }

  if (filters.order && !['asc', 'desc'].includes(filters.order)) {
    errors.order = 'Order must be "asc" or "desc"';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Generate slug from title
 */
export function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Calculate estimated read time from content
 */
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes);
}
