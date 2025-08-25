#!/bin/bash

echo "🚀 Starting Kafka Monitoring Stack..."

# Check if Kafka is running
if ! docker compose -f ../kafka/docker-compose.yml ps | grep -q "kafka.*Up"; then
    echo "❌ Kafka is not running. Please start Kafka first:"
    echo "   cd ../kafka && ./start-kafka.sh"
    exit 1
fi

# Check if ports are available
if lsof -Pi :9090 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 9090 is already in use. Please stop any existing Prometheus instances."
    exit 1
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 3000 is already in use. Please stop any existing Grafana instances."
    exit 1
fi

# Start monitoring stack
echo "📦 Starting Prometheus, Grafana, and Kafka Exporter..."
docker compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check service status
echo "🔍 Checking service status..."
docker compose ps

# Test connectivity
echo "🧪 Testing connectivity..."
sleep 5

# Check Prometheus
if curl -s http://localhost:9090/api/v1/status/config > /dev/null; then
    echo "✅ Prometheus is ready!"
else
    echo "❌ Prometheus is not responding"
fi

# Check Grafana
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "✅ Grafana is ready!"
else
    echo "❌ Grafana is not responding"
fi

# Check Kafka Exporter
if curl -s http://localhost:9308/metrics > /dev/null; then
    echo "✅ Kafka Exporter is ready!"
else
    echo "❌ Kafka Exporter is not responding"
fi

echo ""
echo "🎉 Monitoring Stack Started Successfully!"
echo ""
echo "🌐 Access URLs:"
echo "   Grafana: http://localhost:3000 (admin/admin)"
echo "   Prometheus: http://localhost:9090"
echo "   Kafka Exporter: http://localhost:9308/metrics"
echo ""
echo "📊 Next Steps:"
echo "   1. Open Grafana at http://localhost:3000"
echo "   2. Login with admin/admin"
echo "   3. The Kafka dashboard should be automatically loaded"
echo "   4. If not, go to Dashboards → Import → Upload kafka-dashboard.json"
echo ""
echo "🔧 Useful Commands:"
echo "   View logs: docker compose logs -f"
echo "   Stop services: ./stop-monitoring.sh"
echo "   Check metrics: curl http://localhost:9308/metrics"
