import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export const Loading = ({ message = 'Chargement des données...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        width: '100%'
      }}
    >
      <CircularProgress size={40} thickness={4} />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 500 }}>
        {message}
      </Typography>
    </Box>
  );
};
