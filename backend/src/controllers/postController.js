const Post = require('../models/Post');

// Create new post
const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const post = new Post({
      title,
      content,
      tags,
      author: req.user._id
    });
    await post.save();
    const populatedPost = await Post.findById(post._id)
      .populate({
        path: 'author',
        select: 'username'
      })
      .populate({
        path: 'comments.author',
        select: 'username'
      })
      .populate({
        path: 'comments.replies.author',
        select: 'username'
      });
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

// Get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({
        path: 'author',
        select: 'username'
      })
      .populate({
        path: 'comments.author',
        select: 'username'
      })
      .populate({
        path: 'comments.replies.author',
        select: 'username'
      })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

// Get single post
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({
        path: 'author',
        select: 'username'
      })
      .populate({
        path: 'comments.author',
        select: 'username'
      })
      .populate({
        path: 'comments.replies.author',
        select: 'username'
      });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags || post.tags;

    await post.save();
    const updatedPost = await Post.findById(post._id)
      .populate({
        path: 'author',
        select: 'username'
      })
      .populate({
        path: 'comments.author',
        select: 'username'
      })
      .populate({
        path: 'comments.replies.author',
        select: 'username'
      });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

// Add comment
const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      content,
      author: req.user._id
    });

    await post.save();
    const updatedPost = await Post.findById(post._id)
      .populate({
        path: 'comments.author',
        select: 'username'
      })
      .populate({
        path: 'comments.replies.author',
        select: 'username'
      });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

// Edit comment
const editComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the comment author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.content = content;
    await post.save();
    
    const updatedPost = await Post.findById(post._id)
      .populate({
        path: 'comments.author',
        select: 'username'
      })
      .populate({
        path: 'comments.replies.author',
        select: 'username'
      });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error editing comment', error: error.message });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the comment author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.deleteOne();
    await post.save();
    
    const updatedPost = await Post.findById(post._id)
      .populate({
        path: 'comments.author',
        select: 'username'
      })
      .populate({
        path: 'comments.replies.author',
        select: 'username'
      });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};

// Like a post
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user._id;
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex === -1) {
      // Add like
      post.likes.push(userId);
    } else {
      // Remove like
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    
    const updatedPost = await Post.findById(req.params.id)
      .populate({
        path: 'author',
        select: 'username'
      })
      .populate({
        path: 'comments.author',
        select: 'username'
      })
      .populate({
        path: 'comments.replies.author',
        select: 'username'
      });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add reply to comment
const addReply = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.replies.push({
      content,
      author: req.user._id
    });

    await post.save();
    const updatedPost = await Post.findById(post._id)
      .populate({
        path: 'comments.author',
        select: 'username'
      })
      .populate({
        path: 'comments.replies.author',
        select: 'username'
      });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error adding reply', error: error.message });
  }
};

// Edit reply
const editReply = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const reply = comment.replies.id(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    // Check if user is the reply author
    if (reply.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    reply.content = content;
    await post.save();
    
    const updatedPost = await Post.findById(post._id)
      .populate({
        path: 'comments.author',
        select: 'username'
      })
      .populate({
        path: 'comments.replies.author',
        select: 'username'
      });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error editing reply', error: error.message });
  }
};

// Delete reply
const deleteReply = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const reply = comment.replies.id(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    // Check if user is the reply author
    if (reply.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    reply.deleteOne();
    await post.save();
    
    const updatedPost = await Post.findById(post._id)
      .populate({
        path: 'comments.author',
        select: 'username'
      })
      .populate({
        path: 'comments.replies.author',
        select: 'username'
      });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reply', error: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  addComment,
  editComment,
  deleteComment,
  likePost,
  addReply,
  editReply,
  deleteReply
}; 