import React from 'react'
import { getAllProducts } from "@/apis/products.api"
import { ProductInterface } from "../../interfaces/product.interface";
import ProductGrid from './_components/ProductGrid'

export default async function ProductsPage() {
  const response = await getAllProducts();
  const products: ProductInterface[] = response.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Products</h1>
          <p className="text-gray-600">Discover our complete collection of products</p>
        </div>
        
        <ProductGrid 
          products={products}
          title="All Products"
          showFilters={true}
        />
      </div>
    </div>
  )
}
