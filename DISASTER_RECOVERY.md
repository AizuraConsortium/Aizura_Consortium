# Disaster Recovery Plan

This document outlines disaster recovery procedures for the Aizura Consortium platform.

## Table of Contents
1. [Overview](#overview)
2. [Backup Strategy](#backup-strategy)
3. [Recovery Scenarios](#recovery-scenarios)
4. [Recovery Procedures](#recovery-procedures)
5. [Testing](#testing)
6. [Contact Information](#contact-information)

---

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

---

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

---

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

### Scenario 3: Orchestrator Failure

**Symptoms:**
- Orchestrator status shows "not_initialized"
- Debates not progressing
- No new messages from agents

**Impact:** P1 - Debates frozen, but UI accessible

**Recovery Steps:**

1. **Check orchestrator health:**
   ```bash
   curl https://aizura.yourdomain.com/health/orchestrator
   ```

2. **Check backend pod logs:**
   ```bash
   kubectl logs -n aizura-consortium deployment/aizura-backend --tail=100
   ```

3. **Restart backend pods:**
   ```bash
   kubectl rollout restart deployment/aizura-backend -n aizura-consortium
   ```

4. **Verify orchestrator started:**
   ```bash
   # Check logs for "👑 This instance is the LEADER"
   kubectl logs -n aizura-consortium deployment/aizura-backend -f
   ```

5. **Check orchestrator lock:**
   ```bash
   # Query orchestrator_lock table in Supabase
   # Ensure lock is held by active instance
   ```

6. **If lock is stale, clear it:**
   ```sql
   -- In Supabase SQL editor:
   DELETE FROM orchestrator_lock WHERE expires_at < NOW();
   ```

**Recovery Time:** 15-30 minutes

### Scenario 4: Frontend Deployment Failure

**Symptoms:**
- 404 errors on frontend
- Blank pages
- Static assets not loading

**Impact:** P1 - UI inaccessible, API still works

**Recovery Steps:**

1. **Check frontend pods:**
   ```bash
   kubectl get pods -n aizura-consortium | grep frontend
   ```

2. **Check frontend logs:**
   ```bash
   kubectl logs -n aizura-consortium deployment/aizura-frontend --tail=50
   ```

3. **Rollback to previous version:**
   ```bash
   kubectl rollout undo deployment/aizura-frontend -n aizura-consortium
   ```

4. **Or redeploy from scratch:**
   ```bash
   kubectl delete deployment aizura-frontend -n aizura-consortium
   kubectl apply -f manifests.prod.yaml
   ```

5. **Verify frontend is accessible:**
   ```bash
   curl -I https://aizura.yourdomain.com/
   ```

**Recovery Time:** 10-20 minutes

### Scenario 5: Data Loss (Accidental Deletion)

**Symptoms:**
- Users report missing data
- Recent proposals/messages gone
- Database records deleted

**Impact:** P0-P1 depending on scope

**Recovery Steps:**

1. **Assess scope of data loss:**
   ```sql
   -- Check recent deletions in Supabase
   SELECT * FROM proposals ORDER BY created_at DESC LIMIT 100;
   SELECT * FROM messages ORDER BY created_at DESC LIMIT 100;
   ```

2. **Identify last known good state:**
   - Check error logs for deletion timestamps
   - Interview users to determine timeline

3. **Restore from backup:**
   - Navigate to Supabase dashboard → Database → Backups
   - Find backup before deletion
   - Restore to new database instance
   - Migrate missing data to production

4. **If PITR available (Pro plan):**
   ```bash
   # Contact Supabase support for point-in-time restore
   # Specify exact timestamp before deletion
   ```

5. **Verify data restoration:**
   - Check affected tables
   - Confirm with users

6. **Implement safeguards:**
   - Review deletion permissions
   - Add deletion confirmation flows
   - Implement soft deletes for critical data

**Recovery Time:** 1-4 hours (depends on backup timing)

### Scenario 6: Security Breach

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

### Scenario 7: AI Provider Outage

**Symptoms:**
- Agents not responding
- Timeout errors from AI APIs
- Orchestrator logs show API errors

**Impact:** P1 - Debates frozen

**Recovery Steps:**

1. **Identify affected provider:**
   ```bash
   # Check logs
   kubectl logs -n aizura-consortium deployment/aizura-backend | grep "Error calling"
   ```

2. **Check provider status pages:**
   - Anthropic: status.anthropic.com
   - OpenAI: status.openai.com
   - Google AI: status.cloud.google.com

3. **If provider is down:**
   - Wait for provider to recover (no action needed)
   - Monitor status pages
   - Orchestrator will automatically retry

4. **If API keys are invalid:**
   ```bash
   # Update the affected API key
   kubectl edit secret aizura-secrets -n aizura-consortium
   # Update the specific key
   # Save and exit

   # Restart backend
   kubectl rollout restart deployment/aizura-backend -n aizura-consortium
   ```

5. **If rate limited:**
   - Wait for rate limit to reset
   - Consider upgrading API plan
   - Temporarily disable affected agent

**Recovery Time:** Varies (depends on provider)

---

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

### Application Redeploy Procedure

**When to use:** Broken deployment, pod issues, configuration changes

**Steps:**

1. **Pull latest working code:**
   ```bash
   git checkout main
   git pull origin main
   # Or checkout specific working tag:
   git checkout v1.2.3
   ```

2. **Rebuild images:**
   ```bash
   docker build -f Dockerfile.backend -t ghcr.io/your-org/aizura-backend:latest .
   docker build -f Dockerfile.frontend -t ghcr.io/your-org/aizura-frontend:latest .

   docker push ghcr.io/your-org/aizura-backend:latest
   docker push ghcr.io/your-org/aizura-frontend:latest
   ```

3. **Update Kubernetes:**
   ```bash
   kubectl apply -f manifests.prod.yaml
   ```

4. **Monitor rollout:**
   ```bash
   kubectl rollout status deployment/aizura-backend -n aizura-consortium
   kubectl rollout status deployment/aizura-frontend -n aizura-consortium
   ```

5. **Verify health:**
   ```bash
   curl https://aizura.yourdomain.com/health
   curl https://aizura.yourdomain.com/api/system/health
   ```

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

---

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

### Sample Test: Database Restore

```bash
# 1. Document current state
curl https://aizura.yourdomain.com/api/proposals > before.json

# 2. Note current backup time
# Check Supabase dashboard for latest backup

# 3. Make test change (safe, reversible)
# Create a test proposal with clear identifier

# 4. Perform restore to backup
# Use Supabase dashboard to restore

# 5. Verify test change is gone
curl https://aizura.yourdomain.com/api/proposals > after.json
diff before.json after.json

# 6. Document recovery time
# Note how long restore took

# 7. Update RTO/RPO estimates if needed
```

---

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

---

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

## Appendix

### Useful Commands Reference

```bash
# Health checks
curl https://aizura.yourdomain.com/health
curl https://aizura.yourdomain.com/api/system/health
curl https://aizura.yourdomain.com/health/orchestrator

# Pod management
kubectl get pods -n aizura-consortium
kubectl logs -n aizura-consortium deployment/aizura-backend
kubectl rollout restart deployment/aizura-backend -n aizura-consortium
kubectl rollout undo deployment/aizura-backend -n aizura-consortium

# Secret management
kubectl get secrets -n aizura-consortium
kubectl describe secret aizura-secrets -n aizura-consortium
kubectl edit secret aizura-secrets -n aizura-consortium

# Database access
psql "$SUPABASE_DB_URL"
# Or use Supabase SQL editor in dashboard
```

### Important URLs

- **Production:** https://aizura.yourdomain.com
- **Supabase Dashboard:** https://app.supabase.com/project/<project-id>
- **GitHub Repository:** https://github.com/your-org/aizura-consortium
- **Container Registry:** https://github.com/orgs/your-org/packages

---

**Document Version:** 1.0
**Last Updated:** 2025-12-19
**Next Review:** 2026-03-19
**Owner:** DevOps Team
