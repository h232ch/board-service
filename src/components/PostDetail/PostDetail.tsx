import React from 'react';
import { Post } from '../../types/Post';
import './PostDetail.css';

interface PostDetailProps {
  post: Post;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onEdit, onDelete, onBack }) => {
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

  return (
    <div className="post-detail">
      <div className="post-title">
        <h2>{post.title}</h2>
        <div className="post-meta">
          <span className="post-author">By {post.author}</span>
          <span>•</span>
          <span className="post-date">{formatDate(post.createdAt)}</span>
        </div>
      </div>
      <div className="post-content">
        <p>{post.content}</p>
      </div>
      <div className="post-actions">
        <button className="back-button" onClick={onBack}>Back</button>
        <button className="edit-button" onClick={onEdit}>Edit</button>
        <button className="delete-button" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default PostDetail; 