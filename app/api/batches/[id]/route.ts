import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
export const runtime = 'edge' // or 'nodejs'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const authHeader = request.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 })
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/batches/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      const errorMessage = await response.text()
      return NextResponse.json(
        { error: `API returned ${response.status}: ${errorMessage}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching batch details:", error)
    return NextResponse.json({ error: "Failed to fetch batch details" }, { status: 500 })
  }
}
