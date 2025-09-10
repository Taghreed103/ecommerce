"use client"

import React from 'react'
import  {useQueryClient, useMutation}  from "@tanstack/react-query"
import { useCartService } from "@/services/cart" 
import { useCart } from "@/hooks/useCart"
import { useSession } from "next-auth/react"
import { toast } from 'react-toastify'
export default  function ProductItemBtn({id}:{id:string}) {

//to  avoid   refresh  when  new  prod  added in cart
  const   queryClient =  useQueryClient()  
  const { addToCart, removeFromCart } = useCartService();
  const { isInCart } = useCart();
  const { status } = useSession();
  
   const {mutate: addToCartMutation, isPending: addPending } = useMutation({
    mutationFn: addToCart,
    onSuccess: (data) => {
      console.log("✅ Product added:", data);
     toast.success(data?.message || "Product added to cart")
     queryClient.invalidateQueries({queryKey:["cart"]})
  
    },

    onError: (error) => {
           console.error("Add to cart error:", error);
           toast.error("Failed to add product to cart")
    },
  });

  const {mutate: removeFromCartMutation, isPending: removePending } = useMutation({
    mutationFn: removeFromCart,
    onSuccess: (data) => {
      console.log("✅ Product removed:", data);
     toast.success(data?.message || "Product removed from cart")
     queryClient.invalidateQueries({queryKey:["cart"]})
  
    },

    onError: (error) => {
           console.error("Remove from cart error:", error);
           toast.error("Failed to remove product from cart")
    },
  });

  



  // Only check cart status if user is authenticated
  const isItemInCart = status === "authenticated" ? isInCart(id) : false;
  const isPending = addPending || removePending;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Button clicked for product:", id);
    
    // Check if user is authenticated
    if (status !== "authenticated") {
      toast.error("Please log in to add items to cart");
      return;
    }
    
    if (isItemInCart) {
      removeFromCartMutation(id);
    } else {
      addToCartMutation(id);
    }
  };

  const getButtonText = () => {
    if (isPending) return "Loading...";
    if (status !== "authenticated") return "Add to Cart";
    return isItemInCart ? "Remove from Cart" : "Add to Cart";
  };

  const getButtonStyles = () => {
    if (status !== "authenticated") {
      return "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 border-emerald-500 focus:ring-4 focus:ring-emerald-200 shadow-emerald-200/50";
    }
    return isItemInCart 
      ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-red-500 focus:ring-4 focus:ring-red-200 shadow-red-200/50" 
      : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 border-emerald-500 focus:ring-4 focus:ring-emerald-200 shadow-emerald-200/50";
  };

  return (
    <button 
      onClick={handleClick}
      disabled={isPending}
      className={`relative z-20 w-full font-bold py-3 px-4 rounded-2xl text-white text-sm transition-all duration-300 shadow-lg border transform hover:scale-105 hover:-translate-y-0.5 active:scale-95 backdrop-blur-sm ${getButtonStyles()}`}
    >
      {/* Button background glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isPending && (
          <i className="fa-solid fa-spinner fa-spin"></i>
        )}
        {!isPending && !isItemInCart && (
          <i className="fa-solid fa-cart-plus"></i>
        )}
        {!isPending && isItemInCart && (
          <i className="fa-solid fa-trash"></i>
        )}
        {getButtonText()}
      </span>
    </button>
  )
}
