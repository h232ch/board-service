import React, { useState } from 'react';
import { Comment as CommentType } from '../../types/Comment';
import './Comment.css';

interface CommentProps {
  comment: CommentType;
  onDelete: (commentId: number) => void;
  onEdit: (commentId: number, newContent: string) => void;
  onReply: (parentId: number, content: string) => void;
  onDeleteReply: (parentId: number, replyId: number) => void;
  onEditReply: (parentId: number, replyId: number, newContent: string) => void;
  username: string;
}

const Comment: React.FC<CommentProps> = ({ 
  comment, 
  onDelete, 
  onEdit, 
  onReply,
  onDeleteReply,
  onEditReply,
  username 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editReplyContent, setEditReplyContent] = useState('');

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

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  const handleEditReplySubmit = (replyId: number) => {
    if (editReplyContent.trim()) {
      onEditReply(comment.id, replyId, editReplyContent);
      setEditingReplyId(null);
      setEditReplyContent('');
    }
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
              {comment.author === username && (
                <>
                  <button className="comment-edit-button" onClick={() => setIsEditing(true)}>Edit</button>
                  <button className="comment-delete-button" onClick={() => onDelete(comment.id)}>Delete</button>
                </>
              )}
              <button className="comment-reply-button" onClick={() => setIsReplying(true)}>Reply</button>
            </div>
          </>
        )}
      </div>

      {isReplying && (
        <div className="reply-form">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="reply-textarea"
            placeholder="Write a reply..."
          />
          <div className="reply-buttons">
            <button onClick={handleReplySubmit} className="reply-submit-button">Submit</button>
            <button onClick={() => setIsReplying(false)} className="reply-cancel-button">Cancel</button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map(reply => (
            <div key={reply.id} className="reply">
              <div className="reply-header">
                <div className="reply-meta">
                  <span className="reply-author">{reply.author}</span>
                  <span>•</span>
                  <span className="reply-date">{new Date(reply.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="reply-content">
                {editingReplyId === reply.id ? (
                  <div className="reply-edit-form">
                    <textarea
                      value={editReplyContent}
                      onChange={(e) => setEditReplyContent(e.target.value)}
                      className="reply-edit-textarea"
                    />
                    <div className="reply-edit-buttons">
                      <button onClick={() => handleEditReplySubmit(reply.id)} className="reply-save-button">Save</button>
                      <button onClick={() => {
                        setEditingReplyId(null);
                        setEditReplyContent('');
                      }} className="reply-cancel-button">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p>{reply.content}</p>
                    {reply.author === username && (
                      <div className="reply-buttons">
                        <button
                          className="reply-edit-button"
                          onClick={() => {
                            setEditingReplyId(reply.id);
                            setEditReplyContent(reply.content);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="reply-delete-button"
                          onClick={() => onDeleteReply(comment.id, reply.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment; 