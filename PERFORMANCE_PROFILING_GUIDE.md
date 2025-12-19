# React Performance Profiling Guide

This guide provides step-by-step instructions for profiling the Aizura Consortium frontend application to identify performance bottlenecks before implementing optimizations.

## Prerequisites

- Chrome or Edge browser with React DevTools extension installed
- Development server running (`npm run dev`)
- Application loaded in browser

## Profiling Workflow

### Step 1: Install React DevTools

1. Install [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) extension
2. Restart browser and navigate to application
3. Open DevTools (F12) and find the "Profiler" tab

### Step 2: Prepare Test Scenarios

Before profiling, prepare realistic test scenarios:

#### Scenario A: Message List Performance (Room.tsx)
- Navigate to `/room` with an active debate
- Ensure at least 100+ messages are loaded
- Test real-time message updates

#### Scenario B: Proposal List Performance (Governance.tsx)
- Navigate to `/governance`
- Ensure at least 20+ proposals exist
- Test voting interactions

#### Scenario C: Markdown Rendering (PlanViewer.tsx)
- Navigate to `/plan/:topicId` with a large plan
- Ensure plan has 1000+ words of markdown content
- Test navigation between plans

### Step 3: Record Profiling Data

For each scenario:

1. **Clear Browser Cache** (Ctrl+Shift+Delete)
2. **Open React DevTools Profiler tab**
3. **Click Record button** (red circle)
4. **Perform the interaction**:
   - Room: Scroll through messages, wait for new messages
   - Governance: Vote on proposals, open/close modals
   - PlanViewer: Navigate to plan, scroll through content
5. **Stop Recording** (click red circle again)
6. **Review the flame graph**

### Step 4: Analyze Results

Look for these warning signs:

#### 🚨 Red Flags (Requires Optimization)
- **Component render time > 50ms**
- **Multiple re-renders of same component** (>3 times)
- **Large components blocking interaction** (>100ms)
- **Unnecessary re-renders** (props didn't change but component re-rendered)

#### ✅ Green Flags (No Action Needed)
- **Component render time < 16ms** (60fps)
- **Expected re-renders only** (props actually changed)
- **Total interaction time < 100ms**

### Step 5: Document Findings

Record your findings in the format below:

```markdown
## Profiling Results - [Date]

### Environment
- Browser: Chrome 120
- Device: Desktop / MacBook Pro M1
- React Version: 18.3.1

### Scenario: Message List (100 messages)

**Total Render Time:** 45ms
**Component Breakdown:**
- Room.tsx: 30ms
  - Message render (inline): 25ms (⚠️ CANDIDATE)
  - Other: 5ms
- Navigation: 5ms
- Other: 10ms

**Unnecessary Re-renders:**
- Message #5 re-rendered 3 times without prop changes (⚠️ CANDIDATE)

**Recommendation:** Extract MessageCard component and apply React.memo
```

## Performance Metrics Reference

### Target Performance Goals

| Metric | Target | Acceptable | Poor |
|--------|--------|------------|------|
| Initial Page Load | < 1s | < 2s | > 3s |
| Component Render | < 16ms | < 50ms | > 100ms |
| Real-time Update | < 100ms | < 200ms | > 500ms |
| Interaction Response | < 100ms | < 300ms | > 1s |

### When to Optimize

| Condition | Action |
|-----------|--------|
| Component consistently > 50ms | Extract and memoize sub-components |
| Re-renders > 3x with same props | Apply React.memo with custom comparison |
| Large lists (>100 items) lagging | Consider virtualization |
| Total interaction > 300ms | Profile and optimize bottlenecks |

## Component Optimization Candidates

Based on code analysis, here are potential candidates for optimization **only if profiling confirms issues**:

### High Priority (If Issues Found)

#### 1. Message Component (Room.tsx:250-295)
**Current State:** Inline rendering in map function
**Symptoms to Look For:**
- Slow scrolling with 100+ messages
- Lag when new messages arrive
- Unnecessary re-renders of old messages

**Optimization Approach:**
```tsx
// Extract to separate component
const MessageCard = React.memo(({ message, agentId, agentRole, importance, body, createdAt }) => {
  // Render logic here
}, (prevProps, nextProps) => {
  // Only re-render if message ID changes
  return prevProps.message.id === nextProps.message.id;
});
```

#### 2. Proposal Card (Governance.tsx:222-264)
**Current State:** Inline rendering in map function
**Symptoms to Look For:**
- Slow rendering with 20+ proposals
- All cards re-render when voting on one
- Lag when opening vote modal

**Optimization Approach:**
```tsx
// Extract to separate component
const ProposalCard = React.memo(({ proposal, onVote }) => {
  // Render logic here
});
```

#### 3. Markdown Renderer (PlanViewer.tsx:92-96)
**Current State:** Inline dangerouslySetInnerHTML
**Symptoms to Look For:**
- Slow initial render of large plans
- Re-parsing markdown unnecessarily

**Optimization Approach:**
```tsx
// Use useMemo for markdown parsing
const htmlContent = useMemo(() => {
  return DOMPurify.sanitize(marked(plan.content_md || '') as string);
}, [plan.content_md]);
```

### Low Priority (Usually Not Needed)

- Navigation component (renders once)
- Small components (<10 lines)
- Static content
- Components that rarely update

## Profiling Checklist

Before implementing any optimization, verify:

- [ ] Profiled in production mode (not dev mode)
- [ ] Tested with realistic data volume
- [ ] Identified specific slow components
- [ ] Measured baseline performance
- [ ] Documented findings
- [ ] Confirmed optimization is needed

After implementing optimization:

- [ ] Re-profiled to measure improvement
- [ ] Verified functionality still works
- [ ] Documented performance gains
- [ ] Updated V2_SCALING_ROADMAP.md

## Common Pitfalls

### ❌ Don't Do This
- Memoizing without profiling first
- Memoizing small/fast components
- Over-optimizing (adds complexity)
- Using React.memo everywhere
- Optimizing based on gut feeling

### ✅ Do This
- Profile first, optimize second
- Focus on slow components only
- Measure before and after
- Keep code simple until proven slow
- Use Chrome DevTools Profiler

## Tools & Resources

### Browser Tools
- **React DevTools Profiler** - Component render times
- **Chrome DevTools Performance** - Overall page performance
- **Lighthouse** - Performance audit

### Useful Commands
```bash
# Build for production (more accurate profiling)
npm run build
npm run preview

# Development with profiling
npm run dev
# Then use React DevTools Profiler
```

### React DevTools Settings
1. Open React DevTools settings (gear icon)
2. Enable "Highlight updates when components render"
3. Enable "Record why each component rendered"

## Next Steps

1. **Profile the application** using this guide
2. **Document findings** in performance report
3. **If optimization needed**: Create specific implementation plan
4. **If no issues found**: Document in V2_SCALING_ROADMAP.md that optimization is not needed

## Questions to Answer

Before optimizing, answer these:

1. **Is there a measurable performance problem?**
   - Yes: Continue to optimization
   - No: Document and skip optimization

2. **What is the baseline render time?**
   - Document specific numbers

3. **What is the expected improvement?**
   - Aim for 2x improvement minimum

4. **Does the benefit outweigh added complexity?**
   - Consider maintainability

5. **Have you profiled in production mode?**
   - Dev mode has extra overhead

## Summary

**Golden Rule:** Don't optimize without profiling data. React is fast by default. Premature optimization adds complexity without benefit. Profile first, optimize only if needed, measure results.
