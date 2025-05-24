import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params
    const authHeader = request.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 })
    }

    const response = await fetch(
      `https://msm-integration-876789228877.europe-north1.run.app/api/batches/${id}`,
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
