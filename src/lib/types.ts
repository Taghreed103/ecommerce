// Common API response types
export interface ApiResponse<T = unknown> {
  status: string;
  message?: string;
  data?: T;
  results?: number;
}

// Orders types
export interface Order {
  _id: string;
  status: string;
  totalOrderPrice: number;
  createdAt?: string;
  shippingAddress?: {
    details: string;
    city: string;
    phone: string;
  };
  cartItems?: CartItem[];
}

export interface CartItem {
  _id: string;
  count: number;
  price: number;
  product: {
    _id: string;
    title: string;
    imageCover?: string;
  };
}

// Address types
export interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
  createdAt?: string;
  updatedAt?: string;
}

// Product types
export interface Product {
  _id: string;
  title: string;
  price: number;
  imageCover: string;
  description?: string;
  category?: Category;
  brand?: Brand;
}

export interface Category {
  _id: string;
  name: string;
  image?: string;
}

export interface Brand {
  _id: string;
  name: string;
  image?: string;
}

// Wishlist types
export interface WishlistItem {
  _id: string;
  product: Product;
}

// Cart types
export interface Cart {
  _id: string;
  cartOwner: string;
  products: CartItem[];
  totalCartPrice: number;
  numOfCartItems: number;
}

// Auth types
export interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  token?: string;
}
