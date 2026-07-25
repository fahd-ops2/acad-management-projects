import { appConfig } from '../config/appConfig';
import apiClient from '../api/apiClient';
import { mockGroups } from '../mock/groups';

const simulateDelay = (data, ms = appConfig.mockDelayMs) => {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
};

let groupsStore = JSON.parse(JSON.stringify(mockGroups));

export const groupeService = {
  async getAll() {
    if (appConfig.useMockData) {
      return simulateDelay([...groupsStore]);
    } else {
      const res = await apiClient.get('/groups');
      return res.data;
    }
  },

  async getById(id) {
    if (appConfig.useMockData) {
      const group = groupsStore.find((g) => g.id === id);
      if (!group) throw new Error('Groupe non trouvé');
      return simulateDelay({ ...group });
    } else {
      const res = await apiClient.get(`/groups/${id}`);
      return res.data;
    }
  },

  async create(groupData) {
    if (appConfig.useMockData) {
      const newGroup = {
        id: `grp-${Date.now()}`,
        members: groupData.members || [],
        ...groupData
      };
      groupsStore.unshift(newGroup);
      return simulateDelay(newGroup);
    } else {
      const res = await apiClient.post('/groups', groupData);
      return res.data;
    }
  },

  async update(id, groupData) {
    if (appConfig.useMockData) {
      const index = groupsStore.findIndex((g) => g.id === id);
      if (index === -1) throw new Error('Groupe non trouvé');
      groupsStore[index] = { ...groupsStore[index], ...groupData };
      return simulateDelay(groupsStore[index]);
    } else {
      const res = await apiClient.put(`/groups/${id}`, groupData);
      return res.data;
    }
  },

  async delete(id) {
    if (appConfig.useMockData) {
      groupsStore = groupsStore.filter((g) => g.id !== id);
      return simulateDelay({ success: true, id });
    } else {
      const res = await apiClient.delete(`/groups/${id}`);
      return res.data;
    }
  }
};
