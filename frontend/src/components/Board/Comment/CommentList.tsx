import React from 'react';
import { Comment as CommentType } from '../../../types/api';
import Comment from './Comment';
import { Box } from '@mui/material';

interface CommentListProps {
  comments: CommentType[];
  postId: string;
  username: string;
  onDeleteComment: (postId: string, commentId: string) => void;
  onEditComment: (postId: string, commentId: string, newContent: string) => void;
  onAddReply: (postId: string, parentId: string, content: string) => void;
  onEditReply: (postId: string, parentId: string, replyId: string, newContent: string) => void;
  onDeleteReply: (postId: string, parentId: string, replyId: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({ 
  comments, 
  postId,
  username,
  onDeleteComment,
  onEditComment,
  onAddReply,
  onEditReply,
  onDeleteReply
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      {comments.map(comment => (
        <Comment
          key={comment._id}
          comment={comment}
          username={username}
          onDelete={(commentId) => onDeleteComment(postId, commentId)}
          onEdit={(commentId, newContent) => onEditComment(postId, commentId, newContent)}
          onReply={(parentId, content) => onAddReply(postId, parentId, content)}
          onEditReply={(parentId, replyId, newContent) => onEditReply(postId, parentId, replyId, newContent)}
          onDeleteReply={(parentId, replyId) => onDeleteReply(postId, parentId, replyId)}
        />
      ))}
    </Box>
  );
};

export default CommentList; 