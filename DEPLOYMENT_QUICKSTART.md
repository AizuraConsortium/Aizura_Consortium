# Deployment Quick Start

Quick reference for deploying the Aizura Consortium platform.

## Application Structure

```
Platform Architecture:
├── Frontend (Nginx) - Port 80
│   ├── / (root)       → Public Website     (website/)
│   ├── /admin         → Admin Portal       (admin/)
│   ├── /client        → Client Dashboard   (client/)
│   └── /dao           → DAO Portal         (dao/)
│
└── Backend (Node.js) - Port 3001
    ├── /api/admin     → Admin API
    ├── /api/client    → Client API
    ├── /api/dao       → DAO API
    └── /api/website   → Website API
```

## Local Development

Start all apps:
```bash
npm run dev:all
```

Individual apps:
```bash
npm run dev:client    # Port 5173
npm run dev:admin     # Port 5174
npm run dev:website   # Port 5175
npm run dev:dao       # Port 5177
npm run dev:backend   # Port 3001
```

## Build for Production

Build all apps:
```bash
npm run build
```

Output structure:
```
dist/
├── admin/       # Admin Portal static files
├── client/      # Client Dashboard static files
├── website/     # Public Website static files
├── dao/         # DAO Portal static files
└── backend/     # Backend compiled JS
```

## Docker Compose (Local Testing)

1. Create a root `.env` file with required variables:
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
GROK_API_KEY=your_grok_key
GEMINI_API_KEY=your_gemini_key
DEEPSEEK_API_KEY=your_deepseek_key
QWEN_API_KEY=your_qwen_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=/api
# ... other API keys
```

The Docker setup reads everything from this single root `.env` file.
`backend/.env` is not required for `docker compose`.

2. Build and run:
```bash
docker compose up --build
```

3. Access applications:
- Website: http://localhost
- Admin: http://localhost/admin
- Client: http://localhost/client
- DAO: http://localhost/dao

4. Stop:
```bash
docker compose down
```

## Docker Manual Build

Build images:
```bash
# Frontend (all 4 apps)
docker build -f Dockerfile.frontend -t aizura-frontend:latest .

# Backend
docker build -f Dockerfile.backend -t aizura-backend:latest .
```

Run containers:
```bash
# Backend
docker run -d \
  --name aizura-backend \
  -p 3001:3001 \
  -e SUPABASE_URL=$SUPABASE_URL \
  -e SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY \
  -e SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY \
  -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  -e GROK_API_KEY=$GROK_API_KEY \
  -e GEMINI_API_KEY=$GEMINI_API_KEY \
  -e DEEPSEEK_API_KEY=$DEEPSEEK_API_KEY \
  -e QWEN_API_KEY=$QWEN_API_KEY \
  aizura-backend:latest

# Frontend
docker run -d \
  --name aizura-frontend \
  -p 80:80 \
  aizura-frontend:latest
```

## Kubernetes Deployment

### Prerequisites

Required:
- Kubernetes cluster (1.21+)
- kubectl configured
- nginx-ingress controller
- cert-manager (for TLS)

### Quick Deploy

1. Create secrets:
```bash
kubectl create namespace aizura-consortium

kubectl create secret generic aizura-secrets \
  --namespace=aizura-consortium \
  --from-literal=supabase-url=$SUPABASE_URL \
  --from-literal=supabase-service-role-key=$SUPABASE_SERVICE_ROLE_KEY \
  --from-literal=anthropic-api-key=$ANTHROPIC_API_KEY \
  --from-literal=openai-api-key=$OPENAI_API_KEY \
  --from-literal=grok-api-key=$GROK_API_KEY \
  --from-literal=gemini-api-key=$GEMINI_API_KEY \
  --from-literal=deepseek-api-key=$DEEPSEEK_API_KEY \
  --from-literal=qwen-api-key=$QWEN_API_KEY \
  --from-literal=webhook-proposal-secret=$WEBHOOK_PROPOSAL_SECRET
