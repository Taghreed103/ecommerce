import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import WishlistButton from '@/app/products/_components/WishlistButton';
import { addToWishlist, removeFromWishlist } from '@/apis/wishlist.api';

// Mock next-auth
jest.mock('next-auth/react');
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

// Mock the API
jest.mock('@/apis/wishlist.api');
const mockAddToWishlist = addToWishlist as jest.MockedFunction<typeof addToWishlist>;
const mockRemoveFromWishlist = removeFromWishlist as jest.MockedFunction<typeof removeFromWishlist>;

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('WishlistButton Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders wishlist button for authenticated user', () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: '1', email: 'test@example.com' } },
      status: 'authenticated',
      update: jest.fn(),
    });
    
    render(
      <TestWrapper>
        <WishlistButton productId="product1" />
      </TestWrapper>
    );
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows login prompt for unauthenticated user', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    });
    
    render(
      <TestWrapper>
        <WishlistButton productId="product1" />
      </TestWrapper>
    );
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('adds item to wishlist when clicked', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: '1', email: 'test@example.com', token: 'mock-token' } },
      status: 'authenticated',
      update: jest.fn(),
    });
    
    mockAddToWishlist.mockResolvedValueOnce({ message: 'success' });
    
    render(
      <TestWrapper>
        <WishlistButton productId="product1" />
      </TestWrapper>
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockAddToWishlist).toHaveBeenCalledWith('product1', 'mock-token');
    });
  });

  it('removes item from wishlist when clicked and item is in wishlist', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: '1', email: 'test@example.com', token: 'mock-token' } },
      status: 'authenticated',
      update: jest.fn(),
    });
    
    mockRemoveFromWishlist.mockResolvedValueOnce({ message: 'success' });
    
    render(
      <TestWrapper>
        <WishlistButton productId="product1" isInWishlist={true} />
      </TestWrapper>
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockRemoveFromWishlist).toHaveBeenCalledWith('product1', 'mock-token');
    });
  });
});
