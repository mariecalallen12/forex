# Kubernetes Deployment Guide

Hướng dẫn triển khai hệ thống CME Trading Clone trên Kubernetes.

## 📋 Mục lục

- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cấu trúc Kubernetes](#cấu-trúc-kubernetes)
- [Triển khai cơ bản](#triển-khai-cơ-bản)
- [Triển khai Production](#triển-khai-production)
- [Monitoring & Logging](#monitoring--logging)
- [Scaling & High Availability](#scaling--high-availability)
- [Troubleshooting](#troubleshooting)

## Yêu cầu hệ thống

### Kubernetes Cluster

**Minimum:**
- Kubernetes 1.24+
- 3 worker nodes
- 4 CPU cores per node
- 8GB RAM per node
- 50GB disk per node

**Recommended:**
- Kubernetes 1.28+
- 5+ worker nodes
- 8 CPU cores per node
- 16GB RAM per node
- 100GB SSD per node

### Tools Required

```bash
# Kubectl
kubectl version --client

# Kustomize
kustomize version

# Helm (optional)
helm version
```

## Cấu trúc Kubernetes

```
infra/k8s/
├── base/                          # Base configurations
│   ├── namespace.yaml            # Namespace definition
│   ├── configmap.yaml            # Application config
│   ├── secrets.yaml              # Secrets (template)
│   ├── postgres-statefulset.yaml # PostgreSQL database
│   ├── redis-statefulset.yaml    # Redis cache
│   ├── api-deployment.yaml       # API backend
│   ├── realtime-deployment.yaml  # WebSocket service
│   ├── customer-web-deployment.yaml # Customer frontend
│   ├── admin-web-deployment.yaml # Admin frontend
│   ├── ingress.yaml              # Ingress routing
│   ├── hpa.yaml                  # Auto-scaling
│   ├── nginx-lb.yaml             # Load balancer
│   └── kustomization.yaml        # Kustomize config
├── overlays/
│   ├── dev/                      # Development overlay
│   └── prod/                     # Production overlay
│       ├── kustomization.yaml
│       ├── replicas.yaml         # Production replicas
│       ├── resources.yaml        # Resource limits
│       └── secrets.env           # Production secrets
└── monitoring/                    # Monitoring stack
    ├── prometheus-config.yaml
    ├── prometheus-deployment.yaml
    ├── grafana-deployment.yaml
    ├── grafana-dashboards.yaml
    └── node-exporter.yaml
```

## Triển khai cơ bản

### 1. Tạo Namespace

```bash
kubectl apply -f infra/k8s/base/namespace.yaml
```

### 2. Cấu hình Secrets

**Cập nhật secrets với giá trị thực:**

```bash
# Edit secrets file
vim infra/k8s/base/secrets.yaml

# Hoặc tạo từ command line
kubectl create secret generic cme-secrets \
  --namespace=cme-trading \
  --from-literal=POSTGRES_PASSWORD='your-strong-password' \
  --from-literal=JWT_SECRET='your-jwt-secret' \
  --from-literal=JWT_REFRESH_SECRET='your-refresh-secret'
```

### 3. Apply ConfigMaps

```bash
kubectl apply -f infra/k8s/base/configmap.yaml
```

### 4. Deploy Database Services

```bash
# PostgreSQL
kubectl apply -f infra/k8s/base/postgres-statefulset.yaml

# Redis
kubectl apply -f infra/k8s/base/redis-statefulset.yaml

# Verify
kubectl get pods -n cme-trading -l app=postgres
kubectl get pods -n cme-trading -l app=redis
```

### 5. Deploy Application Services

```bash
# API Backend
kubectl apply -f infra/k8s/base/api-deployment.yaml

# Realtime WebSocket
kubectl apply -f infra/k8s/base/realtime-deployment.yaml

# Customer Web
kubectl apply -f infra/k8s/base/customer-web-deployment.yaml

# Admin Web
kubectl apply -f infra/k8s/base/admin-web-deployment.yaml

# Verify all pods
kubectl get pods -n cme-trading
```

### 6. Configure Load Balancer

```bash
kubectl apply -f infra/k8s/base/nginx-lb.yaml

# Get Load Balancer IP
kubectl get svc nginx-lb-service -n cme-trading
```

### 7. Setup Ingress (Optional)

```bash
# Install Nginx Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.9.5/deploy/static/provider/cloud/deploy.yaml

# Apply ingress rules
kubectl apply -f infra/k8s/base/ingress.yaml
```

### 8. Enable Auto-scaling

```bash
kubectl apply -f infra/k8s/base/hpa.yaml

# Verify HPA
kubectl get hpa -n cme-trading
```

## Triển khai Production

### Sử dụng Kustomize

```bash
# 1. Update production secrets
vim infra/k8s/overlays/prod/secrets.env

# 2. Update image tags
vim infra/k8s/overlays/prod/kustomization.yaml

# 3. Build và preview
kubectl kustomize infra/k8s/overlays/prod

# 4. Apply production config
kubectl apply -k infra/k8s/overlays/prod

# 5. Verify deployment
kubectl get all -n cme-trading
```

### Database Migration

```bash
# Run migration job
kubectl run migration-job \
  --namespace=cme-trading \
  --image=cme-api:latest \
  --restart=Never \
  --command -- pnpm migration:run

# Check logs
kubectl logs -n cme-trading migration-job

# Cleanup
kubectl delete pod migration-job -n cme-trading
```

### DNS Configuration

Cấu hình DNS records trỏ đến Load Balancer IP:

```
A     api.cme-trading.com      -> <LB-IP>
A     app.cme-trading.com      -> <LB-IP>
A     admin.cme-trading.com    -> <LB-IP>
A     ws.cme-trading.com       -> <LB-IP>
```

### SSL/TLS Setup

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@cme-trading.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF

# Certificates will be auto-generated by ingress
```

## Monitoring & Logging

### Deploy Prometheus Stack

```bash
# 1. Deploy Prometheus
kubectl apply -f infra/k8s/monitoring/prometheus-config.yaml
kubectl apply -f infra/k8s/monitoring/prometheus-deployment.yaml

# 2. Deploy Node Exporter
kubectl apply -f infra/k8s/monitoring/node-exporter.yaml

# 3. Verify
kubectl get pods -n cme-trading -l app=prometheus
```

### Deploy Grafana

```bash
# 1. Deploy Grafana
kubectl apply -f infra/k8s/monitoring/grafana-deployment.yaml

# 2. Deploy Dashboards
kubectl apply -f infra/k8s/monitoring/grafana-dashboards.yaml

# 3. Get Grafana password
kubectl get secret grafana-secrets -n cme-trading -o jsonpath="{.data.admin-password}" | base64 --decode

# 4. Port forward to access
kubectl port-forward -n cme-trading svc/grafana-service 3000:3000
# Access: http://localhost:3000
```

### Access Prometheus

```bash
kubectl port-forward -n cme-trading svc/prometheus-service 9090:9090
# Access: http://localhost:9090
```

### View Metrics

- **Prometheus**: http://localhost:9090/targets
- **Grafana**: http://localhost:3000/dashboards
- **Alerts**: http://localhost:9090/alerts

### Logging Setup

```bash
# Install EFK Stack (optional)
# Elasticsearch + Fluentd + Kibana

# Or use cloud-native logging
kubectl logs -f -n cme-trading deployment/api
kubectl logs -f -n cme-trading deployment/realtime
```

## Scaling & High Availability

### Manual Scaling

```bash
# Scale API
kubectl scale deployment api -n cme-trading --replicas=5

# Scale Realtime
kubectl scale deployment realtime -n cme-trading --replicas=4

# Scale Frontend
kubectl scale deployment customer-web -n cme-trading --replicas=3
```

### Auto-scaling Configuration

HPA đã được cấu hình trong `hpa.yaml`:

```yaml
# API: 2-10 replicas (CPU 70%, Memory 80%)
# Realtime: 2-8 replicas (CPU 70%, Memory 80%)
# Customer Web: 2-6 replicas (CPU 75%, Memory 80%)
# Admin Web: 2-4 replicas (CPU 75%, Memory 80%)
```

### Cluster Autoscaling

```bash
# Configure cluster autoscaler (example for GKE)
gcloud container clusters update cme-cluster \
  --enable-autoscaling \
  --min-nodes 3 \
  --max-nodes 10 \
  --zone us-central1-a
```

### High Availability Checklist

- [x] Multiple replicas cho mọi service
- [x] Pod Anti-Affinity rules
- [x] Health checks (liveness + readiness)
- [x] PersistentVolumes cho stateful services
- [x] Auto-scaling enabled
- [x] Load balancer với session affinity
- [x] Backup strategies

## Troubleshooting

### Check Pod Status

```bash
# All pods
kubectl get pods -n cme-trading

# Specific pod details
kubectl describe pod <pod-name> -n cme-trading

# Pod logs
kubectl logs <pod-name> -n cme-trading

# Previous container logs (after crash)
kubectl logs <pod-name> -n cme-trading --previous
```

### Common Issues

#### 1. Pods không start

```bash
# Check events
kubectl get events -n cme-trading --sort-by='.lastTimestamp'

# Check pod details
kubectl describe pod <pod-name> -n cme-trading

# Common causes:
# - Image pull errors
# - Resource constraints
# - ConfigMap/Secret missing
```

#### 2. Service không accessible

```bash
# Check service
kubectl get svc -n cme-trading

# Check endpoints
kubectl get endpoints -n cme-trading

# Test connectivity
kubectl run test-pod --rm -it --image=busybox -n cme-trading -- sh
wget -O- http://api-service:3001/health
```

#### 3. Database connection issues

```bash
# Check PostgreSQL pod
kubectl logs -n cme-trading statefulset/postgres

# Connect to database
kubectl exec -it postgres-0 -n cme-trading -- psql -U postgres -d cme_trading

# Check secrets
kubectl get secret cme-secrets -n cme-trading -o yaml
```

#### 4. High CPU/Memory usage

```bash
# Check resource usage
kubectl top pods -n cme-trading
kubectl top nodes

# Adjust resource limits
kubectl edit deployment api -n cme-trading
```

#### 5. Ingress not working

```bash
# Check ingress
kubectl get ingress -n cme-trading

# Check ingress controller
kubectl get pods -n ingress-nginx

# Test without ingress
kubectl port-forward -n cme-trading svc/api-service 3001:3001
```

### Debug Commands

```bash
# Shell into pod
kubectl exec -it <pod-name> -n cme-trading -- sh

# Check DNS
kubectl run -it --rm debug --image=busybox --restart=Never -- nslookup api-service.cme-trading.svc.cluster.local

# Network test
kubectl run -it --rm debug --image=nicolaka/netshoot --restart=Never -- bash

# View all resources
kubectl get all -n cme-trading
```

### Rolling Updates

```bash
# Update image
kubectl set image deployment/api api=cme-api:v2.0.0 -n cme-trading

# Check rollout status
kubectl rollout status deployment/api -n cme-trading

# Rollback if needed
kubectl rollout undo deployment/api -n cme-trading

# View rollout history
kubectl rollout history deployment/api -n cme-trading
```

### Backup & Restore

```bash
# Backup PostgreSQL
kubectl exec postgres-0 -n cme-trading -- pg_dump -U postgres cme_trading > backup.sql

# Restore PostgreSQL
cat backup.sql | kubectl exec -i postgres-0 -n cme-trading -- psql -U postgres cme_trading

# Backup Redis
kubectl exec redis-0 -n cme-trading -- redis-cli BGSAVE
```

## Best Practices

1. **Always use namespaces** để tách biệt environments
2. **Set resource limits** cho tất cả containers
3. **Use health checks** (liveness + readiness)
4. **Enable monitoring** và alerting
5. **Regular backups** cho stateful data
6. **Use secrets** cho sensitive data
7. **Implement RBAC** cho access control
8. **Use GitOps** (ArgoCD/Flux) cho deployments
9. **Test rollbacks** trước khi production
10. **Monitor costs** và optimize resources

## Next Steps

- [ ] Setup CI/CD pipeline với ArgoCD
- [ ] Implement backup automation
- [ ] Configure log aggregation
- [ ] Setup alerting với PagerDuty/Slack
- [ ] Implement disaster recovery plan
- [ ] Security audit & penetration testing
- [ ] Performance optimization
- [ ] Cost optimization

## Support

- Documentation: `/docs`
- Issues: GitHub Issues
- Monitoring: Grafana dashboards
- Alerts: Prometheus alerts

---

**Last Updated**: 2025-12-03  
**Version**: 1.0.0
