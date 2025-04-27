import React from 'react';
import { Post } from '../../types/Post';
import './PostList.css';

interface PostListProps {
  posts: Post[];
  onPostClick: (postId: number) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onPostClick }) => {
  // Sort posts by date in descending order (newest first)
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (sortedPosts.length === 0) {
    return <p>No posts available.</p>;
  }

  return (
    <div className="post-list">
      {sortedPosts.map((post) => (
        <div 
          key={post.id} 
          className="post-item"
          onClick={() => onPostClick(post.id)}
        >
          <h2 className="post-title">{post.title}</h2>
          <div className="post-meta">
            <span className="post-author">작성자: {post.author}</span>
            <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList; 