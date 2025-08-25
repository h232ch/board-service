# Board Service

A full-stack board application with React frontend and Node.js backend.

## Features

- User authentication (JWT)
- Board posts with comments and replies
- Like functionality
- Responsive design with Material-UI
- Docker containerization
- Cloud MongoDB integration

## Project Structure

```
├── frontend/          # React application
├── backend/           # Node.js Express API
├── docker-compose.yml # Docker services orchestration with pre-built images
├── frontend/Dockerfile # Frontend container configuration (for local builds)
└── backend/Dockerfile  # Backend container configuration (for local builds)
```

## Docker Hub Images

This project uses pre-built Docker images from Docker Hub for easy deployment:

- **Backend**: `dnwn7166/board-backend:latest`
- **Frontend**: `dnwn7166/board-frontend:latest`

These images are automatically pulled when running `docker compose up` and include all necessary dependencies and optimizations.

**⚠️ Security Note**: The `docker-compose.yml` file now uses environment variables from `backend/.env` instead of hardcoded credentials. Make sure to create a `.env` file in the `backend/` directory with your actual MongoDB URI and JWT secret before running the containers.

## Environment Setup

### Backend Directory (.env file)

Create a `.env` file in the `backend/` directory:

```bash
# MongoDB Connection (Cloud MongoDB)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=ClusterName

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Node Environment
NODE_ENV=production
```

### Frontend

No environment variables required for basic setup.

### .env File Structure

Your `.env` file should contain:

```bash
MONGODB_URI=your_actual_mongodb_connection_string
JWT_SECRET=your_actual_jwt_secret_key
NODE_ENV=production
```

**Important**: Never commit your `.env` file to version control. It should already be in your `.gitignore` file.

## Docker Setup

### 1. Run with Docker Compose (Recommended)

**Prerequisite**: Create a `.env` file in the `backend/` directory with your MongoDB URI and JWT secret.

```bash
# Start all services using pre-built images
docker compose up

# Run in background
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f
```

### 2. Individual service run (using pre-built images)

```bash
# Backend
docker run -p 8080:8080 \
  -e NODE_ENV=production \
  -e MONGODB_URI=your_mongodb_uri \
  -e JWT_SECRET=your_jwt_secret \
  dnwn7166/board-backend:latest

# Frontend
docker run -p 80:80 dnwn7166/board-frontend:latest
```

### 3. Docker Compose Services

The `docker-compose.yml` file orchestrates the following services:

- **backend**: Node.js Express API server (port 8080) using pre-built image `dnwn7166/board-backend:latest`
- **frontend**: React application served by Nginx (port 80) using pre-built image `dnwn7166/board-frontend:latest`
- **networks**: Custom bridge network for service communication

### 4. Docker Images

- **Backend**: Pre-built image `dnwn7166/board-backend:latest` (Node.js 18 Alpine with Express server)
- **Frontend**: Pre-built image `dnwn7166/board-frontend:latest` (Multi-stage build with Nginx serve)
- **Network**: Custom bridge network `app-network` for secure service communication

## Development Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Users
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (auth required)

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get specific post
- `POST /api/posts` - Create post (auth required)
- `PUT /api/posts/:id` - Update post (auth required)
- `DELETE /api/posts/:id` - Delete post (auth required)

### Comments
- `POST /api/posts/:id/comments` - Add comment (auth required)
- `PUT /api/posts/:id/comments/:commentId` - Edit comment (auth required)
- `DELETE /api/posts/:id/comments/:commentId` - Delete comment (auth required)

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- Rate limiting (when configured)
- Non-root Docker containers

## Production Deployment

### 1. Environment Variables
- Set `NODE_ENV=production`
- Use strong JWT secret
- Configure production MongoDB URI
- Set proper CORS origins

### 2. Docker Production
```bash
# Production deployment (using pre-built images)
docker compose up -d

# Or use individual containers
docker run -d -p 8080:8080 \
  -e NODE_ENV=production \
  -e MONGODB_URI=your_production_mongodb_uri \
  -e JWT_SECRET=your_production_jwt_secret \
  dnwn7166/board-backend:latest

docker run -d -p 80:80 dnwn7166/board-frontend:latest
```

### 3. Nginx Configuration
- Reverse proxy for API requests
- Static file serving for frontend
- SSL/TLS configuration
- Security headers

## Health Checks

- Backend: `/health` endpoint
- Frontend: `/health` endpoint
- Docker health checks configured
- MongoDB connection monitoring

## Monitoring

- Request logging
- Error logging
- Health check monitoring
- Performance metrics (when configured)
- Docker container status monitoring

## Troubleshooting

### Common Docker Issues

1. **Port conflicts**: Ensure ports 80 and 8080 are available
2. **Permission issues**: Use `sudo` for port 80 on some systems
3. **Image pull failures**: Check internet connection and Docker Hub access
4. **Container not starting**: Check logs with `docker compose logs`
5. **Network issues**: Verify `app-network` bridge network creation

### Docker Commands

```bash
# Check running containers
docker compose ps

# View service logs
docker compose logs backend
docker compose logs frontend

# Restart services
docker compose restart

# Clean up
docker compose down --volumes --remove-orphans
```

## Performance Optimization

- Pre-built Docker images for faster deployment
- Multi-stage Docker builds (included in images)
- Nginx static file serving
- Gzip compression enabled
- Static asset caching
- Docker layer caching
- Custom bridge network for optimized service communication

## Security Best Practices

- Non-root containers
- Minimal base images (Alpine)
- Environment variable protection
- CORS configuration
- Input validation
- JWT token management
- **Never hardcode credentials in docker-compose.yml**
- **Use .env files for sensitive configuration**
- **Ensure .env files are in .gitignore** 

