import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { getServiceRequests, getPosts, getOffers, addOffer, updateOffer, addNotification, getUsers } from '../dataService';
import { Button, Container, Typography, Box, Grid, Card, CardContent, CardActions, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { toast } from 'react-toastify';

const ServiceRequests = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [posts, setPosts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [users, setUsers] = useState([]);
  const [openOfferDialog, setOpenOfferDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [offerForm, setOfferForm] = useState({ message: '', price: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const allRequests = await getServiceRequests();
        const allPosts = await getPosts();
        const allOffers = await getOffers();
        const allUsers = await getUsers();
        setRequests(allRequests);
        setPosts(allPosts);
        setOffers(allOffers);
        setUsers(allUsers);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      }
    };
    loadData();
  }, []);

  const getPost = (postId) => posts.find(p => p.id === postId);
  const getUser = (userId) => users.find(u => u.id === userId);
  const getOffersForRequest = (requestId) => offers.filter(o => o.requestId === requestId);

  const handleOfferSubmit = async () => {
    try {
      const request = requests.find(r => r.id === selectedRequest);
      const post = getPost(request.postId);
      await addOffer({
        requestId: selectedRequest,
        userId: currentUser.uid,
        message: offerForm.message,
        price: offerForm.price,
        status: 'pending'
      });
      // Notify the service owner
      await addNotification({
        userId: post.userId,
        message: `New offer for your service: ${post.title}`,
        type: 'offer'
      });
      toast.success('Offer submitted!');
      setOpenOfferDialog(false);
      setOfferForm({ message: '', price: '' });
      // Reload offers
      const allOffers = await getOffers();
      setOffers(allOffers);
    } catch (error) {
      toast.error('Failed to submit offer');
      console.error('Error submitting offer:', error);
    }
  };

  const handleAcceptOffer = async (offerId) => {
    try {
      await updateOffer(offerId, { status: 'accepted' });
      // Notify the offerer
      const offer = offers.find(o => o.id === offerId);
      await addNotification({
        userId: offer.userId,
        message: 'Your offer has been accepted!',
        type: 'offer_accepted'
      });
      toast.success('Offer accepted!');
      // Reload offers
      const allOffers = await getOffers();
      setOffers(allOffers);
    } catch (error) {
      toast.error('Failed to accept offer');
      console.error('Error accepting offer:', error);
    }
  };

  const handleRejectOffer = async (offerId) => {
    try {
      await updateOffer(offerId, { status: 'rejected' });
      // Notify the offerer
      const offer = offers.find(o => o.id === offerId);
      await addNotification({
        userId: offer.userId,
        message: 'Your offer has been rejected.',
        type: 'offer_rejected'
      });
      toast.success('Offer rejected!');
      // Reload offers
      const allOffers = await getOffers();
      setOffers(allOffers);
    } catch (error) {
      toast.error('Failed to reject offer');
      console.error('Error rejecting offer:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ backgroundColor: '#FAFAFA', minHeight: '100vh', py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#FF6F00', fontWeight: 'bold', textAlign: 'center' }}>
        Service Requests
      </Typography>
      <Grid container spacing={3}>
        {requests.map(request => {
          const post = getPost(request.postId);
          const requester = getUser(request.userId);
          const requestOffers = getOffersForRequest(request.id);
          return (
            <Grid item xs={12} key={request.id}>
              <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardContent sx={{ backgroundColor: '#FFF3E0' }}>
                  <Typography variant="h6" sx={{ color: '#FF6F00', fontWeight: 'bold' }}>
                    Request for: {post ? post.title : 'Unknown Service'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Requested by: {requester ? requester.name : 'Unknown'}
                  </Typography>
                  <Typography>Description: {request.description}</Typography>
                  <Typography>Location: {request.location}</Typography>
                  <Typography>Budget: ${request.budget}</Typography>
                  <Typography>Status: {request.status}</Typography>
                  {requestOffers.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6">Offers:</Typography>
                      {requestOffers.map(offer => {
                        const offerer = getUser(offer.userId);
                        return (
                          <Box key={offer.id} sx={{ border: '1px solid #ddd', p: 1, mb: 1, borderRadius: 1 }}>
                            <Typography>From: {offerer ? offerer.name : 'Unknown'}</Typography>
                            <Typography>Message: {offer.message}</Typography>
                            <Typography>Price: ${offer.price}</Typography>
                            <Typography>Status: {offer.status}</Typography>
                            {request.userId === currentUser.uid && offer.status === 'pending' && (
                              <Box sx={{ mt: 1 }}>
                                <Button size="small" color="primary" onClick={() => handleAcceptOffer(offer.id)}>Accept</Button>
                                <Button size="small" color="error" onClick={() => handleRejectOffer(offer.id)}>Reject</Button>
                              </Box>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  {request.userId !== currentUser.uid && (
                    <Button size="small" sx={{ color: '#4CAF50' }} onClick={() => { setSelectedRequest(request.id); setOpenOfferDialog(true); }}>
                      Make Offer
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Offer Dialog */}
      <Dialog open={openOfferDialog} onClose={() => setOpenOfferDialog(false)}>
        <DialogTitle sx={{ color: '#FF6F00' }}>Make an Offer</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="Message" multiline rows={3} value={offerForm.message} onChange={(e) => setOfferForm({...offerForm, message: e.target.value})} />
          <TextField fullWidth margin="normal" label="Your Price" type="number" value={offerForm.price} onChange={(e) => setOfferForm({...offerForm, price: e.target.value})} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOfferDialog(false)}>Cancel</Button>
          <Button sx={{ backgroundColor: '#FF6F00', '&:hover': { backgroundColor: '#E65100' } }} variant="contained" onClick={handleOfferSubmit}>Submit Offer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ServiceRequests;