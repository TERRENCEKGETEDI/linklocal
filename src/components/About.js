import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Box textAlign="center" sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            color: '#FF6F00',
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
          }}
        >
          About Us
        </Typography>
        <Typography
          variant="h6"
          component="p"
          sx={{
            fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' }
          }}
        >
          Learn more about TechnoBytes and our mission.
        </Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: '#FFF3E0' }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#FF6F00' }}>
              Our Mission
            </Typography>
            <Typography variant="body1">
              At TechnoBytes, we aim to connect local service providers with customers in need. Whether you're looking for cleaning services, tutoring, or repairs, our platform makes it easy to find and connect with trusted professionals in your area.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: '#FFF3E0' }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#FF6F00' }}>
              Why Choose Us?
            </Typography>
            <Typography variant="body1">
              We prioritize quality, reliability, and community. Our platform features user reviews, secure payments, and a wide range of services to meet your needs. Join our growing community today!
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About;