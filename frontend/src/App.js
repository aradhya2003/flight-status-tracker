import React, { useEffect } from 'react';
import { Container, Typography, Paper, AppBar, Toolbar, Button, Box } from '@mui/material';
import { messaging, getToken, onMessage } from './firebase';
import FlightStatus from './components/FlightStatus';

const App = () => {
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notification permission granted.');

          const token = await getToken(messaging, {
            vapidKey: 'Enter your Cred'
          });

          if (token) {
            console.log('FCM Token:', token);

            // Send the token to backend
            const response = await fetch('http://localhost:5000/api/save-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token })
            });

            if (!response.ok) {
              throw new Error('Failed to save token');
            }

            const data = await response.json();
            console.log('Server response:', data);
          }
        } else {
          console.log('Notification permission denied.');
        }
      } catch (error) {
        console.error('Error getting permission or token', error);
      }
    };

    requestPermission();

    // Handle incoming messages
    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      const { title, body, icon } = payload.notification;
      const notificationOptions = {
        body,
        icon
      };

      if (Notification.permission === 'granted') {
        new Notification(title, notificationOptions);
      }
    });
  }, []);

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#003366' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            Flight Status App
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit">Home</Button>
            <Button color="inherit">Flight Status</Button>
            <Button color="inherit">Contact Us</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: '10px',paddingRight: '33px', textAlign: 'right' }}>
        <Typography variant="body2" sx={{ color: '#555' }}>
          Developed by Aradhya Teharia
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ padding: '10px', paddingBottom: '0px', marginTop: '0px' }}>
        <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>
            Track Your Flight
          </Typography>
          <FlightStatus />
        </Paper>
      </Container>

      {/* <footer style={{ backgroundColor: '#003366', color: '#ffffff', padding: '10px', textAlign: 'center' }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} 
        </Typography>
      </footer> */}
    </>
  );
};

export default App;
