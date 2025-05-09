import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Container } from '@mui/material';
import Header from '../components/Header/Header';
import PostList from '../components/Board/PostList/PostList';
import PostDetail from '../components/Board/PostDetail/PostDetail';
import PostForm from '../components/Board/PostForm/PostForm';
import { Post, CreatePostRequest, CreateCommentRequest } from '../types/api';
import { postService } from '../api/services';

export const BoardRoutes: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const data = await postService.getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  }, []);

  const updateSelectedPost = useCallback((posts: Post[]) => {
    if (selectedPost) {
      const updatedPost = posts.find(post => post._id === selectedPost._id);
      if (updatedPost) {
        setSelectedPost(updatedPost);
      }
    }
  }, [selectedPost]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    updateSelectedPost(posts);
  }, [posts, updateSelectedPost]);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    navigate(`/board/${post._id}`);
  };

  const handleCreatePost = async (postData: CreatePostRequest) => {
    try {
      const data = await postService.createPost(postData);
      setPosts(prevPosts => [data, ...prevPosts]);
      navigate('/board');
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  };

  const handleEditPost = async (postData: CreatePostRequest) => {
    if (!selectedPost) return;
    try {
      const data = await postService.updatePost(selectedPost._id, postData);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === selectedPost._id ? data : post
        )
      );
      setSelectedPost(data);
      navigate(`/board/${selectedPost._id}`);
    } catch (error) {
      console.error('Failed to edit post:', error);
      throw error;
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await postService.deletePost(postId);
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      navigate('/board');
    } catch (error) {
      console.error('Failed to delete post:', error);
      throw error;
    }
  };

  const handleAddComment = async (postId: string, comment: CreateCommentRequest) => {
    try {
      const data = await postService.addComment(postId, comment);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? data : post
        )
      );
      if (selectedPost?._id === postId) {
        setSelectedPost(data);
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      const data = await postService.deleteComment(postId, commentId);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? data : post
        )
      );
      if (selectedPost?._id === postId) {
        setSelectedPost(data);
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      throw error;
    }
  };

  const handleEditComment = async (postId: string, commentId: string, content: string) => {
    try {
      const data = await postService.updateComment(postId, commentId, { content });
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? data : post
        )
      );
      if (selectedPost?._id === postId) {
        setSelectedPost(data);
      }
    } catch (error) {
      console.error('Failed to edit comment:', error);
      throw error;
    }
  };

  const handleAddReply = async (postId: string, commentId: string, content: string) => {
    try {
      const data = await postService.addReply(postId, commentId, { content });
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? data : post
        )
      );
      if (selectedPost?._id === postId) {
        setSelectedPost(data);
      }
    } catch (error) {
      console.error('Failed to add reply:', error);
      throw error;
    }
  };

  const handleEditReply = async (postId: string, commentId: string, replyId: string, content: string) => {
    try {
      const data = await postService.updateReply(postId, commentId, replyId, { content });
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? data : post
        )
      );
      if (selectedPost?._id === postId) {
        setSelectedPost(data);
      }
    } catch (error) {
      console.error('Failed to edit reply:', error);
      throw error;
    }
  };

  const handleDeleteReply = async (postId: string, commentId: string, replyId: string) => {
    try {
      const data = await postService.deleteReply(postId, commentId, replyId);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? data : post
        )
      );
      if (selectedPost?._id === postId) {
        setSelectedPost(data);
      }
    } catch (error) {
      console.error('Failed to delete reply:', error);
      throw error;
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const data = await postService.toggleLike(postId);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? data : post
        )
      );
      if (selectedPost?._id === postId) {
        setSelectedPost(data);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header 
        isLoggedIn={true}
        username={user.username}
        onLogout={logout}
        userInfo={user}
        refresh={fetchPosts}
      />
      <Container maxWidth="md" sx={{ flex: 1, py: 3 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/board" replace />} />
          <Route path="/board" element={
            <PostList 
              posts={posts}
              onPostClick={handlePostClick}
              refresh={fetchPosts}
            />
          } />
          <Route path="/board/:postId" element={
            selectedPost ? (
              <PostDetail 
                post={selectedPost}
                currentUser={user}
                onEdit={() => navigate(`/board/${selectedPost._id}/edit`)}
                onDelete={() => handleDeletePost(selectedPost._id)}
                onBack={() => navigate('/board')}
                onAddComment={(comment: CreateCommentRequest) => handleAddComment(selectedPost._id, comment)}
                onDeleteComment={(commentId: string) => handleDeleteComment(selectedPost._id, commentId)}
                onEditComment={(commentId: string, content: string) => handleEditComment(selectedPost._id, commentId, content)}
                onAddReply={(postId: string, commentId: string, content: string) => handleAddReply(postId, commentId, content)}
                onDeleteReply={(postId: string, commentId: string, replyId: string) => handleDeleteReply(postId, commentId, replyId)}
                onEditReply={(postId: string, commentId: string, replyId: string, content: string) => handleEditReply(postId, commentId, replyId, content)}
                onLike={handleLike}
                refresh={fetchPosts}
              />
            ) : (
              <Navigate to="/board" />
            )
          } />
          <Route path="/board/new" element={
            <PostForm 
              onSubmit={handleCreatePost}
              onCancel={() => navigate('/board')}
            />
          } />
          <Route path="/board/:postId/edit" element={
            selectedPost ? (
              <PostForm 
                initialData={selectedPost}
                onSubmit={handleEditPost}
                onCancel={() => navigate(`/board/${selectedPost._id}`)}
              />
            ) : (
              <Navigate to="/board" />
            )
          } />
        </Routes>
      </Container>
    </Box>
  );
}; 