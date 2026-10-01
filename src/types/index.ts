export type PostAuthor = {
  id: number;
  name: string;
  email: string;
  photo?: string | null;
};

export type PostComment = {
  id: number;
  post_id: number;
  user_id: number;
  comment: string;
  created_at: string;
  updated_at?: string;
  user?: PostAuthor | null;
  author?: PostAuthor | null;
};

export type Post = {
  id: number;
  user_id: number;
  description: string;
  cover?: string | null;
  likes_count?: number;
  comments_count?: number;
  is_liked?: boolean | number;
  created_at?: string;
  updated_at?: string;
  author?: PostAuthor | null;
  user?: PostAuthor | null;
  comments?: PostComment[];
};

export type User = {
  id: number;
  name: string;
  email: string;
  photo?: string | null;
  created_at?: string;
};

export type ApiResult<T = unknown> = {
  status?: string;
  success?: boolean;
  message?: string;
  data?: T;
};

export type { RootState, AppDispatch } from "@/store";
