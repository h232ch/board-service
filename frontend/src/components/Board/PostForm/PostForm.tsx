import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { Post, CreatePostRequest } from '../../../types/api';

interface PostFormProps {
  initialData?: Post;
  onSubmit: (postData: CreatePostRequest) => Promise<void>;
  onCancel: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [tags, setTags] = useState(initialData?.tags.join(', ') || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
      });
    } catch (err) {
      setError('Failed to save post. Please try again.');
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {initialData ? 'Edit Post' : 'Create Post'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
            required
            multiline
            rows={6}
          />
          <TextField
            fullWidth
            label="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            margin="normal"
            helperText="Enter tags separated by commas"
          />
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
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
                }
              }}
            >
              {initialData ? 'Update' : 'Create'}
            </Button>
            <Button
              variant="outlined"
              onClick={onCancel}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                px: 3,
                py: 1.5,
                borderColor: '#2C3E50',
                color: '#2C3E50',
                '&:hover': {
                  borderColor: '#34495E',
                  backgroundColor: 'rgba(44, 62, 80, 0.04)'
                }
              }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default PostForm; 