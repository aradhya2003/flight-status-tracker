import React, { useEffect, useState } from 'react';
import { Button, Typography, Container, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  
import UpdateFlightModal from './UpdateFlightModal';
import './FlightStatus.css';

const FlightStatus = () => {
    const [flights, setFlights] = useState([]);
    const [userRole, setUserRole] = useState('');
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserRole(role || '');

                if (role === 'admin') {
                    console.log('Admin role received');
                } else if (role === 'user') {
                    console.log('User role received');
                } else {
                    console.log('Unknown role received');
                }

                if (decodedToken.sub?.username === 'tehariaaradhya@gmail.com') {
                    console.log('User is authorized');
                }
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }

        fetch('http://localhost:5000/api/flight-status')
            .then(response => response.json())
            .then(data => {
                console.log('Flight Status Data:', data);
                setFlights(data.flights);
            })
            .catch(error => console.error('Error fetching flight status:', error));
    }, []);

    const handleUpdateFlight = (flightNumber) => {
        if (userRole === 'admin') {
            const flight = flights.find(f => f.flight === flightNumber);
            setSelectedFlight(flight);
            setIsModalOpen(true);
        } else {
            alert('Access denied. Admins only.');
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedFlight(null);
    };

    const handleFlightUpdate = (updatedFlight) => {
        setFlights(flights.map(f => (f.flight === updatedFlight.flight ? updatedFlight : f)));
        handleModalClose();
    };

    return (
        <Container component="main" maxWidth="lg">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h5" component="h1" align="center">
                    Flight Status
                </Typography>
                <Grid container spacing={2} style={{ marginTop: '20px' }}>
                    {flights.map(flight => (
                        <Grid item xs={12} sm={6} md={4} key={flight.flight}>
                            <Paper
                                elevation={2}
                                className={`flight-card ${flight.status.toLowerCase().replace(/\s+/g, '-')}`}
                                style={{ padding: '15px', marginBottom: '15px' }}
                            >
                                <Typography variant="h6">{flight.flight}</Typography>
                                <Typography variant="body1">Status: {flight.status}</Typography>
                                <Typography variant="body1">Gate: {flight.gate}</Typography>
                                <Typography variant="body1">Delay: {flight.delay ? `${flight.delay} minutes` : 'None'}</Typography>
                                {userRole === 'admin' && (
                                    <Button
                                        onClick={() => handleUpdateFlight(flight.flight)}
                                        variant="contained"
                                        color="primary"
                                        style={{ marginTop: '10px' }}
                                    >
                                        Update Flight Status
                                    </Button>
                                )}
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
            {selectedFlight && (
                <UpdateFlightModal
                    open={isModalOpen}
                    handleClose={handleModalClose}
                    flight={selectedFlight}
                    handleUpdate={handleFlightUpdate}
                />
            )}
        </Container>
    );
};

export default FlightStatus;
