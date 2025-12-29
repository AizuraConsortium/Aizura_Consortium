# Tokenomics API Documentation

This document describes the API endpoints for the new tokenomics system (100M supply model).

## Base URL

```
/api/tokenomics
```

## Endpoints

### Supply Information

#### GET /supply

Returns current token supply information.

**Response:**
```json
{
  "maxSupply": 100000000,
  "currentSupply": 100000000,
  "burned": 0,
  "circulating": 40000000,
  "locked": 60000000
}
```

#### GET /allocation

Returns token allocation breakdown.

**Response:**
```json
{
  "totalSupply": 100000000,
  "allocation": [
    {
      "category": "use_to_earn",
      "amount": 22000000,
      "percentage": 22,
      "description": "Use-to-Earn rewards pool (48 months)"
    },
    {
      "category": "team",
      "amount": 16000000,
      "percentage": 16,
      "description": "36-month linear vesting, NO CLIFF"
    },
    {
      "category": "staking",
      "amount": 15000000,
      "percentage": 15,
      "description": "Staking rewards pool (48 months)"
    },
    {
      "category": "treasury",
      "amount": 15000000,
      "percentage": 15,
      "description": "DAO-controlled treasury"
    },
    {
      "category": "airdrop",
      "amount": 8000000,
      "percentage": 8,
      "description": "Community airdrop for early supporters"
    },
    {
      "category": "investors",
      "amount": 8000000,
      "percentage": 8,
      "description": "NO VESTING (immediate unlock, labeled wallets)"
    },
    {
      "category": "market_ops",
      "amount": 7000000,
      "percentage": 7,
      "description": "Market operations and business development"
    },
    {
      "category": "liquidity",
      "amount": 6000000,
      "percentage": 6,
      "description": "Multi-chain DEX liquidity"
    },
    {
      "category": "advisors",
      "amount": 3000000,
      "percentage": 3,
      "description": "12-month linear vesting, NO CLIFF"
    }
  ]
}
```

#### GET /revenue-distribution

Returns monthly profit distribution percentages.

**Response:**
```json
{
  "distribution": [
    {
      "bucket": "buyback",
      "percentage": 15,
      "description": "Market buyback operations"
    },
    {
      "bucket": "burn",
      "percentage": 15,
      "description": "Permanent token burn (until 21M target)"
    },
    {
      "bucket": "staking",
      "percentage": 15,
      "description": "Staking rewards (post-Year 4)"
    },
    {
      "bucket": "use_to_earn",
      "percentage": 15,
      "description": "Use-to-Earn pool (post-Year 4)"
    },
    {
      "bucket": "treasury",
      "percentage": 25,
      "description": "DAO treasury allocation"
    },
    {
      "bucket": "variable",
      "percentage": 15,
      "description": "Governance-adjustable bucket"
    }
  ]
}
```

#### GET /burn-target

Returns burn target information.

**Response:**
```json
{
  "targetAmount": 21000000,
  "finalSupply": 79000000,
  "revenuePercentage": 30
}
```

#### GET /governance-params

Returns governance parameters.

**Response:**
```json
{
  "DAO": {
    "minTokens": 50000,
    "votingDelayDays": 1,
    "votingDays": 14,
    "quorumPercentage": 20,
    "approvalThreshold": 60,
    "timelockDelayHours": 48
  },
  "LAUNCHPAD": {
    "depositAmount": 1000,
    "votingDays": 7,
    "quorumPercentage": 5,
    "approvalThreshold": 60,
    "slashPercentageMax": 20
  }
}
```

### Use-to-Earn (U2E) Points System

#### GET /u2e/points/values

Returns current point values for all action types.

**Response:**
```json
{
  "pointValues": [
    {
      "action_type": "ai_trader_trade",
      "base_points": 100,
      "max_per_day": 50,
      "max_per_month": 1000,
      "decay_rate": 0.0,
      "description": "Automated trade executed via AI Traders",
      "active": true
    }
  ]
}
```

#### POST /u2e/points/track

Track user action and award points.

**Request Body:**
```json
{
  "userId": "uuid",
  "actionType": "ai_trader_trade",
  "metadata": {
    "trade_id": "abc123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "points_awarded": 100
}
```

#### GET /u2e/user/:userId/points

Get user's monthly points.

**Query Parameters:**
- `month` (required): Month number (1-12)
- `year` (required): Year (e.g., 2025)

**Response:**
```json
{
  "total_points": 5000,
  "actions_count": 50,
  "breakdown": {
    "ai_trader_trade": 3000,
    "web_dev_project": 2000
  }
}
```

#### GET /u2e/distribution/calculate

Calculate monthly distribution preview.

**Query Parameters:**
- `month` (required): Month number (1-12)
- `year` (required): Year (e.g., 2025)

**Response:**
```json
{
  "total_points": 1000000,
  "total_participants": 250,
  "aaic_pool": 458333,
  "distributions": [
    {
      "user_id": "uuid",
      "points": 15000,
      "share": 0.015,
      "aaic": 6875
    }
  ]
}
```

### Staking

#### GET /staking/apy/calculate

Calculate APY for specific parameters.

**Query Parameters:**
- `totalStaked` (required): Total AAIC staked
- `year` (required): Year (1-4)
- `lockPeriodDays` (required): Lock period in days

**Response:**
```json
{
  "totalStaked": 20000000,
  "year": 1,
  "lockPeriodDays": 365,
  "apy": 50.0
}
```

#### GET /staking/apy/all

Get all APYs for different lock periods.

**Query Parameters:**
- `totalStaked` (required): Total AAIC staked
- `year` (required): Year (1-4)

