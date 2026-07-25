import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CommentIcon from '@mui/icons-material/Comment';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import { StatusBadge } from '../components/StatusBadge';
import { DashboardCard } from '../components/DashboardCard';
import { Loading } from '../components/Loading';
import { dashboardService } from '../services/dashboardService';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const EtudiantDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, [user?.id]);

  const loadStats = async () => {
    try {
      const data = await dashboardService.getEtudiantStats(user?.id || 'usr-7', user?.groupId || 'grp-1');
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Chargement de votre espace projet..." />;

  const project = stats.project;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="text.primary">
            Espace Étudiant - Mon Projet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Suivi de votre projet académique, dépôt des livrables et échange avec votre encadrant
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<UploadFileIcon />} onClick={() => navigate('/livrables')}>
          Déposer un Livrable
        </Button>
      </Box>

      {project ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Chip label={project.type} color="primary" size="small" sx={{ mb: 1, fontWeight: 700 }} />
                  <Typography variant="h5" fontWeight={800}>
                    {project.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Code projet : {project.code} | Année Académique : {project.academicYear}
                  </Typography>
                </Box>
                <StatusBadge status={project.status} type="project" size="medium" />
              </Box>

              <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                {project.description}
              </Typography>

              <Box sx={{ my: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Progression globale du projet
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={800} color="primary">
                    {project.progress}%
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={project.progress} sx={{ height: 10, borderRadius: 5 }} />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                    Encadrant Référent :
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>
                        {project.supervisorName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {project.supervisorEmail}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                    Membres du Groupe :
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {project.students.map((st) => (
                      <Typography key={st.id} variant="body2" color="text.primary">
                        • {st.name} ({st.email})
                      </Typography>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Statut de Mes Livrables Académiques
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List disablePadding>
                {stats.deliverables.map((del) => (
                  <ListItem
                    key={del.id}
                    sx={{
                      p: 2,
                      mb: 1.5,
                      borderRadius: 2,
                      bgcolor: (theme) => (theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b'),
                      border: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {del.type}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Date limite : <strong>{del.dueDate}</strong> | Fichier : {del.fileName || 'Non déposé'}
                      </Typography>
                      {del.comments && (
                        <Typography variant="caption" color="info.main" sx={{ fontStyle: 'italic', display: 'block', mt: 0.5 }}>
                          Remarque encadrant : "{del.comments}"
                        </Typography>
                      )}
                    </Box>
                    <StatusBadge status={del.status} type="deliverable" />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Synthèse des Livrables
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <DashboardCard
                    title="VALIDÉS"
                    value={stats.validatedCount}
                    icon={<FolderIcon />}
                    iconBg="success.main"
                  />
                </Grid>
                <Grid item xs={6}>
                  <DashboardCard
                    title="EN ATTENTE"
                    value={stats.pendingCount}
                    icon={<UploadFileIcon />}
                    iconBg="warning.main"
                  />
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Actions Rapides
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button variant="contained" fullWidth onClick={() => navigate(`/projets/${project.id}`)}>
                  Consulter l'Historique du Projet
                </Button>
                <Button variant="outlined" fullWidth onClick={() => navigate('/livrables')}>
                  Déposer un Nouveau Fichier
                </Button>
                <Button variant="outlined" color="info" fullWidth onClick={() => navigate('/echeances')}>
                  Voir le Calendrier des Échéances
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">Aucun projet affecté pour le moment.</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Veuillez contacter le responsable pédagogique pour l'affectation à un groupe et un projet.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
