import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/brands`, {
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const payload = await res.json();
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Brands API Error:", error);
    return NextResponse.json({ 
      status: 500, 
      error: "Failed to fetch brands",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}