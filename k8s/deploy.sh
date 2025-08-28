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

# Check if user wants to use kustomize or individual files
if [ "$1" = "--kustomize" ] || [ "$1" = "-k" ]; then
    echo "📦 Using Kustomize for deployment..."
    
    # Create namespace first
    echo "Creating namespace..."
    kubectl apply -f namespace.yaml
    
    # Apply all resources using kustomize
    echo "Applying all resources with Kustomize..."
    kubectl apply -k .
    
else
    echo "📁 Using individual YAML files for deployment..."
    
    # Create namespace
    echo "Creating namespace..."
    kubectl apply -f namespace.yaml
    
    # Apply ConfigMap and Secret
    echo "Applying ConfigMap and Secret..."
    kubectl apply -f configmap.yaml
    kubectl apply -f secret.yaml
    
    # Apply Vector Daemonset Configuration
    echo "Applying Vector Daemonset Configuration..."
    kubectl apply -f vector-daemonset-config.yaml
    kubectl apply -f vector-daemonset.yaml
    
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
fi

# # Wait for deployments to be ready
# echo "Waiting for deployments to be ready..."
# kubectl wait --for=condition=available --timeout=300s deployment/board-backend -n board-service
# kubectl wait --for=condition=available --timeout=300s deployment/board-frontend -n board-service

# Wait for Vector daemonset to be ready
echo "Waiting for Vector daemonset to be ready..."
kubectl wait --for=condition=available --timeout=300s daemonset/vector -n board-service

echo "✅ Deployment complete!"
echo ""
echo "📊 Check status:"
echo "  kubectl get all -n board-service"
echo "  kubectl get daemonset -n board-service"
echo "  kubectl get configmap -n board-service"
echo ""
echo "🌐 Access services:"
echo "  Frontend: http://board-service.local"
echo "  Backend API: http://board-service.local/api"
echo "  Health: http://board-service.local/health"
echo ""
echo "🔍 View logs:"
echo "  kubectl logs -f deployment/board-backend -n board-service"
echo "  kubectl logs -f deployment/board-frontend -n board-service"
echo ""
echo "📈 Vector logging:"
echo "  # Vector daemonset logs:"
echo "  kubectl logs -f -l app=vector-daemonset -n board-service"
echo "  # Specific Vector pod logs (replace POD_NAME):"
echo "  kubectl logs -f POD_NAME -n board-service"
echo ""
echo "🔧 Debugging commands:"
echo "  # Check pod status:"
echo "  kubectl get pods -n board-service"
echo "  # Check Vector health:"
echo "  kubectl exec POD_NAME -n board-service -- curl localhost:8686/health"
echo "  # Check Vector config:"
echo "  kubectl get configmap vector-daemonset-config -n board-service -o yaml"
echo ""
echo "💡 Usage:"
echo "  ./deploy.sh          # Deploy using individual YAML files"
echo "  ./deploy.sh -k       # Deploy using Kustomize"
echo "  ./deploy.sh --kustomize  # Deploy using Kustomize"
