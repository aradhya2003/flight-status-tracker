import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Container, Typography, Paper, AppBar, Toolbar, Button, Box } from '@mui/material';
import FlightStatus from './components/FlightStatus';
import Login from './components/Login';
import Register from './components/Register';
import { messaging, getToken, onMessage } from './firebase';
import { logout as performLogout } from './utils/auth';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token')); // Check token for initial auth status
  const navigate = useNavigate();

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {

          const token = await getToken(messaging, {
            vapidKey: 'Enter your Creeds'
          });

          if (token) {

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

  const handleLogout = () => {
    performLogout();
    setIsAuthenticated(false); // Update authentication status
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#003366' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            Flight Status App
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isAuthenticated ? (
              <>
                <Button color="inherit" onClick={() => navigate('/flight-status')}>Flight Status</Button>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
                <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ padding: '10px', paddingBottom: '0px', marginTop: '0px' }}>
        <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>
            Track Your Flight
          </Typography>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/flight-status"
              element={isAuthenticated ? <FlightStatus /> : <Navigate to="/login" />}
            />
            <Route
              path="/"
              element={isAuthenticated ? <Navigate to="/flight-status" /> : <Navigate to="/login" />}
            />
          </Routes>
        </Paper>
      </Container>
    </>
  );
};

export default App;