```

2. Update manifests:
```bash
# Edit manifests.prod.yaml
# - Change image paths (lines 34, 161)
# - Update domain name (line 241)
```

3. Deploy:
```bash
kubectl apply -f manifests.prod.yaml
```

4. Verify:
```bash
kubectl get pods -n aizura-consortium
kubectl get svc -n aizura-consortium
kubectl get ingress -n aizura-consortium
```

### Check Deployment Status

```bash
# Backend logs
kubectl logs -f -n aizura-consortium -l app=aizura-backend

# Frontend logs
kubectl logs -f -n aizura-consortium -l app=aizura-frontend

# All pods status
kubectl get pods -n aizura-consortium -w
```

### Scale Deployments

```bash
# Scale backend
kubectl scale deployment aizura-backend --replicas=5 -n aizura-consortium

# Scale frontend
kubectl scale deployment aizura-frontend --replicas=10 -n aizura-consortium
```

## Health Checks

Test endpoints:
```bash
# Backend health
curl http://localhost:3001/health

# Frontend health (direct nginx)
curl http://localhost/health

# Production
curl https://your-domain.com/api/health
curl https://your-domain.com/health
```

## Environment Variables

Required for backend:
```bash
# Database
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ANON_KEY

# AI Providers
ANTHROPIC_API_KEY
OPENAI_API_KEY
GROK_API_KEY
GEMINI_API_KEY
DEEPSEEK_API_KEY
QWEN_API_KEY

# Configuration
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://your-domain.com
```

## Troubleshooting

### Build fails
```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

### Docker build fails
```bash
# Clean Docker cache
docker builder prune -a
docker compose build --no-cache
```

### Kubernetes pods not starting
```bash
# Check pod status
kubectl describe pod <pod-name> -n aizura-consortium

# Check events
kubectl get events -n aizura-consortium --sort-by='.lastTimestamp'

# Check logs
kubectl logs <pod-name> -n aizura-consortium
```

### Cannot access apps
```bash
# Check nginx config
kubectl exec -it <frontend-pod> -n aizura-consortium -- cat /etc/nginx/conf.d/default.conf

# Test backend from frontend pod
kubectl exec -it <frontend-pod> -n aizura-consortium -- wget -O- http://backend:3001/health
```

## CI/CD

GitHub Actions workflow in `.github/workflows/build-k8s.yaml`:
- Runs on push to `main` or `develop`
- Builds and pushes Docker images to GHCR
- Deploys to production (main branch)
- Deploys to staging (develop branch)

Required GitHub Secrets:
- `KUBE_CONFIG` - Base64 encoded kubeconfig
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- All AI provider API keys

## Port Reference

| Service | Port | URL |
|---------|------|-----|
| Website Dev | 5173 | http://localhost:5173 |
| Admin Dev | 5174 | http://localhost:5174 |
| Client Dev | 5175 | http://localhost:5175 |
| DAO Dev | 5177 | http://localhost:5177 |
| Backend Dev | 3001 | http://localhost:3001 |
| Frontend Prod | 80 | http://localhost |
| Backend Prod | 3001 | (internal) |

## File Reference

| File | Purpose |
|------|---------|
| `Dockerfile.frontend` | Builds all 4 frontend apps |
| `Dockerfile.backend` | Builds backend API |
| `docker-compose.yml` | Local Docker testing |
| `nginx.conf` | Nginx routing configuration |
| `manifests.prod.yaml` | Kubernetes deployment manifests |
| `build-k8s.yaml` | GitHub Actions CI/CD workflow |
| `DEPLOYMENT.md` | Full deployment documentation |

## Next Steps

After deployment:
1. Configure DNS to point to your ingress
2. Set up monitoring (Prometheus/Grafana)
3. Configure log aggregation
4. Set up backup procedures
5. Test disaster recovery
6. Implement security scanning
7. Set up alerts

For detailed information, see `DEPLOYMENT.md`.
