"use client"

import { FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PrimaryButton } from "@/components/ui/primary-button"
import { Loader2 } from "lucide-react"

interface BatchSummaryProps {
  batchName: string
  productName: string
  productCategory?: string
  productDescription?: string
  files: { [key: string]: File[] }
  metrics: { [key: string]: { [key: string]: string } }
  isSubmitting: boolean
  onSubmit: () => void
  transactions: Record<string, string>
}

export function BatchSummary({
  batchName,
  productName,
  productCategory,
  productDescription,
  files,
  metrics,
  isSubmitting,
  onSubmit,
  transactions
}: BatchSummaryProps) {
  const totalFiles = Object.values(files).reduce((total, fileArray) => total + fileArray.length, 0)

  const stepNames: { [key: string]: string } = {
    stationary: "Stationary Combustion",
    heat: "Purchased Heat",
    goods: "Purchased Goods & Services",
    electricity: "Purchased Electricity",
    water: "Water Quantities",
  }

  const metricLabels: { [key: string]: string } = {
    scope1: "something",
    scope2: "something",
    scope3: "something",
    waterUsage: "something",
    energyConsumption: "something",
  }

  const metricUnits: { [key: string]: string } = {
    scope1: "kg CO2e",
    scope2: "kg CO2e",
    scope3: "kg CO2e",
    waterUsage: "liters",
    energyConsumption: "kWh",
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Batch Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Batch Name</h3>
                <p className="text-lg font-medium">{batchName || "Untitled Batch"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Product</h3>
                <p className="text-lg font-medium">{productName || "Unspecified Product"}</p>
              </div>
              {productCategory && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="text-lg font-medium">{productCategory}</p>
                </div>
              )}
              {productDescription && (
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="text-base">{productDescription}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Files Uploaded</h3>
              <p className="text-lg font-medium">{totalFiles} files</p>
              {totalFiles > 0 && (
                <div className="mt-2 space-y-2">
                  {Object.entries(files).map(
                    ([step, fileArray]) =>
                      fileArray.length > 0 && (
                        <div key={step} className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm">
                            {stepNames[step]}: {fileArray.length} file(s)
                          </span>
                        </div>
                      ),
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Extracted Sustainability Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(metrics).map(([step, stepMetrics]) => (
              <div key={step}>
                <h3 className="text-lg font-medium mb-3">{stepNames[step]}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(stepMetrics).map(([field, value]) => (
                    <div key={`${step}-${field}`}>
                      <h4 className="text-sm font-medium text-gray-500">{metricLabels[field] || field}</h4>
                      <p className="text-base">
                        {value || "Not specified"}{" "}
                        {value && <span className="text-sm text-gray-500">{metricUnits[field] || ""}</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center space-y-4 mt-8">
        <PrimaryButton onClick={isSubmitting ? undefined : onSubmit} className={`w-[1/2] py-6 text-lg ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Batch"
          )}
        </PrimaryButton>
        <button type="button" className="text-sm text-gray-500 hover:text-[#12b784]" disabled={isSubmitting}>
          Send to Microsoft Sustainability Manager
        </button>
      </div>
    </div>
  )
}
