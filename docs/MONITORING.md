# Monitoring & Observability Guide

Hướng dẫn thiết lập và sử dụng hệ thống monitoring cho CME Trading Clone.

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Prometheus Setup](#prometheus-setup)
- [Grafana Dashboards](#grafana-dashboards)
- [Alert Rules](#alert-rules)
- [Logging](#logging)
- [Metrics Reference](#metrics-reference)
- [Troubleshooting](#troubleshooting)

## Tổng quan

### Stack Monitoring

```
┌─────────────────────────────────────────────┐
│           Application Layer                  │
│  API | Realtime | Customer Web | Admin Web  │
└──────────────┬──────────────────────────────┘
               │ Metrics
               ↓
┌─────────────────────────────────────────────┐
│           Prometheus                         │
│  - Collect metrics (15s interval)           │
│  - Store time-series data (30 days)         │
│  - Evaluate alert rules                     │
└──────────────┬──────────────────────────────┘
               │ Query
               ↓
┌─────────────────────────────────────────────┐
│           Grafana                            │
│  - Visualize metrics                        │
│  - Custom dashboards                        │
│  - Real-time monitoring                     │
└─────────────────────────────────────────────┘
```

### Components

1. **Prometheus** - Metrics collection & storage
2. **Grafana** - Visualization & dashboards
3. **Node Exporter** - System metrics
4. **Postgres Exporter** - Database metrics
5. **Redis Exporter** - Cache metrics
6. **AlertManager** - Alert management

## Prometheus Setup

### Deploy Prometheus

```bash
# 1. Apply configuration
kubectl apply -f infra/k8s/monitoring/prometheus-config.yaml

# 2. Deploy Prometheus
kubectl apply -f infra/k8s/monitoring/prometheus-deployment.yaml

# 3. Verify deployment
kubectl get pods -n cme-trading -l app=prometheus
kubectl get svc -n cme-trading prometheus-service
```

### Access Prometheus UI

```bash
# Port forward
kubectl port-forward -n cme-trading svc/prometheus-service 9090:9090

# Open browser
open http://localhost:9090
```

### Prometheus Endpoints

- **Web UI**: http://localhost:9090
- **Targets**: http://localhost:9090/targets
- **Alerts**: http://localhost:9090/alerts
- **Graph**: http://localhost:9090/graph
- **Config**: http://localhost:9090/config

### Configuration

Prometheus config được định nghĩa trong `prometheus-config.yaml`:

```yaml
global:
  scrape_interval: 15s      # Collect metrics every 15s
  evaluation_interval: 15s  # Evaluate rules every 15s

scrape_configs:
  - job_name: 'cme-api'
  - job_name: 'cme-realtime'
  - job_name: 'postgres'
  - job_name: 'redis'
  - job_name: 'node-exporter'
```

## Grafana Dashboards

### Deploy Grafana

```bash
# 1. Deploy Grafana
kubectl apply -f infra/k8s/monitoring/grafana-deployment.yaml

# 2. Deploy pre-configured dashboards
kubectl apply -f infra/k8s/monitoring/grafana-dashboards.yaml

# 3. Get admin password
kubectl get secret grafana-secrets -n cme-trading -o jsonpath="{.data.admin-password}" | base64 --decode
```

### Access Grafana

```bash
# Port forward
kubectl port-forward -n cme-trading svc/grafana-service 3000:3000

# Login
# URL: http://localhost:3000
# Username: admin
# Password: (from secret above)
```

### Available Dashboards

#### 1. CME Trading - System Overview

**Panels:**
- API Request Rate
- API Response Time (p95)
- API Error Rate
- Active WebSocket Connections
- CPU Usage by Service
- Memory Usage by Service
- PostgreSQL Connections
- Redis Memory Usage

**Access:** Dashboards → CME Trading → System Overview

#### 2. Infrastructure Metrics

**Panels:**
- Node CPU Usage
- Node Memory Usage
- Disk I/O
- Network Traffic
- Pod Resource Usage

#### 3. Application Performance

**Panels:**
- HTTP Request Duration
- HTTP Request Rate by Endpoint
- Error Rate by Endpoint
- Database Query Duration
- Cache Hit Rate

### Create Custom Dashboard

1. Login to Grafana
2. Click "+" → "Dashboard"
3. Add Panel
4. Select data source: Prometheus
5. Write PromQL query
6. Configure visualization
7. Save dashboard

**Example PromQL queries:**

```promql
# Total requests per second
rate(http_requests_total[5m])

# 95th percentile response time
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Error rate percentage
(sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))) * 100

# CPU usage
rate(container_cpu_usage_seconds_total{namespace="cme-trading"}[5m])

# Memory usage
container_memory_usage_bytes{namespace="cme-trading"}
```

## Alert Rules

### Configured Alerts

Alerts được định nghĩa trong `prometheus-config.yaml`:

#### 1. High CPU Usage

```yaml
- alert: HighCPUUsage
  expr: (100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)) > 80
  for: 5m
  severity: warning
```

#### 2. High Memory Usage

```yaml
- alert: HighMemoryUsage
  expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100 > 85
  for: 5m
  severity: warning
```

#### 3. Service Down

```yaml
- alert: APIServiceDown
  expr: up{job="cme-api"} == 0
  for: 2m
  severity: critical
```

#### 4. High Error Rate

```yaml
- alert: HighErrorRate
  expr: (sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))) * 100 > 5
  for: 5m
  severity: warning
```

### View Active Alerts

```bash
# In Prometheus UI
open http://localhost:9090/alerts

# Via command line
curl http://localhost:9090/api/v1/alerts | jq
```

### Configure Alert Notifications

**Slack Integration:**

```yaml
# alertmanager.yaml
receivers:
  - name: 'slack'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL'
        channel: '#alerts'
        title: 'CME Trading Alert'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
```

**Email Integration:**

```yaml
receivers:
  - name: 'email'
    email_configs:
      - to: 'ops@cme-trading.com'
        from: 'alerts@cme-trading.com'
        smarthost: 'smtp.gmail.com:587'
        auth_username: 'alerts@cme-trading.com'
        auth_password: 'your-password'
```

## Logging

### Application Logs

**View logs:**

```bash
# API logs
kubectl logs -f -n cme-trading deployment/api

# Realtime logs
kubectl logs -f -n cme-trading deployment/realtime

# All pods with label
kubectl logs -f -n cme-trading -l app=api

# Previous container (after crash)
kubectl logs -n cme-trading <pod-name> --previous
```

### Centralized Logging

**Option 1: EFK Stack (Elasticsearch + Fluentd + Kibana)**

```bash
# Install Elasticsearch
helm install elasticsearch elastic/elasticsearch

# Install Fluentd
helm install fluentd fluent/fluentd

# Install Kibana
helm install kibana elastic/kibana
```

**Option 2: Loki + Promtail**

```bash
# Install Loki
helm install loki grafana/loki-stack

# Access via Grafana
# Add Loki as data source in Grafana
```

**Option 3: Cloud-native logging**

- AWS CloudWatch
- GCP Cloud Logging
- Azure Monitor

### Log Levels

```javascript
// Application log levels
- ERROR: Critical errors
- WARN: Warnings
- INFO: Information
- DEBUG: Debug information
```

## Metrics Reference

### API Metrics

```
# Request metrics
http_requests_total                    # Total HTTP requests
http_request_duration_seconds          # Request duration
http_requests_in_flight                # Active requests

# Error metrics
http_errors_total                      # Total errors
http_server_errors_total               # 5xx errors
http_client_errors_total               # 4xx errors
```

### WebSocket Metrics

```
websocket_connections_active           # Active connections
websocket_connections_total            # Total connections
websocket_messages_sent_total          # Messages sent
websocket_messages_received_total      # Messages received
websocket_connection_duration_seconds  # Connection duration
```

### Database Metrics

```
# PostgreSQL
pg_up                                  # Database up
pg_stat_database_numbackends           # Active connections
pg_stat_database_xact_commit           # Committed transactions
pg_stat_database_xact_rollback         # Rolled back transactions
pg_stat_database_conflicts             # Conflicts
pg_stat_database_size_bytes            # Database size
```

### Redis Metrics

```
redis_up                               # Redis up
redis_connected_clients                # Connected clients
redis_used_memory_bytes                # Memory usage
redis_commands_processed_total         # Total commands
redis_keyspace_hits_total              # Cache hits
redis_keyspace_misses_total            # Cache misses
```

### System Metrics

```
# CPU
node_cpu_seconds_total                 # CPU usage
node_load1                             # 1-minute load average

# Memory
node_memory_MemTotal_bytes             # Total memory
node_memory_MemAvailable_bytes         # Available memory
node_memory_MemFree_bytes              # Free memory

# Disk
node_disk_read_bytes_total             # Disk read
node_disk_written_bytes_total          # Disk write
node_filesystem_size_bytes             # Filesystem size
node_filesystem_avail_bytes            # Available space

# Network
node_network_receive_bytes_total       # Network received
node_network_transmit_bytes_total      # Network transmitted
```

## Troubleshooting

### Prometheus Not Collecting Metrics

```bash
# 1. Check Prometheus pod
kubectl get pods -n cme-trading -l app=prometheus

# 2. Check logs
kubectl logs -n cme-trading deployment/prometheus

# 3. Check targets
# Open Prometheus UI → Targets
# Ensure all targets are "UP"

# 4. Test metrics endpoint
kubectl exec -it <api-pod> -n cme-trading -- wget -O- http://localhost:3001/metrics
```

### Grafana Not Showing Data

```bash
# 1. Check Grafana logs
kubectl logs -n cme-trading deployment/grafana

# 2. Verify data source connection
# Grafana UI → Configuration → Data Sources → Prometheus → Test

# 3. Check Prometheus query
# Use Prometheus UI to test queries first

# 4. Check time range
# Ensure dashboard time range includes recent data
```

### High Memory Usage

```bash
# 1. Check Prometheus retention
kubectl edit deployment prometheus -n cme-trading
# Adjust: --storage.tsdb.retention.time=30d

# 2. Check scrape interval
# Reduce frequency if needed: scrape_interval: 30s

# 3. Reduce metric cardinality
# Remove high-cardinality labels
```

### Missing Metrics

```bash
# 1. Check if app is exposing metrics
curl http://api-service:3001/metrics

# 2. Check Prometheus config
kubectl get configmap prometheus-config -n cme-trading -o yaml

# 3. Check service discovery
# Prometheus UI → Service Discovery

# 4. Restart Prometheus
kubectl rollout restart deployment/prometheus -n cme-trading
```

## Best Practices

1. **Set appropriate retention** - 30 days for Prometheus
2. **Use meaningful labels** - Keep cardinality low
3. **Create SLO dashboards** - Track SLIs/SLOs
4. **Alert on symptoms** - Not on causes
5. **Reduce alert fatigue** - Set appropriate thresholds
6. **Document runbooks** - For each alert
7. **Regular review** - Clean up unused dashboards
8. **Backup Grafana** - Export dashboard JSON
9. **Use recording rules** - For expensive queries
10. **Monitor the monitors** - Prometheus/Grafana health

## Performance Tips

### Optimize Prometheus

```yaml
# Reduce scrape interval for less critical services
scrape_interval: 30s

# Use recording rules for expensive queries
groups:
  - name: api_rules
    interval: 30s
    rules:
      - record: job:http_requests:rate5m
        expr: rate(http_requests_total[5m])
```

### Optimize Grafana

- Use query caching
- Set appropriate refresh intervals
- Limit time ranges
- Use table instead of graph for large datasets
- Enable query inspector to optimize

## Next Steps

- [ ] Setup AlertManager for notifications
- [ ] Configure Slack/Email alerts
- [ ] Create custom dashboards for business metrics
- [ ] Implement distributed tracing with Jaeger
- [ ] Setup log aggregation with Loki
- [ ] Configure uptime monitoring
- [ ] Create runbooks for alerts
- [ ] Setup synthetic monitoring

## Resources

- Prometheus Docs: https://prometheus.io/docs/
- Grafana Docs: https://grafana.com/docs/
- PromQL Guide: https://prometheus.io/docs/prometheus/latest/querying/basics/
- Dashboard Examples: https://grafana.com/grafana/dashboards/

---

**Last Updated**: 2025-12-03  
**Version**: 1.0.0
