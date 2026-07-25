import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const FormDialog = ({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitText = 'Enregistrer',
  cancelText = 'Annuler',
  loading = false,
  maxWidth = 'sm'
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <IconButton aria-label="close" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent dividers sx={{ p: 3 }}>
          {children}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            {cancelText}
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Chargement...' : submitText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
