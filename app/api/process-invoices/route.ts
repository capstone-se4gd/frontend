import { NextRequest, NextResponse } from 'next/server'

// Important: Use edge functions if needed, but for FormData and streaming, stick to Node.js runtime
export const config = {
    api: {
        bodyParser: false,
    },
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const files = formData.getAll("files")

        if (!files || files.length === 0) {
            return NextResponse.json({ message: "No files provided" }, { status: 400 })
        }

        const token = request.headers.get("authorization")?.split(" ")[1]
        if (!token) {
            return NextResponse.json({ message: "Missing auth token" }, { status: 401 })
        }

        // Create form data to forward to Flask
        const forwardForm = new FormData()
        files.forEach((entry) => {
            if (entry instanceof File) {
                forwardForm.append("files", entry)
            }
        })
        console.log(token)
        const flaskResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/process-invoices`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                // Don't set Content-Type, browser will do it correctly with FormData
            },
            body: forwardForm,
        })

        const data = await flaskResponse.json()

        if (!flaskResponse.ok) {
            return NextResponse.json({ message: data.message || "Upload failed" }, { status: flaskResponse.status })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
