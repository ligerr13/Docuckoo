import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const BACKEND = process.env.BACKEND_URL || "http://localhost:8080"

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get("accessToken")?.value

    const url = `${BACKEND}/api/documents/my-documents`
    const headers = {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
    }

    const res = await fetch(url, {
      headers,
      cache: "no-store",
    })

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: res.status })
    }

    const data = await res.json()

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
