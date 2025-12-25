# Production Deployment Guide

This guide covers deploying the Aizura Consortium platform to production using Docker and Kubernetes.

## Architecture Overview

The platform consists of:

### Frontend Applications (Nginx)
- **Public Website** (`/`) - Main public-facing site
- **Admin Portal** (`/admin`) - Administrative dashboard
- **Client Dashboard** (`/client`) - User dashboard
- **DAO Portal** (`/dao`) - Governance and treasury portal

### Backend API (Node.js/Express)
- Serves all API endpoints on port 3001
- Connects to Supabase for data persistence
- Integrates with multiple AI providers

### Database
- Supabase (PostgreSQL) - Managed database service

## Building Docker Images

### Frontend Image

```bash
docker build -f Dockerfile.frontend -t aizura-frontend:latest .
```

This builds all four frontend applications:
- admin
- client
- website
- dao

### Backend Image

```bash
docker build -f Dockerfile.backend -t aizura-backend:latest .
```

## Local Testing with Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  backend:
    image: aizura-backend:latest
    container_name: aizura-backend
    ports:
      - "3001:3001"
    environment:
      - PORT=3001
      - NODE_ENV=production
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3001/health"]
      interval: 30s
      timeout: 5s
      retries: 3

  frontend:
    image: aizura-frontend:latest
    container_name: aizura-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 3s
      retries: 3
```

Run:
```bash
docker-compose up -d
```

Access:
- Website: http://localhost
- Admin: http://localhost/admin
- Client: http://localhost/client
- DAO: http://localhost/dao

## Kubernetes Deployment

### Prerequisites

1. Kubernetes cluster (1.21+)
2. kubectl configured
3. nginx-ingress controller installed
4. cert-manager installed (for TLS)

### Create Secrets

```bash
kubectl create namespace aizura-consortium

kubectl create secret generic aizura-secrets \
  --namespace=aizura-consortium \
  --from-literal=supabase-url=${SUPABASE_URL} \
  --from-literal=supabase-service-role-key=${SUPABASE_SERVICE_ROLE_KEY} \
  --from-literal=anthropic-api-key=${ANTHROPIC_API_KEY} \
  --from-literal=openai-api-key=${OPENAI_API_KEY} \
  --from-literal=grok-api-key=${GROK_API_KEY} \
  --from-literal=gemini-api-key=${GEMINI_API_KEY} \
  --from-literal=deepseek-api-key=${DEEPSEEK_API_KEY} \
  --from-literal=qwen-api-key=${QWEN_API_KEY}
```

### Update Image Registry

Edit `manifests.prod.yaml` and update image paths:

```yaml
# Change from:
image: ghcr.io/your-org/aizura-backend:latest

# To:
image: your-registry.com/your-org/aizura-backend:latest
```

### Update Domain

Update the domain name in `manifests.prod.yaml`:

```yaml
# Change from:
- host: aizura.yourdomain.com

# To:
- host: your-actual-domain.com
```

### Deploy

```bash
kubectl apply -f manifests.prod.yaml
```

### Verify Deployment

```bash
# Check pods
kubectl get pods -n aizura-consortium

# Check services
kubectl get svc -n aizura-consortium

# Check ingress
kubectl get ingress -n aizura-consortium

