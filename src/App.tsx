import React, { useState } from 'react';
import Header from './components/Header/Header';
import PostList from './components/PostList/PostList';
import PostDetail from './components/PostDetail/PostDetail';
import PostForm from './components/PostForm/PostForm';
import Login from './components/Login/Login';
import { Post } from './types/Post';
import './App.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: 'First Post',
      content: 'This is the content of the first post.',
      author: 'John Doe',
      createdAt: '2024-03-20',
    },
    {
      id: 2,
      title: 'Second Post',
      content: 'This is the content of the second post.',
      author: 'Jane Smith',
      createdAt: '2024-03-21',
    },
  ]);

  const handleLogin = (username: string, password: string) => {
    console.log('Login attempt with:', username, password);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedPost(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handlePostClick = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setIsEditing(false);
      setIsCreating(false);
    }
  };

  const handleBackToList = () => {
    setSelectedPost(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleCreatePost = () => {
    setIsCreating(true);
    setSelectedPost(null);
    setIsEditing(false);
  };

  const handleEditPost = () => {
    setIsEditing(true);
  };

  const handleDeletePost = () => {
    if (selectedPost) {
      setPosts(posts.filter(p => p.id !== selectedPost.id));
      setSelectedPost(null);
    }
  };

  const handleSubmitPost = (postData: Omit<Post, 'id'>) => {
    if (isEditing && selectedPost) {
      setPosts(posts.map(p => 
        p.id === selectedPost.id 
          ? { ...p, ...postData }
          : p
      ));
      setSelectedPost(null);
      setIsEditing(false);
    } else {
      const newPost: Post = {
        ...postData,
        id: Math.max(...posts.map(p => p.id), 0) + 1,
      };
      setPosts([...posts, newPost]);
      setIsCreating(false);
    }
  };

  return (
    <div className="app">
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main className="main-content">
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} />
        ) : isCreating ? (
          <PostForm
            onSubmit={handleSubmitPost}
            onCancel={handleBackToList}
          />
        ) : isEditing && selectedPost ? (
          <PostForm
            initialData={selectedPost}
            onSubmit={handleSubmitPost}
            onCancel={handleBackToList}
          />
        ) : selectedPost ? (
          <PostDetail
            post={selectedPost}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
            onBack={handleBackToList}
          />
        ) : (
          <div className="post-list-container">
            <div className="post-list-header">
              <button onClick={handleCreatePost} className="create-button">
                New Post
              </button>
            </div>
            <PostList posts={posts} onPostClick={handlePostClick} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
