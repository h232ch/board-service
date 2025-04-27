import React from 'react';
import { Comment } from '../../types/Comment';
import './CommentList.css';

interface CommentListProps {
  comments: Comment[];
  postId: number;
  onDeleteComment: (postId: number, commentId: number) => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, postId, onDeleteComment }) => {
  return (
    <div className="comment-list">
      {comments.map(comment => (
        <div key={comment.id} className="comment-item">
          <div className="comment-header">
            <span className="comment-author">{comment.author}</span>
            <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
            <button 
              onClick={() => onDeleteComment(postId, comment.id)}
              className="comment-delete-btn"
            >
              삭제
            </button>
          </div>
          <div className="comment-content">{comment.content}</div>
        </div>
      ))}
    </div>
  );
};

export default CommentList; 