# U2E Webhook API Documentation

## Endpoint

```
POST https://api.aaic.io/webhook/u2e/event
```

## Authentication

Include your API key in the request body:

```json
{
  "api_key": "your_api_key_here"
}
```

## Request Format

```json
{
  "api_key": "your_api_key",
  "user_id": "uuid-of-user",
  "action_type": "trade_executed",
  "idempotency_key": "unique-event-id",
  "timestamp": "2024-01-15T10:30:00Z",
  "metadata": {
    "trade_amount": 1000,
    "pair": "BTC/USD"
  }
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `api_key` | string | Your business API key |
| `user_id` | string | AAIC user UUID |
| `action_type` | string | Event type (see supported events) |
| `idempotency_key` | string | Unique identifier for this event |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | string | ISO 8601 timestamp |
| `metadata` | object | Additional event data |

## Response Format

### Success (200)

```json
{
  "data": {
    "success": true,
    "event_id": "uuid",
    "message": "Usage event tracked successfully"
  }
}
```

### Duplicate (200)

```json
{
  "data": {
    "success": true,
    "event_id": null,
    "message": "Event already processed (idempotent)"
  }
}
```

### Error (400/401/500)

```json
{
  "error": "Error description"
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success (event tracked or duplicate) |
| 400 | Bad request (invalid payload) |
| 401 | Unauthorized (invalid API key) |
| 500 | Server error |

## Idempotency

Always include a unique `idempotency_key` to prevent duplicate tracking. Recommended format:

```
{business_name}:{user_id}:{action}:{timestamp_ms}
```

Example:
```
ai_traders:123e4567-e89b-12d3-a456-426614174000:trade_executed:1705319400000
```

## Rate Limiting

- **Limit:** 1000 requests per minute per business
- **Header:** Check `X-RateLimit-Remaining` response header
- **Exceeded:** Returns 429 status code

## Error Handling

Implement exponential backoff for retries:

```javascript
async function sendWithRetry(payload, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) return await response.json();

      if (response.status === 429) {
        await sleep(Math.pow(2, i) * 1000);
        continue;
      }

      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000);
    }
  }
}
```

## Testing

Use sandbox endpoint for testing:

```
POST https://api-sandbox.aaic.io/webhook/u2e/event
```

See [Testing Guide](./U2E_TESTING_GUIDE.md) for details.

## Examples

### Node.js

```javascript
const axios = require('axios');

async function trackUsage(userId, actionType, metadata = {}) {
  const payload = {
    api_key: process.env.AAIC_API_KEY,
    user_id: userId,
    action_type: actionType,
    idempotency_key: `ai_traders:${userId}:${actionType}:${Date.now()}`,
    timestamp: new Date().toISOString(),
    metadata
  };

  const response = await axios.post(
    'https://api.aaic.io/webhook/u2e/event',
    payload
  );

  return response.data;
}
```

### Python

```python
import requests
import time
from datetime import datetime

def track_usage(user_id, action_type, metadata=None):
    payload = {
        "api_key": os.getenv("AAIC_API_KEY"),
        "user_id": user_id,
        "action_type": action_type,
        "idempotency_key": f"ai_traders:{user_id}:{action_type}:{int(time.time() * 1000)}",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "metadata": metadata or {}
    }

    response = requests.post(
        "https://api.aaic.io/webhook/u2e/event",
        json=payload
    )

    return response.json()
```

## Security

- **Never** expose API keys in client-side code
- Use HTTPS only
- Rotate API keys if compromised
- Store keys in environment variables
- Limit API key permissions to webhook access only
