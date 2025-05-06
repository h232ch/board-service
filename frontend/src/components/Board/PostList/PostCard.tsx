import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Post } from '../../../types/api';
import { format } from 'date-fns';

interface PostCardProps {
  post: Post;
  onClick: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  return (
    <Card 
      onClick={() => onClick(post)}
      sx={{ 
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
        }
      }}
    >
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Typography 
          variant="h6" 
          component="div" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '1rem', sm: '1.25rem' },
            mb: 1
          }}
        >
          {post.title}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            mb: 1
          }}
        >
          {post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label={`${post.comments.length} comments`} 
              size="small"
              sx={{ 
                borderRadius: '4px',
                backgroundColor: 'rgba(44, 62, 80, 0.08)',
                '& .MuiChip-label': {
                  color: '#2C3E50'
                }
              }}
            />
            <Chip 
              label={`${post.likes.length} likes`} 
              size="small"
              sx={{ 
                borderRadius: '4px',
                backgroundColor: 'rgba(231, 76, 60, 0.08)',
                '& .MuiChip-label': {
                  color: '#E74C3C'
                }
              }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            {format(new Date(post.createdAt), 'yyyy-MM-dd HH:mm')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostCard; 