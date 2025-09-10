import { addToWishlist, removeFromWishlist, getWishlist } from '@/apis/wishlist.api';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('Wishlist API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addToWishlist', () => {
    it('adds item to wishlist successfully', async () => {
      const mockResponse = { message: 'Item added to wishlist' };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      } as Response);

      const result = await addToWishlist('product1', 'mock-token');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://ecommerce.routemisr.com/api/v1/wishlist',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': 'mock-token',
          },
          body: JSON.stringify({ productId: 'product1' }),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('removeFromWishlist', () => {
    it('removes item from wishlist successfully', async () => {
      const mockResponse = { message: 'Item removed from wishlist' };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      } as Response);

      const result = await removeFromWishlist('product1', 'mock-token');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://ecommerce.routemisr.com/api/v1/wishlist/product1',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'token': 'mock-token',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getWishlist', () => {
    it('fetches wishlist successfully', async () => {
      const mockWishlist = [
        {
          _id: '1',
          product: {
            _id: 'product1',
            title: 'Test Product',
            price: 100,
            imageCover: 'https://example.com/image.jpg',
          },
          user: 'user1',
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        json: async () => ({ data: mockWishlist }),
      } as Response);

      const result = await getWishlist('mock-token');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://ecommerce.routemisr.com/api/v1/wishlist',
        {
          headers: {
            'Content-Type': 'application/json',
            'token': 'mock-token',
          },
        }
      );
      expect(result).toEqual(mockWishlist);
    });
  });
});
