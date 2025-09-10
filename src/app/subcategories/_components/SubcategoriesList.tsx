"use client";

import { useQuery } from "@tanstack/react-query";
import { Subcategory } from "@/interfaces/subcategory.interface";
import Link from "next/link";
import { ThreeDots } from "@/components/ui/spinner";

export default function SubcategoriesList() {
  const { data: subcategoriesData, isLoading, error } = useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const res = await fetch('/api/subcategories');
      const payload = await res.json();
      return payload;
    },
  });

  const subcategories: Subcategory[] = subcategoriesData?.data || [];

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
        <p className="text-red-500">Error loading subcategories. Please try again.</p>
      </div>
    );
  }

  if (!subcategories || subcategories.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No subcategories found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">All Subcategories</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subcategories.map((subcategory) => (
          <Link
            key={subcategory._id}
            href={`/subcategories/${subcategory._id}`}
            className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-main transition-all duration-300"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-main/20 transition-colors">
                <svg className="w-8 h-8 text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-main transition-colors mb-2">
                {subcategory.name}
              </h3>
              <p className="text-sm text-gray-500">
                Slug: {subcategory.slug}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
