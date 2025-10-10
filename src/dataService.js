import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// Firestore collections
const usersCollection = collection(db, 'users');
const postsCollection = collection(db, 'posts');
const toolRequestsCollection = collection(db, 'toolRequests');
const serviceRequestsCollection = collection(db, 'serviceRequests');
const offersCollection = collection(db, 'offers');
const notificationsCollection = collection(db, 'notifications');

export const getUsers = async () => {
  const querySnapshot = await getDocs(usersCollection);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
export const getPosts = async () => {
  const querySnapshot = await getDocs(postsCollection);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
export const getToolRequests = async () => {
  const querySnapshot = await getDocs(toolRequestsCollection);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getServiceRequests = async () => {
  const querySnapshot = await getDocs(serviceRequestsCollection);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addUser = async (user) => {
  await addDoc(usersCollection, user);
};

export const updateUser = async (id, updates) => {
  const userDoc = doc(db, 'users', id);
  await updateDoc(userDoc, updates);
};

export const deleteUser = async (id) => {
  const userDoc = doc(db, 'users', id);
  await deleteDoc(userDoc);
};

export const addPost = async (post) => {
  await addDoc(postsCollection, { ...post, createdAt: new Date().toISOString() });
};

export const updatePost = async (id, updates) => {
  const postDoc = doc(db, 'posts', id);
  await updateDoc(postDoc, updates);
};

export const deletePost = async (id) => {
  const postDoc = doc(db, 'posts', id);
  await updateDoc(postDoc, { deleted: true });
};

export const addToolRequest = async (request) => {
  await addDoc(toolRequestsCollection, { ...request, submittedAt: new Date().toISOString() });
};

export const updateToolRequest = async (id, updates) => {
  const toolRequestDoc = doc(db, 'toolRequests', id);
  await updateDoc(toolRequestDoc, updates);
};

export const addServiceRequest = async (request) => {
  await addDoc(serviceRequestsCollection, { ...request, submittedAt: new Date().toISOString() });
};

export const deleteServiceRequest = async (id) => {
  const serviceRequestDoc = doc(db, 'serviceRequests', id);
  await deleteDoc(serviceRequestDoc);
};

export const updateServiceRequest = async (id, updates) => {
  const serviceRequestDoc = doc(db, 'serviceRequests', id);
  await updateDoc(serviceRequestDoc, updates);
};

export const getOffers = async () => {
  const querySnapshot = await getDocs(offersCollection);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addOffer = async (offer) => {
  await addDoc(offersCollection, { ...offer, submittedAt: new Date().toISOString() });
};

export const updateOffer = async (id, updates) => {
  const offerDoc = doc(db, 'offers', id);
  await updateDoc(offerDoc, updates);
};

export const deleteOffer = async (id) => {
  const offerDoc = doc(db, 'offers', id);
  await deleteDoc(offerDoc);
};

export const getNotifications = async (userId) => {
  const querySnapshot = await getDocs(notificationsCollection);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(n => n.userId === userId);
};

export const addNotification = async (notification) => {
  await addDoc(notificationsCollection, { ...notification, createdAt: new Date().toISOString(), read: false });
};

export const updateNotification = async (id, updates) => {
  const notificationDoc = doc(db, 'notifications', id);
  await updateDoc(notificationDoc, updates);
};

export const deleteNotification = async (id) => {
  const notificationDoc = doc(db, 'notifications', id);
  await deleteDoc(notificationDoc);
};