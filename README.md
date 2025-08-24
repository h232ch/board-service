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