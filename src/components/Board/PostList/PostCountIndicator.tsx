import React from 'react';
import { Typography, Box } from '@mui/material';

interface PostCountIndicatorProps {
  currentPage: number;
  postsPerPage: number;
  totalPosts: number;
}

const PostCountIndicator: React.FC<PostCountIndicatorProps> = ({
  currentPage,
  postsPerPage,
  totalPosts
}) => {
  const startPost = (currentPage - 1) * postsPerPage + 1;
  const endPost = Math.min(currentPage * postsPerPage, totalPosts);

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Showing {startPost}-{endPost} of {totalPosts} posts
      </Typography>
    </Box>
  );
};

export default PostCountIndicator; 