# Check logs
kubectl logs -n aizura-consortium -l app=aizura-backend --tail=100
kubectl logs -n aizura-consortium -l app=aizura-frontend --tail=100
```

## Application Routes

### Frontend Routes
- `/` - Public Website
- `/admin` - Admin Portal (requires authentication)
- `/client` - Client Dashboard (requires authentication)
- `/dao` - DAO Portal (public read, auth for actions)

### API Routes
- `/api/admin/*` - Admin API endpoints
- `/api/client/*` - Client API endpoints
- `/api/dao/*` - DAO API endpoints
- `/api/website/*` - Website API endpoints
- `/api/health` - Health check endpoint

## Nginx Configuration

The nginx.conf handles:

1. **SPA Routing**: Each app has proper fallback to index.html
2. **API Proxying**: All /api requests forwarded to backend:3001
3. **Caching**:
   - Static assets cached for 1 year
   - index.html never cached
4. **Security Headers**: X-Frame-Options, CSP, etc.
5. **Compression**: Gzip enabled for text/js/css

## Scaling

### Horizontal Pod Autoscaling

The manifests include HPA configurations:

**Backend HPA**:
- Min: 2 replicas
- Max: 10 replicas
- Target CPU: 70%
- Target Memory: 80%

**Frontend HPA**:
- Min: 3 replicas
- Max: 20 replicas
- Target CPU: 70%

### Manual Scaling

```bash
# Scale backend
kubectl scale deployment aizura-backend --replicas=5 -n aizura-consortium

# Scale frontend
kubectl scale deployment aizura-frontend --replicas=10 -n aizura-consortium
```

## Monitoring

### Health Checks

```bash
# Backend health
curl https://your-domain.com/api/health

# Frontend health
curl https://your-domain.com/health
```

### Logs

```bash
# Stream backend logs
kubectl logs -f -n aizura-consortium -l app=aizura-backend

# Stream frontend logs
kubectl logs -f -n aizura-consortium -l app=aizura-frontend
```

### Metrics

If using Prometheus:

```bash
kubectl get --raw /metrics -n aizura-consortium
```

## Rollback

```bash
# View deployment history
kubectl rollout history deployment/aizura-backend -n aizura-consortium

# Rollback to previous version
kubectl rollout undo deployment/aizura-backend -n aizura-consortium

# Rollback to specific revision
kubectl rollout undo deployment/aizura-backend --to-revision=2 -n aizura-consortium
```

## Updating

### Rolling Update

1. Build new images with version tags:
```bash
docker build -f Dockerfile.frontend -t aizura-frontend:v1.1.0 .
docker build -f Dockerfile.backend -t aizura-backend:v1.1.0 .
```

2. Push to registry:
```bash
docker push your-registry.com/aizura-frontend:v1.1.0
docker push your-registry.com/aizura-backend:v1.1.0
```

3. Update deployment:
```bash
kubectl set image deployment/aizura-backend \
  backend=your-registry.com/aizura-backend:v1.1.0 \
  -n aizura-consortium

kubectl set image deployment/aizura-frontend \
  frontend=your-registry.com/aizura-frontend:v1.1.0 \
  -n aizura-consortium
```

4. Monitor rollout:
```bash
kubectl rollout status deployment/aizura-backend -n aizura-consortium
kubectl rollout status deployment/aizura-frontend -n aizura-consortium
```

## Troubleshooting

### Pod Not Starting

```bash
# Describe pod
kubectl describe pod <pod-name> -n aizura-consortium

# Check events
kubectl get events -n aizura-consortium --sort-by='.lastTimestamp'
```

### Backend Connection Issues

```bash
# Check backend service
kubectl get svc aizura-backend -n aizura-consortium

# Test backend connectivity from frontend pod
kubectl exec -it <frontend-pod> -n aizura-consortium -- wget -O- http://backend:3001/health
```

### Ingress Not Working

```bash
# Check ingress
kubectl describe ingress aizura-ingress -n aizura-consortium

# Check ingress controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller
```

## Security Considerations

1. **Secrets Management**: Use sealed-secrets or external secret management
2. **Network Policies**: Implement network policies to restrict pod communication
3. **RBAC**: Set up proper role-based access control
4. **Pod Security**: Enable Pod Security Standards
5. **TLS**: Always use HTTPS in production with valid certificates
6. **Rate Limiting**: Configure rate limiting at ingress level
7. **WAF**: Consider Web Application Firewall for additional protection

## Backup and Disaster Recovery

### Database Backups
- Supabase provides automated backups
- Configure backup retention policy in Supabase dashboard
- Test restore procedures regularly

### Configuration Backups
```bash
# Export current configuration
kubectl get all,configmap,secret,ingress -n aizura-consortium -o yaml > backup.yaml
```

## Performance Optimization

1. **CDN**: Use CloudFlare or similar CDN for static assets
2. **Database**: Enable connection pooling in Supabase
3. **Caching**: Implement Redis for API response caching
4. **Image Optimization**: Use smaller base images
5. **Resource Limits**: Tune resource requests/limits based on actual usage

## Cost Optimization

1. Use spot/preemptible instances for non-critical workloads
2. Implement cluster autoscaling
3. Right-size pod resource requests
4. Use horizontal pod autoscaling
5. Monitor and optimize database queries