---

## 🚢 Docker Compose 실행 가이드

이 섹션에서는 Docker Compose를 사용하여 Board Service를 실행하는 방법을 설명합니다.

---

## 📋 사전 준비

### **1. 환경 변수 파일 생성**
```bash
# backend/.env 파일 생성
cat > backend/.env << 'EOF'
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=ClusterName
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
NODE_ENV=production
EOF
```

### **2. 로그 디렉토리 생성**
```bash
# 프론트엔드 Nginx 로그 디렉토리 생성
sudo mkdir -p /var/log/app/board-service/nginx
sudo chmod 777 /var/log/app/board-service/nginx

# 백엔드 Node.js 로그 디렉토리 생성
sudo mkdir -p /var/log/app/board-service/nodejs
sudo chmod 777 /var/log/app/board-service/nodejs
```

---

## 🚀 Docker Compose 실행

### **1. 전체 서비스 시작**
```bash
# 백그라운드에서 실행
docker compose up -d

# 또는 포그라운드에서 실행 (로그 확인용)
docker compose up
```

### **2. 서비스 상태 확인**
```bash
# 실행 중인 서비스 확인
docker compose ps

# 서비스 상태 상세 확인
docker compose ps --format "table {{.Name}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
```

### **3. 로그 확인**
```bash
# 모든 서비스 로그
docker compose logs

# 특정 서비스 로그
docker compose logs frontend
docker compose logs backend

# 실시간 로그 모니터링
docker compose logs -f
docker compose logs -f frontend
docker compose logs -f backend

# 호스트 로그 파일 모니터링
# 프론트엔드 Nginx 로그
tail -f /var/log/app/board-service/nginx/access.log
tail -f /var/log/app/board-service/nginx/error.log

# 백엔드 Node.js 로그
tail -f /var/log/app/board-service/nodejs/access.log
tail -f /var/log/app/board-service/nodejs/error.log
tail -f /var/log/app/board-service/nodejs/combined.log
```

---

## 🔧 서비스 관리

### **서비스 시작/중지**
```bash
# 특정 서비스만 시작
docker compose up -d frontend
docker compose up -d backend

# 특정 서비스만 중지
docker compose stop frontend
docker compose stop backend

# 모든 서비스 중지
docker compose stop
```

### **서비스 재시작**
```bash
# 특정 서비스 재시작
docker compose restart frontend
docker compose restart backend

# 모든 서비스 재시작
docker compose restart
```

### **서비스 재빌드**
```bash
# 이미지 재빌드 후 시작
docker compose up -d --build

# 특정 서비스만 재빌드
docker compose up -d --build frontend
docker compose up -d --build backend
```

---

## 📊 모니터링 및 디버깅

### **컨테이너 상태 확인**
```bash
# 컨테이너 상세 정보
docker compose exec frontend nginx -t
docker compose exec backend node healthcheck.js

# 컨테이너 내부 접속
docker compose exec frontend sh
docker compose exec backend sh
```

### **리소스 사용량 확인**
```bash
# 컨테이너 리소스 사용량
docker stats

# 특정 컨테이너만 확인
docker stats board-service-frontend-1 board-service-backend-1
```

---

## 🧹 정리 및 관리

### **서비스 정리**
```bash
# 서비스 중지 및 컨테이너 제거
docker compose down

# 볼륨과 네트워크도 함께 제거
docker compose down --volumes --remove-orphans

# 이미지까지 제거
docker compose down --rmi all
```

### **로그 및 데이터 정리**
```bash
# Docker 시스템 정리
docker system prune -f

# 사용하지 않는 이미지 정리
docker image prune -f

# 사용하지 않는 볼륨 정리
docker volume prune -f
```

---

## 🌍 환경별 실행

### **개발 환경**
```bash
# 개발용 환경 변수로 실행
NODE_ENV=development docker compose up -d
```

### **프로덕션 환경**
```bash
# 프로덕션용 환경 변수로 실행
NODE_ENV=production docker compose up -d
```

### **스테이징 환경**
```bash
# 스테이징용 포트로 실행
docker compose -f docker-compose.yml -f docker-compose.staging.yml up -d
```

---

## 🐛 문제 해결

### **일반적인 문제들**

#### **1. 포트 충돌**
```bash
# 포트 사용 확인
lsof -i :80
lsof -i :8080

# 다른 포트 사용
docker compose -p board-service-staging up -d
```

#### **2. 권한 문제**
```bash
# 로그 디렉토리 권한 확인
ls -la /var/log/app/board-service/nginx/

# 권한 수정
sudo chmod 777 /var/log/app/board-service/nginx
```

#### **3. 네트워크 문제**
```bash
# 네트워크 확인
docker network ls
docker network inspect board-service_app-network

# 네트워크 재생성
docker compose down
docker compose up -d
```

---

## 📚 유용한 명령어 모음

```bash
# 서비스 시작
docker compose up -d

# 서비스 중지
docker compose down

# 로그 확인
docker compose logs -f

# 상태 확인
docker compose ps

# 재시작
docker compose restart

# 재빌드
docker compose up -d --build

# 정리
docker compose down --volumes --remove-orphans
```

---

## 🎯 결론

Docker Compose를 사용하면:

- ✅ **간단한 명령어**로 전체 서비스 관리
- ✅ **자동 네트워크 구성**으로 서비스 간 통신
- ✅ **환경 변수 관리**로 설정 분리
- ✅ **로그 통합**으로 모니터링 용이
- ✅ **확장성**으로 새로운 서비스 추가 용이

`docker compose up -d` 한 번의 명령으로 전체 Board Service를 실행할 수 있습니다! 