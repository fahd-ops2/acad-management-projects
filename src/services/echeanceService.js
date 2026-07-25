import { appConfig } from '../config/appConfig';
import apiClient from '../api/apiClient';
import { mockDeadlines } from '../mock/deadlines';
import { mockDeliverables } from '../mock/deliverables';

const simulateDelay = (data, ms = appConfig.mockDelayMs) => {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
};

let deadlinesStore = JSON.parse(JSON.stringify(mockDeadlines));

export const echeanceService = {
  async getAll() {
    if (appConfig.useMockData) {
      // Automatic delay check
      const today = new Date().toISOString().substring(0, 10);
      const updatedDeadlines = deadlinesStore.map((ech) => {
        if (ech.dueDate < today && ech.status !== 'VALIDE') {
          return { ...ech, status: 'DEPASSE' };
        }
        return ech;
      });
      deadlinesStore = updatedDeadlines;
      return simulateDelay([...deadlinesStore]);
    } else {
      const res = await apiClient.get('/deadlines');
      return res.data;
    }
  },

  async create(deadlineData) {
    if (appConfig.useMockData) {
      const newDeadline = {
        id: `ech-${Date.now()}`,
        status: 'A_VENIR',
        ...deadlineData
      };
      deadlinesStore.push(newDeadline);
      return simulateDelay(newDeadline);
    } else {
      const res = await apiClient.post('/deadlines', deadlineData);
      return res.data;
    }
  },

  async update(id, deadlineData) {
    if (appConfig.useMockData) {
      const index = deadlinesStore.findIndex((d) => d.id === id);
      if (index === -1) throw new Error('Échéance non trouvée');
      deadlinesStore[index] = { ...deadlinesStore[index], ...deadlineData };
      return simulateDelay(deadlinesStore[index]);
    } else {
      const res = await apiClient.put(`/deadlines/${id}`, deadlineData);
      return res.data;
    }
  },

  async delete(id) {
    if (appConfig.useMockData) {
      deadlinesStore = deadlinesStore.filter((d) => d.id !== id);
      return simulateDelay({ success: true, id });
    } else {
      const res = await apiClient.delete(`/deadlines/${id}`);
      return res.data;
    }
  },

  async detectDelays() {
    if (appConfig.useMockData) {
      const today = new Date().toISOString().substring(0, 10);
      const delayedDeliverables = mockDeliverables.filter((d) => {
        return d.dueDate && d.dueDate < today && d.status !== 'VALIDE';
      });
      return simulateDelay({
        count: delayedDeliverables.length,
        items: delayedDeliverables
      });
    } else {
      const res = await apiClient.get('/deadlines/delays');
      return res.data;
    }
  }
};
