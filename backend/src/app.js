const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const logger = require('./config/logger');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.219.120:3000',
  'http://localhost:80',
  'http://localhost',
  'http://frontend-container'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Custom request logging middleware
app.use((req, res, next) => {
  // Skip logging for health check requests
  if (req.url === '/health') {
    return next();
  }
  
  logger.info(`${req.method} ${req.url}`, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info('MongoDB Connected'))
  .catch(err => logger.error('MongoDB Connection Error:', { error: err.message, stack: err.stack }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes (will be added later)
app.get('/', (req, res) => {
  logger.info('Root endpoint accessed');
  res.json({ message: 'Welcome to Board Service API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', { 
    error: err.message, 
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip
  });
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  logger.info(`Server is running on http://${HOST}:${PORT}`);
  logger.info(`CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:80'}`);
}); 