import React, { useState } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Stack,
  Box,
  Pagination
} from '@mui/material';
import { Post } from '../../../types/api';
import PostCard from './PostCard';
import PostCountIndicator from './PostCountIndicator';
import { useNavigate } from 'react-router-dom';

interface PostListProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

const POSTS_PER_PAGE = 5;

const PostList: React.FC<PostListProps> = ({ posts, onPostClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent={{ sm: 'space-between' }}
        >
        <TextField
            label="Search posts"
            variant="outlined"
          value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            sx={{ 
              maxWidth: { sm: '400px' },
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                }
              }
          }}
        />
        <Button 
          variant="contained" 
          color="primary" 
            onClick={() => navigate('/board/new')}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
              py: 2,
              boxShadow: 'none',
              minWidth: { xs: '100%', sm: 'auto' },
              whiteSpace: 'nowrap',
              ml: { sm: 'auto' },
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
            />
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
    </Container>
  );
};

export default PostList; 