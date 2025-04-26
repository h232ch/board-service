import React from 'react';
import { Post } from '../../types/Post';
import './PostList.css';

interface PostListProps {
  posts: Post[];
  onPostClick: (postId: number) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onPostClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/(\d+)\/(\d+)\/(\d+),/, '$3-$1-$2');
  };

  if (posts.length === 0) {
    return <p>No posts available.</p>;
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <div 
          key={post.id} 
          className="post-item"
          onClick={() => onPostClick(post.id)}
        >
          <h3 className="post-title">{post.title}</h3>
          <div className="post-meta">
            <span className="post-author">{post.author}</span>
            <span>•</span>
            <span className="post-date">{formatDate(post.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList; 