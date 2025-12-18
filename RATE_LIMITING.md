# Rate Limiting Documentation

## Overview

The Aizura Consortium implements a comprehensive rate limiting system to protect API endpoints from abuse, ensure fair resource allocation, and maintain system stability. The system uses a token bucket algorithm with per-endpoint, per-user limits stored in Supabase.

## Architecture

### Components

1. **RateLimiterService** (`backend/src/services/rateLimiter.ts`)
   - Core service for rate limit checks and enforcement
   - Implements token bucket algorithm via database stored procedures
   - Provides fail-open/fail-closed modes for reliability
   - Tracks violations and generates statistics

2. **Rate Limit Middleware** (`backend/src/middleware/validation.ts`)
   - Express middleware for automatic rate limit enforcement
   - Extracts identifier from auth token or IP address
   - Sets standard rate limit response headers
   - Logs violations for monitoring

3. **Database Layer** (`supabase/migrations/20251218145253_add_rate_limiting.sql`)
   - `rate_limits` table: Stores token bucket state per user/endpoint
   - `rate_limit_violations` table: Logs all rate limit violations
   - Stored procedures for atomic operations
   - Automatic cleanup functions

4. **Admin Dashboard** (`frontend/pages/admin/RateLimitMonitor.tsx`)
   - Real-time monitoring of rate limit usage
   - Violation tracking and analysis
   - System health indicators
   - Auto-refreshing dashboard

## Configuration

### Endpoint Limits

Rate limits are configured per endpoint in `backend/src/config/rateLimits.ts`:

```typescript
{
  'GET:/api/system/health': { maxRequests: 100, windowMinutes: 1 },
  'POST:/api/orchestrator/topic': { maxRequests: 10, windowMinutes: 60 },
  'GET:/api/orchestrator/plan/:id': { maxRequests: 50, windowMinutes: 1 }
}
```

### Default Limits

If an endpoint is not explicitly configured:
- **Authenticated requests**: 60 requests per minute
- **Unauthenticated requests**: 30 requests per minute

### Customizing Limits

To add or modify rate limits:

1. Edit `backend/src/config/rateLimits.ts`
2. Add endpoint configuration:
   ```typescript
   'METHOD:/api/your/endpoint': {
     maxRequests: 100,    // Maximum requests
     windowMinutes: 60    // Time window in minutes
   }
   ```
3. Apply the middleware to your route:
   ```typescript
   router.post('/your/endpoint',
     createRateLimit('POST:/api/your/endpoint'),
     yourHandler
   );
   ```

## How It Works

### Token Bucket Algorithm

Each user/endpoint combination has a token bucket:

1. **Bucket starts full** with `maxRequests` tokens
2. **Each request consumes 1 token**
3. **Tokens refill continuously** at rate: `maxRequests / (windowMinutes * 60)`
4. **Request allowed** if tokens available, **blocked** if bucket empty

### Identifier Strategy

The system identifies users by:

1. **Authentication token** (if present) - Most specific
2. **IP address** (fallback) - Prevents anonymous abuse
3. **Hash of token** - Prevents token leakage in logs

### Fail-Open vs Fail-Closed

**Fail-Open Mode** (default):
- If rate limit check fails (database error), allow the request
- Prevents legitimate users from being blocked during outages
- Logs errors for investigation

**Fail-Closed Mode**:
- If rate limit check fails, block the request
- Maximum security, prevents potential abuse during outages
- May impact availability

To change mode:
```typescript
const rateLimiter = RateLimiterService.getInstance();
rateLimiter.setFailOpen(false); // Enable fail-closed
```

## Database Schema

### rate_limits Table

```sql
CREATE TABLE rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,        -- User ID or IP address
  endpoint text NOT NULL,           -- Endpoint pattern
  tokens numeric(10,2) NOT NULL,    -- Current available tokens
  max_tokens integer NOT NULL,      -- Maximum bucket size
  refill_rate numeric(10,6) NOT NULL, -- Tokens per second
  last_refill timestamptz NOT NULL, -- Last refill timestamp
  created_at timestamptz DEFAULT now(),
  UNIQUE(identifier, endpoint)
);
```

