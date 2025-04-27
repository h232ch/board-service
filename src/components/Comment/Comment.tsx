import React, { useState } from 'react';
import { Comment as CommentType } from '../../types/Comment';
import './Comment.css';

interface CommentProps {
  comment: CommentType;
  onDelete: (commentId: number) => void;
  onEdit: (commentId: number, newContent: string) => void;
}

const Comment: React.FC<CommentProps> = ({ comment, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleSubmit = () => {
    if (editContent.trim()) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

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
        {isEditing ? (
          <div className="comment-edit-form">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="comment-edit-textarea"
            />
            <div className="comment-edit-buttons">
              <button onClick={handleSubmit} className="comment-save-button">Save</button>
              <button onClick={handleCancel} className="comment-cancel-button">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <p>{comment.content}</p>
            <div className="comment-buttons">
              <button className="comment-edit-button" onClick={() => setIsEditing(true)}>Edit</button>
              <button className="comment-delete-button" onClick={() => onDelete(comment.id)}>Delete</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment; 