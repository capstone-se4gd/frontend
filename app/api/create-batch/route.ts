import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get("authorization")

        if (!authHeader) {
            return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 })
        }

        const body = await request.json()

        const response = await fetch("https://msm-integration-876789228877.europe-north1.run.app/api/create-batch", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authHeader,
            },
            cache: "no-store",
            body: JSON.stringify(body),
        })

        if (!response.ok) {
            const errorText = await response.text(); // read raw error
            console.error("Backend error response:", errorText);
            return NextResponse.json(
                { error: `API returned ${response.status}: ${response.statusText}` },
                { status: response.status }
            )
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error("Error creating batch:", error)
        return NextResponse.json({ error: "Failed to create batch" }, { status: 500 })
    }
}
