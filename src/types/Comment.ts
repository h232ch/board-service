export interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  parentId?: number | null;  // 대댓글인 경우 부모 댓글의 ID
  replies?: Comment[];       // 대댓글 목록
} 