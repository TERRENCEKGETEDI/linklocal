import React from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Divider } from '@mui/material';

const Schedule = () => {
  const events = [
    { date: '2025-01-15', event: 'Platform Launch Event' },
    { date: '2025-02-10', event: 'Community Meetup' },
    { date: '2025-03-05', event: 'Service Provider Workshop' },
    { date: '2025-04-20', event: 'Annual Conference' },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Box textAlign="center" sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#FF6F00' }}>
          Event Schedule
        </Typography>
        <Typography variant="h6" component="p">
          Stay updated with upcoming events and activities.
        </Typography>
      </Box>
      <List sx={{ backgroundColor: '#FFF3E0', borderRadius: 2 }}>
        {events.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText
                primary={<Typography variant="h6" sx={{ color: '#FF6F00' }}>{item.event}</Typography>}
                secondary={<Typography variant="body1">{item.date}</Typography>}
              />
            </ListItem>
            {index < events.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
};

export default Schedule;