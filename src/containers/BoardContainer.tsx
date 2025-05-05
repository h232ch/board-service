import React, { useState } from 'react';
import { Post } from '../types/Post';
import { Comment } from '../types/Comment';
import { useAuth } from '../contexts/AuthContext';

interface BoardContainerProps {
  children: (props: {
    posts: Post[];
    selectedPost: Post | null;
    setPosts: (posts: Post[]) => void;
    setSelectedPost: (post: Post | null) => void;
    handleCreatePost: (post: Omit<Post, 'id' | 'comments'>) => void;
    handleEditPost: (post: Post) => void;
    handleDeletePost: (postId: number) => void;
    handleAddComment: (postId: number, comment: Comment) => void;
    handleDeleteComment: (postId: number, commentId: number) => void;
    handleEditComment: (postId: number, commentId: number, newContent: string) => void;
    handleAddReply: (postId: number, parentId: number, content: string) => void;
    handleEditReply: (postId: number, parentId: number, replyId: number, newContent: string) => void;
    handleDeleteReply: (postId: number, parentId: number, replyId: number) => void;
  }) => React.ReactNode;
}

export const BoardContainer: React.FC<BoardContainerProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: 'First Post',
      content: 'This is the content of the first post.',
      author: 'user1',
      createdAt: new Date().toISOString(),
      comments: []
    },
    {
      id: 2,
      title: 'Second Post',
      content: 'This is the content of the second post.',
      author: 'user2',
      createdAt: new Date().toISOString(),
      comments: []
    }
  ]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { username } = useAuth();

  const handleCreatePost = (post: Omit<Post, 'id' | 'comments'>) => {
    const newPost: Post = {
      ...post,
      id: Date.now(),
      comments: []
    };
    setPosts(prevPosts => [...prevPosts, newPost]);
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
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, comment] }
        : post
    ));
    if (selectedPost?.id === postId) {
      setSelectedPost(prev => prev ? { ...prev, comments: [...prev.comments, comment] } : null);
    }
  };

  const handleDeleteComment = (postId: number, commentId: number) => {
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId 
        ? { ...post, comments: post.comments.filter(comment => comment.id !== commentId) }
        : post
    ));
    if (selectedPost?.id === postId) {
      setSelectedPost(prev => prev ? { 
        ...prev, 
        comments: prev.comments.filter(comment => comment.id !== commentId) 
      } : null);
    }
  };

  const handleEditComment = (postId: number, commentId: number, newContent: string) => {
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId 
        ? {
            ...post,
            comments: post.comments.map(comment => 
              comment.id === commentId 
                ? { ...comment, content: newContent }
                : comment
            )
          }
        : post
    ));
    if (selectedPost?.id === postId) {
      setSelectedPost(prev => prev ? {
        ...prev,
        comments: prev.comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, content: newContent }
            : comment
        )
      } : null);
    }
  };

  const handleAddReply = (postId: number, parentId: number, content: string) => {
    const newReply: Comment = {
      id: Date.now(),
      author: username,
      content,
      createdAt: new Date().toISOString(),
      parentId
    };

    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId 
        ? {
            ...post,
            comments: post.comments.map(comment => 
              comment.id === parentId 
                ? { ...comment, replies: [...(comment.replies || []), newReply] }
                : comment
            )
          }
        : post
    ));
    if (selectedPost?.id === postId) {
      setSelectedPost(prev => prev ? {
        ...prev,
        comments: prev.comments.map(comment => 
          comment.id === parentId 
            ? { ...comment, replies: [...(comment.replies || []), newReply] }
            : comment
        )
      } : null);
    }
  };

  const handleEditReply = (postId: number, parentId: number, replyId: number, newContent: string) => {
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId 
        ? {
            ...post,
            comments: post.comments.map(comment => 
              comment.id === parentId
                ? {
                    ...comment,
                    replies: comment.replies?.map(reply =>
                      reply.id === replyId
                        ? { ...reply, content: newContent }
                        : reply
                    )
                  }
                : comment
            )
          }
        : post
    ));
    if (selectedPost?.id === postId) {
      setSelectedPost(prev => prev ? {
        ...prev,
        comments: prev.comments.map(comment => 
          comment.id === parentId
            ? {
                ...comment,
                replies: comment.replies?.map(reply =>
                  reply.id === replyId
                    ? { ...reply, content: newContent }
                    : reply
                )
              }
            : comment
        )
      } : null);
    }
  };

  const handleDeleteReply = (postId: number, parentId: number, replyId: number) => {
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId 
        ? {
            ...post,
            comments: post.comments.map(comment =>
              comment.id === parentId
                ? {
                    ...comment,
                    replies: comment.replies?.filter(reply => reply.id !== replyId)
                  }
                : comment
            )
          }
        : post
    ));
    if (selectedPost?.id === postId) {
      setSelectedPost(prev => prev ? {
        ...prev,
        comments: prev.comments.map(comment =>
          comment.id === parentId
            ? {
                ...comment,
                replies: comment.replies?.filter(reply => reply.id !== replyId)
              }
            : comment
        )
      } : null);
    }
  };

  return (
    <>
      {children({
        posts,
        selectedPost,
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
      })}
    </>
  );
}; 