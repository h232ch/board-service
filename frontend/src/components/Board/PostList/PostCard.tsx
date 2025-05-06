import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  Stack
} from '@mui/material';
import { Post } from '../../../types/api';
import { format } from 'date-fns';
import { Favorite, FavoriteBorder, ChatBubbleOutline } from '@mui/icons-material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface PostCardProps {
  post: Post;
  onClick: () => void;
  children?: React.ReactNode;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick, children }) => {
  const theme = useTheme();
  const isLiked = post.likes.includes(localStorage.getItem('userId') || '');

  return (
    <Card 
      onClick={onClick}
      sx={{ 
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        },
        ...(useMediaQuery(theme.breakpoints.up('sm')) && {
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 1
        })
      }}
    >
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Typography 
          variant="h6" 
          component="h2" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '1rem', sm: '1.1rem' },
            fontWeight: 600,
            wordBreak: 'break-word',
            mb: 1
          }}
        >
          {post.title}
        </Typography>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 0.5
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
              {post.author.username}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              {format(new Date(post.createdAt), 'PPP HH:mm:ss')}
            </Typography>
          </Box>
          <Stack 
            direction="row" 
            spacing={2}
            sx={{ 
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5
            }}>
              {isLiked ? (
                <Favorite sx={{ color: 'error.main', fontSize: { xs: '0.875rem', sm: '1rem' } }} />
              ) : (
                <FavoriteBorder sx={{ color: 'text.secondary', fontSize: { xs: '0.875rem', sm: '1rem' } }} />
              )}
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                {post.likes.length}
              </Typography>
            </Box>
            {children}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostCard; 