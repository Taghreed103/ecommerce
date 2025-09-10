import getSingleProduct from "@/apis/singleproduct.api";
import { ProductInterface } from "@/interfaces/product.interface";
import React from "react";
import Image from "next/image";
import ProductItemBtn from '../_components/ProductItemBtn';
import WishlistButton from '../_components/WishlistButton';

export default async function page( { params  } : {params: Promise<{id:string}>}   ) {
  const { id } = await params;

  const data: ProductInterface = await getSingleProduct(id);

  return (
    <div className="flex flex-wrap items-center">
      <div className="w-full md:w-1/3 relative">
        <Image
          alt=""
          src={data.imageCover}
          width={300}
          height={300}
          className="object-cover w-full rounded-lg"
        />
        {/* Wishlist button positioned in top-left */}
        <WishlistButton productId={data._id} />
      </div>

      <div className="w-full md:w-2/3 p-5">
        <h3 className="text-2xl font-bold mb-3">{data.title}</h3>
        
        <p className="text-gray-400 my-3">{data.description}</p>
        <p className="text-main font-medium">{data.category.name}</p>
        
        <div className="flex justify-between my-5 items-center mx-4">
          <span className="text-xl font-bold">{data.price} EGP</span>
          <span>
            {data.ratingsAverage}{" "}
            <i className="fa-solid fa-star text-rating"></i>
          </span>
        </div>
        
        <ProductItemBtn id={data._id} />
      </div>
    </div>
  );
}
