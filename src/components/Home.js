import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Box textAlign="center">
        <Typography variant="h2" component="h1" gutterBottom sx={{ color: '#FF6F00' }}>
          Welcome to TechnoBytes
        </Typography>
        <Typography variant="h5" component="p" gutterBottom>
          Your platform for connecting with local services and tools.
        </Typography>
        <Typography variant="body1" component="p" sx={{ mb: 4 }}>
          Discover, post, and request services in your community. From cleaning to tutoring, we've got you covered.
        </Typography>
        <Button variant="contained" color="primary" component={Link} to="/dashboard" sx={{ backgroundColor: '#FF6F00', '&:hover': { backgroundColor: '#E65100' } }}>
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default Home;