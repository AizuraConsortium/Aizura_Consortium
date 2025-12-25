/**
 * DAO Cache Service
 * Provides in-memory caching for DAO portal data to reduce database load
 * Uses a simple in-memory cache with TTL support
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class DAOCacheService {
  private cache: Map<string, CacheEntry<any>>;

  // Cache keys with their default TTL in seconds
  readonly CACHE_CONFIG = {
    DAO_STATS: { key: 'dao:stats', ttl: 30 }, // 30 seconds
    TREASURY_METRICS: { key: 'dao:treasury', ttl: 120 }, // 2 minutes
    GOVERNANCE_HISTORY: { key: 'dao:history', ttl: 900 }, // 15 minutes
    TREASURY_HISTORY: { key: 'dao:treasury_history', ttl: 900 }, // 15 minutes
    RECENT_PROPOSALS: { key: 'dao:proposals', ttl: 60 }, // 1 minute
    PARTICIPATION_METRICS: { key: 'dao:participation', ttl: 300 }, // 5 minutes
    BUSINESS_BREAKDOWN: { key: 'dao:business_breakdown', ttl: 300 }, // 5 minutes
    TREASURY_GROWTH: { key: 'dao:treasury_growth', ttl: 600 }, // 10 minutes
  };

  constructor() {
    this.cache = new Map();
    this.startCleanupInterval();
  }

  /**
   * Get cached data or fetch using provided function
   */
  async get<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = 60
  ): Promise<T> {
    const cached = this.cache.get(key);

    // Check if cache is valid
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data as T;
    }

    // Cache miss or expired - fetch fresh data
    try {
      const data = await fetchFn();

      // Store in cache
      this.set(key, data, ttl);

      return data;
    } catch (error) {
      // If fetch fails and we have stale cache, return it
      if (cached) {
        console.warn(`[DAOCacheService] Fetch failed for ${key}, returning stale cache`);
        return cached.data as T;
      }

      throw error;
    }
  }

  /**
   * Set cache entry
   */
  set<T>(key: string, data: T, ttl: number): void {
    const expiresAt = Date.now() + ttl * 1000;

    this.cache.set(key, {
      data,
      expiresAt,
    });
  }

  /**
   * Invalidate specific cache key
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidate all cache keys matching a pattern
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    keys: string[];
    hitRate?: number;
  } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Warm cache with initial data
   * Called on server startup
   */
  async warmCache(warmFunctions: Record<string, () => Promise<any>>): Promise<void> {
    console.log('[DAOCacheService] Warming cache...');

    const warmPromises = Object.entries(warmFunctions).map(async ([key, fn]) => {
      try {
        const data = await fn();
        const config = Object.values(this.CACHE_CONFIG).find((c) => c.key === key);
        const ttl = config?.ttl || 60;

        this.set(key, data, ttl);
        console.log(`[DAOCacheService] Warmed cache for ${key}`);
      } catch (error) {
        console.error(`[DAOCacheService] Failed to warm cache for ${key}:`, error);
      }
    });

    await Promise.all(warmPromises);

    console.log('[DAOCacheService] Cache warming complete');
  }

  /**
   * Start automatic cleanup of expired entries
   */
  private startCleanupInterval(): void {
    // Clean up expired entries every 5 minutes
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Remove expired cache entries
   */
  private cleanup(): void {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt < now) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      console.log(`[DAOCacheService] Cleaned up ${removedCount} expired cache entries`);
    }
  }

  /**
   * Get remaining TTL for a cache key in seconds
   */
  getRemainingTTL(key: string): number {
    const cached = this.cache.get(key);

    if (!cached) {
      return 0;
    }

    const remaining = Math.max(0, cached.expiresAt - Date.now());
    return Math.floor(remaining / 1000);
  }

  /**
   * Check if cache key exists and is valid
   */
  has(key: string): boolean {
    const cached = this.cache.get(key);
    return cached !== undefined && cached.expiresAt > Date.now();
  }
}

// Export singleton instance
export const daoCacheService = new DAOCacheService();
