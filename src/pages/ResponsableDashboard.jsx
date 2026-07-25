import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  Paper,
  Button
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentCheckIcon from '@mui/icons-material/AssignmentTurnedIn';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { DashboardCard } from '../components/DashboardCard';
import { Loading } from '../components/Loading';
import { dashboardService } from '../services/dashboardService';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const ResponsableDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardService.getResponsableStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Chargement des statistiques pédagogiques..." />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="text.primary">
            Tableau de Bord Responsable Pédagogique
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Suivi global des promotions, encadrements et taux de dépôt des livrables
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => navigate('/soutenances')}>
          Planning Soutenances
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="GROUPES SUIVIS"
            value={stats.totalGroups}
            subtitle="Équipes d'étudiants activement encadrées"
            icon={<GroupsIcon />}
            iconBg="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="TAUX DE DÉPÔT"
            value={`${stats.submissionRate}%`}
            subtitle="Livrables validés par l'encadrement"
            icon={<AssignmentCheckIcon />}
            iconBg="success.main"
            progress={stats.submissionRate}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="SOUTENANCES À VENIR"
            value={stats.upcomingDefensesCount}
            subtitle="Sessions planifiées ce semestre"
            icon={<EventIcon />}
            iconBg="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="PROJETS CLÔTURÉS"
            value={stats.closedProjectsCount}
            subtitle="Projets avec note attribuée"
            icon={<CheckCircleIcon />}
            iconBg="secondary.main"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Nombre de Projets Encadrés par Enseignant (Charge d'encadrement)
        </Typography>
        <Box sx={{ height: 320, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.projectsBySupervisor}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <RechartsTooltip />
              <Bar dataKey="count" fill="#1e40af" name="Nombre de projets" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
};
