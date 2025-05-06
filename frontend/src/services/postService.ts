import apiClient from '../api/client';
import { Post, CreatePostRequest } from '../types/api';

const postService = {
  getPosts: () => apiClient.get<Post[]>('/posts'),
  getPost: (id: string) => apiClient.get<Post>(`/posts/${id}`),
  createPost: (data: CreatePostRequest) => apiClient.post<Post>('/posts', data),
  updatePost: (id: string, data: Partial<Post>) => apiClient.put<Post>(`/posts/${id}`, data),
  deletePost: (id: string) => apiClient.delete(`/posts/${id}`),
};

export default postService; 