# Production Deployment Checklist

## Pre-Deployment Tasks

### 1. Move GitHub Actions Workflow File
```bash
mkdir -p .github/workflows
mv build-k8s.yaml .github/workflows/
```

### 2. Update Configuration Files

#### manifests.prod.yaml
- [ ] Line 61: Update `image: ghcr.io/your-org/aizura-backend:latest` with your GitHub org/username
- [ ] Line 147: Update `image: ghcr.io/your-org/aizura-frontend:latest` with your GitHub org/username
- [ ] Line 205: Update `allowed-origins` with your production domain
- [ ] Line 223: Update `- aizura.yourdomain.com` with your actual domain (appears 2x)
- [ ] Line 225: Update `secretName: aizura-tls` if using different cert name

#### build-k8s.yaml (after moving to .github/workflows/)
- [ ] Line 148: Update `url: https://aizura.yourdomain.com` with your production domain
- [ ] Line 213: Update `url: https://staging.aizura.yourdomain.com` with your staging domain

### 3. Configure GitHub Repository Secrets

Go to: `GitHub Repo → Settings → Secrets and variables → Actions → New repository secret`

Add these secrets:

#### Kubernetes
- [ ] `KUBE_CONFIG` - Base64 encoded kubeconfig for production cluster
  ```bash
  cat ~/.kube/config | base64 | pbcopy  # macOS
  cat ~/.kube/config | base64 -w 0      # Linux
  ```
- [ ] `KUBE_CONFIG_STAGING` - Base64 encoded kubeconfig for staging cluster (if using staging)

