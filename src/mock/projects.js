import { PROJECT_STATUS, PROJECT_TYPES } from '../constants';

export const mockProjects = [
  {
    id: 'prj-1',
    title: 'Plateforme IA de Détection Précoce de Pathologies Rétiniennes',
    code: 'PFE-2026-001',
    type: PROJECT_TYPES.PFE,
    status: PROJECT_STATUS.EN_COURS,
    progress: 65,
    academicYear: '2025-2026',
    description: 'Conception, entraînement et déploiement d\'un modèle de vision par ordinateur pour le dépistage automatique de la rétinopathie diabétique. Intégration dans une application web sécurisée.',
    subjectId: 'sbj-1',
    groupId: 'grp-1',
    groupName: 'Groupe Alpha - PFE AI Health',
    students: [
      { id: 'usr-7', name: 'Mehdi Bakkali', email: 'etudiant@academix.edu' },
      { id: 'usr-8', name: 'Kenza Fassi', email: 'k.fassi@academix.edu' }
    ],
    supervisorId: 'usr-4',
    supervisorName: 'Dr. Youssef Alami',
    supervisorEmail: 'encadrant@academix.edu',
    pedagogicalRespId: 'usr-2',
    pedagogicalRespName: 'Pr. Amina Bennani',
    startDate: '2026-01-15',
    endDate: '2026-06-30',
    historique: [
      { date: '2026-01-15 10:00', author: 'Pr. Amina Bennani', action: 'Création du sujet et validation initiale', status: PROJECT_STATUS.PROPOSE },
      { date: '2026-01-20 14:30', author: 'Pr. Amina Bennani', action: 'Affectation du Groupe Alpha et du Dr. Youssef Alami', status: PROJECT_STATUS.AFFECTE },
      { date: '2026-02-01 09:15', author: 'Dr. Youssef Alami', action: 'Validation du Cahier des Charges - Démarrage des travaux', status: PROJECT_STATUS.EN_COURS }
    ]
  },
  {
    id: 'prj-2',
    title: 'Système IoT de Surveillance Hydrique Agricole',
    code: 'PFA-2026-002',
    type: PROJECT_TYPES.PFA,
    status: PROJECT_STATUS.EN_ATTENTE_VALIDATION,
    progress: 90,
    academicYear: '2025-2026',
    description: 'Réseau de capteurs d\'humidité et température du sol connectés via LoRaWAN / MQTT, affichage sur dashboard React et contrôle d\'électrovannes.',
    subjectId: 'sbj-2',
    groupId: 'grp-2',
    groupName: 'Groupe IoT - Smart Agriculture',
    students: [
      { id: 'usr-9', name: 'Walid Naciri', email: 'w.naciri@academix.edu' },
      { id: 'usr-10', name: 'Hajar Slaoui', email: 'h.slaoui@academix.edu' }
    ],
    supervisorId: 'usr-5',
    supervisorName: 'Dr. Salma Tazi',
    supervisorEmail: 's.tazi@academix.edu',
    pedagogicalRespId: 'usr-2',
    pedagogicalRespName: 'Pr. Amina Bennani',
    startDate: '2026-02-01',
    endDate: '2026-05-30',
    historique: [
      { date: '2026-01-25 11:00', author: 'Dr. Salma Tazi', action: 'Création du sujet PFA', status: PROJECT_STATUS.PROPOSE },
      { date: '2026-02-01 10:00', author: 'Pr. Amina Bennani', action: 'Affectation au groupe Walid & Hajar', status: PROJECT_STATUS.AFFECTE },
      { date: '2026-02-10 16:00', author: 'Dr. Salma Tazi', action: 'Lancement du projet', status: PROJECT_STATUS.EN_COURS },
      { date: '2026-04-18 17:00', author: 'Walid Naciri', action: 'Dépôt du rapport final et demande de validation', status: PROJECT_STATUS.EN_ATTENTE_VALIDATION }
    ]
  },
  {
    id: 'prj-3',
    title: 'Traçabilité Logistique par Smart Contracts Ethereum',
    code: 'PFE-2026-003',
    type: PROJECT_TYPES.PFE,
    status: PROJECT_STATUS.VALIDE,
    progress: 100,
    academicYear: '2025-2026',
    description: 'Développement de Smart Contracts Solidity certifiant le respect de la chaîne du froid dans l\'acheminement de médicaments sensible.',
    subjectId: 'sbj-3',
    groupId: 'grp-3',
    groupName: 'Groupe Cyber - Blockchain Logistics',
    students: [
      { id: 'usr-11', name: 'Hamza Idrissi', email: 'h.idrissi@academix.edu' },
      { id: 'usr-12', name: 'Laila Ouazzani', email: 'l.ouazzani@academix.edu' }
    ],
    supervisorId: 'usr-6',
    supervisorName: 'Dr. Omar Chraibi',
    supervisorEmail: 'o.chraibi@academix.edu',
    pedagogicalRespId: 'usr-3',
    pedagogicalRespName: 'Pr. Hassan Mansouri',
    startDate: '2026-01-10',
    endDate: '2026-06-15',
    historique: [
      { date: '2026-01-10 09:00', author: 'Pr. Hassan Mansouri', action: 'Sujet validé', status: PROJECT_STATUS.PROPOSE },
      { date: '2026-01-15 14:00', author: 'Dr. Omar Chraibi', action: 'Affectation et cadrage technique', status: PROJECT_STATUS.AFFECTE },
      { date: '2026-01-25 10:00', author: 'Dr. Omar Chraibi', action: 'Début des sprints de dev', status: PROJECT_STATUS.EN_COURS },
      { date: '2026-04-01 11:30', author: 'Hamza Idrissi', action: 'Dépôt livrables finaux', status: PROJECT_STATUS.EN_ATTENTE_VALIDATION },
      { date: '2026-04-10 15:00', author: 'Dr. Omar Chraibi', action: 'Validation finale accordée pour soutenance', status: PROJECT_STATUS.VALIDE }
    ]
  },
  {
    id: 'prj-4',
    title: 'Plateforme E-Learning Microservices',
    code: 'PFA-2026-004',
    type: PROJECT_TYPES.PFA,
    status: PROJECT_STATUS.CLOTURE,
    progress: 100,
    academicYear: '2025-2026',
    description: 'Implémentation d\'une architecture cloud-native en microservices pour un portail de cours académiques en ligne.',
    subjectId: 'sbj-4',
    groupId: 'grp-4',
    groupName: 'Groupe Dev - E-Learning Interactive',
    students: [
      { id: 'usr-13', name: 'Sami Kabbaj', email: 's.kabbaj@academix.edu' },
      { id: 'usr-14', name: 'Yasmina Berrada', email: 'y.berrada@academix.edu' }
    ],
    supervisorId: 'usr-4',
    supervisorName: 'Dr. Youssef Alami',
    supervisorEmail: 'encadrant@academix.edu',
    pedagogicalRespId: 'usr-2',
    pedagogicalRespName: 'Pr. Amina Bennani',
    startDate: '2025-10-01',
    endDate: '2026-02-28',
    historique: [
      { date: '2025-10-01 09:00', author: 'Dr. Youssef Alami', action: 'Création et affectation', status: PROJECT_STATUS.AFFECTE },
      { date: '2025-10-15 10:00', author: 'Sami Kabbaj', action: 'Phase de réalisation', status: PROJECT_STATUS.EN_COURS },
      { date: '2026-01-20 14:00', author: 'Dr. Youssef Alami', action: 'Projet validé', status: PROJECT_STATUS.VALIDE },
      { date: '2026-02-25 16:00', author: 'Pr. Amina Bennani', action: 'Soutenance effectuée - Note: 17.5/20 - Projet Clôturé', status: PROJECT_STATUS.CLOTURE }
    ]
  },
  {
    id: 'prj-5',
    title: 'Détection d\'Intrusions Réseau par Apprentissage Automatique',
    code: 'PFE-2026-005',
    type: PROJECT_TYPES.PFE,
    status: PROJECT_STATUS.PROPOSE,
    progress: 0,
    academicYear: '2025-2026',
    description: 'Etude et implémentation de modèles d\'apprentissage supervisé pour détecter les anomalies de trafic sur des réseaux d\'entreprise.',
    subjectId: 'sbj-5',
    groupId: null,
    groupName: 'Non affecté',
    students: [],
    supervisorId: 'usr-6',
    supervisorName: 'Dr. Omar Chraibi',
    supervisorEmail: 'o.chraibi@academix.edu',
    pedagogicalRespId: 'usr-3',
    pedagogicalRespName: 'Pr. Hassan Mansouri',
    startDate: '2026-03-01',
    endDate: '2026-07-31',
    historique: [
      { date: '2026-02-15 10:00', author: 'Pr. Hassan Mansouri', action: 'Publication du sujet', status: PROJECT_STATUS.PROPOSE }
    ]
  }
];
