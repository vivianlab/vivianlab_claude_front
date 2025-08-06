import React from 'react';
import {
  Container,
  Paper,
  Box
} from '@mui/material';

const Dashboard = () => {
  return (
    <Container maxWidth="lg">
      <Paper
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 120px)',
          backgroundColor: '#fafafa'
        }}
      >
        {/* Empty Container */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4
          }}
        >
          {/* Content will be added here in the future */}
        </Box>
      </Paper>
    </Container>
  );
};

export default Dashboard; 