"use client";

import { useQuery } from "@tanstack/react-query";
import { Category } from "@/interfaces/category.interface";
import Image from "next/image";
import Link from "next/link";
import { ThreeDots } from "@/components/ui/spinner";

export default function CategoriesList() {
  const { data: categoriesData, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      const payload = await res.json();
      return payload;
    },
  });

  const categories = categoriesData?.data || [];

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
        <p className="text-red-500">Error loading categories. Please try again.</p>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No categories found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Shop by Category</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category: Category) => (
          <Link
            key={category._id}
            href={`/categories/${category._id}`}
            className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
          >
            <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
            </div>
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-main transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">Explore collection</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
