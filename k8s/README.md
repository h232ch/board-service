# Board Service - Complete Kubernetes Deployment Guide

This directory contains a complete Kubernetes deployment setup for the Board Service. This guide will walk you through every concept, file, and step to help you understand Kubernetes deeply.

## 🎯 **What We Accomplished**

### 1. **Minikube Installation & Setup**
- Installed and configured Minikube for local Kubernetes development
- Resolved validation issues by recreating the cluster
- Enabled essential addons (ingress, storage-provisioner)

### 2. **Complete Kubernetes Deployment**
- Created all necessary Kubernetes manifests
- Deployed the entire application stack
- Configured networking, services, and ingress

### 3. **Service Connectivity**
- Connected Kubernetes services to localhost via port-forwarding
- Set up ingress routing for production-like access
- Verified all services are working correctly

## 🚀 **Prerequisites**

- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) - Kubernetes command-line tool
- [Minikube](https://minikube.sigs.k8s.io/docs/start/) - Local Kubernetes cluster
- [Docker](https://docs.docker.com/get-docker/) - Container runtime

## 📚 **Kubernetes Concepts Explained**

### **What is Kubernetes (K8s)?**
Kubernetes is a container orchestration platform that automates the deployment, scaling, and management of containerized applications. Think of it as an "operating system" for your distributed applications.

### **Key Concepts:**
- **Pod**: Smallest deployable unit (contains one or more containers)
- **Deployment**: Manages Pod replicas and updates
- **Service**: Provides stable networking for Pods
- **Ingress**: External access and routing rules
- **Namespace**: Logical isolation of resources
- **ConfigMap/Secret**: Configuration and sensitive data storage

## 🏗️ **Architecture Overview**

```
Internet → Ingress → Services → Pods
                    ↓
              ┌─────────────┐
              │   Frontend  │ (React + Nginx)
              │   Service   │
              └─────────────┘
                    ↓
              ┌─────────────┐
              │   Backend   │ (Node.js + Express)
              │   Service   │
              └─────────────┘
                    ↓
              ┌─────────────┐
              │   MongoDB   │ (External Cloud Database)
              │  (External) │
              └─────────────┘
```

## 📁 **Detailed File Explanations**

### **1. namespace.yaml**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: board-service
  labels:
    name: board-service
```

**What it does:**
- Creates a logical container called `board-service`
- Isolates all our application resources from other applications
- Prevents naming conflicts and provides security boundaries

**Why it's important:**
- **Resource Organization**: Groups related resources together
- **Security**: Limits access and permissions
- **Cleanup**: Easy to delete all resources at once
- **Multi-tenancy**: Can have multiple applications in different namespaces

### **2. configmap.yaml**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: board-service-config
  namespace: board-service
data:
  NODE_ENV: "production"
```

**What it does:**
- Stores non-sensitive configuration data
- Makes configuration external to container images
- Allows changing config without rebuilding images

**Why it's important:**
- **Environment Management**: Different configs for dev/staging/prod
- **Configuration as Code**: Version control your configuration
- **No Rebuilds**: Change config without rebuilding containers
- **Separation of Concerns**: Keep config separate from application code

### **3. secret.yaml**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: board-service-secrets
  namespace: board-service
type: Opaque
data:
  MONGODB_URI: <base64-encoded>
  JWT_SECRET: <base64-encoded>
stringData:
  MONGODB_URI: "mongodb+srv://..."
  JWT_SECRET: "your_secret_here"
```

**What it does:**
- Stores sensitive data (passwords, API keys, database URIs)
- Automatically base64-encodes the data
- Provides both `data` (encoded) and `stringData` (plain text) fields

**Why it's important:**
- **Security**: Sensitive data is not stored in plain text
- **Access Control**: Kubernetes manages who can access secrets
- **No Hardcoding**: Credentials are not in container images
- **Rotation**: Easy to update secrets without redeploying

**Security Note**: In production, use proper secret management tools like HashiCorp Vault or cloud provider secret managers.

### **4. backend-deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: board-backend
  namespace: board-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: board-backend
  template:
    spec:
      containers:
      - name: board-backend
        image: dnwn7166/board-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: board-service-config
              key: NODE_ENV
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: board-service-secrets
              key: MONGODB_URI
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
```

**What it does:**
- Creates and manages 2 identical backend Pods
- Ensures high availability (if one Pod fails, another continues)
- Automatically restarts failed Pods
- Manages rolling updates

**Key Components Explained:**

**Replicas:**
- `replicas: 2` means 2 identical Pods run simultaneously
- Provides high availability and load distribution
- Kubernetes automatically distributes traffic between them

**Selector & Labels:**
- `selector` tells the Deployment which Pods to manage
- `matchLabels` ensures only Pods with `app: board-backend` are managed
- This is how Deployments find their Pods

**Environment Variables:**
- `NODE_ENV` comes from ConfigMap (non-sensitive)
- `MONGODB_URI` and `JWT_SECRET` come from Secret (sensitive)
- `valueFrom` tells Kubernetes where to get the value

**Health Checks:**
- **Liveness Probe**: Checks if Pod is alive (restarts if fails)
- **Readiness Probe**: Checks if Pod is ready to receive traffic
- Both use HTTP GET requests to `/health` endpoint

**Resource Management:**
- **Requests**: Minimum resources guaranteed to the Pod
- **Limits**: Maximum resources the Pod can use
- Prevents resource starvation and ensures fair distribution

### **5. frontend-deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: board-frontend
  namespace: board-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: board-frontend
  template:
    spec:
      containers:
      - name: board-frontend
        image: dnwn7166/board-frontend:latest
        ports:
        - containerPort: 80
        livenessProbe:
          httpGet:
            path: /health
            port: 80
        readinessProbe:
          httpGet:
            path: /health
            port: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"
```

**What it does:**
- Similar to backend deployment but for frontend
- Manages 2 frontend Pods for high availability
- Frontend is lighter on resources (64Mi-128Mi vs 128Mi-256Mi)

### **6. backend-service.yaml**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: board-backend-service
  namespace: board-service
spec:
  selector:
    app: board-backend
  ports:
  - protocol: TCP
    port: 8080
    targetPort: 8080
  type: ClusterIP
```

**What it does:**
- Creates a stable network endpoint for backend Pods
- Load balances traffic across all backend Pods
- Provides service discovery within the cluster

**Key Components:**

**Selector:**
- `app: board-backend` matches Pods with this label
- Service automatically finds and routes to these Pods

**Ports:**
- `port: 8080` - Port the service listens on
- `targetPort: 8080` - Port on the Pod to forward to

**Type: ClusterIP:**
- Internal service (not accessible from outside cluster)
- Other Pods can reach it using the service name
- Load balancing happens automatically

### **7. frontend-service.yaml**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: board-frontend-service
  namespace: board-service
spec:
  selector:
    app: board-frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: ClusterIP
```

**What it does:**
- Similar to backend service but for frontend
- Routes traffic to frontend Pods
- Frontend service listens on port 80

### **8. ingress.yaml**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: board-service-ingress
  namespace: board-service
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "false"
spec:
  ingressClassName: nginx
  rules:
  - host: board-service.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: board-frontend-service
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: board-backend-service
            port:
              number: 8080
      - path: /health
        pathType: Prefix
        backend:
          service:
            name: board-backend-service
            port:
              number: 8080
```

**What it does:**
- Provides external access to your services
- Routes traffic based on URL paths
- Acts as a reverse proxy

**Key Components:**

**Host:**
- `board-service.local` - Custom domain for your service
- You'll add this to your hosts file for local testing

**Path-based Routing:**
- `/` → Frontend service (React app)
- `/api` → Backend service (API endpoints)
- `/health` → Backend service (health checks)

**Annotations:**
- `rewrite-target: /` - Rewrites URLs for proper routing
- `ssl-redirect: false` - Disables HTTPS redirect for local testing

## 🚀 **Deployment Process Explained**

### **What deploy.sh Does Step by Step:**

```bash
#!/bin/bash
echo "🚀 Deploying Board Service to Kubernetes..."

# 1. Check and start minikube
if ! minikube status | grep -q "Running"; then
    echo "Starting minikube..."
    minikube start
fi

# 2. Enable ingress addon
echo "Enabling ingress addon..."
minikube addons enable ingress

# 3. Wait for ingress controller
echo "Waiting for ingress controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s

# 4. Create namespace
echo "Creating namespace..."
kubectl apply -f namespace.yaml

# 5. Apply ConfigMap and Secret
echo "Applying ConfigMap and Secret..."
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml

# 6. Deploy backend
echo "Deploying backend..."
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml

# 7. Deploy frontend
echo "Deploying frontend..."
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml

# 8. Deploy ingress
echo "Deploying ingress..."
kubectl apply -f ingress.yaml

# 9. Wait for deployments
echo "Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/board-backend -n board-service
kubectl wait --for=condition=available --timeout=300s deployment/board-frontend -n board-service
```

**Step-by-Step Breakdown:**

1. **Minikube Check**: Ensures local Kubernetes cluster is running
2. **Ingress Addon**: Enables the nginx-ingress controller
3. **Controller Ready**: Waits for ingress controller to be fully operational
4. **Namespace**: Creates the logical container for all resources
5. **Configuration**: Applies ConfigMap and Secret with environment variables
6. **Backend**: Deploys backend Pods and Service
7. **Frontend**: Deploys frontend Pods and Service
8. **Ingress**: Sets up external routing rules
9. **Verification**: Waits for all Pods to be ready and healthy

## 🔌 **Service Connectivity Explained**

### **How We Connected Kubernetes Services to Localhost:**

#### **Method 1: Port Forwarding (What We Used)**

**Backend Port Forward:**
```bash
kubectl port-forward service/board-backend-service 8080:8080 -n board-service &
```

**What this does:**
- Creates a tunnel from your local machine to the Kubernetes cluster
- Maps `localhost:8080` → `board-backend-service:8080`
- The `&` runs it in the background

**Frontend Port Forward:**
```bash
kubectl port-forward service/board-frontend-service 3000:80 -n board-service &
```

**Why port 3000 instead of 80:**
- Port 80 requires root/sudo privileges (privileged port)
- Port 3000 is a non-privileged port (user can bind to it)
- Maps `localhost:3000` → `board-frontend-service:80`

#### **Method 2: Minikube Tunnel + Ingress (Production-like)**

**Start the tunnel:**
```bash
minikube tunnel
```

**What this does:**
- Creates a network tunnel from your machine to the minikube cluster
- Makes ingress resources accessible at `127.0.0.1`
- Requires sudo for ports 80/443 (privileged ports)

**Add to hosts file:**
```bash
echo "$(minikube ip) board-service.local" | sudo tee -a /etc/hosts
```

**Access via ingress:**
- Frontend: `http://board-service.local/`
- Backend API: `http://board-service.local/api`
- Health: `http://board-service.local/health`

### **Network Flow Diagrams:**

#### **Port Forwarding:**
```
Your Browser → localhost:3000 → kubectl port-forward → board-frontend-service → frontend Pods
Your Browser → localhost:8080 → kubectl port-forward → board-backend-service → backend Pods
```

#### **Ingress (Minikube Tunnel):**
```
Your Browser → board-service.local → Ingress Controller → Services → Pods
```

## 🧪 **Testing & Verification**

### **Health Check Commands:**

```bash
# Check all resources
kubectl get all -n board-service

# Check Pod status
kubectl get pods -n board-service

# Check services
kubectl get services -n board-service

# Check ingress
kubectl get ingress -n board-service

# View Pod logs
kubectl logs <pod-name> -n board-service

# Describe resources for detailed info
kubectl describe pod <pod-name> -n board-service
```

### **Service Testing:**

```bash
# Test backend health
curl http://localhost:8080/health

# Test frontend health
curl http://localhost:3000/health

# Test frontend main page
curl http://localhost:3000/

# Test via ingress (if tunnel is running)
curl http://board-service.local/health
```

## 🌐 **Ingress Testing & How It Works**

### **Why Use Minikube Tunnel for Ingress Testing?**

Ingress controllers in Kubernetes are designed to work with **LoadBalancer** services that have external IPs. However, in Minikube (local development), there's no cloud LoadBalancer, so we use **minikube tunnel** to simulate this behavior.

#### **The Problem:**
- **Ingress Controller**: Expects external LoadBalancer IP
- **Minikube**: Only provides internal cluster IPs
- **Result**: Ingress not accessible from outside the cluster

#### **The Solution:**
- **minikube tunnel**: Creates network tunnel to expose ingress
- **Maps external ports**: 80/443 → internal cluster ports
- **Simulates LoadBalancer**: Makes ingress accessible locally

### **How to Test Ingress with Tunnel:**

#### **Step 1: Start Minikube Tunnel**
```bash
# In a NEW terminal window/tab
minikube tunnel

# This will ask for sudo password
# Keep this terminal running - don't close it
```

**Expected Output:**
```
✅  Tunnel successfully started
📌  NOTE: Please do not close this terminal as this process must stay alive for the tunnel to be accessible ...
❗  The service/ingress board-service-ingress requires privileged ports to be exposed: [80 443]
🔑  sudo permission will be asked for it.
🏃  Starting tunnel for service board-service-ingress.
```

#### **Step 2: Verify Tunnel is Running**
```bash
# Check tunnel processes
ps aux | grep "minikube tunnel" | grep -v grep

# Should show tunnel process running
```

#### **Step 3: Test Ingress Access**
```bash
# Test frontend (root path)
curl http://board-service.local/

# Test backend health
curl http://board-service.local/health

# Test backend API
curl http://board-service.local/api/users
```

### **Understanding Host Headers and Ingress Routing:**

#### **The Key Concept: Ingress Routes by HOST, Not IP**

Ingress controllers use the **HTTP Host header** to determine which routing rules to apply, not the IP address. This is crucial for understanding how ingress works.

#### **Two Access Methods:**

##### **Method 1: Domain Access (Recommended)**
```bash
curl http://board-service.local/health
curl http://board-service.local/
curl http://board-service.local/api/users
```

**Why this works:**
- **Domain**: `board-service.local` → Ingress knows which hostname
- **No headers needed**: Domain provides the routing information
- **Clean and intuitive**: Just like production environments

##### **Method 2: IP Access with Host Header**
```bash
curl -H "Host: board-service.local" http://127.0.0.1/health
curl -H "Host: board-service.local" http://127.0.0.1/
curl -H "Host: board-service.local" http://127.0.0.1/api/users
```

**Why Host header is required:**
- **IP**: `127.0.0.1` → Ingress doesn't know which hostname
- **Host header**: `board-service.local` → Tells ingress which routing rules to use
- **More explicit**: Useful for scripts and automation

#### **What Happens Without Host Header:**
```bash
# This will NOT work properly
curl http://127.0.0.1/health

# Result: Ingress doesn't know which hostname you want
# May route to default backend or return 404
```

### **How Ingress Routing Actually Works:**

#### **Ingress Controller Logic:**
```
1. Request arrives at ingress controller
2. Controller extracts Host header from request
3. Controller looks up routing rules for that hostname
4. Controller routes request to appropriate service
5. Service forwards to Pods
```

#### **Our Ingress Configuration:**
```yaml
rules:
- host: board-service.local          # ← This is the key!
  http:
    paths:
    - path: /                        # Frontend
      backend: board-frontend-service
    - path: /api                     # Backend API
      backend: board-backend-service
    - path: /health                  # Backend health
      backend: board-backend-service
```

#### **Routing Examples:**
```
Request: GET http://board-service.local/health
Host: board-service.local
Path: /health
Result: Routes to board-backend-service

Request: GET http://board-service.local/
Host: board-service.local  
Path: /
Result: Routes to board-frontend-service

Request: GET http://board-service.local/api/users
Host: board-service.local
Path: /api/users
Result: Routes to board-backend-service
```

### **Testing Commands Reference:**

#### **Frontend Testing:**
```bash
# Test main page
curl http://board-service.local/

# Test with verbose output
curl -v http://board-service.local/

# Test with custom User-Agent
curl -H "User-Agent: Mozilla/5.0" http://board-service.local/
```

#### **Backend Testing:**
```bash
# Test health endpoint
curl http://board-service.local/health

# Test API endpoints
curl http://board-service.local/api/users
curl http://board-service.local/api/posts

# Test with JSON response
curl -H "Accept: application/json" http://board-service.local/health
```

#### **Troubleshooting Ingress:**
```bash
# Check ingress status
kubectl get ingress -n board-service

# Check ingress controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller

# Check if tunnel is running
ps aux | grep "minikube tunnel" | grep -v grep

# Test tunnel connectivity
curl -H "Host: board-service.local" http://127.0.0.1/health
```

### **Common Ingress Issues & Solutions:**

#### **Issue 1: "Connection Refused"**
**Cause**: Tunnel not running or ingress controller not ready
**Solution**: 
```bash
# Start tunnel in new terminal
minikube tunnel

# Check ingress controller
kubectl get pods -n ingress-nginx
```

#### **Issue 2: "404 Not Found"**
**Cause**: Incorrect path routing or service not ready
**Solution**:
```bash
# Check service endpoints
kubectl get endpoints -n board-service

# Check ingress configuration
kubectl get ingress -n board-service -o yaml
```

#### **Issue 3: "Host Not Found"**
**Cause**: Hosts file not updated or tunnel not working
**Solution**:
```bash
# Update hosts file
echo "$(minikube ip) board-service.local" | sudo tee -a /etc/hosts

# Verify tunnel is running
ps aux | grep "minikube tunnel"
```

### **Production vs Development:**

#### **Development (Minikube):**
- **Access**: `http://board-service.local/*`
- **Tunnel**: Required for ingress access
- **Ports**: 80/443 (privileged, requires sudo)

#### **Production (EKS/GKE):**
- **Access**: `https://yourdomain.com/*`
- **LoadBalancer**: Cloud provider handles external access
- **Ports**: 80/443 (handled by cloud infrastructure)

**The beauty of this setup is that your ingress configuration works the same way in both environments!** 🚀

## 🏢 **EKS Architecture: Why Ingress Controller is Still Essential**

### **The Common Misconception:**

Many people think that in EKS, the ALB (Application Load Balancer) and Target Groups can directly route to application Pods, making the Ingress Controller unnecessary. **This is incorrect!** Let me explain why.

### **What You Might Think:**
```
ALB → Target Groups → Pod IPs (Direct routing)
```

### **What Actually Happens:**
```
ALB → Target Groups → Ingress Controller Pods → Your App Pods
```

## 🎯 **Why Ingress Controller is Still Needed:**

### **1. ALB Doesn't Understand Kubernetes Services:**
```
ALB Limitation:
├── ALB only knows: Pod IPs
├── ALB doesn't know: Service names
├── ALB doesn't know: Service selectors
├── ALB doesn't know: Pod labels
└── ALB doesn't know: Kubernetes routing rules
```

### **2. Target Groups Only Know IPs:**
```
Target Group:
├── Knows: Pod IP addresses
├── Knows: Health check status
├── Doesn't know: Which service the Pod belongs to
├── Doesn't know: How to route different paths
└── Doesn't know: Host-based routing
```

## 🏗️ **The Complete EKS Architecture:**

### **What ALB Controller Actually Creates:**
```
ALB Controller Creates:
├── ALB
├── Target Groups
└── Routes ALB → Ingress Controller Pods (not directly to your app Pods)
```

### **What Ingress Controller Does:**
```
Ingress Controller:
├── Receives traffic from ALB
├── Applies Kubernetes routing rules
├── Routes to correct services
├── Handles path-based routing
├── Manages host-based routing
└── Forwards to your app Pods
```

## 🔄 **Real EKS Traffic Flow:**

### **Step-by-Step:**
```
1. User visits: https://yourdomain.com/api/users
2. DNS → AWS ALB
3. ALB → Target Group (Ingress Controller Pods)
4. Ingress Controller receives request
5. Ingress Controller checks routing rules:
   - Host: yourdomain.com ✅
   - Path: /api/users ✅
   - Route to: board-backend-service
6. Ingress Controller → board-backend-service
7. Service → Backend Pod
```

## 🎯 **Why This Two-Layer Approach:**

### **1. ALB Layer (AWS Infrastructure):**
```
Responsibilities:
├── SSL termination
├── Basic load balancing
├── Health checks
├── AWS integration
└── Traffic distribution to Ingress Controller Pods
```

### **2. Ingress Controller Layer (Kubernetes Logic):**
```
Responsibilities:
├── Kubernetes service discovery
├── Path-based routing
├── Host-based routing
├── Service selection
├── Pod health monitoring
└── Kubernetes-native routing
```

## 💡 **Analogy: Hotel Concierge System**

### **ALB = Hotel Front Desk:**
```
Front Desk (ALB):
├── Receives all guests
├── Checks if they're registered
├── Directs them to appropriate concierge
└── Doesn't know room details
```

### **Ingress Controller = Concierge:**
```
Concierge (Ingress Controller):
├── Knows all room locations
├── Knows guest preferences
├── Routes guests to correct rooms
├── Handles special requests
└── Manages internal routing
```

### **Your App Pods = Hotel Rooms:**
```
Rooms (App Pods):
├── Provide actual service
├── Handle guest requests
└── Don't know about other rooms
```

## 🔍 **Let's Look at the Actual EKS Setup:**

### **ALB Controller Creates:**
```yaml
# This is what ALB Controller creates automatically
Target Group: ingress-controller-targets
├── Targets: Ingress Controller Pod IPs
├── Port: 80
└── Health Check: /health (on Ingress Controller)
```

### **Ingress Controller Handles:**
```yaml
# This is what Ingress Controller routes
apiVersion: networking.k8s.io/v1
kind: Ingress
spec:
  rules:
  - host: yourdomain.com
    http:
      paths:
      - path: /          → board-frontend-service
      - path: /api       → board-backend-service
      - path: /health    → board-backend-service
```

## 🚀 **Why Not Direct ALB → App Pods?**

### **1. Service Discovery:**
```
ALB Problem:
├── ALB doesn't know about Kubernetes services
├── ALB doesn't understand service selectors
├── ALB doesn't know which Pods belong to which service
└── ALB can't handle service changes
```

### **2. Dynamic Pod Management:**
```
Kubernetes Reality:
├── Pods come and go (scaling, failures, updates)
├── Services automatically update endpoints
├── Ingress Controller watches service changes
└── ALB only knows static Pod IPs
```

### **3. Complex Routing:**
```
Ingress Controller Capabilities:
├── Path-based routing (/api → backend, / → frontend)
├── Host-based routing (api.yourdomain.com vs www.yourdomain.com)
├── Header-based routing
├── Weight-based routing
└── Canary deployments
```

## 🎯 **The Two-Layer Architecture Benefits:**

### **1. Separation of Concerns:**
- **ALB**: AWS infrastructure, SSL, basic load balancing
- **Ingress Controller**: Kubernetes logic, service discovery, routing

### **2. Flexibility:**
- **ALB**: Can be replaced with other load balancers
- **Ingress Controller**: Can be replaced with other controllers (Traefik, Istio)

### **3. Scalability:**
- **ALB**: Scales based on traffic
- **Ingress Controller**: Scales based on routing complexity

## 🏆 **Key Takeaway:**

**The Ingress Controller is absolutely essential because:**

1. **ALB doesn't understand Kubernetes** - it only knows Pod IPs
2. **Target Groups don't know services** - they only know IPs
3. **Ingress Controller bridges** AWS infrastructure and Kubernetes logic
4. **Two-layer approach** provides flexibility and separation of concerns

**Think of it as: ALB handles "getting traffic to the cluster", Ingress Controller handles "routing traffic within the cluster"** 🚀✨

**This is why EKS is so powerful - it combines AWS infrastructure with Kubernetes intelligence!** 🌐🏢

## 🔧 **Troubleshooting Guide**

### **Common Issues & Solutions:**

#### **1. Pods Not Starting**
```bash
# Check Pod status
kubectl get pods -n board-service

# Check Pod events
kubectl describe pod <pod-name> -n board-service

# Check Pod logs
kubectl logs <pod-name> -n board-service
```

**Common causes:**
- Resource limits too low
- Image pull failures
- Environment variable issues
- Health check failures

#### **2. Services Not Accessible**
```bash
# Check service endpoints
kubectl get endpoints -n board-service

# Check service details
kubectl describe service <service-name> -n board-service
```

**Common causes:**
- Pod labels don't match service selectors
- Pods not ready
- Port mismatches

#### **3. Ingress Not Working**
```bash
# Check ingress status
kubectl get ingress -n board-service

# Check ingress controller
kubectl get pods -n ingress-nginx
```

**Common causes:**
- Ingress controller not running
- Minikube tunnel not started
- Hosts file not updated

### **Debug Commands:**

```bash
# Get detailed resource information
kubectl describe <resource-type> <resource-name> -n board-service

# View resource events
kubectl get events -n board-service --sort-by='.lastTimestamp'

# Check resource YAML
kubectl get <resource-type> <resource-name> -n board-service -o yaml

# Port forward for direct access
kubectl port-forward service/<service-name> <local-port>:<service-port> -n board-service
```

## 🚀 **Production Considerations**

### **For EKS Deployment:**

1. **Image Tags**: Use specific versions instead of `latest`
2. **Resource Limits**: Adjust based on actual usage patterns
3. **Monitoring**: Set up Prometheus, Grafana, and alerting
4. **Autoscaling**: Configure HPA (Horizontal Pod Autoscaler)
5. **SSL/TLS**: Proper certificate management
6. **Network Policies**: Restrict pod-to-pod communication
7. **Backup**: Persistent data backup strategies

### **Security Best Practices:**

1. **RBAC**: Role-based access control
2. **Pod Security Standards**: Follow security policies
3. **Image Scanning**: Vulnerability scanning
4. **Secret Rotation**: Regular credential updates
5. **Network Policies**: Restrict traffic flow
6. **Audit Logging**: Monitor cluster activities

## 📚 **Learning Resources**

### **Kubernetes Concepts:**
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kubernetes Concepts](https://kubernetes.io/docs/concepts/)
- [Kubernetes Tutorials](https://kubernetes.io/docs/tutorials/)

### **Minikube:**
- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)
- [Minikube Start Guide](https://minikube.sigs.k8s.io/docs/start/)

### **Kubectl:**
- [Kubectl Reference](https://kubernetes.io/docs/reference/kubectl/)
- [Kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

## 🎯 **Next Steps**

### **Immediate:**
1. ✅ Deploy to Minikube (Completed)
2. ✅ Test all services (Completed)
3. ✅ Verify connectivity (Completed)

### **Short Term:**
1. **Customize Configuration**: Modify resource limits, replica counts
2. **Add Monitoring**: Set up basic monitoring and logging
3. **Test Scaling**: Test horizontal scaling capabilities

### **Long Term:**
1. **EKS Migration**: Adapt manifests for AWS EKS
2. **CI/CD Pipeline**: Automate deployment process
3. **Production Hardening**: Security, monitoring, backup strategies

## 🏆 **What You've Learned**

By completing this deployment, you now understand:

1. **Kubernetes Architecture**: How Pods, Services, and Ingress work together
2. **Resource Management**: How to define and manage compute resources
3. **Configuration Management**: How to use ConfigMaps and Secrets
4. **Networking**: How services communicate and how to expose them externally
5. **Deployment Strategies**: How to deploy and manage application updates
6. **Health Monitoring**: How to implement health checks and monitoring
7. **Local Development**: How to use Minikube for local Kubernetes development

This foundation will serve you well as you move to production environments like EKS!

---

## 🔒 **Persistent Volume Claims (PVC) Configuration & Theory**

### **🚀 What We Accomplished**

In this session, we successfully implemented **persistent storage for application logs** in your Kubernetes deployment, ensuring that:
- ✅ **Frontend Nginx logs** persist across pod restarts
- ✅ **Backend Node.js logs** persist across pod restarts  
- ✅ **Volume mounts** work seamlessly with existing deployments
- ✅ **Storage provisioning** is automated and scalable
- ✅ **Logging functionality** is production-ready

---

## 📚 **Theory of Persistent Volume Claims (PVC)**

### **1. What is a PVC?**

**Persistent Volume Claim (PVC)** is a request for storage by a user. It's like a "storage reservation" that:
- **Requests storage** from the cluster
- **Specifies requirements** (size, access mode, storage class)
- **Gets bound** to a Persistent Volume (PV)
- **Provides persistent storage** to pods

### **2. PVC vs Local Storage**

#### **❌ Local Storage (Docker Compose):**
```yaml
# docker-compose.yml
volumes:
  - /var/log/app/board-service/nginx:/var/log/app/board-service/nginx
  - /var/log/app/board-service/nodejs:/var/log/app/board-service/nodejs
```
- **Direct host mounting** to local filesystem
- **Accessible from host** machine
- **Lost on host restart** or filesystem changes
- **Not portable** across different environments

#### **✅ PVC Storage (Kubernetes):**
```yaml
# k8s/persistent-volume-claims.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nginx-logs-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: standard
```
- **Cluster-managed storage** independent of host
- **Persistent across** pod restarts and deployments
- **Portable** across different K8s environments
- **Scalable** and enterprise-grade

### **3. Storage Architecture in Minikube**

```bash
Your Mac (Host) → Docker Desktop → Minikube Container → PVC Storage
```

**Storage Location:**
- **NOT on your local disk** (`/var/log/app/board-service/`)
- **INSIDE minikube container** (`/var/lib/minikube/volumes/`)
- **Managed by K8s** storage provisioner
- **Isolated from host** filesystem

---

## 🛠️ **How to Configure PVCs**

### **1. Create PVC Definitions**

```yaml
# k8s/persistent-volume-claims.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nginx-logs-pvc
  namespace: board-service
  labels:
    app: board-frontend
    component: logs
spec:
  accessModes:
    - ReadWriteOnce  # Single node read/write
  resources:
    requests:
      storage: 1Gi   # Request 1GB of storage
  storageClassName: standard  # Use available storage class
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: backend-logs-pvc
  namespace: board-service
  labels:
    app: board-backend
    component: logs
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: standard
```

### **2. Update Deployments with Volume Mounts**

#### **Frontend Deployment:**
```yaml
# k8s/frontend-deployment.yaml
spec:
  template:
    spec:
      containers:
      - name: board-frontend
        # ... existing config ...
        volumeMounts:
        - name: nginx-logs
          mountPath: /var/log/app/board-service/nginx
      volumes:
      - name: nginx-logs
        persistentVolumeClaim:
          claimName: nginx-logs-pvc
```

#### **Backend Deployment:**
```yaml
# k8s/backend-deployment.yaml
spec:
  template:
    spec:
      containers:
      - name: board-backend
        # ... existing config ...
        volumeMounts:
        - name: backend-logs
          mountPath: /var/log/app/board-service/nodejs
      volumes:
      - name: backend-logs
        persistentVolumeClaim:
          claimName: backend-logs-pvc
```

### **3. Update Kustomization**

```yaml
# k8s/kustomization.yaml
resources:
- namespace.yaml
- configmap.yaml
- secret.yaml
- persistent-volume-claims.yaml  # ← Add this line
- backend-deployment.yaml
- backend-service.yaml
- frontend-deployment.yaml
- frontend-service.yaml
- ingress.yaml
```

---

## 🔗 **How PVCs Work with Existing Configuration**

### **1. Integration with Deployments**

#### **Before PVC (Ephemeral Storage):**
```yaml
# Pods wrote logs to container filesystem
# Logs lost on pod restart
# No persistent storage
```

#### **After PVC (Persistent Storage):**
```yaml
# Pods write logs to mounted PVC
# Logs survive pod restarts
# Storage persists across deployments
```

### **2. Service Discovery Unchanged**

```yaml
# k8s/backend-service.yaml - NO CHANGES NEEDED
apiVersion: v1
kind: Service
metadata:
  name: board-backend-service  # Service name unchanged
spec:
  selector:
    app: board-backend         # Selector unchanged
  ports:
  - port: 8080                # Port unchanged
```

### **3. Ingress Configuration Unchanged**

```yaml
# k8s/ingress.yaml - NO CHANGES NEEDED
spec:
  rules:
  - host: board-service.local
    http:
      paths:
      - path: /api
        backend:
          service:
            name: board-backend-service  # Routes unchanged
            port: 8080
```

### **4. Resource Management Enhanced**

```yaml
# Deployments now include:
spec:
  template:
    spec:
      containers:
      - name: board-frontend
        resources:
          requests:
            memory: "64Mi"     # CPU/Memory unchanged
            cpu: "50m"
        volumeMounts:          # ← NEW: Volume mounts
        - name: nginx-logs
          mountPath: /var/log/app/board-service/nginx
```

---

## 📊 **How Logging Works with PVCs**

### **1. Log Flow Architecture**

```bash
Application → Container Filesystem → Volume Mount → PVC → Persistent Storage
```

#### **Frontend Logging:**
```nginx
# nginx.conf
location /api/ {
    access_log /var/log/app/board-service/nginx/access.log main;
    # ↑ This path is now mounted to PVC
}
```

#### **Backend Logging:**
```javascript
// logger.js
const logDir = '/var/log/app/board-service/nodejs';
// ↑ This path is now mounted to PVC
```

### **2. Log Persistence Benefits**

#### **✅ Across Pod Restarts:**
```bash
# Pod restarts, logs remain
kubectl delete pod <pod-name> -n board-service
kubectl get pods -n board-service  # New pod starts
kubectl exec -it <new-pod> -- ls -la /var/log/app/board-service/nginx/
# ↑ Logs still exist!
```

#### **✅ Across Deployments:**
```bash
# Update deployment, logs persist
kubectl set image deployment/board-frontend board-frontend=new-image:tag
kubectl get pods -n board-service  # New pods start
# ↑ All previous logs remain accessible
```

#### **✅ Across Scaling Events:**
```bash
# Scale up/down, logs shared
kubectl scale deployment board-frontend --replicas=3
# ↑ All pods share same PVC, logs accessible from any pod
```

### **3. Log Access Methods**

#### **From Inside Pods:**
```bash
# Frontend logs
kubectl exec -it <frontend-pod> -- tail -f /var/log/app/board-service/nginx/access.log

# Backend logs
kubectl exec -it <backend-pod> -- tail -f /var/log/app/board-service/nodejs/access.log
```

#### **Copy Logs to Local (If needed):**
```bash
# Copy nginx logs
kubectl cp board-service/<frontend-pod>:/var/log/app/board-service/nginx/access.log ./nginx-access.log

# Copy backend logs
kubectl cp board-service/<backend-pod>:/var/log/app/board-service/nodejs/access.log ./backend-access.log
```

---

## 🧪 **Testing PVC Configuration**

### **1. Deploy and Verify**

```bash
# Apply configuration
kubectl apply -f k8s/

# Check PVC status
kubectl get pvc -n board-service

# Check pod status
kubectl get pods -n board-service

# Verify volume mounts
kubectl describe pod <pod-name> -n board-service | grep -A 10 "Volumes:"
```

### **2. Test Logging Functionality**

```bash
# Port forward to test
kubectl port-forward service/board-frontend-service 8080:80 -n board-service &

# Test frontend
curl -I http://localhost:8080

# Test API
curl -I http://localhost:8080/api/posts

# Check logs
kubectl exec -it <frontend-pod> -- tail -5 /var/log/app/board-service/nginx/access.log
```

### **3. Verify Persistence**

```bash
# Delete a pod
kubectl delete pod <pod-name> -n board-service

# Wait for new pod
kubectl get pods -n board-service

# Verify logs still exist
kubectl exec -it <new-pod> -- ls -la /var/log/app/board-service/nginx/
```

---

## 🎯 **Production Benefits**

### **1. Enterprise-Grade Logging**
- **Log retention** across deployments
- **Audit trails** for compliance
- **Security monitoring** capabilities
- **Performance analysis** over time

### **2. Scalability & Reliability**
- **Multiple replicas** share same storage
- **Load balancing** with persistent data
- **Rolling updates** preserve logs
- **Disaster recovery** capabilities

### **3. Operational Excellence**
- **Centralized logging** management
- **Easy troubleshooting** across pods
- **Consistent monitoring** setup
- **Standardized logging** practices

---

## 🚨 **Common Issues & Solutions**

### **1. PVC Pending Status**

#### **Problem:**
```bash
NAME               STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS
nginx-logs-pvc     Pending                                                     <unset>
```

#### **Solution:**
```bash
# Check available storage classes
kubectl get storageclass

# Update PVC to use available storage class
storageClassName: standard  # Instead of ""
```

### **2. Pods Stuck in Pending**

#### **Problem:**
```bash
NAME                              READY   STATUS    RESTARTS   AGE
board-frontend-xxx-xxx            0/1     Pending   0          1m
```

#### **Solution:**
```bash
# Check PVC binding
kubectl get pvc -n board-service

# Ensure PVCs are Bound before pods start
kubectl describe pod <pod-name> -n board-service
```

### **3. Volume Mount Errors**

#### **Problem:**
```bash
# Pod fails to start with volume mount errors
```

#### **Solution:**
```bash
# Verify PVC exists and is bound
kubectl get pvc -n board-service

# Check PVC details
kubectl describe pvc <pvc-name> -n board-service

# Verify storage class availability
kubectl get storageclass
```

---

## 🎉 **Summary of Accomplishments**

### **✅ What We Successfully Implemented:**

1. **Persistent Volume Claims**: Created PVCs for both frontend and backend logs
2. **Volume Mounts**: Integrated PVCs with existing deployments
3. **Storage Configuration**: Configured proper storage classes for minikube
4. **Logging Persistence**: Ensured logs survive pod restarts and deployments
5. **Production Readiness**: Achieved enterprise-grade logging capabilities

### **✅ Technical Achievements:**

- **PVC Creation**: `nginx-logs-pvc` and `backend-logs-pvc`
- **Volume Integration**: Seamless integration with existing K8s manifests
- **Storage Provisioning**: Automated storage allocation via storage classes
- **Log Persistence**: Complete log retention across all pod lifecycle events
- **Scalability**: Support for multiple replicas with shared storage

### **✅ Operational Benefits:**

- **Consistent Logging**: Same logging behavior across all environments
- **Easy Troubleshooting**: Persistent logs for debugging and monitoring
- **Security Compliance**: Complete audit trails for security monitoring
- **Performance Analysis**: Historical log data for optimization
- **Production Standards**: Enterprise-grade logging infrastructure

**Your Kubernetes deployment now has production-ready persistent logging that matches or exceeds your Docker Compose setup!** 🚀

**The PVC configuration ensures that your application logs are properly persisted, accessible, and scalable across all deployment scenarios.** 🛡️

---

## 🔍 **Vector Sidecar Logging with Kubernetes**

### **1. What is Vector and Configuration**

#### **Vector Overview:**
Vector is a high-performance, end-to-end observability data pipeline that enables you to collect, transform, and route logs, metrics, and traces to any destination. It's designed for reliability, performance, and operational simplicity.

#### **Key Features:**
- **High Performance**: Written in Rust for maximum speed and efficiency
- **Reliable**: Built-in retry logic, backpressure handling, and fault tolerance
- **Flexible**: Supports 100+ sources, transforms, and sinks
- **Kubernetes Native**: First-class support for K8s metadata and deployment patterns
- **Resource Efficient**: Low memory and CPU footprint

#### **Vector Configuration Structure:**
```yaml
# Sources: Where data comes from
sources:
  nginx_logs:
    type: "file"
    include: ["/var/log/app/board-service/nginx/*.log"]
  
  backend_logs:
    type: "file"
    include: ["/var/log/app/board-service/nodejs/*.log"]

# Transforms: How data is processed
transforms:
  parse_nginx:
    type: "remap"
    inputs: ["nginx_logs"]
    source: |
      # VRL (Vector Remap Language) for log parsing
      parsed = parse_nginx_log!(.message, "combined")
      .timestamp = parsed.timestamp
      .remote_addr = parsed.remote_addr

# Sinks: Where data goes
sinks:
  json_console:
    type: "console"
    inputs: ["add_metadata"]
    encoding:
      codec: "json"
      timestamp_format: "rfc3339"
```

#### **JSON Output Example:**
```json
{
  "timestamp": "2025-08-25T05:54:29Z",
  "cluster": "minikube",
  "component": "backend",
  "environment": "development",
  "level": "info",
  "message": "GET /health",
  "method": "GET",
  "url": "/health",
  "ip": "10.244.0.1",
  "kubernetes": {
    "container_name": "vector-sidecar",
    "namespace": "board-service",
    "pod_name": "board-backend-dd78b9fdb-mx8mt"
  },
  "vector_version": "0.35.0"
}
```

#### **Kafka Output Configuration:**
```yaml
sinks:
  kafka_output:
    type: "kafka"
    inputs: ["add_metadata"]
    bootstrap_servers: ["kafka:9092"]
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

### **2. How to Create Vector with K8s Sidecar**

#### **Step 1: Create Vector ConfigMap**
```yaml
# k8s/vector-sidecar-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: vector-sidecar-config
  namespace: board-service
data:
  vector.yaml: |
    # Vector configuration here
    sources:
      nginx_logs:
        type: "file"
        include: ["/var/log/app/board-service/nginx/*.log"]
```

#### **Step 2: Update Deployments with Sidecar**
```yaml
# In frontend-deployment.yaml and backend-deployment.yaml
spec:
  template:
    spec:
      containers:
      # Main application container
      - name: board-frontend
        # ... existing config ...
      
      # Vector sidecar container
      - name: vector-sidecar
        image: timberio/vector:0.35.0-alpine
        ports:
        - containerPort: 8686
        env:
        - name: POD_NAME
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: POD_NAMESPACE
          valueFrom:
            fieldRef:
              fieldPath: metadata.namespace
        volumeMounts:
        - name: nginx-logs
          mountPath: /var/log/app/board-service/nginx
        - name: vector-config
          mountPath: /etc/vector
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"
      
      volumes:
      - name: vector-config
        configMap:
          name: vector-sidecar-config
```

#### **Step 3: Apply Configuration**
```bash
# Apply Vector ConfigMap
kubectl apply -f k8s/vector-sidecar-config.yaml

# Apply updated deployments
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml

# Or apply all at once
kubectl apply -f k8s/
```

### **3. How K8s Configuration Relates to Vector Configuration**

#### **The Configuration Flow:**
```
K8s ConfigMap → Volume Mount → Vector Container → Vector Process
     ↓              ↓              ↓              ↓
vector.yaml → /etc/vector/ → Vector reads → Applies config
```

#### **Step-by-Step Configuration Relationship:**

**1. Kubernetes ConfigMap Creation:**
```yaml
# k8s/vector-sidecar-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: vector-sidecar-config
  namespace: board-service
data:
  vector.yaml: |                    # ← This key becomes the filename
    api:
      enabled: true
      address: "0.0.0.0:8686"
    
    sources:
      nginx_logs:
        type: "file"
        include: ["/var/log/app/board-service/nginx/*.log"]
```

**2. Volume Mount in Deployment:**
```yaml
# In deployment.yaml
spec:
  template:
    spec:
      containers:
      - name: vector-sidecar
        # ... other config ...
        volumeMounts:
        - name: vector-config          # ← References volume name
          mountPath: /etc/vector      # ← Where Vector expects config
      
      volumes:
      - name: vector-config           # ← Volume name
        configMap:
          name: vector-sidecar-config
          # No items specified = uses default key "vector.yaml"
```

**3. How Vector Receives the Configuration:**

**Inside the Vector Container:**
```bash
# The ConfigMap data becomes files in /etc/vector/
/etc/vector/
└── vector.yaml    # ← Contains the actual Vector configuration

# Vector automatically reads /etc/vector/vector.yaml on startup
```

**4. Vector Configuration File Structure:**

**What Vector Actually Sees:**
```yaml
# /etc/vector/vector.yaml (inside the container)
api:
  enabled: true
  address: "0.0.0.0:8686"

sources:
  nginx_logs:
    type: "file"
    include: ["/var/log/app/board-service/nginx/*.log"]
    read_from: "beginning"
    ignore_older_secs: 86400

transforms:
  parse_nginx:
    type: "remap"
    inputs: ["nginx_logs"]
    source: |
      parsed = parse_nginx_log!(.message, "combined")
      .timestamp = parsed.timestamp
      .remote_addr = parsed.remote_addr

sinks:
  json_console:
    type: "console"
    inputs: ["add_metadata"]
    encoding:
      codec: "json"
      timestamp_format: "rfc3339"
```

#### **Advanced ConfigMap Configuration Options:**

**1. Multiple Configuration Files:**
```yaml
# ConfigMap with multiple files
apiVersion: v1
kind: ConfigMap
metadata:
  name: vector-sidecar-config
data:
  vector.yaml: |                    # Main configuration
    sources:
      nginx_logs:
        type: "file"
        include: ["/var/log/app/board-service/nginx/*.log"]
  
  sources.conf: |                   # Separate sources file
    nginx_logs:
      type: "file"
      include: ["/var/log/app/board-service/nginx/*.log"]
  
  transforms.conf: |                # Separate transforms file
    parse_nginx:
      type: "remap"
      inputs: ["nginx_logs"]
      source: |
        parsed = parse_nginx_log!(.message, "combined")

# Volume mount with specific items
volumeMounts:
- name: vector-config
  mountPath: /etc/vector
  readOnly: true

volumes:
- name: vector-config
  configMap:
    name: vector-sidecar-config
    items:                          # ← Specify which files to mount
    - key: vector.yaml
      path: vector.yaml
    - key: sources.conf
      path: sources.conf
    - key: transforms.conf
      path: transforms.conf
```

**2. Environment-Specific Configuration:**
```yaml
# ConfigMap with environment variables
data:
  vector.yaml: |
    api:
      enabled: true
      address: "0.0.0.0:8686"
    
    sources:
      nginx_logs:
        type: "file"
        include: ["${LOG_PATH}/nginx/*.log"]  # ← Use env vars
    
    sinks:
      kafka_output:
        type: "kafka"
        bootstrap_servers: ["${KAFKA_SERVERS}"]  # ← Use env vars
        topic: "${KAFKA_TOPIC}"

# Deployment with environment variables
containers:
- name: vector-sidecar
  env:
  - name: LOG_PATH
    value: "/var/log/app/board-service"
  - name: KAFKA_SERVERS
    value: "kafka:9092"
  - name: KAFKA_TOPIC
    value: "board-service-logs"
```

#### **How Vector Reads and Validates Configuration:**

**1. Configuration Loading Process:**
```bash
# Vector startup sequence:
1. Container starts
2. Vector process starts
3. Reads /etc/vector/vector.yaml
4. Validates configuration syntax
5. Loads sources, transforms, and sinks
6. Starts processing if validation passes
```

**2. Configuration Validation:**
```bash
# Vector validates:
- YAML syntax
- VRL (Vector Remap Language) syntax
- Source configurations
- Transform configurations  
- Sink configurations
- Input/output relationships
- File paths and permissions
```

**3. Error Handling:**
```bash
# If configuration is invalid:
- Vector exits with error code
- Pod goes into CrashLoopBackOff
- kubectl logs shows validation errors
- Need to fix ConfigMap and restart pods
```

#### **Verifying Configuration Application:**

**1. Check What Vector Actually Sees:**
```bash
# Verify the configuration file exists
kubectl exec <pod-name> -c vector-sidecar -n board-service -- ls -la /etc/vector/

# View the actual configuration Vector is using
kubectl exec <pod-name> -c vector-sidecar -n board-service -- cat /etc/vector/vector.yaml

# Check if Vector can parse the configuration
kubectl exec <pod-name> -c vector-sidecar -n board-service -- vector validate --config /etc/vector/vector.yaml
```

**2. Debug Configuration Issues:**
```bash
# Check Vector startup logs for configuration errors
kubectl logs <pod-name> -c vector-sidecar -n board-service | grep -i "config\|error"

# Verify file permissions
kubectl exec <pod-name> -c vector-sidecar -n board-service -- ls -la /etc/vector/

# Test Vector configuration validation
kubectl exec <pod-name> -c vector-sidecar -n board-service -- vector --config /etc/vector/vector.yaml --dry-run
```

#### **Configuration Hot-Reloading (Advanced):**

**1. Enable Vector Hot-Reload:**
```yaml
# In vector.yaml
api:
  enabled: true
  address: "0.0.0.0:8686"
  # Enable hot-reloading
  hot_reload: true

# In deployment
volumeMounts:
- name: vector-config
  mountPath: /etc/vector
  readOnly: true  # Required for hot-reload
```

**2. Update Configuration Without Pod Restart:**
```bash
# Update ConfigMap
kubectl apply -f k8s/vector-sidecar-config.yaml

# Vector will automatically reload configuration
# Check Vector logs for reload confirmation
kubectl logs <pod-name> -c vector-sidecar -n board-service --tail=10
```

#### **Configuration Best Practices:**

**1. File Organization:**
```yaml
# Recommended structure:
data:
  vector.yaml: |                    # Main configuration
    api:
      enabled: true
      address: "0.0.0.0:8686"
    
    # Include other files
    include: ["/etc/vector/sources/*.conf", "/etc/vector/transforms/*.conf"]
  
  sources/nginx.conf: |             # Modular sources
    nginx_logs:
      type: "file"
      include: ["/var/log/app/board-service/nginx/*.log"]
  
  transforms/nginx.conf: |          # Modular transforms
    parse_nginx:
      type: "remap"
      inputs: ["nginx_logs"]
      source: |
        parsed = parse_nginx_log!(.message, "combined")
```

**2. Environment-Specific Configs:**
```yaml
# Development vs Production
data:
  vector-dev.yaml: |                # Development config
    sinks:
      json_console:
        type: "console"
        inputs: ["add_metadata"]
  
  vector-prod.yaml: |               # Production config
    sinks:
      kafka_output:
        type: "kafka"
        bootstrap_servers: ["kafka:9092"]
        topic: "board-service-logs"
```

**3. Configuration Validation:**
```bash
# Pre-deployment validation
# Create a temporary pod to test configuration
kubectl run vector-test --image=timberio/vector:0.35.0-alpine --rm -it --restart=Never -- sh

# Copy and test configuration
# Exit when done
exit
```

---

## 🔧 **Configuration Troubleshooting Guide**

### **Common Issues & Solutions:**

#### **1. Pods Not Starting**
```bash
# Check Pod status
kubectl get pods -n board-service

# Check Pod events
kubectl describe pod <pod-name> -n board-service

# Check Pod logs
kubectl logs <pod-name> -n board-service
```

**Common causes:**
- Resource limits too low
- Image pull failures
- Environment variable issues
- Health check failures

#### **2. Services Not Accessible**
```bash
# Check service endpoints
kubectl get endpoints -n board-service

# Check service details
kubectl describe service <service-name> -n board-service
```

**Common causes:**
- Pod labels don't match service selectors
- Pods not ready
- Port mismatches

#### **3. Ingress Not Working**
```bash
# Check ingress status
kubectl get ingress -n board-service

# Check ingress controller
kubectl get pods -n ingress-nginx
```

**Common causes:**
- Ingress controller not running
- Minikube tunnel not started
- Hosts file not updated

### **Debug Commands:**

```bash
# Get detailed resource information
kubectl describe <resource-type> <resource-name> -n board-service

# View resource events
kubectl get events -n board-service --sort-by='.lastTimestamp'

# Check resource YAML
kubectl get <resource-type> <resource-name> -n board-service -o yaml

# Port forward for direct access
kubectl port-forward service/<service-name> <local-port>:<service-port> -n board-service
```

## 🚀 **Production Considerations**

### **For EKS Deployment:**

1. **Image Tags**: Use specific versions instead of `latest`
2. **Resource Limits**: Adjust based on actual usage patterns
3. **Monitoring**: Set up Prometheus, Grafana, and alerting
4. **Autoscaling**: Configure HPA (Horizontal Pod Autoscaler)
5. **SSL/TLS**: Proper certificate management
6. **Network Policies**: Restrict pod-to-pod communication
7. **Backup**: Persistent data backup strategies

### **Security Best Practices:**

1. **RBAC**: Role-based access control
2. **Pod Security Standards**: Follow security policies
3. **Image Scanning**: Vulnerability scanning
4. **Secret Rotation**: Regular credential updates
5. **Network Policies**: Restrict traffic flow
6. **Audit Logging**: Monitor cluster activities

## 📚 **Learning Resources**

### **Kubernetes Concepts:**
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kubernetes Concepts](https://kubernetes.io/docs/concepts/)
- [Kubernetes Tutorials](https://kubernetes.io/docs/tutorials/)

### **Minikube:**
- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)
- [Minikube Start Guide](https://minikube.sigs.k8s.io/docs/start/)

### **Kubectl:**
- [Kubectl Reference](https://kubernetes.io/docs/reference/kubectl/)
- [Kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

## 🎯 **Next Steps**

### **Immediate:**
1. ✅ Deploy to Minikube (Completed)
2. ✅ Test all services (Completed)
3. ✅ Verify connectivity (Completed)

### **Short Term:**
1. **Customize Configuration**: Modify resource limits, replica counts
2. **Add Monitoring**: Set up basic monitoring and logging
3. **Test Scaling**: Test horizontal scaling capabilities

### **Long Term:**
1. **EKS Migration**: Adapt manifests for AWS EKS
2. **CI/CD Pipeline**: Automate deployment process
3. **Production Hardening**: Security, monitoring, backup strategies

## 🏆 **What You've Learned**

By completing this deployment, you now understand:

1. **Kubernetes Architecture**: How Pods, Services, and Ingress work together
2. **Resource Management**: How to define and manage compute resources
3. **Configuration Management**: How to use ConfigMaps and Secrets
4. **Networking**: How services communicate and how to expose them externally
5. **Deployment Strategies**: How to deploy and manage application updates
6. **Health Monitoring**: How to implement health checks and monitoring
7. **Local Development**: How to use Minikube for local Kubernetes development

This foundation will serve you well as you move to production environments like EKS!

---

## 🔒 **Persistent Volume Claims (PVC) Configuration & Theory**

### **🚀 What We Accomplished**

In this session, we successfully implemented **persistent storage for application logs** in your Kubernetes deployment, ensuring that:
- ✅ **Frontend Nginx logs** persist across pod restarts
- ✅ **Backend Node.js logs** persist across pod restarts  
- ✅ **Volume mounts** work seamlessly with existing deployments
- ✅ **Storage provisioning** is automated and scalable
- ✅ **Logging functionality** is production-ready

---

## 📚 **Theory of Persistent Volume Claims (PVC)**

### **1. What is a PVC?**

**Persistent Volume Claim (PVC)** is a request for storage by a user. It's like a "storage reservation" that:
- **Requests storage** from the cluster
- **Specifies requirements** (size, access mode, storage class)
- **Gets bound** to a Persistent Volume (PV)
- **Provides persistent storage** to pods

### **2. PVC vs Local Storage**

#### **❌ Local Storage (Docker Compose):**
```yaml
# docker-compose.yml
volumes:
  - /var/log/app/board-service/nginx:/var/log/app/board-service/nginx
  - /var/log/app/board-service/nodejs:/var/log/app/board-service/nodejs
```
- **Direct host mounting** to local filesystem
- **Accessible from host** machine
- **Lost on host restart** or filesystem changes
- **Not portable** across different environments

#### **✅ PVC Storage (Kubernetes):**
```yaml
# k8s/persistent-volume-claims.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nginx-logs-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: standard
```
- **Cluster-managed storage** independent of host
- **Persistent across** pod restarts and deployments
- **Portable** across different K8s environments
- **Scalable** and enterprise-grade

### **3. Storage Architecture in Minikube**

```bash
Your Mac (Host) → Docker Desktop → Minikube Container → PVC Storage
```

**Storage Location:**
- **NOT on your local disk** (`/var/log/app/board-service/`)
- **INSIDE minikube container** (`/var/lib/minikube/volumes/`)
- **Managed by K8s** storage provisioner
- **Isolated from host** filesystem

---

## 🛠️ **How to Configure PVCs**

### **1. Create PVC Definitions**

```yaml
# k8s/persistent-volume-claims.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nginx-logs-pvc
  namespace: board-service
  labels:
    app: board-frontend
    component: logs
spec:
  accessModes:
    - ReadWriteOnce  # Single node read/write
  resources:
    requests:
      storage: 1Gi   # Request 1GB of storage
  storageClassName: standard  # Use available storage class
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: backend-logs-pvc
  namespace: board-service
  labels:
    app: board-backend
    component: logs
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: standard
```

### **2. Update Deployments with Volume Mounts**

#### **Frontend Deployment:**
```yaml
# k8s/frontend-deployment.yaml
spec:
  template:
    spec:
      containers:
      - name: board-frontend
        # ... existing config ...
        volumeMounts:
        - name: nginx-logs
          mountPath: /var/log/app/board-service/nginx
      volumes:
      - name: nginx-logs
        persistentVolumeClaim:
          claimName: nginx-logs-pvc
```

#### **Backend Deployment:**
```yaml
# k8s/backend-deployment.yaml
spec:
  template:
    spec:
      containers:
      - name: board-backend
        # ... existing config ...
        volumeMounts:
        - name: backend-logs
          mountPath: /var/log/app/board-service/nodejs
      volumes:
      - name: backend-logs
        persistentVolumeClaim:
          claimName: backend-logs-pvc
```

### **3. Update Kustomization**

```yaml
# k8s/kustomization.yaml
resources:
- namespace.yaml
- configmap.yaml
- secret.yaml
- persistent-volume-claims.yaml  # ← Add this line
- backend-deployment.yaml
- backend-service.yaml
- frontend-deployment.yaml
- frontend-service.yaml
- ingress.yaml
```

---

## 🔗 **How PVCs Work with Existing Configuration**

### **1. Integration with Deployments**

#### **Before PVC (Ephemeral Storage):**
```yaml
# Pods wrote logs to container filesystem
# Logs lost on pod restart
# No persistent storage
```

#### **After PVC (Persistent Storage):**
```yaml
# Pods write logs to mounted PVC
# Logs survive pod restarts
# Storage persists across deployments
```

### **2. Service Discovery Unchanged**

```yaml
# k8s/backend-service.yaml - NO CHANGES NEEDED
apiVersion: v1
kind: Service
metadata:
  name: board-backend-service  # Service name unchanged
spec:
  selector:
    app: board-backend         # Selector unchanged
  ports:
  - port: 8080                # Port unchanged
```

### **3. Ingress Configuration Unchanged**

```yaml
# k8s/ingress.yaml - NO CHANGES NEEDED
spec:
  rules:
  - host: board-service.local
    http:
      paths:
      - path: /api
        backend:
          service:
            name: board-backend-service  # Routes unchanged
            port: 8080
```

### **4. Resource Management Enhanced**

```yaml
# Deployments now include:
spec:
  template:
    spec:
      containers:
      - name: board-frontend
        resources:
          requests:
            memory: "64Mi"     # CPU/Memory unchanged
            cpu: "50m"
        volumeMounts:          # ← NEW: Volume mounts
        - name: nginx-logs
          mountPath: /var/log/app/board-service/nginx
```

---

## 📊 **How Logging Works with PVCs**

### **1. Log Flow Architecture**

```bash
Application → Container Filesystem → Volume Mount → PVC → Persistent Storage
```

#### **Frontend Logging:**
```nginx
# nginx.conf
location /api/ {
    access_log /var/log/app/board-service/nginx/access.log main;
    # ↑ This path is now mounted to PVC
}
```

#### **Backend Logging:**
```javascript
// logger.js
const logDir = '/var/log/app/board-service/nodejs';
// ↑ This path is now mounted to PVC
```

### **2. Log Persistence Benefits**

#### **✅ Across Pod Restarts:**
```bash
# Pod restarts, logs remain
kubectl delete pod <pod-name> -n board-service
kubectl get pods -n board-service  # New pod starts
kubectl exec -it <new-pod> -- ls -la /var/log/app/board-service/nginx/
# ↑ Logs still exist!
```

#### **✅ Across Deployments:**
```bash
# Update deployment, logs persist
kubectl set image deployment/board-frontend board-frontend=new-image:tag
kubectl get pods -n board-service  # New pods start
# ↑ All previous logs remain accessible
```

#### **✅ Across Scaling Events:**
```bash
# Scale up/down, logs shared
kubectl scale deployment board-frontend --replicas=3
# ↑ All pods share same PVC, logs accessible from any pod
```

### **3. Log Access Methods**

#### **From Inside Pods:**
```bash
# Frontend logs
kubectl exec -it <frontend-pod> -- tail -f /var/log/app/board-service/nginx/access.log

# Backend logs
kubectl exec -it <backend-pod> -- tail -f /var/log/app/board-service/nodejs/access.log
```

#### **Copy Logs to Local (If needed):**
```bash
# Copy nginx logs
kubectl cp board-service/<frontend-pod>:/var/log/app/board-service/nginx/access.log ./nginx-access.log

# Copy backend logs
kubectl cp board-service/<backend-pod>:/var/log/app/board-service/nodejs/access.log ./backend-access.log
```

---

## 🧪 **Testing PVC Configuration**

### **1. Deploy and Verify**

```bash
# Apply configuration
kubectl apply -f k8s/

# Check PVC status
kubectl get pvc -n board-service

# Check pod status
kubectl get pods -n board-service

# Verify volume mounts
kubectl describe pod <pod-name> -n board-service | grep -A 10 "Volumes:"
```

### **2. Test Logging Functionality**

```bash
# Port forward to test
kubectl port-forward service/board-frontend-service 8080:80 -n board-service &

# Test frontend
curl -I http://localhost:8080

# Test API
curl -I http://localhost:8080/api/posts

# Check logs
kubectl exec -it <frontend-pod> -- tail -5 /var/log/app/board-service/nginx/access.log
```

### **3. Verify Persistence**

```bash
# Delete a pod
kubectl delete pod <pod-name> -n board-service

# Wait for new pod
kubectl get pods -n board-service

# Verify logs still exist
kubectl exec -it <new-pod> -- ls -la /var/log/app/board-service/nginx/
```

---

## 🎯 **Production Benefits**

### **1. Enterprise-Grade Logging**
- **Log retention** across deployments
- **Audit trails** for compliance
- **Security monitoring** capabilities
- **Performance analysis** over time

### **2. Scalability & Reliability**
- **Multiple replicas** share same storage
- **Load balancing** with persistent data
- **Rolling updates** preserve logs
- **Disaster recovery** capabilities

### **3. Operational Excellence**
- **Centralized logging** management
- **Easy troubleshooting** across pods
- **Consistent monitoring** setup
- **Standardized logging** practices

---

## 🚨 **Common Issues & Solutions**

### **1. PVC Pending Status**

#### **Problem:**
```bash
NAME               STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS
nginx-logs-pvc     Pending                                                     <unset>
```

#### **Solution:**
```bash
# Check available storage classes
kubectl get storageclass

# Update PVC to use available storage class
storageClassName: standard  # Instead of ""
```

### **2. Pods Stuck in Pending**

#### **Problem:**
```bash
NAME                              READY   STATUS    RESTARTS   AGE
board-frontend-xxx-xxx            0/1     Pending   0          1m
```

#### **Solution:**
```bash
# Check PVC binding
kubectl get pvc -n board-service

# Ensure PVCs are Bound before pods start
kubectl describe pod <pod-name> -n board-service
```

### **3. Volume Mount Errors**

#### **Problem:**
```bash
# Pod fails to start with volume mount errors
```

#### **Solution:**
```bash
# Verify PVC exists and is bound
kubectl get pvc -n board-service

# Check PVC details
kubectl describe pvc <pvc-name> -n board-service

# Verify storage class availability
kubectl get storageclass
```

---

## 🎉 **Summary of Accomplishments**

### **✅ What We Successfully Implemented:**

1. **Persistent Volume Claims**: Created PVCs for both frontend and backend logs
2. **Volume Mounts**: Integrated PVCs with existing deployments
3. **Storage Configuration**: Configured proper storage classes for minikube
4. **Logging Persistence**: Ensured logs survive pod restarts and deployments
5. **Production Readiness**: Achieved enterprise-grade logging capabilities

### **✅ Technical Achievements:**

- **PVC Creation**: `nginx-logs-pvc` and `backend-logs-pvc`
- **Volume Integration**: Seamless integration with existing K8s manifests
- **Storage Provisioning**: Automated storage allocation via storage classes
- **Log Persistence**: Complete log retention across all pod lifecycle events
- **Scalability**: Support for multiple replicas with shared storage

### **✅ Operational Benefits:**

- **Consistent Logging**: Same logging behavior across all environments
- **Easy Troubleshooting**: Persistent logs for debugging and monitoring
- **Security Compliance**: Complete audit trails for security monitoring
- **Performance Analysis**: Historical log data for optimization
- **Production Standards**: Enterprise-grade logging infrastructure

**Your Kubernetes deployment now has production-ready persistent logging that matches or exceeds your Docker Compose setup!** 🚀

**The PVC configuration ensures that your application logs are properly persisted, accessible, and scalable across all deployment scenarios.** 🛡️

---

## 🔍 **Vector Sidecar Logging with Kubernetes**

### **1. What is Vector and Configuration**

#### **Vector Overview:**
Vector is a high-performance, end-to-end observability data pipeline that enables you to collect, transform, and route logs, metrics, and traces to any destination. It's designed for reliability, performance, and operational simplicity.

#### **Key Features:**
- **High Performance**: Written in Rust for maximum speed and efficiency
- **Reliable**: Built-in retry logic, backpressure handling, and fault tolerance
- **Flexible**: Supports 100+ sources, transforms, and sinks
- **Kubernetes Native**: First-class support for K8s metadata and deployment patterns
- **Resource Efficient**: Low memory and CPU footprint

#### **Vector Configuration Structure:**
```yaml
# Sources: Where data comes from
sources:
  nginx_logs:
    type: "file"
    include: ["/var/log/app/board-service/nginx/*.log"]
  
  backend_logs:
    type: "file"
    include: ["/var/log/app/board-service/nodejs/*.log"]

# Transforms: How data is processed
transforms:
  parse_nginx:
    type: "remap"
    inputs: ["nginx_logs"]
    source: |
      # VRL (Vector Remap Language) for log parsing
      parsed = parse_nginx_log!(.message, "combined")
      .timestamp = parsed.timestamp
      .remote_addr = parsed.remote_addr

# Sinks: Where data goes
sinks:
  json_console:
    type: "console"
    inputs: ["add_metadata"]
    encoding:
      codec: "json"
      timestamp_format: "rfc3339"
```

#### **JSON Output Example:**
```json
{
  "timestamp": "2025-08-25T05:54:29Z",
  "cluster": "minikube",
  "component": "backend",
  "environment": "development",
  "level": "info",
  "message": "GET /health",
  "method": "GET",
  "url": "/health",
  "ip": "10.244.0.1",
  "kubernetes": {
    "container_name": "vector-sidecar",
    "namespace": "board-service",
    "pod_name": "board-backend-dd78b9fdb-mx8mt"
  },
  "vector_version": "0.35.0"
}
```

#### **Kafka Output Configuration:**
```yaml
sinks:
  kafka_output:
    type: "kafka"
    inputs: ["add_metadata"]
    bootstrap_servers: ["kafka:9092"]
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

### **2. How to Create Vector with K8s Sidecar**

#### **Step 1: Create Vector ConfigMap**
```yaml
# k8s/vector-sidecar-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: vector-sidecar-config
  namespace: board-service
data:
  vector.yaml: |
    # Vector configuration here
    sources:
      nginx_logs:
        type: "file"
        include: ["/var/log/app/board-service/nginx/*.log"]
```

#### **Step 2: Update Deployments with Sidecar**
```yaml
# In frontend-deployment.yaml and backend-deployment.yaml
spec:
  template:
    spec:
      containers:
      # Main application container
      - name: board-frontend
        # ... existing config ...
      
      # Vector sidecar container
      - name: vector-sidecar
        image: timberio/vector:0.35.0-alpine
        ports:
        - containerPort: 8686
        env:
        - name: POD_NAME
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: POD_NAMESPACE
          valueFrom:
            fieldRef:
              fieldPath: metadata.namespace
        volumeMounts:
        - name: nginx-logs
          mountPath: /var/log/app/board-service/nginx
        - name: vector-config
          mountPath: /etc/vector
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"
      
      volumes:
      - name: vector-config
        configMap:
          name: vector-sidecar-config
```

#### **Step 3: Apply Configuration**
```bash
# Apply Vector ConfigMap
kubectl apply -f k8s/vector-sidecar-config.yaml

# Apply updated deployments
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml

# Or apply all at once
kubectl apply -f k8s/
```

### **3. How K8s Configuration Relates to Vector Configuration**

#### **The Configuration Flow:**
```
K8s ConfigMap → Volume Mount → Vector Container → Vector Process
     ↓              ↓              ↓              ↓
vector.yaml → /etc/vector/ → Vector reads → Applies config
```

#### **Step-by-Step Configuration Relationship:**

**1. Kubernetes ConfigMap Creation:**
```yaml
# k8s/vector-sidecar-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: vector-sidecar-config
  namespace: board-service
data:
  vector.yaml: |                    # ← This key becomes the filename
    api:
      enabled: true
      address: "0.0.0.0:8686"
    
    sources:
      nginx_logs:
        type: "file"
        include: ["/var/log/app/board-service/nginx/*.log"]
```

**2. Volume Mount in Deployment:**
```yaml
# In deployment.yaml
spec:
  template:
    spec:
      containers:
      - name: vector-sidecar
        # ... other config ...
        volumeMounts:
        - name: vector-config          # ← References volume name
          mountPath: /etc/vector      # ← Where Vector expects config
      
      volumes:
      - name: vector-config           # ← Volume name
        configMap:
          name: vector-sidecar-config
          # No items specified = uses default key "vector.yaml"
```

**3. How Vector Receives the Configuration:**

**Inside the Vector Container:**
```bash
# The ConfigMap data becomes files in /etc/vector/
/etc/vector/
└── vector.yaml    # ← Contains the actual Vector configuration

# Vector automatically reads /etc/vector/vector.yaml on startup
```

**4. Vector Configuration File Structure:**

**What Vector Actually Sees:**
```yaml
# /etc/vector/vector.yaml (inside the container)
api:
  enabled: true
  address: "0.0.0.0:8686"

sources:
  nginx_logs:
    type: "file"
    include: ["/var/log/app/board-service/nginx/*.log"]
    read_from: "beginning"
    ignore_older_secs: 86400

transforms:
  parse_nginx:
    type: "remap"
    inputs: ["nginx_logs"]
    source: |
      parsed = parse_nginx_log!(.message, "combined")
      .timestamp = parsed.timestamp
      .remote_addr = parsed.remote_addr

sinks:
  json_console:
    type: "console"
    inputs: ["add_metadata"]
    encoding:
      codec: "json"
      timestamp_format: "rfc3339"
```

#### **Advanced ConfigMap Configuration Options:**

**1. Multiple Configuration Files:**
```yaml
# ConfigMap with multiple files
apiVersion: v1
kind: ConfigMap
metadata:
  name: vector-sidecar-config
data:
  vector.yaml: |                    # Main configuration
    sources:
      nginx_logs:
        type: "file"
        include: ["/var/log/app/board-service/nginx/*.log"]
  
  sources.conf: |                   # Separate sources file
    nginx_logs:
      type: "file"
      include: ["/var/log/app/board-service/nginx/*.log"]
  
  transforms.conf: |                # Separate transforms file
    parse_nginx:
      type: "remap"
      inputs: ["nginx_logs"]
      source: |
        parsed = parse_nginx_log!(.message, "combined")

# Volume mount with specific items
volumeMounts:
- name: vector-config
  mountPath: /etc/vector
  readOnly: true

volumes:
- name: vector-config
  configMap:
    name: vector-sidecar-config
    items:                          # ← Specify which files to mount
    - key: vector.yaml
      path: vector.yaml
    - key: sources.conf
      path: sources.conf
    - key: transforms.conf
      path: transforms.conf
```

**2. Environment-Specific Configuration:**
```yaml
# ConfigMap with environment variables
data:
  vector.yaml: |
    api:
      enabled: true
      address: "0.0.0.0:8686"
    
    sources:
      nginx_logs:
        type: "file"
        include: ["${LOG_PATH}/nginx/*.log"]  # ← Use env vars
    
    sinks:
      kafka_output:
        type: "kafka"
        bootstrap_servers: ["${KAFKA_SERVERS}"]  # ← Use env vars
        topic: "${KAFKA_TOPIC}"

# Deployment with environment variables
containers:
- name: vector-sidecar
  env:
  - name: LOG_PATH
    value: "/var/log/app/board-service"
  - name: KAFKA_SERVERS
    value: "kafka:9092"
  - name: KAFKA_TOPIC
    value: "board-service-logs"
```

#### **How Vector Reads and Validates Configuration:**

**1. Configuration Loading Process:**
```bash
# Vector startup sequence:
1. Container starts
2. Vector process starts
3. Reads /etc/vector/vector.yaml
4. Validates configuration syntax
5. Loads sources, transforms, and sinks
6. Starts processing if validation passes
```

**2. Configuration Validation:**
```bash
# Vector validates:
- YAML syntax
- VRL (Vector Remap Language) syntax
- Source configurations
- Transform configurations  
- Sink configurations
- Input/output relationships
- File paths and permissions
```

**3. Error Handling:**
```bash
# If configuration is invalid:
- Vector exits with error code
- Pod goes into CrashLoopBackOff
- kubectl logs shows validation errors
- Need to fix ConfigMap and restart pods
```

#### **Verifying Configuration Application:**

**1. Check What Vector Actually Sees:**
```bash
# Verify the configuration file exists
kubectl exec <pod-name> -c vector-sidecar -n board-service -- ls -la /etc/vector/

# View the actual configuration Vector is using
kubectl exec <pod-name> -c vector-sidecar -n board-service -- cat /etc/vector/vector.yaml

# Check if Vector can parse the configuration
kubectl exec <pod-name> -c vector-sidecar -n board-service -- vector validate --config /etc/vector/vector.yaml
```

**2. Debug Configuration Issues:**
```bash
# Check Vector startup logs for configuration errors
kubectl logs <pod-name> -c vector-sidecar -n board-service | grep -i "config\|error"

# Verify file permissions
kubectl exec <pod-name> -c vector-sidecar -n board-service -- ls -la /etc/vector/

# Test Vector configuration validation
kubectl exec <pod-name> -c vector-sidecar -n board-service -- vector --config /etc/vector/vector.yaml --dry-run
```

#### **Configuration Hot-Reloading (Advanced):**

**1. Enable Vector Hot-Reload:**
```yaml
# In vector.yaml
api:
  enabled: true
  address: "0.0.0.0:8686"
  # Enable hot-reloading
  hot_reload: true

# In deployment
volumeMounts:
- name: vector-config
  mountPath: /etc/vector
  readOnly: true  # Required for hot-reload
```

**2. Update Configuration Without Pod Restart:**
```bash
# Update ConfigMap
kubectl apply -f k8s/vector-sidecar-config.yaml

# Vector will automatically reload configuration
# Check Vector logs for reload confirmation
kubectl logs <pod-name> -c vector-sidecar -n board-service --tail=10
```

#### **Configuration Best Practices:**

**1. File Organization:**
```yaml
# Recommended structure:
data:
  vector.yaml: |                    # Main configuration
    api:
      enabled: true
      address: "0.0.0.0:8686"
    
    # Include other files
    include: ["/etc/vector/sources/*.conf", "/etc/vector/transforms/*.conf"]
  
  sources/nginx.conf: |             # Modular sources
    nginx_logs:
      type: "file"
      include: ["/var/log/app/board-service/nginx/*.log"]
  
  transforms/nginx.conf: |          # Modular transforms
    parse_nginx:
      type: "remap"
      inputs: ["nginx_logs"]
      source: |
        parsed = parse_nginx_log!(.message, "combined")
```

**2. Environment-Specific Configs:**
```yaml
# Development vs Production
data:
  vector-dev.yaml: |                # Development config
    sinks:
      json_console:
        type: "console"
        inputs: ["add_metadata"]
  
  vector-prod.yaml: |               # Production config
    sinks:
      kafka_output:
        type: "kafka"
        bootstrap_servers: ["kafka:9092"]
        topic: "board-service-logs"
```

**3. Configuration Validation:**
```bash
# Pre-deployment validation
# Create a temporary pod to test configuration
kubectl run vector-test --image=timberio/vector:0.35.0-alpine --rm -it --restart=Never -- sh

# Copy and test configuration
# Exit when done
exit
```

---

## 🔧 **Configuration Troubleshooting Guide**

### **Common Issues & Solutions:**

#### **1. Pods Not Starting**
```bash
# Check Pod status
kubectl get pods -n board-service

# Check Pod events
kubectl describe pod <pod-name> -n board-service

# Check Pod logs
kubectl logs <pod-name> -n board-service
```

**Common causes:**
- Resource limits too low
- Image pull failures
- Environment variable issues
- Health check failures

#### **2. Services Not Accessible**
```bash
# Check service endpoints
kubectl get endpoints -n board-service

# Check service details
kubectl describe service <service-name> -n board-service
```

**Common causes:**
- Pod labels don't match service selectors
- Pods not ready
- Port mismatches

#### **3. Ingress Not Working**
```bash
# Check ingress status
kubectl get ingress -n board-service

# Check ingress controller
kubectl get pods -n ingress-nginx
```

**Common causes:**
- Ingress controller not running
- Minikube tunnel not started
- Hosts file not updated

### **Debug Commands:**

```bash
# Get detailed resource information
kubectl describe <resource-type> <resource-name> -n board-service

# View resource events
kubectl get events -n board-service --sort-by='.lastTimestamp'

# Check resource YAML
kubectl get <resource-type> <resource-name> -n board-service -o yaml

# Port forward for direct access
kubectl port-forward service/<service-name> <local-port>:<service-port> -n board-service
```
