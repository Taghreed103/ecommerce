"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductInterface } from "@/interfaces/product.interface";
import { ThreeDots } from "@/components/ui/spinner";
import ProductItem from "./ProductItem";
import ProductFilters from "./ProductFilters";

interface ProductGridProps {
  products?: ProductInterface[];
  queryKey?: string[];
  queryFn?: () => Promise<unknown>;
  title?: string;
  isLoading?: boolean;
  showFilters?: boolean;
}

export default function ProductGrid({ products, queryKey, queryFn, title, isLoading: externalLoading, showFilters = true }: ProductGridProps) {
  // Only use useQuery if queryFn is provided and products are not already available
  const shouldFetch = !!queryFn && !products && !!queryKey;
  
  const { data: productsData, isLoading: queryLoading, error } = useQuery({
    queryKey: queryKey || ['fallback'],
    queryFn: queryFn || (() => Promise.resolve(null)),
    enabled: shouldFetch,
  });

  const [sortBy, setSortBy] = useState("default");
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: Infinity });

  const rawProducts = products || (shouldFetch ? (productsData as { data?: ProductInterface[] })?.data || [] : []);
  const isLoading = externalLoading || (shouldFetch && queryLoading);

  // Filter and sort products
  const displayProducts = useMemo(() => {
    const filtered = rawProducts.filter(product => {
      const price = product.priceAfterDiscount || product.price;
      return price >= priceFilter.min && price <= priceFilter.max;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        return filtered.sort((a, b) => (a.priceAfterDiscount || a.price) - (b.priceAfterDiscount || b.price));
      case "price-high":
        return filtered.sort((a, b) => (b.priceAfterDiscount || b.price) - (a.priceAfterDiscount || a.price));
      case "rating":
        return filtered.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
      case "newest":
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        // Keep original order
        return filtered;
    }
  }, [rawProducts, sortBy, priceFilter]);

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const handlePriceFilter = (min: number, max: number) => {
    setPriceFilter({ min, max: max || Infinity });
  };

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
        <p className="text-red-500">Error loading products. Please try again.</p>
      </div>
    );
  }

  if (!displayProducts || displayProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No products found.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      {showFilters && rawProducts.length > 0 && (
        <ProductFilters
          onSortChange={handleSortChange}
          onPriceFilter={handlePriceFilter}
          totalProducts={displayProducts.length}
        />
      )}

      {/* Products Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {!showFilters && (
              <div className="text-sm text-gray-500">
                {displayProducts.length} product{displayProducts.length !== 1 ? 's' : ''} found
              </div>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
          {displayProducts.map((product: ProductInterface) => (
            <ProductItem key={product._id} prod={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
