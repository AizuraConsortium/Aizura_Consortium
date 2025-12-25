# U2E System Administration Guide

**Version:** 1.0
**Last Updated:** December 2024
**Audience:** System Administrators, Operations Team

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Admin Access](#admin-access)
3. [System Management](#system-management)
4. [Rate Management](#rate-management)
5. [Business Management](#business-management)
6. [Monitoring & Alerts](#monitoring--alerts)
7. [Common Tasks](#common-tasks)
8. [Troubleshooting](#troubleshooting)
9. [Security](#security)
10. [Maintenance](#maintenance)

---

## System Overview

The Use-to-Earn (U2E) system rewards users with AAIC tokens based on their genuine usage of ecosystem products.

### Key Components

- **Usage Tracker**: Records user actions from integrated businesses
- **Reward Calculator**: Computes AAIC rewards based on configured rates
- **Stats Aggregator**: Maintains real-time user statistics
- **Admin Dashboard**: Web interface for system management

### Architecture

```
Business APIs → Webhook Endpoints → Usage Tracker → Database
                                           ↓
                                    Reward Calculator
                                           ↓
                                  User Stats (Materialized View)
                                           ↓
                                   Admin Dashboard / Client API
```

---

## Admin Access

### Access Requirements

1. Admin role in database (`users.role = 'admin'`)
2. Valid Supabase authentication
3. IP whitelist entry (production only)

### Login

```
URL: https://[domain]/admin
Credentials: Use Supabase auth (email/password)
```

### Permissions Matrix

| Action                   | Admin | Super Admin |
|--------------------------|-------|-------------|
| View stats               | ✅    | ✅          |
| Activate/deactivate system| ✅    | ✅          |
| Adjust reward rates      | ✅    | ✅          |
| Add/remove businesses    | ❌    | ✅          |
| Delete usage events      | ❌    | ✅          |
| Backfill rewards         | ❌    | ✅          |

---

## System Management

### Activating U2E System

**When**: After airdrop campaign concludes and system is ready for live rewards.

**Steps**:

1. Navigate to Admin Dashboard → U2E System
2. Click "Activate System"
3. Confirm activation date
4. System sets `u2e_system_config.is_active = true`
5. Users can now claim accumulated rewards

**Database Command** (fallback):

```sql
UPDATE u2e_system_config
SET
  is_active = true,
  activation_date = now(),
  updated_by = '[your-admin-id]',
  updated_at = now()
WHERE id = (SELECT id FROM u2e_system_config LIMIT 1);
```

**Post-Activation**:
- Monitor event processing rate
- Check for error spikes
- Verify reward calculations
- Test claim process

### Deactivating U2E System

**When**: Emergency maintenance, critical bugs, or system overload.

**Steps**:

1. Navigate to Admin Dashboard → U2E System
2. Click "Deactivate System"
3. Provide reason (logged for audit)
4. Confirm deactivation
5. System stops accepting new events

**Impact**:
- ❌ New events rejected
- ✅ Historical data preserved
- ✅ Stats remain viewable
- ✅ Claims may still work (configurable)

---

## Rate Management

### Understanding Reward Rates

Reward rates define how many AAIC tokens users earn per action.

**Structure**:
```json
{
  "business_id": "uuid",
  "action_type": "trade_executed",
  "rate_per_action": 5.0,
  "effective_from": "2024-01-01T00:00:00Z",
  "effective_to": null,
  "is_active": true
}
```

### Viewing Current Rates

**Dashboard**: Admin → U2E → Reward Rates

**API**:
```bash
curl -H "Authorization: Bearer [token]" \
  https://api.example.com/admin/u2e/rates
```

**Database**:
```sql
SELECT
  b.business_name,
  r.action_type,
  r.action_label,
  r.rate_per_action,
  r.effective_from
FROM u2e_reward_rates r
JOIN u2e_businesses b ON b.id = r.business_id
WHERE r.is_active = true
  AND r.effective_to IS NULL
ORDER BY b.business_name, r.action_type;
```

### Updating Reward Rates

#### Via Dashboard

1. Navigate to Admin → U2E → Reward Rates
2. Find the rate to update
3. Click "Edit"
4. Enter new rate value
5. Add notes explaining change
6. Click "Update Rate"

System automatically:
- Creates new rate version
- Marks old rate as inactive
- Logs change in audit trail

#### Via API

```bash
curl -X PUT \
  -H "Authorization: Bearer [admin-token]" \
  -H "Content-Type: application/json" \
  -d '{
    "business_name": "AI Traders",
    "action_type": "trade_executed",
    "new_rate": 10.0,
    "notes": "Increased to incentivize trading"
  }' \
  https://api.example.com/admin/u2e/rates
```

#### Via Database (emergency)

```sql
-- 1. End current rate
UPDATE u2e_reward_rates
SET
  effective_to = now(),
  is_active = false
WHERE business_id = '[business-uuid]'
  AND action_type = 'trade_executed'
  AND effective_to IS NULL;

-- 2. Insert new rate
INSERT INTO u2e_reward_rates (
  business_id,
  action_type,
  action_label,
  rate_per_action,
  effective_from,
  updated_by,
  notes
) VALUES (
  '[business-uuid]',
  'trade_executed',
  'Execute Trade',
  10.0,
  now(),
  '[your-admin-id]',
  'Increased rate for promotion'
);
```

### Rate Change Guidelines

**Before Changing Rates**:

1. ✅ Review current usage metrics
2. ✅ Calculate impact on token supply
3. ✅ Discuss with governance (if applicable)
4. ✅ Document reasoning
5. ✅ Plan communication to users

**Rate Increase**:
- Impact: Higher token distribution
- Risk: Faster supply depletion
- When: Incentivize usage, reward loyal users

**Rate Decrease**:
- Impact: Lower rewards, potential user dissatisfaction
- Risk: Reduced engagement
- When: Control inflation, adjust for market conditions

**Best Practices**:
- Make gradual changes (not sudden 50% cuts)
- Announce changes in advance when possible
- Monitor impact for 7-14 days
- Be prepared to rollback if needed

---

## Business Management

### Registering New Business

**Prerequisites**:
- Business has API integration ready
- Webhook endpoint configured
- Action types defined
- Reward rates determined

**Steps**:

1. Insert business record:

```sql
INSERT INTO u2e_businesses (
  business_name,
  display_name,
  description,
  logo_url,
  webhook_url,
  api_key_hash,
  is_active
) VALUES (
  'AI_Web_Dev',
  'AI Web Dev Platform',
  'Autonomous web development tool',
  'https://cdn.example.com/logos/webdev.png',
  'https://aiwebdev.com/api/u2e/webhook',
  '[bcrypt-hash-of-api-key]',
  true
);
```

2. Configure reward rates:

```sql
INSERT INTO u2e_reward_rates (
  business_id,
  action_type,
  action_label,
  rate_per_action,
  effective_from
) VALUES
  ('[business-uuid]', 'project_completed', 'Complete Project', 10.0, now()),
  ('[business-uuid]', 'deployment', 'Deploy to Production', 20.0, now()),
  ('[business-uuid]', 'client_milestone', 'Client Milestone', 50.0, now());
```

3. Test integration:

```bash
tsx scripts/u2e/testWebhook.ts \
  --url=https://[business-url] \
  --api-key=[api-key] \
  --preset=[business-preset]
```

4. Activate business tracking

### Deactivating Business

**When**: Business discontinued, integration broken, abuse detected.

```sql
UPDATE u2e_businesses
SET
  is_active = false,
  deactivation_reason = 'Integration deprecated',
  deactivated_at = now(),
  deactivated_by = '[your-admin-id]'
WHERE business_name = '[business-name]';
```

**Impact**:
- New events rejected
- Historical data preserved
- User stats unchanged

---

## Monitoring & Alerts

### Key Metrics to Monitor

| Metric                      | Healthy Range      | Alert Threshold |
|-----------------------------|-------------------|-----------------|
| Events/minute               | 100-10,000        | > 50,000        |
| Reward calc latency         | < 100ms           | > 500ms         |
| Error rate                  | < 0.1%            | > 1%            |
| Duplicate event rate        | < 5%              | > 20%           |
| Suspicious activity flags   | < 10/day          | > 100/day       |

### Dashboard Widgets

1. **System Health**: Active/Inactive status, uptime
2. **Event Processing**: Events/min, processing queue depth
3. **Reward Distribution**: AAIC distributed today/week/month
4. **Top Users**: Highest earners (watch for abuse)
5. **Business Activity**: Events by business
6. **Error Log**: Recent errors, warnings

### Setting Up Alerts

**Email Alerts** (configure in `u2e_system_config`):

```sql
UPDATE u2e_system_config
SET alert_config = jsonb_build_object(
  'error_rate_threshold', 0.01,
  'email_recipients', ARRAY['ops@example.com', 'admin@example.com'],
  'alert_cooldown_minutes', 30
);
```

**Slack/Discord Webhooks**:

```typescript
// backend/shared/monitoring/u2eMetrics.ts
export const ALERT_WEBHOOK = process.env.U2E_ALERT_WEBHOOK;

if (errorRate > 0.01) {
  await fetch(ALERT_WEBHOOK, {
    method: 'POST',
    body: JSON.stringify({
      text: `🚨 U2E Error Rate Alert: ${(errorRate * 100).toFixed(2)}%`
    })
  });
}
```

---

## Common Tasks

### Check User Rewards

```sql
SELECT
  u.email,
  s.total_rewards_earned,
  s.current_month_rewards,
  s.unclaimed_rewards,
  s.last_activity_date
FROM u2e_user_stats s
JOIN users u ON u.id = s.user_id
WHERE s.user_id = '[user-id]';
```

### Investigate Suspicious Activity

```sql
SELECT
  user_id,
  business_id,
  action_type,
  COUNT(*) as event_count,
  MIN(created_at) as first_event,
  MAX(created_at) as last_event
FROM u2e_usage_events
WHERE created_at > now() - interval '1 hour'
GROUP BY user_id, business_id, action_type
HAVING COUNT(*) > 100
ORDER BY event_count DESC;
```

### Manual Reward Adjustment

**When**: Correct errors, compensate for downtime, manual override.

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
  '[user-id]',
  '[business-id]',
  'manual_adjustment',
  1,
  100.0,
  now(),
  'Compensation for system downtime on 2024-12-15'
);

-- Refresh user stats
REFRESH MATERIALIZED VIEW CONCURRENTLY u2e_user_stats;
```

### Run Backfill

```bash
tsx scripts/u2e/backfillRewards.ts \
  --start-date=2024-12-01 \
  --end-date=2024-12-31 \
  --dry-run

# If results look good, run for real
tsx scripts/u2e/backfillRewards.ts \
  --start-date=2024-12-01 \
  --end-date=2024-12-31
```

### Generate Reports

```bash
# Monthly report
tsx scripts/u2e/generateReport.ts --type=monthly --month=2024-12

# User report
tsx scripts/u2e/generateReport.ts --type=user --user-id=[user-id]

# Business performance
tsx scripts/u2e/generateReport.ts --type=business --business=AI_Traders
```

---

## Troubleshooting

### Events Not Being Tracked

**Symptoms**: Webhook calls succeed but no events in database.

**Diagnosis**:
1. Check system status: `SELECT is_active FROM u2e_system_config;`
2. Check business status: `SELECT is_active FROM u2e_businesses WHERE business_name = '[name]';`
3. Check reward rate exists: `SELECT * FROM u2e_reward_rates WHERE business_id = '[id]' AND is_active = true;`

**Solutions**:
- Activate system if inactive
- Activate business if inactive
- Create reward rate if missing

### Duplicate Event Errors

**Symptoms**: High rate of duplicate event rejections.

**Cause**: Idempotency keys colliding, retries, client bugs.

**Diagnosis**:
```sql
SELECT
  event_idempotency_key,
  COUNT(*) as attempts
FROM u2e_usage_events
WHERE created_at > now() - interval '1 hour'
GROUP BY event_idempotency_key
HAVING COUNT(*) > 1
ORDER BY attempts DESC
LIMIT 10;
```

**Solutions**:
- Review idempotency key generation logic
- Check for client-side retry loops
- Verify webhook endpoint returning correct status codes

### Reward Calculation Delays

**Symptoms**: User stats not updating in real-time.

**Cause**: Materialized view not refreshing, high load.

**Diagnosis**:
```sql
SELECT
  relname,
  last_vacuum,
  last_autovacuum,
  last_analyze
FROM pg_stat_user_tables
WHERE relname = 'u2e_user_stats';
```

**Solutions**:
```sql
-- Force refresh
REFRESH MATERIALIZED VIEW CONCURRENTLY u2e_user_stats;

-- Check refresh schedule
SELECT * FROM pg_cron.job WHERE jobname LIKE '%u2e%';
```

### High Error Rate

**Symptoms**: Error log flooded, users reporting issues.

**Diagnosis**:
1. Check error log: Admin → U2E → Error Monitor
2. Group by error type
3. Identify pattern

**Common Errors**:
- `U2E_TRACK_USAGE_ERROR`: Database connectivity, validation failure
- `U2E_REWARD_CALC_ERROR`: Missing rate, calculation overflow
- `U2E_WEBHOOK_AUTH_ERROR`: Invalid API key, expired token

**Solutions**:
- Database issues: Scale up, check connections
- Validation errors: Fix business integration
- Auth errors: Rotate API keys, check whitelist

---

## Security

### API Key Management

**Rotation Schedule**: Every 90 days

**Process**:
1. Generate new API key
2. Update business record with new key hash
3. Notify business to update integration
4. Monitor for auth errors
5. Deactivate old key after 7 days

```sql
UPDATE u2e_businesses
SET
  api_key_hash = '[new-bcrypt-hash]',
  api_key_updated_at = now()
WHERE id = '[business-id]';
```

### Fraud Detection

**Automated Checks**:
- Event velocity: > 1000 events/hour per user
- Unusual patterns: Identical metadata, rapid-fire actions
- Geographic anomalies: Different IPs within minutes

**Manual Investigation**:
```sql
SELECT
  user_id,
  COUNT(DISTINCT ip_address) as unique_ips,
  COUNT(*) as total_events,
  MIN(created_at) as first_seen,
  MAX(created_at) as last_seen
FROM u2e_usage_events
WHERE created_at > now() - interval '24 hours'
GROUP BY user_id
HAVING COUNT(DISTINCT ip_address) > 10
   AND COUNT(*) > 500;
```

**Actions**:
- Flag for review
- Rate limit user
- Suspend rewards
- Ban if confirmed abuse

---

## Maintenance

### Daily Tasks

- [ ] Review dashboard for anomalies
- [ ] Check error log
- [ ] Verify event processing rate
- [ ] Monitor top users for abuse

### Weekly Tasks

- [ ] Review and investigate flagged users
- [ ] Check reward distribution trends
- [ ] Verify materialized view performance
- [ ] Review and resolve support tickets

### Monthly Tasks

- [ ] Generate monthly report
- [ ] Review and adjust reward rates
- [ ] Analyze business performance
- [ ] Plan rate changes for next month
- [ ] Review and update documentation

### Quarterly Tasks

- [ ] Rotate API keys
- [ ] Comprehensive security audit
- [ ] Database optimization (VACUUM, REINDEX)
- [ ] Review and update runbooks
- [ ] Disaster recovery test

---

## Emergency Contacts

**On-Call Rotation**: See PagerDuty schedule

**Escalation**:
1. On-call engineer
2. Engineering manager
3. CTO

**External**:
- Supabase support: support@supabase.io
- Hosting provider: [contact info]

---

## Appendix

### Useful SQL Queries

See [U2E_QUERIES.md](./U2E_QUERIES.md) for comprehensive query library.

### API Reference

See [U2E_WEBHOOK_API.md](./U2E_WEBHOOK_API.md) for complete API documentation.

### Architecture Diagrams

See [U2E_ARCHITECTURE.md](./U2E_ARCHITECTURE.md) for system architecture details.

---

**Document Version**: 1.0
**Last Reviewed**: December 2024
**Next Review Due**: March 2025
