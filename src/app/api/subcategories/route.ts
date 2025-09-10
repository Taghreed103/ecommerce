import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/subcategories`, {
      cache: "no-store"
    });
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Subcategories API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subcategories" },
      { status: 500 }
    );
  }
}
