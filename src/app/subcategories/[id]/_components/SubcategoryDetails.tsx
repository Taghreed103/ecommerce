"use client";

import { useQuery } from "@tanstack/react-query";
import { getSubcategoryById } from "@/apis/subcategories.api";
import { getProductsBySubcategory } from "@/apis/products.api";
import { Subcategory } from "@/interfaces/subcategory.interface";
import Link from "next/link";
import { ThreeDots } from "@/components/ui/spinner";
import ProductGrid from "@/app/products/_components/ProductGrid";

interface SubcategoryDetailsProps {
  subcategoryId: string;
}

export default function SubcategoryDetails({ subcategoryId }: SubcategoryDetailsProps) {
  const { data: subcategory, isLoading, error } = useQuery<Subcategory>({
    queryKey: ["subcategory", subcategoryId],
    queryFn: () => getSubcategoryById(subcategoryId),
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products", "subcategory", subcategoryId],
    queryFn: () => getProductsBySubcategory(subcategoryId),
    enabled: !!subcategoryId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <ThreeDots color="#000" height={50} width={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading subcategory. Please try again.</p>
      </div>
    );
  }

  if (!subcategory) {
    return (
      <div className="text-center py-8">
        <p>Subcategory not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Navigation */}
      <nav className="mb-6">
        <Link href="/subcategories" className="text-main hover:underline">
          ← Back to Subcategories
        </Link>
      </nav>

      {/* Subcategory Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="text-center">
          <div className="w-24 h-24 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {subcategory.name}
          </h1>
          <p className="text-xl text-gray-600">
            Explore products in the {subcategory.name.toLowerCase()} subcategory
          </p>
        </div>
      </div>

      {/* Subcategory Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Subcategory Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
              <p className="text-gray-900 font-medium">{subcategory.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Slug</label>
              <p className="text-gray-900 font-mono text-sm">{subcategory.slug}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Created</label>
              <p className="text-gray-900">{new Date(subcategory.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
              <p className="text-gray-900">{new Date(subcategory.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="mt-8">
        <ProductGrid 
          products={products?.data}
          isLoading={productsLoading}
          title={`Products in ${subcategory.name}`}
        />
      </div>
      </div>
    </div>
  );
}
