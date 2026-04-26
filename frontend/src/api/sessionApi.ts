import api from './axiosInstance';

export type SessionInfo = {
  id: string;
  ip: string | null;
  ua: string | null;
  lastUsedAt: string;
  createdAt: string;
  absoluteExpiresAt: string;
  current: boolean;
};

export const sessionApi = {
  /** GET /sessions — list current user's active sessions. */
  list: () =>
    api.get<{ success: boolean; data: SessionInfo[] }>('sessions'),

  /** DELETE /sessions/:id — revoke one specific session. */
  revoke: (sessionId: string) => api.delete(`sessions/${sessionId}`),

  /** DELETE /sessions — revoke all sessions except the current one. */
  revokeOthers: () => api.delete('sessions'),
};
