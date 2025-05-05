import React, { useState, useEffect } from 'react';
import { Post } from '../../../types/Post';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Stack
} from '@mui/material';

interface PostFormProps {
  initialData?: Post;
  username: string;
  onSubmit: (postData: Omit<Post, 'id' | 'comments'>) => void;
  onCancel: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ initialData, username, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      author: username,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {initialData ? 'Edit Post' : 'Create New Post'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Author"
            value={username}
            InputProps={{
              readOnly: true,
            }}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button 
              variant="outlined" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
            >
              {initialData ? 'Save Changes' : 'Create Post'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

export default PostForm; 