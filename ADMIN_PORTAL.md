# Admin Portal Documentation

Complete guide and API reference for the Aizura Consortium Admin Portal.

## Table of Contents

**Part 1: User Guide**
1. [Overview](#overview)
2. [Initial Setup](#initial-setup)
3. [Accessing the Admin Portal](#accessing-the-admin-portal)
4. [Dashboard Overview](#dashboard-overview)
5. [Error Monitor](#error-monitor)
6. [System Health Badge](#system-health-badge)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

**Part 2: API Reference**
9. [API Authentication](#api-authentication)
10. [Public System Endpoints](#public-system-endpoints)
11. [Admin Endpoints](#admin-endpoints)
12. [Rate Limiting](#rate-limiting)
13. [Security Notes](#security-notes)
14. [Testing](#testing)

---

# Part 1: User Guide

## Overview

The Admin Portal provides comprehensive monitoring and management capabilities for the Aizura Consortium system:

- Real-time system health monitoring
- Error log management and analysis
- Advanced filtering and search
- Historical data tracking
- Security audit trails

---

## Initial Setup

### 1. Create Admin User

First, create a user in Supabase Auth Dashboard:

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User"
3. Enter email and password
4. Save the user ID (you'll need it for the next step)

### 2. Assign Admin Role

Run this SQL in the Supabase SQL Editor:

```sql
INSERT INTO users (auth_user_id, email, role)
VALUES (
  'USER_ID_FROM_STEP_1',
  'admin@example.com',
  'admin'
)
ON CONFLICT (auth_user_id)
DO UPDATE SET role = 'admin';
```

### 3. Configure IP Whitelist

Add your IP address to the whitelist in `.env`:

```bash
ADMIN_WHITELISTED_IPS=127.0.0.1,::1,YOUR_IP_ADDRESS
```

To find your IP address:
```bash
# On Linux/Mac
curl ifconfig.me

# Or check whatismyip.com
```

### 4. Restart Server

After updating `.env`, restart the backend server:

```bash
npm run dev:backend
```

---

## Accessing the Admin Portal

### Login

1. Navigate to `/admin/login`
2. Enter your admin email and password
3. Click "Sign In"

**Security Notes:**
- Your session will remain active until you sign out
- The system automatically validates your admin role
- If your role is revoked, you'll be logged out on the next request

### Sign Out

Click the "Sign Out" button in the top navigation bar to end your session.

---

## Dashboard Overview

The main dashboard (`/admin/dashboard`) shows:

### System Status Cards

**System Status**
- Overall health: Healthy, Degraded, or Unhealthy
- Color-coded for quick recognition
- Updates automatically every 30 seconds

**Uptime**
- System uptime percentage over the last 24 hours
- Calculated from successful health checks

**Errors (24h)**
- Total number of errors logged in the last 24 hours
- Click to view detailed breakdown

**Database Status**
- Database connection health
- Real-time connectivity check

### Error Breakdown

Displays errors grouped by severity:

- **Info** (Blue) - Informational messages
- **Warning** (Yellow) - Potential issues that need attention
- **Error** (Orange) - Errors that affected functionality
- **Critical** (Red) - Severe errors requiring immediate action

### Quick Actions

**Error Monitor**
- View and manage all error logs
- Advanced filtering capabilities
- Export and analysis tools

**System Logs** (Coming Soon)
- Detailed system activity logs
- Audit trail for admin actions

---

## Error Monitor

The Error Monitor (`/admin/errors`) is the primary tool for investigating and managing system errors.

### Main Features

#### Error Table

The table displays all error logs with the following columns:

- **Severity** - Color-coded badge (Info/Warning/Error/Critical)
- **Source** - Where the error originated (Frontend/Backend/Agent)
- **Type** - Error category or type
- **Message** - Brief error description
- **Agent** - AI agent involved (if applicable)
- **Time** - When the error occurred
- **Actions** - Delete button

#### Viewing Error Details

Click on any row in the table to open a detailed modal showing:

- Complete error information
- Full error message
- Detailed metadata (JSON format)
- Associated topic or agent
- Timestamps

#### Filtering Errors

Click the "Filters" button to access advanced filtering:

**Available Filters:**
- **Source**: Frontend, Backend, or Agent
- **Severity**: Info, Warning, Error, or Critical
- **Agent ID**: Filter by specific AI agent (e.g., "claude", "gpt-4")
- **Start Date**: Show errors after this date
- **End Date**: Show errors before this date

**Using Filters:**
1. Click "Filters" button
2. Select your filter criteria
3. Filters apply automatically
4. Click "Clear all" to reset filters

Active filters are indicated with a blue badge on the Filters button.

#### Pagination

- Default: 50 errors per page
- Use Previous/Next buttons to navigate
- Shows current range and total count
- Example: "Showing 1-50 of 235 errors"

#### Actions

**Refresh**
- Click the Refresh button to reload error data
- Automatically refreshes when filters change

**Delete Error**
- Click the trash icon on any row
- Confirm the deletion in the popup
- Error is permanently removed

**Export Error Details**
- Open error details modal
- Click "Copy JSON" button
- Paste into your analysis tools

### Use Cases

#### Investigate Recent Issues

1. Go to Error Monitor
2. Set Start Date to today
3. Filter by Severity: Error or Critical
4. Review errors chronologically
5. Click for details on concerning errors

#### Track Agent Performance

1. Open Filters
2. Enter Agent ID (e.g., "claude")
3. Review error frequency
4. Check error types and patterns
5. Compare with other agents

#### Clean Up Old Logs

1. Use date filters to find old errors
2. Review to ensure they're resolved
3. Delete individually or use bulk cleanup (coming soon)

#### Export for Analysis

1. Filter to relevant errors
2. Open each error detail
3. Click "Copy JSON"
4. Import into your analysis tool
5. Generate reports or charts

---

## System Health Badge

A system health badge appears on all public pages (bottom-right corner).

### Features

**Status Indicator**
- Green: System Operational
- Yellow: System Degraded
- Red: Issues Detected
- Gray: Status Unknown

**Click to Expand**
- Click badge to view details
- Shows uptime percentage
- Displays recent errors
- Error count by severity

**Auto-Refresh**
- Updates every 60 seconds
- Real-time status information
- Recent events logged

### Public Visibility

The health badge is visible to all users (no authentication required) to provide transparency about system status.

---

## Best Practices

### Daily Monitoring

1. Check dashboard each morning
2. Review error breakdown trends
3. Investigate any critical errors
4. Clean up resolved issues

### Error Management

**Do:**
- Review new errors daily
- Investigate patterns, not just individual errors
- Delete errors after they're resolved
- Document recurring issues
- Use filters to focus on priority items

**Don't:**
- Ignore critical errors
- Delete errors without review
- Let error logs grow indefinitely
- Mix multiple investigations (use filters)

### Security

1. Never share admin credentials
2. Sign out after each session
3. Regularly update IP whitelist
4. Review database access logs
5. Use strong, unique passwords

### Performance

- Regular cleanup of old logs (older than 30 days)
- Monitor database size
- Archive important errors before deletion
- Use pagination for large datasets

---

## Troubleshooting

### Cannot Login

**Error: "Access denied. Admin privileges required."**

**Solution:**
1. Verify your user has the `admin` role in the `users` table:
   ```sql
   SELECT * FROM users WHERE email = 'your-email@example.com';
   ```
2. If role is missing or incorrect, update it:
   ```sql
   UPDATE users
   SET role = 'admin'
   WHERE email = 'your-email@example.com';
   ```

**Error: "IP address not whitelisted"**

**Solution:**
1. Add your IP to `.env` file:
   ```bash
   ADMIN_WHITELISTED_IPS=127.0.0.1,::1,YOUR_IP
   ```
2. Restart the backend server
3. Verify IP in backend logs

### Dashboard Not Loading

**Symptoms:**
- Blank dashboard
- Loading spinner indefinitely
- Error messages

**Solutions:**

1. **Check Backend Server**
   ```bash
   # Ensure backend is running
   npm run dev:backend
   ```

2. **Verify Database Connection**
   - Check Supabase dashboard
   - Test database connectivity
   - Review connection logs

3. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for error messages
   - Check Network tab for failed requests

4. **Clear Cache**
   - Hard refresh (Ctrl+F5 or Cmd+Shift+R)
   - Clear browser cache
   - Try incognito/private mode

### Errors Not Appearing

**Problem:** Error Monitor shows no errors

**Solutions:**

1. **Check Filters**
   - Clear all active filters
   - Verify date range
   - Reset to default view

2. **Verify RLS Policies**
   ```sql
   -- Check error_logs policies
   SELECT * FROM pg_policies
   WHERE tablename = 'error_logs';
   ```

3. **Check Server-Side RBAC**
   - Verify middleware is active
   - Check backend logs for role checks
   - Test with public error endpoint

### Session Expires Unexpectedly

**Problem:** Logged out without signing out

**Causes:**
- JWT token expired (default: 1 hour)
- Role changed in database
- IP changed (if strict whitelist)

**Solutions:**
1. Sign in again
2. For longer sessions, adjust Supabase JWT expiry
3. Update IP whitelist if your IP changed

### Performance Issues

**Symptoms:**
- Slow loading
- Timeouts
- High memory usage

**Solutions:**

1. **Reduce Data Returned**
   - Use pagination (lower limit)
   - Apply date filters
   - Narrow severity filters

2. **Clean Up Old Data**
   - Delete errors older than 30 days
   - Archive important historical data
   - Optimize database indexes

3. **Check Database Performance**
   - Monitor Supabase dashboard
   - Review slow query logs
   - Check connection pool

---

## Support

For issues not covered in this guide:

1. Check backend logs for detailed error messages
2. Review database logs in Supabase dashboard
3. Test with API documentation examples
4. Verify all environment variables are set correctly

---

## Advanced Features (Coming Soon)

- Bulk error operations
- Custom alert rules
- Email notifications for critical errors
- System log viewer
- User management interface
- API rate limiting dashboard
- Performance analytics
- Export reports (PDF/CSV)

---

# Part 2: API Reference

## API Authentication

All admin endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

The token is obtained through Supabase authentication. Admin users must have the `admin` role in the `users` table.

### Base URL

```
http://localhost:3001/api
```

In production, replace with your deployed API URL.

---

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

## Rate Limiting

All endpoints are protected by PostgreSQL-based rate limiting using a token bucket algorithm. Rate limits are enforced per endpoint and identifier (IP address).

### Rate Limit Configuration

Admin endpoints have moderate rate limits:
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

---

**Document Version:** 1.0
**Last Updated:** 2025-12-19
**Owner:** Admin & Operations Team
