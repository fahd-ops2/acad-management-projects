import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Avatar,
  TextField,
  MenuItem,
  Grid,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Breadcrumb } from '../components/Breadcrumb';
import { DataTable } from '../components/DataTable';
import { SearchBar } from '../components/SearchBar';
import { FormDialog } from '../components/FormDialog';
import { Loading } from '../components/Loading';
import { userService } from '../services/userService';
import { ROLES, ROLE_LABELS } from '../constants';

export const UtilisateursPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  const [openCreate, setOpenCreate] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(ROLES.ETUDIANT);
  const [department, setDepartment] = useState('Génie Informatique');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      await userService.create({
        firstName,
        lastName,
        email,
        role,
        department
      });
      setOpenCreate(false);
      setFirstName('');
      setLastName('');
      setEmail('');
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cet utilisateur ?')) {
      await userService.delete(id);
      loadUsers();
    }
  };

  const filteredUsers = users.filter((u) => {
    const name = `${u.firstName} ${u.lastName}`.toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const columns = [
    {
      field: 'user',
      headerName: 'Utilisateur',
      width: 250,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar src={row.avatar}>{row.firstName?.charAt(0)}</Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>
              {row.firstName} {row.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.email}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'role',
      headerName: 'Rôle',
      width: 180,
      renderCell: (row) => (
        <Chip
          label={ROLE_LABELS[row.role] || row.role}
          color={
            row.role === ROLES.ADMIN
              ? 'error'
              : row.role === ROLES.RESPONSABLE
              ? 'secondary'
              : row.role === ROLES.ENCADRANT
              ? 'info'
              : 'default'
          }
          size="small"
          sx={{ fontWeight: 700 }}
        />
      )
    },
    { field: 'department', headerName: 'Département / Filière', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      align: 'right',
      renderCell: (row) => (
        <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      )
    }
  ];

  if (loading) return <Loading message="Chargement des comptes utilisateurs..." />;

  return (
    <Box>
      <Breadcrumb items={[{ label: 'Gestion des Utilisateurs' }]} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Comptes Utilisateurs & Permissions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestion des administrateurs, enseignants et étudiants inscrits sur la plateforme
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>
          Créer un Compte
        </Button>
      </Box>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterOptions={Object.keys(ROLES).map((r) => ({ value: r, label: ROLE_LABELS[r] }))}
        filterValue={filterRole}
        onFilterChange={setFilterRole}
        onReset={() => {
          setSearchTerm('');
          setFilterRole('ALL');
        }}
        placeholder="Rechercher par nom ou email..."
      />

      <DataTable columns={columns} data={filteredUsers} emptyMessage="Aucun utilisateur trouvé." />

      <FormDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Créer un nouveau compte utilisateur"
        onSubmit={handleCreateSubmit}
        submitText="Créer le compte"
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Prénom" fullWidth required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Nom" fullWidth required value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Adresse Email" fullWidth required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Rôle Attribué" value={role} onChange={(e) => setRole(e.target.value)}>
              {Object.keys(ROLES).map((r) => (
                <MenuItem key={r} value={r}>
                  {ROLE_LABELS[r]}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Département"
              fullWidth
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </Grid>
        </Grid>
      </FormDialog>
    </Box>
  );
};
