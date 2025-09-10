"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function DebugAuth() {
  const { data: session, status } = useSession();
  const [cartTest, setCartTest] = useState<unknown>(null);
  const [wishlistTest, setWishlistTest] = useState<unknown>(null);
  const [brandsTest, setBrandsTest] = useState<unknown>(null);
  const [categoriesTest, setCategoriesTest] = useState<unknown>(null);
  const [wishlistAddTest, setWishlistAddTest] = useState<unknown>(null);

  useEffect(() => {
    const testAPIs = async () => {
      try {
        // Test cart API
        const cartRes = await fetch('/api/cart');
        const cartData = await cartRes.json();
        setCartTest({ status: cartRes.status, data: cartData });

        // Test wishlist API
        const wishlistRes = await fetch('/api/wishlist');
        const wishlistData = await wishlistRes.json();
        setWishlistTest({ status: wishlistRes.status, data: wishlistData });

        // Test brands API
        const brandsRes = await fetch('/api/brands');
        const brandsData = await brandsRes.json();
        setBrandsTest({ status: brandsRes.status, data: brandsData });

        // Test categories API
        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();
        setCategoriesTest({ status: categoriesRes.status, data: categoriesData });
      } catch (error) {
        console.error('API Test Error:', error);
      }
    };

    testAPIs();
  }, [session]);

  const testAddToWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: '6428e997dc1175abc65ca0b3' }) // Sample product ID
      });
      const data = await res.json();
      console.log('Debug - Add to wishlist response:', data);
      setWishlistAddTest({ status: res.status, data });
      
      // Refresh wishlist data
      setTimeout(async () => {
        const wishlistRes = await fetch('/api/wishlist');
        const wishlistData = await wishlistRes.json();
        console.log('Debug - Refreshed wishlist data:', wishlistData);
        setWishlistTest({ status: wishlistRes.status, data: wishlistData });
      }, 1000);
    } catch (error) {
      setWishlistAddTest({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Debug</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Session Status: {status}</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Cart API Test</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(cartTest, null, 2)}
        </pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Wishlist API Test</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(wishlistTest, null, 2)}
        </pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Brands API Test</h2>
        <pre className="bg-gray-100 p-4 rounded max-h-40 overflow-auto">
          {JSON.stringify(brandsTest, null, 2)}
        </pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Categories API Test</h2>
        <pre className="bg-gray-100 p-4 rounded max-h-40 overflow-auto">
          {JSON.stringify(categoriesTest, null, 2)}
        </pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Wishlist Add Test</h2>
        <Button onClick={testAddToWishlist} className="mb-2">
          Test Add to Wishlist
        </Button>
        <pre className="bg-gray-100 p-4 rounded max-h-40 overflow-auto">
          {JSON.stringify(wishlistAddTest, null, 2)}
        </pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">User Token</h2>
        <p className="bg-gray-100 p-4 rounded">
          {session?.user?.token ? 
            `Token exists: ${session.user.token.substring(0, 20)}...` : 
            'No token found'
          }
        </p>
      </div>
    </div>
  );
}