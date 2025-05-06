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
└── backend/           # Node.js backend server
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
PORT=5000
MONGODB_URI=mongodb://localhost:27017/board-service
JWT_SECRET=your_jwt_secret_key
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
REACT_APP_API_URL=http://localhost:5000
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

The backend server will start running on http://localhost:5000

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

- User authentication (Sign up, Login, Logout)
- Create, read, update, and delete posts
- Comment system with nested replies
- Like posts
- Search functionality
- Responsive design for mobile and desktop
- Pagination

## API Endpoints

### Authentication
- POST /api/auth/signup - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user info

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
- React
- TypeScript
- Material-UI
- React Router
- Axios

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 