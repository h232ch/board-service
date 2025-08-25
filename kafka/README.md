# Kafka Setup with Confluent Platform

This directory contains a complete Kafka setup using Confluent Platform with Docker Compose.

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Zookeeper     │    │   Kafka Broker  │    │   Kafka UI      │
│   Port: 2181    │    │   Port: 9092    │    │   Port: 8080    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ Schema Registry │
                    │   Port: 8081    │
                    └─────────────────┘
```

## 📚 **What is Kafka and How It Works**

### **Apache Kafka Overview**
Apache Kafka is a distributed streaming platform that enables you to build real-time streaming data pipelines and applications. It's designed for high-throughput, fault-tolerant handling of real-time data feeds.

### **Core Concepts**

#### **1. Topics**
- **What**: Named channels where messages are stored
- **Purpose**: Organize messages by category or type
- **Example**: `board-service-logs`, `user-events`, `system-metrics`

#### **2. Producers**
- **What**: Applications that send messages to topics
- **Purpose**: Publish data to Kafka
- **Example**: Vector sidecar sending logs to `board-service-logs` topic

#### **3. Consumers**
- **What**: Applications that read messages from topics
- **Purpose**: Process and analyze data
- **Example**: Log analysis tools consuming from `board-service-logs`

#### **4. Brokers**
- **What**: Kafka servers that store and serve data
- **Purpose**: Handle message storage and distribution
- **Example**: Our `kafka-broker` container

### **How Our Services Work Together**

#### **1. Zookeeper (Coordination Service)**
```yaml
# Purpose: Distributed coordination for Kafka cluster
# Responsibilities:
- Manages Kafka broker metadata
- Handles leader election for partitions
- Stores configuration information
- Coordinates cluster membership
```

**Why Zookeeper is Required:**
- **Metadata Management**: Tracks which brokers are alive
- **Configuration Storage**: Stores topic configurations
- **Leader Election**: Determines which broker leads each partition
- **Cluster Coordination**: Ensures consistency across brokers

#### **2. Kafka Broker (Message Storage)**
```yaml
# Purpose: Core message broker and storage
# Responsibilities:
- Stores messages in topics
- Handles producer/consumer requests
- Manages data replication
- Provides fault tolerance
```

**How Messages Flow:**
```
Producer → Kafka Broker → Topic → Consumer
   ↓           ↓           ↓        ↓
Vector    kafka:9092   board-   Log Analysis
Sidecar              service-    Tools
                     logs
```

#### **3. Schema Registry (Data Schema Management)**
```yaml
# Purpose: Centralized schema management
# Responsibilities:
- Stores data schemas (JSON, Avro, Protobuf)
- Ensures schema compatibility
- Enables schema evolution
- Provides schema validation
```

**Benefits:**
- **Data Consistency**: Ensures all producers/consumers use same schema
- **Schema Evolution**: Allows schema changes without breaking compatibility
- **Validation**: Prevents invalid data from being stored

#### **4. Kafka UI (Management Interface)**
```yaml
# Purpose: Web-based Kafka management
# Features:
- Topic management and monitoring
- Message browsing and search
- Consumer group management
- Real-time metrics and health
```

## 🔧 **Detailed Docker Compose Configuration**

### **Service-by-Service Breakdown**

#### **1. Zookeeper Service**
```yaml
zookeeper:
  image: confluentinc/cp-zookeeper:7.4.0
  hostname: zookeeper
  container_name: kafka-zookeeper
  ports:
    - "2181:2181"                    # External access for monitoring
  environment:
    ZOOKEEPER_CLIENT_PORT: 2181      # Port for client connections
    ZOOKEEPER_TICK_TIME: 2000        # Heartbeat interval (2 seconds)
  volumes:
    - zookeeper-data:/var/lib/zookeeper/data    # Persistent data storage
    - zookeeper-logs:/var/lib/zookeeper/log     # Persistent log storage
  healthcheck:
    test: ["CMD", "nc", "-z", "localhost", "2181"]  # Check if port is open
    interval: 10s                     # Check every 10 seconds
    timeout: 5s                       # 5 second timeout
    retries: 5                        # 5 retries before marking unhealthy
