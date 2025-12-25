# U2E Testing Guide

## Overview

Test your U2E integration before going live to ensure events are tracked correctly.

## Testing Environments

### Sandbox
- **Webhook URL:** `https://api-sandbox.aaic.io/webhook/u2e/event`
- **Test API Key:** Request from admin
- **Isolated Data:** Doesn't affect production

### Production
- **Webhook URL:** `https://api.aaic.io/webhook/u2e/event`
- **Production API Key:** Securely stored
- **Live Tracking:** Real user rewards

## Test Checklist

### 1. API Key Validation
```bash
curl -X POST https://api-sandbox.aaic.io/webhook/u2e/event \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "invalid_key",
    "user_id": "test-user-id",
    "action_type": "test_action",
    "idempotency_key": "test_1"
  }'

# Expected: 401 Unauthorized
```

### 2. Valid Event
```bash
curl -X POST https://api-sandbox.aaic.io/webhook/u2e/event \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "test_key_12345",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "action_type": "trade_executed",
    "idempotency_key": "test_trade_unique_1",
    "timestamp": "2024-01-15T10:30:00Z",
    "metadata": {
      "amount": 1000,
      "pair": "BTC/USD"
    }
  }'

# Expected: 200 OK with event_id
```

### 3. Idempotency Check
```bash
# Send same event twice
curl -X POST https://api-sandbox.aaic.io/webhook/u2e/event \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "test_key_12345",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "action_type": "trade_executed",
    "idempotency_key": "duplicate_test_1",
    "metadata": {}
  }'

# Second request with same idempotency_key
# Expected: 200 OK with "Event already processed" message
```

### 4. Missing Fields
```bash
curl -X POST https://api-sandbox.aaic.io/webhook/u2e/event \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "test_key_12345",
    "action_type": "trade_executed"
  }'

# Expected: 400 Bad Request (missing user_id and idempotency_key)
```

### 5. Invalid Action Type
```bash
curl -X POST https://api-sandbox.aaic.io/webhook/u2e/event \
  -H "Content-Type": "application/json" \
  -d '{
    "api_key": "test_key_12345",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "action_type": "non_existent_action",
    "idempotency_key": "test_invalid_action"
  }'

# Expected: 400 Bad Request (action not configured for business)
```

## Verification Steps

### 1. Check Event Was Received

Log into admin dashboard:
```
https://admin.aaic.io/u2e
```

Navigate to:
1. Business Management tab
2. Select your business
3. View recent events
4. Verify your test event appears

### 2. Verify Reward Calculation

```bash
# Get user stats
curl -X GET https://api.aaic.io/client/u2e/stats \
  -H "Authorization: Bearer {user_token}"

# Check rewards_earned increased
```

### 3. Check Usage History

```bash
# Get user history
curl -X GET https://api.aaic.io/client/u2e/history?period=7d \
  -H "Authorization: Bearer {user_token}"

# Verify event appears in history
```

## Integration Test Script

```typescript
import axios from 'axios';

async function runIntegrationTests() {
  const tests = [
    {
      name: 'Valid Event',
      payload: {
        api_key: process.env.TEST_API_KEY,
        user_id: 'test-user-123',
        action_type: 'trade_executed',
        idempotency_key: `test_${Date.now()}`,
        metadata: { test: true }
      },
      expectedStatus: 200
    },
    {
      name: 'Invalid API Key',
      payload: {
        api_key: 'invalid_key',
        user_id: 'test-user-123',
        action_type: 'trade_executed',
        idempotency_key: `test_${Date.now()}`
      },
      expectedStatus: 401
    },
    {
      name: 'Missing Fields',
      payload: {
        api_key: process.env.TEST_API_KEY,
        action_type: 'trade_executed'
      },
      expectedStatus: 400
    }
  ];

  for (const test of tests) {
    console.log(`Running test: ${test.name}`);
    try {
      const response = await axios.post(
        'https://api-sandbox.aaic.io/webhook/u2e/event',
        test.payload
      );

      if (response.status === test.expectedStatus) {
        console.log(`✓ ${test.name} passed`);
      } else {
        console.log(`✗ ${test.name} failed: Expected ${test.expectedStatus}, got ${response.status}`);
      }
    } catch (error: any) {
      if (error.response?.status === test.expectedStatus) {
        console.log(`✓ ${test.name} passed`);
      } else {
        console.log(`✗ ${test.name} failed:`, error.message);
      }
    }
  }
}

runIntegrationTests();
```

## Load Testing

Test with realistic load:

```bash
# Install k6 load testing tool
brew install k6

# Create test script: u2e_load_test.js
# Run load test
k6 run u2e_load_test.js
```

Example k6 script:

```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up
    { duration: '1m', target: 20 },   // Stay at 20 users
    { duration: '30s', target: 0 },   // Ramp down
  ],
};

export default function () {
  const payload = JSON.stringify({
    api_key: __ENV.TEST_API_KEY,
    user_id: 'load-test-user',
    action_type: 'trade_executed',
    idempotency_key: `load_test_${Date.now()}_${__VU}_${__ITER}`,
    metadata: { load_test: true }
  });

  const res = http.post('https://api-sandbox.aaic.io/webhook/u2e/event', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

## Common Issues

### Issue: 401 Unauthorized
- **Cause:** Invalid API key
- **Solution:** Verify API key is correct and not expired

### Issue: 400 Bad Request
- **Cause:** Missing required fields or invalid payload
- **Solution:** Check all required fields are included

### Issue: Events Not Appearing
- **Cause:** U2E system inactive or business not enabled
- **Solution:** Check system status in admin dashboard

### Issue: Duplicate Event Errors
- **Cause:** Reusing idempotency keys
- **Solution:** Ensure keys are truly unique

## Pre-Production Checklist

- [ ] All integration tests passing
- [ ] Idempotency working correctly
- [ ] Error handling implemented
- [ ] Retry logic in place
- [ ] Monitoring/logging configured
- [ ] Load testing completed
- [ ] Security review done (no exposed keys)
- [ ] Documentation reviewed
- [ ] Team trained on monitoring

## Production Deployment

1. Switch from sandbox to production URL
2. Update API key to production key
3. Deploy with monitoring enabled
4. Watch for first events in admin dashboard
5. Verify reward calculations
6. Monitor error rates for 24 hours

## Support

For testing support:
- Documentation: `/docs/U2E_WEBHOOK_API.md`
- Technical Support: tech@aaic.io
