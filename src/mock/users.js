import { ROLES } from '../constants';

export const mockUsers = [
  // Admin
  {
    id: 'usr-1',
    firstName: 'Karim',
    lastName: 'El Amrani',
    email: 'admin@academix.edu',
    role: ROLES.ADMIN,
    avatar: '',
    department: 'Direction Informatique',
    phone: '+212 661 000 001'
  },
  // Responsables Pédagogiques
  {
    id: 'usr-2',
    firstName: 'Pr. Amina',
    lastName: 'Bennani',
    email: 'responsable@academix.edu',
    role: ROLES.RESPONSABLE,
    avatar: '',
    department: 'Génie Informatique & IA',
    phone: '+212 661 000 002'
  },
  {
    id: 'usr-3',
    firstName: 'Pr. Hassan',
    lastName: 'Mansouri',
    email: 'h.mansouri@academix.edu',
    role: ROLES.RESPONSABLE,
    avatar: '',
    department: 'Génie Réseaux & Télécoms',
    phone: '+212 661 000 003'
  },
  // Encadrants
  {
    id: 'usr-4',
    firstName: 'Dr. Youssef',
    lastName: 'Alami',
    email: 'encadrant@academix.edu',
    role: ROLES.ENCADRANT,
    avatar: '',
    department: 'Génie Informatique',
    specialty: 'Cloud Computing & Microservices',
    phone: '+212 661 111 222'
  },
  {
    id: 'usr-5',
    firstName: 'Dr. Salma',
    lastName: 'Tazi',
    email: 's.tazi@academix.edu',
    role: ROLES.ENCADRANT,
    avatar: '',
    department: 'Génie Informatique',
    specialty: 'IA & Computer Vision',
    phone: '+212 661 333 444'
  },
  {
    id: 'usr-6',
    firstName: 'Dr. Omar',
    lastName: 'Chraibi',
    email: 'o.chraibi@academix.edu',
    role: ROLES.ENCADRANT,
    avatar: '',
    department: 'Sécurité Systèmes',
    specialty: 'Cybersécurité & Blockchain',
    phone: '+212 661 555 666'
  },
  // Étudiants - Groupe 1 (PFE AI Health)
  {
    id: 'usr-7',
    firstName: 'Mehdi',
    lastName: 'Bakkali',
    email: 'etudiant@academix.edu',
    role: ROLES.ETUDIANT,
    avatar: '',
    groupId: 'grp-1',
    cne: 'G134098221',
    filiere: 'PFE - Génie Logiciel'
  },
  {
    id: 'usr-8',
    firstName: 'Kenza',
    lastName: 'Fassi',
    email: 'k.fassi@academix.edu',
    role: ROLES.ETUDIANT,
    avatar: '',
    groupId: 'grp-1',
    cne: 'G134098222',
    filiere: 'PFE - Génie Logiciel'
  },
  // Étudiants - Groupe 2 (PFA Smart Agriculture)
  {
    id: 'usr-9',
    firstName: 'Walid',
    lastName: 'Naciri',
    email: 'w.naciri@academix.edu',
    role: ROLES.ETUDIANT,
    avatar: '',
    groupId: 'grp-2',
    cne: 'G134098223',
    filiere: 'PFA - Big Data'
  },
  {
    id: 'usr-10',
    firstName: 'Hajar',
    lastName: 'Slaoui',
    email: 'h.slaoui@academix.edu',
    role: ROLES.ETUDIANT,
    avatar: '',
    groupId: 'grp-2',
    cne: 'G134098224',
    filiere: 'PFA - Big Data'
  },
  // Étudiants - Groupe 3 (PFE Blockchain Logistics)
  {
    id: 'usr-11',
    firstName: 'Hamza',
    lastName: 'Idrissi',
    email: 'h.idrissi@academix.edu',
    role: ROLES.ETUDIANT,
    avatar: '',
    groupId: 'grp-3',
    cne: 'G134098225',
    filiere: 'PFE - Réseaux & Sécurité'
  },
  {
    id: 'usr-12',
    firstName: 'Laila',
    lastName: 'Ouazzani',
    email: 'l.ouazzani@academix.edu',
    role: ROLES.ETUDIANT,
    avatar: '',
    groupId: 'grp-3',
    cne: 'G134098226',
    filiere: 'PFE - Réseaux & Sécurité'
  },
  // Étudiants - Groupe 4 (Mini-Projet E-Learning)
  {
    id: 'usr-13',
    firstName: 'Sami',
    lastName: 'Kabbaj',
    email: 's.kabbaj@academix.edu',
    role: ROLES.ETUDIANT,
    avatar: '',
    groupId: 'grp-4',
    cne: 'G134098227',
    filiere: 'PFA - Web Dev'
  },
  {
    id: 'usr-14',
    firstName: 'Yasmina',
    lastName: 'Berrada',
    email: 'y.berrada@academix.edu',
    role: ROLES.ETUDIANT,
    avatar: '',
    groupId: 'grp-4',
    cne: 'G134098228',
    filiere: 'PFA - Web Dev'
  }
];
