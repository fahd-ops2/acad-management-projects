import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Grid,
  Alert
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Breadcrumb } from '../components/Breadcrumb';
import { DataTable } from '../components/DataTable';
import { SearchBar } from '../components/SearchBar';
import { StatusBadge } from '../components/StatusBadge';
import { FormDialog } from '../components/FormDialog';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Loading } from '../components/Loading';
import { livrableService } from '../services/livrableService';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../contexts/RoleContext';
import { DELIVERABLE_STATUS, DELIVERABLE_TYPES, DELIVERABLE_STATUS_DETAILS, ROLES } from '../constants';

export const LivrablesPage = () => {
  const { user } = useAuth();
  const { activeRole } = useRole();

  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Upload dialog state
  const [openUpload, setOpenUpload] = useState(false);
  const [selectedDelivId, setSelectedDelivId] = useState('');
  const [simulatedFile, setSimulatedFile] = useState(null);

  // Validate / Reject dialog state
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewItem, setReviewItem] = useState(null);
  const [reviewType, setReviewType] = useState('VALIDATE'); // 'VALIDATE' or 'REJECT'
  const [remarks, setRemarks] = useState('');

  // Delete dialog state with reinforced confirmation for validated deliverable rule
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [requireExplicitCode, setRequireExplicitCode] = useState(false);

  useEffect(() => {
    loadDeliverables();
  }, [activeRole, user?.id]);

  const loadDeliverables = async () => {
    setLoading(true);
    try {
      const data = await livrableService.getAll();
      setDeliverables(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDelivId) return;

    try {
      await livrableService.uploadSimulated(
        selectedDelivId,
        simulatedFile,
        `${user?.firstName} ${user?.lastName}`
      );
      setOpenUpload(false);
      setSimulatedFile(null);
      loadDeliverables();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewItem) return;

    try {
      if (reviewType === 'VALIDATE') {
        await livrableService.validate(
          reviewItem.id,
          `${user?.firstName} ${user?.lastName}`,
          remarks
        );
      } else {
        await livrableService.reject(
          reviewItem.id,
          `${user?.firstName} ${user?.lastName}`,
          remarks
        );
      }
      setOpenReviewDialog(false);
      setReviewItem(null);
      setRemarks('');
      loadDeliverables();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    if (item.status === DELIVERABLE_STATUS.VALIDE) {
      setRequireExplicitCode(true);
    } else {
      setRequireExplicitCode(false);
    }
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await livrableService.delete(itemToDelete.id, requireExplicitCode);
      setOpenDeleteDialog(false);
      setItemToDelete(null);
      loadDeliverables();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredDeliverables = deliverables.filter((d) => {
    const matchesSearch =
      d.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.fileName && d.fileName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === 'ALL' || d.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      field: 'type',
      headerName: 'Type de Livrable',
      width: 200,
      renderCell: (row) => (
        <Box>
          <Typography variant="subtitle2" fontWeight={700}>
            {row.type}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Échéance : {row.dueDate}
          </Typography>
        </Box>
      )
    },
    { field: 'projectTitle', headerName: 'Projet Associé', width: 220 },
    {
      field: 'fileName',
      headerName: 'Fichier Soumis',
      width: 180,
      renderCell: (row) => (
        <Typography variant="body2" color={row.fileName ? 'primary.main' : 'text.disabled'} fontWeight={500}>
          {row.fileName || 'Non encore déposé'}
        </Typography>
      )
    },
    {
      field: 'status',
      headerName: 'Statut',
      width: 150,
      renderCell: (row) => <StatusBadge status={row.status} type="deliverable" />
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      align: 'right',
      renderCell: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {row.fileName && (
            <Tooltip title="Télécharger le fichier (simulé)">
              <IconButton size="small" color="primary" onClick={() => alert(`Téléchargement de ${row.fileName}...`)}>
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {(activeRole === ROLES.ETUDIANT || activeRole === ROLES.ADMIN) && (
            <Tooltip title="Déposer / Remplacer le fichier">
              <IconButton
                size="small"
                color="secondary"
                onClick={() => {
                  setSelectedDelivId(row.id);
                  setOpenUpload(true);
                }}
              >
                <UploadFileIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {(activeRole === ROLES.ENCADRANT || activeRole === ROLES.RESPONSABLE || activeRole === ROLES.ADMIN) && (
            <Tooltip title="Valider / Refuser le livrable">
              <IconButton
                size="small"
                color="success"
                onClick={() => {
                  setReviewItem(row);
                  setReviewType('VALIDATE');
                  setRemarks('');
                  setOpenReviewDialog(true);
                }}
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Supprimer le livrable">
            <IconButton size="small" color="error" onClick={() => handleDeleteClick(row)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  if (loading) return <Loading message="Chargement des livrables..." />;

  return (
    <Box>
      <Breadcrumb items={[{ label: 'Livrables & Dépôts' }]} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Gestion des Livrables Académiques
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dépôt des rapports, code source et validation par le corps professoral
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<UploadFileIcon />} onClick={() => setOpenUpload(true)}>
          Soumettre un Livrable
        </Button>
      </Box>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterOptions={Object.keys(DELIVERABLE_STATUS_DETAILS).map((k) => ({
          value: k,
          label: DELIVERABLE_STATUS_DETAILS[k].label
        }))}
        filterValue={filterStatus}
        onFilterChange={setFilterStatus}
        onReset={() => {
          setSearchTerm('');
          setFilterStatus('ALL');
        }}
        placeholder="Rechercher par projet, type de livrable ou fichier..."
      />

      <DataTable columns={columns} data={filteredDeliverables} emptyMessage="Aucun livrable trouvé." />

      {/* Upload Dialog */}
      <FormDialog
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        title="Soumettre un Livrable Académique"
        onSubmit={handleUploadSubmit}
        submitText="Téléverser le fichier"
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              required
              label="Sélectionner le Livrable à soumettre"
              value={selectedDelivId}
              onChange={(e) => setSelectedDelivId(e.target.value)}
            >
              {deliverables.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.type} — [{d.projectTitle}]
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" component="label" fullWidth sx={{ py: 3, borderStyle: 'dashed' }}>
              <UploadFileIcon sx={{ mr: 1 }} />
              {simulatedFile ? simulatedFile.name : 'Cliquez pour sélectionner un fichier PDF/ZIP'}
              <input
                type="file"
                hidden
                onChange={(e) => setSimulatedFile(e.target.files[0] || { name: 'Document_Projet.pdf', size: 3500000 })}
              />
            </Button>
          </Grid>
        </Grid>
      </FormDialog>

      {/* Validate / Reject Dialog */}
      <FormDialog
        open={openReviewDialog}
        onClose={() => setOpenReviewDialog(false)}
        title={`Évaluation du livrable : ${reviewItem?.type}`}
        onSubmit={handleReviewSubmit}
        submitText={reviewType === 'VALIDATE' ? 'Valider le livrable' : 'Refuser le livrable'}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Projet : <strong>{reviewItem?.projectTitle}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Fichier soumis : {reviewItem?.fileName}
          </Typography>

          <TextField
            select
            fullWidth
            label="Décision de l'encadrant"
            value={reviewType}
            onChange={(e) => setReviewType(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="VALIDATE">✅ Valider le livrable</MenuItem>
            <MenuItem value="REJECT">❌ Refuser (Demander des corrections)</MenuItem>
          </TextField>

          <TextField
            fullWidth
            required
            label="Remarques et appréciations destinées aux étudiants"
            multiline
            rows={4}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Ex : Document conforme aux exigences. Remarques prises en compte."
          />
        </Box>
      </FormDialog>

      {/* Delete Confirmation Dialog with Explicit Code rule for validated items */}
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmation de suppression"
        content={
          requireExplicitCode
            ? `Ce livrable (${itemToDelete?.type}) est actuellement VALIDÉ. La règle du cahier des charges exige une confirmation renforcée pour éviter toute perte accidentelle.`
            : `Êtes-vous sûr de vouloir supprimer le livrable (${itemToDelete?.type}) ?`
        }
        color="error"
        requireExplicitCode={requireExplicitCode}
        explicitCodeWord="SUPPRIMER"
      />
    </Box>
  );
};
