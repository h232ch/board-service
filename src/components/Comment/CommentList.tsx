import React from 'react';
import { Comment as CommentType } from '../../types/Comment';
import Comment from './Comment';
import './CommentList.css';

interface CommentListProps {
  comments: CommentType[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  if (comments.length === 0) {
    return <p className="no-comments">No comments yet.</p>;
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList; 