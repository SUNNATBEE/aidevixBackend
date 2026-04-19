import axiosInstance from './axiosInstance';

export interface Prompt {
  _id: string;
  title: string;
  content: string;
  description: string;
  category: string;
  tool: string;
  tags: string[];
  author: { _id: string; username: string; firstName?: string; avatar?: string; aiStack?: string[]; rankTitle?: string };
  likesCount: number;
  viewsCount: number;
  likes: string[];
  isFeatured: boolean;
  createdAt: string;
}

export interface PromptsResponse {
  prompts: Prompt[];
  total: number;
  page: number;
  pages: number;
}

export const promptApi = {
  getAll: (params?: Record<string, string | number>) =>
    axiosInstance.get<{ success: boolean; data: PromptsResponse }>('/api/prompts', { params }),

  getFeatured: () =>
    axiosInstance.get<{ success: boolean; data: Prompt[] }>('/api/prompts/featured'),

  getOne: (id: string) =>
    axiosInstance.get<{ success: boolean; data: Prompt }>(`/api/prompts/${id}`),

  create: (data: { title: string; content: string; description?: string; category: string; tool: string; tags?: string[] }) =>
    axiosInstance.post<{ success: boolean; data: Prompt; message: string }>('/api/prompts', data),

  like: (id: string) =>
    axiosInstance.post<{ success: boolean; liked: boolean; likesCount: number }>(`/api/prompts/${id}/like`),

  delete: (id: string) =>
    axiosInstance.delete<{ success: boolean }>(`/api/prompts/${id}`),
};
