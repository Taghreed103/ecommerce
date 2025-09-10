import { Suspense } from "react";
import BrandsList from "./_components/BrandsList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brands - Ecommerce App",
  description: "Browse all product brands",
};

export default function BrandsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Brands</h1>
      <Suspense fallback={<div className="text-center">Loading brands...</div>}>
        <BrandsList />
      </Suspense>
    </div>
  );
}
