import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../AuthContext';
import Dashboard from './Dashboard';
import { toast } from 'react-toastify';
import { getPosts, getNotifications, addPost, updatePost, deletePost, addToolRequest } from '../dataService';

// Mock the toast
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock dataService
jest.mock('../dataService', () => ({
  getPosts: jest.fn(),
  getNotifications: jest.fn(),
  addPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
  addToolRequest: jest.fn(),
}));

// Mock AuthContext
const mockCurrentUser = { uid: 'user123', role: 'user' };
const mockLogout = jest.fn();
jest.mock('../AuthContext', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({
    currentUser: mockCurrentUser,
    logout: mockLogout,
  }),
}));

// Mock window.location
delete window.location;
window.location = { href: '' };

const renderDashboard = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getPosts.mockResolvedValue([]);
    getNotifications.mockResolvedValue([]);
  });

  test('renders dashboard with logout button', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Service Platform Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  test('logout button calls logout', async () => {
    renderDashboard();
    await waitFor(() => {
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  test('post service button opens dialog', async () => {
    renderDashboard();
    await waitFor(() => {
      const postButton = screen.getByText('Post Service');
      fireEvent.click(postButton);
      expect(screen.getByText('Create Post')).toBeInTheDocument();
    });
  });

  test('request service button navigates', async () => {
    renderDashboard();
    await waitFor(() => {
      const requestButton = screen.getByText('Request Service');
      fireEvent.click(requestButton);
      expect(window.location.href).toBe('/request-service');
    });
  });

  test('view requests button navigates', async () => {
    renderDashboard();
    await waitFor(() => {
      const viewButton = screen.getByText('View Requests');
      fireEvent.click(viewButton);
      expect(window.location.href).toBe('/service-requests');
    });
  });

  test('request tool button opens dialog', async () => {
    renderDashboard();
    await waitFor(() => {
      const toolButton = screen.getByText('Request Tool');
      fireEvent.click(toolButton);
      expect(screen.getByText('Request Tool')).toBeInTheDocument();
    });
  });

  test('submits post successfully', async () => {
    renderDashboard();
    await waitFor(() => {
      const postButton = screen.getByText('Post Service');
      fireEvent.click(postButton);
    });

    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    const categorySelect = screen.getByLabelText('Category');
    const priceInput = screen.getByLabelText('Price');
    const locationInput = screen.getByLabelText('Location');
    const submitButton = screen.getByRole('button', { name: 'Create' });

    fireEvent.change(titleInput, { target: { value: 'Test Service' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    fireEvent.mouseDown(categorySelect);
    const cleaningOption = screen.getByText('cleaning');
    fireEvent.click(cleaningOption);
    fireEvent.change(priceInput, { target: { value: '50' } });
    fireEvent.change(locationInput, { target: { value: 'Test Location' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addPost).toHaveBeenCalledWith({
        title: 'Test Service',
        description: 'Test description',
        category: 'cleaning',
        price: '50',
        priceUnit: 'per hour',
        location: 'Test Location',
        availability: '',
        userId: 'user123',
        rating: 0,
        likes: [],
        favorites: [],
        reports: [],
      });
      expect(toast.success).toHaveBeenCalledWith('Post created!');
    });
  });

  test('submits tool request successfully', async () => {
    renderDashboard();
    await waitFor(() => {
      const toolButton = screen.getByText('Request Tool');
      fireEvent.click(toolButton);
    });

    const toolNameInput = screen.getByLabelText('Tool Name');
    const descriptionInput = screen.getByLabelText('Description');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(toolNameInput, { target: { value: 'Hammer' } });
    fireEvent.change(descriptionInput, { target: { value: 'Need a hammer for repairs' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addToolRequest).toHaveBeenCalledWith({
        toolName: 'Hammer',
        description: 'Need a hammer for repairs',
        userId: 'user123',
        status: 'pending',
      });
      expect(toast.success).toHaveBeenCalledWith('Tool request submitted!');
    });
  });
});