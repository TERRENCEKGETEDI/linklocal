import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Box textAlign="center">
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            color: '#FF6F00',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          Welcome to TechnoBytes
        </Typography>
        <Typography
          variant="h5"
          component="p"
          gutterBottom
          sx={{
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' }
          }}
        >
          Your platform for connecting with local services and tools.
        </Typography>
        <Typography
          variant="body1"
          component="p"
          sx={{
            mb: 4,
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
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