"use server";
import { getTokenAuth } from "@/utilities/getTokenAuth";

type shippingAddressType = {
  details: string;
  phone: string;
  city: string;
};

export async function checkoutOnline(
  cartId: string,
  url = process.env.NEXTAUTH_URL,
  shippingAddress: shippingAddressType
) {
    const token= await getTokenAuth();
  if (!token) {
    throw new Error("Unauthenticated, login first");
  }

  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${url}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": token,
      },
      body: JSON.stringify({
        shippingAddress,
      }),
    }
  );

  const data = await res.json();
  
  console.log('Checkout API Response:', {
    status: res.status,
    statusText: res.statusText,
    data
  });

  if (!res.ok) {
    console.error('Checkout failed:', data);
    throw new Error(data.message || `Checkout failed with status ${res.status}`);
  }

  return data;
}
