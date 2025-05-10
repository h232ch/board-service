require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('../models/Post');

// MongoDB connection URL
const MONGODB_URI = 'mongodb://localhost:27017/board-service';

async function clearPosts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete all posts
    const result = await Post.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} posts`);

    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
clearPosts(); 