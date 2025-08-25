# 📊 Monitoring Stack - Complete Guide

A comprehensive monitoring solution for your application stack using **Grafana**, **Prometheus**, and **Kafka Exporter**.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Your App      │    │   Kafka         │    │   Monitoring    │
│   (Board        │    │   Cluster       │    │   Stack         │
│   Service)      │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Logs          │    │   Metrics       │    │   Visualization │
│   (Vector)      │    │   (Kafka        │    │   (Grafana)     │
│                 │    │    Exporter)    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   Prometheus    │
                        │   (Data Store)  │
                        └─────────────────┘
```

## 🔧 Services Explained

### 1. **Prometheus** - The Data Collector
- **What it does**: Collects and stores time-series data (metrics)
- **Think of it as**: A database that stores "how many requests per second" over time
- **Port**: 9090
- **Data format**: Key-value pairs with timestamps

**Example metrics it collects**:
```
kafka_brokers{instance="kafka-exporter:9308"} = 1
kafka_topic_partitions{topic="test-topic"} = 3
http_requests_total{method="GET", status="200"} = 150
```

### 2. **Grafana** - The Visualizer
- **What it does**: Creates beautiful dashboards and graphs from Prometheus data
- **Think of it as**: A "Photoshop for data" - makes metrics look pretty
- **Port**: 3000
- **Login**: admin/admin

**What you see**:
- 📈 Real-time graphs
- 📊 Performance metrics
- 🚨 Alerts and notifications
- 📱 Responsive dashboards

### 3. **Kafka Exporter** - The Bridge
- **What it does**: Connects Kafka to Prometheus
- **Think of it as**: A translator that speaks both "Kafka" and "Prometheus"
- **Port**: 9308
- **Job**: Converts Kafka metrics into Prometheus format

**Metrics it provides**:
- Number of Kafka brokers
- Number of topics and partitions
- Consumer group lag
- Message rates

### 4. **Node Exporter** - System Monitor
- **What it does**: Collects system-level metrics (CPU, memory, disk)
- **Think of it as**: A health check for your server
- **Port**: 9100
- **Metrics**: CPU usage, memory usage, disk space, network

## 🔄 How Everything Works Together

### Step 1: Data Collection
```
Kafka Cluster → Kafka Exporter → Prometheus
     ↓              ↓              ↓
  Metrics      Converts to    Stores data
  (JMX)       Prometheus     (time-series)
              format
```

### Step 2: Data Storage
```
Prometheus scrapes metrics every 15 seconds:
┌─────────────────┐    ┌─────────────────┐
│ Kafka Exporter  │───▶│   Prometheus    │
│ (Port 9308)     │    │   (Port 9090)   │
└─────────────────┘    └─────────────────┘
```

### Step 3: Data Visualization
```
Prometheus → Grafana → Beautiful Dashboards
     ↓          ↓              ↓
  Raw data   Queries      Charts & Graphs
```

## 📁 Configuration Files Explained

### 1. **docker-compose.yml** - The Orchestra Conductor
```yaml
# This file tells Docker how to run all services together
services:
  prometheus:    # Data collector
  grafana:       # Visualizer  
  kafka-exporter: # Kafka bridge
  node-exporter:  # System monitor
```

**Key sections**:
- **`image`**: Which Docker image to use
- **`ports`**: How to access the service from your computer
- **`volumes`**: Where to store data (persistent storage)
- **`networks`**: How services communicate with each other

### 2. **prometheus/prometheus.yml** - The Scraping Rules
```yaml
scrape_configs:
  - job_name: 'prometheus'      # Monitor Prometheus itself
  - job_name: 'kafka-exporter'  # Monitor Kafka metrics
  - job_name: 'node-exporter'   # Monitor system metrics
```

**What it does**:
- Tells Prometheus where to find metrics
- Sets how often to collect data (15 seconds)
- Defines what metrics to collect

### 3. **grafana/provisioning/datasources/prometheus.yml** - The Connection
```yaml
datasources:
  - name: Prometheus
    type: prometheus
    url: http://prometheus:9090  # Connect to Prometheus
```

**What it does**:
- Tells Grafana where to find Prometheus
- Sets up the data source automatically
- No manual configuration needed

### 4. **grafana/provisioning/dashboards/dashboard.yml** - The Auto-Loader
```yaml
providers:
  - name: 'default'
    folder: ''
    type: file
    options:
      path: /etc/grafana/provisioning/dashboards
