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
  const [openRatingDialog, setOpenRatingDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [offerForm, setOfferForm] = useState({ message: '', price: '' });
  const [ratingForm, setRatingForm] = useState({ rating: 0, review: '' });

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

  const handleMarkCompleted = async (offerId) => {
    try {
      await updateOffer(offerId, { status: 'completed' });
      toast.success('Service marked as completed!');
      // Reload offers
      const allOffers = await getOffers();
      setOffers(allOffers);
    } catch (error) {
      toast.error('Failed to mark as completed');
      console.error('Error marking as completed:', error);
    }
  };

  const handleRatingSubmit = async () => {
    try {
      await updateOffer(selectedOffer, { rating: ratingForm.rating, review: ratingForm.review });
      toast.success('Rating submitted!');
      setOpenRatingDialog(false);
      setRatingForm({ rating: 0, review: '' });
      // Reload offers
      const allOffers = await getOffers();
      setOffers(allOffers);
    } catch (error) {
      toast.error('Failed to submit rating');
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ backgroundColor: '#FAFAFA', minHeight: '100vh', py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          color: '#FF6F00',
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
        }}
      >
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
                  <Typography>Budget: R{request.budget}</Typography>
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
                            {offer.rating && (
                              <Typography>Rating: {offer.rating}/5 {offer.review && `- ${offer.review}`}</Typography>
                            )}
                            {request.userId === currentUser.uid && offer.status === 'pending' && (
                              <Box sx={{ mt: 1 }}>
                                <Button size="small" color="primary" onClick={() => handleAcceptOffer(offer.id)}>Accept</Button>
                                <Button size="small" color="error" onClick={() => handleRejectOffer(offer.id)}>Reject</Button>
                              </Box>
                            )}
                            {request.userId === currentUser.uid && offer.status === 'accepted' && (
                              <Box sx={{ mt: 1 }}>
                                <Button size="small" color="secondary" onClick={() => handleMarkCompleted(offer.id)}>Mark as Completed</Button>
                              </Box>
                            )}
                            {request.userId === currentUser.uid && offer.status === 'completed' && !offer.rating && (
                              <Box sx={{ mt: 1 }}>
                                <Button size="small" color="primary" onClick={() => { setSelectedOffer(offer.id); setOpenRatingDialog(true); }}>Rate Service</Button>
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

      {/* Rating Dialog */}
      <Dialog open={openRatingDialog} onClose={() => setOpenRatingDialog(false)}>
        <DialogTitle sx={{ color: '#FF6F00' }}>Rate the Service</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="Rating (1-5)" type="number" inputProps={{ min: 1, max: 5 }} value={ratingForm.rating} onChange={(e) => setRatingForm({...ratingForm, rating: parseInt(e.target.value)})} />
          <TextField fullWidth margin="normal" label="Review (optional)" multiline rows={3} value={ratingForm.review} onChange={(e) => setRatingForm({...ratingForm, review: e.target.value})} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRatingDialog(false)}>Cancel</Button>
          <Button sx={{ backgroundColor: '#FF6F00', '&:hover': { backgroundColor: '#E65100' } }} variant="contained" onClick={handleRatingSubmit}>Submit Rating</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ServiceRequests;