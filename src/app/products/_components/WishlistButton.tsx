"use client";

import { useWishlist } from "@/contexts/WishlistContext";
import { useSession } from "next-auth/react";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export default function WishlistButton({ productId, className = "" }: WishlistButtonProps) {
  const { data: session } = useSession();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const isActive = isInWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation when clicking heart
    e.stopPropagation();
    toggleWishlist(productId);
  };

  if (!session) {
    return (
      <button
        onClick={handleClick}
        className={`absolute top-3 right-3 p-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-white/50 ${className}`}
        title="Login to add to wishlist"
      >
        <i className="fa-regular fa-heart text-gray-400 text-lg"></i>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`absolute top-3 right-3 p-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-white/50 ${className}`}
      title={isActive ? "Remove from wishlist" : "Add to wishlist"}
    >
      {/* Background glow effect for active state */}
      {isActive && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-100/50 to-pink-100/30 animate-pulse"></div>
      )}
      
      <i 
        className={`text-lg transition-all duration-300 relative z-10 ${
          isActive 
            ? "fa-solid fa-heart text-red-500 drop-shadow-sm animate-pulse" 
            : "fa-regular fa-heart text-gray-600 hover:text-red-500"
        }`}
      ></i>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  );
}
