"use client"
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query"
import React from 'react'
import { CartRes, Product } from '../typescript/cart.interface'
import Image from 'next/image'
import { Button } from '../../../components/ui/button'
import Loading from '@/app/loading'
import imageCart from "../../../assets/images/cart-icon.png"
import { toast } from 'react-toastify'
import { useCartService } from "@/services/cart"
import Link from "next/link"
import { useSession } from "next-auth/react"

export default function Cart() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const { clearCart } = useCartService();

  const { mutate, isPending } = useMutation({
    mutationFn: clearCart,
    onSuccess: (data) => {
      console.log("✅ Cart cleared:", data);
      toast.success(data?.message || "Cart cleared")
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
    onError: (error) => {
      console.error("Clear cart error:", error);
      toast.error("Failed to clear cart")
    },
  });

  const { data, error, isError, isLoading } = useQuery<CartRes>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await fetch("/api/cart")
      const payload = await res.json();
      return payload;
    },
    enabled: !!session && status === "authenticated", // Only fetch when authenticated
    retry: false, // Don't retry failed requests
  });

  // Show loading state while checking authentication
  if (status === "loading") {
    return <Loading />;
  }

  // Show login prompt if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view your cart.</p>
          <Link href="/auth/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <h2>{error?.message || "An error occurred"}</h2>
  }

  if (data?.numOfCartItems === 0) {
    return (
      <div className='flex justify-center items-center vh-[80%]'>
        <Image alt="" src={imageCart} />
      </div>
    )
  }

  console.log(data)
   

  
  return (

<div  className='py-5'>
     
     <h2   > Total Cart  Price : <span  className='text-main  font-bold'>{data?.data.totalCartPrice}EGP</span></h2>
     <h3  > Num of Cart Item : <span   className='text-main  font-bold'> {data?.numOfCartItems}</span></h3>

   <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="px-16 py-3">
          <span className="sr-only">Image</span>
        </th>
        <th scope="col" className="px-6 py-3">
          Product
        </th>
        <th scope="col" className="px-6 py-3">
          Qty
        </th>
        <th scope="col" className="px-6 py-3">
          Price
        </th>
        <th scope="col" className="px-6 py-3">
          Action
        </th>
      </tr>
    </thead>
    <tbody>


       {data?.data.products.map(  prod=> <ProductItemTable  key={prod._id}  prod={prod}></ProductItemTable>  )}
     
    
    </tbody>
  </table>
</div>

    <Button  type="button"   className="ml-auto  block  my-3  cursor-pointer" onClick={()=> mutate ()} >
      
        {isPending?<i  className="fa-solid  fa-spin fa-spinner"></i> :
     
    "Clear All Cart "}
     
     </Button>



     
    <Button  type="button"   className="ml-auto  block  my-3  cursor-pointer"  >


      <Link  href={`/checkout/${data?.cartId}`}>Go CheckOut  </Link>
   </Button>

</div>



  )
}
function ProductItemTable({prod} :{prod:Product}) {

    const   queryClient =  useQueryClient()  
    const { removeFromCart, updateCartItem } = useCartService();
    
   const {mutate, isPending } = useMutation({
    mutationFn: removeFromCart,
    onSuccess: (data) => {
     toast.success(data?.message || "Item removed from cart")
     queryClient.invalidateQueries({queryKey:["cart"]})
    
    },
    onError: (error) => {
           console.error("Remove item error:", error);
           toast.error("Failed to remove item")

    },
  });



     const {mutate :updateMutate, isPending : updatePending} = useMutation({
    mutationFn: ({productId, count}: {productId: string, count: number}) => updateCartItem(productId, count),
    onSuccess: (data) => {
     toast.success(data?.message || "Quantity updated")
     queryClient.invalidateQueries({queryKey:["cart"]})
    
    },
    onError: (error) => {
           console.error("Update quantity error:", error);
           toast.error("Failed to update quantity")

    },
  });

  function handleUpdate() { 
    
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    prod.count< prod.product.quantity ?updateMutate({productId:prod.product._id , count : prod.count+1})  : "Not Valid"  


}

  return(

   <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
        <td className="p-4">
          <Image   width={100}  height={100} alt=""   src={prod.product.imageCover} className="size-[100px]  object-cover"/>
        </td>
        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
          {prod.product.title}
        </td>
        
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <button 
              onClick={()=> updateMutate({productId:prod.product._id , count : prod.count-1})}
              disabled={prod.count <= 1}
              className="w-8 h-8 flex items-center justify-center text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed" 
              type="button">
              <span className="text-lg font-bold">−</span>
            </button>
            
            <span className="w-12 text-center font-semibold text-gray-900">
              {updatePending ? <i className="fa-solid fa-spin fa-spinner text-main"></i> : prod.count}
            </span>
            
            <button 
              onClick={handleUpdate}
              disabled={prod.count >= prod.product.quantity}
              className="w-8 h-8 flex items-center justify-center text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed" 
              type="button">
              <span className="text-lg font-bold">+</span>
            </button>
          </div>
        </td>

        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
          {prod.price}EGP
        </td>
        <td className="px-6 py-4">
          <span  onClick={()=> mutate(prod.product._id)}  className="  font-medium text-red-600 dark:text-red-500 hover:underline">
          
         {isPending?<i  className="fa-solid  fa-spin fa-spinner"></i>  :  <i    className='fa-solid fa-trash text-red-600  cursor-pointer '></i>}


          </span>
        </td>
  </tr>

  
  )
  
}