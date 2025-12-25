# Use-to-Earn (U2E) System

A reward distribution platform that tracks user activity across integrated businesses and distributes AAIC token rewards in real-time.

---

## Quick Start

### For Developers

```bash
npm install

cp .env.example .env

npm run dev

npm run test:unit tests/unit/u2e
```

### For Business Integrators

```typescript
const response = await fetch('https://api.aizura.com/api/u2e/track', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.U2E_API_KEY
  },
  body: JSON.stringify({
    userId: 'user-uuid',
    businessName: 'AI_Traders',
    actionType: 'trade_executed',
    metadata: {
      tradeId: 'trade-123',
      amount: 100,
      symbol: 'BTC/USD'
    }
  })
});

const result = await response.json();
console.log('Rewards earned:', result.rewardsEarned);
```

### For System Administrators

```bash
psql $DATABASE_URL

SELECT is_active FROM u2e_system_config;

UPDATE u2e_system_config SET is_active = true;

tsx scripts/u2e/healthCheck.sh
```

---

## System Overview

The U2E system consists of:

- **Usage Tracker**: Records user actions from integrated businesses
- **Reward Calculator**: Computes AAIC rewards based on configured rates
- **Stats Aggregator**: Maintains real-time user statistics
- **Admin Dashboard**: Web interface for system management
- **Client API**: User-facing endpoints for viewing stats and claiming rewards

### Architecture

```
External Business → Webhook → Usage Tracker → Database → Client Dashboard
                                     ↓
                             Reward Calculator
                                     ↓
                              Stats Aggregator
```

---

## Documentation

### For Users
- **[U2E FAQ](./docs/U2E_FAQ.md)**: Common questions about earning rewards
- **[Testing Guide](./docs/U2E_TESTING_GUIDE.md)**: How to test the U2E system

### For Developers
- **[Integration Guide](./docs/U2E_INTEGRATION_GUIDE.md)**: How to integrate your business
- **[Webhook API](./docs/U2E_WEBHOOK_API.md)**: Complete API reference
- **[Architecture](./docs/U2E_ARCHITECTURE.md)**: Technical architecture details

### For Administrators
- **[Admin Guide](./docs/U2E_ADMIN_GUIDE.md)**: System administration handbook
- **[Runbook](./docs/U2E_RUNBOOK.md)**: Operational procedures and incident response

---

## Key Features

### For Users
- Earn AAIC tokens by using ecosystem products
- Real-time reward tracking
- Transparent reward rates
- Monthly earnings projections
- Multi-business rewards aggregation

### For Businesses
- Simple webhook integration
- Flexible action types
- Idempotent event submission
- Batch event processing
- Detailed analytics

### For Administrators
- Live system monitoring
- Configurable reward rates
- Business management
- Fraud detection
- Comprehensive audit logs
- One-click system activation/deactivation

---

## Database Schema

### Core Tables

- **u2e_businesses**: Registered businesses that can submit events
- **u2e_reward_rates**: Configurable rates per business and action type
- **u2e_usage_events**: Append-only log of all user actions
- **u2e_usage_rewards**: Aggregated reward calculations
- **u2e_user_stats**: Materialized view of user statistics
- **u2e_system_config**: Global system configuration

See [U2E_ARCHITECTURE.md](./docs/U2E_ARCHITECTURE.md) for detailed schema.

---

## API Endpoints

### User Endpoints

```
GET  /api/u2e/stats/:userId           - Get user statistics
GET  /api/u2e/breakdown/:userId       - Get business breakdown
GET  /api/u2e/history/:userId         - Get usage history
GET  /api/u2e/rates                   - Get current reward rates
```

### Webhook Endpoints (Business Integration)

```
POST /api/u2e/track                   - Track single usage event
POST /api/u2e/track/batch             - Track multiple events
```

### Admin Endpoints

```
POST /admin/u2e/toggle                - Activate/deactivate system
PUT  /admin/u2e/rates                 - Update reward rates
GET  /admin/u2e/analytics             - View system analytics
GET  /admin/u2e/businesses            - Manage businesses
```

