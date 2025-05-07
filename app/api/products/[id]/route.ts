import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const response = await fetch(`http://194.37.81.247:8000/api/products/${id}/`, {
      headers: {
        "Content-Type": "application/json",
      },
      // Add cache: 'no-store' to avoid caching issues
      cache: "no-store",
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `API returned ${response.status}: ${response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching product data:", error)
    return NextResponse.json({ error: "Failed to fetch product data from external API" }, { status: 500 })
  }
}
