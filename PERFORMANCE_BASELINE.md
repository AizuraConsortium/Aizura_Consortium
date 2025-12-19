# Performance Baseline Criteria

This document establishes performance baselines and thresholds for determining when optimization is necessary.

## Current Application State

### Component Inventory

| Component | Lines of Code | Complexity | Render Frequency | Priority for Profiling |
|-----------|---------------|------------|------------------|----------------------|
| Room.tsx | 328 | High | High (real-time) | HIGH |
| Governance.tsx | 298 | Medium | Medium | MEDIUM |
| PlanViewer.tsx | 153 | Low | Low | MEDIUM |
| Navigation.tsx | 154 | Low | Low | LOW |
| Home.tsx | 177 | Low | Low | LOW |
| About.tsx | ~329 | Low | Low | LOW |

### Data Volume Assumptions

#### Current Expected Scale
- **Active Debate Messages:** 500-1,500 messages
- **Total Proposals:** 10-50 proposals
- **Plan Size:** 500-2,000 words
- **Concurrent Users:** 10-100 users

#### Future Scale (when optimization becomes necessary)
- **Messages:** >2,000 per debate
- **Proposals:** >100 active proposals
- **Plan Size:** >5,000 words
- **Concurrent Users:** >1,000 users

## Performance Thresholds

### Page Load Performance

| Metric | Excellent | Good | Acceptable | Poor (Optimize) |
|--------|-----------|------|------------|-----------------|
| Initial Load (TTI) | <1s | <2s | <3s | >3s |
| Largest Contentful Paint | <1.5s | <2.5s | <4s | >4s |
| First Input Delay | <50ms | <100ms | <300ms | >300ms |
| Cumulative Layout Shift | <0.1 | <0.25 | <0.5 | >0.5 |

### Component Render Performance

| Component Type | Excellent | Good | Acceptable | Poor (Optimize) |
|----------------|-----------|------|------------|-----------------|
| Simple Component | <5ms | <10ms | <16ms | >16ms |
| Complex Component | <10ms | <25ms | <50ms | >50ms |
| List Item (single) | <1ms | <3ms | <5ms | >5ms |
| Total List Render | <20ms | <50ms | <100ms | >100ms |

### Real-time Update Performance

| Metric | Excellent | Good | Acceptable | Poor (Optimize) |
|--------|-----------|------|------------|-----------------|
| New Message Display | <50ms | <100ms | <200ms | >200ms |
| Vote Update | <100ms | <200ms | <300ms | >300ms |
| UI State Change | <16ms | <50ms | <100ms | >100ms |

## Decision Framework

### When to Profile

Profile these scenarios immediately:

1. **User reports lag or stuttering**
2. **Visible UI delays during interaction**
3. **Messages exceeding 1,000 in a debate**
4. **More than 50 proposals displayed**
5. **Before major feature releases**

### When to Optimize (After Profiling)

Optimize only if profiling shows:

1. **Component render time exceeds threshold** (see tables above)
2. **Unnecessary re-renders** (>3x with same props)
3. **User interaction blocked** (>300ms delay)
4. **Measurable user experience degradation**

### When NOT to Optimize

Do not optimize if:

1. **Component renders in <50ms**
2. **No user complaints about performance**
3. **Re-renders are expected** (props actually changed)
4. **Data volume is within expected scale**
5. **Profiling shows no issues**

## Component-Specific Criteria

### Room.tsx - Message List

#### Optimization Triggers
- Total render time for message list >100ms
- Individual message render >5ms
- Lag when scrolling through messages
- Delay when new message arrives >200ms

#### Baseline Expectations
- 100 messages: <50ms render time
- 500 messages: <100ms render time
- New message: <100ms to display

#### Optimization Approach (if needed)
1. Extract `MessageCard` component
2. Apply `React.memo` with ID comparison
3. Use `useMemo` for complex calculations
4. Consider `useCallback` for event handlers

### Governance.tsx - Proposal List

#### Optimization Triggers
- Total render time for proposal list >100ms
- Individual proposal card render >10ms
- All cards re-render when voting on one
- Modal open/close causes unnecessary re-renders

