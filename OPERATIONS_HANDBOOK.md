# Operations Handbook

Comprehensive operational guide for running and maintaining the Aizura Consortium platform in production.

## Table of Contents

1. [Daily Operations](#daily-operations)
2. [Monitoring](#monitoring)
3. [Common Tasks](#common-tasks)
4. [Troubleshooting](#troubleshooting)
5. [Maintenance](#maintenance)
6. [Runbooks](#runbooks)
7. [Security Architecture](#security-architecture)
8. [Rate Limiting](#rate-limiting)
9. [Disaster Recovery](#disaster-recovery)
10. [Best Practices](#best-practices)

---

# Daily Operations

## Morning Health Check

Perform these checks at the start of each day:

```bash
# 1. Check system health
curl https://aizura.yourdomain.com/api/system/health

# Expected response:
# {
#   "status": "healthy",
#   "uptime": 99.9,
#   "errors": {...},
#   "database": {"connected": true},
#   "orchestrator": {"status": "running", "isLeader": true}
# }

# 2. Check orchestrator specifically
curl https://aizura.yourdomain.com/health/orchestrator

# 3. Check pod status
kubectl get pods -n aizura-consortium

# Expected: All pods in "Running" state with "1/1" ready

# 4. Check recent errors (via admin dashboard)
# Navigate to: https://aizura.yourdomain.com/admin/errors
# Review any critical or error-level logs from last 24 hours
```

## End of Day Review

Before ending your shift:

1. **Review metrics:**
   - Check admin dashboard for unusual activity
   - Review error logs for patterns
   - Check rate limit violations

2. **Check ongoing debates:**
   ```bash
   curl https://aizura.yourdomain.com/api/topics/current
   ```

3. **Verify backups:**
   - Check Supabase dashboard for successful daily backup
   - Verify backup completed without errors

4. **Document issues:**
   - Log any incidents or unusual behavior
   - Update runbooks if new patterns emerge
   - Notify next shift of ongoing issues

---

# Monitoring

## Health Endpoints

| Endpoint | Purpose | Expected Response Time | Alert Threshold |
|----------|---------|------------------------|-----------------|
| `/health` | Basic server health | <100ms | >500ms or 5xx |
| `/api/system/health` | Detailed system health | <500ms | >2s or unhealthy status |
| `/health/orchestrator` | Orchestrator status | <100ms | >500ms or not_initialized |

## Monitoring Checklist

### Every Hour
- [ ] Check pod status (all running)
- [ ] Monitor resource usage (memory, CPU)
- [ ] Review recent errors in admin dashboard

### Every 4 Hours
- [ ] Check system health endpoint
- [ ] Review orchestrator status
- [ ] Check for rate limit violations
- [ ] Monitor debate progress

### Daily
- [ ] Review error trends
- [ ] Check backup completion
- [ ] Review rate limit patterns
- [ ] Check for security alerts

### Weekly
- [ ] Review resource trends
- [ ] Check for memory leaks
- [ ] Review agent performance
- [ ] Update documentation

## Key Metrics to Watch

| Metric | Healthy Range | Warning | Critical |
|--------|---------------|---------|----------|
| Pod CPU Usage | <50% | 50-80% | >80% |
| Pod Memory Usage | <60% | 60-80% | >80% |
| Error Rate (24h) | <10 | 10-50 | >50 |
| Critical Errors (24h) | 0 | 1-5 | >5 |
| Database Response Time | <100ms | 100-500ms | >500ms |
| Orchestrator Tick Duration | <30s | 30-60s | >60s |

## Dashboard Access

**Admin Dashboard:**
- URL: `https://aizura.yourdomain.com/admin`
- Requires: Admin account with whitelisted IP
- Features:
  - Error monitoring
  - Rate limit tracking
  - System health overview

**Supabase Dashboard:**
- URL: `https://app.supabase.com/project/<project-id>`
- Requires: Supabase account
- Features:
  - Database monitoring
  - Query performance
  - Backup status
  - Auth logs

**Kubernetes Dashboard (if deployed):**
- Access via kubectl proxy
- Features:
  - Pod status
  - Resource usage
  - Logs viewing

---

# Common Tasks

## Restarting Services

### Restart Backend (Orchestrator)
```bash
# Graceful restart (zero downtime with multiple replicas)
kubectl rollout restart deployment/aizura-backend -n aizura-consortium

# Check rollout status
kubectl rollout status deployment/aizura-backend -n aizura-consortium

# Verify orchestrator restarted
kubectl logs -n aizura-consortium deployment/aizura-backend --tail=50 | grep "Orchestrator"
```

### Restart Frontend
```bash
# Graceful restart
kubectl rollout restart deployment/aizura-frontend -n aizura-consortium

# Check rollout status
kubectl rollout status deployment/aizura-frontend -n aizura-consortium

# Verify frontend is accessible
curl -I https://aizura.yourdomain.com/
```

### Restart All Services
```bash
# Restart everything (use for major updates)
kubectl rollout restart deployment/aizura-backend -n aizura-consortium
kubectl rollout restart deployment/aizura-frontend -n aizura-consortium

# Wait for completion
kubectl rollout status deployment/aizura-backend -n aizura-consortium
kubectl rollout status deployment/aizura-frontend -n aizura-consortium
```

## Scaling Services

### Scale Backend
```bash
# Scale to 5 replicas
kubectl scale deployment aizura-backend --replicas=5 -n aizura-consortium

# Verify scaling
kubectl get pods -n aizura-consortium | grep backend

# Check HPA (if configured)
kubectl get hpa -n aizura-consortium
```

### Scale Frontend
```bash
# Scale to 10 replicas
kubectl scale deployment aizura-frontend --replicas=10 -n aizura-consortium

# Verify scaling
kubectl get pods -n aizura-consortium | grep frontend
```

## Viewing Logs

### Real-time Logs
```bash
# Backend logs (follow mode)
kubectl logs -f -n aizura-consortium deployment/aizura-backend

# Frontend logs (follow mode)
kubectl logs -f -n aizura-consortium deployment/aizura-frontend

# Specific pod logs
kubectl logs -f -n aizura-consortium <pod-name>

# Multiple pods (requires stern or kubetail)
kubectl logs -f -n aizura-consortium -l app=aizura-backend
```

### Historical Logs
```bash
# Last 100 lines
kubectl logs -n aizura-consortium deployment/aizura-backend --tail=100

# Last hour
kubectl logs -n aizura-consortium deployment/aizura-backend --since=1h

# Previous pod instance (after crash)
kubectl logs -n aizura-consortium <pod-name> --previous
```

### Search Logs
```bash
# Search for errors
kubectl logs -n aizura-consortium deployment/aizura-backend --tail=1000 | grep -i error

# Search for specific proposal
kubectl logs -n aizura-consortium deployment/aizura-backend | grep "proposal_123"

# Count error occurrences
kubectl logs -n aizura-consortium deployment/aizura-backend --tail=10000 | grep -c "ERROR"
```

## Updating Configuration

### Update Environment Variables
```bash
# Edit configmap (if using)
kubectl edit configmap aizura-config -n aizura-consortium

# Update and restart
kubectl rollout restart deployment/aizura-backend -n aizura-consortium
```

### Update Secrets
```bash
# Method 1: Edit existing secret
kubectl edit secret aizura-secrets -n aizura-consortium
# (Values are base64 encoded)

# Method 2: Replace secret
kubectl delete secret aizura-secrets -n aizura-consortium
kubectl create secret generic aizura-secrets \
  --from-literal=supabase-url="NEW_VALUE" \
  # ... other secrets
  -n aizura-consortium

# Restart to pick up new secrets
kubectl rollout restart deployment/aizura-backend -n aizura-consortium
```

### Update Kubernetes Manifests
```bash
# Edit manifests locally
vim manifests.prod.yaml

# Apply changes
kubectl apply -f manifests.prod.yaml

# Verify changes applied
kubectl get deployment aizura-backend -n aizura-consortium -o yaml
```

## Database Operations

### Check Database Connection
```bash
# Via health endpoint
curl https://aizura.yourdomain.com/health

# Via Supabase dashboard
# Navigate to: Database → Database Settings → Connection Info
```

### Run Database Query
```sql
-- Via Supabase SQL Editor

-- Check recent proposals
SELECT id, title, status, created_at
FROM proposals
ORDER BY created_at DESC
LIMIT 10;

-- Check active topics
SELECT * FROM topics WHERE state = 'active';

-- Check orchestrator lock
SELECT * FROM orchestrator_lock;

-- Check recent errors
SELECT severity, message, created_at
FROM error_logs
ORDER BY created_at DESC
LIMIT 20;
```

### Database Maintenance
```sql
-- Analyze tables for query optimization
ANALYZE proposals;
ANALYZE messages;
ANALYZE topics;

-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check for slow queries (via Supabase dashboard)
-- Navigate to: Database → Query Performance
```

## Certificate Management

### Check TLS Certificate
```bash
# Check certificate expiration
echo | openssl s_client -servername aizura.yourdomain.com -connect aizura.yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates

# Check certificate details
kubectl get certificate -n aizura-consortium
kubectl describe certificate aizura-tls -n aizura-consortium
```

### Renew Certificate (Let's Encrypt)
```bash
# Cert-manager handles automatic renewal
# Check cert-manager logs if issues
kubectl logs -n cert-manager deployment/cert-manager

# Force renewal if needed
kubectl delete certificate aizura-tls -n aizura-consortium
# Cert-manager will automatically recreate
```

---

# Troubleshooting

## Pods Not Starting

**Symptoms:**
- Pod status: CrashLoopBackOff, Error, or Pending
- Services not responding

**Diagnosis:**
```bash
# Check pod status
kubectl get pods -n aizura-consortium

# Describe problematic pod
kubectl describe pod <pod-name> -n aizura-consortium

# Check logs
kubectl logs <pod-name> -n aizura-consortium
kubectl logs <pod-name> -n aizura-consortium --previous
```

**Common Causes:**

1. **Missing Secrets:**
   ```bash
   # Verify secrets exist
   kubectl get secrets -n aizura-consortium

   # Recreate if missing
   kubectl create secret generic aizura-secrets # ...
   ```

2. **Image Pull Errors:**
   ```bash
   # Check image exists
   docker pull ghcr.io/your-org/aizura-backend:latest

   # Verify imagePullSecrets if using private registry
   kubectl get secret ghcr-secret -n aizura-consortium
   ```

3. **Resource Constraints:**
   ```bash
   # Check node resources
   kubectl top nodes

   # Check pod resource requests
   kubectl describe pod <pod-name> -n aizura-consortium | grep -A5 Resources
   ```

4. **Configuration Errors:**
   ```bash
   # Check environment variables
   kubectl exec -it <pod-name> -n aizura-consortium -- env

   # Verify secrets are mounted
   kubectl exec -it <pod-name> -n aizura-consortium -- ls /etc/secrets
   ```

## Database Connection Issues

**Symptoms:**
- "Failed to connect to database" errors
- Health check shows database unhealthy
- Supabase timeout errors

**Diagnosis:**
```bash
# Test from pod
kubectl exec -it <backend-pod> -n aizura-consortium -- sh
curl -v $SUPABASE_URL/rest/v1/

# Check Supabase status
# Visit: https://status.supabase.com/
```

**Solutions:**

1. **Verify Credentials:**
   ```bash
   # Check secrets are correct
   kubectl get secret aizura-secrets -n aizura-consortium -o jsonpath='{.data.supabase-url}' | base64 -d
   ```

2. **Check Network:**
   ```bash
   # DNS resolution
   kubectl exec -it <pod> -n aizura-consortium -- nslookup supabase.co

   # Network policies
   kubectl get networkpolicies -n aizura-consortium
   ```

3. **Supabase Project Issues:**
   - Check Supabase dashboard for project status
   - Verify project is not paused
   - Check for billing issues

## Orchestrator Not Running

**Symptoms:**
- Debates not progressing
- No agent messages
- Health check shows "not_initialized" or "standby"

**Diagnosis:**
```bash
# Check orchestrator status
curl https://aizura.yourdomain.com/health/orchestrator

# Check backend logs
kubectl logs -n aizura-consortium deployment/aizura-backend | grep -i orchestrator
```

**Common Issues:**

1. **Lock Contention:**
   ```sql
   -- Check orchestrator lock in Supabase
   SELECT * FROM orchestrator_lock;

   -- If lock is stale, clear it
   DELETE FROM orchestrator_lock WHERE expires_at < NOW();
   ```

2. **No Active Topic:**
   ```sql
   -- Check for active topics
   SELECT * FROM topics WHERE state = 'active';

   -- Orchestrator enters idle mode if no active topic
   ```

3. **Multiple Instances:**
   ```bash
   # Only one instance should be leader
   kubectl logs -n aizura-consortium deployment/aizura-backend | grep "LEADER"

   # Other instances should be in standby
   kubectl logs -n aizura-consortium deployment/aizura-backend | grep "standby"
   ```

**Solution:**
```bash
# Restart backend to reset orchestrator
kubectl rollout restart deployment/aizura-backend -n aizura-consortium

# Verify orchestrator started
kubectl logs -n aizura-consortium deployment/aizura-backend -f | grep "Orchestrator"
```

## High Error Rate

**Symptoms:**
- Admin dashboard shows many errors
- System health shows "degraded" or "unhealthy"

**Diagnosis:**
```bash
# Check error logs via API
curl https://aizura.yourdomain.com/api/errors

# Or via admin dashboard
# Navigate to: https://aizura.yourdomain.com/admin/errors

# Check specific error types
kubectl logs -n aizura-consortium deployment/aizura-backend | grep "ERROR\|CRITICAL"
```

**Actions:**

1. **Identify Error Pattern:**
   - Group errors by type
   - Check for specific failing endpoints
   - Identify time when errors started

2. **Check Recent Changes:**
   ```bash
   # Check recent deployments
   kubectl rollout history deployment/aizura-backend -n aizura-consortium

   # Check recent git commits
   git log --oneline -10
   ```

3. **Rollback if Needed:**
   ```bash
   # Rollback to previous version
   kubectl rollout undo deployment/aizura-backend -n aizura-consortium
   ```

4. **Fix and Redeploy:**
   - Fix identified issue
   - Test locally
   - Deploy fix
   - Monitor error rate

## Rate Limit Violations

**Symptoms:**
- 429 Too Many Requests responses
- Rate limit dashboard shows violations
- Users report being blocked

**Diagnosis:**
```bash
# Check rate limit stats
curl https://aizura.yourdomain.com/api/system/admin/rate-limits \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Check specific identifier
curl "https://aizura.yourdomain.com/api/system/rate-limits/<identifier>" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Solutions:**

1. **Legitimate Traffic Spike:**
   ```sql
   -- Clear rate limits for specific user
   DELETE FROM rate_limits WHERE identifier = 'user_123';

   -- Or wait for automatic cleanup (runs hourly)
   ```

2. **Malicious Traffic:**
   - Identify attacking IP/user
   - Add to IP blacklist if persistent
   - Consider CloudFlare or similar WAF

3. **Adjust Limits:**
   ```typescript
   // backend/src/config/rateLimits.ts
   // Adjust limits if consistently hit by legitimate users
   ```

---

# Maintenance

## Regular Maintenance Tasks

| Task | Frequency | Duration | Procedure |
|------|-----------|----------|-----------|
| Certificate Renewal | Automatic | N/A | Cert-manager handles |
| Database Backup | Daily (automatic) | N/A | Supabase handles |
| Log Rotation | Automatic | N/A | Kubernetes handles |
| Error Log Cleanup | Daily (automatic) | N/A | Supabase cron job |
| Rate Limit Cleanup | Hourly (automatic) | N/A | Supabase cron job |
| Security Updates | Monthly | 2-4 hours | See below |
| Dependency Updates | Quarterly | 2-4 hours | See below |

## Applying Security Updates

```bash
# 1. Update dependencies
npm audit
npm audit fix

# 2. Review changes
git diff package.json package-lock.json

# 3. Test locally
npm run build
npm run typecheck
npm run lint

# 4. Commit and push
git add package.json package-lock.json
git commit -m "security: Update dependencies"
git push origin main

# 5. GitHub Actions will build and deploy
# Monitor deployment in GitHub Actions

# 6. Verify production
curl https://aizura.yourdomain.com/health
```

## Dependency Updates

```bash
# 1. Check for outdated packages
npm outdated

# 2. Update dependencies
npm update

# Or update specific package
npm install <package>@latest

# 3. Test thoroughly
npm run build
npm run typecheck
npm run lint

# 4. Test manually
npm run dev
# Navigate to app and test all features

# 5. Deploy via CI/CD
git add .
git commit -m "chore: Update dependencies"
git push origin main
```

## Database Maintenance

**Weekly:**
```sql
-- Analyze tables for query optimization
ANALYZE proposals;
ANALYZE messages;
ANALYZE topics;
ANALYZE votes;
ANALYZE agents;
```

**Monthly:**
```sql
-- Check for dead tuples (via Supabase dashboard)
-- Navigate to: Database → Query Performance

-- Review slow queries
-- Optimize indexes if needed
```

**Quarterly:**
```sql
-- Review data retention
-- Archive old completed topics if needed
-- Export historical data for analysis
```

## Planned Downtime

For major updates requiring downtime:

1. **Schedule Maintenance Window:**
   - Announce to users 1 week in advance
   - Choose low-traffic time (e.g., weekend night)
   - Estimate required downtime

2. **Preparation:**
   ```bash
   # Backup current state
   kubectl get all -n aizura-consortium -o yaml > backup-pre-maintenance.yaml

   # Test update in staging
   # ...
   ```

3. **Maintenance:**
   ```bash
   # Put system in maintenance mode (if feature exists)
   # Or temporarily scale down
   kubectl scale deployment aizura-frontend --replicas=0 -n aizura-consortium

   # Perform updates
   # ...

   # Verify
   # ...

   # Scale back up
   kubectl scale deployment aizura-frontend --replicas=3 -n aizura-consortium
   ```

4. **Post-Maintenance:**
   - Verify all services running
   - Check health endpoints
   - Monitor for issues
   - Announce completion

---

# Runbooks

## Runbook: Complete System Outage

**Priority:** P0 - Critical

**Trigger:** All services down, health checks failing

**Steps:**

1. **Assess Scope (5 minutes)**
   ```bash
   # Check all pods
   kubectl get pods -n aizura-consortium

   # Check nodes
   kubectl get nodes

   # Check ingress
   kubectl get ingress -n aizura-consortium
   ```

2. **Check Database (5 minutes)**
   ```bash
   # Test database connection
   curl https://aizura.yourdomain.com/health

   # Check Supabase status
   # Visit: https://status.supabase.com/
   ```

3. **Restart Services (10 minutes)**
   ```bash
   # Restart all deployments
   kubectl rollout restart deployment/aizura-backend -n aizura-consortium
   kubectl rollout restart deployment/aizura-frontend -n aizura-consortium

   # Wait for rollout
   kubectl rollout status deployment/aizura-backend -n aizura-consortium
   kubectl rollout status deployment/aizura-frontend -n aizura-consortium
   ```

4. **Verify Recovery (5 minutes)**
   ```bash
   # Check health
   curl https://aizura.yourdomain.com/health
   curl https://aizura.yourdomain.com/api/system/health

   # Check frontend
   curl -I https://aizura.yourdomain.com/

   # Test API
   curl https://aizura.yourdomain.com/api/proposals
   ```

5. **If Still Down:** Proceed to Disaster Recovery section

**Expected Recovery Time:** 15-30 minutes

## Runbook: Orchestrator Failure

**Priority:** P1 - High

**Trigger:** Orchestrator health check fails, debates frozen

**Steps:**

1. **Check Orchestrator Status (2 minutes)**
   ```bash
   curl https://aizura.yourdomain.com/health/orchestrator
   kubectl logs -n aizura-consortium deployment/aizura-backend --tail=100 | grep orchestrator
   ```

2. **Check Lock Status (2 minutes)**
   ```sql
   -- In Supabase SQL editor
   SELECT * FROM orchestrator_lock;
   ```

3. **Clear Stale Lock if Needed (1 minute)**
   ```sql
   DELETE FROM orchestrator_lock WHERE expires_at < NOW();
   ```

4. **Restart Backend (5 minutes)**
   ```bash
   kubectl rollout restart deployment/aizura-backend -n aizura-consortium
   kubectl rollout status deployment/aizura-backend -n aizura-consortium
   ```

5. **Verify Orchestrator Started (2 minutes)**
   ```bash
   kubectl logs -n aizura-consortium deployment/aizura-backend | grep "LEADER\|Orchestrator"
   curl https://aizura.yourdomain.com/health/orchestrator
   ```

**Expected Recovery Time:** 10-15 minutes

## Runbook: High Memory Usage

**Priority:** P2 - Medium

**Trigger:** Pod memory usage >80%

**Steps:**

1. **Identify High-Memory Pods (2 minutes)**
   ```bash
   kubectl top pods -n aizura-consortium
   kubectl describe pod <pod-name> -n aizura-consortium | grep -A5 Resources
   ```

2. **Check for Memory Leaks (5 minutes)**
   ```bash
   # Check pod age
   kubectl get pods -n aizura-consortium

   # If pod is old and memory is high, might be leak
   # Restart the specific pod
   kubectl delete pod <pod-name> -n aizura-consortium
   ```

3. **Monitor Memory (10 minutes)**
   ```bash
   # Watch memory usage
   watch kubectl top pods -n aizura-consortium
   ```

4. **If Memory Keeps Growing:**
   - Check logs for errors
   - Review recent code changes
   - Consider memory leak in application
   - Escalate to development team

5. **Short-term Solution:**
   ```bash
   # Increase memory limits
   kubectl edit deployment aizura-backend -n aizura-consortium
   # Update resources.limits.memory

   # Apply changes
   kubectl rollout restart deployment/aizura-backend -n aizura-consortium
   ```

**Expected Resolution Time:** 20-30 minutes

---

# Security Architecture

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

## Authentication

### JWT Token Validation

**Implementation:**
- All admin endpoints validate JWT tokens from Supabase
- Tokens are verified for signature, expiration, and issuer
- Token is extracted from `Authorization: Bearer <token>` header

**Location:** `backend/src/middleware/auth.ts`

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

## Authorization

### Role-Based Access Control (RBAC)

**Implementation:**
Two-layer RBAC system:

1. **Database RLS** - Enforced at the database level
2. **Middleware RBAC** - Enforced at the API level

#### Database RLS

**Location:** `supabase/migrations/20251218135146_update_error_logs_rls_for_server_rbac.sql`

**Advantages:**
- Security enforced at lowest level
- Protection even if application logic fails
- Auditable via database logs
- Cannot be bypassed

#### Middleware RBAC

**Location:** `backend/src/middleware/rbac.ts`

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

## Network Security

### IP Whitelisting

**Purpose:**
Restrict admin endpoint access to trusted IP addresses.

**Implementation:**
**Location:** `backend/src/middleware/ipWhitelist.ts`

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

### CORS Configuration

**Purpose:**
Control which origins can access the API from browsers and provide visibility into access patterns.

**Implementation:**
**Location:** `backend/src/index.ts`

**Configuration:**
```bash
# .env file
ALLOWED_ORIGINS=https://aizura.yourdomain.com,https://app.aizura.com
```

**No-Origin Requests:**

The system allows requests without an `Origin` header, which include:
- Server-to-server API calls
- Webhook requests (e.g., from Supabase)
- Command-line tools (curl, wget)
- Native mobile apps
- Desktop applications
- Health check monitoring

**Security Rationale:**

While allowing no-origin requests bypasses browser CORS protection, this is acceptable because:

1. **CORS is browser protection only** - It doesn't prevent server-to-server attacks
2. **Multiple security layers active:**
   - JWT authentication required for sensitive endpoints
   - PostgreSQL-based rate limiting on all endpoints
   - IP whitelisting on admin endpoints
   - Comprehensive input validation
   - Database row-level security (RLS)
3. **Legitimate use cases:**
   - Supabase webhooks don't send Origin headers
   - Multi-backend orchestrator health checks
   - Mobile apps and native clients
4. **Monitoring enabled:**
   - All no-origin requests logged in production
   - Blocked origins logged for investigation
   - Audit trail for compliance

**Best Practices:**
1. Set production domains in `ALLOWED_ORIGINS`
2. Monitor no-origin request logs for anomalies
3. Investigate unexpected origin blocks
4. Keep allowed origins list minimal
5. Regular audit of access patterns

### HTTPS/TLS

**Production Requirements:**
- ✅ ALL traffic must use HTTPS (enforced by nginx-ingress)
- ✅ TLS 1.2 or higher (nginx configuration)
- ✅ Valid SSL certificates (cert-manager + Let's Encrypt)
- ✅ HTTP Strict Transport Security (HSTS) headers (backend application)

**Implementation:**

The system implements HTTPS enforcement at multiple layers:

1. **Infrastructure Layer (Kubernetes):**
   - nginx-ingress controller terminates TLS
   - Automatic SSL redirect via `nginx.ingress.kubernetes.io/ssl-redirect: "true"`
   - cert-manager handles certificate automation with Let's Encrypt

2. **Application Layer (Backend):**
   ```javascript
   // HSTS header (production only) - prevents SSL stripping attacks
   if (process.env.NODE_ENV === 'production') {
     res.setHeader(
       'Strict-Transport-Security',
       'max-age=31536000; includeSubDomains'
     );
   }
   ```

**HSTS Configuration:**
- `max-age=31536000` - Browser enforces HTTPS for 1 year
- `includeSubDomains` - Applies to all subdomains
- Production-only - HSTS only sent over HTTPS connections

**Security Benefits:**
- Prevents SSL stripping attacks
- Eliminates HTTP redirect phase (browser enforces HTTPS)
- Protects against man-in-the-middle attacks
- No certificate bypass allowed in browsers

**All Security Headers:**
```javascript
// Production: HSTS enabled
Strict-Transport-Security: max-age=31536000; includeSubDomains

// Always enabled:
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; ...
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

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

## Input Validation

### Request Validation

**Location:** `backend/src/middleware/validation.ts`

All inputs are validated before processing:

**Query Parameters:**
- Type validation (string, number, date)
- Range checking (min/max)
- Allowed values (enums)

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

The system implements comprehensive XSS protection at multiple layers using industry-standard tools and techniques.

#### Multi-Layer Defense Strategy

1. **Input Sanitization (Server-Side)**
2. **Content Security Policy Headers**
3. **Output Encoding (Client-Side)**
4. **Security Headers**

#### Server-Side Sanitization

**Location:** `backend/src/utils/sanitization.ts`

The backend uses **DOMPurify** with **jsdom** for server-side HTML sanitization. This provides robust protection against:
- Script injection attacks
- Event handler injection (onclick, onerror, etc.)
- Javascript protocol attacks (javascript:)
- Mutation XSS (mXSS)
- DOM clobbering
- Polyglot XSS payloads

**Core Functions:**

1. **sanitizeHtml()** - Sanitizes HTML while preserving safe tags
   ```typescript
   import { sanitizeHtml } from './utils/sanitization';

   const clean = sanitizeHtml(userInput, {
     allowedTags: ['p', 'strong', 'em'],
     maxLength: 5000
   });
   ```

2. **sanitizeText()** - Strips all HTML tags completely
   ```typescript
   import { sanitizeText } from './utils/sanitization';

   const clean = sanitizeText(userInput, 200);
   ```

3. **sanitizeObject()** - Recursively sanitizes object properties
   ```typescript
   import { sanitizeObject } from './utils/sanitization';

   const clean = sanitizeObject(requestBody, { maxLength: 5000 });
   ```

4. **sanitizeQueryParam()** - Sanitizes URL query parameters
   ```typescript
   import { sanitizeQueryParam } from './utils/sanitization';

   const clean = sanitizeQueryParam(req.query.search);
   ```

**Applied At:**
- ✅ Proposal submission (title, summary) - `backend/src/middleware/validation.ts:112-119`
- ✅ Error logging (message, details) - `backend/src/routes/errors.ts:64-81`
- ✅ Query parameters (all endpoints) - `backend/src/utils/validation.ts:276-293`
- ✅ User inputs (all string fields)

**Length Limits:**
- Proposal title: 200 characters
- Proposal summary: 5000 characters
- Error messages: 2000 characters
- Query parameters: 1000 characters
- Default max: 10000 characters

#### Content Security Policy (CSP)

**Location:** `backend/src/index.ts:71-89`

Comprehensive CSP headers protect against XSS by controlling resource loading:

```javascript
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

**Additional Security Headers:**
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - Enables browser XSS filter
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer info

#### Frontend Protection

**React Auto-Escaping:**
- React automatically escapes JSX expressions
- User content rendered via `{variable}` is safe by default
- Dangerous HTML requires explicit `dangerouslySetInnerHTML` (avoided)

**DOMPurify (Client-Side):**
- Used for rendering markdown/rich content
- Configured with strict allowlist
- Sanitizes before rendering to DOM

#### Testing

**Unit Tests:** `tests/unit/utils/sanitization.test.ts`
- Script tag removal
- Event handler removal
- JavaScript protocol removal
- Length validation
- Nested object sanitization
- Array sanitization
- Real-world attack scenarios

**Integration Tests:** `tests/integration/security/xss.test.ts`
- End-to-end XSS protection
- OWASP Top 10 XSS vectors
- Mutation XSS attempts
- DOM clobbering prevention
- Polyglot XSS payloads
- CSP header verification

#### Attack Vectors Mitigated

✅ **Stored XSS** - Malicious scripts in database
✅ **Reflected XSS** - Scripts in URL parameters
✅ **DOM-based XSS** - Client-side script injection
✅ **Mutation XSS** - Browser DOM mutation attacks
✅ **Polyglot XSS** - Multi-context payloads
✅ **Event Handler Injection** - onclick, onerror, onload
✅ **JavaScript Protocol** - javascript: URLs
✅ **Data URIs** - data:text/html attacks
✅ **SVG-based XSS** - SVG onload attacks
✅ **CSS-based XSS** - style attribute attacks

#### Security Best Practices

**When Adding New Inputs:**

1. ✅ Use `sanitizeText()` for plain text fields
2. ✅ Use `sanitizeHtml()` for rich text (with allowlist)
3. ✅ Use `sanitizeObject()` for complex payloads
4. ✅ Use `sanitizeQueryParam()` for URL parameters
5. ✅ Set appropriate maxLength limits
6. ✅ Add integration tests for new endpoints
7. ✅ Document allowed tags (if any)

**Example - New Endpoint:**
```typescript
router.post('/api/comments', async (req, res) => {
  try {
    let { content, authorName } = req.body;

    // Sanitize all user inputs
    content = sanitizeText(content, 2000);
    authorName = sanitizeText(authorName, 100);

    // Process sanitized data...
  } catch (error) {
    return res.status(400).json({
      error: error.message
    });
  }
});
```

**Never:**
- ❌ Trust user input without sanitization
- ❌ Use `eval()` or `new Function()` with user data
- ❌ Render HTML without DOMPurify
- ❌ Disable CSP in production
- ❌ Use `dangerouslySetInnerHTML` in React
- ❌ Concatenate user input into SQL queries

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

# Rate Limiting

## Overview

The Aizura Consortium implements a comprehensive rate limiting system to protect API endpoints from abuse, ensure fair resource allocation, and maintain system stability. The system uses a token bucket algorithm with per-endpoint, per-user limits stored in Supabase.

## Architecture

### Components

1. **RateLimiterService** (`backend/src/services/rateLimiter.ts`)
   - Core service for rate limit checks and enforcement
   - Implements token bucket algorithm via database stored procedures
   - Provides fail-open/fail-closed modes for reliability
   - Tracks violations and generates statistics

2. **Rate Limit Middleware** (`backend/src/middleware/validation.ts`)
   - Express middleware for automatic rate limit enforcement
   - Extracts identifier from auth token or IP address
   - Sets standard rate limit response headers
   - Logs violations for monitoring

3. **Database Layer** (`supabase/migrations/20251218145253_add_rate_limiting.sql`)
   - `rate_limits` table: Stores token bucket state per user/endpoint
   - `rate_limit_violations` table: Logs all rate limit violations
   - Stored procedures for atomic operations
   - Automatic cleanup functions

4. **Admin Dashboard** (`frontend/pages/admin/RateLimitMonitor.tsx`)
   - Real-time monitoring of rate limit usage
   - Violation tracking and analysis
   - System health indicators
   - Auto-refreshing dashboard

## Configuration

### Endpoint Limits

Rate limits are configured per endpoint in `backend/src/config/rateLimits.ts`:

```typescript
{
  'GET:/api/system/health': { maxRequests: 100, windowMinutes: 1 },
  'POST:/api/orchestrator/topic': { maxRequests: 10, windowMinutes: 60 },
  'GET:/api/orchestrator/plan/:id': { maxRequests: 50, windowMinutes: 1 }
}
```

### Default Limits

If an endpoint is not explicitly configured:
- **Authenticated requests**: 60 requests per minute
- **Unauthenticated requests**: 30 requests per minute

### Customizing Limits

To add or modify rate limits:

1. Edit `backend/src/config/rateLimits.ts`
2. Add endpoint configuration:
   ```typescript
   'METHOD:/api/your/endpoint': {
     maxRequests: 100,    // Maximum requests
     windowMinutes: 60    // Time window in minutes
   }
   ```
3. Apply the middleware to your route:
   ```typescript
   router.post('/your/endpoint',
     createRateLimit('POST:/api/your/endpoint'),
     yourHandler
   );
   ```

## How It Works

### Token Bucket Algorithm

Each user/endpoint combination has a token bucket:

1. **Bucket starts full** with `maxRequests` tokens
2. **Each request consumes 1 token**
3. **Tokens refill continuously** at rate: `maxRequests / (windowMinutes * 60)`
4. **Request allowed** if tokens available, **blocked** if bucket empty

### Identifier Strategy

The system identifies users by:

1. **Authentication token** (if present) - Most specific
2. **IP address** (fallback) - Prevents anonymous abuse
3. **Hash of token** - Prevents token leakage in logs

### Fail-Open vs Fail-Closed

**Fail-Open Mode** (default):
- If rate limit check fails (database error), allow the request
- Prevents legitimate users from being blocked during outages
- Logs errors for investigation

**Fail-Closed Mode**:
- If rate limit check fails, block the request
- Maximum security, prevents potential abuse during outages
- May impact availability

To change mode:
```typescript
const rateLimiter = RateLimiterService.getInstance();
rateLimiter.setFailOpen(false); // Enable fail-closed
```

## Response Headers

When rate limiting is active, the API returns these headers:

- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Timestamp when limit resets
- `Retry-After`: Seconds until next allowed request (on 429 errors)

Example:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 2024-12-18T14:30:00Z
```

## Error Responses

### 429 Too Many Requests

Returned when rate limit is exceeded:

```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 58
}
```

The `retryAfter` field indicates seconds until the next request will be allowed.

## Monitoring

### Admin Dashboard

Access the rate limit monitor at `/admin/rate-limits`:

**Features:**
- Real-time usage statistics per endpoint
- Total blocked requests (24h)
- Most active endpoints
- System health status (healthy/warning/critical)
- Auto-refresh every 5 seconds

**Health Thresholds:**
- **Healthy**: All endpoints < 70% capacity
- **Warning**: Any endpoint 70-89% capacity
- **Critical**: Any endpoint ≥ 90% capacity

## Maintenance

### Cleanup Old Data

The system includes automatic cleanup via `cleanup_old_rate_limits()` stored procedure:

```sql
SELECT cleanup_old_rate_limits(); -- Removes entries older than 24 hours
```

**Recommended Schedule:**
- Run every 6 hours via pg_cron (see migration)
- Keeps database size manageable
- Removes stale rate limit entries

### Manual Cleanup

To manually clean up old violations:

```sql
DELETE FROM rate_limit_violations
WHERE created_at < now() - interval '7 days';
```

To reset a user's rate limits:

```sql
DELETE FROM rate_limits
WHERE identifier = 'user_id_or_ip';
```

## Troubleshooting

### Issue: Legitimate users getting blocked

**Cause**: Rate limits too restrictive

**Solution**:
1. Check violation logs: `SELECT * FROM rate_limit_violations WHERE identifier = 'user_id';`
2. Increase limits in `backend/src/config/rateLimits.ts`
3. Consider different limits for authenticated vs unauthenticated users

### Issue: Rate limiter not working

**Cause**: Missing middleware or database migration

**Solution**:
1. Verify migration applied: Check Supabase dashboard for `rate_limits` tables
2. Verify middleware: Ensure `createRateLimit()` is applied to routes
3. Check logs for rate limiter errors

### Issue: Slow API responses

**Cause**: Rate limit checks taking too long

**Solution**:
1. Check database performance
2. Add index: `CREATE INDEX ON rate_limits(identifier, endpoint);`
3. Monitor with: `SELECT * FROM error_logs WHERE error_type = 'rate_limit_slow_query';`

### Issue: Rate limits not resetting

**Cause**: Token refill calculation error

**Solution**:
1. Check `last_refill` timestamps: `SELECT * FROM rate_limits WHERE identifier = 'user_id';`
2. Verify `refill_rate` is correct: Should be `max_tokens / (window_minutes * 60)`
3. Manually reset if needed: `DELETE FROM rate_limits WHERE identifier = 'user_id';`

---

# Disaster Recovery

## Overview

### Recovery Objectives

| Metric | Target | Definition |
|--------|--------|------------|
| RTO (Recovery Time Objective) | 4 hours | Maximum acceptable downtime |
| RPO (Recovery Point Objective) | 1 hour | Maximum acceptable data loss |
| MTTR (Mean Time To Recover) | 2 hours | Average time to restore service |

### Disaster Classification

| Severity | Description | Example | Response Time |
|----------|-------------|---------|---------------|
| **P0 - Critical** | Complete system outage | Database failure, cluster down | Immediate |
| **P1 - High** | Major functionality broken | Orchestrator failure, auth down | <30 minutes |
| **P2 - Medium** | Degraded performance | Slow responses, partial outage | <2 hours |
| **P3 - Low** | Minor issues | Single pod failure, logging issues | <24 hours |

## Backup Strategy

### Automated Backups (Supabase)

Supabase provides automatic backups:

#### Database Backups
- **Frequency:** Daily automatic backups
- **Retention:**
  - Daily backups: 7 days
  - Weekly backups: 4 weeks
  - Monthly backups: 3 months (Pro plan)
- **Location:** Supabase managed storage (AWS S3)
- **Type:** Point-in-time recovery (PITR) available on Pro plan

#### Accessing Backups
```bash
# Via Supabase Dashboard:
# 1. Go to: https://app.supabase.com/project/<your-project>/settings/storage
# 2. Navigate to: Database → Backups
# 3. Select backup and restore

# Via CLI (if available):
supabase db dump --db-url "$SUPABASE_DB_URL" > backup.sql
```

### Application State Backups

#### Configuration Backups
```bash
# Backup Kubernetes manifests
kubectl get all -n aizura-consortium -o yaml > k8s-backup.yaml

# Backup secrets (NEVER commit to git)
kubectl get secrets -n aizura-consortium -o yaml > secrets-backup.yaml

# Store encrypted in secure location
```

#### Code Repository
- **Primary:** GitHub repository
- **Backup:** Automated GitHub backups (GitHub maintains redundancy)
- **Frequency:** Every commit (continuous)
- **Retention:** Permanent (git history)

### What is Backed Up

| Component | Backup Method | Frequency | Retention |
|-----------|---------------|-----------|-----------|
| Database Schema | Supabase automatic | Daily | 7+ days |
| Database Data | Supabase automatic | Daily | 7+ days |
| Application Code | Git repository | Continuous | Permanent |
| Docker Images | GitHub Container Registry | Per build | 90 days |
| Kubernetes Configs | Manual backup | As needed | Permanent (git) |
| Environment Secrets | Manual secure backup | As needed | Encrypted storage |

### What is NOT Backed Up

- Container logs (ephemeral)
- Temporary files in pods
- In-memory orchestrator state
- Rate limiting counters
- Active WebSocket connections

## Recovery Scenarios

### Scenario 1: Database Failure or Corruption

**Symptoms:**
- Database connection errors
- Data integrity issues
- Supabase dashboard shows errors

**Impact:** P0 - Complete outage

**Recovery Steps:**
1. Identify issue in Supabase dashboard
2. Contact Supabase support (support@supabase.com)
3. Restore from latest backup:
   - Navigate to Supabase dashboard → Database → Backups
   - Select most recent healthy backup
   - Click "Restore"
   - Confirm restoration
4. Verify data integrity:
   ```bash
   curl https://aizura.yourdomain.com/health
   ```
5. Check recent data (may lose data since last backup)
6. Notify users of potential data loss

**Recovery Time:** 30-60 minutes

### Scenario 2: Complete Kubernetes Cluster Failure

**Symptoms:**
- All pods down
- Cluster unreachable
- kubectl commands fail

**Impact:** P0 - Complete outage

**Recovery Steps:**

1. **Verify cluster status:**
   ```bash
   kubectl get nodes
   kubectl get pods -A
   ```

2. **If cluster is down, recreate:**
   ```bash
   # Provision new Kubernetes cluster
   # (Specific steps depend on your cloud provider)
   ```

3. **Restore from backups:**
   ```bash
   # Recreate namespace
   kubectl create namespace aizura-consortium

   # Restore secrets (from secure backup)
   kubectl apply -f secrets-backup.yaml

   # Redeploy application
   kubectl apply -f manifests.prod.yaml
   ```

4. **Verify deployment:**
   ```bash
   kubectl get pods -n aizura-consortium
   kubectl rollout status deployment/aizura-backend -n aizura-consortium
   kubectl rollout status deployment/aizura-frontend -n aizura-consortium
   ```

5. **Test health endpoints:**
   ```bash
   curl https://aizura.yourdomain.com/health
   curl https://aizura.yourdomain.com/api/system/health
   ```

**Recovery Time:** 2-4 hours

### Scenario 3: Security Breach

**Symptoms:**
- Unusual API activity
- Unauthorized access detected
- Secrets potentially compromised

**Impact:** P0 - Immediate action required

**Recovery Steps:**

1. **Immediate Actions:**
   ```bash
   # Rotate all API keys immediately
   # - Supabase keys
   # - AI provider API keys
   # - GitHub tokens

   # Update Kubernetes secrets
   kubectl delete secret aizura-secrets -n aizura-consortium
   kubectl create secret generic aizura-secrets \
     --from-literal=supabase-url="NEW_URL" \
     --from-literal=supabase-service-role-key="NEW_KEY" \
     # ... (all other keys)

   # Restart all pods to use new secrets
   kubectl rollout restart deployment/aizura-backend -n aizura-consortium
   kubectl rollout restart deployment/aizura-frontend -n aizura-consortium
   ```

2. **Investigate breach:**
   - Check error logs for suspicious activity
   - Review rate limit violations
   - Check Supabase auth logs
   - Review kubectl audit logs (if enabled)

3. **Secure the system:**
   - Enable additional security measures
   - Review and tighten RLS policies
   - Update IP whitelist if needed
   - Enable MFA for admin accounts

4. **Assess damage:**
   - Check for data modifications
   - Review deleted resources
   - Verify data integrity

5. **Restore if needed:**
   - Restore database from backup if data was modified
   - Redeploy pods with new secrets

6. **Post-incident:**
   - Document what happened
   - Update security procedures
   - Notify affected users if required
   - Implement additional safeguards

**Recovery Time:** 2-8 hours

## Recovery Procedures

### Database Restore Procedure

**When to use:** Data corruption, accidental deletion, need to rollback

**Steps:**

1. **Access Supabase Dashboard:**
   ```
   https://app.supabase.com/project/<your-project-id>/database/backups
   ```

2. **Select Backup:**
   - Choose backup point before issue occurred
   - Note: Will lose all data after backup point

3. **Initiate Restore:**
   - Click "Restore" on selected backup
   - Confirm restoration
   - Wait for completion (5-20 minutes)

4. **Verify Restoration:**
   ```bash
   # Check database is accessible
   curl https://aizura.yourdomain.com/health

   # Check recent data
   curl https://aizura.yourdomain.com/api/proposals
   ```

5. **Notify Users:**
   - Inform about restored state
   - Explain potential data loss
   - Request re-submission if needed

### Secrets Recovery Procedure

**When to use:** Secrets compromised, secrets lost, new environment setup

**Prerequisites:**
- Secure backup of secrets exists
- New API keys generated if compromised

**Steps:**

1. **Prepare new secrets:**
   ```bash
   # Create secrets file (DO NOT commit to git)
   cat > secrets.env << EOF
   SUPABASE_URL=your-new-url
   SUPABASE_SERVICE_ROLE_KEY=your-new-key
   ANTHROPIC_API_KEY=your-new-key
   OPENAI_API_KEY=your-new-key
   GROK_API_KEY=your-new-key
   GEMINI_API_KEY=your-new-key
   DEEPSEEK_API_KEY=your-new-key
   QWEN_API_KEY=your-new-key
   EOF
   ```

2. **Create Kubernetes secret:**
   ```bash
   kubectl create secret generic aizura-secrets \
     --from-env-file=secrets.env \
     --namespace=aizura-consortium \
     --dry-run=client -o yaml | kubectl apply -f -
   ```

3. **Restart pods:**
   ```bash
   kubectl rollout restart deployment/aizura-backend -n aizura-consortium
   kubectl rollout restart deployment/aizura-frontend -n aizura-consortium
   ```

4. **Securely delete secrets file:**
   ```bash
   shred -u secrets.env
   ```

5. **Verify pods are running:**
   ```bash
   kubectl get pods -n aizura-consortium
   ```

## Testing

### Disaster Recovery Testing Schedule

| Test Type | Frequency | Duration | Owner |
|-----------|-----------|----------|-------|
| Database Restore | Quarterly | 1 hour | DevOps |
| Full System Restore | Annually | 4 hours | DevOps |
| Orchestrator Recovery | Monthly | 30 minutes | On-call |
| Secrets Rotation | Quarterly | 2 hours | Security |
| Documentation Review | Quarterly | 1 hour | Team |

### Test Procedure Template

For each test:

1. **Schedule test during maintenance window**
2. **Notify team of test**
3. **Document baseline state**
4. **Execute disaster scenario**
5. **Follow recovery procedures**
6. **Document results and timing**
7. **Update procedures if needed**

## Contact Information

### Emergency Contacts

| Role | Contact | Availability | Purpose |
|------|---------|-------------|---------|
| On-Call Engineer | [Your contact] | 24/7 | First responder |
| DevOps Lead | [Your contact] | Business hours | Infrastructure issues |
| Database Admin | Supabase Support | 24/7 | Database recovery |
| Security Lead | [Your contact] | 24/7 (P0 only) | Security incidents |

### External Support

| Service | Contact | SLA | Purpose |
|---------|---------|-----|---------|
| Supabase | support@supabase.com | Varies by plan | Database issues |
| Anthropic | support@anthropic.com | No SLA | Claude API |
| OpenAI | help.openai.com | No SLA | GPT API |
| Cloud Provider | Varies | Per contract | Infrastructure |

### Escalation Path

1. **Initial Response** (0-15 min): On-call engineer
2. **Escalation 1** (15-30 min): DevOps lead
3. **Escalation 2** (30-60 min): CTO/Technical leadership
4. **External Support** (As needed): Vendor support teams

## Post-Incident

After any disaster recovery:

### Immediate (Within 24 hours)
- [ ] Document timeline of events
- [ ] Document recovery steps taken
- [ ] Note what worked and what didn't
- [ ] Estimate total downtime
- [ ] Estimate data loss (if any)

### Short-term (Within 1 week)
- [ ] Conduct post-mortem meeting
- [ ] Update recovery procedures
- [ ] Implement preventive measures
- [ ] Update monitoring/alerting
- [ ] Share lessons learned with team

### Long-term (Within 1 month)
- [ ] Review and update SLAs
- [ ] Update disaster recovery plan
- [ ] Conduct training if needed
- [ ] Review backup strategy
- [ ] Update testing schedule

---

# Best Practices

## Before Making Changes
- [ ] Review change in staging/dev first
- [ ] Document what you're changing and why
- [ ] Have rollback plan ready
- [ ] Schedule during low-traffic period if high-risk
- [ ] Notify team of planned changes

## During Changes
- [ ] Monitor logs in real-time
- [ ] Watch health metrics
- [ ] Test each step before proceeding
- [ ] Document any issues encountered
- [ ] Be ready to rollback immediately

## After Changes
- [ ] Verify all services healthy
- [ ] Check for increased error rates
- [ ] Monitor for 30-60 minutes
- [ ] Document what was changed
- [ ] Update runbooks if procedure changed

## General Operations
- Always use descriptive commit messages
- Document workarounds and fixes
- Update documentation when procedures change
- Share knowledge with team
- Test disaster recovery procedures regularly

## Development Best Practices

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

## Production Best Practices

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

---

**Document Version:** 1.0
**Last Updated:** 2025-12-19
**Next Review:** 2026-06-19
**Owner:** DevOps/Operations Team
