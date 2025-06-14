import React, { useState, useEffect } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Stack,
  Box,
  Pagination,
  CircularProgress,
  Typography
} from '@mui/material';
import { Post } from '../../../types/api';
import PostCard from './PostCard';
import PostCountIndicator from './PostCountIndicator';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePullToRefresh } from '../../../hooks/usePullToRefresh';
import { ChatBubbleOutline } from '@mui/icons-material';

interface PostListProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
  refresh: () => Promise<void>;
}

const POSTS_PER_PAGE = 5;

const PostList: React.FC<PostListProps> = ({ posts, onPostClick, refresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isRefreshing, pullDistance, threshold } = usePullToRefresh({ onRefresh: refresh });

  // Get page from URL or default to 1
  const page = parseInt(searchParams.get('page') || '1', 10);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  // Update URL when page changes
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setSearchParams({ page: value.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (searchTerm) {
      setSearchParams({ page: '1' });
    }
  }, [searchTerm, setSearchParams]);

  return (
    <Container maxWidth="md" sx={{ p: { xs: 0, sm: 1 } }}>
      
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
        <Stack spacing={2}>
          <Stack 
            direction="row" 
            spacing={2} 
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: '100%' }}
          >
            <Box sx={{ flex: { xs: 1, sm: 2 } }}>
              <TextField
                label="Search posts"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                fullWidth
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    py: { xs: 1, sm: 1.5 }
                  }
                }}
              />
            </Box>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/board/new')}
              size="small"
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                px: { xs: 2, sm: 3 },
                py: { xs: 0.75, sm: 1 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                boxShadow: 'none',
                whiteSpace: 'nowrap',
                bgcolor: '#2C3E50',
                '&:hover': {
                  bgcolor: '#34495E',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              Create New Post
            </Button>
          </Stack>
          <PostCountIndicator
            total={filteredPosts.length} 
            current={paginatedPosts.length} 
            page={page}
          />
          <Stack spacing={2}>
            {paginatedPosts.map(post => (
              <PostCard 
                key={post._id}
                post={post} 
                onClick={() => onPostClick(post)}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5
                }}>
                  <ChatBubbleOutline sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} />
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    {post.comments.reduce((total, comment) => 
                      total + 1 + (comment.replies?.length || 0), 0
                    )}
                  </Typography>
                </Box>
              </PostCard>
            ))}
          </Stack>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#2C3E50',
                    '&.Mui-selected': {
                      backgroundColor: '#2C3E50',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#34495E',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(44, 62, 80, 0.04)',
                    },
                  },
                }}
              />
            </Box>
          )}
        </Stack>
      </Box>
    </Container>
  );
};

export default PostList; 