```

**What it does**:
- Automatically loads dashboard files
- No need to manually import dashboards
- Dashboards appear when Grafana starts

## 🚀 Quick Start Guide

### 1. **Start Everything**
```bash
cd monitoring
./start-monitoring.sh
```

### 2. **Check Services**
```bash
# Check if all containers are running
docker compose ps

# Check Prometheus (should show targets)
curl http://localhost:9090/api/v1/targets

# Check Grafana (should show login page)
curl http://localhost:3000
```

### 3. **Access Dashboards**
- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Kafka Exporter**: http://localhost:9308/metrics

## 📊 Understanding the Data Flow

### Real Example:
1. **Kafka** has 1 broker and 4 topics
2. **Kafka Exporter** reads this info via JMX
3. **Kafka Exporter** converts to Prometheus format:
   ```
   kafka_brokers 1
   kafka_topics 4
   ```
4. **Prometheus** stores this data with timestamps
5. **Grafana** queries Prometheus and shows:
   - "Kafka Brokers: 1"
   - "Topics: 4"
   - Graphs showing trends over time

## 🎯 Key Concepts Made Simple

### **Time-Series Data**
- Think of it as a spreadsheet with timestamps
- Each row: `timestamp | metric_name | value`
- Example: `2024-08-25 10:00:00 | cpu_usage | 45.2`

### **Scraping**
- Prometheus "asks" services for their metrics
- Like checking your email every 15 minutes
- Services respond with current values

### **Metrics vs Logs**
- **Metrics**: Numbers (CPU usage: 45%)
- **Logs**: Text (Error: Database connection failed)
- This stack focuses on metrics

### **Dashboards**
- Collections of graphs and charts
- Real-time updates
- Can show multiple metrics together

## 🔍 Troubleshooting Guide

### **"No Data" in Grafana**
1. Check if Prometheus has data:
   ```bash
   curl "http://localhost:9090/api/v1/query?query=kafka_brokers"
   ```
2. Check if targets are up:
   ```bash
   curl http://localhost:9090/api/v1/targets
   ```

### **Services Not Starting**
1. Check container logs:
   ```bash
   docker compose logs prometheus
   docker compose logs grafana
   ```
2. Check port conflicts:
   ```bash
   lsof -i :3000  # Grafana
   lsof -i :9090  # Prometheus
   ```

### **CORS Issues**
- Already fixed in docker-compose.yml
- If you see "origin not allowed", restart Grafana:
  ```bash
  docker compose restart grafana
  ```

### **Login/Authentication Issues**
- If you get "Unauthorized" after password change:
  ```bash
  # Reset admin password
  docker compose exec grafana grafana-cli admin reset-admin-password admin
  
  # Or completely reset Grafana (removes all data)
  docker compose down grafana
  docker volume rm monitoring_grafana_data
  docker compose up -d grafana
  ```
- Default credentials: **admin/admin**

## 🎨 Dashboard Examples

### **Kafka Dashboard**
- Number of brokers
- Number of topics
- Consumer group lag
- Message rates

### **System Dashboard**
- CPU usage
- Memory usage
- Disk space
- Network traffic

### **Custom Dashboards**
You can create dashboards for:
- Your application metrics
- Database performance
- API response times
- Error rates

## 🔮 Future Enhancements

### **Easy Additions**
- **AlertManager**: Send notifications when metrics are bad
- **Jaeger**: Distributed tracing for microservices
- **Elasticsearch**: Log aggregation and search
- **Custom Exporters**: Monitor your own applications

### **Scaling**
- **Prometheus Federation**: Multiple Prometheus servers
- **Grafana Clustering**: Multiple Grafana instances
- **Persistent Storage**: Keep data when containers restart

## 📚 Learning Resources

### **Prometheus**
- [Prometheus Query Language](https://prometheus.io/docs/prometheus/latest/querying/)
- [Metric Types](https://prometheus.io/docs/concepts/metric_types/)

### **Grafana**
- [Dashboard Creation](https://grafana.com/docs/grafana/latest/dashboards/)
- [Panel Types](https://grafana.com/docs/grafana/latest/panels/)

### **Kafka**
- [JMX Metrics](https://kafka.apache.org/documentation/#monitoring)
- [Kafka Exporter](https://github.com/danielqsj/kafka-exporter)

---

## 🎯 Summary

This monitoring stack gives you:
- ✅ **Real-time visibility** into your system
- ✅ **Beautiful dashboards** for metrics
- ✅ **Historical data** for trends
- ✅ **Easy setup** with Docker Compose
- ✅ **Scalable architecture** for growth

**Start with**: `./start-monitoring.sh`
**View dashboards**: http://localhost:3000
**Explore data**: http://localhost:9090

Happy monitoring! 📊✨
