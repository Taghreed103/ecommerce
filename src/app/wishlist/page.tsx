import { Suspense } from "react";
import WishlistItems from "./_components/WishlistItems";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wishlist - Ecommerce App",
  description: "Your saved products",
};

export default function WishlistPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      <Suspense fallback={<div className="text-center">Loading wishlist...</div>}>
        <WishlistItems />
      </Suspense>
    </div>
  );
}
