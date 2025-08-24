#!/bin/bash

echo "🧪 Testing Board Service deployment..."

# Wait for pods to be ready
echo "Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app=board-backend -n board-service --timeout=300s
kubectl wait --for=condition=ready pod -l app=board-frontend -n board-service --timeout=300s

# Get minikube IP
MINIKUBE_IP=$(minikube ip)
echo "Minikube IP: $MINIKUBE_IP"

# Add to hosts file if not already there
if ! grep -q "board-service.local" /etc/hosts; then
    echo "Adding board-service.local to /etc/hosts..."
    echo "$MINIKUBE_IP board-service.local" | sudo tee -a /etc/hosts
else
    echo "board-service.local already in /etc/hosts"
fi

# Test backend health
echo "Testing backend health..."
sleep 10
curl -s "http://board-service.local/health" || echo "Backend health check failed"

# Test frontend health
echo "Testing frontend health..."
curl -s "http://board-service.local/health" || echo "Frontend health check failed"

# Test frontend main page
echo "Testing frontend main page..."
curl -s -I "http://board-service.local/" | head -1 || echo "Frontend main page test failed"

echo "✅ Testing complete!"
echo ""
echo "🌐 Access your services:"
echo "  Frontend: http://board-service.local"
echo "  Backend API: http://board-service.local/api"
echo "  Health: http://board-service.local/health"
