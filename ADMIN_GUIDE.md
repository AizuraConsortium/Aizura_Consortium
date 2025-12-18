# Admin Portal User Guide

Complete guide for using the Aizura Consortium Admin Portal.

## Table of Contents

1. [Overview](#overview)
2. [Initial Setup](#initial-setup)
3. [Accessing the Admin Portal](#accessing-the-admin-portal)
4. [Dashboard Overview](#dashboard-overview)
5. [Error Monitor](#error-monitor)
6. [System Health Badge](#system-health-badge)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

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
