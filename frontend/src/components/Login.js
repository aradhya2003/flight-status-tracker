import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../utils/auth';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const success = await authenticateUser(username, password);
            if (success) {
                navigate('/flight-status'); 
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h5" component="h1" align="center">
                    Login
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
                        Login
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default Login;
