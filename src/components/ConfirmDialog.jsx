import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirmation requise',
  content = 'Êtes-vous sûr de vouloir effectuer cette action ?',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  color = 'primary',
  requireExplicitCode = false,
  explicitCodeWord = 'SUPPRIMER'
}) => {
  const [typedCode, setTypedCode] = useState('');

  const handleConfirm = () => {
    if (requireExplicitCode && typedCode !== explicitCodeWord) {
      return;
    }
    onConfirm();
    setTypedCode('');
  };

  const isConfirmDisabled = requireExplicitCode && typedCode !== explicitCodeWord;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: `${color}.main` }}>
        <WarningAmberIcon color={color} />
        <Typography variant="h6" component="span" fontWeight={700}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText color="text.primary" sx={{ mb: 2 }}>
          {content}
        </DialogContentText>
        {requireExplicitCode && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="error" display="block" sx={{ mb: 1, fontWeight: 600 }}>
              ⚠️ Action sensible : Veuillez saisir "{explicitCodeWord}" ci-dessous pour débloquer la confirmation.
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder={`Saisissez ${explicitCodeWord}`}
              value={typedCode}
              onChange={(e) => setTypedCode(e.target.value)}
              autoFocus
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={color}
          disabled={isConfirmDisabled}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
