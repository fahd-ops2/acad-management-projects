import { appConfig } from '../config/appConfig';
import apiClient from '../api/apiClient';
import { mockUsers } from '../mock/users';

const simulateDelay = (data, ms = appConfig.mockDelayMs) => {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
};

let usersStore = [...mockUsers];

export const userService = {
  async getAll() {
    if (appConfig.useMockData) {
      return simulateDelay([...usersStore]);
    } else {
      const res = await apiClient.get('/users');
      return res.data;
    }
  },

  async getById(id) {
    if (appConfig.useMockData) {
      const user = usersStore.find((u) => u.id === id);
      if (!user) throw new Error('Utilisateur non trouvé');
      return simulateDelay({ ...user });
    } else {
      const res = await apiClient.get(`/users/${id}`);
      return res.data;
    }
  },

  async create(userData) {
    if (appConfig.useMockData) {
      const newUser = {
        id: `usr-${Date.now()}`,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&q=80&w=250`,
        ...userData
      };
      usersStore.push(newUser);
      return simulateDelay(newUser);
    } else {
      const res = await apiClient.post('/users', userData);
      return res.data;
    }
  },

  async update(id, userData) {
    if (appConfig.useMockData) {
      const index = usersStore.findIndex((u) => u.id === id);
      if (index === -1) throw new Error('Utilisateur non trouvé');
      usersStore[index] = { ...usersStore[index], ...userData };
      return simulateDelay(usersStore[index]);
    } else {
      const res = await apiClient.put(`/users/${id}`, userData);
      return res.data;
    }
  },

  async delete(id) {
    if (appConfig.useMockData) {
      usersStore = usersStore.filter((u) => u.id !== id);
      return simulateDelay({ success: true, id });
    } else {
      const res = await apiClient.delete(`/users/${id}`);
      return res.data;
    }
  }
};
