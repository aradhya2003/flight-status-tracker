import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const UpdateFlightModal = ({ open, handleClose, flight, handleUpdate }) => {
    const [status, setStatus] = useState(flight.status);
    const [gate, setGate] = useState(flight.gate);
    const [delay, setDelay] = useState(flight.delay);

    const handleSubmit = async () => {
        const updatedFlight = { ...flight, status, gate, delay };

        try {
            const response = await fetch('http://localhost:5000/api/insert-or-update-flight', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(updatedFlight),
            });

            if (response.ok) {
                const result = await response.json();
                handleUpdate(updatedFlight);
                handleClose();
            } else {
                console.error('Failed to update flight');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                p: 4,
                boxShadow: 24,
            }}>
                <Typography variant="h6" component="h2">
                    Update Flight Status
                </Typography>
                <TextField
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Gate"
                    value={gate}
                    onChange={(e) => setGate(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Delay"
                    value={delay}
                    onChange={(e) => setDelay(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth>
                    Update
                </Button>
            </Box>
        </Modal>
    );
};

export default UpdateFlightModal;
