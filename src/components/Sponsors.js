import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia } from '@mui/material';

const Sponsors = () => {
  const sponsors = [
    { name: 'TechCorp', logo: 'https://via.placeholder.com/150?text=TechCorp', description: 'Leading technology solutions provider.' },
    { name: 'Innovate Ltd', logo: 'https://via.placeholder.com/150?text=Innovate', description: 'Innovation in software development.' },
    { name: 'ByteWorks', logo: 'https://via.placeholder.com/150?text=ByteWorks', description: 'Digital transformation experts.' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      <Box textAlign="center" sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#FF6F00' }}>
          Our Sponsors
        </Typography>
        <Typography variant="h6" component="p">
          Thank you to our valued sponsors for their support.
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {sponsors.map((sponsor, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ backgroundColor: '#FFF3E0', textAlign: 'center' }}>
              <CardMedia
                component="img"
                height="140"
                image={sponsor.logo}
                alt={sponsor.name}
              />
              <CardContent>
                <Typography variant="h5" component="div" sx={{ color: '#FF6F00' }}>
                  {sponsor.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {sponsor.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Sponsors;