"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { PrimaryButton } from "@/components/ui/primary-button"
import { OutlineButton } from "@/components/ui/outline-button"
import { Card, CardContent } from "@/components/ui/card"

export default function SuccessPage() {
  const router = useRouter()
  const [batchId, setBatchId] = useState<string | null>(null)

  useEffect(() => {
    const storedBatchId = localStorage.getItem("createdBatchId")
    setBatchId(storedBatchId)
  }, [])

  return (
    <div className="max-w-3xl mx-auto text-center">
      <div className="mb-8 flex justify-center">
        <CheckCircle2 className="h-24 w-24 text-[#12b784]" />
      </div>

      <h1 className="text-3xl font-bold mb-4">Batch Submitted Successfully!</h1>
      <p className="text-gray-600 mb-8">
        Your sustainability data has been processed and is now available in the system.
      </p>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Batch ID:</span>
              <span>{batchId || "Loading..."}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Submission Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Status:</span>
              <span className="text-[#12b784] font-medium">Processed</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">MSM Integration:</span>
              <span className="text-blue-600 font-medium">Pending</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <PrimaryButton
          disabled={!batchId}
          onClick={() => router.push(`/dashboard/batches/${batchId}`)}
        >
          View Batch Details
        </PrimaryButton>
        <OutlineButton onClick={() => router.push("/dashboard")}>
          Return to Dashboard
        </OutlineButton>
      </div>
    </div>
  )
}
