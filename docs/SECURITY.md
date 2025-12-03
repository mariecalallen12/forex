# Security Best Practices

Hướng dẫn bảo mật cho hệ thống CME Trading Clone.

## 🔐 Secrets Management

### Development Environment

**Local Development:**
```bash
# Use .env files (gitignored)
cp services/api/.env.example services/api/.env
# Update with development values
```

**Docker Compose:**
```bash
# Secrets in .env files
cp .env.production.example .env.production
# Use weak passwords for development
```

### Production Environment

**Generate Strong Secrets:**
```bash
# Generate strong passwords (32 characters)
openssl rand -base64 32

# Generate JWT secrets (64 characters)
openssl rand -base64 64

# Generate UUID secrets
uuidgen
```

**Kubernetes Secrets:**
```bash
# 1. Update secrets file
vim infra/k8s/overlays/prod/secrets.env

# 2. Replace ALL placeholder values:
# - POSTGRES_PASSWORD
# - DATABASE_PASSWORD
# - JWT_SECRET
# - JWT_REFRESH_SECRET

# 3. Update Grafana password
vim infra/k8s/monitoring/grafana-deployment.yaml

# 4. Validate before deployment
./scripts/deploy-k8s.sh prod
# Script will check for placeholder values
```

**Recommended Secret Values:**

```env
# Database (minimum 16 characters)
POSTGRES_PASSWORD=$(openssl rand -base64 24)
DATABASE_PASSWORD=$(openssl rand -base64 24)

# JWT (minimum 32 characters)
JWT_SECRET=$(openssl rand -base64 48)
JWT_REFRESH_SECRET=$(openssl rand -base64 48)

# Grafana (minimum 12 characters)
GRAFANA_PASSWORD=$(openssl rand -base64 16)
```

### Using External Secret Managers

**HashiCorp Vault:**
```bash
# Store secrets in Vault
vault kv put secret/cme-trading \
  postgres_password="xxx" \
  jwt_secret="xxx"

# Use Vault CSI driver in K8s
# See: https://www.vaultproject.io/docs/platform/k8s
```

**AWS Secrets Manager:**
```bash
# Store secrets
aws secretsmanager create-secret \
  --name cme-trading/postgres \
  --secret-string '{"password":"xxx"}'

# Use External Secrets Operator
# See: https://external-secrets.io/
```

**Google Secret Manager:**
```bash
# Store secrets
gcloud secrets create postgres-password \
  --data-file=- <<< "xxx"

# Mount in pods
# See: https://cloud.google.com/secret-manager/docs/using-secret-manager-with-kubernetes
```

## 🛡️ Security Checklist

### Pre-deployment Checklist

- [ ] **All secrets replaced** with strong values (no placeholders)
- [ ] **JWT secrets** are at least 32 characters
- [ ] **Database passwords** are at least 16 characters
- [ ] **Grafana password** changed from default
- [ ] **Docker registry URLs** configured
- [ ] **CORS origins** set to actual domains
- [ ] **TLS/SSL certificates** configured
- [ ] **Network policies** enabled
- [ ] **RBAC** properly configured
- [ ] **Resource limits** set on all pods

### Production Security

#### 1. Network Security

**Enable Network Policies:**
```yaml
# infra/k8s/base/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-ingress
  namespace: cme-trading
spec:
  podSelector: {}
  policyTypes:
  - Ingress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api
  namespace: cme-trading
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: customer-web
    - podSelector:
        matchLabels:
          app: admin-web
    ports:
    - protocol: TCP
      port: 3001
```

#### 2. RBAC Configuration

**Principle of Least Privilege:**
```yaml
# infra/k8s/base/rbac.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: cme-trading
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list"]
```

#### 3. Pod Security Policies

**Enable Pod Security Standards:**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: cme-trading
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

#### 4. Container Security

**Run as Non-Root:**
```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  fsGroup: 1000
  capabilities:
    drop:
    - ALL
  readOnlyRootFilesystem: true
```

#### 5. Image Security

**Use Specific Tags:**
```yaml
# Bad
image: cme-api:latest

# Good
image: cme-api:1.0.0-sha-abc123
```

**Scan Images:**
```bash
# Trivy scan
trivy image cme-api:1.0.0

# Grype scan
grype cme-api:1.0.0
```

