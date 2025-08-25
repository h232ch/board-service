#!/bin/bash

echo "🧪 Testing Kafka functionality..."

# Check if Kafka is running
if ! docker compose ps | grep -q "kafka.*Up"; then
    echo "❌ Kafka is not running. Please start Kafka first with './start-kafka.sh'"
    exit 1
fi

# Create test topic
echo "📝 Creating test topic..."
docker compose exec kafka kafka-topics --bootstrap-server localhost:9092 --create --topic test-topic --partitions 1 --replication-factor 1 --if-not-exists

# List topics
echo "📋 Listing topics..."
docker compose exec kafka kafka-topics --bootstrap-server localhost:9092 --list

# Send test message
echo "📤 Sending test message..."
echo "Hello from Kafka test!" | docker compose exec -T kafka kafka-console-producer --bootstrap-server localhost:9092 --topic test-topic

# Read test message
echo "📥 Reading test message..."
docker compose exec kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic test-topic --from-beginning --max-messages 1 --timeout-ms 5000

echo "✅ Kafka test completed successfully!"
echo ""
echo "🌐 You can also access Kafka UI at: http://localhost:8080"
