import { appConfig } from '../config/appConfig';
import apiClient from '../api/apiClient';
import { mockProjects } from '../mock/projects';

const simulateDelay = (data, ms = appConfig.mockDelayMs) => {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
};

let projectsStore = JSON.parse(JSON.stringify(mockProjects));

export const projectService = {
  async getAll(role, userId, groupId) {
    if (appConfig.useMockData) {
      let filtered = [...projectsStore];
      if (role === 'ETUDIANT') {
        filtered = filtered.filter((p) => p.groupId === groupId || p.students.some((s) => s.id === userId));
      } else if (role === 'ENCADRANT') {
        filtered = filtered.filter((p) => p.supervisorId === userId);
      }
      return simulateDelay(filtered);
    } else {
      const res = await apiClient.get('/projects', { params: { role, userId, groupId } });
      return res.data;
    }
  },

  async getById(id) {
    if (appConfig.useMockData) {
      const project = projectsStore.find((p) => p.id === id);
      if (!project) throw new Error('Projet introuvable');
      return simulateDelay({ ...project });
    } else {
      const res = await apiClient.get(`/projects/${id}`);
      return res.data;
    }
  },

  async create(projectData) {
    if (appConfig.useMockData) {
      const newProject = {
        id: `prj-${Date.now()}`,
        code: `PRJ-2026-${Math.floor(100 + Math.random() * 900)}`,
        progress: 0,
        academicYear: '2025-2026',
        students: [],
        historique: [
          {
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            author: projectData.author || 'Administrateur',
            action: 'Création du projet',
            status: projectData.status || 'PROPOSE'
          }
        ],
        ...projectData
      };
      projectsStore.unshift(newProject);
      return simulateDelay(newProject);
    } else {
      const res = await apiClient.post('/projects', projectData);
      return res.data;
    }
  },

  async update(id, projectData) {
    if (appConfig.useMockData) {
      const index = projectsStore.findIndex((p) => p.id === id);
      if (index === -1) throw new Error('Projet non trouvé');
      projectsStore[index] = { ...projectsStore[index], ...projectData };
      return simulateDelay(projectsStore[index]);
    } else {
      const res = await apiClient.put(`/projects/${id}`, projectData);
      return res.data;
    }
  },

  async delete(id) {
    if (appConfig.useMockData) {
      projectsStore = projectsStore.filter((p) => p.id !== id);
      return simulateDelay({ success: true, id });
    } else {
      const res = await apiClient.delete(`/projects/${id}`);
      return res.data;
    }
  },

  async changeStatus(id, newStatus, authorName = 'Système', actionComment = '') {
    if (appConfig.useMockData) {
      const index = projectsStore.findIndex((p) => p.id === id);
      if (index === -1) throw new Error('Projet introuvable');

      const currentProject = projectsStore[index];
      const logEntry = {
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        author: authorName,
        action: actionComment || `Changement de statut vers ${newStatus}`,
        status: newStatus
      };

      // Progress mapping
      let progress = currentProject.progress;
      if (newStatus === 'PROPOSE') progress = 0;
      if (newStatus === 'AFFECTE') progress = 15;
      if (newStatus === 'EN_COURS') progress = 50;
      if (newStatus === 'EN_ATTENTE_VALIDATION') progress = 90;
      if (newStatus === 'VALIDE') progress = 100;
      if (newStatus === 'CLOTURE') progress = 100;

      const updated = {
        ...currentProject,
        status: newStatus,
        progress,
        historique: [logEntry, ...(currentProject.historique || [])]
      };

      projectsStore[index] = updated;
      return simulateDelay(updated);
    } else {
      const res = await apiClient.patch(`/projects/${id}/status`, { newStatus, authorName, actionComment });
      return res.data;
    }
  }
};