```

**Key Configuration Explained:**
- **`ZOOKEEPER_TICK_TIME`**: Determines session timeout and connection limits
- **`zookeeper-data`**: Stores cluster metadata and configurations
- **`zookeeper-logs`**: Stores Zookeeper transaction logs
- **Health Check**: Ensures Zookeeper is ready before starting Kafka

#### **2. Kafka Broker Service**
```yaml
kafka:
  image: confluentinc/cp-kafka:7.4.0
  hostname: kafka
  container_name: kafka-broker
  depends_on:
    zookeeper:
      condition: service_healthy      # Wait for Zookeeper to be healthy
  ports:
    - "9092:9092"                    # External access for applications
    - "9101:9101"                    # JMX monitoring port
  environment:
    KAFKA_BROKER_ID: 1               # Unique broker identifier
    KAFKA_ZOOKEEPER_CONNECT: 'zookeeper:2181'  # Zookeeper connection
    KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
    KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092,PLAINTEXT_HOST://localhost:9092
    KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1  # Single broker setup
    KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1     # Minimum in-sync replicas
    KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1
    KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0  # Immediate consumer group rebalancing
    KAFKA_JMX_PORT: 9101             # JMX monitoring port
    KAFKA_JMX_HOSTNAME: localhost
    KAFKA_AUTO_CREATE_TOPICS_ENABLE: 'true'    # Auto-create topics
    KAFKA_DELETE_TOPIC_ENABLE: 'true'          # Allow topic deletion
  volumes:
    - kafka-data:/var/lib/kafka/data  # Persistent message storage
  healthcheck:
    test: ["CMD", "nc", "-z", "localhost", "9092"]
    interval: 10s
    timeout: 5s
    retries: 5
```

**Key Configuration Explained:**
- **`KAFKA_ADVERTISED_LISTENERS`**: 
  - `PLAINTEXT://kafka:29092`: Internal communication between containers
  - `PLAINTEXT_HOST://localhost:9092`: External access from host machine
- **`KAFKA_AUTO_CREATE_TOPICS_ENABLE`**: Automatically creates topics when first message is sent
- **`KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR`**: Set to 1 for single-broker development setup
- **`kafka-data`**: Persistent volume for storing all messages and topic data

#### **3. Kafka UI Service**
```yaml
kafka-ui:
  image: provectuslabs/kafka-ui:latest
  container_name: kafka-ui
  depends_on:
    kafka:
      condition: service_healthy      # Wait for Kafka to be healthy
  ports:
    - "8080:8080"                    # Web UI access
  environment:
    KAFKA_CLUSTERS_0_NAME: local     # Cluster name in UI
    KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:29092  # Internal Kafka connection
    KAFKA_CLUSTERS_0_ZOOKEEPER: zookeeper:2181      # Zookeeper connection
  restart: unless-stopped            # Auto-restart on failure
```

**Key Configuration Explained:**
- **`KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS`**: Uses internal Kafka address for container communication
- **`KAFKA_CLUSTERS_0_ZOOKEEPER`**: Connects to Zookeeper for metadata
- **`restart: unless-stopped`**: Ensures UI stays running even if it crashes

#### **4. Schema Registry Service**
```yaml
schema-registry:
  image: confluentinc/cp-schema-registry:7.4.0
  hostname: schema-registry
  container_name: kafka-schema-registry
  depends_on:
    kafka:
      condition: service_healthy      # Wait for Kafka to be healthy
  ports:
    - "8081:8081"                    # Schema Registry API
  environment:
    SCHEMA_REGISTRY_HOST_NAME: schema-registry
    SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS: 'kafka:29092'  # Kafka connection
    SCHEMA_REGISTRY_LISTENERS: http://0.0.0.0:8081  # Listen on all interfaces
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8081/subjects"]  # Check API endpoint
    interval: 30s
    timeout: 10s
    retries: 3
```

**Key Configuration Explained:**
- **`SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS`**: Uses internal Kafka for storing schemas
- **`SCHEMA_REGISTRY_LISTENERS`**: Exposes HTTP API for schema management
- **Health Check**: Verifies Schema Registry API is responding

### **Volume Configuration**
```yaml
volumes:
  zookeeper-data:                    # Zookeeper metadata storage
    driver: local
  zookeeper-logs:                    # Zookeeper transaction logs
    driver: local
  kafka-data:                        # Kafka message storage
    driver: local

networks:
  default:
    name: kafka-network              # Custom network for service communication
```

**Volume Purposes:**
- **`zookeeper-data`**: Stores cluster metadata, configurations, and state
- **`zookeeper-logs`**: Stores transaction logs for recovery
- **`kafka-data`**: Stores all Kafka messages, topic configurations, and offsets

## 🚀 **How to Run and Test**

### **1. Quick Start Commands**

#### **Start Kafka Environment**
```bash
cd kafka
chmod +x *.sh                    # Make scripts executable (first time only)
./start-kafka.sh                 # Start all services with health checks
```

