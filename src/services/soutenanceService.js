import { appConfig } from '../config/appConfig';
import apiClient from '../api/apiClient';
import { mockDefenses } from '../mock/defenses';

const simulateDelay = (data, ms = appConfig.mockDelayMs) => {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
};

let defensesStore = JSON.parse(JSON.stringify(mockDefenses));

export const soutenanceService = {
  async getAll() {
    if (appConfig.useMockData) {
      return simulateDelay([...defensesStore]);
    } else {
      const res = await apiClient.get('/defenses');
      return res.data;
    }
  },

  async getById(id) {
    if (appConfig.useMockData) {
      const def = defensesStore.find((d) => d.id === id);
      if (!def) throw new Error('Soutenance introuvable');
      return simulateDelay({ ...def });
    } else {
      const res = await apiClient.get(`/defenses/${id}`);
      return res.data;
    }
  },

  async create(defenseData) {
    if (appConfig.useMockData) {
      const newDef = {
        id: `sout-${Date.now()}`,
        status: 'PLANIFIEE',
        grade: null,
        mention: null,
        ...defenseData
      };
      defensesStore.unshift(newDef);
      return simulateDelay(newDef);
    } else {
      const res = await apiClient.post('/defenses', defenseData);
      return res.data;
    }
  },

  async update(id, defenseData) {
    if (appConfig.useMockData) {
      const index = defensesStore.findIndex((d) => d.id === id);
      if (index === -1) throw new Error('Soutenance non trouvée');
      defensesStore[index] = { ...defensesStore[index], ...defenseData };
      return simulateDelay(defensesStore[index]);
    } else {
      const res = await apiClient.put(`/defenses/${id}`, defenseData);
      return res.data;
    }
  },

  async delete(id) {
    if (appConfig.useMockData) {
      defensesStore = defensesStore.filter((d) => d.id !== id);
      return simulateDelay({ success: true, id });
    } else {
      const res = await apiClient.delete(`/defenses/${id}`);
      return res.data;
    }
  },

  async setGrade(id, grade, mention, notes) {
    if (appConfig.useMockData) {
      const index = defensesStore.findIndex((d) => d.id === id);
      if (index === -1) throw new Error('Soutenance non trouvée');
      defensesStore[index] = {
        ...defensesStore[index],
        grade,
        mention,
        notes: notes || defensesStore[index].notes,
        status: 'TERMINEE'
      };
      return simulateDelay(defensesStore[index]);
    } else {
      const res = await apiClient.post(`/defenses/${id}/grade`, { grade, mention, notes });
      return res.data;
    }
  }
};
