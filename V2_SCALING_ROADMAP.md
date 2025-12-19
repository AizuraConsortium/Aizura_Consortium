# V2 Scaling Roadmap

Features and optimizations that aren't needed today but may become valuable as the platform scales.

---

## Frontend Performance

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
