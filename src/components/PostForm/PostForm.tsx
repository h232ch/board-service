import React, { useState, useEffect } from 'react';
import { Post } from '../../types/Post';
import './PostForm.css';

interface PostFormProps {
  initialData?: Post;
  onSubmit: (postData: Omit<Post, 'id'>) => void;
  onCancel: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setAuthor(initialData.author);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      author,
      createdAt: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="post-form-container">
      <h2>{initialData ? 'Edit Post' : 'Create New Post'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit">
            {initialData ? 'Save Changes' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm; 