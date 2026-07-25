import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import { Breadcrumb } from '../components/Breadcrumb';
import { FormDialog } from '../components/FormDialog';
import { Loading } from '../components/Loading';
import { groupeService } from '../services/groupeService';
import { userService } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../contexts/RoleContext';
import { ROLES } from '../constants';

export const GroupesPage = () => {
  const { user } = useAuth();
  const { activeRole } = useRole();

  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [filiere, setFiliere] = useState('Génie Software & IA');
  const [supervisorId, setSupervisorId] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const gData = await groupeService.getAll();
      setGroups(gData);

      const uData = await userService.getAll();
      setStudents(uData.filter((u) => u.role === ROLES.ETUDIANT));
      setSupervisors(uData.filter((u) => u.role === ROLES.ENCADRANT));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    const supervisor = supervisors.find((s) => s.id === supervisorId);

    try {
      await groupeService.create({
        name: groupName,
        filiere,
        supervisorId: supervisor ? supervisor.id : null,
        supervisorName: supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : 'Non désigné',
        members: []
      });
      setOpenCreate(false);
      setGroupName('');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteGroup = async (id) => {
    if (window.confirm('Voulez-vous dissoudre ce groupe ?')) {
      await groupeService.delete(id);
      loadData();
    }
  };

  if (loading) return <Loading message="Chargement de la liste des groupes..." />;

  return (
    <Box>
      <Breadcrumb items={[{ label: 'Groupes & Équipes' }]} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Gestion des Groupes d'Étudiants
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Organisation des binômes et trinômes par filière et affectation des encadrants
          </Typography>
        </Box>

        {(activeRole === ROLES.ADMIN || activeRole === ROLES.RESPONSABLE) && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>
            Créer un Groupe
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {groups.map((grp) => (
          <Grid item xs={12} md={6} key={grp.id}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Chip label={grp.filiere} color="primary" size="small" sx={{ mb: 1, fontWeight: 700 }} />
                    <Typography variant="h6" fontWeight={800}>
                      {grp.name}
                    </Typography>
                  </Box>
                  {(activeRole === ROLES.ADMIN || activeRole === ROLES.RESPONSABLE) && (
                    <IconButton color="error" size="small" onClick={() => handleDeleteGroup(grp.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>

                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  Projet associé : <strong>{grp.projectTitle || 'Aucun projet associé'}</strong>
                </Typography>

                <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
                  Membres du Groupe :
                </Typography>
                <List size="small" disablePadding sx={{ mb: 2 }}>
                  {grp.members?.map((m) => (
                    <ListItem key={m.id} disablePadding sx={{ py: 0.5 }}>
                      <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: 12, bgcolor: 'secondary.main' }}>
                        {m.name.charAt(0)}
                      </Avatar>
                      <ListItemText
                        primary={m.name}
                        secondary={`${m.role || 'Étudiant'} • ${m.email}`}
                        primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }}
                        secondaryTypographyProps={{ fontSize: '0.75rem' }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Typography variant="caption" color="text.secondary">
                  Encadrant désigné : <strong>{grp.supervisorName || 'Non désigné'}</strong>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <FormDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Créer un nouveau groupe d'étudiants"
        onSubmit={handleCreateSubmit}
        submitText="Créer le groupe"
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Nom du Groupe" fullWidth required value={groupName} onChange={(e) => setGroupName(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Filière / Promotion" fullWidth value={filiere} onChange={(e) => setFiliere(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Encadrant Référent"
              value={supervisorId}
              onChange={(e) => setSupervisorId(e.target.value)}
            >
              <MenuItem value="">-- Non désigné --</MenuItem>
              {supervisors.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.specialty})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </FormDialog>
    </Box>
  );
};
