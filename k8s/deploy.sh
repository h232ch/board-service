#!/bin/bash

echo "🚀 Deploying Board Service to Kubernetes..."

# Check if minikube is running
if ! minikube status | grep -q "Running"; then
    echo "Starting minikube..."
    minikube start
fi

# Enable ingress addon
echo "Enabling ingress addon..."
minikube addons enable ingress

# Wait for ingress controller to be ready
echo "Waiting for ingress controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s

# Create namespace
echo "Creating namespace..."
kubectl apply -f namespace.yaml

# Apply ConfigMap and Secret
echo "Applying ConfigMap and Secret..."
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml

# Deploy backend
echo "Deploying backend..."
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml

# Deploy frontend
echo "Deploying frontend..."
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml

# Deploy ingress
echo "Deploying ingress..."
kubectl apply -f ingress.yaml

# Wait for deployments to be ready
echo "Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/board-backend -n board-service
kubectl wait --for=condition=available --timeout=300s deployment/board-frontend -n board-service

echo "✅ Deployment complete!"
echo ""
echo "📊 Check status:"
echo "  kubectl get all -n board-service"
echo ""
echo "🌐 Access services:"
echo "  Frontend: http://board-service.local"
echo "  Backend API: http://board-service.local/api"
echo "  Health: http://board-service.local/health"
echo ""
echo "🔍 View logs:"
echo "  kubectl logs -f deployment/board-backend -n board-service"
echo "  kubectl logs -f deployment/board-frontend -n board-service"
