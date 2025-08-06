import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Alert,
  Tooltip,
  Button
} from '@mui/material';
import {
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  Refresh as RefreshIcon,
  CheckCircle as AllowIcon,
  Cancel as DenyIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import ConfirmDialog from '../ui/ConfirmDialog';
import AlertDialog from '../ui/AlertDialog';
import { useMaterialDialogs } from '../../hooks/useDialog';
import { userService } from '../../services/userService';
import { formatDate } from '../../utils/dateUtils';

const Users = () => {
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Material-UI dialogs
  const { confirmDialog, alertDialog, showConfirm, hideConfirm, handleConfirm, showAlert, hideAlert } = useMaterialDialogs();

  // Check if current user is admin (only when not loading)
  const isAdmin = !authLoading && currentUser?.isAdmin === true;

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId, userEmail) => {
    showConfirm(
      'Delete User',
      `Are you sure you want to delete user "${userEmail}"?`,
      async () => {
        try {
          await userService.deleteUser(userId);
          showAlert('Success', `User "${userEmail}" deleted successfully!`, 'success');
          fetchUsers(); // Refresh the list
        } catch (error) {
          showAlert('Error', 'Failed to delete user. Please try again.', 'error');
        }
      },
      'error'
    );
  };

  const handleToggleAccess = (userId, userEmail, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'allow' : 'deny';
    
    showConfirm(
      `${action.charAt(0).toUpperCase() + action.slice(1)} Access`,
      `Are you sure you want to ${action} access for user "${userEmail}"?`,
      async () => {
        try {
          await userService.toggleUserAccess(userId, newStatus);
          showAlert('Success', `User "${userEmail}" access ${action}ed successfully!`, 'success');
          fetchUsers(); // Refresh the list
        } catch (error) {
          showAlert('Error', 'Failed to update user access. Please try again.', 'error');
        }
      },
      newStatus ? 'info' : 'warning'
    );
  };



  // Show loading spinner while auth is being restored
  if (authLoading) {
    return <LoadingSpinner message="Loading authentication..." />;
  }

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <Paper sx={{ p: 3, mt: 3 }}>
        <Alert severity="error">
          Access Denied. You don't have permission to view this page.
        </Alert>
      </Paper>
    );
  }

  // Show loading spinner
  if (loading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Users Management
      </Typography>
      
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
         View and manage all users in the system. Only super admins can access this page.
       </Typography>

       {/* Action Buttons */}
       <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
         <Button
           variant="outlined"
           startIcon={<RefreshIcon />}
           onClick={fetchUsers}
           disabled={loading}
         >
           Refresh
         </Button>
       </Box>

       {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

             <TableContainer>
         <Table>
           <TableHead>
             <TableRow>
               <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
               <TableCell sx={{ fontWeight: 'bold' }}>Password</TableCell>
               <TableCell sx={{ fontWeight: 'bold' }}>Admin</TableCell>
               <TableCell sx={{ fontWeight: 'bold' }}>Allowed</TableCell>
               <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
               <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
             </TableRow>
           </TableHead>
           <TableBody>
             {users.map((user) => (
               <TableRow key={user.id || user._id} hover>
                 <TableCell>
                   <Typography variant="body2">
                     {user.email}
                   </Typography>
                 </TableCell>
                 <TableCell>
                   <Typography variant="body2" color="text.secondary">
                     {user.password ? '••••••••' : 'N/A'}
                   </Typography>
                 </TableCell>
                 <TableCell>
                   <Chip
                     label={user.isAdmin ? 'Yes' : 'No'}
                     color={user.isAdmin ? 'primary' : 'default'}
                     size="small"
                     icon={user.isAdmin ? <AdminIcon /> : <UserIcon />}
                   />
                 </TableCell>
                 <TableCell>
                   <Chip
                     label={user.isAllowed ? 'Yes' : 'No'}
                     color={user.isAllowed ? 'success' : 'error'}
                     size="small"
                   />
                 </TableCell>
                 <TableCell>
                   <Typography variant="body2" color="text.secondary">
                     {formatDate(user.createdAt)}
                   </Typography>
                 </TableCell>
                 <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title={user.isAllowed ? 'Deny Access' : 'Allow Access'}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleAccess(user.id || user._id, user.email, user.isAllowed)}
                          color={user.isAllowed ? 'warning' : 'success'}
                          disabled={user.isAdmin === true} // Prevent self-modification
                        >
                          {user.isAllowed ? <DenyIcon /> : <AllowIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteUser(user.id || user._id, user.email)}
                          color="error"
                          disabled={user.id === currentUser?.id || user._id === currentUser?.id} // Prevent self-deletion
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
       </TableContainer>

      {users.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No users found.
          </Typography>
                 </Box>
       )}

       {/* Material-UI Dialogs */}
       <ConfirmDialog
         open={confirmDialog.open}
         onClose={hideConfirm}
         onConfirm={handleConfirm}
         title={confirmDialog.title}
         message={confirmDialog.message}
         severity={confirmDialog.severity}
       />

       <AlertDialog
         open={alertDialog.open}
         onClose={hideAlert}
         title={alertDialog.title}
         message={alertDialog.message}
         severity={alertDialog.severity}
       />
     </Paper>
   );
 };

export default Users; 