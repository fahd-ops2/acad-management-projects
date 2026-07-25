import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Grid,
  TextField,
  MenuItem,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import WarningIcon from '@mui/icons-material/Warning';
import DeleteIcon from '@mui/icons-material/Delete';
import { Breadcrumb } from '../components/Breadcrumb';
import { TimelineEcheances } from '../components/TimelineEcheances';
import { FormDialog } from '../components/FormDialog';
import { Loading } from '../components/Loading';
import { echeanceService } from '../services/echeanceService';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../contexts/RoleContext';
import { DEADLINE_TYPES, ROLES } from '../constants';

export const EcheancesPage = () => {
  const { user } = useAuth();
  const { activeRole } = useRole();

  const [deadlines, setDeadlines] = useState([]);
  const [delayInfo, setDelayInfo] = useState({ count: 0, items: [] });
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState(DEADLINE_TYPES.CAHIER_DES_CHARGES);
  const [dueDate, setDueDate] = useState('2026-05-30');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await echeanceService.getAll();
      setDeadlines(data);

      const delays = await echeanceService.detectDelays();
      setDelayInfo(delays);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await echeanceService.create({
        title,
        type,
        dueDate,
        description,
        targetType: 'TOUS'
      });
      setOpenCreate(false);
      setTitle('');
      setDescription('');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette échéance ?')) {
      await echeanceService.delete(id);
      loadData();
    }
  };

  if (loading) return <Loading message="Chargement du calendrier des échéances..." />;

  return (
    <Box>
      <Breadcrumb items={[{ label: 'Échéances & Calendrier' }]} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Calendrier & Échéancier Académique
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dates limites de dépôt, jalons du projet et détection automatique des retards
          </Typography>
        </Box>

        {(activeRole === ROLES.ADMIN || activeRole === ROLES.RESPONSABLE) && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>
            Ajouter une Échéance
          </Button>
        )}
      </Box>

      {delayInfo.count > 0 && (
        <Alert severity="error" icon={<WarningIcon />} sx={{ mb: 4, borderRadius: 2 }}>
          <strong>Signalement de retard automatique :</strong> {delayInfo.count} livrable(s) ont dépassé la date limite sans validation par l'encadrant.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
              Chronologie des Jalons Académiques
            </Typography>
            <TimelineEcheances echeances={deadlines} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Liste des Échéances Configuées
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {deadlines.map((d) => (
                <Paper
                  key={d.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: (theme) => (theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b'),
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {d.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Date : <strong>{d.dueDate}</strong>
                    </Typography>
                  </Box>
                  {(activeRole === ROLES.ADMIN || activeRole === ROLES.RESPONSABLE) && (
                    <IconButton size="small" color="error" onClick={() => handleDelete(d.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Paper>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <FormDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Créer une nouvelle échéance académique"
        onSubmit={handleCreateSubmit}
        submitText="Ajouter l'échéance"
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Titre de l'Échéance" fullWidth required value={title} onChange={(e) => setTitle(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Type de Dépôt" value={type} onChange={(e) => setType(e.target.value)}>
              {Object.values(DEADLINE_TYPES).map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Date Limite" fullWidth required type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Consignes / Description"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
        </Grid>
      </FormDialog>
    </Box>
  );
};
