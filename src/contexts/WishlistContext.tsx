"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

interface WishlistProduct {
  _id: string;
  title: string;
  price: number;
  imageCover: string;
}

interface WishlistContextType {
  wishlistItems: string[];
  wishlistProducts: WishlistProduct[];
  isLoading: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  wishlistCount: number;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<WishlistProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadWishlist = useCallback(async () => {
    if (!session?.user?.token) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        console.log('Wishlist Context API response:', data);
        
        if (data.data && Array.isArray(data.data)) {
          // Extract product IDs and full product data
          const productIds: string[] = [];
          const products: WishlistProduct[] = [];
          
          data.data.forEach((item: unknown) => {
            const itemTyped = item as { product?: WishlistProduct } | WishlistProduct;
            const product = 'product' in itemTyped && itemTyped.product ? itemTyped.product : itemTyped as WishlistProduct;
            if (product && '_id' in product && product._id) {
              productIds.push(product._id);
              products.push({
                _id: product._id,
                title: product.title,
                price: product.price,
                imageCover: product.imageCover
              });
            }
          });
          
          setWishlistItems(productIds);
          setWishlistProducts(products);
          console.log('Wishlist Context updated - Count:', productIds.length);
        } else {
          setWishlistItems([]);
          setWishlistProducts([]);
        }
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      setWishlistItems([]);
      setWishlistProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.token]);

  // Load wishlist from API when user is authenticated
  useEffect(() => {
    if (session?.user?.token) {
      loadWishlist();
    } else {
      setWishlistItems([]);
      setWishlistProducts([]);
    }
  }, [session, loadWishlist]);

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.includes(productId);
  };

  const toggleWishlist = async (productId: string) => {
    if (!session?.user?.token) {
      toast.error("Please log in to manage your wishlist");
      return;
    }

    const isCurrentlyInWishlist = isInWishlist(productId);
    
    // Optimistic update
    if (isCurrentlyInWishlist) {
      setWishlistItems(prev => prev.filter(id => id !== productId));
      setWishlistProducts(prev => prev.filter(product => product._id !== productId));
    } else {
      setWishlistItems(prev => [...prev, productId]);
      // Note: For adding, we'll let the API response handle the full product data
    }

    try {
      let response;
      
      if (isCurrentlyInWishlist) {
        // Remove from wishlist
        response = await fetch(`/api/wishlist?productId=${productId}`, {
          method: 'DELETE',
        });
      } else {
        // Add to wishlist
        response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
        });
      }

      if (response.ok) {
        toast.success(isCurrentlyInWishlist ? "Removed from wishlist" : "Added to wishlist");
        // Reload wishlist to ensure consistency and trigger all component updates
        await loadWishlist();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${isCurrentlyInWishlist ? 'remove from' : 'add to'} wishlist`);
      }
    } catch (error) {
      console.error('Wishlist operation failed:', error);
      toast.error(isCurrentlyInWishlist ? "Failed to remove from wishlist" : "Failed to add to wishlist");
      
      // Revert optimistic update
      if (isCurrentlyInWishlist) {
        setWishlistItems(prev => [...prev, productId]);
        // For reverting removal, we need to reload to get the full product data
        await loadWishlist();
      } else {
        setWishlistItems(prev => prev.filter(id => id !== productId));
      }
    }
  };

  const value: WishlistContextType = {
    wishlistItems,
    wishlistProducts,
    isLoading,
    isInWishlist,
    toggleWishlist,
    wishlistCount: wishlistItems.length,
    refreshWishlist: loadWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
