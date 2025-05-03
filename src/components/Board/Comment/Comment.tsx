import React, { useState } from 'react';
import { Comment as CommentType } from '../../../types/Comment';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Paper,
  Stack
} from '@mui/material';
import { format } from 'date-fns';

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
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" color="primary">
            {comment.author}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {format(new Date(comment.createdAt), 'yyyy-MM-dd HH:mm')}
          </Typography>
        </Box>
        {isEditing ? (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Stack direction="row" spacing={1}>
              <Button 
                variant="contained" 
                size="small" 
                onClick={handleSubmit}
              >
                Save
              </Button>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        ) : (
          <>
            <Typography variant="body1" paragraph>
              {comment.content}
            </Typography>
            <Stack direction="row" spacing={1}>
              {comment.author === username && (
                <>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    color="error"
                    onClick={() => onDelete(comment.id)}
                  >
                    Delete
                  </Button>
                </>
              )}
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => setIsReplying(true)}
              >
                Reply
              </Button>
            </Stack>
          </>
        )}
      </Box>

      {isReplying && (
        <Box sx={{ mt: 2, pl: 2, borderLeft: '2px solid', borderColor: 'divider' }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            sx={{ mb: 1 }}
          />
          <Stack direction="row" spacing={1}>
            <Button 
              variant="contained" 
              size="small" 
              onClick={handleReplySubmit}
            >
              Submit
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => setIsReplying(false)}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <Box sx={{ mt: 2, pl: 2, borderLeft: '2px solid', borderColor: 'divider' }}>
          {comment.replies.map(reply => (
            <Box key={reply.id} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="primary">
                  {reply.author}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(reply.createdAt), 'yyyy-MM-dd HH:mm')}
                </Typography>
              </Box>
              {editingReplyId === reply.id ? (
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={editReplyContent}
                    onChange={(e) => setEditReplyContent(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <Stack direction="row" spacing={1}>
                    <Button 
                      variant="contained" 
                      size="small" 
                      onClick={() => handleEditReplySubmit(reply.id)}
                    >
                      Save
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => {
                        setEditingReplyId(null);
                        setEditReplyContent('');
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Box>
              ) : (
                <>
                  <Typography variant="body1" paragraph>
                    {reply.content}
                  </Typography>
                  {reply.author === username && (
                    <Stack direction="row" spacing={1}>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => {
                          setEditingReplyId(reply.id);
                          setEditReplyContent(reply.content);
                        }}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        color="error"
                        onClick={() => onDeleteReply(comment.id, reply.id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  )}
                </>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default Comment; 