import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { addServiceRequest } from '../dataService';
import { Button, Container, Typography, Box, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const serviceTypes = ['cleaning', 'repair', 'tutoring', 'gardening', 'other'];

const RequestService = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    serviceType: '',
    description: '',
    location: '',
    budget: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addServiceRequest({
        ...form,
        userId: currentUser.uid,
        status: 'pending'
      });
      toast.success('Service request submitted!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to submit service request');
      console.error('Error submitting service request:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          Request a Service
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Service Type</InputLabel>
            <Select name="serviceType" value={form.serviceType} onChange={handleChange} required>
              {serviceTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            multiline
            rows={4}
            value={form.description}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Budget (optional)"
            name="budget"
            type="number"
            value={form.budget}
            onChange={handleChange}
          />
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" sx={{ mr: 2 }}>
              Submit Request
            </Button>
            <Button variant="outlined" onClick={() => navigate('/')}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default RequestService;