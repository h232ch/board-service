#!/bin/bash

echo "🚀 Starting Kafka with Confluent Platform..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if ports are available
if lsof -Pi :9092 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 9092 is already in use. Please stop any existing Kafka instances."
    exit 1
fi

if lsof -Pi :2181 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 2181 is already in use. Please stop any existing Zookeeper instances."
    exit 1
fi

# Start Kafka services
echo "📦 Starting Zookeeper and Kafka..."
docker compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo "🔍 Checking service status..."
docker compose ps

# Test Kafka connectivity
echo "🧪 Testing Kafka connectivity..."
sleep 5

# Check if Kafka is ready
if docker compose exec kafka kafka-topics --bootstrap-server localhost:9092 --list > /dev/null 2>&1; then
    echo "✅ Kafka is ready!"
    echo ""
    echo "🌐 Access URLs:"
    echo "   Kafka UI: http://localhost:8080"
    echo "   Schema Registry: http://localhost:8081"
    echo "   Kafka Broker: localhost:9092"
    echo "   Zookeeper: localhost:2181"
    echo ""
    echo "📋 Useful commands:"
    echo "   List topics: docker-compose exec kafka kafka-topics --bootstrap-server localhost:9092 --list"
    echo "   Create topic: docker-compose exec kafka kafka-topics --bootstrap-server localhost:9092 --create --topic test-topic --partitions 1 --replication-factor 1"
    echo "   Stop services: docker-compose down"
else
    echo "❌ Kafka is not ready yet. Please wait a moment and try again."
    echo "Check logs with: docker compose logs kafka"
fi
