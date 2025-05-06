import React, { useState, useEffect } from 'react';
import { Post, CreatePostRequest, CreateCommentRequest } from '../types/api';
import { postService, commentService } from '../services';
import { useLocation } from 'react-router-dom';

interface BoardContainerProps {
  children: (props: {
    posts: Post[];
    selectedPost: Post | null;
    setSelectedPost: (post: Post | null) => void;
    handleCreatePost: (postData: CreatePostRequest) => Promise<void>;
    handleEditPost: (postData: Post) => Promise<void>;
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
      const response = await postService.getPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  const handleCreatePost = async (postData: CreatePostRequest) => {
    try {
      const response = await postService.createPost(postData);
      setPosts([...posts, response.data]);
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  };

  const handleEditPost = async (postData: Post) => {
    try {
      const response = await postService.updatePost(postData._id, postData);
      setPosts(posts.map(post => post._id === postData._id ? response.data : post));
      setSelectedPost(response.data);
    } catch (error) {
      console.error('Failed to update post:', error);
      throw error;
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await postService.deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));
      setSelectedPost(null);
    } catch (error) {
      console.error('Failed to delete post:', error);
      throw error;
    }
  };

  const handleAddComment = async (postId: string, comment: CreateCommentRequest) => {
    try {
      await commentService.createComment(postId, comment);
      const updatedPost = await postService.getPost(postId);
      setPosts(posts.map(post => post._id === postId ? updatedPost.data : post));
      if (selectedPost?._id === postId) {
        setSelectedPost(updatedPost.data);
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      await commentService.deleteComment(postId, commentId);
      const updatedPost = await postService.getPost(postId);
      setPosts(posts.map(post => post._id === postId ? updatedPost.data : post));
      if (selectedPost?._id === postId) {
        setSelectedPost(updatedPost.data);
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      throw error;
    }
  };

  const handleEditComment = async (postId: string, commentId: string, content: string) => {
    try {
      await commentService.updateComment(postId, commentId, { content });
      const updatedPost = await postService.getPost(postId);
      setPosts(posts.map(post => post._id === postId ? updatedPost.data : post));
      if (selectedPost?._id === postId) {
        setSelectedPost(updatedPost.data);
      }
    } catch (error) {
      console.error('Failed to edit comment:', error);
      throw error;
    }
  };

  const handleAddReply = async (postId: string, commentId: string, content: string) => {
    try {
      await commentService.addReply(postId, commentId, { content });
      const updatedPost = await postService.getPost(postId);
      setPosts(posts.map(post => post._id === postId ? updatedPost.data : post));
      if (selectedPost?._id === postId) {
        setSelectedPost(updatedPost.data);
      }
    } catch (error) {
      console.error('Failed to add reply:', error);
      throw error;
    }
  };

  const handleEditReply = async (postId: string, commentId: string, replyId: string, content: string) => {
    try {
      await commentService.updateReply(postId, commentId, replyId, { content });
      const updatedPost = await postService.getPost(postId);
      setPosts(posts.map(post => post._id === postId ? updatedPost.data : post));
      if (selectedPost?._id === postId) {
        setSelectedPost(updatedPost.data);
      }
    } catch (error) {
      console.error('Failed to edit reply:', error);
      throw error;
    }
  };

  const handleDeleteReply = async (postId: string, commentId: string, replyId: string) => {
    try {
      await commentService.deleteReply(postId, commentId, replyId);
      const updatedPost = await postService.getPost(postId);
      setPosts(posts.map(post => post._id === postId ? updatedPost.data : post));
      if (selectedPost?._id === postId) {
        setSelectedPost(updatedPost.data);
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