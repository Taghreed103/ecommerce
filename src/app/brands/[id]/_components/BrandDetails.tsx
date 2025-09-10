"use client";

import { useQuery } from "@tanstack/react-query";
import { getBrandById } from "@/apis/brands.api";
import { getProductsByBrand } from "@/apis/products.api";
import { Brand } from "@/interfaces/brand.interface";
import Image from "next/image";
import Link from "next/link";
import { ThreeDots } from "@/components/ui/spinner";
import ProductGrid from "@/app/products/_components/ProductGrid";

interface BrandDetailsProps {
  brandId: string;
}

export default function BrandDetails({ brandId }: BrandDetailsProps) {
  const { data: brand, isLoading, error } = useQuery<Brand>({
    queryKey: ["brand", brandId],
    queryFn: () => getBrandById(brandId),
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products", "brand", brandId],
    queryFn: () => getProductsByBrand(brandId),
    enabled: !!brandId,
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
        <p className="text-red-500">Error loading brand. Please try again.</p>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="text-center py-8">
        <p>Brand not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Navigation */}
        <nav className="mb-6">
          <Link href="/brands" className="text-main hover:underline">
            ← Back to Brands
          </Link>
        </nav>

        {/* Brand Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="aspect-[16/6] relative">
            <Image
              src={brand.image}
              alt={brand.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6">
              <h1 className="text-4xl font-bold text-white mb-2">
                {brand.name}
              </h1>
              <p className="text-white/90">Discover our {brand.name.toLowerCase()} collection</p>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <ProductGrid 
            products={products?.data}
            isLoading={productsLoading}
            title={`Products from ${brand.name}`}
          />
        </div>

        {/* Brand Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-500">Slug:</span>
              <p className="text-gray-900">{brand.slug}</p>
            </div>
            <div>
              <span className="font-medium text-gray-500">Created:</span>
              <p className="text-gray-900">{new Date(brand.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="font-medium text-gray-500">Updated:</span>
              <p className="text-gray-900">{new Date(brand.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
