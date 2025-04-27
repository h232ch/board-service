import React from 'react';
import { Post } from '../../types/Post';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Box, 
  Button,
  Paper
} from '@mui/material';
import { format } from 'date-fns';

interface PostListProps {
  posts: Post[];
  onPostClick: (postId: number) => void;
  onCreatePost: () => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onPostClick, onCreatePost }) => {
  // Sort posts by date in descending order (newest first)
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (sortedPosts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No posts available.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onCreatePost}
          sx={{ mt: 2 }}
        >
          Create New Post
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onCreatePost}
        >
          Create New Post
        </Button>
      </Box>
      <List>
        {sortedPosts.map((post) => (
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
              onClick={() => onPostClick(post.id)}
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
    </Box>
  );
};

export default PostList; 