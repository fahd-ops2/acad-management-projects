import { appConfig } from '../config/appConfig';
import apiClient from '../api/apiClient';
import { mockSubjects } from '../mock/subjects';

const simulateDelay = (data, ms = appConfig.mockDelayMs) => {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
};

let subjectsStore = JSON.parse(JSON.stringify(mockSubjects));

export const subjectService = {
  async getAll() {
    if (appConfig.useMockData) {
      return simulateDelay([...subjectsStore]);
    } else {
      const res = await apiClient.get('/subjects');
      return res.data;
    }
  },

  async getById(id) {
    if (appConfig.useMockData) {
      const subject = subjectsStore.find((s) => s.id === id);
      if (!subject) throw new Error('Sujet non trouvé');
      return simulateDelay({ ...subject });
    } else {
      const res = await apiClient.get(`/subjects/${id}`);
      return res.data;
    }
  },

  async create(subjectData) {
    if (appConfig.useMockData) {
      const newSubject = {
        id: `sbj-${Date.now()}`,
        status: 'PROPOSE',
        dateCreated: new Date().toISOString().substring(0, 10),
        assignedGroupId: null,
        assignedGroupTitle: null,
        assignedSupervisorId: null,
        ...subjectData
      };
      subjectsStore.unshift(newSubject);
      return simulateDelay(newSubject);
    } else {
      const res = await apiClient.post('/subjects', subjectData);
      return res.data;
    }
  },

  async update(id, subjectData) {
    if (appConfig.useMockData) {
      const index = subjectsStore.findIndex((s) => s.id === id);
      if (index === -1) throw new Error('Sujet non trouvé');
      subjectsStore[index] = { ...subjectsStore[index], ...subjectData };
      return simulateDelay(subjectsStore[index]);
    } else {
      const res = await apiClient.put(`/subjects/${id}`, subjectData);
      return res.data;
    }
  },

  async delete(id) {
    if (appConfig.useMockData) {
      subjectsStore = subjectsStore.filter((s) => s.id !== id);
      return simulateDelay({ success: true, id });
    } else {
      const res = await apiClient.delete(`/subjects/${id}`);
      return res.data;
    }
  },

  async assignGroupAndSupervisor(subjectId, groupId, groupTitle, supervisorId, supervisorName) {
    if (appConfig.useMockData) {
      const index = subjectsStore.findIndex((s) => s.id === subjectId);
      if (index === -1) throw new Error('Sujet non trouvé');
      subjectsStore[index] = {
        ...subjectsStore[index],
        assignedGroupId: groupId,
        assignedGroupTitle: groupTitle,
        assignedSupervisorId: supervisorId,
        assignedSupervisorName: supervisorName,
        status: 'AFFECTE'
      };
      return simulateDelay(subjectsStore[index]);
    } else {
      const res = await apiClient.post(`/subjects/${subjectId}/assign`, { groupId, supervisorId });
      return res.data;
    }
  }
};
