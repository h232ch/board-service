import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  Chip,
  TextField,
  CircularProgress
} from '@mui/material';
import { Post, CreateCommentRequest, User } from '../../../types/api';
import { format } from 'date-fns';
import Comment from '../Comment/Comment';
import { Favorite, FavoriteBorder, MoreVert } from '@mui/icons-material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { usePullToRefresh } from '../../../hooks/usePullToRefresh';

interface PostDetailProps {
  post: Post;
  currentUser: User;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
  onAddComment: (comment: CreateCommentRequest) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onEditComment: (commentId: string, content: string) => Promise<void>;
  onAddReply: (postId: string, parentId: string, content: string) => Promise<void>;
  onDeleteReply: (postId: string, parentId: string, replyId: string) => Promise<void>;
  onEditReply: (postId: string, parentId: string, replyId: string, content: string) => Promise<void>;
  onLike: (postId: string) => void;
  refresh: () => Promise<void>;
}

const PostDetail: React.FC<PostDetailProps> = ({
  post,
  currentUser,
  onEdit,
  onDelete,
  onBack,
  onAddComment,
  onDeleteComment,
  onEditComment,
  onAddReply,
  onDeleteReply,
  onEditReply,
  onLike,
  refresh
}) => {
  const [newComment, setNewComment] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isPostAuthor = post.author?._id === currentUser._id;
  const theme = useTheme();
  const { isRefreshing, pullDistance, threshold } = usePullToRefresh({ onRefresh: refresh });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBack = () => {
    handleMenuClose();
    onBack();
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit();
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete();
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await onAddComment({ content: newComment });
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const isLiked = currentUser ? post.likes.includes(currentUser._id) : false;

  return (
    <Container maxWidth="md" sx={{ 
      p: { xs: 0, sm: 1 }
    }}>
      <Box
        sx={{
          position: 'relative',
          transform: `translateY(${Math.min(pullDistance, threshold)}px)`,
          transition: isRefreshing ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -60,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            opacity: pullDistance > 0 ? Math.min(pullDistance / threshold, 1) : 0,
            transition: 'opacity 0.2s ease-out'
          }}
        >
          <CircularProgress 
            size={24} 
            sx={{ 
              color: '#2C3E50',
              transform: isRefreshing ? 'none' : `rotate(${Math.min(pullDistance / threshold * 360, 360)}deg)`,
              transition: isRefreshing ? 'none' : 'transform 0.2s ease-out'
            }} 
          />
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#2C3E50',
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
          </Typography>
        </Box>
        <Box 
          sx={{ 
            p: { xs: 0, sm: 3 }, 
            mb: 4,
            ...(useMediaQuery(theme.breakpoints.up('sm')) && {
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 3
            })
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  wordBreak: 'break-word'
                }}
              >
                {post.title}
              </Typography>
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  color: '#2C3E50',
                  '&:hover': {
                    backgroundColor: 'rgba(44, 62, 80, 0.04)'
                  }
                }}
              >
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    borderRadius: '8px',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <MenuItem onClick={handleBack}>
                  <ListItemText sx={{ color: '#2C3E50' }}>Back</ListItemText>
                </MenuItem>
                {isPostAuthor && [
                  <MenuItem key="edit" onClick={handleEdit}>
                    <ListItemText sx={{ color: '#2C3E50' }}>Edit</ListItemText>
                  </MenuItem>,
                  <MenuItem key="delete" onClick={handleDelete}>
                    <ListItemText sx={{ color: '#2C3E50' }}>Delete</ListItemText>
                  </MenuItem>
                ]}
              </Menu>
            </Box>
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 1, 
                alignItems: 'center', 
                mb: 2,
                flexWrap: 'wrap'
              }}
            >
              <Typography 
                variant="subtitle1" 
                color="primary"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                {post.author.username}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                {format(new Date(post.createdAt), 'PPP HH:mm:ss')}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              {post.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {post.content}
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                mt: 2
              }}
            >
              <IconButton 
                onClick={() => onLike(post._id)}
                sx={{ 
                  color: isLiked ? 'error.main' : 'text.secondary',
                  '&:hover': { 
                    transform: 'scale(1.1)',
                    transition: 'transform 0.2s',
                    color: 'error.main'
                  },
                  pl: 0
                }}
              >
                {isLiked ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
          >
            Comments ({post.comments.reduce((total, comment) => 
              total + 1 + (comment.replies?.length || 0), 0
            )})
          </Typography>

          <Box 
            component="form" 
            onSubmit={handleAddComment} 
            sx={{ mb: 4 }}
          >
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2C3E50',
                  }
                }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!newComment.trim()}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                px: 3,
                py: 1.5,
                boxShadow: 'none',
                bgcolor: '#2C3E50',
                '&:hover': {
                  bgcolor: '#34495E',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(44, 62, 80, 0.12)',
                  color: 'rgba(44, 62, 80, 0.26)'
                }
              }}
            >
              Add Comment
            </Button>
          </Box>

          {post.comments.map(comment => (
            <Comment
              key={comment._id}
              comment={comment}
              username={currentUser.username}
              onDelete={onDeleteComment}
              onEdit={onEditComment}
              onReply={(commentId, content) => onAddReply(post._id, commentId, content)}
              onDeleteReply={(commentId, replyId) => onDeleteReply(post._id, commentId, replyId)}
              onEditReply={(commentId, replyId, content) => onEditReply(post._id, commentId, replyId, content)}
            />
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default PostDetail; 