## 🔒 Application Security

### API Security

**Rate Limiting:**
- Configured in nginx-lb.yaml
- API: 100 req/s per IP
- Web: 200 req/s per IP

**CORS Configuration:**
```env
# Production
CORS_ORIGIN=https://app.cme-trading.com,https://admin.cme-trading.com

# Never use wildcard in production
CORS_ORIGIN=*  # ❌ DON'T DO THIS
```

**JWT Configuration:**
```env
# Short-lived access tokens
JWT_EXPIRATION=15m

# Longer refresh tokens
JWT_REFRESH_EXPIRATION=7d

# Strong secrets (64 chars)
JWT_SECRET=$(openssl rand -base64 48)
JWT_REFRESH_SECRET=$(openssl rand -base64 48)
```

### Database Security

**Connection Security:**
```env
# Use SSL in production
DATABASE_SSL=true
DATABASE_SSL_CA=/path/to/ca-cert.pem
```

**Access Control:**
```sql
-- Create application user with limited permissions
CREATE USER cme_app WITH PASSWORD 'strong_password';
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO cme_app;

-- Revoke dangerous permissions
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
```

**Backup Encryption:**
```bash
# Encrypt backups
pg_dump cme_trading | gpg --encrypt --recipient admin@cme.com > backup.sql.gpg

# Decrypt
gpg --decrypt backup.sql.gpg | psql cme_trading
```

## 🔍 Security Monitoring

### Enable Audit Logging

**API Audit:**
```typescript
// Log all sensitive operations
@Post('/order')
async createOrder(@Body() dto: CreateOrderDto, @Req() req) {
  await this.auditService.log({
    action: 'ORDER_CREATE',
    userId: req.user.id,
    ip: req.ip,
    data: dto
  });
  // ...
}
```

**Kubernetes Audit:**
```yaml
# Enable audit logging in API server
--audit-log-path=/var/log/kubernetes/audit.log
--audit-log-maxage=30
--audit-log-maxbackup=10
--audit-log-maxsize=100
```

### Security Alerts

**Prometheus Alerts:**
```yaml
# Unusual activity
- alert: HighFailedLoginAttempts
  expr: sum(rate(login_failed_total[5m])) > 10
  for: 5m
  severity: warning

- alert: UnusualAPIActivity
  expr: rate(http_requests_total[5m]) > 1000
  for: 10m
  severity: warning
```

## 🚨 Incident Response

### Security Incident Procedure

1. **Detect**: Monitor logs and alerts
2. **Contain**: Isolate affected systems
3. **Investigate**: Analyze logs and metrics
4. **Remediate**: Fix vulnerabilities
5. **Document**: Record incident details
6. **Review**: Update procedures

### Emergency Procedures

**Rotate Compromised Secrets:**
```bash
# 1. Generate new secrets
NEW_JWT_SECRET=$(openssl rand -base64 48)

# 2. Update Kubernetes secret
kubectl create secret generic cme-secrets-new \
  --from-literal=JWT_SECRET="$NEW_JWT_SECRET" \
  -n cme-trading

# 3. Rolling update deployments
kubectl rollout restart deployment/api -n cme-trading

# 4. Invalidate all sessions
redis-cli FLUSHDB
```

**Block IP Address:**
```bash
# Add to nginx config
kubectl edit configmap nginx-config -n cme-trading

# Add deny rule
deny 1.2.3.4;

# Reload nginx
kubectl rollout restart deployment/nginx-lb -n cme-trading
```

## 📋 Security Compliance

### Regular Security Tasks

**Daily:**
- [ ] Review security alerts
- [ ] Check failed login attempts
- [ ] Monitor unusual activity

**Weekly:**
- [ ] Review access logs
- [ ] Check security patches
- [ ] Scan container images

**Monthly:**
- [ ] Rotate access tokens
- [ ] Update dependencies
- [ ] Security audit review
- [ ] Penetration testing

**Quarterly:**
- [ ] Full security audit
- [ ] Disaster recovery drill
- [ ] Update security policies
- [ ] Security training

## 🔗 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Kubernetes Security Best Practices](https://kubernetes.io/docs/concepts/security/security-best-practices/)
- [Docker Security](https://docs.docker.com/engine/security/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Last Updated**: 2025-12-03  
**Version**: 1.0.0
