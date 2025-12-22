/**
 * Repository Cache
 *
 * In-memory caching layer for repository operations with:
 * - Configurable TTL per data type
 * - Automatic cache invalidation on writes
 * - LRU eviction policy
 * - Cache statistics tracking
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

export interface CacheConfig {
  ttl: number;
  maxSize?: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  evictions: number;
}

const DEFAULT_CONFIGS: Record<string, CacheConfig> = {
  user_roles: { ttl: 300000, maxSize: 1000 },
  proposals: { ttl: 30000, maxSize: 500 },
  agent_votes: { ttl: 10000, maxSize: 100 },
  plan_revisions: { ttl: 3600000, maxSize: 1000 },
  rate_limit_stats: { ttl: 60000, maxSize: 50 },
  topics: { ttl: 15000, maxSize: 100 },
  plans: { ttl: 30000, maxSize: 200 },
};

/**
 * Repository Cache Singleton
 */
class RepositoryCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
  };
  private enabled: boolean = true;

  /**
   * Get value from cache
   */
  get<T>(key: string, namespace: string = 'default'): T | null {
    if (!this.enabled) return null;

    const cacheKey = this.buildKey(namespace, key);
    const entry = this.cache.get(cacheKey);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(cacheKey);
      this.stats.misses++;
      return null;
    }

    entry.hits++;
    this.stats.hits++;
    return entry.data as T;
  }

  /**
   * Set value in cache
   */
  set<T>(
    key: string,
    value: T,
    namespace: string = 'default',
    customTTL?: number
  ): void {
    if (!this.enabled) return;

    const config = DEFAULT_CONFIGS[namespace] || { ttl: 60000, maxSize: 100 };
    const ttl = customTTL || config.ttl;
    const cacheKey = this.buildKey(namespace, key);

    if (config.maxSize && this.cache.size >= config.maxSize) {
      this.evictLRU();
    }

    this.cache.set(cacheKey, {
      data: value,
      timestamp: Date.now(),
      ttl,
      hits: 0,
    });
  }

  /**
   * Delete value from cache
   */
  delete(key: string, namespace: string = 'default'): void {
    const cacheKey = this.buildKey(namespace, key);
    this.cache.delete(cacheKey);
  }

  /**
   * Invalidate all entries in a namespace
   */
  invalidateNamespace(namespace: string): void {
    const prefix = `${namespace}:`;
    const keysToDelete: string[] = [];

    this.cache.forEach((_, key) => {
      if (key.startsWith(prefix)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Invalidate pattern-matched keys
   */
  invalidatePattern(pattern: RegExp, namespace: string = 'default'): void {
    const prefix = `${namespace}:`;
    const keysToDelete: string[] = [];

    this.cache.forEach((_, key) => {
      if (key.startsWith(prefix)) {
        const actualKey = key.substring(prefix.length);
        if (pattern.test(actualKey)) {
          keysToDelete.push(key);
        }
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
    };
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? this.stats.hits / totalRequests : 0;

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate,
      size: this.cache.size,
      evictions: this.stats.evictions,
    };
  }

  /**
   * Enable/disable cache
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.clear();
    }
  }

  /**
   * Check if cache is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Get cache entry metadata
   */
  getEntryMetadata(key: string, namespace: string = 'default'): {
    exists: boolean;
    age?: number;
    ttl?: number;
    hits?: number;
  } {
    const cacheKey = this.buildKey(namespace, key);
    const entry = this.cache.get(cacheKey);

    if (!entry) {
      return { exists: false };
    }

    return {
      exists: true,
      age: Date.now() - entry.timestamp,
      ttl: entry.ttl,
      hits: entry.hits,
    };
  }

  /**
   * Warm cache with data
   */
  warmCache<T>(
    entries: Array<{ key: string; value: T }>,
    namespace: string = 'default',
    ttl?: number
  ): void {
    entries.forEach(({ key, value }) => {
      this.set(key, value, namespace, ttl);
    });
  }

  /**
   * Get all keys in namespace
   */
  getKeys(namespace: string = 'default'): string[] {
    const prefix = `${namespace}:`;
    const keys: string[] = [];

    this.cache.forEach((_, key) => {
      if (key.startsWith(prefix)) {
        keys.push(key.substring(prefix.length));
      }
    });

    return keys;
  }

  /**
   * Build cache key
   */
  private buildKey(namespace: string, key: string): string {
    return `${namespace}:${key}`;
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;
    let lowestHits = Infinity;

    this.cache.forEach((entry, key) => {
      if (entry.hits < lowestHits || (entry.hits === lowestHits && entry.timestamp < oldestTimestamp)) {
        oldestKey = key;
        oldestTimestamp = entry.timestamp;
        lowestHits = entry.hits;
      }
    });

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): number {
    const now = Date.now();
    let cleaned = 0;
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      cleaned++;
    });

    return cleaned;
  }

  /**
   * Start periodic cleanup
   */
  startPeriodicCleanup(intervalMs: number = 60000): NodeJS.Timeout {
    return setInterval(() => {
      const cleaned = this.cleanExpired();
      if (cleaned > 0) {
        console.log(`[CACHE] Cleaned ${cleaned} expired entries`);
      }
    }, intervalMs);
  }
}

export const repositoryCache = new RepositoryCache();

repositoryCache.startPeriodicCleanup();
