import { appConfig } from '../config/appConfig';
import apiClient from '../api/apiClient';
import { mockUsers } from '../mock/users';

const simulateDelay = (data, ms = appConfig.mockDelayMs) => {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
};

export const authService = {
  async login(email, password) {
    if (appConfig.useMockData) {
      const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        throw new Error('Identifiants invalides. Vérifiez votre email.');
      }
      const token = `mock-jwt-token-${user.id}-${Date.now()}`;
      const authData = { user, token };
      localStorage.setItem('pfa_token', token);
      localStorage.setItem('pfa_user', JSON.stringify(user));
      return simulateDelay(authData);
    } else {
      const response = await apiClient.post('/auth/login', { email, password });
      const { user, token } = response.data;
      localStorage.setItem('pfa_token', token);
      localStorage.setItem('pfa_user', JSON.stringify(user));
      return response.data;
    }
  },

  async logout() {
    localStorage.removeItem('pfa_token');
    localStorage.removeItem('pfa_user');
    if (!appConfig.useMockData) {
      try {
        await apiClient.post('/auth/logout');
      } catch (e) {
        console.warn('Logout API call error:', e);
      }
    }
    return simulateDelay({ success: true });
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('pfa_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  async refreshToken() {
    if (appConfig.useMockData) {
      const user = this.getCurrentUser();
      if (!user) throw new Error('Non authentifié');
      return simulateDelay({ token: `refreshed-mock-token-${Date.now()}` });
    } else {
      const response = await apiClient.post('/auth/refresh-token');
      return response.data;
    }
  }
};
