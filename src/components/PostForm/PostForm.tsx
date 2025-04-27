import React, { useState, useEffect } from 'react';
import { Post } from '../../types/Post';
import './PostForm.css';

interface PostFormProps {
  initialData?: Post;
  username: string;
  onSubmit: (postData: Omit<Post, 'id'>) => void;
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
            value={username}   // username 변수를 사용
            readOnly           // 읽기 전용 설정
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