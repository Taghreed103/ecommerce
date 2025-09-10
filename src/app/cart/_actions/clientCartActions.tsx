"use client";

import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

export function useCartActions() {
  const { data: session } = useSession();

  const addToCart = async (productId: string) => {
    if (!session?.user?.token) {
      toast.error("Please log in to add items to cart");
      return;
    }

    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": session.user.token,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (res.ok) {
        return data;
      } else {
        toast.error(data.message || "Failed to add product to cart");
        throw new Error(data.message || "Failed to add product to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Something went wrong");
      throw error;
    }
  };

  const updateCartItem = async (productId: string, count: number) => {
    if (!session?.user?.token) {
      toast.error("Please log in to update cart");
      return;
    }

    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "token": session.user.token,
        },
        body: JSON.stringify({ count }),
      });

      const data = await res.json();

      if (res.ok) {
        return data;
      } else {
        toast.error(data.message || "Failed to update cart");
        throw new Error(data.message || "Failed to update cart");
      }
    } catch (error) {
      console.error("Update cart error:", error);
      toast.error("Something went wrong");
      throw error;
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!session?.user?.token) {
      toast.error("Please log in to remove items from cart");
      return;
    }

    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "token": session.user.token,
        },
      });

      const data = await res.json();

      if (res.ok) {
        return data;
      } else {
        toast.error(data.message || "Failed to remove item from cart");
        throw new Error(data.message || "Failed to remove item from cart");
      }
    } catch (error) {
      console.error("Remove from cart error:", error);
      toast.error("Something went wrong");
      throw error;
    }
  };

  const clearCart = async () => {
    if (!session?.user?.token) {
      toast.error("Please log in to clear cart");
      return;
    }

    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "token": session.user.token,
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Cart cleared");
        return data;
      } else {
        toast.error(data.message || "Failed to clear cart");
        throw new Error(data.message || "Failed to clear cart");
      }
    } catch (error) {
      console.error("Clear cart error:", error);
      toast.error("Something went wrong");
      throw error;
    }
  };

  return {
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };
}
