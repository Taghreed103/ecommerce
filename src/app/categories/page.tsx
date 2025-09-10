import { Suspense } from "react";
import CategoriesList from "./_components/CategoriesList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories - Ecommerce App",
  description: "Browse all product categories",
};

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Categories</h1>
      <Suspense fallback={<div className="text-center">Loading categories...</div>}>
        <CategoriesList />
      </Suspense>
    </div>
  );
}