**What the start script does:**
1. **Checks Docker**: Verifies Docker is running
2. **Port Validation**: Ensures ports 9092 and 2181 are available
3. **Service Startup**: Starts Zookeeper, Kafka, UI, and Schema Registry
4. **Health Monitoring**: Waits for services to be healthy
5. **Connectivity Test**: Verifies Kafka is ready for connections
6. **Status Report**: Shows access URLs and useful commands

#### **Test Kafka Functionality**
```bash
./test-kafka.sh                  # Run comprehensive Kafka tests
```

**What the test script does:**
1. **Service Check**: Verifies Kafka is running
2. **Topic Creation**: Creates test topic if it doesn't exist
3. **Topic Listing**: Shows all available topics
4. **Message Production**: Sends test message to topic
5. **Message Consumption**: Reads and displays the message
6. **Success Confirmation**: Reports test completion

#### **Stop Kafka Environment**
```bash
./stop-kafka.sh                  # Stop services, preserve data
./stop-kafka.sh --clean          # Stop services, remove all data
```

**What the stop script does:**
1. **Service Shutdown**: Stops all containers gracefully
2. **Data Preservation**: Keeps volumes by default
3. **Cleanup Option**: `--clean` flag removes all data volumes
4. **Status Report**: Confirms shutdown completion

### **2. Manual Commands and Testing**

#### **Check Service Status**
```bash
# View all running services
docker compose ps

# Check specific service logs
docker compose logs kafka
docker compose logs zookeeper
docker compose logs kafka-ui
docker compose logs schema-registry

# Follow logs in real-time
docker compose logs -f kafka
```

#### **Topic Management**
```bash
# List all topics
docker compose exec kafka kafka-topics --bootstrap-server localhost:9092 --list

# Create a new topic
docker compose exec kafka kafka-topics --bootstrap-server localhost:9092 --create \
  --topic my-topic --partitions 3 --replication-factor 1

# Describe topic details
docker compose exec kafka kafka-topics --bootstrap-server localhost:9092 --describe --topic board-service-logs

# Delete a topic
docker compose exec kafka kafka-topics --bootstrap-server localhost:9092 --delete --topic test-topic
```

#### **Message Production and Consumption**
```bash
# Send a single message
echo "Hello Kafka!" | docker compose exec -T kafka kafka-console-producer \
  --bootstrap-server localhost:9092 --topic board-service-logs

# Send multiple messages interactively
docker compose exec kafka kafka-console-producer \
  --bootstrap-server localhost:9092 --topic board-service-logs
# Type messages and press Enter, Ctrl+C to exit

# Consume messages from beginning
docker compose exec kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 --topic board-service-logs --from-beginning

# Consume messages with specific consumer group
docker compose exec kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 --topic board-service-logs \
  --group my-consumer-group --from-beginning
```

#### **Consumer Group Management**
```bash
# List consumer groups
docker compose exec kafka kafka-consumer-groups --bootstrap-server localhost:9092 --list

# Describe consumer group
docker compose exec kafka kafka-consumer-groups --bootstrap-server localhost:9092 \
  --describe --group my-consumer-group

# Reset consumer group offsets
docker compose exec kafka kafka-consumer-groups --bootstrap-server localhost:9092 \
  --group my-consumer-group --topic board-service-logs --reset-offsets --to-earliest --execute
```

#### **Schema Registry Operations**
```bash
# List all schemas
curl http://localhost:8081/subjects

# Get schema for a subject
curl http://localhost:8081/subjects/board-service-logs-value/versions/latest

# Register a new schema
curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  --data '{"schema": "{\"type\":\"object\",\"properties\":{\"message\":{\"type\":\"string\"}}}"}' \
  http://localhost:8081/subjects/board-service-logs-value/versions
```

### **3. Advanced Testing Scenarios**

#### **Load Testing**
```bash
# Send 1000 messages rapidly
for i in {1..1000}; do
  echo "Message $i: $(date)" | docker compose exec -T kafka kafka-console-producer \
    --bootstrap-server localhost:9092 --topic board-service-logs
done

# Monitor consumer lag
docker compose exec kafka kafka-consumer-groups --bootstrap-server localhost:9092 \
  --describe --group my-consumer-group
```

#### **Performance Testing**
```bash
# Test producer performance
docker compose exec kafka kafka-producer-perf-test \
  --topic board-service-logs --num-records 10000 --record-size 1000 \
  --throughput 1000 --producer-props bootstrap.servers=localhost:9092

# Test consumer performance
docker compose exec kafka kafka-consumer-perf-test \
  --topic board-service-logs --messages 10000 \
  --bootstrap-server localhost:9092
```

