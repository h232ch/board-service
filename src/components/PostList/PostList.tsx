import React from 'react';
import { Post } from '../../types/Post';
import './PostList.css';

interface PostListProps {
  posts: Post[];
  onPostClick: (postId: number) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onPostClick }) => {

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
            <span className="post-date">{new Date(post.createdAt).toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList; 