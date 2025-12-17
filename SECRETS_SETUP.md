# Kubernetes Secrets Setup Guide

## Quick Reference for Setting Up Secrets

### Method 1: Using kubectl create secret (Recommended)

```bash
kubectl create secret generic aizura-secrets \
  --from-literal=supabase-url="https://your-project.supabase.co" \
  --from-literal=supabase-service-role-key="eyJhbGc..." \
  --from-literal=anthropic-api-key="sk-ant-..." \
  --from-literal=openai-api-key="sk-..." \
  --from-literal=grok-api-key="xai-..." \
  --from-literal=gemini-api-key="AIza..." \
  --from-literal=deepseek-api-key="sk-..." \
  --from-literal=qwen-api-key="sk-..." \
  --namespace=aizura-consortium
```

### Method 2: Using YAML file (for GitOps)

⚠️ **WARNING:** Never commit secrets to Git! Use sealed-secrets or external secret management.

Create `secrets.yaml` (DO NOT COMMIT):

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: aizura-secrets
  namespace: aizura-consortium
type: Opaque
stringData:
  supabase-url: "https://your-project.supabase.co"
  supabase-service-role-key: "eyJhbGc..."
  anthropic-api-key: "sk-ant-..."
  openai-api-key: "sk-..."
  grok-api-key: "xai-..."
  gemini-api-key: "AIza..."
  deepseek-api-key: "sk-..."
  qwen-api-key: "sk-..."
```

Apply:
```bash
kubectl apply -f secrets.yaml
```

### Method 3: Using Base64 encoded values

If you need to use `data` instead of `stringData`:

```bash
echo -n "your-secret-value" | base64
```

Then use in YAML:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: aizura-secrets
  namespace: aizura-consortium
type: Opaque
data:
  supabase-url: "aHR0cHM6Ly95b3VyLXByb2plY3Quc3VwYWJhc2UuY28="  # base64 encoded
  # ... more base64 encoded values
```

### Method 4: GitHub Actions (Automated)

Set these as GitHub Repository Secrets:
1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret:

Required secrets:
- `KUBE_CONFIG` - Base64 encoded kubeconfig file
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`
- `GROK_API_KEY`
- `GEMINI_API_KEY`
- `DEEPSEEK_API_KEY`
- `QWEN_API_KEY`

The GitHub Actions workflow will automatically create the Kubernetes secrets during deployment.

---

## Verifying Secrets

Check if secrets exist:
```bash
kubectl get secrets -n aizura-consortium
```

View secret keys (not values):
```bash
kubectl describe secret aizura-secrets -n aizura-consortium
```

Decode a secret value (for debugging):
```bash
kubectl get secret aizura-secrets -n aizura-consortium -o jsonpath='{.data.supabase-url}' | base64 -d
```

---

## Updating Secrets

To update an existing secret:

```bash
kubectl delete secret aizura-secrets -n aizura-consortium
# Then recreate with new values
kubectl create secret generic aizura-secrets --from-literal=...
```

Or patch specific keys:
```bash
kubectl patch secret aizura-secrets -n aizura-consortium \
  -p='{"stringData":{"openai-api-key":"new-key-value"}}'
```

---

## Security Best Practices

1. **Never commit secrets to Git**
   - Add `secrets.yaml` to `.gitignore`
   - Use `.env` files only for local development

2. **Use external secret management** (Recommended for production)
   - [External Secrets Operator](https://external-secrets.io/)
   - [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets)
   - Cloud provider secret managers (AWS Secrets Manager, GCP Secret Manager, Azure Key Vault)

3. **Rotate secrets regularly**
   - API keys should be rotated every 90 days
   - Service role keys should be rotated every 180 days

4. **Use RBAC to restrict secret access**
   - Limit which service accounts can read secrets
   - Use separate namespaces for different environments

5. **Enable audit logging**
   - Track who accesses secrets
   - Monitor for suspicious activity

---

## Troubleshooting

### Pods not starting due to missing secrets

Error: `Error: Secret "aizura-secrets" not found`

Solution:
```bash
# Check if secret exists
kubectl get secrets -n aizura-consortium

# If missing, create it
kubectl create secret generic aizura-secrets ...
```

### Invalid secret format

Error: `error: error parsing secrets.yaml: error converting YAML to JSON`

Solution:
- Ensure YAML is properly formatted
- Check for special characters that need escaping
- Use `stringData` instead of `data` to avoid base64 encoding issues

### Secret not updating in pods

After updating a secret, pods need to be restarted:

```bash
kubectl rollout restart deployment/aizura-backend -n aizura-consortium
kubectl rollout restart deployment/aizura-frontend -n aizura-consortium
```