#### **Fault Tolerance Testing**
```bash
# Simulate broker restart
docker compose restart kafka

# Check message persistence
docker compose exec kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 --topic board-service-logs --from-beginning

# Verify no data loss
docker compose exec kafka kafka-topics --bootstrap-server localhost:9092 \
  --describe --topic board-service-logs
```

### **4. Monitoring and Debugging**

#### **Access Web Interfaces**
- **Kafka UI**: http://localhost:8080
  - Topic management and monitoring
  - Message browsing and search
  - Consumer group management
  - Real-time metrics

- **Schema Registry**: http://localhost:8081
  - Schema management
  - Compatibility checking
  - Version history

#### **Health Checks**
```bash
# Check Zookeeper health
telnet localhost 2181

# Check Kafka health
telnet localhost 9092

# Check Schema Registry health
curl http://localhost:8081/subjects

# Check Kafka UI health
curl http://localhost:8080
```

#### **Troubleshooting Commands**
```bash
# Check container status
docker compose ps

# View detailed logs
docker compose logs --tail=100 kafka

# Check disk usage
docker compose exec kafka df -h

# Check memory usage
docker compose exec kafka free -h

# Check network connectivity
docker compose exec kafka ping zookeeper
```

## 🔗 **Vector Integration**

### **Update Vector Configuration**
```yaml
# In k8s/vector-sidecar-config.yaml
sinks:
  kafka_output:
    type: "kafka"
    inputs: ["add_metadata"]
    bootstrap_servers: ["host.docker.internal:9092"]  # ← Local Kafka
    topic: "board-service-logs"
    encoding:
      codec: "json"
    compression: "gzip"
    # Additional Kafka options
    acks: "all"
    retries: 3
    batch_size: 1000
    linger_ms: 100
```

### **Apply Vector Config**
```bash
kubectl apply -f k8s/vector-sidecar-config.yaml
```

### **Test Log Flow**
```bash
# Generate logs
kubectl port-forward service/board-frontend-service 8080:80 -n board-service &
curl http://localhost:8080/api/posts

# Check Kafka for logs
docker compose -f kafka/docker-compose.yml exec kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 --topic board-service-logs --from-beginning
```

## 🛠️ **Management Commands**

### **View Logs**
```bash
# All services
docker compose logs

# Specific service
docker compose logs kafka
docker compose logs zookeeper
```

### **Restart Services**
```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart kafka
```

### **Check Status**
```bash
docker compose ps
```

## 🧹 **Cleanup**

### **Stop and Preserve Data**
```bash
./stop-kafka.sh
```

### **Stop and Remove All Data**
```bash
./stop-kafka.sh --clean
```

## 🔍 **Troubleshooting**

### **Port Conflicts**
```bash
# Check what's using port 9092
lsof -i :9092

# Check what's using port 2181
lsof -i :2181
```

### **Service Not Starting**
```bash
# Check Docker logs
docker compose logs

# Check service health
docker compose ps
```

### **Kafka Not Accessible**
```bash
# Test connectivity
telnet localhost 9092

# Check Kafka status
docker compose exec kafka kafka-topics --bootstrap-server localhost:9092 --list
```

## 📊 **Monitoring**

### **Kafka UI**
- **URL**: http://localhost:8080
- **Features**: Topic management, message browsing, consumer groups

### **Schema Registry**
- **URL**: http://localhost:8081
- **Features**: Schema management, compatibility checking

### **JMX Metrics**
- **Port**: 9101
- **Purpose**: Kafka metrics and monitoring

## 🚀 **Production Considerations**

### **For AWS Migration**
1. **Replace local Kafka** with AWS MSK
2. **Update Vector config** with new endpoints
3. **Configure security** and authentication
4. **Set up monitoring** and alerting

### **Security**
- **Current**: No authentication (development only)
- **Production**: SASL/SSL authentication required
- **Network**: Restrict access to trusted sources

### **Performance**
- **Memory**: Adjust based on message volume
- **Storage**: Configure appropriate retention
- **Partitions**: Scale based on throughput needs

## 📚 **Useful Resources**

- [Confluent Platform Documentation](https://docs.confluent.io/)
- [Kafka Documentation](https://kafka.apache.org/documentation/)
- [Vector Kafka Sink](https://vector.dev/docs/reference/configuration/sinks/kafka/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
