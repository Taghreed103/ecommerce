import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
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
    const { id } = await params;
    
    console.log('Address PUT - ID:', id, 'Body:', body);
    
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/addresses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "token": userToken
      },
      body: JSON.stringify(body)
    });

    const payload = await res.json();
    console.log('Address PUT - API Response:', payload);
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Update Address Error:", error);
    return NextResponse.json({ status: 500, error: "Internal Server Error" });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
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
    const { id } = await params;
    
    console.log('Address DELETE - ID:', id);
    
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/addresses/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "token": userToken
      }
    });

    const payload = await res.json();
    console.log('Address DELETE - API Response:', payload);
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Delete Address Error:", error);
    return NextResponse.json({ status: 500, error: "Internal Server Error" });
  }
}
