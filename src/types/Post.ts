import { Comment } from './Comment';

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  comments: Comment[];
} 