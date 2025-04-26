import React from 'react';
import { Comment as CommentType } from '../../types/Comment';
import './Comment.css';

interface CommentProps {
  comment: CommentType;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
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
    <div className="comment">
      <div className="comment-header">
        <div className="comment-meta">
          <span className="comment-author">{comment.author}</span>
          <span>•</span>
          <span className="comment-date">{formatDate(comment.createdAt)}</span>
        </div>
      </div>
      <div className="comment-content">
        <p>{comment.content}</p>
      </div>
    </div>
  );
};

export default Comment; 