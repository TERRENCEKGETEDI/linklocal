import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useAuth } from '../AuthContext';

const Navigation = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

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

  return (
    <AppBar position="static" sx={{ backgroundColor: '#FF6F00' }}>
      <Toolbar>
        <Avatar src="/linklocal.jpg" sx={{ mr: 2, width: 40, height: 40 }} alt="LinkLocal Icon" />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          TechnoBytes
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={NavLink} to="/" exact>
            Home
          </Button>
          <Button color="inherit" component={NavLink} to="/about">
            About Us
          </Button>
          <Button color="inherit" component={NavLink} to="/schedule">
            Schedule
          </Button>
          <Button color="inherit" component={NavLink} to="/sponsors">
            Sponsors
          </Button>
          <Button color="inherit" component={NavLink} to="/contact">
            Contact
          </Button>
        </Box>
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
    </AppBar>
  );
};

export default Navigation;