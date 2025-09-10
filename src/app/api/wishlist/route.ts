import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json({ status: 401, error: "Unauthorized" });
  }

  const userToken = token.token as string;
  if (!userToken) {
    // For GitHub login, return empty wishlist matching the external API structure
    return NextResponse.json({
      status: "success",
      results: 0,
      data: [],
      message: "External wishlist not available for this login method"
    });
  }

  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
      headers: {
        "Content-Type": "application/json",
        "token": userToken
      }
    });

    const payload = await res.json();
    console.log('Wishlist GET - API Response:', payload);
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Wishlist GET Error:", error);
    return NextResponse.json({ status: 500, error: "Internal Server Error" });
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json({ status: 401, error: "Unauthorized" });
  }

  const userToken = token.token as string;
  if (!userToken) {
    return NextResponse.json({
      status: "error",
      message: "External API access not available for this login method"
    });
  }

  try {
    const body = await req.json();
    console.log('Wishlist POST - Request body:', body);
    
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": userToken
      },
      body: JSON.stringify(body)
    });

    const payload = await res.json();
    console.log('Wishlist POST - API Response:', payload);
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Add to Wishlist Error:", error);
    return NextResponse.json({ status: 500, error: "Internal Server Error" });
  }
}

export async function DELETE(req: NextRequest) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json({ status: 401, error: "Unauthorized" });
  }

  const userToken = token.token as string;
  if (!userToken) {
    return NextResponse.json({
      status: "error",
      message: "External API access not available for this login method"
    });
  }

  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json({ status: 400, error: "Product ID is required" });
    }

    console.log('Wishlist DELETE - Product ID:', productId);

    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "token": userToken
      }
    });

    const payload = await res.json();
    console.log('Wishlist DELETE - API Response:', payload);
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Remove from Wishlist Error:", error);
    return NextResponse.json({ status: 500, error: "Internal Server Error" });
  }
}