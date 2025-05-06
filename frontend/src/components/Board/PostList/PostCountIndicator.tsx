import React from 'react';
import { Typography, Box } from '@mui/material';

interface PostCountIndicatorProps {
  total: number;
  current: number;
  page: number;
}

const PostCountIndicator: React.FC<PostCountIndicatorProps> = ({ total, current, page }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        Showing {current} of {total} posts
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Page {page}
      </Typography>
    </Box>
  );
};

export default PostCountIndicator; 