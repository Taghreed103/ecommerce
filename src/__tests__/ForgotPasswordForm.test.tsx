import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPasswordForm from '@/app/auth/forgot-password/_components/ForgotPasswordForm';
import { forgotPassword } from '@/apis/auth.api';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the API
jest.mock('@/apis/auth.api');
const mockForgotPassword = forgotPassword as jest.MockedFunction<typeof forgotPassword>;

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('ForgotPasswordForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders forgot password form correctly', () => {
    render(<ForgotPasswordForm />);
    
    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset code/i })).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    render(<ForgotPasswordForm />);
    
    const submitButton = screen.getByRole('button', { name: /send reset code/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });

  it('handles successful password reset request', async () => {
    mockForgotPassword.mockResolvedValueOnce({ message: 'Reset code sent to email' });
    
    render(<ForgotPasswordForm />);
    
    const emailInput = screen.getByLabelText('Email Address');
    const submitButton = screen.getByRole('button', { name: /send reset code/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith('test@example.com');
      expect(screen.getByText('Check Your Email')).toBeInTheDocument();
    });
  });

  it('handles password reset request failure', async () => {
    mockForgotPassword.mockResolvedValueOnce({ message: 'Email not found' });
    
    render(<ForgotPasswordForm />);
    
    const emailInput = screen.getByLabelText('Email Address');
    const submitButton = screen.getByRole('button', { name: /send reset code/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith('test@example.com');
    });
  });
});
