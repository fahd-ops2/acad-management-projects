import { DEADLINE_TYPES } from '../constants';

export const mockDeadlines = [
  {
    id: 'ech-1',
    title: 'Dépôt du Cahier des Charges - PFE & PFA',
    type: DEADLINE_TYPES.CAHIER_DES_CHARGES,
    dueDate: '2026-02-15',
    targetType: 'TOUS',
    description: 'Obligation de déposer le document validé par l\'encadrant.',
    status: 'DEPASSE'
  },
  {
    id: 'ech-2',
    title: 'Dépôt du Rapport Intermédiaire (Mi-parcours)',
    type: DEADLINE_TYPES.RAPPORT_INTERMEDIAIRE,
    dueDate: '2026-03-25',
    targetType: 'TOUS',
    description: 'Présentation de l\'avancement à 50% et validation des prototypes.',
    status: 'DEPASSE'
  },
  {
    id: 'ech-3',
    title: 'Dépôt des Rapports Finaux & Code Source',
    type: DEADLINE_TYPES.RAPPORT_FINAL,
    dueDate: '2026-05-20',
    targetType: 'PFE',
    description: 'Dépôt obligatoire avant transmission aux membres du jury de soutenance.',
    status: 'A_VENIR'
  },
  {
    id: 'ech-4',
    title: 'Sessions de Soutenances Principales PFE',
    type: DEADLINE_TYPES.SOUTENANCE,
    dueDate: '2026-06-15',
    targetType: 'PFE',
    description: 'Passage devant jury (Président, Rapporteur, Encadrant).',
    status: 'A_VENIR'
  }
];
