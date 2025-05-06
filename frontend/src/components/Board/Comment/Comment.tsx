import React, { useState } from 'react';
import { Comment as CommentType, User } from '../../../types/api';
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

  const getAuthorName = (author: User | string) => {
    if (typeof author === 'string') {
      return author;  // ID를 그대로 표시
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
        p: { xs: 2.5, sm: 2 }, 
        mb: 2,
        borderRadius: 1,
        width: '100%'
      }}
    >
      <Box sx={{ mb: 1 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'row', sm: 'row' },
            gap: 1,
            mb: 1,
            flexWrap: 'wrap'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            flexWrap: 'wrap'
          }}>
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
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              {format(new Date(comment.createdAt), 'PPP p')}
            </Typography>
          </Box>
          <Stack 
            direction="row" 
            spacing={1}
          >
            <Button 
              variant="contained" 
              size="small" 
              onClick={() => setIsReplying(!isReplying)}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                px: { xs: 0.5, sm: 2 },
                py: { xs: 0.25, sm: 0.5 },
                minWidth: { xs: 'auto', sm: '64px' },
                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                boxShadow: 'none',
                bgcolor: '#2C3E50',
                '&:hover': {
                  bgcolor: '#34495E',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              Reply
            </Button>
            {isAuthor(comment.author) && (
              <>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => setIsEditing(true)}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    px: { xs: 0.5, sm: 2 },
                    py: { xs: 0.25, sm: 0.5 },
                    minWidth: { xs: 'auto', sm: '64px' },
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
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
                    px: { xs: 0.5, sm: 2 },
                    py: { xs: 0.25, sm: 0.5 },
                    minWidth: { xs: 'auto', sm: '64px' },
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
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
          </Stack>
        </Box>

        {isEditing ? (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              sx={{ 
                mb: 1,
                '& .MuiInputBase-input': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }
              }}
            />
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              width: '100%'
            }}>
              <Button 
                variant="contained" 
                size="small" 
                onClick={handleSubmit}
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
            </Box>
          </Box>
        ) : (
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
        )}

        {isReplying && (
          <Box 
            sx={{ 
              mt: 2, 
              pl: 2,
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
              sx={{ 
                mb: 1,
                '& .MuiInputBase-input': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }
              }}
            />
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              width: '100%'
            }}>
              <Button 
                variant="contained" 
                size="small" 
                onClick={handleReplySubmit}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  px: { xs: 1, sm: 2 },
                  py: { xs: 0.25, sm: 0.5 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
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
                onClick={() => setIsReplying(false)}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  px: { xs: 1, sm: 2 },
                  py: { xs: 0.25, sm: 0.5 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
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
            </Box>
          </Box>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <Box 
            sx={{ 
              ml: { xs: 1, sm: 4 }, 
              mt: 2,
              pl: 2,
              borderLeft: '2px solid',
              borderColor: 'divider' 
            }}
          >
            {comment.replies.map(reply => (
              <Box key={reply._id} sx={{ mb: 2 }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: { xs: 'row', sm: 'row' },
                    gap: 1,
                    mb: 1,
                    flexWrap: 'wrap'
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    flexWrap: 'wrap'
                  }}>
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
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    >
                      {format(new Date(reply.createdAt), 'PPP p')}
                    </Typography>
                  </Box>
                  {isAuthor(reply.author) && (
                    <Stack 
                      direction="row" 
                      spacing={1}
                    >
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => {
                          setEditingReplyId(reply._id);
                          setEditReplyContent(reply.content);
                        }}
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          px: { xs: 0.5, sm: 2 },
                          py: { xs: 0.25, sm: 0.5 },
                          minWidth: { xs: 'auto', sm: '64px' },
                          fontSize: { xs: '0.7rem', sm: '0.875rem' },
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
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          px: { xs: 0.5, sm: 2 },
                          py: { xs: 0.25, sm: 0.5 },
                          minWidth: { xs: 'auto', sm: '64px' },
                          fontSize: { xs: '0.7rem', sm: '0.875rem' },
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
                </Box>
                {editingReplyId === reply._id ? (
                  <Box>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      value={editReplyContent}
                      onChange={(e) => setEditReplyContent(e.target.value)}
                      sx={{ 
                        mb: 1,
                        '& .MuiInputBase-input': {
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }
                      }}
                    />
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1,
                      width: '100%'
                    }}>
                      <Button 
                        variant="contained" 
                        size="small" 
                        onClick={() => handleEditReplySubmit(reply._id)}
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          px: { xs: 1, sm: 2 },
                          py: { xs: 0.25, sm: 0.5 },
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
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
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          px: { xs: 1, sm: 2 },
                          py: { xs: 0.25, sm: 0.5 },
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
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
                    </Box>
                  </Box>
                ) : (
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
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default Comment; 