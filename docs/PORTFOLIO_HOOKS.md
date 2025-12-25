# Portfolio Hooks Documentation

**Version:** 1.0
**Last Updated:** December 25, 2024

---

## Table of Contents

- [Overview](#overview)
- [Core Hooks](#core-hooks)
  - [usePortfolio](#useportfolio)
  - [useBusinesses](#usebusinesses)
  - [useBusinessDetail](#usebusinessdetail)
  - [useFoundationBusinesses](#usefoundationbusinesses)
- [Metrics Hooks](#metrics-hooks)
  - [useBusinessMetrics](#usebusinessmetrics)
  - [useBusinessExposure](#usebusinessexposure)
- [Configuration](#configuration)
- [Caching Strategy](#caching-strategy)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Examples](#examples)

---

## Overview

Portfolio hooks provide a convenient way to fetch and manage portfolio-related data in React components. All hooks are built on the `useDataFetch` utility and support:

- **Automatic Loading States**: Built-in loading indicators
- **Error Handling**: Graceful error management with retry capability
- **Caching**: Configurable client-side caching
- **Polling**: Optional automatic data refresh
- **Skip Logic**: Conditional data fetching

**Location:** `shared/hooks/usePortfolio.ts`

---

## Core Hooks

### usePortfolio

Fetches the complete portfolio overview for a user including all businesses and exposure.

**Signature:**

```typescript
function usePortfolio(
  apiClient: ApiClient,
  options: {
    userId: string;
    filters?: BusinessFilters;
    cache?: CacheConfig;
    skip?: boolean;
  }
): {
  portfolio: PortfolioOverview | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| apiClient | ApiClient | Yes | API client instance |
| options.userId | string | Yes | User ID to fetch portfolio for |
| options.filters | BusinessFilters | No | Filter businesses by status, category, etc. |
| options.cache | CacheConfig | No | Cache configuration |
| options.skip | boolean | No | Skip the request if true |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| portfolio | PortfolioOverview \| null | Portfolio data or null |
| loading | boolean | Loading state indicator |
| error | string \| null | Error message if request failed |
| refetch | () => void | Function to manually refetch data |

**Example:**

```tsx
import { usePortfolio } from '@shared/hooks/usePortfolio';
import { api } from '../lib/api';

function PortfolioView() {
  const { portfolio, loading, error, refetch } = usePortfolio(api, {
    userId: 'current-user',
    filters: {
      status: 'live',
      sort: 'exposure_score',
      order: 'desc',
    },
    cache: {
      enabled: true,
      ttl: 300000, // 5 minutes
    },
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} onRetry={refetch} />;

  return (
    <div>
      <h1>Total Businesses: {portfolio.total_businesses}</h1>
      {portfolio.businesses.map(business => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </div>
  );
}
```

---

### useBusinesses

Fetches a paginated list of businesses with filtering and sorting.

**Signature:**

```typescript
function useBusinesses(
  apiClient: ApiClient,
  options: {
    userId: string;
    filters?: BusinessFilters;
    pagination?: { limit: number; offset: number };
    cache?: CacheConfig;
    skip?: boolean;
  }
): {
  businesses: BusinessWithMetrics[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| apiClient | ApiClient | Yes | API client instance |
| options.userId | string | Yes | User ID for exposure data |
| options.filters | BusinessFilters | No | Filter and sort options |
| options.pagination | object | No | Pagination config (limit, offset) |
| options.cache | CacheConfig | No | Cache configuration |
| options.skip | boolean | No | Skip the request if true |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| businesses | BusinessWithMetrics[] | Array of businesses |
| total | number | Total count (for pagination) |
| loading | boolean | Loading state indicator |
| error | string \| null | Error message if request failed |
| refetch | () => void | Function to manually refetch data |

**Example:**

```tsx
import { useBusinesses } from '@shared/hooks/usePortfolio';
import { usePagination } from '@shared/hooks/usePagination';

function BusinessList() {
  const { page, limit, offset, setPage } = usePagination({ initialLimit: 10 });

  const { businesses, total, loading } = useBusinesses(api, {
    userId: 'current-user',
    filters: {
      search: 'AI',
      category: 'saas',
      sort: 'created_at',
      order: 'desc',
    },
    pagination: { limit, offset },
  });

  return (
    <div>
      {businesses.map(business => (
        <BusinessCard key={business.id} business={business} />
      ))}
      <Pagination
        page={page}
        total={total}
        limit={limit}
        onPageChange={setPage}
      />
    </div>
  );
}
```

---

### useBusinessDetail

Fetches detailed information about a specific business.

**Signature:**

```typescript
function useBusinessDetail(
  apiClient: ApiClient,
  options: {
    businessId: string | undefined;
    userId: string;
    cache?: CacheConfig;
    skip?: boolean;
  }
): {
  business: BusinessWithMetrics | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| apiClient | ApiClient | Yes | API client instance |
| options.businessId | string \| undefined | Yes | Business ID or slug (undefined to skip) |
| options.userId | string | Yes | User ID for exposure data |
| options.cache | CacheConfig | No | Cache configuration |
| options.skip | boolean | No | Skip the request if true |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| business | BusinessWithMetrics \| null | Business details or null |
| loading | boolean | Loading state indicator |
| error | string \| null | Error message if request failed |
| refetch | () => void | Function to manually refetch data |

**Example:**

```tsx
import { useParams } from 'react-router-dom';
import { useBusinessDetail } from '@shared/hooks/usePortfolio';

function BusinessDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { business, loading, error } = useBusinessDetail(api, {
    businessId: slug,
    userId: 'current-user',
    cache: {
      enabled: true,
      ttl: 180000, // 3 minutes
    },
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!business) return <NotFound />;

  return (
    <div>
      <h1>{business.display_name}</h1>
      <p>{business.description}</p>
      <BusinessMetricsGrid business={business} />
    </div>
  );
}
```

---

### useFoundationBusinesses

Fetches the list of foundation businesses (pre-launch businesses).

**Signature:**

```typescript
function useFoundationBusinesses(
  apiClient: ApiClient,
  options?: {
    cache?: CacheConfig;
    skip?: boolean;
  }
): {
  businesses: Business[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}
```

**Example:**

```tsx
import { useFoundationBusinesses } from '@shared/hooks/usePortfolio';

function FoundationBusinesses() {
  const { businesses, loading } = useFoundationBusinesses(api, {
    cache: { enabled: true, ttl: 600000 }, // 10 minutes
  });

  return (
    <div>
      <h2>Foundation Businesses</h2>
      {businesses.map(business => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </div>
  );
}
```

---

## Metrics Hooks

### useBusinessMetrics

Fetches time-series metrics for a business.

**Signature:**

```typescript
function useBusinessMetrics(
  apiClient: ApiClient,
  options: {
    businessId: string | undefined;
    metricType: MetricType;
    startDate?: string;
    endDate?: string;
    cache?: CacheConfig;
    skip?: boolean;
  }
): {
  metrics: BusinessMetricsTimeSeries | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| apiClient | ApiClient | Yes | API client instance |
| options.businessId | string \| undefined | Yes | Business ID (undefined to skip) |
| options.metricType | MetricType | Yes | Type: revenue, users, transactions, api_calls |
| options.startDate | string | No | Start date (ISO 8601) |
| options.endDate | string | No | End date (ISO 8601) |
| options.cache | CacheConfig | No | Cache configuration |
| options.skip | boolean | No | Skip the request if true |

**Example:**

```tsx
import { useBusinessMetrics } from '@shared/hooks/useBusinessMetrics';

function RevenueChartView({ businessId }) {
  const { metrics, loading } = useBusinessMetrics(api, {
    businessId,
    metricType: 'revenue',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    cache: { enabled: true, ttl: 600000 }, // 10 minutes
  });

  if (loading) return <ChartSkeleton />;

  return <RevenueChart data={metrics} />;
}
```

---

### useBusinessExposure

Fetches user exposure breakdown across businesses.

**Signature:**

```typescript
function useBusinessExposure(
  apiClient: ApiClient,
  options: {
    userId: string;
    cache?: CacheConfig;
    skip?: boolean;
  }
): {
  exposure: ExposureBreakdown | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}
```

**Example:**

```tsx
import { useBusinessExposure } from '@shared/hooks/useBusinessExposure';

function ExposureView() {
  const { exposure, loading } = useBusinessExposure(api, {
    userId: 'current-user',
  });

  return (
    <div>
      <h2>Total Exposure: {exposure.total_exposure_score}</h2>
      <ExposureBreakdown data={exposure} />
    </div>
  );
}
```

---

## Configuration

### CacheConfig

```typescript
interface CacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in milliseconds
  key?: string; // Custom cache key
}
```

**Default TTL Values:**
- Portfolio overview: 300000 (5 minutes)
- Business details: 180000 (3 minutes)
- Metrics data: 600000 (10 minutes)
- Foundation businesses: 600000 (10 minutes)

### BusinessFilters

```typescript
interface BusinessFilters {
  status?: BusinessStatus;
  category?: string;
  is_foundation?: boolean;
  is_active?: boolean;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}
```

---

## Caching Strategy

### How Caching Works

1. **Cache Key Generation**: Automatic based on endpoint and parameters
2. **Storage**: In-memory cache (client-side)
3. **TTL**: Configurable time-to-live
4. **Invalidation**: Automatic on refetch or TTL expiration

### Cache Best Practices

```tsx
// ✅ Good: Enable caching for frequently accessed data
const { portfolio } = usePortfolio(api, {
  userId: 'current-user',
  cache: { enabled: true, ttl: 300000 },
});

// ✅ Good: Shorter TTL for frequently changing data
const { business } = useBusinessDetail(api, {
  businessId: 'id',
  userId: 'current-user',
  cache: { enabled: true, ttl: 180000 }, // 3 minutes
});

// ❌ Bad: No caching for repeated requests
const { portfolio } = usePortfolio(api, {
  userId: 'current-user',
  // No cache config - fetches on every render
});

// ❌ Bad: TTL too long for real-time data
const { metrics } = useBusinessMetrics(api, {
  businessId: 'id',
  metricType: 'revenue',
  cache: { enabled: true, ttl: 3600000 }, // 1 hour - too long
});
```

---

## Error Handling

### Error Types

All hooks return errors as strings. Common error types:

- **Network Errors**: "Failed to fetch"
- **Authentication**: "Unauthorized"
- **Not Found**: "Business not found"
- **Validation**: "Invalid parameters"

### Handling Errors

```tsx
const { portfolio, error, refetch } = usePortfolio(api, {
  userId: 'current-user',
});

if (error) {
  return (
    <ErrorAlert
      message="Failed to load portfolio"
      details={error}
      onRetry={refetch}
    />
  );
}
```

### Retry Logic

```tsx
import { useState } from 'react';

function PortfolioWithRetry() {
  const [retryCount, setRetryCount] = useState(0);

  const { portfolio, error, refetch } = usePortfolio(api, {
    userId: 'current-user',
  });

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    refetch();
  };

  if (error && retryCount < 3) {
    return <ErrorAlert onRetry={handleRetry} />;
  }

  return <PortfolioView data={portfolio} />;
}
```

---

## Best Practices

### 1. Conditional Fetching

Use `skip` to prevent unnecessary requests:

```tsx
const { business } = useBusinessDetail(api, {
  businessId: selectedId,
  userId: 'current-user',
  skip: !selectedId, // Don't fetch if no ID selected
});
```

### 2. Combining Hooks

Compose multiple hooks for complex views:

```tsx
function ComprehensiveBusinessView({ businessId }) {
  const { business, loading: businessLoading } = useBusinessDetail(api, {
    businessId,
    userId: 'current-user',
  });

  const { metrics, loading: metricsLoading } = useBusinessMetrics(api, {
    businessId,
    metricType: 'revenue',
    skip: !business, // Wait for business to load
  });

  const loading = businessLoading || metricsLoading;

  return loading ? <LoadingSpinner /> : (
    <>
      <BusinessHeader business={business} />
      <RevenueChart data={metrics} />
    </>
  );
}
```

### 3. Polling for Real-Time Updates

```tsx
import { usePolling } from '@shared/hooks/usePolling';

function LiveMetrics({ businessId }) {
  const { metrics, refetch } = useBusinessMetrics(api, {
    businessId,
    metricType: 'transactions',
    cache: { enabled: false }, // Disable cache for real-time
  });

  // Poll every 30 seconds
  usePolling(refetch, 30000);

  return <TransactionChart data={metrics} />;
}
```

### 4. Debounced Searches

```tsx
import { useState } from 'react';
import { useDebounce } from '@shared/hooks/useDebounce';

function SearchBusinesses() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { businesses } = useBusinesses(api, {
    userId: 'current-user',
    filters: { search: debouncedSearch },
  });

  return (
    <>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search businesses..."
      />
      <BusinessList businesses={businesses} />
    </>
  );
}
```

### 5. Optimistic Updates

```tsx
function OptimisticBusinessList() {
  const { businesses, refetch } = useBusinesses(api, {
    userId: 'current-user',
  });

  const handleUpdate = async (businessId: string, data: any) => {
    // Optimistically update UI
    const optimisticData = businesses.map(b =>
      b.id === businessId ? { ...b, ...data } : b
    );

    try {
      await api.put(`/businesses/${businessId}`, data);
      // Refetch to get server state
      refetch();
    } catch (error) {
      // Revert on error
      console.error('Update failed:', error);
      refetch();
    }
  };

  return <BusinessList businesses={businesses} onUpdate={handleUpdate} />;
}
```

---

## Examples

### Complete Dashboard Implementation

```tsx
import { usePortfolio } from '@shared/hooks/usePortfolio';
import { useFilters } from '@shared/hooks/useFilters';
import { MetricsGrid } from '../components/portfolio/MetricsGrid';
import { BusinessCardList } from '../components/portfolio/BusinessCard';
import { ExposureBreakdown } from '../components/portfolio/ExposureBreakdown';
import { FilterPanel } from '@shared/components/ui/FilterPanel';

export default function PortfolioDashboard() {
  const { filters, setFilter, resetFilters } = useFilters({
    status: undefined,
    category: undefined,
    sort: 'created_at',
    order: 'desc',
  });

  const { portfolio, loading, error, refetch } = usePortfolio(api, {
    userId: 'current-user',
    filters,
    cache: { enabled: true, ttl: 300000 },
  });

  return (
    <div className="space-y-8">
      <h1>Portfolio Dashboard</h1>

      {error && <ErrorAlert message={error} onRetry={refetch} />}

      <FilterPanel
        filters={filters}
        onFilterChange={setFilter}
        onReset={resetFilters}
      />

      <MetricsGrid portfolio={portfolio} loading={loading} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BusinessCardList
            businesses={portfolio?.businesses || []}
            showExposure
          />
        </div>
        <div className="lg:col-span-1">
          <ExposureBreakdown portfolio={portfolio} loading={loading} />
        </div>
      </div>
    </div>
  );
}
```

---

## Support

For hook-related questions:
- Documentation: `shared/hooks/README.md`
- Examples: `shared/hooks/examples.md`
- GitHub Issues: https://github.com/aizura/consortium/issues
