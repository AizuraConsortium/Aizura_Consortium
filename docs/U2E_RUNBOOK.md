# U2E System Operations Runbook

**Version:** 1.0
**Last Updated:** December 2024
**Audience:** Operations Team, SRE, On-Call Engineers

---

## Quick Reference

### Emergency Contacts

- **On-Call Engineer**: PagerDuty rotation
- **Engineering Manager**: escalation-team@aizura.com
- **Database Admin**: dba@aizura.com
- **Supabase Support**: support@supabase.io

### Critical Endpoints

```
Production:  https://api.aizura.com
Staging:     https://api-staging.aizura.com
Admin:       https://admin.aizura.com
Monitoring:  https://metrics.aizura.com/u2e
```

### Quick Commands

```bash
Check system status
curl https://api.aizura.com/health/u2e

View recent errors
psql -c "SELECT * FROM error_logs WHERE created_at > now() - interval '1 hour' ORDER BY created_at DESC LIMIT 10;"

Restart backend
kubectl rollout restart deployment/backend -n production

View logs
kubectl logs -f deployment/backend -n production --tail=100
```

---

## Table of Contents

1. [System Health Checks](#system-health-checks)
2. [Deployment Procedures](#deployment-procedures)
3. [Incident Response](#incident-response)
4. [Common Issues](#common-issues)
5. [Maintenance Windows](#maintenance-windows)
6. [Rollback Procedures](#rollback-procedures)
7. [Data Operations](#data-operations)
8. [Monitoring & Alerts](#monitoring--alerts)

---

## System Health Checks

### Daily Health Check (5 minutes)

Run this checklist every morning:

```bash
#!/bin/bash

echo "=== U2E System Health Check ==="
echo

echo "1. System Status"
curl -s https://api.aizura.com/health/u2e | jq .

echo
echo "2. Error Rate (last hour)"
psql $DATABASE_URL -c "
  SELECT
    COUNT(*) as error_count,
    COUNT(*) FILTER (WHERE severity = 'error') as errors,
    COUNT(*) FILTER (WHERE severity = 'warning') as warnings
  FROM error_logs
  WHERE created_at > now() - interval '1 hour'
    AND error_type LIKE 'U2E_%';
"

echo
echo "3. Event Processing Rate"
psql $DATABASE_URL -c "
  SELECT
    COUNT(*) as events_last_hour,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT business_id) as active_businesses
  FROM u2e_usage_events
  WHERE created_at > now() - interval '1 hour';
"

echo
echo "4. Top Errors"
psql $DATABASE_URL -c "
  SELECT
    error_type,
    COUNT(*) as count
  FROM error_logs
  WHERE created_at > now() - interval '24 hours'
    AND error_type LIKE 'U2E_%'
  GROUP BY error_type
  ORDER BY count DESC
  LIMIT 5;
"

echo
echo "5. Materialized View Freshness"
psql $DATABASE_URL -c "
  SELECT
    matviewname,
    last_vacuum
  FROM pg_stat_user_tables
  WHERE relname = 'u2e_user_stats';
"

echo
echo "=== Health Check Complete ==="
```

Save as `scripts/u2e/healthCheck.sh` and run:
```bash
chmod +x scripts/u2e/healthCheck.sh
./scripts/u2e/healthCheck.sh
```

### Key Health Indicators

| Indicator | Healthy | Warning | Critical |
|-----------|---------|---------|----------|
| System Active | ✅ true | - | ❌ false |
| Events/hour | > 100 | 10-100 | < 10 |
| Error rate | < 0.1% | 0.1-1% | > 1% |
| P99 latency | < 100ms | 100-500ms | > 500ms |
| Duplicate rate | < 5% | 5-20% | > 20% |
| Materialized view lag | < 5 min | 5-15 min | > 15 min |

---

## Deployment Procedures

### Pre-Deployment Checklist

- [ ] Code review approved
- [ ] Tests passing (unit + integration)
- [ ] Staging deployment tested
- [ ] Database migrations reviewed
- [ ] Rollback plan prepared
- [ ] Stakeholders notified
- [ ] Maintenance window scheduled (if needed)

### Standard Deployment (Zero Downtime)

```bash
# 1. Build and push Docker image
docker build -f Dockerfile.backend -t backend:${VERSION} .
docker push backend:${VERSION}

# 2. Update Kubernetes deployment
kubectl set image deployment/backend \
  backend=backend:${VERSION} \
  -n production

# 3. Monitor rollout
kubectl rollout status deployment/backend -n production

# 4. Watch for errors
kubectl logs -f deployment/backend -n production --tail=50 | grep -i error

# 5. Verify health
curl https://api.aizura.com/health/u2e

# 6. Check metrics
# Visit https://metrics.aizura.com/u2e
# Verify event processing rate, error rate, latency
```

### Database Migration Deployment

For schema changes to U2E tables:

```bash
# 1. Backup database
pg_dump -t 'u2e_*' $DATABASE_URL > u2e_backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Apply migration (via Supabase CLI or SQL)
psql $DATABASE_URL < supabase/migrations/YYYYMMDD_migration.sql

# 3. Verify migration
psql $DATABASE_URL -c "\d u2e_usage_events"

# 4. Test application
curl -X POST https://api-staging.aizura.com/api/u2e/track \
  -H "X-API-Key: $STAGING_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "businessName": "AI Traders",
    "actionType": "trade_executed",
    "metadata": {"test": true}
  }'

# 5. Deploy backend
kubectl set image deployment/backend backend=backend:${VERSION} -n production

# 6. Monitor for errors
kubectl logs -f deployment/backend -n production | grep -i "migration\|schema"
```

### Deployment Rollout Strategy

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```

Deployments are rolling updates with zero downtime:
- New pod starts
- Health check passes
- Old pod terminates
- Repeat for each replica

---

## Incident Response

### Severity Levels

| Level | Description | Response Time | Example |
|-------|-------------|---------------|---------|
| P0 | System down | < 15 min | U2E API returning 500 for all requests |
| P1 | Major degradation | < 30 min | Error rate > 10%, events not processing |
| P2 | Minor degradation | < 2 hours | Slow response times, high latency |
| P3 | Non-critical | < 1 day | Single user reports issue |

### Incident Response Workflow

```
1. Acknowledge alert (PagerDuty)
   ↓
2. Assess severity (P0-P3)
   ↓
3. Create incident ticket
   ↓
4. Investigate (see playbooks below)
   ↓
5. Apply fix or mitigation
   ↓
6. Monitor for stability
   ↓
7. Communicate resolution
   ↓
8. Post-mortem (P0/P1 only)
```

### P0: System Down Playbook

**Symptom**: Health check failing, 500 errors, no events processing

**Investigation Steps:**

```bash
# 1. Check if system is intentionally disabled
psql $DATABASE_URL -c "SELECT is_active FROM u2e_system_config;"

# 2. Check backend pods
kubectl get pods -n production | grep backend

# 3. Check recent deployments
kubectl rollout history deployment/backend -n production

# 4. Check database connectivity
psql $DATABASE_URL -c "SELECT 1;"

# 5. Check recent errors
kubectl logs deployment/backend -n production --tail=100 | grep -i error
```

**Common Causes & Fixes:**

| Cause | Fix |
|-------|-----|
| Bad deployment | Rollback: `kubectl rollout undo deployment/backend -n production` |
| Database down | Contact DBA, check Supabase status |
| Config error | Redeploy with correct config |
| Rate limit exhausted | Increase limits or wait for window reset |

**Mitigation (if fix takes > 30 min):**

```bash
Disable U2E system
psql $DATABASE_URL -c "
  UPDATE u2e_system_config
  SET is_active = false, deactivation_date = now();
"

Notify users
# Post status update to Discord/Twitter
```

### P1: High Error Rate Playbook

**Symptom**: Error rate > 1%, multiple users affected

**Investigation:**

```sql
-- Identify most common error
SELECT
  error_type,
  message,
  COUNT(*) as count,
  MAX(created_at) as last_occurrence
FROM error_logs
WHERE created_at > now() - interval '1 hour'
  AND error_type LIKE 'U2E_%'
GROUP BY error_type, message
ORDER BY count DESC
LIMIT 5;
```

**Common Error Types:**

1. **U2E_TRACK_USAGE_ERROR**
   - **Cause**: Database constraint violation, validation error
   - **Fix**: Check error details, fix business integration

2. **U2E_REWARD_CALC_ERROR**
   - **Cause**: Missing reward rate, calculation overflow
   - **Fix**: Add missing rate or adjust calculation logic

3. **U2E_WEBHOOK_AUTH_ERROR**
   - **Cause**: Invalid API key, expired credentials
   - **Fix**: Rotate API keys, verify business integration

**Quick Fixes:**

```bash
# Restart backend (clears in-memory issues)
kubectl rollout restart deployment/backend -n production

# Refresh materialized view (fixes stale stats)
psql $DATABASE_URL -c "REFRESH MATERIALIZED VIEW CONCURRENTLY u2e_user_stats;"

# Check and fix system config
psql $DATABASE_URL -c "SELECT * FROM u2e_system_config;"
```

### P2: Slow Response Times Playbook

**Symptom**: P99 latency > 500ms

**Investigation:**

```sql
-- Find slow queries
SELECT
  query,
  mean_exec_time,
  calls
FROM pg_stat_statements
WHERE query LIKE '%u2e_%'
ORDER BY mean_exec_time DESC
LIMIT 10;
```

**Common Causes:**

1. **Materialized view not refreshed**
   ```sql
   REFRESH MATERIALIZED VIEW CONCURRENTLY u2e_user_stats;
   ```

2. **Missing index**
   ```sql
   -- Check for sequential scans
   SELECT
     relname,
     seq_scan,
     idx_scan
   FROM pg_stat_user_tables
   WHERE relname LIKE 'u2e_%'
   ORDER BY seq_scan DESC;
   ```

3. **High database load**
   ```sql
   -- Check active queries
   SELECT pid, state, query
   FROM pg_stat_activity
   WHERE state = 'active';
   ```

**Fixes:**

- Scale up database (vertical scaling)
- Add read replicas (horizontal scaling)
- Add missing indexes
- Optimize queries

---

## Common Issues

### Issue: Events Not Being Tracked

**Symptoms**: Webhook calls return 200 but events not in database

**Diagnosis:**

```sql
-- Check system status
SELECT is_active FROM u2e_system_config;

-- Check business status
SELECT * FROM u2e_businesses WHERE business_name = 'AI Traders';

-- Check reward rates exist
SELECT * FROM u2e_reward_rates
WHERE business_id = (SELECT id FROM u2e_businesses WHERE business_name = 'AI Traders')
  AND is_active = true
  AND effective_to IS NULL;
```

**Solutions:**

```sql
-- Activate system
UPDATE u2e_system_config SET is_active = true;

-- Activate business
UPDATE u2e_businesses SET is_active = true WHERE business_name = 'AI Traders';

-- Add missing rate
INSERT INTO u2e_reward_rates (business_id, action_type, rate_per_action)
VALUES (
  (SELECT id FROM u2e_businesses WHERE business_name = 'AI Traders'),
  'trade_executed',
  5.0
);
```

### Issue: Duplicate Event Errors

**Symptoms**: 409 Conflict responses, high duplicate rate

**Diagnosis:**

```sql
-- Find duplicate idempotency keys
SELECT
  event_idempotency_key,
  COUNT(*) as attempts,
  MAX(created_at) as last_attempt
FROM u2e_usage_events
WHERE created_at > now() - interval '1 hour'
GROUP BY event_idempotency_key
HAVING COUNT(*) > 1
ORDER BY attempts DESC
LIMIT 10;
```

**Causes:**
- Client retry loops
- Incorrect idempotency key generation
- Clock skew on client

**Solutions:**
- Review client integration
- Check idempotency key algorithm
- Verify client-side retry logic

### Issue: Stats Not Updating

**Symptoms**: User dashboard shows stale data

**Diagnosis:**

```sql
-- Check materialized view refresh
SELECT
  matviewname,
  last_vacuum
FROM pg_stat_user_tables
WHERE relname = 'u2e_user_stats';

-- Check pg_cron job
SELECT * FROM cron.job WHERE jobname LIKE '%u2e%';
```

**Solutions:**

```sql
-- Manual refresh
REFRESH MATERIALIZED VIEW CONCURRENTLY u2e_user_stats;

-- Fix cron job if broken
SELECT cron.schedule(
  'refresh-u2e-stats',
  '*/5 * * * *',
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY u2e_user_stats$$
);
```

### Issue: Fraud Detection False Positives

**Symptoms**: Legitimate users flagged, events rejected

**Diagnosis:**

```sql
-- Check velocity thresholds
SELECT
  user_id,
  COUNT(*) as events_per_hour
FROM u2e_usage_events
WHERE created_at > now() - interval '1 hour'
GROUP BY user_id
HAVING COUNT(*) > 1000
ORDER BY events_per_hour DESC;
```

**Solutions:**

```typescript
// Temporarily adjust threshold
const VELOCITY_THRESHOLD = 2000;

// Or whitelist specific users
const WHITELISTED_USERS = ['power-user-1', 'bot-user-2'];
```

---

## Maintenance Windows

### Weekly Maintenance (Sunday 2-4 AM UTC)

```bash
#!/bin/bash

echo "=== U2E Weekly Maintenance ==="

echo "1. Database vacuum"
psql $DATABASE_URL -c "VACUUM ANALYZE u2e_usage_events;"
psql $DATABASE_URL -c "VACUUM ANALYZE u2e_usage_rewards;"

echo "2. Refresh materialized views"
psql $DATABASE_URL -c "REFRESH MATERIALIZED VIEW CONCURRENTLY u2e_user_stats;"

echo "3. Archive old events (>1 year)"
psql $DATABASE_URL -c "
  INSERT INTO u2e_usage_events_archive
  SELECT * FROM u2e_usage_events
  WHERE created_at < now() - interval '1 year';

  DELETE FROM u2e_usage_events
  WHERE created_at < now() - interval '1 year';
"

echo "4. Clean up error logs (>90 days)"
psql $DATABASE_URL -c "
  DELETE FROM error_logs
  WHERE created_at < now() - interval '90 days'
    AND error_type LIKE 'U2E_%';
"

echo "5. Update statistics"
psql $DATABASE_URL -c "ANALYZE;"

echo "=== Maintenance Complete ==="
```

### Monthly Maintenance (First Sunday 2-6 AM UTC)

```bash
#!/bin/bash

echo "=== U2E Monthly Maintenance ==="

echo "1. Full database backup"
pg_dump -Fc -f u2e_backup_$(date +%Y%m%d).dump -t 'u2e_*' $DATABASE_URL

echo "2. Reindex tables"
psql $DATABASE_URL -c "REINDEX TABLE u2e_usage_events;"
psql $DATABASE_URL -c "REINDEX TABLE u2e_usage_rewards;"
psql $DATABASE_URL -c "REINDEX MATERIALIZED VIEW u2e_user_stats;"

echo "3. Generate monthly report"
tsx scripts/u2e/generateReport.ts --type=monthly --month=$(date +%Y-%m)

echo "4. Review and rotate API keys (quarterly)"
if [ $(date +%m) -in 1 4 7 10 ]; then
  echo "Q: Quarterly API key rotation due"
  echo "Manual action required: Rotate business API keys"
fi

echo "5. Check for schema drift"
pg_dump -s -t 'u2e_*' $DATABASE_URL > schema_$(date +%Y%m%d).sql
diff schema_previous.sql schema_$(date +%Y%m%d).sql

echo "=== Monthly Maintenance Complete ==="
```

---

## Rollback Procedures

### Code Rollback

```bash
# Rollback to previous deployment
kubectl rollout undo deployment/backend -n production

# Rollback to specific revision
kubectl rollout undo deployment/backend -n production --to-revision=5

# Check rollout status
kubectl rollout status deployment/backend -n production

# Verify health
curl https://api.aizura.com/health/u2e
```

### Database Rollback

**Scenario: Bad migration applied**

```bash
# 1. Stop backend (prevent writes)
kubectl scale deployment/backend --replicas=0 -n production

# 2. Restore from backup
pg_restore -d $DATABASE_URL -c u2e_backup_YYYYMMDD.dump

# 3. Verify data
psql $DATABASE_URL -c "SELECT COUNT(*) FROM u2e_usage_events;"

# 4. Restart backend
kubectl scale deployment/backend --replicas=3 -n production

# 5. Monitor for errors
kubectl logs -f deployment/backend -n production --tail=100
```

### Reward Rate Rollback

**Scenario: Incorrect rate applied**

```sql
-- 1. End current (incorrect) rate
UPDATE u2e_reward_rates
SET effective_to = now(), is_active = false
WHERE business_id = (SELECT id FROM u2e_businesses WHERE business_name = 'AI Traders')
  AND action_type = 'trade_executed'
  AND effective_to IS NULL;

-- 2. Restore previous rate
INSERT INTO u2e_reward_rates (
  business_id,
  action_type,
  action_label,
  rate_per_action,
  effective_from,
  notes
)
SELECT
  business_id,
  action_type,
  action_label,
  rate_per_action,
  now(),
  'Rolled back to previous rate'
FROM u2e_reward_rates
WHERE business_id = (SELECT id FROM u2e_businesses WHERE business_name = 'AI Traders')
  AND action_type = 'trade_executed'
ORDER BY created_at DESC
OFFSET 1 LIMIT 1;

-- 3. Backfill rewards for affected period
-- Run: tsx scripts/u2e/backfillRewards.ts --start-date=YYYY-MM-DD --business=AI_Traders
```

---

## Data Operations

### Backfilling Rewards

```bash
# Dry run first
tsx scripts/u2e/backfillRewards.ts \
  --start-date=2024-12-01 \
  --end-date=2024-12-31 \
  --dry-run

# Review results, then run for real
tsx scripts/u2e/backfillRewards.ts \
  --start-date=2024-12-01 \
  --end-date=2024-12-31

# Refresh stats
psql $DATABASE_URL -c "REFRESH MATERIALIZED VIEW CONCURRENTLY u2e_user_stats;"
```

### Manual Reward Adjustment

```sql
-- Add bonus rewards
INSERT INTO u2e_usage_rewards (
  user_id,
  business_id,
  action_type,
  usage_count,
  rewards_earned,
  period_start,
  notes
) VALUES (
  'user-uuid',
  (SELECT id FROM u2e_businesses WHERE business_name = 'AI Traders'),
  'manual_adjustment',
  1,
  100.0,
  now(),
  'Compensation for system downtime on 2024-12-15'
);

-- Refresh stats
REFRESH MATERIALIZED VIEW CONCURRENTLY u2e_user_stats;
```

### Data Export

```bash
# Export user stats
psql $DATABASE_URL -c "
  COPY (
    SELECT * FROM u2e_user_stats
    ORDER BY total_rewards_earned DESC
  ) TO STDOUT WITH CSV HEADER
" > user_stats_$(date +%Y%m%d).csv

# Export monthly rewards
psql $DATABASE_URL -c "
  COPY (
    SELECT * FROM u2e_usage_rewards
    WHERE period_start >= '2024-12-01'
      AND period_start < '2025-01-01'
  ) TO STDOUT WITH CSV HEADER
" > rewards_2024_12.csv
```

---

## Monitoring & Alerts

### Alert Configuration

**Prometheus AlertManager rules:**

```yaml
groups:
  - name: u2e_alerts
    rules:
      - alert: U2E_HighErrorRate
        expr: rate(u2e_errors_total[5m]) > 0.01
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "U2E error rate above 1%"

      - alert: U2E_SystemDown
        expr: u2e_system_active == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "U2E system is inactive"

      - alert: U2E_HighLatency
        expr: histogram_quantile(0.99, u2e_request_duration_seconds) > 0.5
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "U2E P99 latency above 500ms"
```

### Dashboard Metrics

**Grafana panels to monitor:**

1. **Event Processing Rate**: `rate(u2e_events_total[5m])`
2. **Error Rate**: `rate(u2e_errors_total[5m])`
3. **Request Latency (P50, P95, P99)**: `histogram_quantile(...)`
4. **Active Users**: `u2e_active_users`
5. **Rewards Distributed**: `u2e_rewards_distributed_total`
6. **Database Connections**: `pg_stat_activity_count`

### Log Analysis

```bash
# Find errors in last hour
kubectl logs deployment/backend -n production --since=1h | grep -i "error" | grep "U2E"

# Count error types
kubectl logs deployment/backend -n production --since=1h \
  | grep "U2E_.*_ERROR" -o \
  | sort | uniq -c | sort -rn

# Track specific user events
kubectl logs deployment/backend -n production --since=1h \
  | grep "user-123"
```

---

## Appendix

### Useful SQL Queries

```sql
-- Top earners
SELECT
  u.email,
  s.total_rewards_earned,
  s.businesses_used
FROM u2e_user_stats s
JOIN users u ON u.id = s.user_id
ORDER BY s.total_rewards_earned DESC
LIMIT 10;

-- Business activity
SELECT
  b.business_name,
  COUNT(*) as events,
  COUNT(DISTINCT e.user_id) as unique_users,
  SUM(r.rewards_earned) as total_rewards
FROM u2e_usage_events e
JOIN u2e_businesses b ON b.id = e.business_id
LEFT JOIN u2e_usage_rewards r ON r.user_id = e.user_id AND r.business_id = e.business_id
WHERE e.created_at > now() - interval '24 hours'
GROUP BY b.business_name
ORDER BY events DESC;

-- Recent rate changes
SELECT
  b.business_name,
  r.action_type,
  r.rate_per_action,
  r.effective_from,
  r.notes
FROM u2e_reward_rates r
JOIN u2e_businesses b ON b.id = r.business_id
WHERE r.created_at > now() - interval '7 days'
ORDER BY r.created_at DESC;
```

### Contact Information

- **Slack**: #u2e-ops
- **PagerDuty**: U2E On-Call rotation
- **Wiki**: https://wiki.aizura.com/u2e
- **Supabase Dashboard**: https://app.supabase.com/project/[project-id]

---

**Document Version**: 1.0
**Last Reviewed**: December 2024
**Next Review Due**: March 2025
