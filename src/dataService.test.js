import {
  getUsers,
  getPosts,
  getServiceRequests,
  addServiceRequest,
  getOffers,
  addOffer,
  getNotifications,
  addNotification
} from './dataService';

// Mock Firebase
jest.mock('./firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}));

import { collection, getDocs, addDoc, doc } from 'firebase/firestore';

describe('dataService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    test('returns users data', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ name: 'User 1', email: 'user1@example.com' }) },
        { id: '2', data: () => ({ name: 'User 2', email: 'user2@example.com' }) },
      ];
      const mockQuerySnapshot = { docs: mockDocs };
      getDocs.mockResolvedValue(mockQuerySnapshot);

      const users = await getUsers();
      expect(getDocs).toHaveBeenCalledWith(collection());
      expect(users).toEqual([
        { id: '1', name: 'User 1', email: 'user1@example.com' },
        { id: '2', name: 'User 2', email: 'user2@example.com' },
      ]);
    });
  });

  describe('getPosts', () => {
    test('returns posts data', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ title: 'Post 1', description: 'Desc 1' }) },
      ];
      const mockQuerySnapshot = { docs: mockDocs };
      getDocs.mockResolvedValue(mockQuerySnapshot);

      const posts = await getPosts();
      expect(getDocs).toHaveBeenCalledWith(collection());
      expect(posts).toEqual([
        { id: '1', title: 'Post 1', description: 'Desc 1' },
      ]);
    });
  });

  describe('getServiceRequests', () => {
    test('returns service requests data', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ serviceType: 'cleaning', status: 'pending' }) },
      ];
      const mockQuerySnapshot = { docs: mockDocs };
      getDocs.mockResolvedValue(mockQuerySnapshot);

      const requests = await getServiceRequests();
      expect(getDocs).toHaveBeenCalledWith(collection());
      expect(requests).toEqual([
        { id: '1', serviceType: 'cleaning', status: 'pending' },
      ]);
    });
  });

  describe('addServiceRequest', () => {
    test('adds service request with timestamp', async () => {
      const requestData = { serviceType: 'repair', description: 'Fix sink' };
      addDoc.mockResolvedValue({});

      await addServiceRequest(requestData);
      expect(addDoc).toHaveBeenCalledWith(collection(), {
        ...requestData,
        submittedAt: expect.any(String),
      });
    });
  });

  describe('getOffers', () => {
    test('returns offers data', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ message: 'Offer 1', price: '50' }) },
      ];
      const mockQuerySnapshot = { docs: mockDocs };
      getDocs.mockResolvedValue(mockQuerySnapshot);

      const offers = await getOffers();
      expect(getDocs).toHaveBeenCalledWith(collection());
      expect(offers).toEqual([
        { id: '1', message: 'Offer 1', price: '50' },
      ]);
    });
  });

  describe('addOffer', () => {
    test('adds offer with timestamp', async () => {
      const offerData = { message: 'My offer', price: '100' };
      addDoc.mockResolvedValue({});

      await addOffer(offerData);
      expect(addDoc).toHaveBeenCalledWith(collection(), {
        ...offerData,
        submittedAt: expect.any(String),
      });
    });
  });

  describe('getNotifications', () => {
    test('returns filtered notifications for user', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ userId: 'user123', message: 'Notif 1' }) },
        { id: '2', data: () => ({ userId: 'user456', message: 'Notif 2' }) },
      ];
      const mockQuerySnapshot = { docs: mockDocs };
      getDocs.mockResolvedValue(mockQuerySnapshot);

      const notifications = await getNotifications('user123');
      expect(getDocs).toHaveBeenCalledWith(collection());
      expect(notifications).toEqual([
        { id: '1', userId: 'user123', message: 'Notif 1' },
      ]);
    });
  });

  describe('addNotification', () => {
    test('adds notification with defaults', async () => {
      const notificationData = { userId: 'user123', message: 'New message' };
      addDoc.mockResolvedValue({});

      await addNotification(notificationData);
      expect(addDoc).toHaveBeenCalledWith(collection(), {
        ...notificationData,
        createdAt: expect.any(String),
        read: false,
      });
    });
  });
});