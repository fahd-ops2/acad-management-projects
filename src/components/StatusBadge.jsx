import React from 'react';
import { Chip } from '@mui/material';
import { PROJECT_STATUS_DETAILS, DELIVERABLE_STATUS_DETAILS } from '../constants';

export const StatusBadge = ({ status, type = 'project', size = 'small' }) => {
  let details = { label: status, color: 'default' };

  if (type === 'project' && PROJECT_STATUS_DETAILS[status]) {
    details = PROJECT_STATUS_DETAILS[status];
  } else if (type === 'deliverable' && DELIVERABLE_STATUS_DETAILS[status]) {
    details = DELIVERABLE_STATUS_DETAILS[status];
  } else if (status === 'A_VENIR') {
    details = { label: 'À venir', color: 'info' };
  } else if (status === 'DEPASSE') {
    details = { label: 'Échéance dépassée', color: 'error' };
  } else if (status === 'PLANIFIEE') {
    details = { label: 'Planifiée', color: 'info' };
  } else if (status === 'TERMINEE') {
    details = { label: 'Terminée', color: 'success' };
  }

  return (
    <Chip
      label={details.label}
      color={details.color}
      size={size}
      sx={{
        fontWeight: 600,
        fontSize: '0.75rem',
        textTransform: 'none'
      }}
    />
  );
};