**Response:**
```json
{
  "totalStaked": 20000000,
  "year": 1,
  "apys": [
    {
      "lockPeriodDays": 30,
      "baseAPY": 25.0,
      "multiplier": 1.0,
      "finalAPY": 25.0
    }
  ]
}
```

#### GET /staking/emissions/schedule

Get 48-month emission schedule.

**Response:**
```json
{
  "schedule": [
    {
      "year": 1,
      "yearlyEmission": 4500000,
      "monthlyEmission": 375000
    },
    {
      "year": 2,
      "yearlyEmission": 3750000,
      "monthlyEmission": 312500
    },
    {
      "year": 3,
      "yearlyEmission": 3750000,
      "monthlyEmission": 312500
    },
    {
      "year": 4,
      "yearlyEmission": 3000000,
      "monthlyEmission": 250000
    }
  ]
}
```

#### GET /staking/post-year4

Calculate post-Year 4 rewards from profit.

**Query Parameters:**
- `monthlyProfit` (required): Monthly profit in USD
- `aaicPrice` (required): AAIC price in USD

**Response:**
```json
{
  "rewardBudgetUSD": 60000,
  "stakingShareUSD": 30000,
  "stakingShareAAIC": 60000
}
```

#### GET /staking/required-profit

Calculate required profit for desired distribution.

**Query Parameters:**
- `desiredAAIC` (required): Desired monthly AAIC distribution
- `aaicPrice` (required): AAIC price in USD

**Response:**
```json
{
  "desiredAAIC": 1000000,
  "aaicPrice": 0.5,
  "requiredProfit": 1666667
}
```

**Calculation:**
- Total USD needed: 1,000,000 AAIC × $0.50 = $500,000
- Required monthly profit: $500,000 / 0.30 = $1,666,667
- (30% of profit allocated to rewards = 15% staking + 15% U2E)

### Treasury Guardrails

#### GET /treasury/guardrails/status

Get overall treasury health status.

**Response:**
```json
{
  "healthy": true,
  "guardrails": [
    {
      "name": "Weekly Spend Cap",
      "limit": 100000,
      "current": 45000,
      "used": 45000,
      "remaining": 55000,
      "percentage": 45.0,
      "breached": false
    }
  ],
  "warnings": [],
  "errors": []
}
```

#### GET /treasury/weekly-spend

Get weekly spend cap status.

**Note:** Weekly caps are defined separately for stablecoins and AAIC:
- Stablecoins: max($50k, 3% of balance)
- AAIC: max(250k AAIC, 2% of balance)

**Response:**
```json
{
  "name": "Weekly Spend Cap (Stablecoins)",
  "limit": 50000,
  "current": 45000,
  "used": 45000,
  "remaining": 5000,
  "percentage": 90.0,
  "breached": false
}
```

#### GET /treasury/buyback-frequency

Get buyback frequency status.

**Response:**
```json
{
  "name": "Buyback Frequency",
  "limit": 168,
  "current": 170,
  "used": 170,
  "remaining": 0,
  "percentage": 101.2,
  "breached": false
}
```

#### GET /treasury/lp-withdrawal

Get LP withdrawal limit status.

**Response:**
```json
{
  "name": "LP Withdrawal Limit",
  "limit": 800000,
  "current": 200000,
  "used": 200000,
  "remaining": 600000,
  "percentage": 25.0,
  "breached": false
}
```

### Treasury Guardrails Parameters

The following guardrails are enforced:

#### Weekly Caps
- **Stablecoins**: max($50k, 3% of balance)
- **AAIC**: max(250k AAIC, 2% of balance)

#### Buyback Rules
- **Max frequency**: 1 per week (168 hours minimum between buybacks)
- **Slippage cap**: ≤ 2.5% (governance can adjust up to max 5%)
- **Daily spend cap**: ≤ 0.5% of treasury balance

#### LP Protections
- **Max LP withdrawal**: 25% per month
- Prevents liquidity shock and rug pull optics

#### Allowlist
- Treasury can ONLY interact with approved addresses:
  - Approved DEX routers
  - Buyback executor contract
  - Staking/U2E vault contracts
  - Liquidity manager contract

### Cross-Chain Tracking

#### GET /blockchain/chains/balances

Get token balances across all chains.

**Response:**
```json
{
  "chains": [
    {
      "chain": "BNB Chain",
      "balance": 40000000,
      "lastUpdated": "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### GET /blockchain/chains/stats

Get cross-chain statistics.

**Response:**
```json
{
  "totalSupply": 100000000,
  "expectedSupply": 100000000,
  "balanced": true,
  "chains": [],
  "canonicalChain": "BNB Chain"
}
```

#### GET /blockchain/supply/verify

Verify supply integrity across chains.

**Response:**
```json
{
  "valid": true,
  "message": "Supply integrity verified across all chains"
}
```

#### GET /blockchain/chain/:chainName

Get information about a specific chain.

**Response:**
```json
{
  "chain": "BNB Chain",
  "balance": 40000000,
  "percentage": 40.0,
  "isCanonical": true,
  "phase": "v1",
  "active": true
}
```

## Migration from Old System

The new system replaces fixed AAIC rewards with a points-based system. Key changes:

1. **Points Instead of AAIC**: Users earn points for actions, not direct AAIC rewards
2. **Monthly Distribution**: Points are converted to AAIC at month-end based on pool share
3. **Anti-Abuse**: Built-in caps and decay mechanisms prevent gaming
4. **Scalability**: New 100M supply model with clear allocations

### Breaking Changes

- U2E rewards are no longer immediately distributed
- Reward amounts are now calculated monthly based on total points
- All reward endpoints now use points-based parameters

### Migration Steps

1. Update frontend to use `/u2e/points/*` endpoints
2. Replace direct AAIC reward displays with points
3. Add monthly distribution preview UI
4. Update user dashboards to show point balances