See [U2E_WEBHOOK_API.md](./docs/U2E_WEBHOOK_API.md) for complete API documentation.

---

## Scripts & Tools

### Admin Scripts

```bash
tsx scripts/u2e/healthCheck.sh
```
Daily health check with system status, error rates, and processing stats.

```bash
tsx scripts/u2e/backfillRewards.ts --start-date=2024-01-01 --dry-run
```
Recalculate rewards for a date range (useful after rate changes).

```bash
tsx scripts/u2e/generateReport.ts --type=monthly --month=2024-12
```
Generate monthly, user, or business performance reports.

```bash
tsx scripts/u2e/testWebhook.ts --url=http://localhost:3001 --api-key=key
```
Test webhook integration with preset events.

---

## Testing

### Unit Tests

```bash
npm run test:unit tests/unit/u2e
```

Tests cover:
- Usage tracking logic
- Reward calculation
- Idempotency handling
- Fraud detection
- Stats aggregation

### Integration Tests

```bash
npm run test:integration tests/integration/u2e
```

Tests cover:
- End-to-end event flow
- Webhook integration
- Database transactions
- Error scenarios

### Load Tests

```bash
npm run test:load tests/load/u2eLoad.test.ts
```

Simulates high-volume event processing.

---

## Configuration

### Environment Variables

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

U2E_API_KEY=your-api-key

DATABASE_URL=postgresql://...
```

### System Configuration

System-wide settings in `u2e_system_config` table:

```sql
SELECT * FROM u2e_system_config;
```

- `is_active`: System on/off switch
- `global_multiplier`: Apply multiplier to all rewards (e.g., 2x promotional period)
- `max_events_per_hour`: Fraud prevention threshold
- `alert_config`: Alert thresholds and recipients

---

## Deployment

### Production Deployment

```bash
docker build -f Dockerfile.backend -t backend:latest .
docker push backend:latest

kubectl set image deployment/backend backend=backend:latest -n production
kubectl rollout status deployment/backend -n production

curl https://api.aizura.com/health/u2e
```

### Database Migrations

Migrations are in `supabase/migrations/`:

```bash
20251225103047_create_u2e_system.sql
```

Apply via Supabase Dashboard or:

```bash
psql $DATABASE_URL < supabase/migrations/YYYYMMDD_migration.sql
```

---

## Monitoring

### Health Check

```bash
curl https://api.aizura.com/health/u2e
```

Response:
```json
{
  "status": "healthy",
  "system_active": true,
  "events_last_minute": 150,
  "timestamp": "2024-12-25T10:30:00Z"
}
```

### Key Metrics

- **Events/minute**: Should be > 10 during active hours
- **Error rate**: Should be < 0.1%
- **P99 latency**: Should be < 100ms
- **Duplicate rate**: Should be < 5%

### Alerts

Configure alerts in `u2e_system_config.alert_config`:

```json
{
  "error_rate_threshold": 0.01,
  "email_recipients": ["ops@aizura.com"],
  "alert_cooldown_minutes": 30
}
```

---

## Troubleshooting

### System Not Active

```sql
UPDATE u2e_system_config SET is_active = true;
```

### Events Not Processing

```sql
SELECT * FROM u2e_businesses WHERE business_name = 'AI_Traders';

UPDATE u2e_businesses SET is_active = true WHERE business_name = 'AI_Traders';
```

### Stats Not Updating

```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY u2e_user_stats;
```

### High Error Rate

```sql
SELECT error_type, COUNT(*) as count
FROM error_logs
WHERE created_at > now() - interval '1 hour'
  AND error_type LIKE 'U2E_%'
