#!/bin/bash

echo "🛑 Stopping Kafka Monitoring Stack..."

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
    echo "💾 Data volumes preserved. Use './stop-monitoring.sh --clean' to remove all data."
fi

echo "✅ Monitoring Stack stopped successfully!"
