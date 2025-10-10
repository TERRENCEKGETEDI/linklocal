import React from 'react';
import { Box, Typography, Container, Grid, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#FF6F00', color: 'white', mt: 8, py: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              TechnoBytes
            </Typography>
            <Typography variant="body2">
              Connecting you with local services and tools.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/" color="inherit" variant="body2" display="block">Home</Link>
            <Link href="/about" color="inherit" variant="body2" display="block">About Us</Link>
            <Link href="/contact" color="inherit" variant="body2" display="block">Contact</Link>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact Info
            </Typography>
            <Typography variant="body2">
              Email: info@technobytes.com<br />
              Phone: +1 (123) 456-7890
            </Typography>
          </Grid>
        </Grid>
        <Box textAlign="center" sx={{ mt: 3 }}>
          <Typography variant="body2">
            © 2025 TechnoBytes. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;