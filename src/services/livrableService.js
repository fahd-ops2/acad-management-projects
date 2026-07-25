import { appConfig } from '../config/appConfig';
import apiClient from '../api/apiClient';
import { mockDeliverables } from '../mock/deliverables';
import { DELIVERABLE_STATUS } from '../constants';

const simulateDelay = (data, ms = appConfig.mockDelayMs) => {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
};

let deliverablesStore = JSON.parse(JSON.stringify(mockDeliverables));

export const livrableService = {
  async getAll(projectId) {
    if (appConfig.useMockData) {
      let filtered = [...deliverablesStore];
      if (projectId) {
        filtered = filtered.filter((d) => d.projectId === projectId);
      }
      return simulateDelay(filtered);
    } else {
      const res = await apiClient.get('/deliverables', { params: { projectId } });
      return res.data;
    }
  },

  async getById(id) {
    if (appConfig.useMockData) {
      const item = deliverablesStore.find((d) => d.id === id);
      if (!item) throw new Error('Livrable non trouvé');
      return simulateDelay({ ...item });
    } else {
      const res = await apiClient.get(`/deliverables/${id}`);
      return res.data;
    }
  },

  async create(deliverableData) {
    if (appConfig.useMockData) {
      const newDeliverable = {
        id: `del-${Date.now()}`,
        status: DELIVERABLE_STATUS.EN_ATTENTE,
        ...deliverableData
      };
      deliverablesStore.unshift(newDeliverable);
      return simulateDelay(newDeliverable);
    } else {
      const res = await apiClient.post('/deliverables', deliverableData);
      return res.data;
    }
  },

  async update(id, deliverableData) {
    if (appConfig.useMockData) {
      const index = deliverablesStore.findIndex((d) => d.id === id);
      if (index === -1) throw new Error('Livrable non trouvé');
      deliverablesStore[index] = { ...deliverablesStore[index], ...deliverableData };
      return simulateDelay(deliverablesStore[index]);
    } else {
      const res = await apiClient.put(`/deliverables/${id}`, deliverableData);
      return res.data;
    }
  },

  async delete(id, confirmedExplicitly = false) {
    if (appConfig.useMockData) {
      const item = deliverablesStore.find((d) => d.id === id);
      if (item && item.status === DELIVERABLE_STATUS.VALIDE && !confirmedExplicitly) {
        throw new Error('Un livrable validé ne peut pas être supprimé sans une autorisation de confirmation renforcée.');
      }
      deliverablesStore = deliverablesStore.filter((d) => d.id !== id);
      return simulateDelay({ success: true, id });
    } else {
      const res = await apiClient.delete(`/deliverables/${id}`, { data: { confirmedExplicitly } });
      return res.data;
    }
  },

  async validate(id, validatorName, remarks) {
    if (appConfig.useMockData) {
      const index = deliverablesStore.findIndex((d) => d.id === id);
      if (index === -1) throw new Error('Livrable non trouvé');
      deliverablesStore[index] = {
        ...deliverablesStore[index],
        status: DELIVERABLE_STATUS.VALIDE,
        validatedBy: validatorName,
        validatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        comments: remarks || 'Livrable validé avec succès.'
      };
      return simulateDelay(deliverablesStore[index]);
    } else {
      const res = await apiClient.post(`/deliverables/${id}/validate`, { validatorName, remarks });
      return res.data;
    }
  },

  async reject(id, validatorName, remarks) {
    if (appConfig.useMockData) {
      const index = deliverablesStore.findIndex((d) => d.id === id);
      if (index === -1) throw new Error('Livrable non trouvé');
      deliverablesStore[index] = {
        ...deliverablesStore[index],
        status: DELIVERABLE_STATUS.REFUSE,
        validatedBy: validatorName,
        validatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        comments: remarks || 'Livrable refusé. Merci de consulter les remarques et redéposer.'
      };
      return simulateDelay(deliverablesStore[index]);
    } else {
      const res = await apiClient.post(`/deliverables/${id}/reject`, { validatorName, remarks });
      return res.data;
    }
  },

  async uploadSimulated(deliverableId, fileObj, submitterName) {
    if (appConfig.useMockData) {
      const index = deliverablesStore.findIndex((d) => d.id === deliverableId);
      if (index === -1) throw new Error('Livrable non trouvé');
      
      const fileName = fileObj ? fileObj.name : 'Document_Soumis.pdf';
      const fileSize = fileObj ? `${(fileObj.size / (1024 * 1024)).toFixed(1)} MB` : '3.5 MB';

      deliverablesStore[index] = {
        ...deliverablesStore[index],
        fileName,
        fileSize,
        fileUrl: '#',
        submittedBy: submitterName || 'Étudiant',
        submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: DELIVERABLE_STATUS.EN_ATTENTE,
        comments: 'Nouveau dépôt effectué.'
      };
      return simulateDelay(deliverablesStore[index]);
    } else {
      const formData = new FormData();
      formData.append('file', fileObj);
      formData.append('submitterName', submitterName);
      const res = await apiClient.post(`/deliverables/${deliverableId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    }
  }
};
