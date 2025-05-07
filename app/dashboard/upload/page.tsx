"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { PrimaryButton } from "@/components/ui/primary-button"
import { OutlineButton } from "@/components/ui/outline-button"
import { Card, CardContent } from "@/components/ui/card"
import { Stepper } from "@/components/ui/stepper"
import { FileUploader } from "@/components/upload/file-uploader"
import { BatchSummary } from "@/components/upload/batch-summary"

const STEPS = [
  { id: "product", title: "Product Information" },
  { id: "stationary", title: "Stationary Combustion" },
  { id: "heat", title: "Purchased Heat" },
  { id: "goods", title: "Purchased Goods & Services" },
  { id: "electricity", title: "Purchased Electricity" },
  { id: "water", title: "Water Quantities" },
  { id: "review", title: "Review & Submit" },
]

// Extended product categories
const PRODUCT_CATEGORIES = [
  { value: "furniture", label: "Furniture" },
  { value: "textiles", label: "Textiles" },
  { value: "electronics", label: "Electronics" },
  { value: "packaging", label: "Packaging" },
  { value: "construction", label: "Construction Materials" },
  { value: "automotive", label: "Automotive Components" },
  { value: "appliances", label: "Home Appliances" },
  { value: "clothing", label: "Clothing & Apparel" },
  { value: "food", label: "Food & Beverages" },
  { value: "medical", label: "Medical Equipment" },
  { value: "toys", label: "Toys & Games" },
  { value: "office", label: "Office Supplies" },
  { value: "chemicals", label: "Chemicals & Plastics" },
  { value: "agriculture", label: "Agricultural Products" },
  { value: "other", label: "Other" },
]

export default function UploadPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [batchName, setBatchName] = useState("")
  const [productName, setProductName] = useState("")
  const [productCategory, setProductCategory] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [files, setFiles] = useState<{ [key: string]: File[] }>({
    stationary: [],
    heat: [],
    goods: [],
    electricity: [],
    water: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock metrics data that would be extracted from uploaded files
  const [extractedMetrics] = useState({
    stationary: { scope1: "12.5", scope2: "8.3", scope3: "45.7", waterUsage: "320", energyConsumption: "78" },
    heat: { scope1: "5.2", scope2: "3.1", scope3: "22.4", waterUsage: "150", energyConsumption: "35" },
    goods: { scope1: "2.8", scope2: "4.2", scope3: "8.3", waterUsage: "70", energyConsumption: "43" },
    electricity: { scope1: "4.5", scope2: "1.0", scope3: "15.0", waterUsage: "100", energyConsumption: "0" },
    water: { scope1: "3.7", scope2: "2.5", scope3: "12.8", waterUsage: "250", energyConsumption: "12" },
  })

  const handleFileUpload = (step: string, newFiles: File[]) => {
    setFiles((prev) => ({
      ...prev,
      [step]: [...(prev[step] || []), ...newFiles],
    }))
  }

  const handleRemoveFile = (step: string, index: number) => {
    setFiles((prev) => ({
      ...prev,
      [step]: prev[step].filter((_, i) => i !== index),
    }))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Navigate to success page or back to dashboard
      router.push("/dashboard/batches/success")
    } catch (error) {
      console.error("Error submitting batch:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    const currentStepId = STEPS[currentStep].id

    if (currentStepId === "product") {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="batchName" className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Name
                </label>
                <input
                  id="batchName"
                  type="text"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                  placeholder="Enter a name for this batch"
                />
              </div>
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  id="productName"
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                  placeholder="Enter the product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Category</label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                  rows={3}
                  placeholder="Enter a description of the product"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                ></textarea>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (currentStepId === "review") {
      return (
        <BatchSummary
          batchName={batchName}
          productName={productName}
          productCategory={PRODUCT_CATEGORIES.find((c) => c.value === productCategory)?.label || productCategory}
          productDescription={productDescription}
          files={files}
          metrics={extractedMetrics}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      )
    }

    // For all other steps, just show the file uploader
    return (
      <div className="space-y-6">
        <FileUploader
          title={`Upload ${STEPS[currentStep].title} Files`}
          description="Upload XML invoices or other supporting documents. The system will automatically extract sustainability metrics from these files."
          accept=".xml,.pdf,.xlsx"
          files={files[currentStepId] || []}
          onUpload={(newFiles) => handleFileUpload(currentStepId, newFiles)}
          onRemove={(index) => handleRemoveFile(currentStepId, index)}
        />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Upload Sustainability Data</h1>
        <p className="text-gray-500 mt-1">Complete all steps to submit your batch</p>
      </div>

      <Stepper steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} />

      <div className="my-8">{renderStepContent()}</div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
        <OutlineButton onClick={handlePrevious} disabled={currentStep === 0}>
          Previous
        </OutlineButton>

        {currentStep < STEPS.length - 1 ? (
          <PrimaryButton onClick={handleNext}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </PrimaryButton>
        ) : null}
      </div>
    </div>
  )
}
