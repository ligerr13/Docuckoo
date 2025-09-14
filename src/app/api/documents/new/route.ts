import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const cookieStore = cookies();
    const token = (await cookieStore).get("accessToken")?.value;

    const url = `${BACKEND_URL}/api/documents/new`;
    const headers = {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
    };

    const res = await fetch(url, {
      method: "POST",
      headers,
      cache: "no-store",
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to create document" },
        { status: res.status }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("Error in POST proxy:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
