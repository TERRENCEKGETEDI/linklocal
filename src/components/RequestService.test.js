import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../AuthContext';
import RequestService from './RequestService';
import { toast } from 'react-toastify';
import { addServiceRequest } from '../dataService';

// Mock the toast
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock dataService
jest.mock('../dataService', () => ({
  addServiceRequest: jest.fn(),
}));

// Mock AuthContext
const mockCurrentUser = { uid: 'user123' };
jest.mock('../AuthContext', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({
    currentUser: mockCurrentUser,
  }),
}));

const renderRequestService = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <RequestService />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('RequestService Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders request service form', () => {
    renderRequestService();
    expect(screen.getByText('Request a Service')).toBeInTheDocument();
    expect(screen.getByLabelText('Service Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Budget (optional)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit Request' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  test('submits service request successfully', async () => {
    renderRequestService();
    const serviceTypeSelect = screen.getByLabelText('Service Type');
    const descriptionInput = screen.getByLabelText('Description');
    const locationInput = screen.getByLabelText('Location');
    const budgetInput = screen.getByLabelText('Budget (optional)');
    const submitButton = screen.getByRole('button', { name: 'Submit Request' });

    fireEvent.mouseDown(serviceTypeSelect);
    const cleaningOption = screen.getByText('cleaning');
    fireEvent.click(cleaningOption);

    fireEvent.change(descriptionInput, { target: { value: 'Need house cleaning' } });
    fireEvent.change(locationInput, { target: { value: '123 Main St' } });
    fireEvent.change(budgetInput, { target: { value: '100' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addServiceRequest).toHaveBeenCalledWith({
        serviceType: 'cleaning',
        description: 'Need house cleaning',
        location: '123 Main St',
        budget: '100',
        userId: 'user123',
        status: 'pending'
      });
      expect(toast.success).toHaveBeenCalledWith('Service request submitted!');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('handles submission error', async () => {
    addServiceRequest.mockRejectedValue(new Error('Submission failed'));
    renderRequestService();
    const serviceTypeSelect = screen.getByLabelText('Service Type');
    const descriptionInput = screen.getByLabelText('Description');
    const locationInput = screen.getByLabelText('Location');
    const submitButton = screen.getByRole('button', { name: 'Submit Request' });

    fireEvent.mouseDown(serviceTypeSelect);
    const repairOption = screen.getByText('repair');
    fireEvent.click(repairOption);

    fireEvent.change(descriptionInput, { target: { value: 'Fix broken sink' } });
    fireEvent.change(locationInput, { target: { value: '456 Elm St' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addServiceRequest).toHaveBeenCalledWith({
        serviceType: 'repair',
        description: 'Fix broken sink',
        location: '456 Elm St',
        budget: '',
        userId: 'user123',
        status: 'pending'
      });
      expect(toast.error).toHaveBeenCalledWith('Failed to submit service request');
    });
  });

  test('cancels and navigates back', () => {
    renderRequestService();
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('validates required fields', async () => {
    renderRequestService();
    const submitButton = screen.getByRole('button', { name: 'Submit Request' });
    fireEvent.click(submitButton);

    // Since HTML5 validation is handled by browser, we check that the function isn't called
    await waitFor(() => {
      expect(addServiceRequest).not.toHaveBeenCalled();
    });
  });
});