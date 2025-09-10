"use server";

import { getTokenAuth } from "@/utilities/getTokenAuth";

export async function getUserOrders(userId: string) {
  const token = await getTokenAuth();
  if (!token) throw new Error("Unauthenticated, login first");

  if (!userId) throw new Error("User ID is required");

  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      token: token
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user orders");
  }

  return res.json();
}
