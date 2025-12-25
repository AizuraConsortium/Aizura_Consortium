# Portfolio API Documentation

**Version:** 1.0
**Base URL:** `/api/portfolio`
**Authentication:** Required (Bearer token)

---

## Table of Contents

- [Overview](#overview)
- [Endpoints](#endpoints)
  - [Get Portfolio Overview](#get-portfolio-overview)
  - [List Businesses](#list-businesses)
  - [Get Business Details](#get-business-details)
  - [Get Business Metrics](#get-business-metrics)
  - [Get Exposure Breakdown](#get-exposure-breakdown)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Caching](#caching)
- [Examples](#examples)

---

## Overview

The Portfolio API provides endpoints for users to view and track their exposure to businesses in the Aizura ecosystem. Exposure is calculated based on governance participation (voting, proposals) and usage-to-earn activity.

### Key Concepts

- **Portfolio**: Collection of businesses a user has exposure to
- **Exposure Score**: Numerical value representing user's stake in a business
- **Business Metrics**: Performance data (revenue, users, transactions, etc.)
- **Activity Level**: Classification of user engagement (low, medium, high)

---

## Endpoints

### Get Portfolio Overview

Get a complete overview of the user's portfolio including all businesses and exposure.

**Endpoint:** `GET /portfolio/overview`

**Authentication:** Required

**Query Parameters:**

| Parameter      | Type    | Required | Description                                    |
| -------------- | ------- | -------- | ---------------------------------------------- |
| status         | string  | No       | Filter by business status (live, development, planning, paused) |
| category       | string  | No       | Filter by category (trading, saas, infrastructure, etc.) |
| is_foundation  | boolean | No       | Filter for foundation businesses only          |
| is_active      | boolean | No       | Filter by active status                        |
| sort           | string  | No       | Sort field (created_at, updated_at, exposure_score) |
| order          | string  | No       | Sort order (asc, desc) - default: desc         |

**Response:** `200 OK`

```json
{
  "total_businesses": 4,
  "total_exposure_score": 125.5,
  "total_portfolio_revenue": 208000,
  "total_users": 15000,
  "businesses": [
    {
      "id": "uuid",
      "display_name": "AI Traders",
      "slug": "ai-traders",
      "description": "AI-powered trading platform",
      "status": "live",
      "category": "trading",
      "development_progress": 100,
      "is_foundation": true,
      "is_active": true,
      "integration_type": "api",
      "logo_url": "https://...",
      "website_url": "https://...",
      "github_url": "https://...",
      "docs_url": "https://...",
      "proposal_id": "uuid",
      "plan_id": "uuid",
      "launch_date": "2024-03-01T00:00:00Z",
      "current_metrics": {
        "revenue": 125000,
        "users": 8000,
        "transactions": 50000,
        "api_calls": null
      },
      "exposure": {
        "user_id": "uuid",
        "business_id": "uuid",
        "exposure_score": 45.5,
        "exposure_type": "voting",
        "activity_level": "high",
        "votes_cast": 5,
        "proposals_submitted": 0,
        "usage_rewards_earned": 0,
        "last_activity_at": "2024-12-25T00:00:00Z"
      },
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-12-25T00:00:00Z"
    }
  ]
}
```

**Errors:**
- `401 Unauthorized` - Missing or invalid authentication
- `500 Internal Server Error` - Server error

---

### List Businesses

Get a paginated list of businesses with filtering and sorting.

**Endpoint:** `GET /portfolio/businesses`

**Authentication:** Required

**Query Parameters:**

| Parameter      | Type    | Required | Description                                    |
| -------------- | ------- | -------- | ---------------------------------------------- |
| status         | string  | No       | Filter by status                               |
| category       | string  | No       | Filter by category                             |
| is_foundation  | boolean | No       | Filter foundation businesses                   |
| is_active      | boolean | No       | Filter active businesses                       |
| search         | string  | No       | Search by name or description                  |
| sort           | string  | No       | Sort field                                     |
| order          | string  | No       | Sort order (asc, desc)                         |
| limit          | integer | No       | Number of results per page (default: 20, max: 100) |
| offset         | integer | No       | Offset for pagination (default: 0)             |

**Response:** `200 OK`

```json
{
  "businesses": [...],
  "total": 10,
  "limit": 20,
  "offset": 0
}
```

**Errors:**
- `400 Bad Request` - Invalid query parameters
- `401 Unauthorized` - Missing or invalid authentication
- `500 Internal Server Error` - Server error

---

### Get Business Details

Get detailed information about a specific business including metrics and exposure.

**Endpoint:** `GET /portfolio/businesses/:id`

**Authentication:** Required

**Path Parameters:**

| Parameter | Type   | Required | Description                      |
| --------- | ------ | -------- | -------------------------------- |
| id        | string | Yes      | Business ID or slug              |

**Query Parameters:**

| Parameter | Type   | Required | Description        |
| --------- | ------ | -------- | ------------------ |
| user_id   | string | No       | User ID for exposure calculation |

**Response:** `200 OK`

```json
{
  "id": "uuid",
  "display_name": "AI Traders",
  "slug": "ai-traders",
  "description": "AI-powered trading platform for crypto assets",
  "status": "live",
  "category": "trading",
  "development_progress": 100,
  "is_foundation": true,
  "is_active": true,
  "integration_type": "api",
  "logo_url": "https://...",
  "website_url": "https://...",
  "github_url": "https://...",
  "docs_url": "https://...",
  "proposal_id": "uuid",
  "plan_id": "uuid",
  "launch_date": "2024-03-01T00:00:00Z",
  "current_metrics": {
    "revenue": 125000,
    "users": 8000,
    "transactions": 50000
  },
  "exposure": {
    "exposure_score": 45.5,
    "exposure_type": "voting",
    "activity_level": "high",
    "votes_cast": 5,
    "proposals_submitted": 0,
    "usage_rewards_earned": 0,
    "last_activity_at": "2024-12-25T00:00:00Z"
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-12-25T00:00:00Z"
}
```

**Errors:**
- `400 Bad Request` - Invalid business ID
- `401 Unauthorized` - Missing or invalid authentication
- `404 Not Found` - Business not found
- `500 Internal Server Error` - Server error

---

### Get Business Metrics

Get time-series performance metrics for a business.

**Endpoint:** `GET /portfolio/businesses/:id/metrics`

**Authentication:** Required

**Path Parameters:**

| Parameter | Type   | Required | Description  |
| --------- | ------ | -------- | ------------ |
| id        | string | Yes      | Business ID  |

**Query Parameters:**

| Parameter   | Type   | Required | Description                                      |
| ----------- | ------ | -------- | ------------------------------------------------ |
| metric_type | string | Yes      | Type of metric (revenue, users, transactions, api_calls) |
| start_date  | string | No       | Start date (ISO 8601 format)                     |
| end_date    | string | No       | End date (ISO 8601 format)                       |
| limit       | integer| No       | Maximum data points (default: 100)               |
| offset      | integer| No       | Offset for pagination (default: 0)               |

**Response:** `200 OK`

```json
{
  "business_id": "uuid",
  "metric_type": "revenue",
  "data_points": [
    {
      "period_start": "2024-01-01T00:00:00Z",
      "period_end": "2024-01-31T23:59:59Z",
      "value": 100000
    },
    {
      "period_start": "2024-02-01T00:00:00Z",
      "period_end": "2024-02-29T23:59:59Z",
      "value": 125000
    }
  ],
  "trend": {
    "direction": "up",
    "change_percent": 25,
    "change_value": 25000
  }
}
```

**Errors:**
- `400 Bad Request` - Invalid parameters
- `401 Unauthorized` - Missing or invalid authentication
- `404 Not Found` - Business not found
- `500 Internal Server Error` - Server error

---

### Get Exposure Breakdown

Get detailed breakdown of user's exposure across all businesses.

**Endpoint:** `GET /portfolio/exposure`

**Authentication:** Required

**Query Parameters:**

| Parameter | Type    | Required | Description                      |
| --------- | ------- | -------- | -------------------------------- |
| user_id   | string  | No       | User ID (defaults to authenticated user) |

**Response:** `200 OK`

```json
{
  "total_exposure_score": 125.5,
  "by_type": {
    "voting": 80.0,
    "usage": 30.5,
    "proposal": 15.0,
    "mixed": 0
  },
  "by_business": [
    {
      "business_id": "uuid",
      "business_name": "AI Traders",
      "exposure_score": 45.5,
      "exposure_type": "voting",
      "activity_level": "high",
      "percentage": 36.3
    }
  ]
}
```

**Errors:**
- `401 Unauthorized` - Missing or invalid authentication
- `500 Internal Server Error` - Server error

---

## Data Models

### Business Status

- `live` - Business is operational and generating revenue
- `development` - Business is under active development
- `planning` - Business is in planning phase
- `paused` - Business development is paused

### Exposure Type

- `voting` - Exposure from voting on proposals
- `usage` - Exposure from using the business (U2E)
- `proposal` - Exposure from submitting proposals
- `mixed` - Multiple types of exposure

### Activity Level

- `low` - Minimal participation
- `medium` - Moderate participation
- `high` - Active participation

### Metric Type

- `revenue` - Monthly recurring revenue (USD)
- `users` - Active users count
- `transactions` - Number of transactions
- `api_calls` - API calls made

---

## Error Handling

All errors follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Detailed error information"
    }
  }
}
```

### Common Error Codes

- `UNAUTHORIZED` - Missing or invalid authentication
- `FORBIDDEN` - User lacks permission
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid request parameters
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

---

## Rate Limiting

**Limits:**
- 100 requests per minute per user
- 1000 requests per hour per user

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

When rate limit is exceeded:
- Status: `429 Too Many Requests`
- Header: `Retry-After: 60` (seconds)

---

## Caching

**Cache Headers:**

Responses include cache-control headers:
```
Cache-Control: private, max-age=300
ETag: "abc123"
```

**Recommended Cache Strategy:**
- Portfolio overview: 5 minutes
- Business details: 3 minutes
- Metrics data: 10 minutes
- Exposure breakdown: 5 minutes

---

## Examples

### Get User Portfolio

```bash
curl -X GET \
  'https://api.aizura.io/api/portfolio/overview?status=live' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Get Business with Slug

```bash
curl -X GET \
  'https://api.aizura.io/api/portfolio/businesses/ai-traders' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Get Revenue Metrics

```bash
curl -X GET \
  'https://api.aizura.io/api/portfolio/businesses/uuid/metrics?metric_type=revenue&start_date=2024-01-01&end_date=2024-12-31' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Search Businesses

```bash
curl -X GET \
  'https://api.aizura.io/api/portfolio/businesses?search=AI&limit=10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## Support

For API support or questions:
- Documentation: https://docs.aizura.io
- GitHub Issues: https://github.com/aizura/consortium/issues
- Discord: https://discord.gg/aizura
