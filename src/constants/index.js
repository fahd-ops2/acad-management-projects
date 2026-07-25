export const ROLES = {
  ADMIN: 'ADMIN',
  RESPONSABLE: 'RESPONSABLE',
  ENCADRANT: 'ENCADRANT',
  ETUDIANT: 'ETUDIANT'
};

export const ROLE_LABELS = {
  ADMIN: 'Administrateur',
  RESPONSABLE: 'Responsable Pédagogique',
  ENCADRANT: 'Encadrant',
  ETUDIANT: 'Étudiant'
};

export const PROJECT_STATUS = {
  PROPOSE: 'PROPOSE',
  AFFECTE: 'AFFECTE',
  EN_COURS: 'EN_COURS',
  EN_ATTENTE_VALIDATION: 'EN_ATTENTE_VALIDATION',
  VALIDE: 'VALIDE',
  CLOTURE: 'CLOTURE'
};

export const PROJECT_STATUS_DETAILS = {
  PROPOSE: { label: 'Proposé', color: 'info', description: 'Sujet créé, en attente d\'affectation' },
  AFFECTE: { label: 'Affecté', color: 'secondary', description: 'Groupe & encadrant attribués' },
  EN_COURS: { label: 'En cours', color: 'warning', description: 'Développement et rédaction en cours' },
  EN_ATTENTE_VALIDATION: { label: 'En attente de validation', color: 'primary', description: 'Rapport final soumis, révision encadrant' },
  VALIDE: { label: 'Validé', color: 'success', description: 'Projet validé par l\'encadrant, prêt pour soutenance' },
  CLOTURE: { label: 'Clôturé', color: 'default', description: 'Soutenance passée et note attribuée' }
};

export const PROJECT_TYPES = {
  PFA: 'PFA (Projet de Fin d\'Année)',
  PFE: 'PFE (Projet de Fin d\'Études)',
  MINI_PROJET: 'Mini-Projet Académique'
};

export const DELIVERABLE_TYPES = {
  CAHIER_DES_CHARGES: 'Cahier des charges',
  RAPPORT_INTERMEDIAIRE: 'Rapport intermédiaire',
  RAPPORT_FINAL: 'Rapport final',
  PRESENTATION: 'Présentation / Slides',
  CODE_SOURCE: 'Code source & Archive'
};

export const DELIVERABLE_STATUS = {
  EN_ATTENTE: 'EN_ATTENTE',
  VALIDE: 'VALIDE',
  REFUSE: 'REFUSE',
  EN_RETARD: 'EN_RETARD'
};

export const DELIVERABLE_STATUS_DETAILS = {
  EN_ATTENTE: { label: 'En attente', color: 'warning' },
  VALIDE: { label: 'Validé', color: 'success' },
  REFUSE: { label: 'Refusé', color: 'error' },
  EN_RETARD: { label: 'En retard', color: 'error' }
};

export const DEADLINE_TYPES = {
  CAHIER_DES_CHARGES: 'Dépôt Cahier des charges',
  RAPPORT_INTERMEDIAIRE: 'Dépôt Rapport intermédiaire',
  RAPPORT_FINAL: 'Dépôt Rapport final',
  SOUTENANCE: 'Session de Soutenance'
};
