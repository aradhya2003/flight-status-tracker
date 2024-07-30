import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../utils/auth'; 

const Register = () => {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(username, password); 
      if (response.ok) {
        navigate('/login'); 
      } else {
        const errorData = await response.json();
        setError(errorData.msg || 'Registration failed'); 
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" component="h1" align="center">
          Register
        </Typography>
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <TextField
            fullWidth
            label="Username" 
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
