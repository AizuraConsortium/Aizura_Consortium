# Admin API Documentation

This document describes all admin and system endpoints in the Aizura Consortium API.

## Base URL

```
http://localhost:3001/api
```

In production, replace with your deployed API URL.

## Authentication

All admin endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

The token is obtained through Supabase authentication. Admin users must have the `admin` role in the `users` table.

## Public System Endpoints

### GET /system/health

Get system health status and metrics (public endpoint).

**Authentication:** None required

**Response:**
```json
{
  "status": "healthy" | "degraded" | "unhealthy",
  "uptime": 99.9,
  "timestamp": "2025-12-18T12:00:00.000Z",
  "errors": {
    "last24h": 5,
    "recent": [
      {
        "severity": "warning",
        "message": "API rate limit approaching threshold",
        "timestamp": "2025-12-18T11:45:00.000Z"
      }
    ],
    "bySeverity": {
      "info": 10,
      "warning": 3,
      "error": 2,
      "critical": 0
    }
  },
  "database": {
    "connected": true
  }
}
```

**Status Codes:**
- `200 OK` - Successfully retrieved health status
- `500 Internal Server Error` - Server error

---

### GET /errors/recent

Get recent error logs (public endpoint with limited data).

**Authentication:** None required

**Query Parameters:**
- `limit` (optional, default: 10, max: 50) - Number of recent errors to return

**Response:**
```json
{
  "errors": [
    {
      "severity": "error",
      "message": "Failed to process agent response",
      "timestamp": "2025-12-18T11:30:00.000Z"
    }
  ],
  "total": 1
}
```

**Status Codes:**
- `200 OK` - Successfully retrieved errors
- `400 Bad Request` - Invalid query parameters
- `500 Internal Server Error` - Server error

---

### POST /errors/log

Log a new error (public endpoint for client-side error logging).

**Authentication:** None required

**Request Body:**
```json
{
  "source": "frontend" | "backend" | "agent",
  "severity": "info" | "warning" | "error" | "critical",
  "error_type": "API_ERROR",
  "message": "Error description",
  "details": {
    "additionalInfo": "Any additional context"
  },
  "agent_id": "claude",
  "topic_id": "uuid-optional"
}
```

**Required Fields:**
- `source`
- `severity`
- `error_type`
- `message`

**Response:**
```json
{
  "success": true,
  "error_id": "uuid"
}
```

**Status Codes:**
- `201 Created` - Error logged successfully
- `400 Bad Request` - Invalid request body
- `500 Internal Server Error` - Server error

---

## Admin Endpoints

All admin endpoints require:
1. Valid JWT authentication token
2. `admin` role in the `users` table
3. IP address in the whitelist (configurable via `ADMIN_WHITELISTED_IPS` env variable)

### GET /errors/admin

Get all error logs with advanced filtering (admin only).

**Authentication:** Required (Admin role)

**Query Parameters:**
- `limit` (optional, default: 50, max: 100) - Number of errors per page
- `offset` (optional, default: 0) - Pagination offset
- `source` (optional) - Filter by source: `frontend`, `backend`, or `agent`
- `severity` (optional) - Filter by severity: `info`, `warning`, `error`, or `critical`
- `agentId` (optional) - Filter by specific agent ID
- `startDate` (optional) - ISO 8601 date string - Filter errors after this date
- `endDate` (optional) - ISO 8601 date string - Filter errors before this date

**Example Request:**
```
GET /errors/admin?limit=20&severity=error&source=backend&startDate=2025-12-01T00:00:00Z
```

**Response:**
```json
{
  "errors": [
    {
      "id": "uuid",
      "source": "backend",
      "severity": "error",
      "agent_id": "claude",
      "error_type": "DATABASE_ERROR",
      "message": "Failed to connect to database",
      "details": {
        "errorCode": "ECONNREFUSED",
        "stack": "..."
      },
      "topic_id": "uuid-optional",
      "created_at": "2025-12-18T11:30:00.000Z"
    }
  ],
  "total": 150,
  "limit": 20,
  "offset": 0
}
```

**Status Codes:**
- `200 OK` - Successfully retrieved errors
- `400 Bad Request` - Invalid query parameters
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User does not have admin role or IP not whitelisted
- `500 Internal Server Error` - Server error

---

### DELETE /errors/admin/:id

Delete a specific error log (admin only).

**Authentication:** Required (Admin role)

**URL Parameters:**
- `id` - UUID of the error log to delete

**Example Request:**
```
DELETE /errors/admin/123e4567-e89b-12d3-a456-426614174000
```

**Response:**
```json
{
  "success": true,
  "message": "Error log deleted successfully"
}
```

