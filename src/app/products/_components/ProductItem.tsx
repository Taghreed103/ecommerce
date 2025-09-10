import React from 'react'
import { ProductInterface } from '../../../interfaces/product.interface';
import Image from 'next/image';
import Link from 'next/link';
import  ProductItemBtn from './ProductItemBtn';
import WishlistButton from './WishlistButton';
interface Props {
  prod: ProductInterface;
}

export default function ProductItem({prod}:Props) {

  return (
    <div className="group relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-main/40 hover:-translate-y-2 flex flex-col overflow-hidden backdrop-blur-sm">
      {/* Image Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 rounded-t-3xl">
        <Link href={`/products/${prod._id}`}> 
          <div className="aspect-square relative p-4">
            {/* Background circle for better image presentation */}
            <div className="absolute inset-4 bg-gradient-to-br from-white/60 to-gray-50/80 rounded-2xl shadow-inner"></div>
            <Image 
              fill
              src={prod.imageCover} 
              alt={prod.title}
              className='object-contain p-6 group-hover:scale-110 group-hover:rotate-2 transition-all duration-700 ease-out relative z-10'
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              priority={false}
            />
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent group-hover:from-black/10 transition-all duration-500"></div>
            
            {/* Decorative elements */}
            <div className="absolute top-2 left-2 w-3 h-3 bg-gradient-to-br from-main/20 to-main/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-4 right-4 w-2 h-2 bg-gradient-to-br from-orange-300/30 to-orange-500/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
          </div>
        </Link>
        
        {/* Wishlist button positioned in top-right */}
        <WishlistButton productId={prod._id} />
        
        {/* Discount badge */}
        {prod.priceAfterDiscount && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 via-red-600 to-pink-600 text-white text-xs font-bold px-3 py-2 rounded-2xl shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">
            <span className="relative z-10">{Math.round(((prod.price - prod.priceAfterDiscount) / prod.price) * 100)}% OFF</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl blur opacity-30"></div>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-5 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm">
        <div className="flex-1">
          <Link href={`/products/${prod._id}`}>
            {/* Category and Rating */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className='text-main text-xs font-bold bg-gradient-to-r from-main/15 via-main/10 to-main/20 px-3 py-1.5 rounded-2xl border border-main/30 shadow-sm backdrop-blur-sm'>
                {prod.category.name}
              </span>
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-1.5 rounded-2xl border border-amber-200/50 shadow-sm">
                <span className="font-bold text-gray-800 text-xs">{prod.ratingsAverage}</span>
                <i className='fa-solid fa-star text-amber-500 text-xs drop-shadow-sm'></i>
              </div>
            </div>
            
            {/* Product Title */}
            <h3 className='font-bold text-gray-900 mb-3 line-clamp-2 hover:text-main transition-colors leading-snug text-sm group-hover:text-main'>
              {prod.title}
            </h3>
          </Link>
          
          {/* Price Section */}
          <div className='mb-4'>
            <div className="flex items-baseline gap-2">
              {prod.priceAfterDiscount ? (
                <>
                  <span className="font-black text-xl bg-gradient-to-r from-main to-main/80 bg-clip-text text-transparent">
                    {prod.priceAfterDiscount} EGP
                  </span>
                  <span className="text-gray-400 line-through text-sm font-medium relative">
                    {prod.price} EGP
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-300/30 to-transparent"></div>
                  </span>
                </>
              ) : (
                <span className="font-black text-xl text-gray-900">
                  {prod.price} EGP
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Add to Cart Button - Always at bottom */}
        <div className="w-full transform group-hover:scale-105 transition-transform duration-300">
          <ProductItemBtn id={prod._id} />
        </div>
      </div>
    </div>



  )
}
