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

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/board" replace />} />
      <Route path="/board" element={
        <PostList 
          posts={posts} 
          onPostClick={handlePostClick} 
          onCreatePost={() => navigate('/board/new')}
        />
      } />
      <Route path="/board/new" element={
        <PostForm 
          username={username}
          onSubmit={(postData) => {
            handleCreatePost(postData);
            navigate('/board');
          }}
          onCancel={() => navigate('/board')}
        />
      } />
      <Route path="/board/:postId/edit" element={
        selectedPost ? <PostForm 
          initialData={selectedPost}
          username={username}
          onSubmit={(postData) => {
            handleEditPost({ ...postData, id: selectedPost.id });
            navigate(`/board/${selectedPost.id}`);
          }}
          onCancel={() => navigate(`/board/${selectedPost.id}`)}
        /> : <Navigate to="/board" />
      } />
      <Route path="/board/:postId" element={
        selectedPost ? <PostDetail 
          post={selectedPost} 
          username={username} 
          onEdit={() => navigate(`/board/${selectedPost.id}/edit`)}
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
      <Route path="*" element={<Navigate to="/board" replace />} />
    </Routes>
  );
}; 