GROUP BY error_type
ORDER BY count DESC;
```

See [U2E_RUNBOOK.md](./docs/U2E_RUNBOOK.md) for complete troubleshooting guide.

---

## Security

### API Key Management

- API keys are bcrypt hashed in database
- Keys should be rotated every 90 days
- Use environment variables, never commit keys

### Rate Limiting

- 1000 events/hour per user (default)
- Configurable per business
- Automatic fraud detection

### Authentication

- User endpoints: Supabase JWT tokens
- Admin endpoints: JWT tokens + role check + IP whitelist
- Webhook endpoints: API key in `X-API-Key` header

### Fraud Prevention

- Velocity checks (>1000 events/hour flagged)
- IP tracking
- Duplicate detection via idempotency keys
- Manual review queue for suspicious activity

---

## Business Integration

### Integration Checklist

- [ ] Register business in `u2e_businesses` table
- [ ] Generate API key and share securely
- [ ] Configure reward rates in `u2e_reward_rates`
- [ ] Implement webhook calls in business code
- [ ] Test with `scripts/u2e/testWebhook.ts`
- [ ] Monitor first week of integration
- [ ] Set up alerts for your business

### Example Integration

```typescript
import crypto from 'crypto';

async function trackUserAction(userId: string, actionType: string, metadata: any) {
  const timestamp = new Date().toISOString().slice(0, 13);
  const idempotencyKey = crypto
    .createHash('sha256')
    .update(`${userId}:AI_Traders:${actionType}:${timestamp}`)
    .digest('hex');

  const response = await fetch('https://api.aizura.com/api/u2e/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.U2E_API_KEY
    },
    body: JSON.stringify({
      userId,
      businessName: 'AI_Traders',
      actionType,
      metadata
    })
  });

  if (response.status === 409) {
    console.log('Duplicate event (expected with retries)');
    return;
  }

  if (!response.ok) {
    console.error('Failed to track event:', await response.text());
    throw new Error('U2E tracking failed');
  }

  const result = await response.json();
  console.log(`User earned ${result.rewardsEarned} AAIC`);
}
```

See [U2E_INTEGRATION_GUIDE.md](./docs/U2E_INTEGRATION_GUIDE.md) for complete integration guide.

---

## Support

### Documentation
- **Admin Guide**: [docs/U2E_ADMIN_GUIDE.md](./docs/U2E_ADMIN_GUIDE.md)
- **Architecture**: [docs/U2E_ARCHITECTURE.md](./docs/U2E_ARCHITECTURE.md)
- **Runbook**: [docs/U2E_RUNBOOK.md](./docs/U2E_RUNBOOK.md)
- **API Reference**: [docs/U2E_WEBHOOK_API.md](./docs/U2E_WEBHOOK_API.md)
- **Integration Guide**: [docs/U2E_INTEGRATION_GUIDE.md](./docs/U2E_INTEGRATION_GUIDE.md)

### Contact
- **Slack**: #u2e-support
- **Email**: support@aizura.com
- **Emergency**: PagerDuty U2E On-Call

### Reporting Issues
1. Check [U2E_FAQ.md](./docs/U2E_FAQ.md)
2. Search existing issues
3. Create issue with:
   - Error message
   - Steps to reproduce
   - Expected vs actual behavior
   - System logs

---

## Roadmap

### Phase 1 (Completed)
- [x] Core event tracking
- [x] Reward calculation
- [x] User statistics
- [x] Admin dashboard
- [x] Webhook API
- [x] Fraud detection

### Phase 2 (Q1 2025)
- [ ] Advanced analytics
- [ ] Reward claiming on blockchain
- [ ] Mobile app support
- [ ] Referral bonuses
- [ ] Gamification features

### Phase 3 (Q2 2025)
- [ ] Multi-chain support
- [ ] Decentralized governance
- [ ] Third-party integrations
- [ ] Machine learning fraud detection

---

## License

Proprietary - Aizura Consortium

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](./.github/CONTRIBUTING.md) for detailed guidelines.

---

## Changelog

### v1.0.0 (December 2024)
- Initial release
- Core U2E system
- Admin dashboard
- Complete documentation
- Testing suite

---

**Version**: 1.0.0
**Last Updated**: December 2024
**Maintained By**: Aizura Engineering Team