### rate_limit_violations Table

```sql
CREATE TABLE rate_limit_violations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  endpoint text NOT NULL,
  tokens_requested integer NOT NULL,
  user_agent text,
  ip_address text,
  created_at timestamptz DEFAULT now()
);
```

## Response Headers

When rate limiting is active, the API returns these headers:

- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Timestamp when limit resets
- `Retry-After`: Seconds until next allowed request (on 429 errors)

Example:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 2024-12-18T14:30:00Z
```

## Error Responses

### 429 Too Many Requests

Returned when rate limit is exceeded:

```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 58
}
```

The `retryAfter` field indicates seconds until the next request will be allowed.

## Monitoring

### Admin Dashboard

Access the rate limit monitor at `/admin/rate-limits`:

**Features:**
- Real-time usage statistics per endpoint
- Total blocked requests (24h)
- Most active endpoints
- System health status (healthy/warning/critical)
- Auto-refresh every 5 seconds

**Health Thresholds:**
- **Healthy**: All endpoints < 70% capacity
- **Warning**: Any endpoint 70-89% capacity
- **Critical**: Any endpoint ≥ 90% capacity

### API Endpoints

#### Get Violation Stats
```
GET /api/system/rate-limits
Authorization: Bearer <admin-token>
```

Returns violation statistics for the last 24 hours.

#### Get Dashboard Stats
```
GET /api/system/admin/rate-limits
Authorization: Bearer <admin-token>
```

Returns comprehensive dashboard data including active limits, violations, and health status.

#### Get User Limits
```
GET /api/system/rate-limits/:identifier
Authorization: Bearer <admin-token>
```

Returns current rate limit status for a specific user or IP.

## Maintenance

### Cleanup Old Data

The system includes automatic cleanup via `cleanup_old_rate_limits()` stored procedure:

```sql
SELECT cleanup_old_rate_limits(); -- Removes entries older than 24 hours
```

**Recommended Schedule:**
- Run every 6 hours via pg_cron (see migration)
- Keeps database size manageable
- Removes stale rate limit entries

### Manual Cleanup

To manually clean up old violations:

```sql
DELETE FROM rate_limit_violations
WHERE created_at < now() - interval '7 days';
```

To reset a user's rate limits:

```sql
DELETE FROM rate_limits
WHERE identifier = 'user_id_or_ip';
```

## Testing

### Unit Tests

Located in `tests/unit/services/rateLimiter.test.ts`:

```bash
npm test -- rateLimiter.test.ts
```

Tests cover:
- Token bucket mechanics
- Fail-open/fail-closed behavior
- Violation logging
- Statistics generation
- Error handling

### Integration Tests

Located in `tests/integration/middleware/rateLimit.test.ts`:

```bash
npm test -- rateLimit.test.ts
```

Tests cover:
- Middleware integration
- Identifier extraction
- Response headers
- Concurrent requests
- Edge cases

### Manual Testing

Test rate limits with curl:

```bash
# Make multiple requests quickly
for i in {1..10}; do
  curl -X GET http://localhost:3001/api/system/health
done

