# Portfolio Components Documentation

**Version:** 1.0
**Last Updated:** December 25, 2024

---

## Table of Contents

- [Overview](#overview)
- [Shared Components](#shared-components)
  - [BusinessMetricCard](#businessmetriccard)
  - [MetricTrendChart](#metrictrendchart)
  - [StatusBadge](#statusbadge)
- [Client Components](#client-components)
  - [BusinessCard](#businesscard)
  - [RevenueChart](#revenuechart)
  - [MetricsGrid](#metricsgrid)
  - [ExposureBreakdown](#exposurebreakdown)
- [Usage Examples](#usage-examples)
- [Styling Guidelines](#styling-guidelines)
- [Accessibility](#accessibility)

---

## Overview

The portfolio components provide a comprehensive UI for displaying business information, metrics, and user exposure across the Aizura ecosystem. Components are divided into:

1. **Shared Components** - Reusable across multiple applications (website, client, admin)
2. **Client Components** - Specific to the client dashboard

### Design Principles

- **Responsive**: Mobile-first design that adapts to all screen sizes
- **Accessible**: WCAG 2.1 AA compliant with proper ARIA labels
- **Performant**: Optimized rendering with loading states
- **Consistent**: Unified design language across components

---

## Shared Components

Located in: `shared/components/portfolio/`

### BusinessMetricCard

Displays a single business metric with formatting and optional trend indicator.

**Props:**

```typescript
interface BusinessMetricCardProps {
  label: string;
  value: number;
  type: 'currency' | 'number' | 'percentage';
  trend?: {
    direction: 'up' | 'down' | 'stable';
    value: number;
  };
  icon?: React.ReactNode;
  className?: string;
}
```

**Example:**

```tsx
import { BusinessMetricCard } from '@shared/components/portfolio/BusinessMetricCard';
import { DollarSign } from 'lucide-react';

<BusinessMetricCard
  label="Monthly Revenue"
  value={125000}
  type="currency"
  trend={{ direction: 'up', value: 12 }}
  icon={<DollarSign className="w-5 h-5" />}
/>
```

**Features:**
- Automatic number formatting based on type
- Trend indicator with percentage
- Color-coded by trend direction
- Responsive layout

---

### MetricTrendChart

SVG-based line chart for displaying metric trends over time.

**Props:**

```typescript
interface MetricTrendChartProps {
  data: BusinessMetricsTimeSeries;
  color?: string;
  height?: number;
  showGrid?: boolean;
  showAxes?: boolean;
  className?: string;
}
```

**Example:**

```tsx
import { MetricTrendChart } from '@shared/components/portfolio/MetricTrendChart';

<MetricTrendChart
  data={revenueData}
  color="#06b6d4"
  height={300}
  showGrid={true}
  showAxes={true}
/>
```

**Features:**
- Smooth SVG line rendering
- Optional grid and axes
- Responsive sizing
- Customizable colors
- Hover tooltips

---

### StatusBadge

Displays status, progress, exposure type, or activity level with consistent styling.

**Props:**

```typescript
interface StatusBadgeProps {
  status?: BusinessStatus;
  progress?: number;
  exposureType?: ExposureType;
  activityLevel?: ActivityLevel;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

**Examples:**

```tsx
import { StatusBadge, ProgressBadge } from '@shared/components/portfolio/StatusBadge';

// Business status
<StatusBadge status="live" showIcon />

// Development progress
<ProgressBadge progress={65} />

// Exposure type
<StatusBadge exposureType="voting" showIcon />

// Activity level
<StatusBadge activityLevel="high" />
```

**Variants:**

| Variant | Colors | Use Case |
|---------|--------|----------|
| `status` | green (live), blue (development), yellow (planning), gray (paused) | Business status |
| `progress` | cyan gradient | Development progress % |
| `exposureType` | cyan (voting), yellow (usage), purple (proposal), green (mixed) | User exposure type |
| `activityLevel` | green (high), yellow (medium), gray (low) | User activity level |

---

## Client Components

Located in: `client/components/portfolio/`

### BusinessCard

Displays a business card with status, metrics, exposure, and action links.

**Props:**

```typescript
interface BusinessCardProps {
  business: BusinessWithMetrics;
  showExposure?: boolean;
  className?: string;
}
```

**Example:**

```tsx
import { BusinessCard } from '../components/portfolio/BusinessCard';

<BusinessCard
  business={businessData}
  showExposure={true}
/>
```

**Features:**
- Business name and logo
- Status and category badges
- Current metrics (revenue, users)
- Exposure score display
- Development progress bar
- Links to website, GitHub, docs
- Navigation to detail page

**Layout:**
```
┌─────────────────────────────────────┐
│ [Logo] Business Name          [🌐][⚙]│
│ Description text here...            │
│ [Live] [Category] [Voting]          │
│                                     │
│ Revenue: $125K  |  Users: 8K        │
│                                     │
│ Exposure Score: 45.5  (5 votes)     │
│                                     │
│ [Progress Bar: 100%]                │
│ View Business Details →             │
└─────────────────────────────────────┘
```

---

### BusinessCardList

Renders a list of business cards with empty state handling.

**Props:**

```typescript
interface BusinessCardListProps {
  businesses: BusinessWithMetrics[];
  showExposure?: boolean;
  emptyMessage?: string;
  className?: string;
}
```

**Example:**

```tsx
import { BusinessCardList } from '../components/portfolio/BusinessCard';

<BusinessCardList
  businesses={portfolioData.businesses}
  showExposure={true}
  emptyMessage="No businesses found"
/>
```

---

### RevenueChart

Revenue trend visualization with period selector and statistics.

**Props:**

```typescript
interface RevenueChartProps {
  data: BusinessMetricsTimeSeries;
  businessName?: string;
  className?: string;
  loading?: boolean;
  showPeriodSelector?: boolean;
}
```

**Example:**

```tsx
import { RevenueChart } from '../components/portfolio/RevenueChart';

<RevenueChart
  data={revenueMetrics}
  businessName="AI Traders"
  showPeriodSelector={true}
/>
```

**Features:**
- Period selector (7d, 30d, 90d, 1y, all)
- Total and average revenue display
- Trend indicator with percentage
- Line chart visualization
- Date range display

---

### RevenueComparison

Compares revenues across multiple businesses.

**Props:**

```typescript
interface RevenueComparisonProps {
  businesses: Array<{
    name: string;
    revenue: number;
    trend?: { direction: 'up' | 'down' | 'stable'; change_percent: number };
  }>;
  className?: string;
}
```

**Example:**

```tsx
import { RevenueComparison } from '../components/portfolio/RevenueChart';

<RevenueComparison
  businesses={[
    { name: 'AI Traders', revenue: 125000, trend: { direction: 'up', change_percent: 12 } },
    { name: 'Coinfusion', revenue: 83000, trend: { direction: 'up', change_percent: 8 } }
  ]}
/>
```

---

### MetricsGrid

Displays portfolio overview or business-specific metrics in a grid layout.

**Props:**

```typescript
interface MetricsGridProps {
  portfolio?: PortfolioOverview | null;
  loading?: boolean;
  className?: string;
}

interface BusinessMetricsGridProps {
  business: BusinessWithMetrics;
  loading?: boolean;
  className?: string;
}
```

**Examples:**

```tsx
import { MetricsGrid, BusinessMetricsGrid } from '../components/portfolio/MetricsGrid';

// Portfolio overview
<MetricsGrid portfolio={portfolioData} />

// Business-specific
<BusinessMetricsGrid business={businessData} />
```

**Portfolio Grid Layout (4 columns):**
- Total Businesses
- Total Revenue
- Total Users
- Exposure Score

**Business Grid Layout (adaptive):**
- Monthly Revenue (if available)
- Active Users (if available)
- Transactions (if available)
- API Calls (if available)

---

### ExposureBreakdown

Displays user's exposure distribution across businesses and types.

**Props:**

```typescript
interface ExposureBreakdownProps {
  portfolio?: PortfolioOverview | null;
  loading?: boolean;
  className?: string;
}
```

**Example:**

```tsx
import { ExposureBreakdown } from '../components/portfolio/ExposureBreakdown';

<ExposureBreakdown portfolio={portfolioData} />
```

**Features:**
- Exposure by type (voting, usage, proposal, mixed)
- Percentage breakdown with progress bars
- Top 3 exposures list
- Empty state when no exposure

---

### BusinessExposureDetail

Shows detailed exposure information for a single business.

**Props:**

```typescript
interface BusinessExposureDetailProps {
  exposure: UserExposure;
  businessName: string;
  className?: string;
}
```

**Example:**

```tsx
import { BusinessExposureDetail } from '../components/portfolio/ExposureBreakdown';

<BusinessExposureDetail
  exposure={business.exposure}
  businessName="AI Traders"
/>
```

---

## Usage Examples

### Complete Portfolio View

```tsx
import { usePortfolio } from '@shared/hooks/usePortfolio';
import { api } from '../lib/api';
import { MetricsGrid } from '../components/portfolio/MetricsGrid';
import { BusinessCardList } from '../components/portfolio/BusinessCard';
import { ExposureBreakdown } from '../components/portfolio/ExposureBreakdown';

export default function PortfolioView() {
  const { portfolio, loading, error } = usePortfolio(api, {
    userId: 'current-user',
    cache: { enabled: true, ttl: 300000 },
  });

  return (
    <div className="space-y-8">
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

### Business Detail Page

```tsx
import { useBusinessDetail } from '@shared/hooks/usePortfolio';
import { useBusinessMetrics } from '@shared/hooks/useBusinessMetrics';
import { BusinessMetricsGrid } from '../components/portfolio/MetricsGrid';
import { RevenueChart } from '../components/portfolio/RevenueChart';
import { BusinessExposureDetail } from '../components/portfolio/ExposureBreakdown';

export default function BusinessDetail({ businessId }) {
  const { business, loading } = useBusinessDetail(api, {
    businessId,
    userId: 'current-user',
  });

  const { metrics } = useBusinessMetrics(api, {
    businessId: business?.id,
    metricType: 'revenue',
  });

  return (
    <div className="space-y-8">
      <BusinessMetricsGrid business={business} />

      {metrics && (
        <RevenueChart
          data={metrics}
          businessName={business.display_name}
          showPeriodSelector
        />
      )}

      {business?.exposure && (
        <BusinessExposureDetail
          exposure={business.exposure}
          businessName={business.display_name}
        />
      )}
    </div>
  );
}
```

---

## Styling Guidelines

### Color Palette

**Status Colors:**
- Live: `green-400` / `green-500`
- Development: `blue-400` / `blue-500`
- Planning: `yellow-400` / `yellow-500`
- Paused: `slate-400` / `slate-500`

**Exposure Colors:**
- Voting: `cyan-400` / `cyan-500`
- Usage: `yellow-400` / `yellow-500`
- Proposal: `purple-400` / `purple-500`
- Mixed: `green-400` / `green-500`

**Metrics Colors:**
- Revenue: `green-400`
- Users: `blue-400`
- Transactions: `purple-400`
- API Calls: `cyan-400`

### Spacing

- Card padding: `p-6`
- Grid gaps: `gap-4` (small), `gap-6` (medium)
- Section spacing: `space-y-8`

### Responsive Breakpoints

- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px

---

## Accessibility

### ARIA Labels

All interactive elements include proper ARIA labels:

```tsx
<a
  href={business.website_url}
  aria-label="Visit website"
>
  <Globe className="w-5 h-5" />
</a>
```

### Keyboard Navigation

- All links and buttons are keyboard accessible
- Tab order follows logical flow
- Focus indicators on all interactive elements

### Screen Readers

- Semantic HTML structure
- Proper heading hierarchy (h1 → h2 → h3)
- Descriptive button/link text
- Empty states with explanatory text

### Color Contrast

All text meets WCAG 2.1 AA standards:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

---

## Performance Tips

1. **Use Loading States**: Always provide loading skeletons
2. **Cache Data**: Enable caching for frequently accessed data
3. **Lazy Load Charts**: Load chart libraries only when needed
4. **Optimize Images**: Use appropriate image sizes for logos
5. **Debounce Filters**: Debounce search/filter inputs

---

## Support

For component questions or issues:
- Component Library: `shared/components/portfolio/README.md`
- GitHub Issues: https://github.com/aizura/consortium/issues
- Discord: #frontend-support channel
