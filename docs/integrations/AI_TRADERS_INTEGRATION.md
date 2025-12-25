# AI Traders U2E Integration

## Overview

AI Traders integration tracks user trading activity and rewards users with AAIC tokens for platform engagement.

## Trackable Events

| Event Type | Description | Reward Rate |
|------------|-------------|-------------|
| `trade_executed` | User completes a trade | 0.1 AAIC |
| `stop_loss_triggered` | Stop loss order executed | 0.05 AAIC |
| `take_profit_hit` | Take profit order executed | 0.08 AAIC |
| `portfolio_view` | User views portfolio | 0.001 AAIC |
| `api_call` | User makes API call | 0.002 AAIC |
| `bot_created` | User creates trading bot | 1.0 AAIC |
| `bot_deployed` | Bot deployed to live trading | 2.0 AAIC |

*Note: Rates subject to change. Current rates always available via API.*

## Implementation

### Step 1: Environment Setup

```bash
# .env
AAIC_API_KEY=your_api_key_here
AAIC_WEBHOOK_URL=https://api.aaic.io/webhook/u2e/event
```

### Step 2: Create Tracking Service

```typescript
// services/u2eTracker.ts
import axios from 'axios';

export class U2ETracker {
  private apiKey: string;
  private webhookUrl: string;

  constructor() {
    this.apiKey = process.env.AAIC_API_KEY!;
    this.webhookUrl = process.env.AAIC_WEBHOOK_URL!;
  }

  async trackEvent(
    userId: string,
    actionType: string,
    metadata?: Record<string, any>
  ) {
    const payload = {
      api_key: this.apiKey,
      user_id: userId,
      action_type: actionType,
      idempotency_key: `ai_traders:${userId}:${actionType}:${Date.now()}`,
      timestamp: new Date().toISOString(),
      metadata: metadata || {}
    };

    try {
      await axios.post(this.webhookUrl, payload, {
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('U2E tracking error:', error);
      // Don't fail the main operation if tracking fails
    }
  }
}

export const u2eTracker = new U2ETracker();
```

### Step 3: Integrate into Trading Logic

```typescript
// controllers/tradeController.ts
import { u2eTracker } from '../services/u2eTracker';

export async function executeTrade(userId: string, tradeData: TradeData) {
  // Execute trade logic
  const trade = await tradeService.execute(tradeData);

  // Track U2E event (non-blocking)
  u2eTracker.trackEvent(userId, 'trade_executed', {
    trade_id: trade.id,
    amount: trade.amount,
    pair: trade.pair,
    type: trade.type
  }).catch(err => console.error('U2E tracking failed:', err));

  return trade;
}
```

## Integration Points

### 1. Trade Execution
Track when users complete trades:

```typescript
await u2eTracker.trackEvent(userId, 'trade_executed', {
  trade_id: trade.id,
  amount: trade.amount
});
```

### 2. Order Triggers
Track stop loss and take profit:

```typescript
if (order.type === 'stop_loss') {
  await u2eTracker.trackEvent(userId, 'stop_loss_triggered', {
    order_id: order.id
  });
}
```

### 3. Bot Management
Track bot creation and deployment:

```typescript
await u2eTracker.trackEvent(userId, 'bot_created', {
  bot_id: bot.id,
  strategy: bot.strategy
});
```

### 4. Portfolio Views
Track engagement (low frequency):

```typescript
// Only track once per session/hour
if (shouldTrackView(userId)) {
  await u2eTracker.trackEvent(userId, 'portfolio_view');
}
```

## Testing

### Test Event

```bash
curl -X POST https://api-sandbox.aaic.io/webhook/u2e/event \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "test_key_12345",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "action_type": "trade_executed",
    "idempotency_key": "test_trade_123",
    "metadata": {
      "amount": 1000,
      "pair": "BTC/USD"
    }
  }'
```

### Monitor Integration

Check U2E dashboard to verify events are being tracked:
- Admin: `https://admin.aaic.io/u2e`
- Monitor event count
- Verify reward calculations

## Monitoring

Add monitoring to track integration health:

```typescript
// Monitor tracking success rate
let trackingAttempts = 0;
let trackingSuccesses = 0;

setInterval(() => {
  const successRate = trackingSuccesses / trackingAttempts;
  console.log(`U2E tracking success rate: ${successRate * 100}%`);

  if (successRate < 0.95) {
    console.warn('U2E tracking success rate below 95%');
  }

  trackingAttempts = 0;
  trackingSuccesses = 0;
}, 60000); // Every minute
```

## Troubleshooting

### Events Not Appearing

1. Verify API key is correct
2. Check user_id format (must be valid UUID)
3. Ensure U2E system is active
4. Verify business is enabled in admin panel

### Duplicate Event Errors

- Use unique idempotency keys
- Include timestamp in key generation
- Don't retry successful requests

## Support

For AI Traders integration support:
- Technical: tech@aaic.io
- Documentation: /docs/U2E_WEBHOOK_API.md
