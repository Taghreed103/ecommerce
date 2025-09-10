
"use client";

import React, { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getOrderById } from "../_actions/orders.action"
import { Button } from "@/components/ui/button";
import { ThreeDots } from "@/components/ui/spinner";
interface CartItem {
  _id: string
  count: number
  price: number
  product: {
    title: string
    _id: string
  }
}

interface Order {
  _id: string
  status: string
  totalOrderPrice: number
  shippingAddress: {
    city: string
    phone: string
    details: string
  }
  cartItems: CartItem[]
}

export default function Orders({ orderId }: { orderId: string }) {
  const { data: session, status } = useSession();
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrder = useCallback(async () => {
    try {
      setError(null);
      const response = await getOrderById(orderId);
      
      // Handle different response formats
      if (response.data) {
        setOrder(response.data);
      } else if (response._id) {
        setOrder(response);
      } else {
        setError("Order not found");
      }
    } catch (err) {
      console.error("Error fetching order", err)
      setError(err instanceof Error ? err.message : "Failed to load order");
    } finally {
      setLoading(false)
    }
  }, [orderId]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.token) {
      fetchOrder();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status, session, fetchOrder]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center py-8">
        <ThreeDots color="#000" height={50} width={50} />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Please log in to view order details.</p>
        <Link href="/auth/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <ThreeDots color="#000" height={50} width={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <div className="space-x-4">
          <Button onClick={fetchOrder}>Try Again</Button>
          <Link href="/allorders">
            <Button variant="outline">Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Order not found.</p>
        <Link href="/allorders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }





  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <Link href="/allorders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Order Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono text-sm font-medium">{order._id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.cartItems?.map((item) => (
                <div key={item._id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product?.title}</h3>
                    <div className="mt-1 text-sm text-gray-500">
                      Quantity: {item.count} × {item.price} EGP
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {(item.count * item.price)} EGP
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{order.totalOrderPrice} EGP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-semibold">{order.totalOrderPrice} EGP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{order.shippingAddress.details}</p>
                <p className="text-gray-600">{order.shippingAddress.city}</p>
                <p className="text-gray-600">{order.shippingAddress.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
