import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080"

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const documentId = searchParams.get("id")

    if (!documentId) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 })
    }

    const cookieStore = cookies()
    const token = (await cookieStore).get("accessToken")?.value

    const url = `${BACKEND_URL}/api/documents?id=${documentId}`
    const headers = {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
    }

    const res = await fetch(url, {
      method: "DELETE",
      headers,
      cache: "no-store",
    })

    if (!res.ok) {
      let errorData = null
      try {
        errorData = await res.json()
      } catch (_) {}
      return NextResponse.json(
        { error: errorData?.message || "Failed to delete" },
        { status: res.status }
      )
    }

    let data = null
    try {
      data = await res.json()
    } catch (_) {
       data = { success: true }
    }

    return NextResponse.json(data, { status: 200 })

  } catch (err) {
    console.error("Error in DELETE proxy:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// import { cookies } from "next/headers"
// import { NextRequest, NextResponse } from "next/server"

// const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080"

// export async function DELETE(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url)
//     const documentId = searchParams.get("id")

//     if (!documentId) {
//       return NextResponse.json({ error: "Document ID is required" }, { status: 400 })
//     }

//     const cookieStore = cookies()
//     const token = (await cookieStore).get("accessToken")?.value

//     const url = `${BACKEND_URL}/api/documents?id=${documentId}`
//     const headers = {
//       "Content-Type": "application/json",
//       "Authorization": token ? `Bearer ${token}` : "",
//     }

//     const res = await fetch(url, {
//       method: "DELETE",
//       headers,
//       cache: "no-store",
//     })

//     if (!res.ok) {
//       const errorData = await res.json()
//       return NextResponse.json({ error: errorData.message || "Failed to delete" }, { status: res.status })
//     }

//     return NextResponse.json({ success: true }, { status: 200 })

//   } catch (err) {
//     console.error("Error in DELETE proxy:", err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
//   }
// }
