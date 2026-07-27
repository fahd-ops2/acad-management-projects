import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../contexts/RoleContext';
import { useThemeMode } from '../contexts/ThemeContext';
import { notificationService } from '../services/notificationService';
import { ROLES, ROLE_LABELS } from '../constants';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 260;

export const Topbar = ({ handleDrawerToggle }) => {
  const { user, logout } = useAuth();
  const { activeRole, switchRole } = useRole();
  const { mode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, [user?.id]);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getForUser(user?.id);
      setNotifications(data);
    } catch (e) {
      console.warn('Failed to load notifications', e);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleOpenNotifMenu = (event) => setAnchorElNotif(event.currentTarget);
  const handleCloseNotifMenu = () => setAnchorElNotif(null);

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead(user?.id);
    loadNotifications();
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    await logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="subtitle1" fontWeight={700} sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
          Plateforme PFA & PFE
        </Typography>

        {/* Role Switcher for instant demo evaluation */}
        {/*<FormControl size="small" sx={{ mr: 2, minWidth: 160 }}>
          <Select
            value={activeRole}
            onChange={(e) => switchRole(e.target.value)}
            startAdornment={<SwapHorizIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />}
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              fontSize: '0.85rem',
              bgcolor: (theme) => (theme.palette.mode === 'light' ? '#f1f5f9' : '#1e293b')
            }}
          >
            {Object.keys(ROLES).map((role) => (
              <MenuItem key={role} value={role} sx={{ fontSize: '0.85rem' }}>
                {ROLE_LABELS[role]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>*/}

        {/* Dark/Light Toggle */}
        <Tooltip title="Changer le thème">
          <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton color="inherit" onClick={handleOpenNotifMenu} sx={{ mr: 2 }}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Notifications Popover */}
        <Popover
          open={Boolean(anchorElNotif)}
          anchorEl={anchorElNotif}
          onClose={handleCloseNotifMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ sx: { width: 340, maxHeight: 400, borderRadius: 2, p: 1 } }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={700}>
              Notifications ({unreadCount})
            </Typography>
            {unreadCount > 0 && (
              <Button size="small" onClick={handleMarkAllRead}>
                Tout marquer comme lu
              </Button>
            )}
          </Box>
          <Divider />
          <List sx={{ p: 0 }}>
            {notifications.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Aucune notification pour le moment.
                </Typography>
              </Box>
            ) : (
              notifications.map((n) => (
                <ListItem
                  key={n.id}
                  sx={{
                    bgcolor: n.read ? 'transparent' : (theme) => (theme.palette.mode === 'light' ? '#eff6ff' : '#1e3a8a22'),
                    borderRadius: 1,
                    mb: 0.5,
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    handleCloseNotifMenu();
                    if (n.link) navigate(n.link);
                  }}
                >
                  <ListItemText
                    primary={n.title}
                    secondary={n.message}
                    primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: n.read ? 500 : 700 }}
                    secondaryTypographyProps={{ fontSize: '0.75rem' }}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Popover>

        {/* User Avatar Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Profil utilisateur">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar src={user?.avatar} alt={user?.firstName}>
                {user?.firstName?.charAt(0)}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.1 }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {ROLE_LABELS[activeRole]}
            </Typography>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorElUser}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
          PaperProps={{ sx: { width: 220, mt: 1, borderRadius: 2 } }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" fontWeight={700}>
              {user?.email}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.department || 'Université Academix'}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleCloseUserMenu}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Mon Profil
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            Déconnexion
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
