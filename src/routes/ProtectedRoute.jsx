import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../contexts/RoleContext';
import { Loading } from '../components/Loading';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, loading } = useAuth();
  const { activeRole } = useRole();

  if (loading) {
    return <Loading message="Vérification de la session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(activeRole)) {
    // If current role is not in allowed list, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
