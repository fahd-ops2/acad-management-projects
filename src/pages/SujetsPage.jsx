import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import DeleteIcon from '@mui/icons-material/Delete';
import { Breadcrumb } from '../components/Breadcrumb';
import { SearchBar } from '../components/SearchBar';
import { FormDialog } from '../components/FormDialog';
import { Loading } from '../components/Loading';
import { subjectService } from '../services/subjectService';
import { groupeService } from '../services/groupeService';
import { userService } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../contexts/RoleContext';
import { PROJECT_TYPES, ROLES } from '../constants';

export const SujetsPage = () => {
  const { user } = useAuth();
  const { activeRole } = useRole();

  const [subjects, setSubjects] = useState([]);
  const [groups, setGroups] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // Create Subject Dialog
  const [openCreate, setOpenCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState(PROJECT_TYPES.PFE);
  const [description, setDescription] = useState('');
  const [specialty, setSpecialty] = useState('Génie Software & IA');
  const [techs, setTechs] = useState('React, Spring Boot');

  // Assign Dialog
  const [openAssign, setOpenAssign] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedSupervisorId, setSelectedSupervisorId] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const sData = await subjectService.getAll();
      setSubjects(sData);

      const gData = await groupeService.getAll();
      setGroups(gData);

      const uData = await userService.getAll();
      setSupervisors(uData.filter((u) => u.role === ROLES.ENCADRANT));
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
      await subjectService.create({
        title,
        type,
        description,
        specialty,
        technologies: techs.split(',').map((t) => t.trim()),
        proposedBy: `${user?.firstName} ${user?.lastName}`
      });
      setOpenCreate(false);
      setTitle('');
      setDescription('');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubject || !selectedGroupId) return;

    const group = groups.find((g) => g.id === selectedGroupId);
    const supervisor = supervisors.find((s) => s.id === selectedSupervisorId);

    try {
      await subjectService.assignGroupAndSupervisor(
        selectedSubject.id,
        group.id,
        group.name,
        supervisor ? supervisor.id : null,
        supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : 'Non désigné'
      );
      setOpenAssign(false);
      setSelectedSubject(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce sujet ?')) {
      await subjectService.delete(id);
      loadData();
    }
  };

  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.proposedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'ALL' || s.type === filterType;

    return matchesSearch && matchesType;
  });

  if (loading) return <Loading message="Chargement de la banque de sujets..." />;

  return (
    <Box>
      <Breadcrumb items={[{ label: 'Banque de Sujets' }]} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Banque de Sujets Académiques
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sujets de PFA, PFE et Mini-Projets proposés par les enseignants
          </Typography>
        </Box>

        {(activeRole === ROLES.ADMIN || activeRole === ROLES.RESPONSABLE || activeRole === ROLES.ENCADRANT) && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>
            Proposer un Sujet
          </Button>
        )}
      </Box>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterOptions={Object.values(PROJECT_TYPES).map((t) => ({ value: t, label: t }))}
        filterValue={filterType}
        onFilterChange={setFilterType}
        onReset={() => {
          setSearchTerm('');
          setFilterType('ALL');
        }}
        placeholder="Rechercher un sujet par mot-clé..."
      />

      <Grid container spacing={3}>
        {filteredSubjects.map((sbj) => (
          <Grid item xs={12} md={6} key={sbj.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <CardContent sx={{ p: 3, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Chip label={sbj.type} color="primary" size="small" sx={{ fontWeight: 700 }} />
                  <Chip
                    label={sbj.status === 'AFFECTE' ? 'Affecté' : 'Disponible'}
                    color={sbj.status === 'AFFECTE' ? 'default' : 'success'}
                    size="small"
                  />
                </Box>

                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                  {sbj.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                  {sbj.description}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {sbj.technologies?.map((tech) => (
                    <Chip key={tech} label={tech} size="small" variant="outlined" />
                  ))}
                </Box>

                <Typography variant="caption" color="text.secondary" display="block">
                  Proposé par : <strong>{sbj.proposedBy}</strong> | Spécialité : {sbj.specialty}
                </Typography>

                {sbj.assignedGroupTitle && (
                  <Typography variant="caption" color="primary.main" fontWeight={700} display="block" sx={{ mt: 0.5 }}>
                    Affecté à : {sbj.assignedGroupTitle}
                  </Typography>
                )}
              </CardContent>

              <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {(activeRole === ROLES.ADMIN || activeRole === ROLES.RESPONSABLE) && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AssignmentIndIcon />}
                    onClick={() => {
                      setSelectedSubject(sbj);
                      setOpenAssign(true);
                    }}
                  >
                    Affecter au groupe
                  </Button>
                )}

                {(activeRole === ROLES.ADMIN || activeRole === ROLES.RESPONSABLE) && (
                  <IconButton size="small" color="error" onClick={() => handleDelete(sbj.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Form dialog to create subject */}
      <FormDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Proposer un nouveau sujet"
        onSubmit={handleCreateSubmit}
        submitText="Publier le sujet"
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Titre du Sujet" fullWidth required value={title} onChange={(e) => setTitle(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Type" fullWidth value={type} onChange={(e) => setType(e.target.value)}>
              {Object.values(PROJECT_TYPES).map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Spécialité / Filière"
              fullWidth
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Technologies clés (séparées par des virgules)"
              fullWidth
              value={techs}
              onChange={(e) => setTechs(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description détaillée"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
        </Grid>
      </FormDialog>

      {/* Form dialog to assign subject */}
      <FormDialog
        open={openAssign}
        onClose={() => setOpenAssign(false)}
        title={`Affecter le sujet : ${selectedSubject?.title}`}
        onSubmit={handleAssignSubmit}
        submitText="Valider l'affectation"
      >
        <TextField
          select
          fullWidth
          required
          label="Sélectionner le Groupe d'Étudiants"
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          sx={{ mb: 2 }}
        >
          {groups.map((g) => (
            <MenuItem key={g.id} value={g.id}>
              {g.name} ({g.filiere})
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Désigner l'Encadrant Référent"
          value={selectedSupervisorId}
          onChange={(e) => setSelectedSupervisorId(e.target.value)}
        >
          <MenuItem value="">-- Choisir plus tard --</MenuItem>
          {supervisors.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.firstName} {s.lastName} ({s.specialty})
            </MenuItem>
          ))}
        </TextField>
      </FormDialog>
    </Box>
  );
};
