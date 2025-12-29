# Phase 4: New Website Visualizations

This document describes the new components created in Phase 4 to enhance tokenomics visualization.

## New Components

### 1. SupplyProjection.tsx
**Location:** `/website/components/infographics/SupplyProjection.tsx`

**Purpose:** Year-by-year circulating supply projection from Genesis through deflationary phase

**Features:**
- Visual timeline showing Years 0-4 emission phases
- Progress bars for each year showing percentage of max supply
- Post-Year 4 deflationary milestones (81M → 21M)
- Key metrics: Peak supply (81M), To be burned (60M), Final supply (21M)
- Color-coded phases from cyan → blue → green → yellow → orange → red

**Usage:**
```tsx
import { SupplyProjection } from '../components/infographics/SupplyProjection';

<SupplyProjection />
```

**Data Shown:**
- Year 0: 16M (16%) - Genesis + Initial Distribution
- Year 1: 47M (47%) - Year 1 Emissions (31M)
- Year 2: 61M (61%) - Year 2 Emissions (14M)
- Year 3: 75M (75%) - Year 3 Emissions (14M)
- Year 4: 81M (81%) - Year 4 Emissions (6M)
- Post-Year 4: Burns begin reducing to 21M

---

### 2. CostComparison.tsx
**Location:** `/website/components/infographics/CostComparison.tsx`

**Purpose:** Visual comparison of traditional vs AI business costs

**Features:**
- Side-by-side comparison of cost structures
- Traditional business: $500K-$900K/year breakdown
- AI business: $18K-$65K/year breakdown
- Cost savings analysis (90-98% reduction)
- Portfolio economics: 100 failures + 1 success = massive ROI

**Usage:**
```tsx
import { CostComparison } from '../components/infographics/CostComparison';

<CostComparison />
```

**Key Insights:**
- AI businesses cost 10-20x less than traditional
- 100 AI business experiments = $4.4M total cost
- 1 success generating $10M = $5.6M net profit
- 2.3x ROI even with 99% failure rate

---

### 3. TokenomicsTimeline.tsx
**Location:** `/website/components/diagrams/TokenomicsTimeline.tsx`

**Purpose:** Interactive timeline showing emissions, vesting, and transition to revenue-backed model

**Features:**
- Clickable phases showing detailed breakdowns
- Visual timeline with connecting lines
- Phase-specific details (emissions, vesting, events)
- Color-coded gradient bars for each phase
- Summary cards for emission/burn/vesting phases

**Usage:**
```tsx
import { TokenomicsTimeline } from '../components/diagrams/TokenomicsTimeline';

<TokenomicsTimeline />
```

**Phases Covered:**
- Genesis (Month 0): Initial distribution
- Year 1 (Months 1-12): 31M emissions
- Year 2 (Months 13-24): 14M emissions
- Year 3 (Months 25-36): 14M emissions
- Year 4 (Months 37-48): 6M emissions
- Post-Year 4 (Month 49+): Revenue-backed model + burns

---

### 4. BurnCalculator.tsx (Enhanced)
**Location:** `/website/components/calculators/BurnCalculator.tsx`

**Purpose:** Calculate timeline to burn 79M tokens and reach 21M final supply

**Enhancements:**
- Added 6 scenarios (previously 4)
- Recalibrated for realistic timelines
- Added description labels showing expected years
- Prominent note about Bitcoin parity requiring sustained profitability

**Usage:**
```tsx
import { BurnCalculator } from '../components/calculators/BurnCalculator';

<BurnCalculator />
```

**New Scenarios:**
1. **Conservative** (~219 years)
   - Monthly Profit: $40,080
   - Token Price: $0.20
   - Burn Rate: 30,060 AAIC/month

2. **Base Case** (~109 years)
   - Monthly Profit: $80,730
   - Token Price: $0.50
   - Burn Rate: 60,398 AAIC/month

3. **Growth** (~54 years)
   - Monthly Profit: $163,100
   - Token Price: $1.00
   - Burn Rate: 120,825 AAIC/month

4. **Aggressive** (~43 years)
   - Monthly Profit: $255,800
   - Token Price: $1.50
   - Burn Rate: 153,870 AAIC/month

5. **Hyperscale** (~14.6 years)
   - Monthly Profit: $600,700
   - Token Price: $2.00
   - Burn Rate: 451,025 AAIC/month

6. **Ultra-Aggressive** (~8.8 years)
   - Monthly Profit: $1,252,800
   - Token Price: $2.50
   - Burn Rate: 751,680 AAIC/month

**Key Formula:**
- Monthly Burn USD = Monthly Profit × 15%
- Monthly Burn AAIC = Monthly Burn USD / Token Price
- Years to 21M = (79,000,000 / Monthly Burn AAIC) / 12

---

## Integration Examples

### Tokenomics Overview Page
```tsx
import { SupplyProjection } from '../components/infographics/SupplyProjection';
import { TokenomicsTimeline } from '../components/diagrams/TokenomicsTimeline';
import { BurnCalculator } from '../components/calculators/BurnCalculator';

export default function TokenomicsPage() {
  return (
    <PageLayout>
      <section>
        <h2>Supply Projection</h2>
        <SupplyProjection />
      </section>

      <section>
        <h2>Emission & Vesting Timeline</h2>
        <TokenomicsTimeline />
      </section>

      <section>
        <h2>Burn Timeline Calculator</h2>
        <BurnCalculator />
      </section>
    </PageLayout>
  );
}
```

### Portfolio Economics Page
```tsx
import { CostComparison } from '../components/infographics/CostComparison';

export default function EconomicsPage() {
  return (
    <PageLayout>
      <section>
        <h2>Why AI Businesses Are Different</h2>
        <CostComparison />
      </section>
    </PageLayout>
  );
}
```

---

## Design Patterns

All components follow consistent design patterns:

**Color Palette:**
- Cyan/Blue: Initial phases, positive metrics
- Green: Savings, efficiency, final supply
- Yellow/Orange: Mid-range scenarios, transitions
- Red/Pink: High-intensity scenarios, burns
- Slate: Background elements, neutral info

**Typography:**
- Headings: Bold white text
- Descriptions: Slate-400 text
- Metrics: Large, colored, bold
- Details: Small slate-300 text

**Layout:**
- Responsive grid layouts (1 col mobile, 2-3 cols desktop)
- Consistent padding (p-6, p-8)
- Rounded corners (rounded-xl, rounded-lg)
- Gradient borders for emphasis

**Interactivity:**
- Hover states on clickable elements
- Smooth transitions (transition-all, duration-500)
- Progressive disclosure (click to expand details)
- Visual feedback on input changes

---

## Performance Considerations

- All components are client-side rendered
- No external API calls
- Calculations performed in-browser
- Minimal re-renders (use React.memo if needed)
- Lazy load if not immediately visible

---

## Future Enhancements

Potential improvements for these components:

1. **SupplyProjection**: Add animation showing supply growth over time
2. **CostComparison**: Make cost items editable for custom scenarios
3. **TokenomicsTimeline**: Add zoom functionality for detailed phase views
4. **BurnCalculator**: Add chart showing burn progression over time

---

## Testing

To verify components work correctly:

```bash
npm run build:website
```

All components should compile without errors and be available for import in any website page.
