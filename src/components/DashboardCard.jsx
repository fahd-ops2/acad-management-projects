import React from 'react';
import { Card, CardContent, Box, Typography, LinearProgress, Avatar } from '@mui/material';

export const DashboardCard = ({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'primary.main',
  progress,
  color = 'primary'
}) => {
  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ my: 0.5, fontWeight: 800 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Avatar
              sx={{
                bgcolor: iconBg,
                width: 48,
                height: 48,
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}
            >
              {icon}
            </Avatar>
          )}
        </Box>

        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Progression
              </Typography>
              <Typography variant="caption" fontWeight={700}>
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              color={color}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
