import React, { useState, useEffect } from 'react';
import { Post, CreatePostRequest, CreateCommentRequest } from '../types/api';
import { useLocation } from 'react-router-dom';
import { postService } from '../api/services';

interface BoardContainerProps {
  children: (props: {
    posts: Post[];
    selectedPost: Post | null;
    setSelectedPost: (post: Post | null) => void;
    handleCreatePost: (postData: CreatePostRequest) => Promise<void>;
    handleEditPost: (postData: CreatePostRequest) => Promise<void>;
    handleDeletePost: (postId: string) => Promise<void>;
    handleAddComment: (postId: string, comment: CreateCommentRequest) => Promise<void>;
    handleDeleteComment: (postId: string, commentId: string) => Promise<void>;
    handleEditComment: (postId: string, commentId: string, content: string) => Promise<void>;
    handleAddReply: (postId: string, commentId: string, content: string) => Promise<void>;
    handleEditReply: (postId: string, commentId: string, replyId: string, content: string) => Promise<void>;
    handleDeleteReply: (postId: string, commentId: string, replyId: string) => Promise<void>;
    refresh: () => Promise<void>;
  }) => React.ReactNode;
}

export const BoardContainer: React.FC<BoardContainerProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const location = useLocation();

  // board 페이지 접속 시 데이터 새로 가져오기
  useEffect(() => {
    if (location.pathname === '/board') {
      loadPosts();
    }
  }, [location.pathname]);

  const loadPosts = async () => {
    try {
      const data = await postService.getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  const handleCreatePost = async (postData: CreatePostRequest) => {
    try {
      const data = await postService.createPost(postData);
      setPosts(prevPosts => [data, ...prevPosts]);
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
    } catch (error) {
      console.error('Failed to update post:', error);
      throw error;
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await postService.deletePost(postId);
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      setSelectedPost(null);
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

  return (
    <>
      {children({
        posts,
        selectedPost,
        setSelectedPost,
        handleCreatePost,
        handleEditPost,
        handleDeletePost,
        handleAddComment,
        handleDeleteComment,
        handleEditComment,
        handleAddReply,
        handleEditReply,
        handleDeleteReply,
        refresh: loadPosts
      })}
    </>
  );
}; 