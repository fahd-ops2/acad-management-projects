export const mockNotifications = [
  {
    id: 'notif-1',
    userId: 'usr-7', // Mehdi Bakkali
    title: 'Nouveau commentaire d\'encadrement',
    message: 'Dr. Youssef Alami a ajouté un commentaire sur votre Cahier des charges.',
    type: 'comment',
    read: false,
    createdAt: '2026-02-07 15:30',
    link: '/projets/prj-1'
  },
  {
    id: 'notif-2',
    userId: 'usr-4', // Dr. Youssef Alami
    title: 'Nouveau livrable soumis',
    message: 'Le groupe Alpha a déposé le Rapport Intermédiaire.',
    type: 'deliverable',
    read: true,
    createdAt: '2026-03-25 18:45',
    link: '/livrables'
  },
  {
    id: 'notif-3',
    userId: 'usr-9', // Walid Naciri
    title: 'Rappel d\'échéance imminente',
    message: 'N\'oubliez pas de soumettre la présentation finale avant le 20 Mai.',
    type: 'deadline',
    read: false,
    createdAt: '2026-04-15 08:00',
    link: '/echeances'
  },
  {
    id: 'notif-4',
    userId: 'usr-2', // Pr. Amina Bennani
    title: 'Demande de validation de projet',
    message: 'Le projet PFA-2026-002 requiert votre relecture pour clôture.',
    type: 'project',
    read: false,
    createdAt: '2026-04-18 17:05',
    link: '/projets/prj-2'
  }
];
