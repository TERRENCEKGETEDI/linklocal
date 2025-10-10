import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { getPosts, addPost, updatePost, deletePost, addToolRequest, addServiceRequest, addNotification, getNotifications, updateNotification } from '../dataService';
import seedData from '../seedData';
import { Button, Container, Typography, Box, Grid, Card, CardContent, CardActions, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { toast } from 'react-toastify';

const categories = ['cleaning', 'repair', 'tutoring', 'other'];

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [openToolDialog, setOpenToolDialog] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [postForm, setPostForm] = useState({ title: '', description: '', category: '', price: '', priceUnit: 'per hour', location: '', availability: '' });
  const [toolForm, setToolForm] = useState({ toolName: '', description: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        let allPosts = await getPosts();

        // If no posts exist, seed the data
        if (allPosts.length === 0) {
          const seedSuccess = await seedData();
          if (seedSuccess) {
            allPosts = await getPosts();
          } else {
            toast.error('Failed to load initial data');
            setLoading(false);
            return;
          }
        }

        const activePosts = allPosts.filter(p => !p.deleted);
        setPosts(activePosts);
        setFilteredPosts(activePosts);
        const userNotifications = await getNotifications(currentUser.uid);
        setNotifications(userNotifications);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentUser.uid]);

  useEffect(() => {
    let filtered = posts;
    if (searchTerm) {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory, posts]);

  const handlePostSubmit = async () => {
    try {
      if (editingPost) {
        await updatePost(editingPost.id, postForm);
        toast.success('Post updated!');
      } else {
        await addPost({ ...postForm, userId: currentUser.uid, rating: 0, likes: 0, favorites: [], reports: [] });
        toast.success('Post created!');
      }
      // Reload posts
      const allPosts = await getPosts();
      const activePosts = allPosts.filter(p => !p.deleted);
      setPosts(activePosts);
      setFilteredPosts(activePosts);
      setOpenPostDialog(false);
      setEditingPost(null);
      setPostForm({ title: '', description: '', category: '', price: '', priceUnit: 'per hour', location: '', availability: '' });
    } catch (error) {
      toast.error('Failed to save post');
      console.error('Error saving post:', error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await deletePost(id);
      const allPosts = await getPosts();
      const activePosts = allPosts.filter(p => !p.deleted);
      setPosts(activePosts);
      setFilteredPosts(activePosts);
      toast.success('Post deleted!');
    } catch (error) {
      toast.error('Failed to delete post');
      console.error('Error deleting post:', error);
    }
  };

  const handleToolSubmit = async () => {
    try {
      await addToolRequest({ ...toolForm, userId: currentUser.uid, status: 'pending' });
      toast.success('Tool request submitted!');
      setOpenToolDialog(false);
      setToolForm({ toolName: '', description: '' });
    } catch (error) {
      toast.error('Failed to submit tool request');
      console.error('Error submitting tool request:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const post = posts.find(p => p.id === postId);
      const isLiked = post.likes > 0; // Simplified
      await updatePost(postId, { likes: isLiked ? post.likes - 1 : post.likes + 1 });
      const allPosts = await getPosts();
      const activePosts = allPosts.filter(p => !p.deleted);
      setPosts(activePosts);
      setFilteredPosts(activePosts);
    } catch (error) {
      toast.error('Failed to update like');
      console.error('Error updating like:', error);
    }
  };

  const handleFavorite = async (postId) => {
    try {
      const post = posts.find(p => p.id === postId);
      const isFavorited = post.favorites.includes(currentUser.uid);
      const newFavorites = isFavorited ? post.favorites.filter(id => id !== currentUser.uid) : [...post.favorites, currentUser.uid];
      await updatePost(postId, { favorites: newFavorites });
      const allPosts = await getPosts();
      const activePosts = allPosts.filter(p => !p.deleted);
      setPosts(activePosts);
      setFilteredPosts(activePosts);
    } catch (error) {
      toast.error('Failed to update favorite');
      console.error('Error updating favorite:', error);
    }
  };

  const handleReport = async (postId) => {
    try {
      const post = posts.find(p => p.id === postId);
      await updatePost(postId, { reports: [...post.reports, currentUser.uid] });
      toast.success('Post reported!');
    } catch (error) {
      toast.error('Failed to report post');
      console.error('Error reporting post:', error);
    }
  };

  const handleRequest = async (post) => {
    try {
      const request = {
        postId: post.id,
        userId: currentUser.uid,
        description: `Request for ${post.title}`,
        location: post.location,
        budget: post.price,
        status: 'pending'
      };
      await addServiceRequest(request);
      // Notify the post owner
      await addNotification({
        userId: post.userId,
        message: `New request for your service: ${post.title}`,
        type: 'request'
      });
      toast.success('Service requested!');
    } catch (error) {
      toast.error('Failed to request service');
      console.error('Error requesting service:', error);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await updateNotification(id, { read: true });
      const userNotifications = await getNotifications(currentUser.uid);
      setNotifications(userNotifications);
    } catch (error) {
      toast.error('Failed to mark as read');
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ backgroundColor: '#FAFAFA', minHeight: '100vh', py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#FF6F00', fontWeight: 'bold' }}>
          Service Platform Dashboard
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={logout} sx={{ borderColor: '#FF6F00', color: '#FF6F00', '&:hover': { backgroundColor: '#FFF3E0' } }}>Logout</Button>
          {currentUser.role === 'admin' && (
            <Button variant="contained" sx={{ backgroundColor: '#FF6F00', '&:hover': { backgroundColor: '#E65100' } }} onClick={() => window.location.href = '/admin'}>Admin Panel</Button>
          )}
        </Box>
      </Box>

      {notifications.filter(n => !n.read).length > 0 && (
        <Box sx={{ mb: 4, p: 2, backgroundColor: '#E3F2FD', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ color: '#1976D2' }}>Notifications</Typography>
          {notifications.filter(n => !n.read).map(notification => (
            <Box key={notification.id} sx={{ mb: 1, p: 1, backgroundColor: 'white', borderRadius: 1 }}>
              <Typography>{notification.message}</Typography>
              <Button size="small" onClick={() => handleMarkRead(notification.id)}>Mark as Read</Button>
            </Box>
          ))}
        </Box>
      )}

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, p: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}>
        <TextField
          label="Search services"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </Select>
        </FormControl>
        <Button variant="contained" sx={{ backgroundColor: '#FF6F00', '&:hover': { backgroundColor: '#E65100' } }} onClick={() => setOpenPostDialog(true)}>Post Service</Button>
        <Button variant="contained" sx={{ backgroundColor: '#FF6F00', '&:hover': { backgroundColor: '#E65100' } }} onClick={() => window.location.href = '/request-service'}>Request Service</Button>
        <Button variant="contained" sx={{ backgroundColor: '#FF6F00', '&:hover': { backgroundColor: '#E65100' } }} onClick={() => window.location.href = '/service-requests'}>View Requests</Button>
        <Button variant="contained" sx={{ backgroundColor: '#FF6F00', '&:hover': { backgroundColor: '#E65100' } }} onClick={() => setOpenToolDialog(true)}>Request Tool</Button>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography>Loading posts...</Typography>
            </Box>
          </Grid>
        ) : filteredPosts.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography>No posts found. Try adjusting your search or category filter.</Typography>
            </Box>
          </Grid>
        ) : (
          filteredPosts.map(post => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card sx={{ boxShadow: 3, borderRadius: 2, '&:hover': { boxShadow: 6 } }}>
                <CardContent sx={{ backgroundColor: '#FFF3E0' }}>
                  <Typography variant="h6" sx={{ color: '#FF6F00', fontWeight: 'bold' }}>{post.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{post.description}</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>Price: ${post.price} {post.priceUnit}</Typography>
                  <Typography>Location: {post.location}</Typography>
                  <Typography>Rating: {post.rating} stars</Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Button size="small" sx={{ color: '#FF6F00' }} onClick={() => handleLike(post.id)}>Like ({post.likes})</Button>
                  <Button size="small" sx={{ color: '#FF6F00' }} onClick={() => handleFavorite(post.id)}>Favorite</Button>
                  <Button size="small" sx={{ color: '#4CAF50' }} onClick={() => handleRequest(post)}>Request</Button>
                  <Button size="small" color="error" onClick={() => handleReport(post.id)}>Report</Button>
                  {post.userId === currentUser.uid && (
                    <>
                      <Button size="small" sx={{ color: '#FF6F00' }} onClick={() => { setEditingPost(post); setPostForm(post); setOpenPostDialog(true); }}>Edit</Button>
                      <Button size="small" color="error" onClick={() => handleDeletePost(post.id)}>Delete</Button>
                    </>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Post Dialog */}
      <Dialog open={openPostDialog} onClose={() => setOpenPostDialog(false)}>
        <DialogTitle>{editingPost ? 'Edit Post' : 'Create Post'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="Title" value={postForm.title} onChange={(e) => setPostForm({...postForm, title: e.target.value})} />
          <TextField fullWidth margin="normal" label="Description" multiline rows={3} value={postForm.description} onChange={(e) => setPostForm({...postForm, description: e.target.value})} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select value={postForm.category} onChange={(e) => setPostForm({...postForm, category: e.target.value})}>
              {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth margin="normal" label="Price" type="number" value={postForm.price} onChange={(e) => setPostForm({...postForm, price: e.target.value})} />
          <TextField fullWidth margin="normal" label="Price Unit" value={postForm.priceUnit} onChange={(e) => setPostForm({...postForm, priceUnit: e.target.value})} />
          <TextField fullWidth margin="normal" label="Location" value={postForm.location} onChange={(e) => setPostForm({...postForm, location: e.target.value})} />
          <TextField fullWidth margin="normal" label="Availability" value={postForm.availability} onChange={(e) => setPostForm({...postForm, availability: e.target.value})} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPostDialog(false)}>Cancel</Button>
          <Button sx={{ backgroundColor: '#FF6F00', '&:hover': { backgroundColor: '#E65100' } }} variant="contained" onClick={handlePostSubmit}>{editingPost ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      {/* Tool Request Dialog */}
      <Dialog open={openToolDialog} onClose={() => setOpenToolDialog(false)}>
        <DialogTitle sx={{ color: '#FF6F00' }}>Request Tool</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="Tool Name" value={toolForm.toolName} onChange={(e) => setToolForm({...toolForm, toolName: e.target.value})} />
          <TextField fullWidth margin="normal" label="Description" multiline rows={3} value={toolForm.description} onChange={(e) => setToolForm({...toolForm, description: e.target.value})} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenToolDialog(false)}>Cancel</Button>
          <Button sx={{ backgroundColor: '#FF6F00', '&:hover': { backgroundColor: '#E65100' } }} variant="contained" onClick={handleToolSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;