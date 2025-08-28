#!/bin/bash

echo "🧹 Cleaning up Board Service from Kubernetes..."

# Check if namespace exists
if kubectl get namespace board-service >/dev/null 2>&1; then
    echo "Found board-service namespace. Cleaning up..."
    
    # Stop any port-forwarding processes
    echo "Stopping port-forwarding processes..."
    pkill -f "kubectl port-forward.*board-service" 2>/dev/null || true
    
    # Delete all resources in the namespace (this will clean up everything)
    echo "Deleting all resources in board-service namespace..."
    kubectl delete namespace board-service --ignore-not-found=true
    
    echo "✅ Namespace cleanup complete!"
else
    echo "board-service namespace not found. Nothing to clean up."
fi

# Clean up any orphaned resources outside the namespace
echo "Cleaning up any orphaned resources..."

# Delete ingress (in case it was created outside namespace)
echo "Deleting ingress resources..."
kubectl delete ingress -l app.kubernetes.io/name=board-service --all-namespaces --ignore-not-found=true

# Delete any orphaned services
echo "Deleting orphaned services..."
kubectl delete service -l app.kubernetes.io/name=board-service --all-namespaces --ignore-not-found=true

# Delete any orphaned deployments
echo "Deleting orphaned deployments..."
kubectl delete deployment -l app.kubernetes.io/name=board-service --all-namespaces --ignore-not-found=true

# Delete any orphaned daemonsets
echo "Deleting orphaned daemonsets..."
kubectl delete daemonset -l app.kubernetes.io/name=board-service --all-namespaces --ignore-not-found=true

# Delete any orphaned configmaps
echo "Deleting orphaned configmaps..."
kubectl delete configmap -l app.kubernetes.io/name=board-service --all-namespaces --ignore-not-found=true

# Delete any orphaned secrets
echo "Deleting orphaned secrets..."
kubectl delete secret -l app.kubernetes.io/name=board-service --all-namespaces --ignore-not-found=true

# Delete any orphaned persistent volume claims
echo "Deleting orphaned PVCs..."
kubectl delete pvc -l app.kubernetes.io/name=board-service --all-namespaces --ignore-not-found=true

# Clean up any remaining pods with board-service labels
echo "Cleaning up any remaining pods..."
kubectl delete pod -l app.kubernetes.io/name=board-service --all-namespaces --ignore-not-found=true

echo "✅ Complete cleanup finished!"
echo ""
echo "🌐 Current cluster status:"
echo "  kubectl get all --all-namespaces"
echo ""
echo "🧹 To completely clean up minikube:"
echo "  minikube stop"
echo "  minikube delete"
echo ""
echo "🔄 To redeploy after cleanup:"
echo "  ./deploy.sh -k"
