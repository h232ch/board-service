const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  addComment,
  editComment,
  deleteComment,
  toggleLike,
  addReply,
  editReply,
  deleteReply,
  likePost
} = require('../controllers/postController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', getPosts);
router.get('/:id', getPost);

// Protected routes
router.post('/', auth, createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.post('/:id/comments', auth, addComment);
router.put('/:id/comments/:commentId', auth, editComment);
router.delete('/:id/comments/:commentId', auth, deleteComment);
router.post('/:id/like', auth, likePost);

// Reply routes
router.post('/:id/comments/:commentId/replies', auth, addReply);
router.put('/:id/comments/:commentId/replies/:replyId', auth, editReply);
router.delete('/:id/comments/:commentId/replies/:replyId', auth, deleteReply);

module.exports = router; 