#!/bin/bash

# Deploy CME Trading to Kubernetes
# Usage: ./scripts/deploy-k8s.sh [environment]
# Environment: dev or prod (default: prod)

set -e

ENVIRONMENT=${1:-prod}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
K8S_DIR="$PROJECT_ROOT/infra/k8s"

echo "🚀 Deploying CME Trading to Kubernetes"
echo "Environment: $ENVIRONMENT"
echo "---"

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if kustomize is installed
if ! command -v kustomize &> /dev/null; then
    echo "⚠️  kustomize is not installed. Using kubectl apply -k instead."
    KUSTOMIZE_CMD="kubectl apply -k"
else
    KUSTOMIZE_CMD="kustomize build | kubectl apply -f -"
fi

# Confirm deployment
read -p "⚠️  This will deploy to Kubernetes. Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled."
    exit 1
fi

echo ""
echo "📦 Step 1: Creating namespace..."
kubectl apply -f "$K8S_DIR/base/namespace.yaml"

echo ""
echo "🔐 Step 2: Creating secrets..."
echo "⚠️  Make sure to update secrets before deploying to production!"
if [ "$ENVIRONMENT" = "prod" ]; then
    read -p "Have you updated production secrets? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "⚠️  Please update infra/k8s/overlays/prod/secrets.env first!"
        exit 1
    fi
fi

echo ""
echo "🔧 Step 3: Applying configurations..."
if [ "$ENVIRONMENT" = "prod" ]; then
    kubectl apply -k "$K8S_DIR/overlays/prod"
else
    kubectl apply -k "$K8S_DIR/base"
fi

echo ""
echo "📊 Step 4: Deploying monitoring stack..."
kubectl apply -f "$K8S_DIR/monitoring/"

echo ""
echo "⏳ Step 5: Waiting for deployments to be ready..."
kubectl wait --for=condition=ready pod -l app=postgres -n cme-trading --timeout=120s || echo "⚠️  PostgreSQL not ready yet"
kubectl wait --for=condition=ready pod -l app=redis -n cme-trading --timeout=120s || echo "⚠️  Redis not ready yet"
kubectl wait --for=condition=ready pod -l app=api -n cme-trading --timeout=120s || echo "⚠️  API not ready yet"
kubectl wait --for=condition=ready pod -l app=realtime -n cme-trading --timeout=120s || echo "⚠️  Realtime not ready yet"
kubectl wait --for=condition=ready pod -l app=customer-web -n cme-trading --timeout=120s || echo "⚠️  Customer Web not ready yet"
kubectl wait --for=condition=ready pod -l app=admin-web -n cme-trading --timeout=120s || echo "⚠️  Admin Web not ready yet"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Checking status..."
kubectl get all -n cme-trading

echo ""
echo "🎯 Next steps:"
echo ""
echo "1. Check pod status:"
echo "   kubectl get pods -n cme-trading"
echo ""
echo "2. View logs:"
echo "   kubectl logs -f -n cme-trading deployment/api"
echo ""
echo "3. Access services locally:"
echo "   kubectl port-forward -n cme-trading svc/api-service 3001:3001"
echo "   kubectl port-forward -n cme-trading svc/customer-web-service 3000:3000"
echo "   kubectl port-forward -n cme-trading svc/prometheus-service 9090:9090"
echo "   kubectl port-forward -n cme-trading svc/grafana-service 3000:3000"
echo ""
echo "4. Get LoadBalancer IP:"
echo "   kubectl get svc nginx-lb-service -n cme-trading"
echo ""
echo "5. Check HPA status:"
echo "   kubectl get hpa -n cme-trading"
echo ""
echo "📚 For more information, see docs/KUBERNETES.md"
