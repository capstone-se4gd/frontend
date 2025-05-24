"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function BatchViewPage() {
  const searchParams = useParams()
  const batchId = searchParams.id

  const [batch, setBatch] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBatchDetails = async () => {
      const token = localStorage.getItem("token")
      if (!token || !batchId) return

      try {
        const res = await fetch(`/api/batches/${batchId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to load batch")

        setBatch(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBatchDetails()
  }, [batchId])

  const renderMetricSummary = () => {
    const totals: Record<string, { value: number; unit: string }> = {}

    batch.batchData?.sustainability_metrics.forEach((metric: any) => {
      if (!totals[metric.name]) {
        totals[metric.name] = { value: 0, unit: metric.unit }
      }
      totals[metric.name].value += metric.value
    })

    return Object.entries(totals).map(([name, data]) => (
      <div key={name} className="flex justify-between border-b py-2 text-foreground">
        <span>{name}</span>
        <span className="font-medium">{data.value} {data.unit}</span>
      </div>
    ))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
      </div>
    )
  }

  if (error || !batch) {
    return (
      <div className="text-center mt-12 text-destructive">
        Failed to load batch details: {error}
      </div>
    )
  }

  const { batch: batchInfo, batchData, invoices } = batch

  return (
    <main className="max-w-5xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-balance text-foreground">Batch Details</h1>

      {/* Batch Info */}
      <Card>
        <CardContent className="p-6 space-y-2">
          <h2 className="text-lg font-semibold text-foreground">Batch Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-foreground">
            <div><strong>ID:</strong> {batchInfo.id}</div>
            <div><strong>Product:</strong> {batchInfo.product_name}</div>
            <div><strong>Created:</strong> {formatDate(new Date(batchInfo.created_at))}</div>
            <div>
              <strong>Info:</strong>{" "}
              <a href={batchInfo.information_url} target="_blank" rel="noreferrer" className="text-primary underline">
                View Product
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Invoices</h2>
          {invoices.map((invoice: any) => (
            <div key={invoice.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-foreground">{invoice.invoiceNumber}</span>
                <Badge variant="outline">{invoice.subCategory}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {/* <p><strong>Facility:</strong> {invoice.facility}</p> */}
                <p><strong>Organizational Unit:</strong> {invoice.organizational_unit}</p>
                <p><strong>Product Name:</strong> {invoice.supplierDetails?.name || "N/A"}</p>
                <p><strong>Amount:</strong> {invoice.totalAmount} {invoice.currency}</p>
                <p><strong>Quantity Needed Per Unit:</strong> {invoice.quantityNeededPerUnit ?? "N/A"}</p>
                <p><strong>Emissions Are Per Unit:</strong> {invoice.emissionsArePerUnit ?? "N/A"}</p>
                <p><strong>Units Bought:</strong> {invoice.unitsBought ?? "N/A"}</p>
                <p><strong>Date:</strong> {invoice.invoiceDate}</p>
                <p>
                  <strong>Product:</strong>{" "}
                  <a href={invoice.url} target="_blank" rel="noreferrer" className="text-primary underline">
                    Details
                  </a>
                </p>
              </div>
              <div className="mt-2">
                <h4 className="text-sm font-semibold mb-1 text-foreground">Supplier Sustainability Metrics:</h4>
                <ul className="text-sm list-disc list-inside text-muted-foreground">
                  {invoice.supplierDetails.sustainability_metrics.map((metric: any) => (
                    <li key={metric.name}>
                      {metric.name}: {metric.value} {metric.unit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sustainability Metrics */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Sustainability Metrics Summary</h2>
          {renderMetricSummary()}
        </CardContent>
      </Card>
    </main>
  )
}
