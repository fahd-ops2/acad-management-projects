import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  TextField,
  LinearProgress,
  Card,
  CardContent
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import HistoryIcon from '@mui/icons-material/History';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';
import { StatusBadge } from '../components/StatusBadge';
import { Loading } from '../components/Loading';
import { FormDialog } from '../components/FormDialog';
import { projectService } from '../services/projectService';
import { livrableService } from '../services/livrableService';
import { commentaireService } from '../services/commentaireService';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../contexts/RoleContext';
import { PROJECT_STATUS_DETAILS, ROLES } from '../constants';

export const ProjetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeRole } = useRole();

  const [project, setProject] = useState(null);
  const [deliverables, setDeliverables] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newCommentText, setNewCommentText] = useState('');

  // Status Change Dialog
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [targetStatus, setTargetStatus] = useState('');
  const [actionComment, setActionComment] = useState('');

  useEffect(() => {
    loadAllData();
  }, [id]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const pData = await projectService.getById(id);
      setProject(pData);
      setTargetStatus(pData.status);

      const dData = await livrableService.getAll(id);
      setDeliverables(dData);

      const cData = await commentaireService.getByProjectId(id);
      setComments(cData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      await commentaireService.create({
        projectId: id,
        authorId: user?.id,
        authorName: `${user?.firstName} ${user?.lastName}`,
        authorRole: activeRole,
        avatar: user?.avatar,
        content: newCommentText
      });
      setNewCommentText('');
      const updatedComments = await commentaireService.getByProjectId(id);
      setComments(updatedComments);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusChangeSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectService.changeStatus(
        id,
        targetStatus,
        `${user?.firstName} ${user?.lastName} (${activeRole})`,
        actionComment
      );
      setOpenStatusDialog(false);
      setActionComment('');
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loading message="Chargement des détails du projet..." />;
  if (!project) return <Typography>Projet introuvable.</Typography>;

  return (
    <Box>
      <Breadcrumb
        items={[
          { label: 'Projets Académiques', link: '/projets' },
          { label: project.code || 'Détails du projet' }
        ]}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Chip label={project.code} color="primary" variant="outlined" sx={{ fontWeight: 700 }} />
            <Chip label={project.type} color="secondary" size="small" />
            <StatusBadge status={project.status} type="project" size="medium" />
          </Box>
          <Typography variant="h4" fontWeight={800}>
            {project.title}
          </Typography>
        </Box>

        {(activeRole === ROLES.ADMIN || activeRole === ROLES.RESPONSABLE || activeRole === ROLES.ENCADRANT) && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<SwapCallsIcon />}
            onClick={() => setOpenStatusDialog(true)}
          >
            Changer le statut
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Main info card */}
          <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              Périmètre & Description
            </Typography>
            <Typography variant="body1" paragraph color="text.primary">
              {project.description}
            </Typography>

            <Box sx={{ my: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  Avancement global du projet
                </Typography>
                <Typography variant="subtitle2" fontWeight={800} color="primary">
                  {project.progress}%
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={project.progress} sx={{ height: 8, borderRadius: 4 }} />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Encadrant Référent :
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={700}>
                      {project.supervisorName || 'Non désigné'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {project.supervisorEmail}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Membres du Groupe ({project.groupName}) :
                </Typography>
                <List size="small" disablePadding>
                  {project.students?.map((st) => (
                    <ListItem key={st.id} disablePadding sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={st.name}
                        secondary={st.email}
                        primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }}
                        secondaryTypographyProps={{ fontSize: '0.75rem' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Paper>

          {/* Deliverables section */}
          <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Livrables Déposés pour ce Projet
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List disablePadding>
              {deliverables.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Aucun livrable associé à ce projet pour le moment.
                </Typography>
              ) : (
                deliverables.map((del) => (
                  <ListItem
                    key={del.id}
                    sx={{
                      p: 2,
                      mb: 1.5,
                      borderRadius: 2,
                      bgcolor: (theme) => (theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b'),
                      border: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {del.type}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Fichier : {del.fileName || 'Non déposé'} | Date limite : {del.dueDate}
                      </Typography>
                      {del.comments && (
                        <Typography variant="caption" color="info.main" sx={{ fontStyle: 'italic', display: 'block' }}>
                          Note : "{del.comments}"
                        </Typography>
                      )}
                    </Box>
                    <StatusBadge status={del.status} type="deliverable" />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>

          {/* Comments and feedback section */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Espace de Commentaires & Échanges Encadrant/Étudiants
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <List sx={{ mb: 3 }}>
              {comments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Aucun commentaire. Posez vos questions ci-dessous.
                </Typography>
              ) : (
                comments.map((cmt) => (
                  <Paper
                    key={cmt.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      bgcolor: (theme) => (theme.palette.mode === 'light' ? '#f1f5f9' : '#334155'),
                      borderRadius: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <Avatar src={cmt.avatar} sx={{ width: 32, height: 32 }} />
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {cmt.authorName} ({cmt.authorRole})
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {cmt.createdAt}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                      {cmt.content}
                    </Typography>
                  </Paper>
                ))
              )}
            </List>

            <form onSubmit={handleAddComment}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Écrire une remarque ou poser une question..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                />
                <Button type="submit" variant="contained" endIcon={<SendIcon />}>
                  Envoyer
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>

        {/* Sidebar: Historique log */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <HistoryIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Historique des Actions
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <List disablePadding>
              {project.historique?.map((h, idx) => (
                <ListItem
                  key={idx}
                  sx={{
                    px: 0,
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}
                >
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="primary" fontWeight={700}>
                      {h.action}
                    </Typography>
                    <StatusBadge status={h.status} type="project" size="small" />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Par : <strong>{h.author}</strong> le {h.date}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Change status dialog */}
      <FormDialog
        open={openStatusDialog}
        onClose={() => setOpenStatusDialog(false)}
        title="Changer le statut du projet"
        onSubmit={handleStatusChangeSubmit}
        submitText="Valider le changement"
      >
        <TextField
          select
          fullWidth
          label="Nouveau Statut"
          value={targetStatus}
          onChange={(e) => setTargetStatus(e.target.value)}
          sx={{ mb: 2 }}
        >
          {Object.keys(PROJECT_STATUS_DETAILS).map((k) => (
            <option key={k} value={k}>
              {PROJECT_STATUS_DETAILS[k].label}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="Motif / Commentaire de validation"
          multiline
          rows={3}
          value={actionComment}
          onChange={(e) => setActionComment(e.target.value)}
        />
      </FormDialog>
    </Box>
  );
};
