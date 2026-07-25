import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { DashboardCard } from '../components/DashboardCard';
import { StatusBadge } from '../components/StatusBadge';
import { Loading } from '../components/Loading';
import { dashboardService } from '../services/dashboardService';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const EncadrantDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, [user?.id]);

  const loadStats = async () => {
    try {
      const data = await dashboardService.getEncadrantStats(user?.id || 'usr-4');
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Chargement des projets encadrés..." />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="text.primary">
            Espace Encadrant
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Suivi des projets attribués, validation des livrables et échanges avec les étudiants
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => navigate('/livrables')}>
          Valider les Livrables
        </Button>
      </Box>

      {stats.delayedDeliverablesCount > 0 && (
        <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3, borderRadius: 2 }}>
          <strong>Attention !</strong> {stats.delayedDeliverablesCount} livrable(s) sont actuellement en retard pour vos groupes encadrés.
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="PROJETS ENCADRÉS"
            value={stats.assignedProjectsCount}
            subtitle="Équipes sous votre responsabilité"
            icon={<FolderIcon />}
            iconBg="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="LIVRABLES EN ATTENTE"
            value={stats.pendingDeliverablesCount}
            subtitle="Nouveaux dépôts à relire"
            icon={<PendingActionsIcon />}
            iconBg="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="RETARDS DÉTECTÉS"
            value={stats.delayedDeliverablesCount}
            subtitle="Échéances dépassées"
            icon={<WarningIcon />}
            iconBg="error.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Mes Projets Encadrés
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List disablePadding>
              {stats.assignedProjects.map((prj) => (
                <ListItem
                  key={prj.id}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    borderRadius: 2,
                    bgcolor: (theme) => (theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b'),
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}
                >
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {prj.title}
                    </Typography>
                    <StatusBadge status={prj.status} type="project" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Groupe : <strong>{prj.groupName}</strong> | Code : {prj.code}
                  </Typography>
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Progression : <strong>{prj.progress}%</strong>
                    </Typography>
                    <Button size="small" variant="outlined" onClick={() => navigate(`/projets/${prj.id}`)}>
                      Voir Détails
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Livrables en Attente de Révision
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats.pendingDeliverables.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Tous les livrables soumis ont été relus et validés !
                </Typography>
              </Box>
            ) : (
              <List disablePadding>
                {stats.pendingDeliverables.map((del) => (
                  <ListItem
                    key={del.id}
                    sx={{
                      p: 2,
                      mb: 1.5,
                      borderRadius: 2,
                      bgcolor: (theme) => (theme.palette.mode === 'light' ? '#fff7ed' : '#7c2d1222'),
                      border: '1px solid #f97316',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start'
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={700} color="warning.dark">
                      {del.type}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                      Fichier : {del.fileName} ({del.fileSize})
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5 }}>
                      Déposé par {del.submittedBy} le {del.submittedAt}
                    </Typography>
                    <Button
                      size="small"
                      variant="contained"
                      color="warning"
                      onClick={() => navigate('/livrables')}
                      sx={{ fontWeight: 700 }}
                    >
                      Examiner & Valider
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
