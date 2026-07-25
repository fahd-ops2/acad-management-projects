import { appConfig } from '../config/appConfig';
import apiClient from '../api/apiClient';
import { mockComments } from '../mock/comments';

const simulateDelay = (data, ms = appConfig.mockDelayMs) => {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
};

let commentsStore = JSON.parse(JSON.stringify(mockComments));

export const commentaireService = {
  async getByProjectId(projectId) {
    if (appConfig.useMockData) {
      const filtered = commentsStore.filter((c) => c.projectId === projectId);
      return simulateDelay(filtered);
    } else {
      const res = await apiClient.get(`/comments/project/${projectId}`);
      return res.data;
    }
  },

  async create(commentData) {
    if (appConfig.useMockData) {
      const newComment = {
        id: `cmt-${Date.now()}`,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        ...commentData
      };
      commentsStore.push(newComment);
      return simulateDelay(newComment);
    } else {
      const res = await apiClient.post('/comments', commentData);
      return res.data;
    }
  },

  async delete(id) {
    if (appConfig.useMockData) {
      commentsStore = commentsStore.filter((c) => c.id !== id);
      return simulateDelay({ success: true, id });
    } else {
      const res = await apiClient.delete(`/comments/${id}`);
      return res.data;
    }
  }
};
