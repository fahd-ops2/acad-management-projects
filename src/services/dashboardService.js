import { appConfig } from '../config/appConfig';
import apiClient from '../api/apiClient';
import { mockProjects } from '../mock/projects';
import { mockUsers } from '../mock/users';
import { mockDeliverables } from '../mock/deliverables';
import { mockGroups } from '../mock/groups';
import { mockDefenses } from '../mock/defenses';
import { ROLES, PROJECT_STATUS, DELIVERABLE_STATUS } from '../constants';

const simulateDelay = (data, ms = appConfig.mockDelayMs) => {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
};

export const dashboardService = {
  async getAdminStats() {
    if (appConfig.useMockData) {
      const totalProjects = mockProjects.length;
      const totalStudents = mockUsers.filter((u) => u.role === ROLES.ETUDIANT).length;
      const totalSupervisors = mockUsers.filter((u) => u.role === ROLES.ENCADRANT).length;
      const totalDeliverables = mockDeliverables.length;
      
      const completedProjects = mockProjects.filter((p) => p.status === PROJECT_STATUS.CLOTURE || p.status === PROJECT_STATUS.VALIDE).length;
      const inProgressProjects = mockProjects.filter((p) => p.status === PROJECT_STATUS.EN_COURS || p.status === PROJECT_STATUS.EN_ATTENTE_VALIDATION).length;
      
      const statusDistribution = [
        { name: 'Proposés', value: mockProjects.filter((p) => p.status === PROJECT_STATUS.PROPOSE).length },
        { name: 'Affectés', value: mockProjects.filter((p) => p.status === PROJECT_STATUS.AFFECTE).length },
        { name: 'En Cours', value: inProgressProjects },
        { name: 'Validés', value: mockProjects.filter((p) => p.status === PROJECT_STATUS.VALIDE).length },
        { name: 'Clôturés', value: mockProjects.filter((p) => p.status === PROJECT_STATUS.CLOTURE).length }
      ];

      return simulateDelay({
        totalProjects,
        totalStudents,
        totalSupervisors,
        totalDeliverables,
        completedProjects,
        inProgressProjects,
        statusDistribution
      });
    } else {
      const res = await apiClient.get('/dashboard/admin');
      return res.data;
    }
  },

  async getResponsableStats() {
    if (appConfig.useMockData) {
      const totalGroups = mockGroups.length;
      const projectsBySupervisor = [
        { name: 'Dr. Youssef Alami', count: mockProjects.filter((p) => p.supervisorId === 'usr-4').length },
        { name: 'Dr. Salma Tazi', count: mockProjects.filter((p) => p.supervisorId === 'usr-5').length },
        { name: 'Dr. Omar Chraibi', count: mockProjects.filter((p) => p.supervisorId === 'usr-6').length }
      ];

      const totalDelivs = mockDeliverables.length;
      const validatedDelivs = mockDeliverables.filter((d) => d.status === DELIVERABLE_STATUS.VALIDE).length;
      const submissionRate = totalDelivs > 0 ? Math.round((validatedDelivs / totalDelivs) * 100) : 0;

      const upcomingDefensesCount = mockDefenses.filter((d) => d.status === 'PLANIFIEE').length;

      return simulateDelay({
        totalGroups,
        projectsBySupervisor,
        submissionRate,
        upcomingDefensesCount,
        closedProjectsCount: mockProjects.filter((p) => p.status === PROJECT_STATUS.CLOTURE).length
      });
    } else {
      const res = await apiClient.get('/dashboard/responsable');
      return res.data;
    }
  },

  async getEncadrantStats(supervisorId = 'usr-4') {
    if (appConfig.useMockData) {
      const assignedProjects = mockProjects.filter((p) => p.supervisorId === supervisorId);
      const assignedProjectIds = assignedProjects.map((p) => p.id);

      const pendingDeliverables = mockDeliverables.filter(
        (d) => assignedProjectIds.includes(d.projectId) && d.status === DELIVERABLE_STATUS.EN_ATTENTE && d.fileName
      );

      const today = new Date().toISOString().substring(0, 10);
      const delayedDeliverables = mockDeliverables.filter(
        (d) => assignedProjectIds.includes(d.projectId) && d.dueDate < today && d.status !== DELIVERABLE_STATUS.VALIDE
      );

      return simulateDelay({
        assignedProjectsCount: assignedProjects.length,
        assignedProjects,
        pendingDeliverablesCount: pendingDeliverables.length,
        pendingDeliverables,
        delayedDeliverablesCount: delayedDeliverables.length,
        delayedDeliverables
      });
    } else {
      const res = await apiClient.get(`/dashboard/encadrant/${supervisorId}`);
      return res.data;
    }
  },

  async getEtudiantStats(studentUserId = 'usr-7', groupId = 'grp-1') {
    if (appConfig.useMockData) {
      const myProject = mockProjects.find((p) => p.groupId === groupId || p.students.some((s) => s.id === studentUserId));
      const myDeliverables = myProject ? mockDeliverables.filter((d) => d.projectId === myProject.id) : [];

      const validatedCount = myDeliverables.filter((d) => d.status === DELIVERABLE_STATUS.VALIDE).length;
      const pendingCount = myDeliverables.filter((d) => d.status === DELIVERABLE_STATUS.EN_ATTENTE).length;

      return simulateDelay({
        project: myProject,
        deliverables: myDeliverables,
        validatedCount,
        pendingCount,
        progress: myProject ? myProject.progress : 0
      });
    } else {
      const res = await apiClient.get(`/dashboard/etudiant/${studentUserId}`);
      return res.data;
    }
  }
};
