# Aizura Consortium API Documentation

## Overview

This document describes the Aizura Consortium REST API, including endpoint specifications, query parameter validation rules, and error response formats.

## Base URL

```
http://localhost:3001/api
```

## Authentication

Most endpoints support optional authentication via Bearer tokens:

```
Authorization: Bearer <token>
```

## Query Parameter Validation

All query parameters are validated according to strict rules to ensure security and stability.

### Pagination Parameters

Endpoints that support pagination accept the following query parameters:

| Parameter | Type    | Required | Default | Min | Max       | Description                    |
|-----------|---------|----------|---------|-----|-----------|--------------------------------|
| `limit`   | integer | No       | 50      | 1   | 100       | Number of items per page       |
| `offset`  | integer | No       | 0       | 0   | 1,000,000 | Number of items to skip        |

#### Validation Rules

- **Must be integers**: Decimal values (e.g., `50.5`) are rejected
- **Must be finite**: `Infinity`, `-Infinity`, and `NaN` are rejected
- **Standard notation only**: Hexadecimal (`0x10`), octal (`0o10`), and binary (`0b10`) notation are rejected
- **Within bounds**: Values must be within the specified min/max range
- **Non-negative**: Negative values are rejected

#### Valid Examples

```
GET /api/room/123/messages?limit=25&offset=50
GET /api/room/123/messages?limit=100
GET /api/room/123/messages (uses defaults)
```

#### Invalid Examples

```
GET /api/room/123/messages?limit=-10          // Negative value
GET /api/room/123/messages?limit=999999       // Exceeds maximum
GET /api/room/123/messages?offset=-999999     // Negative value
GET /api/room/123/messages?limit=Infinity     // Non-finite
GET /api/room/123/messages?limit=NaN          // Not a number
GET /api/room/123/messages?limit=0x100        // Hexadecimal notation
GET /api/room/123/messages?limit=50.5         // Decimal value
```

## Error Responses

### Validation Errors

When query parameter validation fails, the API returns a `400 Bad Request` response with the following structure:

```json
{
  "error": "Invalid pagination parameter",
  "code": "VALIDATION_ERROR",
  "details": {
    "param": "limit",
    "provided": "-10",
    "expected": "An integer >= 1",
    "constraints": {
      "min": 1,
      "max": 100,
      "default": 50
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Error Response Fields

| Field                  | Type   | Description                                      |
|------------------------|--------|--------------------------------------------------|
| `error`                | string | Human-readable error message                     |
| `code`                 | string | Error code (always `VALIDATION_ERROR`)           |
| `details.param`        | string | Name of the invalid parameter                    |
| `details.provided`     | string | Value that was provided (or `null` if missing)   |
| `details.expected`     | string | Description of expected value format             |
| `details.constraints`  | object | Validation constraints (min, max, default, etc.) |
| `timestamp`            | string | ISO 8601 timestamp of the error                  |

### Other Errors

#### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

#### 429 Too Many Requests

```json
{
  "error": "Too many requests, please try again later"
}
```

## Backend Architecture

### Service → Controller → Routes Pattern

The backend follows a clean 3-layer architecture:

```
HTTP Request
    ↓
