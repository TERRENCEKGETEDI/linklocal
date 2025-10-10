import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { getUsers, updateUser, deleteUser, getPosts, updatePost, deletePost, getToolRequests, updateToolRequest } from '../dataService';
import { Button, Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [toolRequests, setToolRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'user', blocked: false, badges: [], points: 0 });

  useEffect(() => {
    setUsers(getUsers());
    setPosts(getPosts());
    setToolRequests(getToolRequests());
    setFilteredUsers(getUsers());
    setFilteredPosts(getPosts());
    setFilteredRequests(getToolRequests());
  }, []);

  useEffect(() => {
    setFilteredUsers(users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())));
    setFilteredPosts(posts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())));
    setFilteredRequests(toolRequests.filter(r => r.toolName.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm, users, posts, toolRequests]);

  const handleUserSubmit = () => {
    if (editingUser) {
      updateUser(editingUser.id, userForm);
      setUsers(getUsers());
      toast.success('User updated!');
    } else {
      // Add new user logic, but since Firebase, perhaps not
      toast.info('Adding new users should be done via Firebase Auth');
    }
    setOpenUserDialog(false);
    setEditingUser(null);
    setUserForm({ name: '', email: '', role: 'user', blocked: false, badges: [], points: 0 });
  };

  const handleBlockUser = (id) => {
    const user = users.find(u => u.id === id);
    updateUser(id, { blocked: !user.blocked });
    setUsers(getUsers());
    toast.success(user.blocked ? 'User unblocked!' : 'User blocked!');
  };

  const handleDeleteUser = (id) => {
    deleteUser(id);
    setUsers(getUsers());
    toast.success('User deleted!');
  };

  const handleDeletePost = (id) => {
    deletePost(id);
    setPosts(getPosts());
    toast.success('Post deleted!');
  };

  const handleRepost = (id) => {
    updatePost(id, { deleted: false });
    setPosts(getPosts());
    toast.success('Post reposted!');
  };

  const handleApproveRequest = (id) => {
    updateToolRequest(id, { status: 'approved' });
    setToolRequests(getToolRequests());
    toast.success('Request approved!');
  };

  const handleDenyRequest = (id) => {
    updateToolRequest(id, { status: 'denied' });
    setToolRequests(getToolRequests());
    toast.success('Request denied!');
  };

  const handleAssignBadge = (userId, badge) => {
    const user = users.find(u => u.id === userId);
    const newBadges = user.badges.includes(badge) ? user.badges.filter(b => b !== badge) : [...user.badges, badge];
    updateUser(userId, { badges: newBadges });
    setUsers(getUsers());
    toast.success('Badge assigned!');
  };

  const handleGiveReward = (userId, points) => {
    const user = users.find(u => u.id === userId);
    updateUser(userId, { points: user.points + points });
    setUsers(getUsers());
    toast.success('Reward given!');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Button variant="outlined" onClick={logout}>Logout</Button>
        <Button variant="contained" sx={{ ml: 2 }} onClick={() => window.location.href = '/'}>User Dashboard</Button>
      </Box>

      <TextField
        label="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
      />

      {/* Users Management */}
      <Typography variant="h5" gutterBottom>Users</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => setOpenUserDialog(true)}>Add User</Button>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Blocked</TableCell>
              <TableCell>Badges</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.blocked ? 'Yes' : 'No'}</TableCell>
                <TableCell>{user.badges.join(', ')}</TableCell>
                <TableCell>{user.points}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleBlockUser(user.id)}>{user.blocked ? 'Unblock' : 'Block'}</Button>
                  <Button size="small" onClick={() => { setEditingUser(user); setUserForm(user); setOpenUserDialog(true); }}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                  <Button size="small" onClick={() => handleAssignBadge(user.id, 'verified')}>Assign Verified</Button>
                  <Button size="small" onClick={() => handleGiveReward(user.id, 10)}>Give 10 Points</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Posts Management */}
      <Typography variant="h5" gutterBottom>Posts</Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Deleted</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPosts.map(post => (
              <TableRow key={post.id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{users.find(u => u.id === post.userId)?.name}</TableCell>
                <TableCell>{post.deleted ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button size="small" color="error" onClick={() => handleDeletePost(post.id)}>Delete</Button>
                  {post.deleted && <Button size="small" onClick={() => handleRepost(post.id)}>Repost</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Tool Requests */}
      <Typography variant="h5" gutterBottom>Tool Requests</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tool Name</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.map(request => (
              <TableRow key={request.id}>
                <TableCell>{request.toolName}</TableCell>
                <TableCell>{users.find(u => u.id === request.userId)?.name}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>
                  {request.status === 'pending' && (
                    <>
                      <Button size="small" onClick={() => handleApproveRequest(request.id)}>Approve</Button>
                      <Button size="small" color="error" onClick={() => handleDenyRequest(request.id)}>Deny</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* User Dialog */}
      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)}>
        <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="Name" value={userForm.name} onChange={(e) => setUserForm({...userForm, name: e.target.value})} />
          <TextField fullWidth margin="normal" label="Email" value={userForm.email} onChange={(e) => setUserForm({...userForm, email: e.target.value})} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select value={userForm.role} onChange={(e) => setUserForm({...userForm, role: e.target.value})}>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth margin="normal" label="Points" type="number" value={userForm.points} onChange={(e) => setUserForm({...userForm, points: parseInt(e.target.value)})} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserDialog(false)}>Cancel</Button>
          <Button onClick={handleUserSubmit}>{editingUser ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;