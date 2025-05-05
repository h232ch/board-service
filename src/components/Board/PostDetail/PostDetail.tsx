import React, { useState } from 'react';
import { Post } from '../../../types/Post';
import { Comment as CommentType } from '../../../types/Comment';
import CommentList from '../Comment/CommentList';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Paper,
  Divider,
  Stack
} from '@mui/material';
import { format } from 'date-fns';

interface PostDetailProps {
  post: Post;
  username: string;
  onBack: () => void;
  onEdit: (post: Post) => void;
  onDelete: (postId: number) => void;
  onAddComment: (postId: number, comment: CommentType) => void;
  onDeleteComment: (postId: number, commentId: number) => void;
  onEditComment: (postId: number, commentId: number, newContent: string) => void;
  onAddReply: (postId: number, parentId: number, content: string) => void;
  onEditReply: (postId: number, parentId: number, replyId: number, newContent: string) => void;
  onDeleteReply: (postId: number, parentId: number, replyId: number) => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ 
  post, 
  username, 
  onBack, 
  onEdit, 
  onDelete, 
  onAddComment, 
  onDeleteComment, 
  onEditComment, 
  onAddReply, 
  onEditReply, 
  onDeleteReply 
}) => {
  const [newComment, setNewComment] = useState({
    content: '',
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.content.trim()) return;

    const comment: CommentType = {
      id: Date.now(),
      author: username,
      content: newComment.content,
      createdAt: new Date().toISOString(),
    };

    onAddComment(post.id, comment);
    setNewComment({ content: '' });
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {post.title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Author: {post.author}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {format(new Date(post.createdAt), 'yyyy-MM-dd HH:mm')}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1" paragraph>
          {post.content}
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          {username === post.author && (
            <>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => onEdit(post)}
              >
                Edit
              </Button>
              <Button 
                variant="contained" 
                color="error" 
                onClick={() => onDelete(post.id)}
              >
                Delete
              </Button>
            </>
          )}
          <Button 
            variant="outlined" 
            onClick={onBack}
          >
            Back
          </Button>
        </Stack>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Comments
        </Typography>
        <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Write a comment..."
            value={newComment.content}
            onChange={(e) => setNewComment({ content: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
          >
            Add Comment
          </Button>
        </Box>
        <CommentList 
          comments={post.comments} 
          postId={post.id}
          onDeleteComment={onDeleteComment}
          onEditComment={onEditComment}
          onAddReply={onAddReply}
          onEditReply={onEditReply}
          onDeleteReply={onDeleteReply}
          username={username}
        />
      </Paper>
    </Box>
  );
};

export default PostDetail; 