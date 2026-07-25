import { appConfig } from '../config/appConfig';
import apiClient from '../api/apiClient';
import { mockNotifications } from '../mock/notifications';

const simulateDelay = (data, ms = appConfig.mockDelayMs) => {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
};

let notificationsStore = JSON.parse(JSON.stringify(mockNotifications));

export const notificationService = {
  async getForUser(userId) {
    if (appConfig.useMockData) {
      const userNotifs = notificationsStore.filter((n) => !userId || n.userId === userId || n.userId === 'all');
      return simulateDelay(userNotifs);
    } else {
      const res = await apiClient.get('/notifications', { params: { userId } });
      return res.data;
    }
  },

  async markAsRead(id) {
    if (appConfig.useMockData) {
      const index = notificationsStore.findIndex((n) => n.id === id);
      if (index !== -1) {
        notificationsStore[index].read = true;
      }
      return simulateDelay({ success: true, id });
    } else {
      const res = await apiClient.patch(`/notifications/${id}/read`);
      return res.data;
    }
  },

  async markAllAsRead(userId) {
    if (appConfig.useMockData) {
      notificationsStore = notificationsStore.map((n) => {
        if (!userId || n.userId === userId) {
          return { ...n, read: true };
        }
        return n;
      });
      return simulateDelay({ success: true });
    } else {
      const res = await apiClient.post('/notifications/mark-all-read', { userId });
      return res.data;
    }
  }
};
