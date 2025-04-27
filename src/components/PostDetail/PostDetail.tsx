import React, { useState } from 'react';
import { Post } from '../../types/Post';
import { Comment as CommentType } from '../../types/Comment';
import CommentList from '../Comment/CommentList';
import './PostDetail.css';

interface PostDetailProps {
  post: Post;
  username: string;
  onBack: () => void;
  onEdit: (post: Post) => void;
  onDelete: (postId: number) => void;
  comments: CommentType[];
  onAddComment: (postId: number, comment: CommentType) => void;
  onDeleteComment: (postId: number, commentId: number) => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, username, onBack, onEdit, onDelete, comments, onAddComment, onDeleteComment }) => {
  const [newComment, setNewComment] = useState({
    content: '',
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.content.trim()) return;

    const comment: CommentType = {
      id: Date.now(),
      author: username, // TODO: 실제 로그인한 사용자 정보 사용
      content: newComment.content,
      createdAt: new Date().toISOString(),
    };

    onAddComment(post.id, comment);
    setNewComment({ content: '' });
  };

  return (
    <div className="post-detail">
      <div className="post-detail-header">
        <h1 className="post-detail-title">{post.title}</h1>
        <div className="post-detail-meta">
          <span className="post-detail-author">Author: {post.author}</span>
          <span className="post-detail-date">{new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </div>
      <div className="post-detail-content">
        <p>{post.content}</p>
      </div>
      <div className="post-actions">
        <button onClick={() => onEdit(post)} className='edit-button'>Edit</button>
        <button onClick={() => onDelete(post.id)} className='delete-button'>Delete</button>
        <button onClick={onBack} className="back-button">Back</button>
      </div>
    
      <div className="comment-section">
        <h2>Comments</h2>
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <div className="form-group">
            <textarea
              placeholder="Comment Contents"
              value={newComment.content}
              onChange={(e) => setNewComment({ content: e.target.value })}
              className="comment-textarea"
            />
          </div>
          <button type="submit" className="comment-submit">New Comment</button>
        </form>
        <CommentList 
          comments={comments} 
          postId={post.id}
          onDeleteComment={onDeleteComment}
        />
      </div>
    </div>
  );
};

export default PostDetail; 