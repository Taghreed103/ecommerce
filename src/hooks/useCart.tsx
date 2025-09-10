"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { CartItem } from "@/lib/types";

export function useCart() {
  const { data: session, status } = useSession();
  
  const { data: cartData, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await fetch("/api/cart");
      const payload = await res.json();
      return payload;
    },
    enabled: !!session && status === "authenticated", // Only fetch when authenticated
    retry: false, // Don't retry failed requests
  });

  const isInCart = (productId: string) => {
    if (!cartData?.data?.products) return false;
    return cartData.data.products.some((item: CartItem) => item.product?._id === productId);
  };

  const getCartItemCount = (productId: string) => {
    if (!cartData?.data?.products) return 0;
    const item = cartData.data.products.find((item: CartItem) => item.product?._id === productId);
    return item?.count || 0;
  };

  return {
    cartData,
    isLoading,
    isInCart,
    getCartItemCount,
    cartItemCount: cartData?.numOfCartItems || 0,
  };
}
