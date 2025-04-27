import React, { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import PostList from './components/PostList/PostList';
import PostDetail from './components/PostDetail/PostDetail';
import PostForm from './components/PostForm/PostForm';
import Login from './components/Login/Login';
import { Post } from './types/Post';
import { Comment } from './types/Comment';
import './App.css';

const App: React.FC = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
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
  const [comments, setComments] = useState<{ [postId: number]: Comment[] }>({});
  // useEffect를 사용하여 업데이트된 값을 출력
  // useEffect(() => {
  //   console.log("posts가 변경되었습니다!", posts);
  // }, [posts]);

  const handleLogin = (username: string, password: string) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
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

  const handleEditPost = (updatedPost: Post) => {
    setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
    if (selectedPost?.id === updatedPost.id) {
      setSelectedPost(updatedPost);
      setIsEditing(true)
    }
  };

  const handleDeletePost = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
    if (selectedPost?.id === postId) {
      setSelectedPost(null);
    }
  };

  const handleSubmitPost = (postData: Omit<Post, 'id'>) => {
    if (isEditing && selectedPost) {
      const updatedPost = { ...selectedPost, ...postData };
    
      setPosts(posts.map(p => 
        p.id === selectedPost.id 
          ? updatedPost
          : p
      ));
      // useState는 비동기로 동작하기 때문에 아래 코드에는 업데이트된 값이 반영되지 않음
      console.log(posts)
    
      setSelectedPost(updatedPost);   // ✅ 여기 수정!
      setIsEditing(false);

    } else {
      const newPost: Post = {
        ...postData,
        id: Math.max(...posts.map(p => p.id), 0) + 1,
      };
      setPosts([...posts, newPost]);
      setSelectedPost(newPost);
      setIsCreating(false);
    }
  };

  const handleAddComment = (postId: number, comment: Comment) => {
    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), comment]
    }));
  };

  const handleDeleteComment = (postId: number, commentId: number) => {
    setComments(prev => ({
      ...prev,
      [postId]: prev[postId].filter(comment => comment.id !== commentId)
    }));
  };

  const handleEditComment = (postId: number, commentId: number, newContent: string) => {
    setComments(prev => ({
      ...prev,
      [postId]: prev[postId].map(comment =>
        comment.id === commentId
          ? { ...comment, content: newContent }
          : comment
      )
    }));
  };

  const handleAddReply = (postId: number, parentId: number, content: string) => {
    const newReply: Comment = {
      id: Date.now(),
      author: username,
      content: content,
      createdAt: new Date().toISOString(),
      parentId: parentId
    };

    setComments(prev => ({
      ...prev,
      [postId]: prev[postId].map(comment =>
        comment.id === parentId
          ? { ...comment, replies: [...(comment.replies || []), newReply] }
          : comment
      )
    }));
  };

  const handleEditReply = (postId: number, parentId: number, replyId: number, newContent: string) => {
    setComments(prev => ({
      ...prev,
      [postId]: prev[postId].map(comment =>
        comment.id === parentId
          ? {
              ...comment,
              replies: (comment.replies || []).map(reply =>
                reply.id === replyId
                  ? { ...reply, content: newContent }
                  : reply
              )
            }
          : comment
      )
    }));
  };

  const handleDeleteReply = (postId: number, parentId: number, replyId: number) => {
    setComments(prev => ({
      ...prev,
      [postId]: prev[postId].map(comment =>
        comment.id === parentId
          ? {
              ...comment,
              replies: (comment.replies || []).filter(reply => reply.id !== replyId)
            }
          : comment
      )
    }));
  };

  const handleOnClick = () => {

  };

  return (
    <div className="app">
      <Header 
        isLoggedIn={isLoggedIn} 
        username={username}
        onLogout={handleLogout} 
      />
      <main className="main-content">
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} />
        ) : isCreating ? (
          <PostForm
            onSubmit={handleSubmitPost}
            username={username}
            onCancel={handleBackToList}
          />
        ) : isEditing && selectedPost ? (
          <PostForm
            initialData={selectedPost}
            username={username}
            onSubmit={handleSubmitPost}
            onCancel={handleBackToList}
          />
        ) : selectedPost ? (
          <PostDetail
            post={selectedPost}
            username={username}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
            onBack={handleBackToList}
            comments={comments[selectedPost.id] || []}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            onEditComment={handleEditComment}
            onAddReply={handleAddReply}
            onEditReply={handleEditReply}
            onDeleteReply={handleDeleteReply}
          />
        ) : (
          <div className="post-list-container">
            <div className="post-list-header">
              <button onClick={handleCreatePost} className="create-button">
                New
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
