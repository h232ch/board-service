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
├── docker-compose.yml # Docker services orchestration
├── frontend/Dockerfile # Frontend container configuration
└── backend/Dockerfile  # Backend container configuration
```

## Environment Setup

### Backend (.env file)

Create a `.env` file in the `backend/` directory:

```bash
# MongoDB Connection (Cloud MongoDB)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=ClusterName

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Server Configuration
PORT=8080
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### Frontend

No environment variables required for basic setup.

## Docker Setup

### 1. Build and run with Docker Compose (Recommended)

```bash
# Build and start all services
docker compose up --build

# Run in background
docker compose up -d --build

# Stop all services
docker compose down

# View logs
docker compose logs -f
```

### 2. Individual service build and run

```bash
# Backend
cd backend
docker build -t board-backend .
docker run -p 8080:8080 --env-file .env board-backend

# Frontend
cd frontend
docker build -t board-frontend .
docker run -p 80:80 board-frontend
```

### 3. Docker Compose Services

The `docker-compose.yml` file orchestrates the following services:

- **backend**: Node.js Express API server (port 8080)
- **frontend**: React application served by Nginx (port 80)

### 4. Docker Images

- **Backend**: Node.js 18 Alpine with Express server
- **Frontend**: Multi-stage build (Node.js build → Nginx serve)

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
# Production build
docker compose -f docker-compose.prod.yml up --build

# Or use individual containers
docker build -t board-backend-prod ./backend
docker build -t board-frontend-prod ./frontend
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
3. **Build failures**: Check Dockerfile syntax and dependencies
4. **Container not starting**: Check logs with `docker compose logs`

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

- Multi-stage Docker builds
- Nginx static file serving
- Gzip compression enabled
- Static asset caching
- Docker layer caching

## Security Best Practices

- Non-root containers
- Minimal base images (Alpine)
- Environment variable protection
- CORS configuration
- Input validation
- JWT token management 