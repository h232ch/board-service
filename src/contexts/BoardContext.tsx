import React, { createContext, useContext, useState } from 'react';
import { Post } from '../types/Post';
import { Comment } from '../types/Comment';

interface BoardContextType {
  posts: Post[];
  selectedPost: Post | null;
  comments: { [key: number]: Comment[] };
  setPosts: (posts: Post[]) => void;
  setSelectedPost: (post: Post | null) => void;
  handleCreatePost: (post: Omit<Post, 'id'>) => void;
  handleEditPost: (post: Post) => void;
  handleDeletePost: (postId: number) => void;
  handleAddComment: (postId: number, comment: Comment) => void;
  handleDeleteComment: (postId: number, commentId: number) => void;
  handleEditComment: (postId: number, commentId: number, newContent: string) => void;
  handleAddReply: (postId: number, parentId: number, content: string) => void;
  handleEditReply: (postId: number, parentId: number, replyId: number, newContent: string) => void;
  handleDeleteReply: (postId: number, parentId: number, replyId: number) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: 'First Post',
      content: 'This is the content of the first post.',
      author: 'user1',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Second Post',
      content: 'This is the content of the second post.',
      author: 'user2',
      createdAt: new Date().toISOString(),
    }
  ]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});

  const handleCreatePost = (post: Omit<Post, 'id'>) => {
    const newPost: Post = {
      ...post,
      id: Date.now(),
    };
    setPosts([...posts, newPost]);
    setSelectedPost(newPost);
  };

  const handleEditPost = (post: Post) => {
    setPosts(posts.map(p => p.id === post.id ? post : p));
    setSelectedPost(post);
  };

  const handleDeletePost = (postId: number) => {
    setPosts(prevPosts => {
      const newPosts = prevPosts.filter(post => post.id !== postId);
      if (selectedPost?.id === postId) {
        setSelectedPost(null);
      }
      return newPosts;
    });
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
      [postId]: (prev[postId] || []).filter(comment => comment.id !== commentId)
    }));
  };

  const handleEditComment = (postId: number, commentId: number, newContent: string) => {
    setComments(prev => ({
      ...prev,
      [postId]: (prev[postId] || []).map(comment => 
        comment.id === commentId ? { ...comment, content: newContent } : comment
      )
    }));
  };

  const handleAddReply = (postId: number, parentId: number, content: string) => {
    const newReply: Comment = {
      id: Date.now(),
      author: 'Current User', // 실제로는 현재 로그인한 사용자 정보를 사용
      content,
      createdAt: new Date().toISOString(),
      parentId
    };

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newReply]
    }));
  };

  const handleEditReply = (postId: number, parentId: number, replyId: number, newContent: string) => {
    setComments(prev => ({
      ...prev,
      [postId]: (prev[postId] || []).map(comment => 
        comment.id === replyId ? { ...comment, content: newContent } : comment
      )
    }));
  };

  const handleDeleteReply = (postId: number, parentId: number, replyId: number) => {
    setComments(prev => ({
      ...prev,
      [postId]: (prev[postId] || []).filter(comment => comment.id !== replyId)
    }));
  };

  return (
    <BoardContext.Provider value={{
      posts,
      selectedPost,
      comments,
      setPosts,
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
    }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
}; 