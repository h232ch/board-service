import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { PostList } from '../components/Board';
import { PostDetail } from '../components/Board';
import { PostForm } from '../components/Board';
import { useAuth } from '../contexts/AuthContext';
import { useBoard } from '../contexts/BoardContext';

export const BoardRoutes: React.FC = () => {
  const { isLoggedIn, username } = useAuth();
  const { 
    posts, 
    selectedPost, 
    comments, 
    setSelectedPost,
    handleCreatePost,
    handleEditPost,
    handleDeletePost,
    handleAddComment,
    handleDeleteComment,
    handleEditComment,
    handleAddReply,
    handleEditReply,
    handleDeleteReply
  } = useBoard();
  const navigate = useNavigate();

  const handlePostClick = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
      navigate(`/board/${postId}`);
    }
  };

  return (
    <Routes>
      <Route path="/" element={
        !isLoggedIn ? <Navigate to="/login" /> : <Navigate to="/board" />
      } />
      <Route path="/board" element={
        !isLoggedIn ? <Navigate to="/login" /> :
        <PostList 
          posts={posts} 
          onPostClick={handlePostClick} 
          onCreatePost={() => navigate('/board/new')}
        />
      } />
      <Route path="/board/new" element={
        !isLoggedIn ? <Navigate to="/login" /> :
        <PostForm 
          username={username}
          onSubmit={(postData) => {
            handleCreatePost(postData);
            navigate('/board');
          }}
          onCancel={() => navigate('/board')}
        />
      } />
      <Route path="/board/:postId" element={
        !isLoggedIn ? <Navigate to="/login" /> :
        selectedPost ? <PostDetail 
          post={selectedPost} 
          username={username} 
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
          onBack={() => navigate('/board')} 
          comments={comments[selectedPost.id] || []}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          onEditComment={handleEditComment}
          onAddReply={handleAddReply}
          onEditReply={handleEditReply}
          onDeleteReply={handleDeleteReply}
        /> : <Navigate to="/board" />
      } />
    </Routes>
  );
}; 