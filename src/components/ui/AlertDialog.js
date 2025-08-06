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
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const AlertDialog = ({ 
  open, 
  onClose, 
  title = 'Alert',
  message = 'This is an alert message.',
  severity = 'info', // 'success', 'error', 'warning', 'info'
  buttonText = 'OK'
}) => {
  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <SuccessIcon color="success" sx={{ fontSize: 32 }} />;
      case 'error':
        return <ErrorIcon color="error" sx={{ fontSize: 32 }} />;
      case 'warning':
        return <WarningIcon color="warning" sx={{ fontSize: 32 }} />;
      default:
        return <InfoIcon color="info" sx={{ fontSize: 32 }} />;
    }
  };

  const getButtonColor = () => {
    switch (severity) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {getIcon()}
          <Typography variant="h6" component="span">
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={handleClose} 
          variant="contained" 
          color={getButtonColor()}
          autoFocus
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog; 