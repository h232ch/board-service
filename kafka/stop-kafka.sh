#!/bin/bash

echo "🛑 Stopping Kafka services..."

# Stop all services
docker compose down

echo "🧹 Cleaning up..."
# Remove volumes if requested
if [ "$1" = "--clean" ]; then
    echo "🗑️ Removing all data volumes..."
    docker compose down -v
    docker volume prune -f
    echo "✅ All data has been removed."
else
    echo "💾 Data volumes preserved. Use './stop-kafka.sh --clean' to remove all data."
fi

echo "✅ Kafka services stopped."
