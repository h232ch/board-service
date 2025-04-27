import React from 'react';
import { Comment as CommentType } from '../../types/Comment';
import Comment from './Comment';
import './CommentList.css';

interface CommentListProps {
  comments: CommentType[];
  postId: number;
  onDeleteComment: (postId: number, commentId: number) => void;
  onEditComment: (postId: number, commentId: number, newContent: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({ 
  comments, 
  postId, 
  onDeleteComment,
  onEditComment 
}) => {
  return (
    <div className="comment-list">
      {comments.map(comment => (
        <Comment
          key={comment.id}
          comment={comment}
          onDelete={(commentId) => onDeleteComment(postId, commentId)}
          onEdit={(commentId, newContent) => onEditComment(postId, commentId, newContent)}
        />
      ))}
    </div>
  );
};

export default CommentList; 