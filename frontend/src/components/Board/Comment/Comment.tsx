import React, { useState } from 'react';
import { Comment as CommentType, User } from '../../../types/api';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Paper,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { format } from 'date-fns';

interface CommentProps {
  comment: CommentType;
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string, newContent: string) => void;
  onReply: (commentId: string, content: string) => void;
  onDeleteReply: (commentId: string, replyId: string) => void;
  onEditReply: (commentId: string, replyId: string, newContent: string) => void;
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
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyContent, setEditReplyContent] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getAuthorName = (author: User | string) => {
    if (typeof author === 'string') {
      return username;  // ID 대신 현재 사용자의 username을 표시
    }
    return author.username;
  };

  const isAuthor = (author: User | string) => {
    if (typeof author === 'string') {
      return author === username;
    }
    return author.username === username;
  };

  const handleSubmit = () => {
    if (editContent.trim()) {
      onEdit(comment._id, editContent);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      onReply(comment._id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  const handleEditReplySubmit = (replyId: string) => {
    if (editReplyContent.trim()) {
      onEditReply(comment._id, replyId, editReplyContent);
      setEditingReplyId(null);
      setEditReplyContent('');
    }
  };

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: { xs: 1.5, sm: 2 }, 
        mb: 2,
        borderRadius: 1
      }}
    >
      <Box sx={{ mb: 1 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 1, 
            alignItems: 'center', 
            mb: 1,
            flexWrap: 'wrap'
          }}
        >
          <Typography 
            variant="subtitle2" 
            color="primary"
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            {getAuthorName(comment.author)}
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              ml: { xs: 0, sm: 'auto' }
            }}
          >
            {format(new Date(comment.createdAt), 'PPP p')}
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
            <Stack 
              direction="row" 
              spacing={1}
              sx={{ 
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                gap: { xs: 1, sm: 1 },
                width: '100%'
              }}
            >
              <Button 
                variant="contained" 
                size="small" 
                onClick={handleSubmit}
                fullWidth={isMobile}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  px: 2,
                  py: 0.5,
                  boxShadow: 'none',
                  bgcolor: '#2C3E50',
                  '&:hover': {
                    bgcolor: '#34495E',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                Save
              </Button>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={handleCancel}
                fullWidth={isMobile}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  px: 2,
                  py: 0.5,
                  borderColor: '#2C3E50',
                  color: '#2C3E50',
                  '&:hover': {
                    borderColor: '#34495E',
                    backgroundColor: 'rgba(44, 62, 80, 0.04)'
                  }
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        ) : (
          <>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {comment.content}
            </Typography>
            <Stack 
              direction="row" 
              spacing={1}
              sx={{ 
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                gap: { xs: 1, sm: 1 },
                width: '100%'
              }}
            >
              {isAuthor(comment.author) && (
                <>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => setIsEditing(true)}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      px: 2,
                      py: 0.5,
                      borderColor: '#2C3E50',
                      color: '#2C3E50',
                      '&:hover': {
                        borderColor: '#34495E',
                        backgroundColor: 'rgba(44, 62, 80, 0.04)'
                      }
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => onDelete(comment._id)}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      px: 2,
                      py: 0.5,
                      borderColor: '#E74C3C',
                      color: '#E74C3C',
                      '&:hover': {
                        borderColor: '#C0392B',
                        backgroundColor: 'rgba(231, 76, 60, 0.04)'
                      }
                    }}
                  >
                    Delete
                  </Button>
                </>
              )}
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => setIsReplying(!isReplying)}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  px: 2,
                  py: 0.5,
                  borderColor: '#2C3E50',
                  color: '#2C3E50',
                  '&:hover': {
                    borderColor: '#34495E',
                    backgroundColor: 'rgba(44, 62, 80, 0.04)'
                  }
                }}
              >
                Reply
              </Button>
            </Stack>
          </>
        )}
      </Box>

      {isReplying && (
        <Box 
          sx={{ 
            mt: 2, 
            pl: { xs: 1, sm: 2 }, 
            borderLeft: '2px solid', 
            borderColor: 'divider' 
          }}
        >
          <TextField
            fullWidth
            multiline
            rows={3}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            sx={{ mb: 1 }}
          />
          <Stack 
            direction="row" 
            spacing={1}
            sx={{ 
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              gap: { xs: 1, sm: 1 }
            }}
          >
            <Button 
              variant="contained" 
              size="small" 
              onClick={handleReplySubmit}
              fullWidth={isMobile}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                px: 2,
                py: 0.5,
                boxShadow: 'none',
                bgcolor: '#2C3E50',
                '&:hover': {
                  bgcolor: '#34495E',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              Post Reply
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => setIsReplying(false)}
              fullWidth={isMobile}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                px: 2,
                py: 0.5,
                borderColor: '#2C3E50',
                color: '#2C3E50',
                '&:hover': {
                  borderColor: '#34495E',
                  backgroundColor: 'rgba(44, 62, 80, 0.04)'
                }
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <Box 
          sx={{ 
            mt: 2, 
            pl: { xs: 1, sm: 2 }, 
            borderLeft: '2px solid', 
            borderColor: 'divider' 
          }}
        >
          {comment.replies.map(reply => (
            <Box key={reply._id} sx={{ mb: 2 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  alignItems: 'center', 
                  mb: 1,
                  flexWrap: 'wrap'
                }}
              >
                <Typography 
                  variant="subtitle2" 
                  color="primary"
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                >
                  {getAuthorName(reply.author)}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    ml: { xs: 0, sm: 'auto' }
                  }}
                >
                  {format(new Date(reply.createdAt), 'PPP p')}
                </Typography>
              </Box>
              {editingReplyId === reply._id ? (
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={editReplyContent}
                    onChange={(e) => setEditReplyContent(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <Stack 
                    direction="row" 
                    spacing={1}
                    sx={{ 
                      flexWrap: { xs: 'wrap', sm: 'nowrap' },
                      gap: { xs: 1, sm: 1 },
                      width: '100%'
                    }}
                  >
                    <Button 
                      variant="contained" 
                      size="small" 
                      onClick={() => handleEditReplySubmit(reply._id)}
                      fullWidth={isMobile}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        px: 2,
                        py: 0.5,
                        boxShadow: 'none',
                        bgcolor: '#2C3E50',
                        '&:hover': {
                          bgcolor: '#34495E',
                          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                        }
                      }}
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
                      fullWidth={isMobile}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        px: 2,
                        py: 0.5,
                        borderColor: '#2C3E50',
                        color: '#2C3E50',
                        '&:hover': {
                          borderColor: '#34495E',
                          backgroundColor: 'rgba(44, 62, 80, 0.04)'
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Box>
              ) : (
                <>
                  <Typography 
                    variant="body1" 
                    paragraph
                    sx={{ 
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}
                  >
                    {reply.content}
                  </Typography>
                  {isAuthor(reply.author) && (
                    <Stack 
                      direction="row" 
                      spacing={1}
                      sx={{ 
                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                        gap: { xs: 1, sm: 1 },
                        width: '100%'
                      }}
                    >
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => {
                          setEditingReplyId(reply._id);
                          setEditReplyContent(reply.content);
                        }}
                        fullWidth={isMobile}
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          px: 2,
                          py: 0.5,
                          borderColor: '#2C3E50',
                          color: '#2C3E50',
                          '&:hover': {
                            borderColor: '#34495E',
                            backgroundColor: 'rgba(44, 62, 80, 0.04)'
                          }
                        }}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        color="error"
                        onClick={() => onDeleteReply(comment._id, reply._id)}
                        fullWidth={isMobile}
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          px: 2,
                          py: 0.5,
                          borderColor: 'rgba(211, 47, 47, 0.5)',
                          '&:hover': {
                            borderColor: 'error.main',
                            backgroundColor: 'rgba(211, 47, 47, 0.04)'
                          }
                        }}
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