import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { Link as RouterLink } from 'react-router-dom';

export const Breadcrumb = ({ items = [] }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link
          component={RouterLink}
          underline="hover"
          color="inherit"
          to="/dashboard"
          sx={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: '1.1rem' }} />
          Accueil
        </Link>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return isLast || !item.link ? (
            <Typography key={idx} color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
              {item.label}
            </Typography>
          ) : (
            <Link
              key={idx}
              component={RouterLink}
              underline="hover"
              color="inherit"
              to={item.link}
              sx={{ fontSize: '0.875rem' }}
            >
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};
