import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Container } from '@mui/material';
import Header from '../components/Header/Header';
import PostList from '../components/Board/PostList/PostList';
import PostDetail from '../components/Board/PostDetail/PostDetail';
import PostForm from '../components/Board/PostForm/PostForm';
import { Post, CreatePostRequest, CreateCommentRequest } from '../types/api';
import api from '../api/axios';
import commentService from '../services/commentService';

export const BoardRoutes: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const fetchPosts = async () => {
    try {
      const response = await api.get<Post[]>('/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    navigate(`/board/${post._id}`);
  };

  const handleCreatePost = async (postData: CreatePostRequest) => {
    try {
      const response = await api.post<Post>('/posts', postData);
      setPosts(prevPosts => [response.data, ...prevPosts]);
      navigate('/board');
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  };

  const handleEditPost = async (postData: CreatePostRequest) => {
    if (!selectedPost) return;
    try {
      const response = await api.put<Post>(`/posts/${selectedPost._id}`, postData);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === selectedPost._id ? response.data : post
        )
      );
      setSelectedPost(response.data);
      navigate(`/board/${selectedPost._id}`);
    } catch (error) {
      console.error('Failed to edit post:', error);
      throw error;
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      navigate('/board');
    } catch (error) {
      console.error('Failed to delete post:', error);
      throw error;
    }
  };

  const handleAddComment = async (postId: string, comment: CreateCommentRequest) => {
    try {
      const response = await api.post<Post>(`/posts/${postId}/comments`, comment);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? response.data : post
        )
      );
      if (selectedPost?._id === postId) {
        setSelectedPost(response.data);
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      const response = await api.delete<Post>(`/posts/${postId}/comments/${commentId}`);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? response.data : post
        )
      );
      if (selectedPost?._id === postId) {
        setSelectedPost(response.data);
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      throw error;
    }
  };

  const handleEditComment = async (postId: string, commentId: string, content: string) => {
    try {
      const response = await api.put<Post>(`/posts/${postId}/comments/${commentId}`, { content });
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? response.data : post
        )
      );
      if (selectedPost?._id === postId) {
        setSelectedPost(response.data);
      }
    } catch (error) {
      console.error('Failed to edit comment:', error);
      throw error;
    }
  };

  const handleAddReply = async (postId: string, commentId: string, content: string) => {
    try {
      const response = await commentService.addReply(postId, commentId, { content });
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? response.data : post
        )
      );
      if (selectedPost?._id === postId) {
        setSelectedPost(response.data);
      }
    } catch (error) {
      console.error('Failed to add reply:', error);
      throw error;
    }
  };

  const handleEditReply = async (postId: string, commentId: string, replyId: string, content: string) => {
    try {
      const response = await commentService.updateReply(postId, commentId, replyId, { content });
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? response.data : post
        )
      );
      if (selectedPost?._id === postId) {
        setSelectedPost(response.data);
      }
    } catch (error) {
      console.error('Failed to edit reply:', error);
      throw error;
    }
  };

  const handleDeleteReply = async (postId: string, commentId: string, replyId: string) => {
    try {
      const response = await commentService.deleteReply(postId, commentId, replyId);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? response.data : post
        )
      );
      if (selectedPost?._id === postId) {
        setSelectedPost(response.data);
      }
    } catch (error) {
      console.error('Failed to delete reply:', error);
      throw error;
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await api.post<Post>(`/posts/${postId}/like`);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? response.data : post
        )
      );
      if (selectedPost?._id === postId) {
        setSelectedPost(response.data);
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
      />
      <Container maxWidth="md" sx={{ flex: 1, py: 3 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/board" replace />} />
          <Route path="/board" element={
            <PostList 
              posts={posts}
              onPostClick={handlePostClick}
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
          <Route path="*" element={<Navigate to="/board" replace />} />
        </Routes>
      </Container>
    </Box>
  );
}; 