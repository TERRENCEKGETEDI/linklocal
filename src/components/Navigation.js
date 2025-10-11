import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar, Drawer, List, ListItem, ListItemButton, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import { AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '../AuthContext';

const Navigation = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    handleClose();
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#FF6F00' }}>
      <Toolbar>
        <Avatar src="/linklocal.jpg" sx={{ mr: 2, width: 40, height: 40 }} alt="LinkLocal Icon" />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          TechnoBytes
        </Typography>
        {isMobile ? (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary" component={NavLink} to="/" exact>
              Home
            </Button>
            <Button variant="contained" color="primary" component={NavLink} to="/about">
              About Us
            </Button>
            <Button variant="contained" color="primary" component={NavLink} to="/schedule">
              Schedule
            </Button>
            <Button variant="contained" color="primary" component={NavLink} to="/sponsors">
              Sponsors
            </Button>
            <Button variant="contained" color="primary" component={NavLink} to="/contact">
              Contact
            </Button>
          </Box>
        )}
        {currentUser && (
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled>
                <Typography variant="body2">
                  Username: {currentUser.displayName || 'N/A'}
                </Typography>
              </MenuItem>
              <MenuItem disabled>
                <Typography variant="body2">
                  Email: {currentUser.email}
                </Typography>
              </MenuItem>
              <MenuItem disabled>
                <Typography variant="body2">
                  Account Created: {currentUser.metadata ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'N/A'}
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography variant="body2">Logout</Typography>
              </MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <List sx={{ width: 250 }}>
          <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/" onClick={toggleDrawer(false)}>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/about" onClick={toggleDrawer(false)}>
              <ListItemText primary="About Us" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/schedule" onClick={toggleDrawer(false)}>
              <ListItemText primary="Schedule" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/sponsors" onClick={toggleDrawer(false)}>
              <ListItemText primary="Sponsors" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/contact" onClick={toggleDrawer(false)}>
              <ListItemText primary="Contact" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navigation;