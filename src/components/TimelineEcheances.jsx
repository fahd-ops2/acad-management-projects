import React from 'react';
import { Box, Paper, Typography, Chip, Tooltip } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ScheduleIcon from '@mui/icons-material/Schedule';

export const TimelineEcheances = ({ echeances = [] }) => {
  const sorted = [...echeances].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <Box sx={{ py: 1 }}>
      {sorted.map((item, index) => {
        const isPast = new Date(item.dueDate) < new Date();
        const isLate = item.status === 'DEPASSE' || (isPast && item.status !== 'VALIDE');

        return (
          <Box
            key={item.id || index}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              position: 'relative',
              pb: index === sorted.length - 1 ? 0 : 3,
              '&:before': index === sorted.length - 1 ? {} : {
                content: '""',
                position: 'absolute',
                left: 18,
                top: 36,
                bottom: 0,
                width: 2,
                backgroundColor: (theme) => (isLate ? theme.palette.error.light : theme.palette.divider)
              }
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                bgcolor: isLate ? 'error.light' : isPast ? 'success.light' : 'primary.light',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
                mr: 2,
                flexShrink: 0
              }}
            >
              {isLate ? (
                <ErrorIcon fontSize="small" />
              ) : isPast ? (
                <CheckCircleIcon fontSize="small" />
              ) : (
                <ScheduleIcon fontSize="small" />
              )}
            </Box>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                flexGrow: 1,
                bgcolor: (theme) => (theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b'),
                border: '1px solid',
                borderColor: (theme) => (isLate ? theme.palette.error.light : theme.palette.divider),
                borderRadius: 2
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {item.title}
                </Typography>
                <Chip
                  label={item.dueDate}
                  size="small"
                  icon={<EventIcon fontSize="small" />}
                  color={isLate ? 'error' : isPast ? 'success' : 'primary'}
                  variant={isLate ? 'filled' : 'outlined'}
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              {item.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {item.description}
                </Typography>
              )}

              {isLate && (
                <Typography variant="caption" color="error.main" fontWeight={700} sx={{ mt: 1, display: 'block' }}>
                  ⚠️ Échéance dépassée - Retard détecté
                </Typography>
              )}
            </Paper>
          </Box>
        );
      })}
    </Box>
  );
};
