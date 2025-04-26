import React, { useState } from 'react';
import { Post } from '../../types/Post';
import { Comment as CommentType } from '../../types/Comment';
import CommentList from '../Comment/CommentList';
import './PostDetail.css';

interface PostDetailProps {
  post: Post;
  onBack: () => void;
  onEdit: (post: Post) => void;
  onDelete: (postId: number) => void;
  comments: CommentType[];
  onAddComment: (postId: number, comment: CommentType) => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onBack, onEdit, onDelete, comments, onAddComment }) => {
  const [newComment, setNewComment] = useState({
    content: '',
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.content.trim()) return;

    const comment: CommentType = {
      id: Date.now(),
      author: 'Current User', // TODO: 실제 로그인한 사용자 정보 사용
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
          <span className="post-detail-author">작성자: {post.author}</span>
          <span className="post-detail-date">{new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </div>
      <div className="post-detail-content">
        <p>{post.content}</p>
      </div>
      
      <div className="comment-section">
        <h2>댓글</h2>
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <div className="form-group">
            <textarea
              placeholder="댓글 내용"
              value={newComment.content}
              onChange={(e) => setNewComment({ content: e.target.value })}
              className="comment-textarea"
            />
          </div>
          <button type="submit" className="comment-submit">댓글 작성</button>
        </form>
        <CommentList comments={comments} />
      </div>

      <button onClick={onBack} className="back-button">Back</button>
    </div>
  );
};

export default PostDetail; 