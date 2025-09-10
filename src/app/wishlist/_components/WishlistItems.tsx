"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ThreeDots } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";

export default function WishlistItems() {
  const { status } = useSession();
  const { wishlistProducts, isLoading, toggleWishlist } = useWishlist();

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center py-8">
        <ThreeDots color="#000" height={50} width={50} />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Please log in to view your wishlist.</p>
        <Link href="/auth/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <ThreeDots color="#000" height={50} width={50} />
      </div>
    );
  }

  if (!wishlistProducts || wishlistProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {wishlistProducts.map((product) => (
        <div
          key={product._id}
          className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <Link href={`/products/${product._id}`}>
            <div className="aspect-square relative overflow-hidden">
              <Image
                src={product.imageCover}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="p-4">
            <Link href={`/products/${product._id}`}>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-main transition-colors mb-2">
                {product.title}
              </h3>
            </Link>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-main">
                {product.price} EGP
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleWishlist(product._id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <i className="fa-solid fa-heart text-red-500 mr-1"></i>
                Remove
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
