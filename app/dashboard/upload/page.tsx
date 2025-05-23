"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, Plus, X } from "lucide-react"
import { PrimaryButton } from "@/components/ui/primary-button"
import { OutlineButton } from "@/components/ui/outline-button"
import { Card, CardContent } from "@/components/ui/card"
import { Stepper } from "@/components/ui/stepper"
import { FileUploader } from "@/components/upload/file-uploader"
import { BatchSummary } from "@/components/upload/batch-summary"

// Define product interface
interface Product {
  productId: string;
  productName: string;
}

interface Invoice {
  id: string
  facility: string
  organizationalUnit: string
  url: string
  subCategory: string
  invoiceNumber: string
  invoiceDate: string
  emissionsArePerUnit: string
  quantityNeededPerUnit: number
  unitsBought: number
  totalAmount: number
  currency: string
  transactionStartDate: string
  transactionEndDate: string
  sustainabilityMetrics: MetricItem[]
  productName: string
}

interface MetricItem {
  name: string;
  description: string;
  unit: string;
  value: number;
}

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
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [isCreatingNewProduct, setIsCreatingNewProduct] = useState(false)
  const [existingProducts, setExistingProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
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
  // Add a new state variable for processing status
  const [isProcessing, setIsProcessing] = useState(false)

  // Add this state to track processed files metadata
  const [processedFilesMetadata, setProcessedFilesMetadata] = useState<{
    [key: string]: { names: string[]; sizes: number[]; lastModified: number[] }
  }>({});

  // Fetch existing products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true)
        const token = localStorage.getItem("token")
        
        if (!token) {
          console.error("No authentication token found")
          setLoadingProducts(false)
          return
        }
        
        const response = await fetch('/api/products', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data: Product[] = await response.json()
        setExistingProducts(data)
        
        // If products exist, default to select mode, otherwise default to create mode
        if (data.length > 0) {
          setIsCreatingNewProduct(false)
          setSelectedProductId(data[0].productId)
          setProductName(data[0].productName)
        } else {
          setIsCreatingNewProduct(true)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoadingProducts(false)
      }
    }
    
    fetchProducts()
  }, [])
  
  // Handle product selection
  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    
    if (value === "new") {
      // User selected "Create new product"
      setIsCreatingNewProduct(true)
      setSelectedProductId(null)
      setProductName("")
    } else {
      // User selected an existing product
      setIsCreatingNewProduct(false)
      setSelectedProductId(value)
      
      // Set the product name based on the selected ID
      const selectedProduct = existingProducts.find(p => p.productId === value)
      if (selectedProduct) {
        setProductName(selectedProduct.productName)
      }
    }
  }
  
  // Toggle to create new product mode
  const handleCreateNewProduct = () => {
    setIsCreatingNewProduct(true)
    setSelectedProductId(null)
    setProductName("")
  }
  
  // Cancel creating new product
  const handleCancelNewProduct = () => {
    setIsCreatingNewProduct(false)
    
    // If there are products, reset to first one, otherwise stay in creation mode
    if (existingProducts.length > 0) {
      const firstProduct = existingProducts[0]
      setSelectedProductId(firstProduct.productId)
      setProductName(firstProduct.productName)
    } else {
      setIsCreatingNewProduct(true)
    }
  }

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
      if (!productName || !productDescription) {
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

      // Check if files have already been processed and haven't changed
      const hasTransaction = transactions[stepId];
      const previousMetadata = processedFilesMetadata[stepId];
      const currentFilesMetadata = {
        names: stepFiles.map(f => f.name),
        sizes: stepFiles.map(f => f.size),
        lastModified: stepFiles.map(f => f.lastModified)
      };
      
      const filesUnchanged = hasTransaction && previousMetadata && 
        JSON.stringify(previousMetadata) === JSON.stringify(currentFilesMetadata);
      
      if (filesUnchanged) {
        console.log(`Files for ${stepId} already processed, skipping upload`);
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
        // Show loading backdrop while processing
        setIsProcessing(true);

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

          if (data.transaction_id) {
            // Save transaction ID
            setTransactions((prev) => ({
              ...prev,
              [stepId]: data.transaction_id,
            }));
            
            // Store metadata of processed files
            setProcessedFilesMetadata(prev => ({
              ...prev,
              [stepId]: currentFilesMetadata
            }));
          }
        }
      } catch (error) {
        console.error("Network error during file upload", error);
        alert("Something went wrong during the upload. Please try again.");
        return;
      } finally {
        // Hide loading backdrop when done
        setIsProcessing(false);
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
    invoices: Invoice[],
    productName: string,
    productId: string | null,
    setIsSubmitting: (value: boolean) => void,
  ) {
    setIsSubmitting(true);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in again.");
      setIsSubmitting(false);
      return null;
    }

    try {
      const payload = {
        productName,
        productId,
        invoices: invoices,
      };
      console.log("📦 Final payload:", JSON.stringify(payload, null, 2));

      const createBatchRes = await fetch("/api/create-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!createBatchRes.ok) {
        const errorText = await createBatchRes.text();
        throw new Error(`Create batch failed: ${errorText}`);
      }

      const result = await createBatchRes.json();
      // Save productId and batchId in localStorage
      localStorage.setItem("createdProductId", result.productId);
      localStorage.setItem("createdBatchId", result.batchId);
      console.log("Batch created successfully:", result);
      
      return result; // Return the result to be used by the caller
    } catch (error: any) {
      console.error("Error during batch submission:", error);
      alert(`Error: ${error.message}`);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }


  const handleSubmit = async (invoices: Invoice[]) => {
    try {
      const result = await submitBatch(
        invoices,
        productName,
        selectedProductId,
        setIsSubmitting
      );
      
      if (result) {
        // Navigate to success page with the batch information
        router.push(`/dashboard/batches/success?batchId=${result.batchId}&productId=${result.productId}`);
      }
    } catch (error) {
      console.error("Error submitting batch:", error);
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
                    <label htmlFor="productSelect" className="block text-sm font-medium text-gray-700 mb-1">
                      Product 
                    </label>
                    
                    {loadingProducts ? (
                      <div className="animate-pulse h-10 bg-gray-200 rounded-lg"></div>
                    ) : (
                      <>
                        {isCreatingNewProduct ? (
                          <div className="flex items-center space-x-2">
                            <input
                              id="productName"
                              type="text"
                              value={productName}
                              onChange={(e) => setProductName(e.target.value)}
                              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                              placeholder="Enter new product name"
                              aria-required="true"
                            />
                            {existingProducts.length > 0 && (
                              <button
                                type="button"
                                onClick={handleCancelNewProduct}
                                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                aria-label="Cancel creating new product"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <select
                              id="productSelect"
                              value={selectedProductId || ""}
                              onChange={handleProductSelect}
                              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                              aria-label="Select product"
                            >
                              {existingProducts.map(product => (
                                <option key={product.productId} value={product.productId}>
                                  {product.productName}
                                </option>
                              ))}
                              <option value="new">Create new product</option>
                            </select>
                            <button
                              type="button"
                              onClick={handleCreateNewProduct}
                              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                              aria-label="Create new product"
                            >
                              <Plus className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </>
                    )}
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
      
      {/* Loading Backdrop */}
      {isProcessing && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-[#12b784] border-r-[#12b784] border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium">Processing invoices...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
          </div>
        </div>
      )}
    </main>
  )
}