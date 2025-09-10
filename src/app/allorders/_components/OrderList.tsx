"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getUserOrders } from "../_actions/allOrders.action";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThreeDots } from "@/components/ui/spinner";

interface Order {
  _id: string;
  status: string;
  totalOrderPrice: number;
  createdAt?: string;
  cartItems?: unknown[];
}

export default function OrdersList() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      setError(null);
      if (!session?.user?.id) {
        throw new Error("User ID not found");
      }
      const response = await getUserOrders(session.user.id);
      
      // Handle different response formats
      if (response.data) {
        setOrders(response.data);
      } else if (Array.isArray(response)) {
        setOrders(response);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders", err);
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.token) {
      loadOrders();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status, session, loadOrders]);

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
        <p className="text-gray-600 mb-4">Please log in to view your orders.</p>
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
        <Button onClick={loadOrders}>Try Again</Button>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">You haven&apos;t placed any orders yet.</p>
        <Link href="/products">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <Button onClick={loadOrders} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono text-sm">{order._id.slice(-8)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-semibold">{order.totalOrderPrice} EGP</p>
              </div>
              <Link href={`/allorders/${order._id}`}>
                <Button size="sm">View Details</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-medium text-gray-900">Order ID</th>
              <th className="text-left p-4 font-medium text-gray-900">Status</th>
              <th className="text-left p-4 font-medium text-gray-900">Total Price</th>
              <th className="text-left p-4 font-medium text-gray-900">Date</th>
              <th className="text-left p-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="p-4 font-mono text-sm">{order._id.slice(-12)}</td>
                <td className="p-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 font-semibold">{order.totalOrderPrice} EGP</td>
                <td className="p-4 text-gray-600">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="p-4">
                  <Link href={`/allorders/${order._id}`}>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