# Check headers
curl -i -X GET http://localhost:3001/api/system/health
```

## Troubleshooting

### Issue: Legitimate users getting blocked

**Cause**: Rate limits too restrictive

**Solution**:
1. Check violation logs: `SELECT * FROM rate_limit_violations WHERE identifier = 'user_id';`
2. Increase limits in `backend/src/config/rateLimits.ts`
3. Consider different limits for authenticated vs unauthenticated users

### Issue: Rate limiter not working

**Cause**: Missing middleware or database migration

**Solution**:
1. Verify migration applied: Check Supabase dashboard for `rate_limits` tables
2. Verify middleware: Ensure `createRateLimit()` is applied to routes
3. Check logs for rate limiter errors

### Issue: Slow API responses

**Cause**: Rate limit checks taking too long

**Solution**:
1. Check database performance
2. Add index: `CREATE INDEX ON rate_limits(identifier, endpoint);`
3. Monitor with: `SELECT * FROM error_logs WHERE error_type = 'rate_limit_slow_query';`

### Issue: Rate limits not resetting

**Cause**: Token refill calculation error

**Solution**:
1. Check `last_refill` timestamps: `SELECT * FROM rate_limits WHERE identifier = 'user_id';`
2. Verify `refill_rate` is correct: Should be `max_tokens / (window_minutes * 60)`
3. Manually reset if needed: `DELETE FROM rate_limits WHERE identifier = 'user_id';`

## Best Practices

### For Developers

1. **Always apply rate limiting to new endpoints**
   ```typescript
   router.post('/api/new-endpoint',
     createRateLimit('POST:/api/new-endpoint'),
     handler
   );
   ```

2. **Use appropriate limits for endpoint cost**
   - Expensive operations (AI calls): 5-10 req/hour
   - Database queries: 50-100 req/min
   - Read-only public data: 100+ req/min

3. **Document rate limits in API docs**
   - Include limits in endpoint documentation
   - Show example headers in responses

4. **Test rate limits before deploying**
   - Add integration tests for new endpoints
   - Verify limits work in staging

### For Administrators

1. **Monitor violation patterns**
   - Regular spikes may indicate need for higher limits
   - Consistent violations from same IP may indicate abuse

2. **Adjust limits based on usage**
   - Start conservative, increase as needed
   - Monitor system resources when increasing

3. **Set up alerts**
   - Alert on critical health status
   - Alert on unusual violation spikes

4. **Regular maintenance**
   - Review and clean old violation logs monthly
   - Analyze most violated endpoints quarterly

## Security Considerations

### Protection Against

1. **Brute Force Attacks**: Login endpoints limited to 5 attempts/hour
2. **DoS Attacks**: Global rate limits prevent resource exhaustion
3. **API Scraping**: Aggressive limits on public endpoints
4. **Resource Exhaustion**: AI endpoints heavily rate limited

### Important Notes

- Rate limit violations are logged with IP and user agent
- Persistent violators can be blocked via IP whitelist
- Admin endpoints have strictest limits and require authentication
- Token hashing prevents token leakage in logs

## Performance

### Benchmarks

- Rate limit check: < 10ms (p50), < 50ms (p99)
- Database queries: Optimized with indexes
- Cleanup operation: < 100ms for 10k+ entries

### Optimization Tips

1. **Use indexes**:
   ```sql
   CREATE INDEX idx_rate_limits_lookup ON rate_limits(identifier, endpoint);
   CREATE INDEX idx_violations_time ON rate_limit_violations(created_at);
   ```

2. **Batch cleanup** instead of per-request checks

3. **Cache rate limit config** in memory (already implemented)

4. **Monitor slow queries** via error logs

## Future Enhancements

Potential improvements:

- [ ] Redis-based rate limiting for better performance
- [ ] Dynamic limits based on user tier/subscription
- [ ] Distributed rate limiting for multi-instance deployments
- [ ] Rate limit analytics and forecasting
- [ ] Automatic limit adjustment based on system load
- [ ] Customizable rate limit responses per endpoint
- [ ] Whitelist for specific users/IPs

## References

- Token Bucket Algorithm: https://en.wikipedia.org/wiki/Token_bucket
- RFC 6585 (429 Status Code): https://tools.ietf.org/html/rfc6585
- Rate Limit Headers Draft: https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/

## Support

For issues or questions:
- Check error logs: `/admin/errors`
- Review violation logs: `/admin/rate-limits`
- Consult this documentation
- Review database migrations for schema details