**Status Codes:**
- `200 OK` - Error deleted successfully
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User does not have admin role or IP not whitelisted
- `404 Not Found` - Error log not found
- `500 Internal Server Error` - Server error

---

### POST /errors/admin/cleanup

Clean up old error logs (admin only).

**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "olderThanDays": 30
}
```

**Response:**
```json
{
  "success": true,
  "deletedCount": 1523,
  "message": "Deleted 1523 error logs older than 30 days"
}
```

**Status Codes:**
- `200 OK` - Cleanup completed successfully
- `400 Bad Request` - Invalid request body
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User does not have admin role or IP not whitelisted
- `500 Internal Server Error` - Server error

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "Invalid query parameters",
  "details": {
    "field": "limit",
    "message": "Limit must be between 1 and 100"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

or

```json
{
  "error": "IP address not whitelisted"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Error description"
}
```

---

### GET /system/rate-limits

Get rate limit violation statistics (admin only).

**Authentication:** Required (Admin role)

**Query Parameters:**
- `hours` (optional, default: 24) - Number of hours to look back

**Response:**
```json
{
  "violations": [
    {
      "endpoint": "POST:/api/proposals",
      "totalViolations": 45,
      "uniqueIdentifiers": 12,
      "avgTokensRequested": 1.2
    }
  ],
  "timestamp": "2025-12-18T12:00:00.000Z"
}
```

**Status Codes:**
- `200 OK` - Successfully retrieved stats
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User does not have admin role or IP not whitelisted
- `500 Internal Server Error` - Server error

---

### GET /system/rate-limits/:identifier

Get rate limit status for a specific IP or user (admin only).

**Authentication:** Required (Admin role)

**URL Parameters:**
- `identifier` - IP address or user ID to check

**Example Request:**
```
GET /system/rate-limits/192.168.1.100
```

**Response:**
```json
{
  "identifier": "192.168.1.100",
  "limits": [
    {
      "endpoint": "GET:/api/home",
      "tokens": 45,
      "last_refill": "2025-12-18T11:59:30.000Z"
    },
    {
      "endpoint": "POST:/api/proposals",
      "tokens": 8,
      "last_refill": "2025-12-18T11:58:00.000Z"
    }
  ],
  "timestamp": "2025-12-18T12:00:00.000Z"
}
```

**Status Codes:**
- `200 OK` - Successfully retrieved rate limit status
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User does not have admin role or IP not whitelisted
- `500 Internal Server Error` - Server error

---

## Rate Limiting

All endpoints are protected by PostgreSQL-based rate limiting using a token bucket algorithm. Rate limits are enforced per endpoint and identifier (IP address).

### Rate Limit Configuration

See the main API documentation for a complete list of rate limits by endpoint. Admin endpoints have moderate rate limits:
- `GET /system/rate-limits`: 30 requests per minute
- `GET /system/rate-limits/:identifier`: 30 requests per minute
- `GET /errors/admin`: 60 requests per minute
- `DELETE /errors/admin/:id`: 30 requests per minute
- `DELETE /errors/admin/cleanup`: 10 requests per minute

### Rate Limit Headers

All responses include standard rate limit headers:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Unix timestamp when limit resets

### Monitoring Rate Limits

Admins can monitor rate limit violations using:
1. `GET /system/rate-limits` - View violation statistics
2. `GET /system/rate-limits/:identifier` - Check specific IP/user status
3. Error logs - Rate limit violations are logged to the `error_logs` table with `error_type: 'rate_limit_exceeded'`

---

## Security Notes

1. **IP Whitelist:** Admin endpoints check the request IP against the `ADMIN_WHITELISTED_IPS` environment variable
2. **JWT Validation:** All admin endpoints validate the JWT token and check the user's role
3. **Input Sanitization:** All inputs are validated and sanitized before processing
4. **RLS Enforcement:** Database operations respect Row Level Security policies
5. **HTTPS Only:** In production, all endpoints should be accessed via HTTPS

---

## Configuration

### Environment Variables

```bash
# Admin IP whitelist (comma-separated)
ADMIN_WHITELISTED_IPS=127.0.0.1,::1,YOUR_IP_ADDRESS

# Supabase configuration
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Testing

### Test System Health
```bash
curl http://localhost:3001/api/system/health
```

### Test Admin Access
```bash
# Get JWT token from Supabase
TOKEN="your-jwt-token"

# Get admin errors
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/errors/admin?limit=10"
```

### Log a Test Error
```bash
curl -X POST http://localhost:3001/api/errors/log \
  -H "Content-Type: application/json" \
  -d '{
    "source": "frontend",
    "severity": "info",
    "error_type": "TEST",
    "message": "Test error log"
  }'
```
