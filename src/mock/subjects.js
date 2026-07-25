import { PROJECT_TYPES } from '../constants';

export const mockSubjects = [
  {
    id: 'sbj-1',
    title: 'Plateforme IA de Détection Précoce de Pathologies Rétiniennes',
    type: PROJECT_TYPES.PFE,
    description: 'Conception et déploiement d\'un modèle Deep Learning de classification d\'images ophtalmiques intégrés dans une API Spring Boot avec interface React.',
    specialty: 'Génie Software & IA',
    technologies: ['React 19', 'Spring Boot', 'Python TensorFlow', 'Docker'],
    proposedBy: 'Pr. Amina Bennani',
    assignedGroupId: 'grp-1',
    assignedGroupTitle: 'Groupe Alpha - PFE AI Health',
    assignedSupervisorId: 'usr-4',
    status: 'AFFECTE',
    dateCreated: '2026-01-10'
  },
  {
    id: 'sbj-2',
    title: 'Système IoT & Cloud pour l\'Irrigation Intelligente',
    type: PROJECT_TYPES.PFA,
    description: 'Boîtier capteur ESP32 avec transmission MQTT, dashboard de monitoring en temps réel et algorithme prédictif d\'arrosage.',
    specialty: 'Big Data & Systèmes Embarqués',
    technologies: ['React', 'Node.js/Spring Boot', 'MQTT', 'InfluxDB', 'ESP32'],
    proposedBy: 'Dr. Salma Tazi',
    assignedGroupId: 'grp-2',
    assignedGroupTitle: 'Groupe IoT - Smart Agriculture',
    assignedSupervisorId: 'usr-5',
    status: 'AFFECTE',
    dateCreated: '2026-01-15'
  },
  {
    id: 'sbj-3',
    title: 'Plateforme de Traçabilité Logistique basée sur Smart Contracts',
    type: PROJECT_TYPES.PFE,
    description: 'Application Web3 sécurisée permettant de vérifier l\'authenticité et l\'acheminement des produits pharmaceutiques sur la chaîne logistique.',
    specialty: 'Cybersécurité & Réseaux',
    technologies: ['Solidity', 'Ethereum', 'React', 'Spring Boot', 'Web3.js'],
    proposedBy: 'Dr. Omar Chraibi',
    assignedGroupId: 'grp-3',
    assignedGroupTitle: 'Groupe Cyber - Blockchain Logistics',
    assignedSupervisorId: 'usr-6',
    status: 'AFFECTE',
    dateCreated: '2026-01-20'
  },
  {
    id: 'sbj-4',
    title: 'Plateforme E-Learning Microservices avec Recommandation',
    type: PROJECT_TYPES.PFA,
    description: 'Architecture microservices Spring Cloud avec Gateway, Service Discovery Eureka et module de cours interactifs.',
    specialty: 'Génie Informatique',
    technologies: ['Spring Cloud', 'React', 'PostgreSQL', 'Keycloak'],
    proposedBy: 'Dr. Youssef Alami',
    assignedGroupId: 'grp-4',
    assignedGroupTitle: 'Groupe Dev - E-Learning Interactive',
    assignedSupervisorId: 'usr-4',
    status: 'AFFECTE',
    dateCreated: '2026-02-01'
  },
  {
    id: 'sbj-5',
    title: 'Système de Détection d\'Intrusions Réseau par Apprentissage Automatique',
    type: PROJECT_TYPES.PFE,
    description: 'Analyse en temps réel du trafic réseau et classification des paquets anormaux à l\'aide d\'Random Forest et XGBoost.',
    specialty: 'Cybersécurité & Réseaux',
    technologies: ['Python', 'Scikit-Learn', 'Spring Boot API', 'Elasticsearch'],
    proposedBy: 'Pr. Hassan Mansouri',
    assignedGroupId: null,
    assignedGroupTitle: null,
    assignedSupervisorId: 'usr-6',
    status: 'PROPOSE',
    dateCreated: '2026-02-15'
  },
  {
    id: 'sbj-6',
    title: 'Application Mobile de Gestion des Tâches Académiques avec IA Generative',
    type: PROJECT_TYPES.MINI_PROJET,
    description: 'Assistant virtuel pour la planification d\'emploi du temps et résumé automatique de polycopiés.',
    specialty: 'Génie Informatique',
    technologies: ['React Native / Flutter', 'Gemini API', 'Spring Boot'],
    proposedBy: 'Dr. Salma Tazi',
    assignedGroupId: null,
    assignedGroupTitle: null,
    assignedSupervisorId: null,
    status: 'PROPOSE',
    dateCreated: '2026-02-20'
  }
];
