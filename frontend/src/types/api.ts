export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: User;
  tags: string[];
  likes: string[];  // Array of user IDs who liked the post
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

export interface CreatePostRequest {
  title: string;
  content: string;
  tags: string[];
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  tags?: string[];
}

export interface CreateCommentRequest {
  content: string;
} 