import getCategories, { getCategoryById } from '@/apis/categories.api';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('Categories API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCategories', () => {
    it('fetches categories successfully', async () => {
      const mockCategories = [
        {
          _id: '1',
          name: 'Electronics',
          slug: 'electronics',
          image: 'https://example.com/electronics.jpg',
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        json: async () => ({ data: mockCategories }),
      } as Response);

      const result = await getCategories();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://ecommerce.routemisr.com/api/v1/categories',
        { cache: 'no-store' }
      );
      expect(result).toEqual(mockCategories);
    });

    it('handles fetch error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(getCategories()).rejects.toThrow('Network error');
    });
  });

  describe('getCategoryById', () => {
    it('fetches category by id successfully', async () => {
      const mockCategory = {
        _id: '1',
        name: 'Electronics',
        slug: 'electronics',
        image: 'https://example.com/electronics.jpg',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };

      mockFetch.mockResolvedValueOnce({
        json: async () => ({ data: mockCategory }),
      } as Response);

      const result = await getCategoryById('1');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://ecommerce.routemisr.com/api/v1/categories/1',
        { cache: 'no-store' }
      );
      expect(result).toEqual(mockCategory);
    });
  });
});
