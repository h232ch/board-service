import apiClient from './client';
import { AuthResponse, LoginRequest, RegisterRequest, Post, CreatePostRequest, UpdatePostRequest, CreateCommentRequest } from '../types/api';

export const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/users/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/users/login', data);
    return response.data;
  },

  getProfile: async (): Promise<AuthResponse> => {
    const response = await apiClient.get<AuthResponse>('/users/profile');
    return response.data;
  }
};

export const postService = {
  getPosts: async (): Promise<Post[]> => {
    const response = await apiClient.get<Post[]>('/posts');
    return response.data;
  },

  getPost: async (id: string): Promise<Post> => {
    const response = await apiClient.get<Post>(`/posts/${id}`);
    return response.data;
  },

  createPost: async (data: CreatePostRequest): Promise<Post> => {
    const response = await apiClient.post<Post>('/posts', data);
    return response.data;
  },

  updatePost: async (id: string, data: UpdatePostRequest): Promise<Post> => {
    const response = await apiClient.put<Post>(`/posts/${id}`, data);
    return response.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await apiClient.delete(`/posts/${id}`);
  },

  addComment: async (postId: string, data: CreateCommentRequest): Promise<Post> => {
    const response = await apiClient.post<Post>(`/posts/${postId}/comments`, data);
    return response.data;
  },

  toggleLike: async (postId: string): Promise<Post> => {
    const response = await apiClient.post<Post>(`/posts/${postId}/like`);
    return response.data;
  }
}; 