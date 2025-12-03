# Infrastructure Documentation

Tài liệu hạ tầng cho hệ thống CME Trading Clone.

## 📁 Cấu trúc

```
infra/
├── k8s/                          # Kubernetes configurations
│   ├── base/                     # Base manifests
│   │   ├── namespace.yaml        # Namespace
│   │   ├── configmap.yaml        # Configuration
│   │   ├── secrets.yaml          # Secrets template
│   │   ├── postgres-statefulset.yaml
│   │   ├── redis-statefulset.yaml
│   │   ├── api-deployment.yaml
│   │   ├── realtime-deployment.yaml
│   │   ├── customer-web-deployment.yaml
│   │   ├── admin-web-deployment.yaml
│   │   ├── ingress.yaml          # Routing
│   │   ├── hpa.yaml              # Auto-scaling
│   │   ├── nginx-lb.yaml         # Load balancer
│   │   └── kustomization.yaml
│   ├── overlays/                 # Environment overlays
│   │   ├── dev/                  # Development
│   │   └── prod/                 # Production
│   │       ├── kustomization.yaml
│   │       ├── replicas.yaml
│   │       ├── resources.yaml
│   │       └── secrets.env
│   └── monitoring/               # Monitoring stack
│       ├── prometheus-config.yaml
│       ├── prometheus-deployment.yaml
│       ├── grafana-deployment.yaml
│       ├── grafana-dashboards.yaml
│       └── node-exporter.yaml
└── README.md                     # This file
```

## 🚀 Quick Start

### Docker Compose (Development)

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Docker Compose (Production)

```bash
# Setup environment
cp .env.production.example .env.production
vim .env.production  # Update values

# Build and start
docker-compose -f docker-compose.prod.yml up -d

# Check health
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f api

# Stop
docker-compose -f docker-compose.prod.yml down
```

### Kubernetes

```bash
# Deploy to Kubernetes
kubectl apply -k infra/k8s/overlays/prod

# Check status
kubectl get all -n cme-trading

# View logs
kubectl logs -f -n cme-trading deployment/api

# Port forward for testing
kubectl port-forward -n cme-trading svc/api-service 3001:3001
```

## 📦 Services

### Application Services

| Service | Port | Description |
|---------|------|-------------|
| API | 3001 | Backend REST API (NestJS) |
| Realtime | 3003 | WebSocket service for live updates |
| Customer Web | 3000 | Customer-facing frontend (Next.js) |
| Admin Web | 3002 | Admin dashboard (Next.js) |

### Infrastructure Services

| Service | Port | Description |
|---------|------|-------------|
| PostgreSQL | 5432 | Primary database |
| Redis | 6379 | Cache and session store |
| Prometheus | 9090 | Metrics collection |
| Grafana | 3000 | Metrics visualization |
| Nginx | 80/443 | Load balancer & reverse proxy |

## 🔧 Configuration

### Environment Variables

**API Service:**
```env
NODE_ENV=production
PORT=3001
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=cme_trading
DATABASE_USER=postgres
DATABASE_PASSWORD=<secret>
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=<secret>
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=<secret>
JWT_REFRESH_EXPIRATION=30d
CORS_ORIGIN=http://localhost:3000,http://localhost:3002
```

**Frontend Services:**
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://api:3001
NEXT_PUBLIC_WS_URL=http://realtime:3003
```

### Secrets Management

**Development:**
- Secrets in `.env` files (gitignored)

**Production:**
- Kubernetes Secrets
- HashiCorp Vault (recommended)
- Cloud provider secrets (AWS Secrets Manager, GCP Secret Manager)

## 📊 Monitoring

### Prometheus

**Access:**
```bash
# Kubernetes
kubectl port-forward -n cme-trading svc/prometheus-service 9090:9090

# Docker Compose (add to docker-compose.yml)
```

**Metrics endpoints:**
- API: http://api:3001/metrics
- Realtime: http://realtime:3003/metrics

### Grafana

**Access:**
```bash
# Kubernetes
kubectl port-forward -n cme-trading svc/grafana-service 3000:3000

