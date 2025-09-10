import { ProductInterface } from "./product.interface";

export interface WishlistItem {
  _id: string;
  product: ProductInterface;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistResponse {
  results: number;
  data: WishlistItem[];
}
