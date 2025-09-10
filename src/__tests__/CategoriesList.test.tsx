import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CategoriesList from '@/app/categories/_components/CategoriesList';
import getCategories from '@/apis/categories.api';

// Mock the API
jest.mock('@/apis/categories.api');
const mockGetCategories = getCategories as jest.MockedFunction<typeof getCategories>;

// Mock next/link
jest.mock('next/link', () => {
  const MockedLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockedLink.displayName = 'MockedLink';
  return MockedLink;
});

// Mock next/image
jest.mock('next/image', () => {
  const MockedImage = ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => <img src={src} alt={alt} {...props} />;
  MockedImage.displayName = 'MockedImage';
  return MockedImage;
});

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

describe('CategoriesList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    mockGetCategories.mockImplementation(() => new Promise(() => {}));
    
    render(
      <TestWrapper>
        <CategoriesList />
      </TestWrapper>
    );
    
    expect(screen.getByText('Loading categories...')).toBeInTheDocument();
  });

  it('renders categories correctly', async () => {
    const mockCategories = [
      {
        _id: '1',
        name: 'Electronics',
        slug: 'electronics',
        image: 'https://example.com/electronics.jpg',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      },
      {
        _id: '2',
        name: 'Clothing',
        slug: 'clothing',
        image: 'https://example.com/clothing.jpg',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      },
    ];
    
    mockGetCategories.mockResolvedValueOnce(mockCategories);
    
    render(
      <TestWrapper>
        <CategoriesList />
      </TestWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Clothing')).toBeInTheDocument();
    });
  });

  it('renders empty state when no categories', async () => {
    mockGetCategories.mockResolvedValueOnce([]);
    
    render(
      <TestWrapper>
        <CategoriesList />
      </TestWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByText('No categories found.')).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    mockGetCategories.mockRejectedValueOnce(new Error('API Error'));
    
    render(
      <TestWrapper>
        <CategoriesList />
      </TestWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Error loading categories. Please try again.')).toBeInTheDocument();
    });
  });
});
