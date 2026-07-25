import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Divider,
  Chip,
  Avatar
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../contexts/RoleContext';
import { useNavigate } from 'react-router-dom';
import { ROLES, ROLE_LABELS } from '../constants';

export const Login = () => {
  const { login } = useAuth();
  const { switchRole } = useRole();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@academix.edu');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      switchRole(user.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Échec de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (targetEmail, role) => {
    setEmail(targetEmail);
    setPassword('password123');
    setLoading(true);
    setError('');
    try {
      const user = await login(targetEmail, 'password123');
      switchRole(role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 4
      }}
    >
      <Container maxWidth="xs">
        <Card sx={{ p: 2, borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
                <SchoolIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" fontWeight={800} color="primary" textAlign="center">
                Academix PFA / PFE
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Portail de Gestion des Projets Académiques
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Adresse Email Académique"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: 700 }}
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
            </form>

            <Divider sx={{ my: 3 }}>
              <Chip label="Accès Rapide Démo" size="small" />
            </Divider>

            <Typography variant="caption" color="text.secondary" display="block" textAlign="center" sx={{ mb: 1.5 }}>
              Sélectionnez un profil pour vous connecter instantanément :
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => handleQuickLogin('admin@academix.edu', ROLES.ADMIN)}
              >
                Connecter en tant qu'Administrateur
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => handleQuickLogin('responsable@academix.edu', ROLES.RESPONSABLE)}
              >
                Connecter en tant que Responsable
              </Button>
              <Button
                variant="outlined"
                color="info"
                size="small"
                onClick={() => handleQuickLogin('encadrant@academix.edu', ROLES.ENCADRANT)}
              >
                Connecter en tant qu'Encadrant
              </Button>
              <Button
                variant="outlined"
                color="success"
                size="small"
                onClick={() => handleQuickLogin('etudiant@academix.edu', ROLES.ETUDIANT)}
              >
                Connecter en tant qu'Étudiant
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
