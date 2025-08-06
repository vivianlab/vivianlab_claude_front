import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const ConfirmDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  severity = 'warning', // 'warning', 'error', 'info'
  type = 'default' // 'default', 'delete'
}) => {
  const getIcon = () => {
    switch (severity) {
      case 'error':
        return <DeleteIcon color="error" sx={{ fontSize: 32 }} />;
      case 'info':
        return <InfoIcon color="info" sx={{ fontSize: 32 }} />;
      default:
        return <WarningIcon color="warning" sx={{ fontSize: 32 }} />;
    }
  };

  const getConfirmButtonColor = () => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'info':
        return 'primary';
      default:
        return 'warning';
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="confirm-dialog-title">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {getIcon()}
          <Typography variant="h6" component="span">
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} variant="outlined">
          {cancelText}
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color={getConfirmButtonColor()}
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog; 