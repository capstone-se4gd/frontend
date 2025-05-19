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

const DESCRIPTION = [
  { id: "product", description: "General information about the product being evaluated for sustainability impact." },
  { id: "stationary", description: "Emissions and fuel usage from stationary combustion sources, such as boilers and generators." },
  { id: "heat", description: "Data on externally purchased heat energy used in product operations." },
  { id: "goods", description: "Environmental impact of goods and services purchased to create or support the product." },
  { id: "electricity", description: "Electricity consumption related to the product, including source and usage patterns." },
  { id: "water", description: "Volume of water used in the product lifecycle or manufacturing process." },
  { id: "review", description: "Final step to review and submit all entered sustainability metrics for this product." }
];

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
  const [transactions, setTransactions] = useState<Record<string, string>>({})

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

  const handleNext = async () => {
    const stepId = STEPS[currentStep].id;

    // Validation for the "product" step
    if (stepId === "product") {
      if (!batchName || !productName || !productCategory || !productDescription) {
        alert("Please complete all product information fields before proceeding.");
        return;
      }
    }

    const fileUploadSteps = ["stationary", "heat", "goods", "electricity", "water"];

    // Check if current step expects files
    if (fileUploadSteps.includes(stepId)) {
      const stepFiles = files[stepId];

      // If there are no files, skip upload and go to next step
      if (!stepFiles || stepFiles.length === 0) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
        return;
      }

      // Proceed with file upload
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token missing");
        alert("Authentication token missing. Please log in again.");
        return;
      }

      const formData = new FormData();
      for (const file of stepFiles) {
        formData.append("files", file);
      }

      try {
        const response = await fetch("/api/process-invoices", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Upload failed", data);
          alert("File processing failed. Please try again.");
          return;
        } else {
          console.log("Success", data);
          // Optionally update any state here

          if (data.transaction_id) {
            setTransactions((prev) => ({
              ...prev,
              [stepId]: data.transaction_id,
            }));
          }
        }
      } catch (error) {
        console.error("Network error during file upload", error);
        alert("Something went wrong during the upload. Please try again.");
        return;
      }
    }

    // Continue to next step (if upload succeeded or wasn't needed)
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  async function submitBatch(
    transactions: Record<string, string>,
    productName: string,
    productId: string | null,
    setIsSubmitting: (value: boolean) => void,
  ) {
    setIsSubmitting(true);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const allInvoices: any[] = [];

      for (const id of Object.values(transactions)) {
        const res = await fetch(`/api/transaction/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch transaction with id: ${id}`);
        }

        const data = await res.json();
        console.log(data);
        const invoices = data.result.map((invoice: any) => ({
          facility: invoice.SellerPartyDetails?.SellerOrganisationName || "Unknown Facility",
          organizationalUnit: invoice.BuyerPartyDetails?.BuyerOrganisationName || "Unknown OU",
          url: invoice.other_url || "",
          subCategory: invoice.InvoiceDetails?.InvoiceTypeCode || "",
          invoiceNumber: invoice.InvoiceDetails?.InvoiceNumber || "",
          invoiceDate: invoice.InvoiceDetails?.InvoiceDate || "",
          emissionsArePerUnit: "false",
          quantityNeededPerUnit: 0,
          unitsBought: invoice.InvoiceRows?.reduce((sum: number, row: any) => sum + Number(row.DeliveredQuantity || 0), 0) || 0,
          totalAmount: Number(invoice.InvoiceDetails?.InvoiceTotalVatIncludedAmount || 0),
          currency: invoice.InvoiceDetails?.CurrencyIdentifier || "",
          transactionStartDate: invoice.MessageTransmissionDetails?.MessageTimeStamp || "",
          transactionEndDate: invoice.MessageTransmissionDetails?.MessageTimeStamp || "",
          sustainabilityMetrics: invoice.sustainabilityMetrics,
          productName: invoice.InvoiceRows?.[0]?.ArticleName || "Unknown Product",
        }));

        allInvoices.push(...invoices);
      }

      const payload = {
        productName,
        productId,
        invoices: allInvoices,
      };

      console.log("Submitting batch with payload:", {
        productName,
        productId,
        invoices: allInvoices,
      });
      const createBatchRes = await fetch("/api/create-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      console.log
      if (!createBatchRes.ok) {
        const errorText = await createBatchRes.text();
        throw new Error(`Create batch failed: ${errorText}`);
      }

      const result = await createBatchRes.json();
      // Save productId and batchId in localStorage
      localStorage.setItem("createdProductId", result.productId);
      localStorage.setItem("createdBatchId", result.batchId);
      console.log("Batch created successfully:", result);
    } catch (error: any) {
      console.error("Error during batch submission:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }


  const handleSubmit = async () => {
    try {
      submitBatch(
        transactions,
        productName,
        null,
        setIsSubmitting
      )
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
    const description = DESCRIPTION.find(e => e.id === currentStepId)?.description

    if (currentStepId === "product") {
      return (
        <div>
          <div className="pb-3" id="step-description" role="region" aria-label="Step description">
            {description}
          </div>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={(e) => e.preventDefault()} aria-labelledby="product-info-heading">
                <h2 id="product-info-heading" className="sr-only">Product Information Form</h2>
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
                      aria-required="true"
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
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Category
                    </label>
                    <select
                      id="productCategory"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      aria-required="true"
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
                    <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="productDescription"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                      rows={3}
                      placeholder="Enter a description of the product"
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      aria-describedby="description-hint"
                    ></textarea>
                    <p id="description-hint" className="text-sm text-gray-500 mt-1">
                      Provide details about the product's features and specifications.
                    </p>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )
    }

    if (currentStepId === "review") {
      return (
        <div aria-labelledby="review-heading">
          <h2 id="review-heading" className="sr-only">Review and Submit</h2>
          <BatchSummary
            batchName={batchName}
            productName={productName}
            productCategory={PRODUCT_CATEGORIES.find((c) => c.value === productCategory)?.label || productCategory}
            productDescription={productDescription}
            files={files}
            metrics={extractedMetrics}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            transactions={transactions}
          />
        </div>
      )
    }

    // For all other steps, just show the file uploader
    return (
      <div className="space-y-6" aria-labelledby={`${currentStepId}-heading`}>
        <h2 id={`${currentStepId}-heading`} className="sr-only">{STEPS[currentStep].title}</h2>
        <div id={`${currentStepId}-description`} className="mb-4" aria-live="polite">
          {description}
        </div>
        <FileUploader
          title={`Upload ${STEPS[currentStep].title} Files`}
          description="Upload XML invoices or other supporting documents. The system will automatically extract sustainability metrics from these files."
          accept=".xml,.pdf,.xlsx"
          files={files[currentStepId] || []}
          onUpload={(newFiles) => handleFileUpload(currentStepId, newFiles)}
          onRemove={(index) => handleRemoveFile(currentStepId, index)}
          id={`${currentStepId}-uploader`}
          ariaLabel={`Upload files for ${STEPS[currentStep].title}`}
        />
      </div>
    )
  }

  return (
    <main className="max-w-5xl mx-auto" role="main">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Upload Sustainability Data</h1>
        <p className="text-gray-500 mt-1">Complete all steps to submit your batch</p>
      </div>

      <nav aria-label="Form steps">
        <Stepper
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
          aria-current={`step ${currentStep + 1} of ${STEPS.length}`}
          aria-controls="step-content"
        />
      </nav>

      <div className="my-8" id="step-content" role="region" aria-label={STEPS[currentStep].title}>
        {renderStepContent()}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
        <OutlineButton
          onClick={handlePrevious}
          disabled={currentStep === 0}
          ariaLabel="Go to previous step"
        >
          Previous
        </OutlineButton>

        {currentStep < STEPS.length - 1 ? (
          <PrimaryButton
            onClick={handleNext}
            ariaLabel="Go to next step"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </PrimaryButton>
        ) : null}
      </div>
    </main>
  )
}