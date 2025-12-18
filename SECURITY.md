# Security Architecture

Security approach and implementation details for the Aizura Consortium Admin System.

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Authorization](#authorization)
4. [Network Security](#network-security)
5. [Data Security](#data-security)
6. [Input Validation](#input-validation)
7. [Security Audit](#security-audit)
8. [Best Practices](#best-practices)

---

## Overview

The admin system implements multiple layers of security:

1. **Authentication** - JWT-based token validation via Supabase
2. **Authorization** - Role-based access control (RBAC)
3. **Network Security** - IP whitelisting for admin endpoints
4. **Data Security** - Row Level Security (RLS) in Supabase
5. **Input Validation** - Comprehensive sanitization and validation

All security controls are enforced at multiple levels:
- Database (RLS policies)
- Backend (middleware & validation)
- Frontend (UI restrictions)

---

## Authentication

### JWT Token Validation

**Implementation:**
- All admin endpoints validate JWT tokens from Supabase
- Tokens are verified for signature, expiration, and issuer
- Token is extracted from `Authorization: Bearer <token>` header

**Location:** `backend/src/middleware/auth.ts`

```typescript
// Validates JWT token and extracts user info
export async function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = user;
  next();
}
```

**Security Features:**
- Automatic token expiration (configurable in Supabase)
- Token refresh capability
- Secure token storage (httpOnly cookies recommended for production)
- Token revocation support

### User Management

Users are managed in two places:

1. **Supabase Auth** - Authentication credentials
2. **users table** - Role information

**Database Schema:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'client')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Authorization

### Role-Based Access Control (RBAC)

**Implementation:**
Two-layer RBAC system:

1. **Database RLS** - Enforced at the database level
2. **Middleware RBAC** - Enforced at the API level

#### Database RLS

**Location:** `supabase/migrations/20251218135146_update_error_logs_rls_for_server_rbac.sql`

```sql
-- Admin-only access policy
CREATE POLICY "Admins can read all error logs via server"
  ON error_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_user_id = auth.uid()
      AND users.role = 'admin'
    )
  );
```

**Advantages:**
- Security enforced at lowest level
- Protection even if application logic fails
- Auditable via database logs
- Cannot be bypassed

#### Middleware RBAC

**Location:** `backend/src/middleware/rbac.ts`

```typescript
export async function requireAdmin(req, res, next) {
  const role = await getUserRole(req.user.id);

  if (role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
}
```

**Applied to routes:**
```typescript
router.get('/errors/admin', authenticateToken, requireAdmin, ...);
router.delete('/errors/admin/:id', authenticateToken, requireAdmin, ...);
```

### Role Utility Functions

**Location:** `backend/src/utils/roleChecks.ts`

Centralized role checking functions:
- `getUserRole(userId)` - Get user's role from database
- `isAdmin(userId)` - Check if user is admin
- `isClient(userId)` - Check if user is client

**Caching:**
- Role checks are cached per request
- Reduces database queries
- Automatic cache invalidation

---

## Network Security

### IP Whitelisting

**Purpose:**
Restrict admin endpoint access to trusted IP addresses.

**Implementation:**
**Location:** `backend/src/middleware/ipWhitelist.ts`

```typescript
export function requireWhitelistedIP(req, res, next) {
  const clientIP = getClientIP(req);
  const whitelistedIPs = (process.env.ADMIN_WHITELISTED_IPS || '').split(',');

  if (!whitelistedIPs.includes(clientIP)) {
    return res.status(403).json({ error: 'IP address not whitelisted' });
  }

  next();
}
```

**Configuration:**
```bash
# .env file
ADMIN_WHITELISTED_IPS=127.0.0.1,::1,YOUR_OFFICE_IP,YOUR_HOME_IP
```

**Best Practices:**
1. Use specific IPs, not ranges (for now)
2. Keep list minimal
3. Document each IP's purpose
4. Regular audit of whitelist
5. Remove unused IPs immediately

**Limitations:**
- Not effective against VPN bypass
- Can break with dynamic IPs
- Should be combined with other controls

### HTTPS/TLS

**Production Requirements:**
- ALL traffic must use HTTPS
- TLS 1.2 or higher
- Valid SSL certificates
- HTTP Strict Transport Security (HSTS) headers

**Recommended Headers:**
```javascript
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

---

## Data Security

### Row Level Security (RLS)

RLS policies enforce data access at the database level.

#### Error Logs Table

**Policies:**

1. **Public Insert**
   ```sql
   CREATE POLICY "Anyone can insert error logs"
     ON error_logs FOR INSERT
     WITH CHECK (true);
   ```
   Allows error logging from any source (frontend, backend, agents).

2. **Admin Read**
   ```sql
   CREATE POLICY "Admins can read all error logs via server"
     ON error_logs FOR SELECT
     TO authenticated
     USING (
       EXISTS (
         SELECT 1 FROM users
         WHERE users.auth_user_id = auth.uid()
         AND users.role = 'admin'
       )
     );
   ```
   Only admins can read error logs.

3. **Admin Delete**
   ```sql
   CREATE POLICY "Admins can delete error logs via server"
     ON error_logs FOR DELETE
     TO authenticated
     USING (
       EXISTS (
         SELECT 1 FROM users
         WHERE users.auth_user_id = auth.uid()
         AND users.role = 'admin'
       )
     );
   ```
   Only admins can delete error logs.

#### Users Table

**Policies:**

1. **Users can read own data**
   ```sql
   CREATE POLICY "Users can read own data"
     ON users FOR SELECT
     TO authenticated
     USING (auth.uid() = auth_user_id);
   ```

2. **No public modifications**
   - Users cannot update their own roles
   - Only database admins can modify roles
   - Prevents privilege escalation

### Data Encryption

**At Rest:**
- Supabase encrypts all data at rest
- AES-256 encryption
- Encrypted backups

**In Transit:**
- TLS 1.2+ for all connections
- Database connections encrypted
- API calls over HTTPS

### Sensitive Data Handling

**Error Details:**
- No passwords or secrets in error logs
- Stack traces sanitized in production
- PII excluded from error details

**JWT Tokens:**
- Never logged
- Not stored in database
- Short expiration (1 hour default)
- Refresh token rotation

---

## Input Validation

### Request Validation

**Location:** `backend/src/middleware/validation.ts`

All inputs are validated before processing:

**Query Parameters:**
- Type validation (string, number, date)
- Range checking (min/max)
- Allowed values (enums)

**Implementation:**
```typescript
export function validateQueryParams(req, res, next) {
  const errors = [];

  // Validate limit
  if (req.query.limit) {
    const limit = parseInt(req.query.limit);
    if (isNaN(limit) || limit < 1 || limit > 100) {
      errors.push({ field: 'limit', message: 'Must be 1-100' });
    }
  }

  // Validate severity
  if (req.query.severity) {
    const validSeverities = ['info', 'warning', 'error', 'critical'];
    if (!validSeverities.includes(req.query.severity)) {
      errors.push({ field: 'severity', message: 'Invalid severity' });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
}
```

### SQL Injection Prevention

**Protection Mechanisms:**
1. **Parameterized Queries** - All database queries use parameters
2. **ORM/Query Builder** - Supabase client handles escaping
3. **Type Validation** - Strict type checking before queries

**Example:**
```typescript
// SECURE - Parameterized
const { data } = await supabase
  .from('error_logs')
  .select('*')
  .eq('severity', userInput);

// INSECURE - Never do this
const query = `SELECT * FROM error_logs WHERE severity = '${userInput}'`;
```

### XSS Prevention

**Frontend:**
- React auto-escapes by default
- DOMPurify for user-generated content
- Content Security Policy headers

**Backend:**
- Sanitize all outputs
- Escape HTML in error messages
- Validate content types

### Data Sanitization

**Location:** `backend/src/services/errorLogger.ts`

```typescript
function sanitizeErrorDetails(details: any): any {
  // Remove sensitive fields
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization'];

  const sanitized = { ...details };

  for (const key of sensitiveKeys) {
    if (key in sanitized) {
      sanitized[key] = '[REDACTED]';
    }
  }

  return sanitized;
}
```

---

## Security Audit

### Regular Checks

**Weekly:**
1. Review admin access logs
2. Check for failed login attempts
3. Audit IP whitelist
4. Review recent errors for security issues

**Monthly:**
1. Update dependencies (`npm audit`)
2. Review RLS policies
3. Check Supabase dashboard for anomalies
4. Test authentication flows

**Quarterly:**
1. Full security audit
2. Penetration testing
3. Review and rotate secrets
4. Update security documentation

### Monitoring

**Key Metrics:**
- Failed authentication attempts
- Admin access frequency
- Error rates by severity
- Database connection failures
- Unusual query patterns

**Alerts:**
Set up alerts for:
- Multiple failed login attempts
- Admin access from new IPs
- Critical errors
- Database connection issues
- Unusual error spikes

### Logging

**What to Log:**
- All admin actions
- Authentication attempts (success and failure)
- Authorization failures
- IP address changes
- Role changes
- Error deletions

**What NOT to Log:**
- Passwords
- JWT tokens
- Sensitive user data
- Full stack traces with secrets

---

## Best Practices

### Development

1. **Never commit secrets**
   - Use `.env` files
   - Add `.env` to `.gitignore`
   - Use environment variables

2. **Test security controls**
   - Test auth with invalid tokens
   - Test RBAC with different roles
   - Test IP whitelist restrictions

3. **Code reviews**
   - Review all security-related changes
   - Check for hardcoded secrets
   - Verify input validation

### Production

1. **Use HTTPS only**
   - Enforce TLS 1.2+
   - Use HSTS headers
   - Valid SSL certificates

2. **Secure environment**
   - Rotate secrets regularly
   - Limit database access
   - Use read-only replicas where possible

3. **Monitor and alert**
   - Set up monitoring
   - Configure alerts
   - Regular log reviews

4. **Incident response**
   - Document procedures
   - Regular testing
   - Communication plan

### User Management

1. **Principle of Least Privilege**
   - Grant minimum necessary permissions
   - Regular access reviews
   - Remove unused accounts

2. **Strong passwords**
   - Enforce password complexity
   - Use password managers
   - Enable MFA (when available)

3. **Access reviews**
   - Quarterly admin list review
   - Remove terminated users immediately
   - Audit access logs

---

## Security Checklist

### Before Deployment

- [ ] All secrets in environment variables
- [ ] IP whitelist configured
- [ ] HTTPS/TLS enabled
- [ ] Security headers configured
- [ ] RLS policies tested
- [ ] Admin users created
- [ ] Error logging tested
- [ ] Input validation verified
- [ ] Dependencies updated
- [ ] Security audit completed

### Post-Deployment

- [ ] Test authentication
- [ ] Test authorization
- [ ] Verify IP whitelist
- [ ] Check error logging
- [ ] Monitor system health
- [ ] Review access logs
- [ ] Set up alerts
- [ ] Document admin procedures

---

## Vulnerability Reporting

If you discover a security vulnerability:

1. **Do not** create a public issue
2. Email security details to admin
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if known)

We'll respond within 48 hours and work with you to resolve the issue.

---

## Compliance

### Data Protection

- User data encrypted at rest and in transit
- Regular backups
- Data retention policies
- Right to deletion supported

### Audit Trail

- All admin actions logged
- Logs retained for 90 days
- Logs are immutable
- Regular audit reviews

---

## Updates

This security document should be reviewed and updated:
- After any security-related changes
- Quarterly as part of security audit
- When new threats are identified
- After security incidents

Last Updated: 2025-12-18
