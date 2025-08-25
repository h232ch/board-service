# Kafka Performance Monitoring Stack

This directory contains a complete monitoring stack for Kafka using Prometheus and Grafana, providing beautiful dashboards and real-time performance metrics.

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Prometheus    │    │     Grafana     │    │ Kafka Exporter  │
│   Port: 9090    │    │   Port: 3000    │    │   Port: 9308    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Node Exporter │
                    │   Port: 9100    │
                    └─────────────────┘
```

## 🚀 **Quick Start**

### **Prerequisites**
- Kafka must be running (see `../kafka/README.md`)
- Docker and Docker Compose installed

### **Start Monitoring Stack**
```bash
cd monitoring
chmod +x *.sh
./start-monitoring.sh
```

### **Access Dashboards**
- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Kafka Exporter**: http://localhost:9308/metrics

### **Stop Monitoring Stack**
```bash
./stop-monitoring.sh
```

## 📊 **Available Metrics**

### **Kafka Metrics (via Kafka Exporter)**
- **Messages In/Out**: Per second rates
- **Bytes In/Out**: Data transfer rates
- **Consumer Lag**: Real-time lag monitoring
- **Partition Status**: Online/offline partitions
- **Topic Information**: Partition count, replication factor

### **System Metrics (via Node Exporter)**
- **CPU Usage**: System and container CPU
- **Memory Usage**: System and container memory
- **Disk I/O**: Storage performance
- **Network I/O**: Network performance
- **File System**: Disk usage and availability

### **Prometheus Metrics**
- **Service Health**: Prometheus, Grafana, Kafka Exporter status
- **Scrape Metrics**: Collection success/failure rates
- **Storage Metrics**: Time series database performance

## 🎯 **Dashboard Features**

### **Kafka Performance Dashboard**
The included dashboard provides:

#### **1. Message Throughput**
- **Messages In Per Second**: Real-time message ingestion rate
- **Bytes In Per Second**: Data transfer rate
- **Per-topic breakdown**: Individual topic performance

#### **2. Consumer Monitoring**
- **Consumer Lag**: Messages behind real-time
- **Consumer Groups**: Active consumer group status
- **Lag Alerts**: Visual indicators for high lag

#### **3. System Health**
- **CPU Usage**: System resource utilization
- **Memory Usage**: Memory consumption patterns
- **Disk I/O**: Storage performance metrics

#### **4. Kafka Cluster Status**
- **Active Controllers**: Controller health
- **Offline Partitions**: Partition availability
- **Replication Status**: Data redundancy health

## 🔧 **Configuration Details**

### **Prometheus Configuration**
```yaml
# prometheus/prometheus.yml
scrape_configs:
  - job_name: 'kafka-exporter'      # Kafka metrics
  - job_name: 'node-exporter'       # System metrics
  - job_name: 'kafka-jmx'          # JMX metrics
  - job_name: 'vector-metrics'     # Vector sidecar metrics
```

### **Grafana Configuration**
```yaml
# grafana/provisioning/datasources/prometheus.yml
datasources:
  - name: Prometheus
    type: prometheus
    url: http://prometheus:9090
```

### **Kafka Exporter Configuration**
```bash
# docker-compose.yml
kafka-exporter:
  command:
    - '--kafka.server=kafka:9092'    # Kafka broker address
    - '--web.listen-address=:9308'   # Metrics endpoint
```

## 🧪 **Testing and Validation**

### **Check Service Health**
```bash
# Check all services are running
docker compose ps

# Check Prometheus targets
curl http://localhost:9090/api/v1/targets

# Check Kafka Exporter metrics
curl http://localhost:9308/metrics | grep kafka
```

### **Generate Test Data**
```bash
# Send test messages to generate metrics
cd ../kafka
for i in {1..100}; do
    echo "Test message $i: $(date)" | docker compose exec -T kafka kafka-console-producer \
        --bootstrap-server localhost:9090 --topic board-service-logs
done
```

### **Monitor Real-time**
```bash
# Watch logs in real-time
docker compose logs -f

# Monitor specific service
docker compose logs -f grafana
```

## 📈 **Performance Monitoring Best Practices**

### **1. Key Metrics to Watch**
- **Consumer Lag > 1000**: Investigate consumer performance
- **CPU Usage > 80%**: Consider scaling or optimization
- **Memory Usage > 90%**: Check for memory leaks
- **Disk Usage > 85%**: Plan for cleanup or expansion

### **2. Alerting Setup**
```yaml
# Example Prometheus alert rules
groups:
  - name: kafka_alerts
    rules:
      - alert: HighConsumerLag
        expr: kafka_consumer_group_lag > 1000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High consumer lag detected"
```

### **3. Dashboard Customization**
- **Add Custom Panels**: Create panels for specific metrics
- **Set Thresholds**: Configure warning and critical levels
- **Create Alerts**: Set up notifications for performance issues

## 🔍 **Troubleshooting**

### **Common Issues**

#### **1. Prometheus Can't Scrape Kafka Exporter**
```bash
# Check if Kafka Exporter is running
docker compose ps kafka-exporter

# Check Kafka Exporter logs
docker compose logs kafka-exporter

# Verify Kafka connectivity
docker compose exec kafka-exporter wget -qO- http://kafka:9092
```

#### **2. Grafana Can't Connect to Prometheus**
```bash
# Check Prometheus is running
docker compose ps prometheus

# Check Prometheus logs
docker compose logs prometheus

# Verify Prometheus API
curl http://localhost:9090/api/v1/status/config
```

#### **3. No Metrics Appearing**
```bash
# Check Kafka is running
docker compose -f ../kafka/docker-compose.yml ps

# Verify Kafka Exporter can connect to Kafka
docker compose exec kafka-exporter wget -qO- http://kafka:9092

# Check Prometheus targets
curl http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | select(.health == "up")'
```

### **Debug Commands**
```bash
# Check all service logs
docker compose logs

# Check specific service
docker compose logs prometheus

# Check network connectivity
docker compose exec prometheus ping kafka-exporter

# Check volume mounts
docker compose exec prometheus ls -la /etc/prometheus/
```

## 🚀 **Advanced Features**

### **1. Custom Dashboards**
Create custom dashboards for:
- **Vector Sidecar Metrics**: Monitor Vector performance
- **Application Metrics**: Your board service metrics
- **Infrastructure Metrics**: K8s cluster metrics

### **2. Alerting Integration**
- **Email Alerts**: Configure SMTP for notifications
- **Slack Integration**: Send alerts to Slack channels
- **PagerDuty**: Integrate with incident management

### **3. Data Retention**
- **Prometheus Retention**: Configure data retention periods
- **Backup Strategy**: Set up regular backups
- **Long-term Storage**: Integrate with remote storage

## 📚 **Useful Resources**

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Kafka Exporter](https://github.com/danielqsj/kafka_exporter)
- [Node Exporter](https://github.com/prometheus/node_exporter)

## 🎯 **Next Steps**

1. **Customize Dashboards**: Add panels for your specific needs
2. **Set Up Alerting**: Configure alerts for performance issues
3. **Integrate Vector Metrics**: Add Vector sidecar metrics
4. **Scale Monitoring**: Add more services and metrics
5. **Production Setup**: Configure for production deployment

**Your Kafka monitoring stack is now ready with beautiful dashboards and comprehensive metrics!** 📊✨
