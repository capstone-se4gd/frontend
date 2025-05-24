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
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/users/${id}`,
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
    console.error("Error fetching user details:", error)
    return NextResponse.json({ error: "Failed to fetch user details" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params
    const authHeader = request.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 })
    }

    // Parse the request body
    const userData = await request.json()
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/users/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(userData),
      }
    )

    if (!response.ok) {
      const errorMessage = await response.text()
      return NextResponse.json(
        { error: `API returned ${response.status}: ${errorMessage}`, success: false },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({ ...data, success: true })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user", success: false }, { status: 500 })
  }
}

export async function DELETE(
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/users/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: authHeader,
        }
      }
    )

    if (!response.ok) {
      const errorMessage = await response.text()
      return NextResponse.json(
        { error: `API returned ${response.status}: ${errorMessage}`, success: false },
        { status: response.status }
      )
    }

    // For DELETE operations, return a success message
    return NextResponse.json({ 
      message: `User with ID ${id} successfully deleted`,
      success: true 
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user", success: false }, { status: 500 })
  }
}
