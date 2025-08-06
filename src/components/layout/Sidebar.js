import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ open, drawerWidth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser, isLoading } = useAuth();

  const isAdmin = currentUser?.isAdmin === true;

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    // Only show Users menu if not loading and user is admin
    ...(!isLoading && isAdmin ? [{ text: 'Users', icon: <PeopleIcon />, path: '/users' }] : []),
    { text: 'PDF', icon: <PdfIcon />, path: '/pdf' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #e0e0e0'
        },
        display: { xs: open ? 'block' : 'none', sm: 'block' }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          minHeight: 64,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: 'white'
        }}
      >
        <Typography variant="h6" color="primary" fontWeight="bold">
          Management
        </Typography>
      </Box>

      <Box sx={{ overflow: 'auto', mt: 1 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <List>
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    onClick={() => handleMenuClick(item.path)}
                    selected={isActive}
                                         sx={{
                       mx: 1,
                       borderRadius: 1,
                       mb: 0.5,
                       backgroundColor: isActive ? 'primary.main' : 'transparent',
                       '&:hover': {
                         backgroundColor: 'primary.light',
                         '& .MuiListItemIcon-root': {
                           color: 'primary.main'
                         },
                         '& .MuiListItemText-primary': {
                           color: 'primary.main'
                         }
                       },
                       '&.Mui-selected': {
                         backgroundColor: 'primary.main',
                         '& .MuiListItemIcon-root': {
                           color: 'white'
                         },
                         '& .MuiListItemText-primary': {
                           color: 'white'
                         }
                       }
                     }}
                  >
                    <ListItemIcon
                      sx={{
                        color: 'text.secondary',
                        minWidth: 40
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: 500
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar; 