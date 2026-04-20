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
    axiosInstance.get<{ success: boolean; data: PromptsResponse }>('prompts', { params }),

  getFeatured: () =>
    axiosInstance.get<{ success: boolean; data: Prompt[] }>('prompts/featured'),

  getOne: (id: string) =>
    axiosInstance.get<{ success: boolean; data: Prompt }>(`prompts/${id}`),

  create: (data: { title: string; content: string; description?: string; category: string; tool: string; tags?: string[] }) =>
    axiosInstance.post<{ success: boolean; data: Prompt; message: string }>('prompts', data),

  like: (id: string) =>
    axiosInstance.post<{ success: boolean; liked: boolean; likesCount: number }>(`prompts/${id}/like`),

  delete: (id: string) =>
    axiosInstance.delete<{ success: boolean }>(`prompts/${id}`),
};
