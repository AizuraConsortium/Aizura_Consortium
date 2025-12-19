# V2 Scaling Roadmap

Features and optimizations that aren't needed today but may become valuable as the platform scales.

---

## Frontend Performance

### React.memo Optimization
**Status:** Not needed - profiling required first (Issue #25)
**Last Reviewed:** 2025-12-19
**Trigger:** Component render times exceed 50ms OR user reports lag
**Solution:** Extract and memoize slow components (MessageCard, ProposalCard)
**Effort:** 2-4 hours (after profiling)
**Trade-offs:** Adds complexity, may not provide measurable benefit at current scale

**Decision Rationale:**
- Current component tree is small (8 pages, 7 main components)
- No performance issues reported
- React is fast by default for this scale
- Premature optimization adds unnecessary complexity

**Action Plan:**
1. Use PERFORMANCE_PROFILING_GUIDE.md to profile application
2. Measure baseline render times (see PERFORMANCE_BASELINE.md)
3. Only implement React.memo if profiling shows:
   - Component render time >50ms
   - Unnecessary re-renders (>3x with same props)
   - Measurable user experience issues
4. Document findings and optimization results

**Potential Candidates (if profiling confirms need):**
- Room.tsx message list (328 lines, high re-render frequency)
- Governance.tsx proposal cards (298 lines, medium complexity)
- PlanViewer.tsx markdown rendering (inline dangerouslySetInnerHTML)

**Expected Outcome:**
- Performance likely acceptable without optimization
- Revisit when message count exceeds 2,000 or user complaints arise

### Virtual Scrolling for Messages
**Status:** Not needed (Issue #26 closed)
**Trigger:** Debates consistently exceed 2,000 messages
**Solution:** Implement react-window for message list in Room.tsx
**Effort:** 3-4 hours
**Trade-offs:** Adds complexity for variable-height messages, complicates real-time updates

**Current State:**
- Pagination handles 50-2,000 messages efficiently
- Expected debate length: 500-1,500 messages
- Performance is good (<100ms render for 200 messages)

---

## Database Optimizations

### Message Archiving
**Trigger:** Database table exceeds 100,000 messages
**Solution:** Archive messages older than 90 days to separate table
**Benefit:** Keeps active queries fast, reduces index size

### Connection Pooling
**Trigger:** Backend instances exceed 10 replicas
**Solution:** Implement PgBouncer for connection pooling
**Benefit:** Better connection management at scale

---

## Features for Scale

### Search & Filtering
**Trigger:** User requests or debates exceeding 3,000 messages
**Features:**
- Full-text search across messages
- Filter by agent, time range, importance
- Keyword highlighting

### Message Threading
**Trigger:** Debates become difficult to follow
**Features:**
- Reply-to functionality
- Conversation threads
- Collapsed/expanded views

### Real-time Optimization
**Trigger:** 1,000+ concurrent viewers
**Solution:**
- Implement message batching
- Add debouncing to real-time updates
- Consider Redis for pub/sub

---

## Monitoring & Analytics

### Metrics and Instrumentation (Issue #43)
**Status:** V2 Feature - Not needed at current scale
**Last Reviewed:** 2025-12-19
**Trigger:** Production deployment with >100 daily active users
**Effort:** 8-16 hours

**Current State:**
- Basic health monitoring exists (`/health`, `/api/system/health`)
- Error logging to Supabase database
- Admin dashboard for errors and rate limits
- No metrics collection or instrumentation

**Recommended Solution:**
Implement comprehensive metrics and instrumentation using industry-standard tools:

#### Metrics Collection
- **Prometheus** for metrics export
  - Request rate, duration, error rate (RED metrics)
  - Database query performance
  - Orchestrator tick duration
  - Agent response times
  - Memory and CPU usage

#### Visualization
- **Grafana** dashboards
  - System health overview
  - API performance metrics
  - Business metrics (proposals/day, debate duration, completion rate)
  - Error rate trends
  - Resource utilization

#### Distributed Tracing
- **OpenTelemetry** for request tracing
  - Trace requests across services
  - Identify slow database queries
  - Debug performance issues
  - Monitor agent interactions

#### Application Performance Monitoring (APM)
- **Options:** DataDog, New Relic, or open-source alternatives
  - Real user monitoring (RUM)
  - Transaction tracing
  - Anomaly detection
  - Alerting on SLO violations

#### Custom Business Metrics
- Proposals submitted per day/week
- Average debate duration
- Agent participation rates
- Vote consensus time
- Plan completion rates
- User engagement metrics

**Implementation Phases:**

1. **Phase 1: Basic Metrics** (4 hours)
   - Add Prometheus client library
   - Export basic HTTP metrics
   - Create health check metrics
   - Set up Grafana with basic dashboard

2. **Phase 2: Business Metrics** (4 hours)
   - Track proposal lifecycle metrics
   - Monitor debate progress
   - Agent performance metrics
   - Database performance metrics

3. **Phase 3: Tracing** (4-6 hours)
   - Integrate OpenTelemetry
   - Trace API requests
   - Trace database queries
   - Trace agent interactions

4. **Phase 4: Alerting** (2-4 hours)
   - Configure alert rules
   - Set up notification channels
   - Define SLOs and SLIs
   - Create runbooks for alerts

**Why Not Now:**
- Current scale is small (<10 concurrent users expected)
- Manual monitoring via logs and admin dashboard is sufficient
- Adds operational complexity
- Requires infrastructure setup (Prometheus, Grafana)
- Development effort better spent on core features

**When to Implement:**
- Production deployment to real users
- Multiple backend instances running
- Need for performance optimization
- Compliance or SLA requirements
- Team size grows (more people need visibility)

### Performance Metrics Dashboard
**Features:**
- Message volume trends
- Page load time tracking
- Database query performance
- User engagement metrics

### Advanced Error Tracking
**Solution:** Integrate Sentry or similar for production error tracking

---

## Infrastructure

### CDN for Static Assets
**Trigger:** Global user base
**Solution:** CloudFront or similar for frontend assets

### Horizontal Scaling
**Current:** Manual kubectl scale commands
**Future:** Auto-scaling based on metrics (CPU, memory, request rate)

### Caching Layer
**Trigger:** High read traffic on plans/proposals
**Solution:** Redis cache for frequently accessed data

---

## Notes

- All items in this document are **premature optimizations** for current scale
- Implement only when triggering conditions are met
- Monitor first, optimize second
- Keep solutions simple and maintainable

### Performance Optimization Process
1. **Profile first** using PERFORMANCE_PROFILING_GUIDE.md
2. **Measure baseline** using PERFORMANCE_BASELINE.md thresholds
3. **Identify bottlenecks** with concrete metrics
4. **Implement targeted fixes** only for proven issues
5. **Measure improvement** to verify benefit
6. **Document results** for future reference

**Never optimize without profiling data showing a real problem.**