# Login: admin / <check-secret>
```

**Pre-configured dashboards:**
- System Overview
- API Performance
- WebSocket Connections
- Database Metrics
- Infrastructure Health

### Alerts

**Configured alerts:**
- High CPU Usage (>80% for 5m)
- High Memory Usage (>85% for 5m)
- Service Down (2m)
- High Error Rate (>5% for 5m)
- Database Connection Issues
- High Response Time (>1s p95)

## 🔐 Security

### Network Policies

```bash
# Apply network policies
kubectl apply -f infra/k8s/base/network-policies.yaml
```

### RBAC

```bash
# Apply RBAC rules
kubectl apply -f infra/k8s/base/rbac.yaml
```

### SSL/TLS

**Production:**
- Use cert-manager for automatic SSL certificates
- Configure in ingress.yaml

**Development:**
- Self-signed certificates
- HTTP only

## 📈 Scaling

### Manual Scaling

**Docker Compose:**
```bash
docker-compose up -d --scale api=3 --scale realtime=2
```

**Kubernetes:**
```bash
kubectl scale deployment api -n cme-trading --replicas=5
kubectl scale deployment realtime -n cme-trading --replicas=3
```

### Auto-scaling

**Kubernetes HPA:**
- API: 2-10 replicas (CPU 70%, Memory 80%)
- Realtime: 2-8 replicas (CPU 70%, Memory 80%)
- Customer Web: 2-6 replicas (CPU 75%, Memory 80%)
- Admin Web: 2-4 replicas (CPU 75%, Memory 80%)

**Cluster Autoscaler:**
```bash
# Configure based on cloud provider
# GKE, EKS, AKS support cluster autoscaling
```

## 🗄️ Data Management

### Backups

**PostgreSQL:**
```bash
# Kubernetes
kubectl exec postgres-0 -n cme-trading -- pg_dump -U postgres cme_trading > backup.sql

# Docker
docker exec cme-postgres pg_dump -U postgres cme_trading > backup.sql
```

**Redis:**
```bash
# Kubernetes
kubectl exec redis-0 -n cme-trading -- redis-cli BGSAVE

# Docker
docker exec cme-redis redis-cli BGSAVE
```

### Restore

```bash
# PostgreSQL
cat backup.sql | kubectl exec -i postgres-0 -n cme-trading -- psql -U postgres cme_trading

# Redis
kubectl exec -i redis-0 -n cme-trading -- redis-cli --pipe < redis-backup.rdb
```

### Migrations

```bash
# Run migrations
kubectl run migration-job \
  --namespace=cme-trading \
  --image=cme-api:latest \
  --restart=Never \
  --command -- pnpm migration:run

# Check status
kubectl logs -n cme-trading migration-job
```

## 🚨 Troubleshooting

### Common Issues

**1. Service not starting**
```bash
# Check logs
kubectl logs -f <pod-name> -n cme-trading
docker-compose logs <service>

# Check events
kubectl describe pod <pod-name> -n cme-trading
```

**2. Database connection failed**
```bash
# Verify database is running
kubectl get pods -n cme-trading -l app=postgres
docker-compose ps postgres

# Test connection
kubectl exec -it postgres-0 -n cme-trading -- psql -U postgres
```

**3. High memory usage**
```bash
# Check resource usage
kubectl top pods -n cme-trading
docker stats

# Adjust resource limits
kubectl edit deployment api -n cme-trading
```

**4. Ingress not working**
```bash
# Check ingress
kubectl get ingress -n cme-trading
kubectl describe ingress cme-ingress -n cme-trading

# Check ingress controller
kubectl get pods -n ingress-nginx
```

### Debug Commands

```bash
# Shell into container
kubectl exec -it <pod-name> -n cme-trading -- sh
docker exec -it <container-name> sh

# Network test
kubectl run -it --rm debug --image=nicolaka/netshoot --restart=Never -- bash

# Check DNS
nslookup api-service.cme-trading.svc.cluster.local

# Check endpoints
kubectl get endpoints -n cme-trading
```

## 📚 Documentation

- [Kubernetes Guide](../docs/KUBERNETES.md)
- [Monitoring Guide](../docs/MONITORING.md)
- [Deployment Guide](../docs/DEPLOYMENT.md)
- [API Documentation](../docs/API.md)

## 🔄 CI/CD

### GitHub Actions Workflows

**CI Workflow (`.github/workflows/ci.yml`):**
- Lint code
- Build all packages
- Run tests
- Security scan

**Deploy Workflow (`.github/workflows/deploy.yml`):**
- Build Docker images
- Push to registry
- Deploy to Kubernetes
- Health check

### Manual Deployment

```bash
# Build images
docker build -t cme-api:latest -f services/api/Dockerfile .
docker build -t cme-realtime:latest -f services/realtime/Dockerfile .
docker build -t cme-customer-web:latest -f apps/customer-web/Dockerfile .
docker build -t cme-admin-web:latest -f apps/admin-web/Dockerfile .

# Push to registry
docker push your-registry/cme-api:latest
docker push your-registry/cme-realtime:latest
docker push your-registry/cme-customer-web:latest
docker push your-registry/cme-admin-web:latest

# Deploy
kubectl apply -k infra/k8s/overlays/prod
```

## 🎯 Best Practices

1. **Use namespaces** for environment isolation
2. **Set resource limits** on all containers
3. **Enable monitoring** and alerting
4. **Regular backups** of stateful data
5. **Use secrets** for sensitive data
6. **Implement health checks** on all services
7. **Use GitOps** for deployments
8. **Test rollbacks** regularly
9. **Document runbooks** for incidents
10. **Monitor costs** and optimize resources

## 📞 Support

- **Documentation**: `/docs`
- **Issues**: GitHub Issues
- **Monitoring**: Grafana dashboards
- **Alerts**: Prometheus alerts

---

**Last Updated**: 2025-12-03  
**Version**: 1.0.0
