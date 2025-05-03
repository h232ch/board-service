import React from 'react';
import { Comment as CommentType } from '../../../types/Comment';
import Comment from './Comment';
import { Box } from '@mui/material';

interface CommentListProps {
  comments: CommentType[];
  postId: number;
  username: string;
  onDeleteComment: (postId: number, commentId: number) => void;
  onEditComment: (postId: number, commentId: number, newContent: string) => void;
  onAddReply: (postId: number, parentId: number, content: string) => void;
  onEditReply: (postId: number, parentId: number, replyId: number, newContent: string) => void;
  onDeleteReply: (postId: number, parentId: number, replyId: number) => void;
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
          key={comment.id}
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