#### Supabase
- [ ] `SUPABASE_URL` - Your Supabase project URL (e.g., https://xxxxx.supabase.co)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (starts with eyJhbGc...)

#### AI Provider API Keys
- [ ] `ANTHROPIC_API_KEY` - Claude API key (sk-ant-...)
- [ ] `OPENAI_API_KEY` - OpenAI API key (sk-...)
- [ ] `GROK_API_KEY` - Grok/xAI API key
- [ ] `GEMINI_API_KEY` - Google Gemini API key
- [ ] `DEEPSEEK_API_KEY` - DeepSeek API key
- [ ] `QWEN_API_KEY` - Qwen/Alibaba API key

### 4. Prepare Kubernetes Cluster

#### Install Required Components

**Nginx Ingress Controller:**
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
```

**Cert-Manager (for TLS certificates):**
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

**Create ClusterIssuer for Let's Encrypt:**
```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com  # UPDATE THIS
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
```

Save as `cluster-issuer.yaml` and apply:
```bash
kubectl apply -f cluster-issuer.yaml
```

### 5. DNS Configuration

Point your domain to the Ingress Load Balancer:

```bash
# Get the external IP of the ingress controller
kubectl get svc -n ingress-nginx ingress-nginx-controller
```

Create DNS A record:
```
aizura.yourdomain.com → <EXTERNAL-IP>
```

---

## Deployment Options

### Option A: Automated Deployment (GitHub Actions)

1. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Add production deployment configuration"
   git push origin main
   ```

2. **Monitor GitHub Actions:**
   - Go to GitHub repo → Actions tab
   - Watch the build and deployment progress

3. **Verify deployment:**
   ```bash
   kubectl get pods -n aizura-consortium
   kubectl get services -n aizura-consortium
   kubectl get ingress -n aizura-consortium
   ```

### Option B: Manual Deployment

1. **Create namespace:**
   ```bash
   kubectl create namespace aizura-consortium
   ```

2. **Create secrets:**
   ```bash
   kubectl create secret generic aizura-secrets \
     --from-literal=supabase-url="YOUR_URL" \
     --from-literal=supabase-service-role-key="YOUR_KEY" \
     --from-literal=anthropic-api-key="YOUR_KEY" \
     --from-literal=openai-api-key="YOUR_KEY" \
     --from-literal=grok-api-key="YOUR_KEY" \
     --from-literal=gemini-api-key="YOUR_KEY" \
     --from-literal=deepseek-api-key="YOUR_KEY" \
     --from-literal=qwen-api-key="YOUR_KEY" \
     --namespace=aizura-consortium
   ```

3. **Build and push Docker images:**
   ```bash
   # Login to GitHub Container Registry
   echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

   # Build images
   docker build -f Dockerfile.backend -t ghcr.io/your-org/aizura-backend:latest .
   docker build -f Dockerfile.frontend -t ghcr.io/your-org/aizura-frontend:latest .

   # Push images
   docker push ghcr.io/your-org/aizura-backend:latest
   docker push ghcr.io/your-org/aizura-frontend:latest
   ```

4. **Deploy to Kubernetes:**
   ```bash
   kubectl apply -f manifests.prod.yaml
   ```

5. **Wait for rollout:**
   ```bash
   kubectl rollout status deployment/aizura-backend -n aizura-consortium
   kubectl rollout status deployment/aizura-frontend -n aizura-consortium
   ```

---

## Post-Deployment Verification

### 1. Check Pod Status
```bash
kubectl get pods -n aizura-consortium
```

Expected output:
```
NAME                               READY   STATUS    RESTARTS   AGE
aizura-backend-xxxxxxxxxx-xxxxx    1/1     Running   0          2m
aizura-backend-xxxxxxxxxx-xxxxx    1/1     Running   0          2m
aizura-frontend-xxxxxxxxxx-xxxxx   1/1     Running   0          2m
aizura-frontend-xxxxxxxxxx-xxxxx   1/1     Running   0          2m
aizura-frontend-xxxxxxxxxx-xxxxx   1/1     Running   0          2m
```

### 2. Check Services
```bash
kubectl get svc -n aizura-consortium
```

### 3. Check Ingress
```bash
kubectl get ingress -n aizura-consortium
```

### 4. Test Health Endpoint
```bash
curl https://aizura.yourdomain.com/health
```

Expected response:
```json
{
  "status": "ok",
  "database": {"healthy": true},
  "timestamp": "2024-12-17T..."
}
```

### 5. Test Frontend
```bash
curl -I https://aizura.yourdomain.com/
```

Expected: `HTTP/2 200`

### 6. Check Logs
```bash
# Backend logs
kubectl logs -n aizura-consortium deployment/aizura-backend --tail=50

# Frontend logs (nginx)
kubectl logs -n aizura-consortium deployment/aizura-frontend --tail=50
```

### 7. Verify Security Headers

**Check HSTS Header:**
```bash
curl -I https://aizura.yourdomain.com/health | grep -i strict-transport
```

Expected output:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

**Check All Security Headers:**
```bash
curl -I https://aizura.yourdomain.com/health
```

Expected headers:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; ...
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

**Test SSL Configuration:**

Option A - Using online tool:
- Visit: https://www.ssllabs.com/ssltest/analyze.html?d=aizura.yourdomain.com
- Expected rating: A or A+

Option B - Using curl:
```bash
# Verify TLS 1.2+ is used
curl -I --tlsv1.2 https://aizura.yourdomain.com/health
```

**Verify CORS Configuration:**
```bash
# Test with allowed origin (should work)
curl -I -H "Origin: https://aizura.yourdomain.com" https://aizura.yourdomain.com/api/proposals

# Test with invalid origin (should be blocked)
curl -I -H "Origin: https://evil.com" https://aizura.yourdomain.com/api/proposals
```

### 8. Test Full Application Flow
- [ ] Open https://aizura.yourdomain.com in browser
- [ ] Verify home page loads
- [ ] Check browser console for errors
- [ ] Test authentication (if applicable)
- [ ] Submit a test proposal
- [ ] Verify API endpoints work

---

## Monitoring and Observability

### View Real-time Logs
```bash
# Backend
kubectl logs -f -n aizura-consortium deployment/aizura-backend

# Frontend
kubectl logs -f -n aizura-consortium deployment/aizura-frontend
```

### Check Resource Usage
```bash
kubectl top pods -n aizura-consortium
kubectl top nodes
```

### View Autoscaler Status
```bash
kubectl get hpa -n aizura-consortium
```

### Check TLS Certificate
```bash
kubectl get certificate -n aizura-consortium
kubectl describe certificate aizura-tls -n aizura-consortium
```

---

## Troubleshooting

### Pods Not Starting

1. Check pod events:
   ```bash
   kubectl describe pod <pod-name> -n aizura-consortium
   ```

2. Check secrets exist:
   ```bash
   kubectl get secrets -n aizura-consortium
   ```

3. Check logs:
   ```bash
   kubectl logs <pod-name> -n aizura-consortium
   ```

### Image Pull Errors

Ensure GitHub Container Registry authentication:
```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=YOUR_GITHUB_TOKEN \
  --namespace=aizura-consortium
```

Then add to deployment spec:
```yaml
spec:
  imagePullSecrets:
  - name: ghcr-secret
```

### TLS Certificate Issues

Check cert-manager logs:
```bash
kubectl logs -n cert-manager deployment/cert-manager
```

Check certificate status:
```bash
kubectl describe certificate aizura-tls -n aizura-consortium
```

### Database Connection Issues

Verify Supabase credentials:
```bash
kubectl get secret aizura-secrets -n aizura-consortium -o jsonpath='{.data.supabase-url}' | base64 -d
```

Test from inside a pod:
```bash
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -n aizura-consortium -- sh
curl $SUPABASE_URL/rest/v1/
```

---

## Scaling

### Manual Scaling
```bash
# Scale backend
kubectl scale deployment aizura-backend --replicas=5 -n aizura-consortium

# Scale frontend
kubectl scale deployment aizura-frontend --replicas=10 -n aizura-consortium
```

### Adjust Autoscaling
Edit HPA:
```bash
kubectl edit hpa aizura-backend-hpa -n aizura-consortium
```

---

## Rollback

If deployment fails:

```bash
# View rollout history
kubectl rollout history deployment/aizura-backend -n aizura-consortium

# Rollback to previous version
kubectl rollout undo deployment/aizura-backend -n aizura-consortium
kubectl rollout undo deployment/aizura-frontend -n aizura-consortium
```

---

## Maintenance

### Update Application

1. Build new images with updated tag
2. Update manifests with new image tags
3. Apply manifests:
   ```bash
   kubectl apply -f manifests.prod.yaml
   ```

### Restart Deployments

```bash
kubectl rollout restart deployment/aizura-backend -n aizura-consortium
kubectl rollout restart deployment/aizura-frontend -n aizura-consortium
```

### Drain Node for Maintenance

```bash
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data
# Perform maintenance
kubectl uncordon <node-name>
```

---

## Security Considerations

- [ ] Enable Pod Security Standards
- [ ] Configure Network Policies
- [ ] Enable audit logging
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategy
- [ ] Implement rate limiting
- [ ] Review RBAC permissions
- [ ] Rotate secrets regularly
- [ ] Enable WAF on ingress (if available)
- [ ] Set up DDoS protection

---

## Success Criteria

Your deployment is successful when:

- [x] All pods are in `Running` state
- [x] Health checks passing
- [x] Frontend loads in browser
- [x] Backend API responds
- [x] Database connection works
- [x] TLS certificate issued
- [x] Domain resolves correctly
- [x] No errors in logs
- [x] Autoscaling configured
- [x] Monitoring in place

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Production URL:** https://aizura.yourdomain.com
**Status:** ⬜ Pending | ⬜ In Progress | ⬜ Complete

