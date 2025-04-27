import React from 'react';
import { Comment as CommentType } from '../../types/Comment';
import './Comment.css';

interface CommentProps {
  comment: CommentType;
  onDelete: (commentId: number) => void;
  onEdit: (comment: CommentType) => void;
}

const Comment: React.FC<CommentProps> = ({ comment, onDelete, onEdit }) => {

  return (
    <div className="comment">
      <div className="comment-header">
        <div className="comment-meta">
          <span className="comment-author">{comment.author}</span>
          <span>•</span>
          <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="comment-content">
        <p>{comment.content}</p>
        <button className="comment-edit-button" onClick={() => onEdit(comment)}>Edit</button>
        <button className="comment-delete-button" onClick={() => onDelete(comment.id)}>Delete</button>
      </div>
      
    </div>
  );
};

export default Comment; 