#### Baseline Expectations
- 20 proposals: <50ms render time
- 50 proposals: <100ms render time
- Vote interaction: <200ms total time

#### Optimization Approach (if needed)
1. Extract `ProposalCard` component
2. Apply `React.memo`
3. Use `useCallback` for vote handlers
4. Memoize proposal status calculations

### PlanViewer.tsx - Markdown Rendering

#### Optimization Triggers
- Markdown parsing takes >50ms
- Re-parsing on every render
- Large documents (>2000 words) lag

#### Baseline Expectations
- 500 words: <20ms parse time
- 2000 words: <50ms parse time
- No re-parsing unless content changes

#### Optimization Approach (if needed)
1. Use `useMemo` for markdown parsing
2. Cache sanitized HTML
3. Consider lazy loading for very large documents

## Monitoring Strategy

### Manual Profiling Schedule

- **Pre-release:** Profile all major pages
- **Monthly:** Profile Room and Governance pages
- **After complaints:** Profile specific reported issues
- **After data growth:** Profile when thresholds approached

### Automated Monitoring (Future)

When scale increases, implement:

1. **Real User Monitoring (RUM)**
   - Track actual user experience metrics
   - Alert when metrics exceed thresholds

2. **Synthetic Monitoring**
   - Regular automated profiling
   - Performance regression detection

3. **Performance Budgets**
   - Set maximum bundle sizes
   - Set maximum render times
   - CI/CD checks before deployment

## Performance Budget

### Current Bundle Size

```
Frontend Bundle: ~470 KB (compressed: ~135 KB)
Target: <500 KB (compressed: <150 KB)
```

### Maximum Acceptable Sizes

| Asset Type | Target | Maximum | Action if Exceeded |
|------------|--------|---------|-------------------|
| Main Bundle | <400 KB | <500 KB | Code splitting |
| Vendor Bundle | <300 KB | <400 KB | Remove unused deps |
| CSS | <10 KB | <20 KB | Optimize styles |
| Total (gzip) | <120 KB | <150 KB | Review all assets |

## Code Complexity Thresholds

### When to Refactor for Performance

| Metric | Acceptable | Refactor Needed |
|--------|-----------|-----------------|
| Component LOC | <300 | >500 |
| Function LOC | <50 | >100 |
| Cyclomatic Complexity | <10 | >15 |
| Nested Levels | <4 | >6 |

## Testing Requirements

### Before Optimization
- [ ] Profile in production mode
- [ ] Test with realistic data volume
- [ ] Measure baseline metrics
- [ ] Document specific slow components
- [ ] Verify issue is reproducible

### After Optimization
- [ ] Re-profile and compare metrics
- [ ] Verify 2x+ improvement
- [ ] Test functionality still works
- [ ] Check bundle size impact
- [ ] Document performance gains

## Optimization Priority Matrix

| Issue Type | User Impact | Frequency | Priority |
|------------|-------------|-----------|----------|
| UI blocking (>300ms) | High | Any | P0 - Critical |
| Stuttering (100-300ms) | High | Frequent | P1 - High |
| Subtle lag (50-100ms) | Medium | Frequent | P2 - Medium |
| Barely noticeable (<50ms) | Low | Any | P3 - Low |

## Current Performance Status

### Last Profiled: [NEEDS PROFILING]

No formal profiling has been conducted yet. Based on code analysis:

#### Expected Performance (Hypothesis)
- **Room.tsx** (100 messages): Likely <100ms ✓
- **Governance.tsx** (20 proposals): Likely <50ms ✓
- **PlanViewer.tsx**: Likely <50ms ✓
- **Overall**: Likely acceptable for current scale

#### Action Required
1. Conduct initial profiling using PERFORMANCE_PROFILING_GUIDE.md
2. Document actual measurements
3. Compare against thresholds in this document
4. Decide if optimization is needed

## Conclusion

This baseline document provides objective criteria for performance decisions. Use it to:

1. Determine when profiling is needed
2. Evaluate profiling results
3. Decide if optimization is warranted
4. Measure optimization effectiveness
5. Prevent premature optimization

**Remember:** React is fast by default. Don't optimize without data showing a real problem.
