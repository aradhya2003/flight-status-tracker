import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { format, parseISO } from 'date-fns';
import './FlightStatus.css';

const FlightStatus = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/flight-status');
        setFlights(response.data.flights);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching flight status:', error);
        setError('Failed to fetch flight status.');
        setLoading(false);
      }
    };

    const intervalId = setInterval(fetchStatus, 500); 

    fetchStatus(); 

    return () => clearInterval(intervalId); 
  }, []);

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'cancelled':
        return 'cancelled';
      case 'delayed':
        return 'delayed';
      case 'on time':
        return 'ontime';
      default:
        return '';
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center" style={{ margin: '20px 0' }}>
        Flight Status
      </Typography>
      {loading ? (
        <CircularProgress style={{ display: 'block', margin: 'auto', marginTop: '50px' }} />
      ) : error ? (
        <Alert severity="error" style={{ marginTop: '20px' }}>
          {error}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {flights.length > 0 ? (
            flights.map((flight, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card className={`flight-card ${getStatusClass(flight.status)}`}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Flight {flight.flight}
                    </Typography>
                    <div className="flight-info">
                      <Typography className="key">Status:</Typography>
                      <Typography className="value">{flight.status}</Typography>
                    </div>
                    {flight.delay && (
                      <div className="flight-info">
                        <Typography className="key">Delay:</Typography>
                        <Typography className="value">{flight.delay} minutes</Typography>
                      </div>
                    )}
                    <div className="flight-info">
                      <Typography className="key">Departure:</Typography>
                      <Typography className="value">
                        {format(parseISO(flight.departure), 'MMMM dd, yyyy HH:mm')}
                      </Typography>
                    </div>
                    <div className="flight-info">
                      <Typography className="key">Arrival:</Typography>
                      <Typography className="value">
                        {format(parseISO(flight.arrival), 'MMMM dd, yyyy HH:mm')}
                      </Typography>
                    </div>
                    <div className="flight-info">
                      <Typography className="key">Gate:</Typography>
                      <Typography className="value">
                        {flight.gate}
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" align="center" style={{ width: '100%' }}>
              No flights available.
            </Typography>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default FlightStatus;
