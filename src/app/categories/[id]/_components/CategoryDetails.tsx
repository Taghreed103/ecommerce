"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategoryById } from "@/apis/categories.api";
import { getSubcategoriesByCategoryId } from "@/apis/subcategories.api";
import { getProductsByCategory } from "@/apis/products.api";
import { Category } from "@/interfaces/category.interface";
import { Subcategory } from "@/interfaces/subcategory.interface";
import Image from "next/image";
import Link from "next/link";
import { ThreeDots } from "@/components/ui/spinner";
import ProductGrid from "@/app/products/_components/ProductGrid";

interface CategoryDetailsProps {
  categoryId: string;
}

export default function CategoryDetails({ categoryId }: CategoryDetailsProps) {
  const { data: category, isLoading, error } = useQuery<Category>({
    queryKey: ["category", categoryId],
    queryFn: () => getCategoryById(categoryId),
  });

  const { data: subcategories, isLoading: subcategoriesLoading } = useQuery<Subcategory[]>({
    queryKey: ["subcategories", categoryId],
    queryFn: () => getSubcategoriesByCategoryId(categoryId),
    enabled: !!categoryId,
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products", "category", categoryId],
    queryFn: () => getProductsByCategory(categoryId),
    enabled: !!categoryId,
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
        <p className="text-red-500">Error loading category. Please try again.</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-8">
        <p>Category not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="aspect-[16/6] relative">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
          <div className="absolute bottom-6 left-6">
            <h1 className="text-4xl font-bold text-white mb-2">
              {category.name}
            </h1>
            <p className="text-white/90">Explore our {category.name.toLowerCase()} collection</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Subcategories</h2>
        
        {subcategoriesLoading ? (
          <div className="flex justify-center items-center py-8">
            <ThreeDots color="#000" height={50} width={50} />
          </div>
        ) : subcategories && subcategories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory._id}
                href={`/subcategories/${subcategory._id}`}
                className="group bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-main transition-all duration-300"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-main/20 transition-colors">
                    <svg className="w-6 h-6 text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-main transition-colors">
                    {subcategory.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No subcategories available for this category.</p>
          </div>
        )}
      </div>

      <div className="mb-8">
        <ProductGrid 
          products={products?.data}
          isLoading={productsLoading}
          title={`Products in ${category.name}`}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-500">Slug:</span>
            <p className="text-gray-900">{category.slug}</p>
          </div>
          <div>
            <span className="font-medium text-gray-500">Created:</span>
            <p className="text-gray-900">{new Date(category.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="font-medium text-gray-500">Updated:</span>
            <p className="text-gray-900">{new Date(category.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
