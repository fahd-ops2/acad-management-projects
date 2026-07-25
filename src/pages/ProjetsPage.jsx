import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  MenuItem,
  TextField,
  Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import { Breadcrumb } from '../components/Breadcrumb';
import { DataTable } from '../components/DataTable';
import { SearchBar } from '../components/SearchBar';
import { StatusBadge } from '../components/StatusBadge';
import { FormDialog } from '../components/FormDialog';
import { Loading } from '../components/Loading';
import { projectService } from '../services/projectService';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../contexts/RoleContext';
import { useNavigate } from 'react-router-dom';
import { PROJECT_STATUS, PROJECT_STATUS_DETAILS, PROJECT_TYPES, ROLES } from '../constants';

export const ProjetsPage = () => {
  const { user } = useAuth();
  const { activeRole } = useRole();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Dialog state for create/edit
  const [openCreate, setOpenCreate] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectType, setNewProjectType] = useState(PROJECT_TYPES.PFE);
  const [newProjectDesc, setNewProjectDesc] = useState('');

  // Dialog state for status change (State Machine)
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [targetStatus, setTargetStatus] = useState('');
  const [actionComment, setActionComment] = useState('');

  useEffect(() => {
    loadProjects();
  }, [activeRole, user?.id]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getAll(activeRole, user?.id, user?.groupId);
      setProjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    try {
      await projectService.create({
        title: newProjectTitle,
        type: newProjectType,
        description: newProjectDesc,
        status: PROJECT_STATUS.PROPOSE,
        author: `${user?.firstName} ${user?.lastName}`
      });
      setOpenCreate(false);
      setNewProjectTitle('');
      setNewProjectDesc('');
      loadProjects();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusChangeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject || !targetStatus) return;

    try {
      await projectService.changeStatus(
        selectedProject.id,
        targetStatus,
        `${user?.firstName} ${user?.lastName} (${activeRole})`,
        actionComment
      );
      setOpenStatusDialog(false);
      setSelectedProject(null);
      setActionComment('');
      loadProjects();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.groupName && p.groupName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.supervisorName && p.supervisorName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    { field: 'code', headerName: 'Code', width: 110 },
    {
      field: 'title',
      headerName: 'Titre du Projet',
      width: 250,
      renderCell: (row) => (
        <Box>
          <Typography variant="subtitle2" fontWeight={700}>
            {row.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.type}
          </Typography>
        </Box>
      )
    },
    { field: 'groupName', headerName: 'Groupe / Étudiants', width: 180 },
    { field: 'supervisorName', headerName: 'Encadrant', width: 160 },
    {
      field: 'status',
      headerName: 'Statut',
      width: 170,
      renderCell: (row) => <StatusBadge status={row.status} type="project" />
    },
    {
      field: 'progress',
      headerName: 'Progression',
      width: 110,
      renderCell: (row) => <strong>{row.progress}%</strong>
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      align: 'right',
      renderCell: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Consulter le détail">
            <IconButton size="small" color="primary" onClick={() => navigate(`/projets/${row.id}`)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {(activeRole === ROLES.ADMIN || activeRole === ROLES.RESPONSABLE || activeRole === ROLES.ENCADRANT) && (
            <Tooltip title="Changer le statut (Cycle de vie)">
              <IconButton
                size="small"
                color="secondary"
                onClick={() => {
                  setSelectedProject(row);
                  setTargetStatus(row.status);
                  setOpenStatusDialog(true);
                }}
              >
                <SwapCallsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ];

  const statusOptions = Object.keys(PROJECT_STATUS_DETAILS).map((k) => ({
    value: k,
    label: PROJECT_STATUS_DETAILS[k].label
  }));

  if (loading) return <Loading message="Chargement de la liste des projets..." />;

  return (
    <Box>
      <Breadcrumb items={[{ label: 'Projets Académiques' }]} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Gestion des Projets Académiques (PFA / PFE)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Suivi du cycle de vie des projets, affectations et historisation des actions
          </Typography>
        </Box>

        {(activeRole === ROLES.ADMIN || activeRole === ROLES.RESPONSABLE) && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>
            Nouveau Projet
          </Button>
        )}
      </Box>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterOptions={statusOptions}
        filterValue={filterStatus}
        onFilterChange={setFilterStatus}
        onReset={() => {
          setSearchTerm('');
          setFilterStatus('ALL');
        }}
        placeholder="Rechercher par titre, groupe ou encadrant..."
      />

      <DataTable columns={columns} data={filteredProjects} emptyMessage="Aucun projet ne correspond à vos critères." />

      {/* Dialog for creating project */}
      <FormDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Créer un nouveau projet académique"
        onSubmit={handleCreateSubmit}
        submitText="Créer le projet"
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Titre du Projet"
              fullWidth
              required
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Type de Projet"
              fullWidth
              value={newProjectType}
              onChange={(e) => setNewProjectType(e.target.value)}
            >
              {Object.values(PROJECT_TYPES).map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description & Périmètre Fonctionnel"
              fullWidth
              multiline
              rows={4}
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
            />
          </Grid>
        </Grid>
      </FormDialog>

      {/* Dialog for Changing Project Status (State Machine) */}
      <FormDialog
        open={openStatusDialog}
        onClose={() => setOpenStatusDialog(false)}
        title={`Changer le statut du projet : ${selectedProject?.code}`}
        onSubmit={handleStatusChangeSubmit}
        submitText="Appliquer le nouveau statut"
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Projet : <strong>{selectedProject?.title}</strong>
          </Typography>
          <TextField
            select
            fullWidth
            label="Nouveau Statut du Cycle de Vie"
            value={targetStatus}
            onChange={(e) => setTargetStatus(e.target.value)}
            sx={{ mb: 2 }}
          >
            {Object.keys(PROJECT_STATUS_DETAILS).map((stKey) => (
              <MenuItem key={stKey} value={stKey}>
                {PROJECT_STATUS_DETAILS[stKey].label} — ({PROJECT_STATUS_DETAILS[stKey].description})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Motif / Commentaire d'historisation"
            placeholder="Ex : Validation du rapport intermédiaire par le jury..."
            multiline
            rows={3}
            value={actionComment}
            onChange={(e) => setActionComment(e.target.value)}
          />
        </Box>
      </FormDialog>
    </Box>
  );
};
