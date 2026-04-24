import api from './axiosInstance';

export interface BugReportMine {
  _id: string;
  title: string;
  status: string;
  bugXpGranted: boolean;
  suggestionXpGranted: boolean;
  createdAt: string;
  adminNote?: string;
}

export const bugReportApi = {
  submit: (body: { title: string; description: string; pageUrl?: string; suggestion?: string }) =>
    api.post<{ success: boolean; message?: string; data: { id: string; status: string } }>('bug-reports', body),

  mine: () => api.get<{ success: boolean; data: BugReportMine[] }>('bug-reports/me'),
};
