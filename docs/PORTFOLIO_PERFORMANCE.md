# Portfolio Performance Optimization Guide

**Version:** 1.0
**Last Updated:** December 25, 2024

---

## Table of Contents

- [Overview](#overview)
- [Performance Monitoring](#performance-monitoring)
- [Query Optimization](#query-optimization)
- [Caching Strategy](#caching-strategy)
- [Database Optimization](#database-optimization)
- [Frontend Optimization](#frontend-optimization)
- [Monitoring & Metrics](#monitoring--metrics)
- [Troubleshooting](#troubleshooting)

---

## Overview

This guide covers performance optimization strategies for the portfolio feature, including database queries, API endpoints, and frontend rendering.

### Performance Goals

- **API Response Time**: < 200ms (p95)
- **Database Queries**: < 100ms (p95)
- **Initial Page Load**: < 2s
- **Time to Interactive**: < 3s

---

## Performance Monitoring

### Built-in Monitoring

All portfolio queries use the BaseRepository which includes automatic performance monitoring:

```typescript
// Already implemented in BaseRepository
async execute<T>(
  operation: () => Promise<T>,
  context?: OperationContext
): Promise<T> {
  const startTime = Date.now();

  try {
    const result = await operation();
    const duration = Date.now() - startTime;

    // Log slow queries (> 1000ms)
    if (duration > 1000) {
      console.warn(`Slow query detected: ${context?.operation} took ${duration}ms`);
    }

    return result;
  } catch (error) {
    // Error handling...
  }
}
```

### Query Performance Tracking

Monitor query performance in application logs:

```typescript
// backend/shared/services/supabase/monitoring/QueryMonitor.ts
export class QueryMonitor {
  trackQuery(operation: string, duration: number, metadata?: any): void {
    if (duration > 1000) {
      console.warn(`[SLOW QUERY] ${operation}: ${duration}ms`, metadata);
    }

    // Send to monitoring service (e.g., DataDog, New Relic)
    this.sendMetric('query.duration', duration, {
      operation,
      ...metadata,
    });
  }
}
```

### Frontend Performance

Track rendering performance in client components:

```typescript
import { useEffect } from 'react';

function PortfolioView() {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;
      console.log(`PortfolioView render time: ${duration}ms`);

      if (duration > 1000) {
        console.warn('Slow render detected in PortfolioView');
      }
    };
  }, []);

  // Component code...
}
```

---

## Query Optimization

### Materialized Views

Portfolio uses materialized views for optimal performance:

```sql
-- user_portfolio_exposure - Pre-computed exposure scores
CREATE MATERIALIZED VIEW user_portfolio_exposure AS
SELECT
  u.id as user_id,
  b.id as business_id,
  -- Exposure calculation here
FROM users u
CROSS JOIN u2e_businesses b
LEFT JOIN agent_votes av ON ...;

-- Refresh every 15 minutes via pg_cron
SELECT cron.schedule(
  'refresh-portfolio-exposure',
  '*/15 * * * *',
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY user_portfolio_exposure$$
);
```

### Index Strategy

Critical indexes for portfolio queries:

```sql
-- Business lookups
CREATE INDEX idx_u2e_businesses_slug ON u2e_businesses(slug);
CREATE INDEX idx_u2e_businesses_status ON u2e_businesses(status);
CREATE INDEX idx_u2e_businesses_category ON u2e_businesses(category);
CREATE INDEX idx_u2e_businesses_is_foundation ON u2e_businesses(is_foundation);

-- Metrics queries
CREATE INDEX idx_business_metrics_business_period
  ON business_metrics_history(business_id, period_start DESC);

-- Exposure queries
CREATE INDEX idx_portfolio_exposure_user
  ON user_portfolio_exposure(user_id);
```

### Query Best Practices

**✅ Good: Specific column selection**
```typescript
.select('id, display_name, status, category')
```

**❌ Bad: Select all columns**
```typescript
.select('*')
```

**✅ Good: Filter at database level**
```typescript
.eq('status', 'live')
.is('deleted_at', null)
```

**❌ Bad: Filter in application**
```typescript
const allBusinesses = await getAll();
const liveBusinesses = allBusinesses.filter(b => b.status === 'live');
```

**✅ Good: Use pagination**
```typescript
.range(offset, offset + limit - 1)
```

**❌ Bad: Load all rows**
```typescript
.select('*')  // No limit
```

---

## Caching Strategy

### Multi-Level Caching

```
┌─────────────┐
│   Client    │ → 5 minute cache
├─────────────┤
│     CDN     │ → No cache (authenticated)
├─────────────┤
│  API Server │ → No cache (dynamic data)
├─────────────┤
│  Database   │ → Materialized views (15 min refresh)
└─────────────┘
```

### Client-Side Caching

```typescript
// Frontend hook with caching
const { portfolio } = usePortfolio(api, {
  userId: 'current-user',
  cache: {
    enabled: true,
    ttl: 300000, // 5 minutes
  },
});
```

### Cache Invalidation

```typescript
// Invalidate cache on data changes
async function updateBusiness(id: string, data: any) {
  await api.put(`/portfolio/businesses/${id}`, data);

  // Clear relevant caches
  cache.invalidate('portfolio:overview');
  cache.invalidate(`business:${id}`);
}
```

### Cache TTL Guidelines

| Data Type | TTL | Reason |
|-----------|-----|--------|
| Portfolio overview | 5 min | Frequently accessed, changes moderately |
| Business details | 3 min | User-specific exposure data |
| Metrics history | 10 min | Historical data, changes infrequently |
| Foundation businesses | 10 min | Rarely changes |

---

## Database Optimization

### Connection Pooling

```typescript
// Supabase client configuration
const supabase = createClient(url, key, {
  db: {
    schema: 'public',
  },
  auth: {
    persistSession: false, // Disable for API server
  },
  global: {
    headers: {
      'x-client-info': 'portfolio-api',
    },
  },
});
```

### Prepared Statements

Supabase automatically uses prepared statements, but ensure parameterization:

```typescript
// ✅ Good: Parameterized query
.eq('status', userInputStatus)

// ❌ Bad: String concatenation (SQL injection risk)
.eq('status = ' + userInputStatus)
```

### Batch Operations

```typescript
// ✅ Good: Batch insert
await supabase
  .from('business_metrics_history')
  .insert(metricsArray); // Array of 100 items

// ❌ Bad: Individual inserts
for (const metric of metricsArray) {
  await supabase.from('business_metrics_history').insert(metric);
}
```

### EXPLAIN ANALYZE

Analyze slow queries:

```sql
EXPLAIN ANALYZE
SELECT *
FROM user_portfolio_exposure
WHERE user_id = 'uuid'
AND exposure_score > 10;

-- Look for:
-- - Seq Scan (should be Index Scan)
-- - High execution time
-- - High number of rows examined
```

---

## Frontend Optimization

### Code Splitting

```typescript
// Lazy load heavy components
import { lazy, Suspense } from 'react';

const RevenueChart = lazy(() => import('../components/portfolio/RevenueChart'));

function BusinessDetail() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <RevenueChart data={metrics} />
    </Suspense>
  );
}
```

### Memoization

```typescript
import { useMemo } from 'react';

function PortfolioView({ businesses }) {
  // Memoize expensive calculations
  const sortedBusinesses = useMemo(() => {
    return [...businesses].sort((a, b) =>
      b.exposure_score - a.exposure_score
    );
  }, [businesses]);

  return <BusinessList businesses={sortedBusinesses} />;
}
```

### Virtual Scrolling

For large lists (>50 items):

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function LargeBusinessList({ businesses }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: businesses.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Estimated row height
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <BusinessCard business={businesses[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Image Optimization

```typescript
<img
  src={business.logo_url}
  alt={business.display_name}
  loading="lazy"
  decoding="async"
  width="64"
  height="64"
  className="rounded-lg"
/>
```

---

## Monitoring & Metrics

### Key Performance Indicators

Track these metrics:

```typescript
// API Response Times
metrics.histogram('api.portfolio.overview.duration', duration, {
  status: response.status,
});

// Database Query Times
metrics.histogram('db.portfolio.query.duration', duration, {
  operation: 'getBusinesses',
  table: 'u2e_businesses',
});

// Cache Hit Rate
metrics.counter('cache.portfolio.hit', 1);
metrics.counter('cache.portfolio.miss', 1);

// Error Rates
metrics.counter('api.portfolio.error', 1, {
  endpoint: '/portfolio/overview',
  error_code: 'VALIDATION_ERROR',
});
```

### Performance Thresholds

Set up alerts for:

```yaml
alerts:
  - name: slow_portfolio_queries
    condition: p95(db.portfolio.query.duration) > 100ms
    action: notify_team

  - name: high_error_rate
    condition: rate(api.portfolio.error) > 1%
    action: page_oncall

  - name: low_cache_hit_rate
    condition: cache_hit_rate < 80%
    action: notify_team
```

---

## Troubleshooting

### Slow Portfolio Overview

**Symptoms:** Portfolio overview endpoint takes >500ms

**Possible Causes:**
1. Materialized view not refreshed
2. Too many businesses (>100)
3. Complex exposure calculations

**Solutions:**
```sql
-- Check view refresh status
SELECT * FROM pg_stat_user_tables
WHERE schemaname = 'public'
AND relname = 'user_portfolio_exposure';

-- Manual refresh if needed
REFRESH MATERIALIZED VIEW CONCURRENTLY user_portfolio_exposure;

-- Check for missing indexes
SELECT tablename, indexname
FROM pg_indexes
WHERE tablename = 'user_portfolio_exposure';
```

### High Memory Usage

**Symptoms:** Server memory usage spikes during portfolio queries

**Possible Causes:**
1. Loading too many rows at once
2. Missing pagination
3. Memory leak in caching

**Solutions:**
```typescript
// Add pagination limits
const MAX_RESULTS = 100;
query = query.range(0, MAX_RESULTS - 1);

// Clear cache periodically
setInterval(() => {
  cache.clear();
}, 3600000); // Every hour
```

### Slow Chart Rendering

**Symptoms:** Revenue charts take >2s to render

**Possible Causes:**
1. Too many data points (>100)
2. Expensive calculations in render
3. Missing memoization

**Solutions:**
```typescript
// Limit data points
const limitedData = useMemo(() => {
  if (data.data_points.length > 100) {
    // Sample every Nth point
    const step = Math.ceil(data.data_points.length / 100);
    return data.data_points.filter((_, i) => i % step === 0);
  }
  return data.data_points;
}, [data]);

// Memoize expensive calculations
const chartData = useMemo(() => {
  return processDataForChart(limitedData);
}, [limitedData]);
```

---

## Performance Checklist

### Backend
- [ ] Materialized views refreshing every 15 minutes
- [ ] All critical indexes created
- [ ] Query performance monitoring enabled
- [ ] Connection pooling configured
- [ ] Slow query logging enabled
- [ ] API response time < 200ms (p95)

### Frontend
- [ ] Client-side caching enabled (5 min TTL)
- [ ] Loading skeletons for all async operations
- [ ] Code splitting for heavy components
- [ ] Images optimized and lazy-loaded
- [ ] Virtual scrolling for large lists
- [ ] Memoization for expensive calculations
- [ ] Initial load time < 2s

### Database
- [ ] Indexes on foreign keys
- [ ] Indexes on frequently filtered columns
- [ ] Materialized views for complex queries
- [ ] Vacuum and analyze running regularly
- [ ] Connection pool sized appropriately
- [ ] Query execution time < 100ms (p95)

---

## Support

For performance issues:
- Check monitoring dashboard first
- Run EXPLAIN ANALYZE on slow queries
- Profile frontend with React DevTools
- GitHub Issues: https://github.com/aizura/consortium/issues
