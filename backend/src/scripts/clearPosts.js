require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('../models/Post');

async function clearPosts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await Post.deleteMany({});
    console.log(`Deleted ${result.deletedCount} posts`);

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

clearPosts(); 