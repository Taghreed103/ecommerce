import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json({ status: 401, error: "Unauthorized" });
  }

  const userToken = token.token as string;
  if (!userToken) {
    // For GitHub login, return empty addresses
    return NextResponse.json({
      status: "success",
      results: 0,
      data: [],
      message: "External addresses not available for this login method"
    });
  }

  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/addresses`, {
      headers: {
        "Content-Type": "application/json",
        "token": userToken
      }
    });

    const payload = await res.json();
    console.log('Addresses GET - API Response:', payload);
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Addresses GET Error:", error);
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
    console.log('Addresses POST - Request body:', body);
    
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": userToken
      },
      body: JSON.stringify(body)
    });

    const payload = await res.json();
    console.log('Addresses POST - API Response:', payload);
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Add Address Error:", error);
    return NextResponse.json({ status: 500, error: "Internal Server Error" });
  }
}
