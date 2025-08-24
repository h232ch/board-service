#!/bin/bash

echo "🧹 Cleaning up Board Service from Kubernetes..."

# Delete all resources in the namespace
echo "Deleting all resources in board-service namespace..."
kubectl delete namespace board-service

# Delete ingress
echo "Deleting ingress..."
kubectl delete -f ingress.yaml --ignore-not-found=true

echo "✅ Cleanup complete!"
echo ""
echo "To completely clean up minikube:"
echo "  minikube stop"
echo "  minikube delete"
