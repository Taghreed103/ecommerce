import { ApiResponse, Order, Address, WishlistItem, Cart, User } from './types';

// API Configuration and utilities
export const API_BASE_URL = "https://ecommerce.routemisr.com/api/v1";

export class ApiError extends Error {
  constructor(public status: number, public message: string, public data?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API function with error handling
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.token = token;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.message || 'API request failed', data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Network error occurred');
  }
}

// Orders API
export const ordersApi = {
  getAllOrders: (token: string) => 
    apiRequest<ApiResponse<Order[]>>('/orders', { method: 'GET' }, token),
  
  getOrderById: (orderId: string, token: string) => 
    apiRequest<ApiResponse<Order>>(`/orders/${orderId}`, { method: 'GET' }, token),
  
  createOrder: (cartId: string, shippingAddress: Partial<Address>, token: string) =>
    apiRequest<ApiResponse<Order>>(`/orders/${cartId}`, {
      method: 'POST',
      body: JSON.stringify({ shippingAddress })
    }, token),
  
  checkoutOnline: (cartId: string, url: string, shippingAddress: Partial<Address>, token: string) =>
    apiRequest<ApiResponse<{ url: string }>>(`/orders/checkout-session/${cartId}?url=${url}`, {
      method: 'POST',
      body: JSON.stringify({ shippingAddress })
    }, token),
};

// Addresses API
export const addressesApi = {
  getAddresses: (token: string) =>
    apiRequest<ApiResponse<Address[]>>('/addresses', { method: 'GET' }, token),
  
  addAddress: (address: Partial<Address>, token: string) =>
    apiRequest<ApiResponse<Address>>('/addresses', {
      method: 'POST',
      body: JSON.stringify(address)
    }, token),
  
  updateAddress: (addressId: string, address: Partial<Address>, token: string) =>
    apiRequest<ApiResponse<Address>>(`/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(address)
    }, token),
  
  deleteAddress: (addressId: string, token: string) =>
    apiRequest<ApiResponse<Address>>(`/addresses/${addressId}`, { method: 'DELETE' }, token),
};

// Wishlist API
export const wishlistApi = {
  getWishlist: (token: string) =>
    apiRequest<ApiResponse<WishlistItem[]>>('/wishlist', { method: 'GET' }, token),
  
  addToWishlist: (productId: string, token: string) =>
    apiRequest<ApiResponse<WishlistItem>>('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId })
    }, token),
  
  removeFromWishlist: (productId: string, token: string) =>
    apiRequest<ApiResponse<string[]>>(`/wishlist/${productId}`, { method: 'DELETE' }, token),
};

// Cart API
export const cartApi = {
  getCart: (token: string) =>
    apiRequest<ApiResponse<Cart>>('/cart', { method: 'GET' }, token),
  
  addToCart: (productId: string, token: string) =>
    apiRequest<ApiResponse<Cart>>('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId })
    }, token),
  
  updateCartItem: (productId: string, count: number, token: string) =>
    apiRequest<ApiResponse<Cart>>(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ count })
    }, token),
  
  removeFromCart: (productId: string, token: string) =>
    apiRequest<ApiResponse<Cart>>(`/cart/${productId}`, { method: 'DELETE' }, token),
  
  clearCart: (token: string) =>
    apiRequest<ApiResponse<{ message: string }>>('/cart', { method: 'DELETE' }, token),
};

// Auth API
export const authApi = {
  signIn: (email: string, password: string) =>
    apiRequest<ApiResponse<{ token: string; user: User }>>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  
  signUp: (userData: Partial<User>) =>
    apiRequest<ApiResponse<{ token: string; user: User }>>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
  
  forgotPassword: (email: string) =>
    apiRequest<ApiResponse<{ message: string }>>('/auth/forgotPasswords', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),
  
  verifyResetCode: (email: string, resetCode: string) =>
    apiRequest<ApiResponse<{ message: string }>>('/auth/verifyResetCode', {
      method: 'POST',
      body: JSON.stringify({ email, resetCode })
    }),
  
  resetPassword: (email: string, newPassword: string) =>
    apiRequest<ApiResponse<{ message: string }>>('/auth/resetPassword', {
      method: 'PUT',
      body: JSON.stringify({ email, newPassword })
    }),
};