routes/*.ts (route definition)
    ↓
controllers/*.ts (request handling)
    ↓
services/*.ts (business logic)
    ↓
repositories/*.ts (database queries)
    ↓
Supabase Database
```

**Responsibilities:**
- **Routes**: Define HTTP endpoints and apply middleware
- **Controllers**: Handle HTTP requests/responses, validation
- **Services**: Business logic and orchestration
- **Repositories**: Database queries and data access

### Website Backend Architecture

The website backend (`/backend/website/`) serves public-facing endpoints with read-only access.

#### Security Model
- **Supabase Client**: ANON_KEY (read-only)
- **Authentication**: None (public endpoints)
- **Authorization**: Row Level Security (RLS) policies
- **Middleware**: Rate limiting only

#### Layer Structure
```
Routes → Controllers → Services → Repositories → Database
(thin)   (try/catch)   (business) (data access)  (Supabase)
```

#### Repository Pattern
All database access goes through website-specific repositories:
- `/backend/website/repositories/` - Website data access layer
- Uses `websiteSupabase` client (ANON_KEY)
- Read-only operations only
- Proper RLS enforcement

This ensures:
1. Least privilege principle
2. Clear security boundaries
3. No accidental privilege escalation
4. Testable data access layer

#### Comparison with Shared Repositories
- **Shared Repositories** (`/backend/shared/services/supabase/repositories/`)
  - Use SERVICE_ROLE_KEY
  - Full read/write access
  - Used by admin backend and orchestrator
  - Bypass RLS when needed

- **Website Repositories** (`/backend/website/repositories/`)
  - Use ANON_KEY
  - Read-only access
  - Used by public website backend
  - RLS enforced

### Multi-Tenant Structure

All endpoints are organized by tenant:

```
backend/src/
├── modules/
│   ├── admin/           # Admin-only endpoints (/api/admin/*)
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── services/
│   ├── client/          # Client-specific endpoints (/api/client/*)
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── services/
│   └── website/         # Public endpoints (/api/website/*)
│       ├── routes/
│       ├── controllers/
│       └── services/
└── shared/              # Shared services
    ├── orchestrator/
    ├── middleware/
    └── services/
```

### Complete Endpoint Map

#### Admin Endpoints (`/api/admin/*`)
**Access**: Requires authentication + admin role

- `GET /api/admin/errors/recent?hours=24` - Recent error logs
- `GET /api/admin/errors/admin?source=...&severity=...` - All errors with filters
- `DELETE /api/admin/errors/:id` - Delete specific error log
- `POST /api/admin/errors/cleanup` - Cleanup old error logs
- `GET /api/admin/system/health` - System health metrics
- `GET /api/admin/system/rate-limits?hours=24` - Rate limit statistics
- `POST /api/admin/system/rate-limits/clear` - Clear rate limit violations

**Location**: `backend/src/modules/admin/`

#### Client Endpoints (`/api/client/*`)
**Access**: Requires authentication

- `GET /api/client/proposals?userId=...` - User's proposals
- `GET /api/client/proposals/:id?userId=...` - Get specific proposal

**Location**: `backend/src/modules/client/`

#### Website Endpoints (`/api/website/*`)
**Access**: Public (some require optional authentication)

**Topics:**
- `GET /api/website/topics/current` - Get current active topic
- `GET /api/website/topics/:topicId` - Get specific topic

**Messages:**
- `GET /api/website/messages/topic/:topicId?limit=50&offset=0` - Topic messages
- `GET /api/website/messages/:messageId` - Get specific message

**Proposals:**
- `GET /api/website/proposals?status=...` - All proposals
- `GET /api/website/proposals/:id` - Get specific proposal
- `POST /api/website/proposals` - Create new proposal
- `POST /api/website/proposals/:id/vote` - Vote on proposal (requires auth)
- `GET /api/website/proposals/:id/vote?userId=...` - Get user's vote

**Location**: `backend/src/modules/website/`

## Endpoints

### GET /api/home

Get current consortium status and active topic information.

**Rate Limiting**: 60 requests per minute

**Query Parameters**: None

**Response (200 OK)**:

```json
{
  "status": "active",
  "currentTopic": {
    "id": "topic-123",
    "proposal": {
      "title": "Proposal Title",
      "summary": "Proposal summary"
    },
    "state": "debate",
    "voteProgress": "3/6",
    "planId": "plan-456",
    "timeInfo": {
      "elapsedHours": 24,
      "remainingHours": 96,
      "elapsedDays": 2,
      "remainingDays": 4
    }
  }
}
```

**Response (200 OK - Idle State)**:

```json
{
  "status": "idle",
  "currentTopic": null
}
```

### GET /api/room/:topicId/messages

Get paginated messages for a specific topic.

**Rate Limiting**: 30 requests per minute

**Path Parameters**:
- `topicId` (string, required): The topic ID

**Query Parameters**:
- `limit` (integer, optional): Number of messages per page (default: 50, max: 100)
- `offset` (integer, optional): Number of messages to skip (default: 0)

**Response (200 OK)**:

```json
{
  "messages": [
    {
      "id": "msg-1",
      "topic_id": "topic-123",
      "agent_id": "agent-1",
      "agent_role": "analyst",
      "phase": "debate",
      "importance": 8,
      "body": {
        "type": "debate",
        "message": "Agent message content"
      },
      "selected": true,
      "created_at": "2024-01-15T10:00:00.000Z"
    }
  ],
  "total": 150,
  "offset": 0,
  "limit": 50,
  "hasMore": true
}
```

**Error Responses**:
- `400 Bad Request`: Invalid query parameters (see Validation Errors)
- `500 Internal Server Error`: Server error

### GET /api/plan/:topicId

Get the current plan and steps for a topic.

**Rate Limiting**: 30 requests per minute

**Path Parameters**:
- `topicId` (string, required): The topic ID

**Query Parameters**: None

**Response (200 OK)**:

```json
{
  "plan": {
    "id": "plan-123",
    "topic_id": "topic-123",
    "title": "Plan Title",
    "content_md": "# Plan Content\n\nMarkdown content...",
    "created_at": "2024-01-15T10:00:00.000Z"
  },
  "steps": [
    {
      "id": "step-1",
      "plan_id": "plan-123",
      "step_number": 1,
      "description": "Step description",
      "status": "pending",
      "created_at": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

**Error Responses**:
- `404 Not Found`: Plan not found
- `500 Internal Server Error`: Server error

### GET /api/proposals

Get list of proposals (excluding rejected ones).

**Rate Limiting**: 60 requests per minute

**Query Parameters**: None

**Response (200 OK)**:

```json
{
  "proposals": [
    {
      "id": "proposal-123",
      "title": "Proposal Title",
      "summary": "Proposal summary",
      "status": "queued",
      "submitted_by": "user-id",
      "voting_ends_at": "2024-01-22T10:00:00.000Z",
      "created_at": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

**Error Responses**:
- `500 Internal Server Error`: Server error

### POST /api/proposals

Create a new proposal.

**Authentication**: Optional (if authenticated, proposal is linked to user)

**Rate Limiting**: 10 requests per minute

**Request Body**:

```json
{
  "title": "Proposal Title",
  "summary": "Detailed proposal summary"
}
```

**Validation Rules**:
- `title`: Required, string, 3-200 characters
- `summary`: Required, string, 10-5000 characters

**Response (200 OK)**:

```json
{
  "proposal": {
    "id": "proposal-123",
    "title": "Proposal Title",
    "summary": "Detailed proposal summary",
    "status": "queued",
    "submitted_by": "user-id",
    "voting_ends_at": "2024-01-22T10:00:00.000Z",
    "created_at": "2024-01-15T10:00:00.000Z"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request body
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### POST /api/proposals/:proposalId/vote

Vote on a proposal.

**Authentication**: Required

**Rate Limiting**: 20 requests per minute

**Path Parameters**:
- `proposalId` (string, required): The proposal ID

**Request Body**:

```json
{
  "vote": "for"
}
```

**Validation Rules**:
- `vote`: Required, must be either `"for"` or `"against"`

**Response (200 OK)**:

```json
{
  "vote": {
    "id": "vote-123",
    "proposal_id": "proposal-123",
    "user_id": "user-123",
    "vote": "for",
    "created_at": "2024-01-15T10:00:00.000Z"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request body
- `401 Unauthorized`: Authentication required or invalid token
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Security

### Input Validation

All user input is validated and sanitized:
- Query parameters are validated against strict type and range constraints
- Request bodies are validated against schemas
- HTML script tags and iframes are stripped from text inputs

### Rate Limiting

All API endpoints are protected by PostgreSQL-based rate limiting using a token bucket algorithm. This implementation is suitable for multi-server deployments and Kubernetes horizontal scaling.

#### Rate Limits by Endpoint

| Endpoint | Method | Limit | Window |
|----------|--------|-------|--------|
| `/api/home` | GET | 60 requests | 1 minute |
| `/api/room/:topicId/messages` | GET | 30 requests | 1 minute |
| `/api/plan/:topicId` | GET | 30 requests | 1 minute |
| `/api/proposals` | GET | 60 requests | 1 minute |
| `/api/proposals` | POST | 10 requests | 1 minute |
| `/api/proposals/:proposalId/vote` | POST | 20 requests | 1 minute |
| `/api/system/health` | GET | 120 requests | 1 minute |
| `/health` | GET | 120 requests | 1 minute |
| `/api/errors/recent` | GET | 30 requests | 1 minute |
| `/api/errors/log` | POST | 100 requests | 1 minute |
| `/api/errors/admin` | GET | 60 requests | 1 minute |
| `/api/errors/admin/:id` | DELETE | 30 requests | 1 minute |
| `/api/errors/admin/cleanup` | DELETE | 10 requests | 1 minute |
| `/webhook/proposal` | POST | 100 requests | 1 minute |

#### Rate Limit Headers

All responses include standard rate limit headers:

- `X-RateLimit-Limit`: Maximum requests allowed in the time window
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Unix timestamp when the rate limit resets

Example:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1705320000
```

#### Rate Limit Exceeded Response

When rate limit is exceeded, the API returns `429 Too Many Requests`:

```json
{
  "error": "Too many requests, please try again later",
  "retryAfter": 30
}
```

Headers included:
- `Retry-After`: Seconds to wait before retrying

#### Implementation Details

- **Algorithm**: Token bucket with automatic refill
- **Storage**: PostgreSQL (Supabase) for multi-server compatibility
- **Identification**: By IP address (supports X-Forwarded-For header)
- **Violations**: Logged to database for security monitoring
- **Failover**: Fails open (allows requests) if database is unavailable

### Attack Detection

The API monitors for suspicious validation failure patterns:
- Multiple validation failures from the same IP are logged
- Threshold: 10 failures within 60 seconds triggers a security alert
- Common attack patterns (SQL injection, type confusion) are detected and logged

### CORS

CORS is configured to allow requests from:
- `http://localhost:5173` (development frontend)
- `http://localhost:3000` (alternative development port)
- `http://localhost:4173` (preview mode)
- Custom origins specified in `ALLOWED_ORIGINS` environment variable

## Best Practices

### Pagination

1. Always specify reasonable `limit` values to avoid large response sizes
2. Use `offset` for sequential pagination
3. Check the `hasMore` field to determine if additional pages exist
4. Consider caching responses when appropriate

### Error Handling

1. Check response status codes before processing response bodies
2. Parse validation error details to provide user-friendly error messages
3. Log unexpected errors for debugging
4. Implement retry logic with exponential backoff for rate limit errors

### Performance

1. Use pagination to limit response sizes
2. Implement client-side caching for frequently accessed data
3. Minimize unnecessary API calls
4. Consider WebSocket connections for real-time updates (if available)

## Changelog

### 2024-01-15 - Query Parameter Validation

- Added comprehensive query parameter validation
- Implemented strict type checking for pagination parameters
- Added detailed validation error responses
- Implemented security monitoring for validation failures
- Enhanced protection against memory exhaustion attacks
- Added protection against type confusion attacks

## Support

For issues or questions, please refer to the main project documentation or open an issue in the repository.
