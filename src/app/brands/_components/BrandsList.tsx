"use client";

import { useQuery } from "@tanstack/react-query";
import { Brand } from "@/interfaces/brand.interface";
import Image from "next/image";
import Link from "next/link";
import { ThreeDots } from "@/components/ui/spinner";

export default function BrandsList() {
  const { data: brandsData, isLoading, error } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await fetch('/api/brands');
      const payload = await res.json();
      return payload;
    },
  });

  const brands = brandsData?.data || [];

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
        <p className="text-red-500">Error loading brands. Please try again.</p>
      </div>
    );
  }

  if (!brands || brands.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No brands found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Brands</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {brands.map((brand: Brand) => (
          <Link
            key={brand._id}
            href={`/brands/${brand._id}`}
            className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-300"
          >
            <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
              <Image
                src={brand.image}
                alt={brand.name}
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 text-center">
              <h3 className="text-sm font-medium text-gray-900 group-hover:text-main transition-colors truncate">
                {brand.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
