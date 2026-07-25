import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  IconButton,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';
import GradeIcon from '@mui/icons-material/Grade';
import RoomIcon from '@mui/icons-material/Room';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { Breadcrumb } from '../components/Breadcrumb';
import { FormDialog } from '../components/FormDialog';
import { Loading } from '../components/Loading';
import { soutenanceService } from '../services/soutenanceService';
import { projectService } from '../services/projectService';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../contexts/RoleContext';
import { ROLES } from '../constants';

export const SoutenancesPage = () => {
  const { user } = useAuth();
  const { activeRole } = useRole();

  const [defenses, setDefenses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Schedule Defense Dialog
  const [openCreate, setOpenCreate] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [date, setDate] = useState('2026-06-20');
  const [time, setTime] = useState('10:00 - 11:30');
  const [room, setRoom] = useState('Amphi A - Génie Informatique');

  // Grade Entry Dialog
  const [openGradeDialog, setOpenGradeDialog] = useState(false);
  const [selectedDefense, setSelectedDefense] = useState(null);
  const [grade, setGrade] = useState('16.0');
  const [mention, setMention] = useState('Très Bien');
  const [gradeNotes, setGradeNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const dData = await soutenanceService.getAll();
      setDefenses(dData);

      const pData = await projectService.getAll('ADMIN');
      setProjects(pData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!projectId) return;

    const prj = projects.find((p) => p.id === projectId);

    try {
      await soutenanceService.create({
        projectId,
        projectTitle: prj.title,
        groupName: prj.groupName,
        date,
        time,
        room,
        jury: [
          { name: 'Pr. Amina Bennani', role: 'Présidente du Jury' },
          { name: 'Dr. Youssef Alami', role: 'Rapporteur' },
          { name: prj.supervisorName || 'Dr. Salma Tazi', role: 'Encadrant' }
        ]
      });
      setOpenCreate(false);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDefense) return;

    try {
      await soutenanceService.setGrade(
        selectedDefense.id,
        parseFloat(grade),
        mention,
        gradeNotes
      );
      setOpenGradeDialog(false);
      setSelectedDefense(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loading message="Chargement des planning de soutenances..." />;

  return (
    <Box>
      <Breadcrumb items={[{ label: 'Soutenances & Jurys' }]} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Planning & Notes de Soutenances
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Programmation des passages devant jury, attribution des salles et saisie des notes
          </Typography>
        </Box>

        {(activeRole === ROLES.ADMIN || activeRole === ROLES.RESPONSABLE) && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>
            Planifier une Soutenance
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {defenses.map((def) => (
          <Grid item xs={12} md={6} key={def.id}>
            <Card sx={{ height: '100%', borderRadius: 3, position: 'relative' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Chip
                    label={def.status === 'TERMINEE' ? 'Soutenance passée' : 'Soutenance planifiée'}
                    color={def.status === 'TERMINEE' ? 'success' : 'info'}
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                  {def.grade !== null && (
                    <Chip
                      label={`Note : ${def.grade}/20 (${def.mention})`}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 800 }}
                    />
                  )}
                </Box>

                <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                  {def.projectTitle}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Groupe : <strong>{def.groupName}</strong>
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventIcon fontSize="small" color="action" />
                    <Typography variant="body2" fontWeight={600}>
                      Date : {def.date}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon fontSize="small" color="action" />
                    <Typography variant="body2">Horaires : {def.time}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RoomIcon fontSize="small" color="action" />
                    <Typography variant="body2">Lieu / Salle : {def.room}</Typography>
                  </Box>
                </Box>

                <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
                  Composition du Jury :
                </Typography>
                <List size="small" disablePadding sx={{ mb: 2 }}>
                  {def.jury?.map((j, idx) => (
                    <ListItem key={idx} disablePadding sx={{ py: 0.25 }}>
                      <ListItemText
                        primary={`• ${j.name} (${j.role})`}
                        primaryTypographyProps={{ fontSize: '0.85rem' }}
                      />
                    </ListItem>
                  ))}
                </List>

                {def.notes && (
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ fontStyle: 'italic', mt: 1 }}>
                    Remarques : "{def.notes}"
                  </Typography>
                )}
              </CardContent>

              {(activeRole === ROLES.ADMIN || activeRole === ROLES.RESPONSABLE || activeRole === ROLES.ENCADRANT) && (
                <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<GradeIcon />}
                    onClick={() => {
                      setSelectedDefense(def);
                      setGrade(def.grade || '16.0');
                      setMention(def.mention || 'Très Bien');
                      setOpenGradeDialog(true);
                    }}
                  >
                    Saisir / Modifier la note
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Schedule Dialog */}
      <FormDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Planifier une nouvelle soutenance"
        onSubmit={handleCreateSubmit}
        submitText="Enregistrer la soutenance"
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              required
              label="Projet Académique concerné"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              {projects.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.title} ({p.groupName})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Date" fullWidth required type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Créneau Horaire" fullWidth required value={time} onChange={(e) => setTime(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Salle / Lieu de la soutenance" fullWidth required value={room} onChange={(e) => setRoom(e.target.value)} />
          </Grid>
        </Grid>
      </FormDialog>

      {/* Grade Dialog */}
      <FormDialog
        open={openGradeDialog}
        onClose={() => setOpenGradeDialog(false)}
        title={`Attribuer la note de soutenance : ${selectedDefense?.projectTitle}`}
        onSubmit={handleGradeSubmit}
        submitText="Enregistrer la Note"
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Note sur 20"
              fullWidth
              required
              type="number"
              inputProps={{ min: 0, max: 20, step: 0.25 }}
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Mention attribuée"
              value={mention}
              onChange={(e) => setMention(e.target.value)}
            >
              <MenuItem value="Très Bien">Très Bien (16 - 20)</MenuItem>
              <MenuItem value="Bien">Bien (14 - 15.9)</MenuItem>
              <MenuItem value="Assez Bien">Assez Bien (12 - 13.9)</MenuItem>
              <MenuItem value="Passable">Passable (10 - 11.9)</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Appréciations du Jury"
              fullWidth
              multiline
              rows={3}
              value={gradeNotes}
              onChange={(e) => setGradeNotes(e.target.value)}
            />
          </Grid>
        </Grid>
      </FormDialog>
    </Box>
  );
};
