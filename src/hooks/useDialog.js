import { useState, useCallback } from 'react';

export const useConfirmDialog = () => {
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    severity: 'warning',
    onConfirm: null
  });

  const showConfirm = useCallback((title, message, onConfirm, severity = 'warning') => {
    setConfirmDialog({
      open: true,
      title,
      message,
      severity,
      onConfirm
    });
  }, []);

  const hideConfirm = useCallback(() => {
    setConfirmDialog(prev => ({ ...prev, open: false }));
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmDialog.onConfirm) {
      confirmDialog.onConfirm();
    }
    hideConfirm();
  }, [confirmDialog, hideConfirm]);

  return {
    confirmDialog,
    showConfirm,
    hideConfirm,
    handleConfirm
  };
};

export const useAlertDialog = () => {
  const [alertDialog, setAlertDialog] = useState({
    open: false,
    title: '',
    message: '',
    severity: 'info'
  });

  const showAlert = useCallback((title, message, severity = 'info') => {
    setAlertDialog({
      open: true,
      title,
      message,
      severity
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertDialog(prev => ({ ...prev, open: false }));
  }, []);

  return {
    alertDialog,
    showAlert,
    hideAlert
  };
};

// Convenience functions that mimic window.confirm and window.alert
export const useMaterialDialogs = () => {
  const { showConfirm, hideConfirm, handleConfirm, confirmDialog } = useConfirmDialog();
  const { showAlert, hideAlert, alertDialog } = useAlertDialog();

  const confirm = useCallback((message, onConfirm, title = 'Confirm Action') => {
    showConfirm(title, message, onConfirm, 'warning');
  }, [showConfirm]);

  const alert = useCallback((message, title = 'Alert', severity = 'info') => {
    showAlert(title, message, severity);
  }, [showAlert]);

  return {
    // Dialog states
    confirmDialog,
    alertDialog,
    
    // Dialog actions
    showConfirm,
    hideConfirm,
    handleConfirm,
    showAlert,
    hideAlert,
    
    // Convenience methods (similar to window.confirm/alert)
    confirm,
    alert
  };
}; 