import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { useRole } from '../contexts/RoleContext';
import { ROLES } from '../constants';

// Dashboards
import { AdminDashboard } from '../pages/AdminDashboard';
import { ResponsableDashboard } from '../pages/ResponsableDashboard';
import { EncadrantDashboard } from '../pages/EncadrantDashboard';
import { EtudiantDashboard } from '../pages/EtudiantDashboard';

// Pages
import { ProjetsPage } from '../pages/ProjetsPage';
import { ProjetDetailPage } from '../pages/ProjetDetailPage';
import { SujetsPage } from '../pages/SujetsPage';
import { GroupesPage } from '../pages/GroupesPage';
import { LivrablesPage } from '../pages/LivrablesPage';
import { SoutenancesPage } from '../pages/SoutenancesPage';
import { UtilisateursPage } from '../pages/UtilisateursPage';
import { EcheancesPage } from '../pages/EcheancesPage';

const DynamicDashboardRoute = () => {
  const { activeRole } = useRole();

  switch (activeRole) {
    case ROLES.ADMIN:
      return <AdminDashboard />;
    case ROLES.RESPONSABLE:
      return <ResponsableDashboard />;
    case ROLES.ENCADRANT:
      return <EncadrantDashboard />;
    case ROLES.ETUDIANT:
    default:
      return <EtudiantDashboard />;
  }
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DynamicDashboardRoute />} />
          <Route path="/projets" element={<ProjetsPage />} />
          <Route path="/projets/:id" element={<ProjetDetailPage />} />
          <Route path="/sujets" element={<SujetsPage />} />
          <Route path="/groupes" element={<GroupesPage />} />
          <Route path="/livrables" element={<LivrablesPage />} />
          <Route path="/soutenances" element={<SoutenancesPage />} />
          <Route path="/echeances" element={<EcheancesPage />} />

          {/* Admin only route */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="/utilisateurs" element={<UtilisateursPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
