import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
  Chip
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import SubjectIcon from '@mui/icons-material/MenuBook';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CommentIcon from '@mui/icons-material/Comment';
import SchoolIcon from '@mui/icons-material/School';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRole } from '../contexts/RoleContext';
import { ROLES, ROLE_LABELS } from '../constants';

const drawerWidth = 260;

export const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeRole } = useRole();

  const getMenuItems = () => {
    switch (activeRole) {
      case ROLES.ADMIN:
        return [
          { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/dashboard' },
          { text: 'Projets Académiques', icon: <FolderIcon />, path: '/projets' },
          { text: 'Banque de Sujets', icon: <SubjectIcon />, path: '/sujets' },
          { text: 'Groupes & Équipes', icon: <GroupsIcon />, path: '/groupes' },
          { text: 'Gestion des Livrables', icon: <AssignmentTurnedInIcon />, path: '/livrables' },
          { text: 'Soutenances & Jurys', icon: <EventAvailableIcon />, path: '/soutenances' },
          { text: 'Gestion des Comptes', icon: <PeopleIcon />, path: '/utilisateurs' },
          { text: 'Échéancier Académique', icon: <AccessTimeIcon />, path: '/echeances' }
        ];

      case ROLES.RESPONSABLE:
        return [
          { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/dashboard' },
          { text: 'Tous les Projets', icon: <FolderIcon />, path: '/projets' },
          { text: 'Validation des Sujets', icon: <SubjectIcon />, path: '/sujets' },
          { text: 'Groupes & Encadrants', icon: <GroupsIcon />, path: '/groupes' },
          { text: 'Planning Soutenances', icon: <EventAvailableIcon />, path: '/soutenances' },
          { text: 'Échéances & Suivi', icon: <AccessTimeIcon />, path: '/echeances' }
        ];

      case ROLES.ENCADRANT:
        return [
          { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/dashboard' },
          { text: 'Mes Projets Encadrés', icon: <FolderIcon />, path: '/projets' },
          { text: 'Livrables à Valider', icon: <AssignmentTurnedInIcon />, path: '/livrables' },
          { text: 'Soutenances', icon: <EventAvailableIcon />, path: '/soutenances' },
          { text: 'Échéances', icon: <AccessTimeIcon />, path: '/echeances' }
        ];

      case ROLES.ETUDIANT:
      default:
        return [
          { text: 'Mon Tableau de bord', icon: <DashboardIcon />, path: '/dashboard' },
          { text: 'Mon Projet (PFE/PFA)', icon: <FolderIcon />, path: '/projets' },
          { text: 'Mes Livrables & Dépôts', icon: <AssignmentTurnedInIcon />, path: '/livrables' },
          { text: 'Échéances à venir', icon: <AccessTimeIcon />, path: '/echeances' }
        ];
    }
  };

  const menuItems = getMenuItems();

  const drawerContent = (
    <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <SchoolIcon color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h6" fontWeight={800} color="primary" sx={{ lineHeight: 1.1 }}>
            Academix PFA
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Gestion de Projets
          </Typography>
        </Box>
      </Toolbar>
      <Divider />

      <Box sx={{ p: 2 }}>
        <Chip
          label={`Espace ${ROLE_LABELS[activeRole] || activeRole}`}
          color="primary"
          variant="outlined"
          sx={{ width: '100%', fontWeight: 700, borderRadius: 2 }}
        />
      </Box>

      <List sx={{ px: 1.5, py: 0 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => {
                  navigate(item.path);
                  if (mobileOpen) handleDrawerToggle();
                }}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white'
                    },
                    '&:hover': {
                      bgcolor: 'primary.dark'
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isSelected ? 'white' : 'action.active' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isSelected ? 700 : 500
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary" display="block">
          PFA / PFE v1.0
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Spring Boot Backend Ready
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Permanent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid rgba(0,0,0,0.08)' }
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};
