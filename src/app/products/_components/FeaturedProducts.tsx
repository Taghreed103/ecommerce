import React from 'react'
import Link from 'next/link'
import { getAllProducts } from "@/apis/products.api"
import { ProductInterface } from '../../../interfaces/product.interface';
import ProductItem from './ProductItem';

export default async function FeaturedProducts() {
  const response = await getAllProducts();
  const data: ProductInterface[] = response.data;
  
  // Show only first 8 products for featured section
  const featuredProducts = data.slice(0, 8);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Featured Products</h2>
        <p className="text-gray-600 text-center">Discover our best-selling products</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {featuredProducts.map((prod: ProductInterface) => (
          <ProductItem key={prod._id} prod={prod} />
        ))}
      </div>
      
      {/* View All Products Link */}
      <div className="text-center mt-8">
        <Link 
          href="/products" 
          className="inline-flex items-center px-6 py-3 bg-main text-white font-medium rounded-lg hover:bg-main/90 transition-colors"
        >
          View All Products
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
