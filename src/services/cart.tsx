// src/services/cart.ts
import { useCartActions } from "@/app/cart/_actions/clientCartActions";

// This function will be used with the useCartActions hook
export function useCartService() {
  const { addToCart, updateCartItem, removeFromCart, clearCart } = useCartActions();
  
  return {
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };
}
