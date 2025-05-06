import React, { useState, useMemo } from 'react';
import { Post } from '../../../types/Post';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Box, 
  Button,
  Paper,
  TextField,
  InputAdornment,
  Pagination
} from '@mui/material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import PostCountIndicator from './PostCountIndicator';

interface PostListProps {
  posts: Post[];
  onPostClick: (postId: number) => void;
  onCreatePost: () => void;
}

const POSTS_PER_PAGE = 5;

const PostList: React.FC<PostListProps> = ({ posts, onPostClick, onCreatePost }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const handlePostClick = (postId: number) => {
    onPostClick(postId);
    navigate(`/board/${postId}`);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const filteredPosts = useMemo(() => {
    return posts
      .filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts, searchTerm]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredPosts, page]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // Reset to first page when searching
          }}
          sx={{ width: '300px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onCreatePost}
        >
          Create New Post
        </Button>
      </Box>
      <PostCountIndicator
        currentPage={page}
        postsPerPage={POSTS_PER_PAGE}
        totalPosts={filteredPosts.length}
      />
      <List>
        {paginatedPosts.map((post) => (
          <Paper 
            key={post.id} 
            elevation={2}
            sx={{ 
              mb: 2,
              '&:hover': {
                backgroundColor: 'action.hover',
                cursor: 'pointer'
              }
            }}
          >
            <ListItem 
              onClick={() => handlePostClick(post.id)}
            >
              <ListItemText
                primary={
                  <Typography variant="h6" component="div">
                    {post.title}
                  </Typography>
                }
                secondary={
                  <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" component="span">
                      {post.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" component="span">
                      {format(new Date(post.createdAt), 'yyyy-MM-dd HH:mm')}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          </Paper>
        ))}
      </List>
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default PostList; 