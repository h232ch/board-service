import apiClient from '../api/client';
import { CreateCommentRequest, Post } from '../types/api';

const commentService = {
  createComment: (postId: string, data: CreateCommentRequest) => 
    apiClient.post<Post>(`/posts/${postId}/comments`, data),
  updateComment: (postId: string, commentId: string, data: { content: string }) => 
    apiClient.put<Post>(`/posts/${postId}/comments/${commentId}`, data),
  deleteComment: (postId: string, commentId: string) => 
    apiClient.delete<Post>(`/posts/${postId}/comments/${commentId}`),
  addReply: (postId: string, commentId: string, data: CreateCommentRequest) =>
    apiClient.post<Post>(`/posts/${postId}/comments/${commentId}/replies`, data),
  updateReply: (postId: string, commentId: string, replyId: string, data: { content: string }) =>
    apiClient.put<Post>(`/posts/${postId}/comments/${commentId}/replies/${replyId}`, data),
  deleteReply: (postId: string, commentId: string, replyId: string) =>
    apiClient.delete<Post>(`/posts/${postId}/comments/${commentId}/replies/${replyId}`)
};

export default commentService; 