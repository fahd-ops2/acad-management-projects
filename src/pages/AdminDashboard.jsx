import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AddIcon from '@mui/icons-material/Add';
import { DashboardCard } from '../components/DashboardCard';
import { Loading } from '../components/Loading';
import { dashboardService } from '../services/dashboardService';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#0d9488', '#f59e0b', '#10b981', '#6366f1'];

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardService.getAdminStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Calcul des métriques administrateur..." />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="text.primary">
            Tableau de Bord Administrateur
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vue d'ensemble de l'établissement et indicateurs clés PFA/PFE
          </Typography>
        </Box>
        <Button
        hidden="true"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/projets')}
          sx={{ fontWeight: 700 }}
        >
          Nouveau Projet
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="TOTAL PROJETS"
            value={stats.totalProjects}
            subtitle={`${stats.completedProjects} clôturés / validés`}
            icon={<FolderIcon />}
            iconBg="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="ÉTUDIANTS INSCRITS"
            value={stats.totalStudents}
            subtitle="Répartis en équipes PFA/PFE"
            icon={<SchoolIcon />}
            iconBg="secondary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="ENCADRANTS"
            value={stats.totalSupervisors}
            subtitle="Professeurs & tuteurs"
            icon={<PeopleIcon />}
            iconBg="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="LIVRABLES SOUMIS"
            value={stats.totalDeliverables}
            subtitle="Rapports & présentations"
            icon={<AssignmentTurnedInIcon />}
            iconBg="warning.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={14} md={7}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Distribution des Projets par Statut du Cycle de Vie
            </Typography>
            <Box sx={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {stats.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};
