# Board Service

A full-stack bulletin board application built with React, TypeScript, and Node.js.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4.4 or higher)

## Project Structure

```
board-service/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts (Auth, etc.)
│   │   ├── routes/        # Route components
│   │   ├── api/          # API service functions
│   │   └── types/        # TypeScript type definitions
└── backend/           # Node.js backend server
    ├── src/
    │   ├── controllers/  # Route controllers
    │   ├── models/      # Mongoose models
    │   ├── routes/      # API routes
    │   └── middleware/  # Custom middleware
```

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/board-service
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory with the following variables:
```env
REACT_APP_API_URL=http://localhost:8080/api
```

## Running the Application

### Start Backend Server

1. Navigate to the backend directory:
```bash
cd backend
```

2. Start the development server:
```bash
npm run dev
```

The backend server will start running on http://localhost:8080

### Start Frontend Development Server

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Start the development server:
```bash
npm start
```

The frontend application will start running on http://localhost:3000

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Automatic redirection based on auth status
  - Authenticated users are redirected to /board when accessing /login or /register
  - Unauthenticated users are redirected to /login when accessing protected routes

### Board Features
- Create, read, update, and delete posts
- Comment system with nested replies
- Like posts
- Search functionality
- Responsive design for mobile and desktop
- Pagination

### Security
- Protected API endpoints
- JWT token validation
- Password hashing with bcrypt
- CORS configuration

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get current user info

### Posts
- GET /api/posts - Get all posts
- POST /api/posts - Create a new post
- GET /api/posts/:id - Get a specific post
- PUT /api/posts/:id - Update a post
- DELETE /api/posts/:id - Delete a post
- POST /api/posts/:id/like - Like a post

### Comments
- POST /api/posts/:postId/comments - Add a comment
- PUT /api/posts/:postId/comments/:commentId - Update a comment
- DELETE /api/posts/:postId/comments/:commentId - Delete a comment
- POST /api/posts/:postId/comments/:commentId/replies - Add a reply
- PUT /api/posts/:postId/comments/:commentId/replies/:replyId - Update a reply
- DELETE /api/posts/:postId/comments/:commentId/replies/:replyId - Delete a reply

## Technologies Used

### Frontend
- React 18
- TypeScript
- Material-UI (MUI)
- React Router v6
- Axios
- React Context API for state management

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing
- CORS middleware

## Project Status

### Completed Features
- ✅ User authentication system
- ✅ Protected routes and API endpoints
- ✅ Post CRUD operations
- ✅ Comment system with replies
- ✅ Like functionality
- ✅ Responsive design
- ✅ Search functionality
- ✅ Pagination

### In Progress
- 🔄 Performance optimization
- 🔄 Error handling improvements
- 🔄 UI/UX enhancements

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 