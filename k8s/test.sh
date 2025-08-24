#!/bin/bash

echo "🧪 Testing Board Service deployment..."

# Wait for pods to be ready
echo "Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app=board-backend -n board-service --timeout=300s
kubectl wait --for=condition=ready pod -l app=board-frontend -n board-service --timeout=300s

echo "✅ All pods are ready!"

# Test backend health via port-forward
echo "Testing backend health via port-forward..."
echo "Note: Make sure backend port-forward is running: kubectl port-forward service/board-backend-service 8080:8080 -n board-service &"

# Wait a moment for any existing port-forward to be ready
sleep 5

# Test backend health
echo "Testing backend health at localhost:8080..."
if curl -s "http://localhost:8080/health" > /dev/null; then
    echo "✅ Backend health check passed"
    curl -s "http://localhost:8080/health"
else
    echo "❌ Backend health check failed"
    echo "Make sure to run: kubectl port-forward service/board-backend-service 8080:8080 -n board-service &"
fi

# Test frontend health via port-forward
echo ""
echo "Testing frontend health via port-forward..."
echo "Note: Make sure frontend port-forward is running: kubectl port-forward service/board-frontend-service 3000:80 -n board-service &"

# Wait a moment for any existing port-forward to be ready
sleep 5

# Test frontend health
echo "Testing frontend health at localhost:3000..."
if curl -s "http://localhost:3000/health" > /dev/null; then
    echo "✅ Frontend health check passed"
    curl -s "http://localhost:3000/health"
else
    echo "❌ Frontend health check failed"
    echo "Make sure to run: kubectl port-forward service/board-frontend-service 3000:80 -n board-service &"
fi

# Test frontend main page
echo ""
echo "Testing frontend main page at localhost:3000..."
if curl -s -I "http://localhost:3000/" > /dev/null; then
    echo "✅ Frontend main page test passed"
    echo "Page title: $(curl -s "http://localhost:3000/" | grep -o '<title>[^<]*</title>' | sed 's/<title>\(.*\)<\/title>/\1/')"
else
    echo "❌ Frontend main page test failed"
    echo "Make sure to run: kubectl port-forward service/board-frontend-service 3000:80 -n board-service &"
fi

echo ""
echo "✅ Testing complete!"
echo ""
echo "🌐 Access your services via port-forwarding:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:8080"
echo "  Health: http://localhost:8080/health"
echo ""
echo "📋 To start port-forwarding if not already running:"
echo "  kubectl port-forward service/board-backend-service 8080:8080 -n board-service &"
echo "  kubectl port-forward service/board-frontend-service 3000:80 -n board-service &"
