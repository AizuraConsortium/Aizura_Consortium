# Operations Manual

This document provides operational procedures and runbooks for the Aizura Consortium platform.

## Table of Contents
1. [Daily Operations](#daily-operations)
2. [Monitoring](#monitoring)
3. [Common Tasks](#common-tasks)
4. [Troubleshooting](#troubleshooting)
5. [Maintenance](#maintenance)
6. [Runbooks](#runbooks)

---

## Daily Operations

### Morning Health Check

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

### End of Day Review

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

## Monitoring

### Health Endpoints

| Endpoint | Purpose | Expected Response Time | Alert Threshold |
|----------|---------|------------------------|-----------------|
| `/health` | Basic server health | <100ms | >500ms or 5xx |
| `/api/system/health` | Detailed system health | <500ms | >2s or unhealthy status |
| `/health/orchestrator` | Orchestrator status | <100ms | >500ms or not_initialized |

### Monitoring Checklist

#### Every Hour
- [ ] Check pod status (all running)
- [ ] Monitor resource usage (memory, CPU)
- [ ] Review recent errors in admin dashboard

#### Every 4 Hours
- [ ] Check system health endpoint
- [ ] Review orchestrator status
- [ ] Check for rate limit violations
- [ ] Monitor debate progress

#### Daily
- [ ] Review error trends
- [ ] Check backup completion
- [ ] Review rate limit patterns
- [ ] Check for security alerts

#### Weekly
- [ ] Review resource trends
- [ ] Check for memory leaks
- [ ] Review agent performance
- [ ] Update documentation

### Key Metrics to Watch

| Metric | Healthy Range | Warning | Critical |
|--------|---------------|---------|----------|
| Pod CPU Usage | <50% | 50-80% | >80% |
| Pod Memory Usage | <60% | 60-80% | >80% |
| Error Rate (24h) | <10 | 10-50 | >50 |
| Critical Errors (24h) | 0 | 1-5 | >5 |
| Database Response Time | <100ms | 100-500ms | >500ms |
| Orchestrator Tick Duration | <30s | 30-60s | >60s |

### Dashboard Access

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

## Common Tasks

### Restarting Services

#### Restart Backend (Orchestrator)
```bash
# Graceful restart (zero downtime with multiple replicas)
kubectl rollout restart deployment/aizura-backend -n aizura-consortium

# Check rollout status
kubectl rollout status deployment/aizura-backend -n aizura-consortium

# Verify orchestrator restarted
kubectl logs -n aizura-consortium deployment/aizura-backend --tail=50 | grep "Orchestrator"
```

#### Restart Frontend
```bash
# Graceful restart
kubectl rollout restart deployment/aizura-frontend -n aizura-consortium

# Check rollout status
kubectl rollout status deployment/aizura-frontend -n aizura-consortium

# Verify frontend is accessible
curl -I https://aizura.yourdomain.com/
```

#### Restart All Services
```bash
# Restart everything (use for major updates)
kubectl rollout restart deployment/aizura-backend -n aizura-consortium
kubectl rollout restart deployment/aizura-frontend -n aizura-consortium

# Wait for completion
kubectl rollout status deployment/aizura-backend -n aizura-consortium
kubectl rollout status deployment/aizura-frontend -n aizura-consortium
```

### Scaling Services

#### Scale Backend
```bash
# Scale to 5 replicas
kubectl scale deployment aizura-backend --replicas=5 -n aizura-consortium

# Verify scaling
kubectl get pods -n aizura-consortium | grep backend

# Check HPA (if configured)
kubectl get hpa -n aizura-consortium
```

#### Scale Frontend
```bash
# Scale to 10 replicas
kubectl scale deployment aizura-frontend --replicas=10 -n aizura-consortium

# Verify scaling
kubectl get pods -n aizura-consortium | grep frontend
```

### Viewing Logs

#### Real-time Logs
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

#### Historical Logs
```bash
# Last 100 lines
kubectl logs -n aizura-consortium deployment/aizura-backend --tail=100

# Last hour
kubectl logs -n aizura-consortium deployment/aizura-backend --since=1h

# Previous pod instance (after crash)
kubectl logs -n aizura-consortium <pod-name> --previous
```

#### Search Logs
```bash
# Search for errors
kubectl logs -n aizura-consortium deployment/aizura-backend --tail=1000 | grep -i error

# Search for specific proposal
kubectl logs -n aizura-consortium deployment/aizura-backend | grep "proposal_123"

# Count error occurrences
kubectl logs -n aizura-consortium deployment/aizura-backend --tail=10000 | grep -c "ERROR"
```

### Updating Configuration

#### Update Environment Variables
```bash
# Edit configmap (if using)
kubectl edit configmap aizura-config -n aizura-consortium

# Update and restart
kubectl rollout restart deployment/aizura-backend -n aizura-consortium
```

#### Update Secrets
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

#### Update Kubernetes Manifests
```bash
# Edit manifests locally
vim manifests.prod.yaml

# Apply changes
kubectl apply -f manifests.prod.yaml

# Verify changes applied
kubectl get deployment aizura-backend -n aizura-consortium -o yaml
```

### Database Operations

#### Check Database Connection
```bash
# Via health endpoint
curl https://aizura.yourdomain.com/health

# Via Supabase dashboard
# Navigate to: Database → Database Settings → Connection Info
```

#### Run Database Query
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

#### Database Maintenance
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

### Certificate Management

#### Check TLS Certificate
```bash
# Check certificate expiration
echo | openssl s_client -servername aizura.yourdomain.com -connect aizura.yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates

# Check certificate details
kubectl get certificate -n aizura-consortium
kubectl describe certificate aizura-tls -n aizura-consortium
```

#### Renew Certificate (Let's Encrypt)
```bash
# Cert-manager handles automatic renewal
# Check cert-manager logs if issues
kubectl logs -n cert-manager deployment/cert-manager

# Force renewal if needed
kubectl delete certificate aizura-tls -n aizura-consortium
# Cert-manager will automatically recreate
```

---

## Troubleshooting

### Pods Not Starting

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

### Database Connection Issues

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

### Orchestrator Not Running

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

### High Error Rate

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

### Rate Limit Violations

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

## Maintenance

### Regular Maintenance Tasks

| Task | Frequency | Duration | Procedure |
|------|-----------|----------|-----------|
| Certificate Renewal | Automatic | N/A | Cert-manager handles |
| Database Backup | Daily (automatic) | N/A | Supabase handles |
| Log Rotation | Automatic | N/A | Kubernetes handles |
| Error Log Cleanup | Daily (automatic) | N/A | Supabase cron job |
| Rate Limit Cleanup | Hourly (automatic) | N/A | Supabase cron job |
| Security Updates | Monthly | 2-4 hours | See below |
| Dependency Updates | Quarterly | 2-4 hours | See below |

### Applying Security Updates

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

### Dependency Updates

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

### Database Maintenance

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

### Planned Downtime

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

## Runbooks

### Runbook: Complete System Outage

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

5. **If Still Down:** Escalate to DISASTER_RECOVERY.md

**Expected Recovery Time:** 15-30 minutes

### Runbook: Orchestrator Failure

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

### Runbook: High Memory Usage

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

## Best Practices

### Before Making Changes
- [ ] Review change in staging/dev first
- [ ] Document what you're changing and why
- [ ] Have rollback plan ready
- [ ] Schedule during low-traffic period if high-risk
- [ ] Notify team of planned changes

### During Changes
- [ ] Monitor logs in real-time
- [ ] Watch health metrics
- [ ] Test each step before proceeding
- [ ] Document any issues encountered
- [ ] Be ready to rollback immediately

### After Changes
- [ ] Verify all services healthy
- [ ] Check for increased error rates
- [ ] Monitor for 30-60 minutes
- [ ] Document what was changed
- [ ] Update runbooks if procedure changed

### General Operations
- Always use descriptive commit messages
- Document workarounds and fixes
- Update documentation when procedures change
- Share knowledge with team
- Test disaster recovery procedures regularly

---

**Document Version:** 1.0
**Last Updated:** 2025-12-19
**Next Review:** 2026-06-19
**Owner:** DevOps/Operations Team
