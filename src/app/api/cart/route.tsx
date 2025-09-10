import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (process.env.NODE_ENV === 'development') {
    console.log('Cart API - Token exists:', !!token);
    console.log('Cart API - User token exists:', !!token?.token);
  }

  if (!token) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Cart API - No token found, returning 401');
    }
    return NextResponse.json({ status: 401, error: "Unauthorized" });
  }

  const userToken = token.token as string;
  if (!userToken) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Cart API - No user token in session (might be GitHub login)');
    }
    // If logged in via GitHub, return empty cart since we can't access external API
    return NextResponse.json({
      status: "success",
      numOfCartItems: 0,
      data: { products: [], totalCartPrice: 0 },
      message: "GitHub login detected - external cart not available"
    });
  }

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Cart API - Making request to external API with token:', userToken.substring(0, 10) + '...');
    }
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart`, {
      headers: {
        "Content-Type": "application/json",
        "token": userToken
      },
    });

    const payload = await res.json();
    if (process.env.NODE_ENV === 'development') {
      console.log('Cart API - External API response status:', res.status);
    }

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Cart API Error:", error);
    return NextResponse.json({ status: 500, error: "Internal Server Error" });
  }
}

    