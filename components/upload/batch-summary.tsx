"use client"

import { useState, useEffect } from "react"
import { FileText, ChevronDown, ChevronUp, Edit, ExternalLink, Loader2, AlertTriangle, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { PrimaryButton } from "@/components/ui/primary-button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { OutlineButton } from "@/components/ui/outline-button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { formatToTwoDecimals } from "@/lib/utils" // Import the utility function

interface MetricItem {
  name: string;
  description: string;
  unit: string;
  value: number;
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

interface InvoicesByCategory {
  stationary: Invoice[]
  heat: Invoice[]
  goods: Invoice[]
  electricity: Invoice[]
  water: Invoice[]
}

interface BatchSummaryProps {
  batchName: string
  productName: string
  productCategory?: string
  productDescription?: string
  files: { [key: string]: File[] }
  metrics: { [key: string]: { [key: string]: string } }
  isSubmitting: boolean
  onSubmit: (invoices: any[]) => void // Updated to receive invoices parameter
  transactions: Record<string, string>
}

const PREDEFINED_METRICS = [
  {
    name: "Stationary Combustion",
    description: "Emissions related to combustion that occurs in a fixed asset, such as a boiler, furnace, process heater or incinerator",
    unit: "kg"
  },
  {
    name: "Purchased Heat",
    description: "Emissions related to the heating services in the company.",
    unit: "kg"
  },
  {
    name: "Purchased Goods and Services",
    description: "Emissions related to extraction, production, and transportation of goods and services purchased or acquired.",
    unit: "kg"
  },
  {
    name: "Purchased Electricity (Energy)",
    description: "Electric energy measured in MWh and delivered by a utility company according to a signed agreement with a customer.",
    unit: "MWh"
  },
  {
    name: "Water Quantities",
    description: "Stores the actual quantity information from water transactions within the organization.",
    unit: "Cubic meters"
  }
];

// Function to check if all metrics are already added
const getAvailableMetrics = (existingMetrics: MetricItem[] = []) => {
  return PREDEFINED_METRICS.filter(predefined => 
    !existingMetrics.some(existing => existing.name === predefined.name)
  );
};

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
  const [invoices, setInvoices] = useState<InvoicesByCategory>({
    stationary: [],
    heat: [],
    goods: [],
    electricity: [],
    water: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [expandedMetrics, setExpandedMetrics] = useState<Record<string, boolean>>({})
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [calculatedMetrics, setCalculatedMetrics] = useState<{ [key: string]: { value: number, unit: string, sources: { name: string, value: number }[] } }>({})
  const [invoicesWithWarnings, setInvoicesWithWarnings] = useState<Set<string>>(new Set())
  const [showSubmitWarning, setShowSubmitWarning] = useState(false)
  const [invoicesToFix, setInvoicesToFix] = useState<{id: string, category: string, name: string}[]>([])
  const [addingNewMetric, setAddingNewMetric] = useState(false)
  const [newMetric, setNewMetric] = useState<Partial<MetricItem>>({
    name: "",
    description: "",
    unit: "kg",
    value: 0
  })

  const totalFiles = Object.values(files).reduce((total, fileArray) => total + fileArray.length, 0)

  const stepNames: { [key: string]: string } = {
    stationary: "Stationary Combustion",
    heat: "Purchased Heat",
    goods: "Purchased Goods & Services",
    electricity: "Purchased Electricity",
    water: "Water Quantities",
  }

  const metricLabels: { [key: string]: string } = {
    scope1: "Scope 1 Emissions",
    scope2: "Scope 2 Emissions",
    scope3: "Scope 3 Emissions",
    waterUsage: "Water Usage",
    energyConsumption: "Energy Consumption",
  }

  const metricUnits: { [key: string]: string } = {
    scope1: "kg CO2e",
    scope2: "kg CO2e",
    scope3: "kg CO2e",
    waterUsage: "liters",
    energyConsumption: "kWh",
  }

  // Fetch invoice data when component mounts
  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (Object.keys(transactions).length === 0) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        
        if (!token) {
          throw new Error("Authentication token missing")
        }
        
        const categoryMap: Record<string, keyof InvoicesByCategory> = {
          stationary: "stationary",
          heat: "heat",
          goods: "goods",
          electricity: "electricity",
          water: "water"
        }
        
        const newInvoices: InvoicesByCategory = {
          stationary: [],
          heat: [],
          goods: [],
          electricity: [],
          water: []
        }
        
        // Fetch data for each transaction
        for (const [category, id] of Object.entries(transactions)) {
          const mappedCategory = categoryMap[category]
          if (!mappedCategory) continue
          
          const res = await fetch(`/api/transaction/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          
          if (!res.ok) {
            throw new Error(`Failed to fetch transaction with id: ${id}`)
          }
          
          const data = await res.json()

          const subCategories = {
            stationary: "Stationary Combustion",
            heat: "Purchased Heat",
            goods: "Purchased Goods and Services",
            electricity: "Purchased Electricity (Energy)",
            water: "Water Quantities"
          }

          // Update processedInvoices to track warnings
          const processedInvoices = data.result.map((invoice: any, idx: number) => {
            // Process sustainability metrics to ensure 2 decimal places
            const processedMetrics = Array.isArray(invoice.sustainabilityMetrics) 
              ? invoice.sustainabilityMetrics.map((metric: any) => ({
                  ...metric,
                  value: formatToTwoDecimals(metric.value)
                }))
              : [];

            const processed = {
              id: `${mappedCategory}-${idx}`, // Keep ID for internal tracking
              facility: invoice.SellerPartyDetails?.SellerOrganisationName || "",
              organizationalUnit: invoice.BuyerPartyDetails?.BuyerOrganisationName || "",
              subCategory: subCategories[mappedCategory] || "",
              invoiceNumber: invoice.InvoiceDetails?.InvoiceNumber || "",
              invoiceDate: invoice.InvoiceDetails?.InvoiceDate || "",
              emissionsArePerUnit: "EMPTY", // Changed from "false" to "NO"
              quantityNeededPerUnit: 0,
              unitsBought: invoice.InvoiceRows?.reduce((sum: number, row: any) => sum + Number(row.DeliveredQuantity || 0), 0) || 0,
              totalAmount: Number(invoice.InvoiceDetails?.InvoiceTotalVatIncludedAmount || 0),
              currency: invoice.InvoiceDetails?.CurrencyIdentifier || "",
              transactionStartDate: invoice.MessageTransmissionDetails?.MessageTimeStamp || "",
              transactionEndDate: invoice.MessageTransmissionDetails?.MessageTimeStamp || "",
              sustainabilityMetrics: processedMetrics,
              productName: invoice.InvoiceRows?.[0]?.ArticleName || "",
              url: invoice.other_url || "", // Keep URL for UI functionality
            };
            
            // Check for warnings - missing metrics or invalid emissions per unit setting
            if (!hasValidMetrics(processed)) {
              setInvoicesWithWarnings(prev => new Set(prev).add(`${mappedCategory}-${idx}`));
            }
            
            if (!hasValidEmissionsPerUnit(processed)) {
              setInvoicesWithWarnings(prev => new Set(prev).add(`${mappedCategory}-${idx}`));
            }
            
            return processed;
          })
          
          newInvoices[mappedCategory] = processedInvoices
        }
        
        setInvoices(newInvoices)
        calculateMetricSums(newInvoices)
      } catch (error: any) {
        console.error("Error fetching invoice data:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchInvoiceData()
  }, [transactions])
  
  // Calculate the sum of metrics from all invoices and track sources
  const calculateMetricSums = (invoiceData: InvoicesByCategory) => {
    // Map metric names to their respective categories
    const metricNameToCategoryMap: Record<string, string> = {
      "Stationary Combustion": "stationary",
      "Purchased Heat": "heat",
      "Purchased Goods and Services": "goods",
      "Purchased Electricity (Energy)": "electricity",
      "Water Quantities": "water"
    };

    // Initialize metric sums with their appropriate units
    const metricSums: { [key: string]: { value: number, unit: string, sources: { name: string, value: number }[] } } = {
      stationary: { value: 0, unit: "kg CO2e", sources: [] },
      heat: { value: 0, unit: "kg CO2e", sources: [] },
      goods: { value: 0, unit: "kg CO2e", sources: [] },
      electricity: { value: 0, unit: "MWh", sources: [] },
      water: { value: 0, unit: "Cubic meters", sources: [] }
    };
    
    // Sum up metrics from all invoices
    Object.values(invoiceData).forEach(categoryInvoices => {
      categoryInvoices.forEach((invoice: Invoice) => {
        if (invoice.sustainabilityMetrics && Array.isArray(invoice.sustainabilityMetrics)) {
          invoice.sustainabilityMetrics.forEach(metric => {
            const category = metricNameToCategoryMap[metric.name];
            if (category && metricSums[category]) {
              // Calculate adjusted value based on emissionsArePerUnit
              let adjustedValue = metric.value;
              
              // Skip calculation if these values are invalid
              if (isNaN(invoice.quantityNeededPerUnit) || invoice.quantityNeededPerUnit <= 0) {
                console.warn(`Invalid quantityNeededPerUnit (${invoice.quantityNeededPerUnit}) for invoice ${invoice.id}`);
              } else if (invoice.emissionsArePerUnit === "YES") {
                // If emissions are per unit, multiply by quantityNeededPerUnit
                adjustedValue = formatToTwoDecimals(metric.value * invoice.quantityNeededPerUnit);
              } else if (invoice.emissionsArePerUnit === "NO") {
                // If emissions are not per unit, multiply by quantityNeededPerUnit / unitsBought
                if (isNaN(invoice.unitsBought) || invoice.unitsBought <= 0) {
                  console.warn(`Invalid unitsBought (${invoice.unitsBought}) for invoice ${invoice.id}`);
                } else {
                  adjustedValue = formatToTwoDecimals(metric.value * (invoice.quantityNeededPerUnit / invoice.unitsBought));
                }
              }
              
              metricSums[category].value = formatToTwoDecimals(metricSums[category].value + adjustedValue);
              metricSums[category].unit = metric.unit;
              metricSums[category].sources.push({
                name: invoice.productName,
                value: adjustedValue // Store the adjusted value in sources for correct breakdown
              });
            }
          });
        }
      });
    });
    
    setCalculatedMetrics(metricSums);
  }
  
  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }
  
  // Toggle metric expansion
  const toggleMetric = (step: string, metric: string) => {
    const key = `${step}-${metric}`
    setExpandedMetrics(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }
  
  // Open edit modal for an invoice
  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setIsEditModalOpen(true)
  }

  // Function to check if an invoice has valid metrics
  const hasValidMetrics = (invoice: Invoice): boolean => {
    return Array.isArray(invoice.sustainabilityMetrics) && 
            invoice.sustainabilityMetrics.length > 0;
  }

  // Add a new function to validate the emissions per unit field
  const hasValidEmissionsPerUnit = (invoice: Invoice): boolean => {
    return invoice.emissionsArePerUnit === "YES" || invoice.emissionsArePerUnit === "NO";
  }
  
  // Save edited invoice
  const handleSaveInvoiceEdit = () => {
    if (editingInvoice && hasValidMetrics(editingInvoice)) {
      // Remove from warnings list if it now has metrics
      if (editingInvoice.id && invoicesWithWarnings.has(editingInvoice.id)) {
        const newWarnings = new Set(invoicesWithWarnings);
        newWarnings.delete(editingInvoice.id);
        setInvoicesWithWarnings(newWarnings);
      }
    }
    
    // Update the invoices state with the edited invoice
    setInvoices(prev => {
      const updatedInvoices = { ...prev }
      const category = (Object.keys(updatedInvoices) as (keyof InvoicesByCategory)[]).find(cat => 
        updatedInvoices[cat].some(inv => inv.id === editingInvoice?.id)
      )
      
      if (category && editingInvoice) {
        updatedInvoices[category] = updatedInvoices[category].map(inv => 
          inv.id === editingInvoice.id ? editingInvoice : inv
        )
      }
      
      // Recalculate metric sums with the updated invoices data
      setTimeout(() => calculateMetricSums(updatedInvoices), 0);
      return updatedInvoices;
    });

    setIsEditModalOpen(false);
    setEditingInvoice(null);
    setAddingNewMetric(false);
    setNewMetric({
      name: "",
      description: "",
      unit: "kg",
      value: 0
    });
  }

  // Format date string for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString()
    } catch (e) {
      return dateString
    }
  }

  // Update validation for the new format
  const validateInvoice = (invoice: Invoice): boolean => {
    // Check if required fields are present
    if (!invoice.productName || !invoice.facility || !invoice.invoiceNumber) {
      alert("Please fill in all required fields");
      return false;
    }
    
    // Validate invoice date
    if (!invoice.invoiceDate) {
      alert("Please select an invoice date");
      return false;
    }
    
    // Validate numeric values
    if (invoice.totalAmount < 0) {
      alert("Total amount cannot be negative");
      return false;
    }
    
    if (invoice.unitsBought <= 0) {
      alert("Units bought cannot be negative or zero");
      return false;
    }
    
    if (invoice.quantityNeededPerUnit <= 0) {
      alert("Quantity needed per unit cannot be negative or zero");
      return false;
    }
    
    // Validate emissions per unit selection
    if (invoice.emissionsArePerUnit !== "YES" && invoice.emissionsArePerUnit !== "NO") {
      alert("Please select whether emissions are per unit or not");
      return false;
    }
    
    // Validate sustainability metrics
    if (Array.isArray(invoice.sustainabilityMetrics)) {
      for (const metric of invoice.sustainabilityMetrics) {
        if (metric.value < 0) {
          alert(`${metric.name} value cannot be negative`);
          return false;
        }
      }
    }
    
    return true;
  };

  // Function to gather all invoices from different categories
  const getAllInvoices = () => {
    // Flatten the invoices object into a single array
    const allInvoices: Invoice[] = [];
    Object.values(invoices).forEach(categoryInvoices => {
      categoryInvoices.forEach((invoice: Invoice) => {
        // Create a copy without internal tracking fields before sending to server
        const { id, url, ...cleanInvoice } = invoice;
        allInvoices.push({...cleanInvoice, id: id || "", url: url || ""});
      });
    });
    return allInvoices;
  };

  // Add a function to validate before submission
  const handleSubmitAttempt = () => {
    if (invoicesWithWarnings.size > 0) {
      // Collect information about invoices with warnings
      const warningInvoices: {id: string, category: string, name: string}[] = [];
      
      Object.entries(invoices).forEach(([category, invoiceList]) => {
        invoiceList.forEach((invoice: Invoice) => {
          if (invoice.id && invoicesWithWarnings.has(invoice.id)) {
            warningInvoices.push({
              id: invoice.id,
              category: stepNames[category as keyof typeof stepNames] || category,
              name: invoice.productName
            });
          }
        });
      });
      
      setInvoicesToFix(warningInvoices);
      setShowSubmitWarning(true);
    } else {
      // No warnings, proceed with submission
      onSubmit(getAllInvoices());
    }
  }

  // Function to add a new metric to an invoice
  const handleAddMetric = () => {
    if (!editingInvoice) return;
    
    if (!newMetric.name || !newMetric.unit) {
      alert("Please provide at least a name and unit for the metric");
      return;
    }
    
    const updatedMetrics = Array.isArray(editingInvoice.sustainabilityMetrics) 
      ? [...editingInvoice.sustainabilityMetrics] 
      : [];
      
    updatedMetrics.push({
      name: newMetric.name || "",
      description: newMetric.description || "",
      unit: newMetric.unit || "kg",
      value: formatToTwoDecimals(typeof newMetric.value === 'number' ? newMetric.value : 0)
    });
    
    setEditingInvoice({
      ...editingInvoice,
      sustainabilityMetrics: updatedMetrics
    });
    
    setAddingNewMetric(false);
    setNewMetric({
      name: "",
      description: "",
      unit: "kg",
      value: 0
    });
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

      {/* Invoices Section */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loading invoice data...</span>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 text-center">
              Error loading invoice data: {error}
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(stepNames).map(([step, stepName]) => (
                <div key={step} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(step)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 border-b focus:outline-none hover:bg-gray-100"
                  >
                    <h3 className="text-lg font-medium">{stepName}</h3>
                    <div className="flex items-center">
                      <span className="mr-2 text-sm text-gray-500">
                        {invoices[step as keyof InvoicesByCategory]?.length || 0} invoice(s)
                      </span>
                      {expandedSections[step] ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </button>
                  
                  {expandedSections[step] && (
                    <div className="p-4">
                      {invoices[step as keyof InvoicesByCategory]?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {invoices[step as keyof InvoicesByCategory].map((invoice, index) => (
                            <Card 
                              key={`${step}-${index}`} 
                              className={`border-gray-200 hover:shadow-md transition-shadow ${
                                invoice.id && invoicesWithWarnings.has(invoice.id) ? "border-yellow-400 bg-yellow-50" : ""
                              }`}
                            >
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-base">{invoice.productName}</CardTitle>
                                  {invoice.id && invoicesWithWarnings.has(invoice.id) && (
                                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">{invoice.facility}</p>
                              </CardHeader>
                              <CardContent className="py-2">
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Invoice #:</span>
                                    <span>{invoice.invoiceNumber || "N/A"}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Date:</span>
                                    <span>{formatDate(invoice.invoiceDate)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Amount:</span>
                                    <span>{invoice.totalAmount.toFixed(2)} {invoice.currency}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Units:</span>
                                    <span>{invoice.unitsBought}</span>
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="pt-2 flex justify-between">
                                <button 
                                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                  onClick={() => handleEditInvoice(invoice)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </button>
                                {invoice.url && (
                                  <a 
                                    href={invoice.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                  >
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    View
                                  </a>
                                )}
                              </CardFooter>
                              {invoice.id && invoicesWithWarnings.has(invoice.id) && (
                                <div className="px-4 py-2 bg-yellow-50 text-yellow-800 text-xs">
                                  {!hasValidMetrics(invoice) && (
                                    <div className="flex items-center mb-1">
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      Warning: Missing sustainability metrics
                                    </div>
                                  )}
                                  {!hasValidEmissionsPerUnit(invoice) && (
                                    <div className="flex items-center">
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      Warning: Emissions per unit setting required
                                    </div>
                                  )}
                                </div>
                              )}
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No invoices found for this section.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Calculated Metrics Section */}
      <Card>
        <CardHeader>
          <CardTitle>Calculated Sustainability Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Stationary Combustion */}
            <div className="border rounded-lg p-5 hover:shadow-sm transition-shadow">
              <h3 className="text-lg font-medium mb-3">{stepNames.stationary}</h3>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Total Emissions</h4>
                <p className="text-xl font-semibold mt-1">
                  {formatToTwoDecimals(calculatedMetrics.stationary?.value)} <span className="text-sm font-normal text-gray-500 ml-1">{calculatedMetrics.stationary?.unit}</span>
                </p>
              </div>
              
              <button 
                onClick={() => toggleSection(`metrics-stationary`)}
                className="mt-3 flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                {expandedSections[`metrics-stationary`] ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" /> Hide breakdown
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" /> Show breakdown
                  </>
                )}
              </button>
              
              {expandedSections[`metrics-stationary`] && (
                <div className="mt-3 pt-3 border-t">
                  <div className="space-y-2">
                    {calculatedMetrics.stationary?.sources.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-gray-700">Sources</h4>
                        <div className="mt-2 space-y-1">
                          {calculatedMetrics.stationary.sources.map((source, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-gray-600">{source.name}</span>
                              <span>{formatToTwoDecimals(source.value)} {calculatedMetrics.stationary.unit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Purchased Heat */}
            <div className="border rounded-lg p-5 hover:shadow-sm transition-shadow">
              <h3 className="text-lg font-medium mb-3">{stepNames.heat}</h3>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Total Emissions</h4>
                <p className="text-xl font-semibold mt-1">
                  {calculatedMetrics.heat?.value.toFixed(2)} <span className="text-sm font-normal text-gray-500 ml-1">{calculatedMetrics.heat?.unit}</span>
                </p>
              </div>
              
              <button 
                onClick={() => toggleSection(`metrics-heat`)}
                className="mt-3 flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                {expandedSections[`metrics-heat`] ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" /> Hide breakdown
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" /> Show breakdown
                  </>
                )}
              </button>
              
              {expandedSections[`metrics-heat`] && (
                <div className="mt-3 pt-3 border-t">
                  <div className="space-y-2">
                    {calculatedMetrics.heat?.sources.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-gray-700">Sources</h4>
                        <div className="mt-2 space-y-1">
                          {calculatedMetrics.heat.sources.map((source, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-gray-600">{source.name}</span>
                              <span>{source.value.toFixed(2)} {calculatedMetrics.heat.unit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Purchased Goods & Services */}
            <div className="border rounded-lg p-5 hover:shadow-sm transition-shadow">
              <h3 className="text-lg font-medium mb-3">{stepNames.goods}</h3>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Total Emissions</h4>
                <p className="text-xl font-semibold mt-1">
                  {calculatedMetrics.goods?.value.toFixed(2)} <span className="text-sm font-normal text-gray-500 ml-1">{calculatedMetrics.goods?.unit}</span>
                </p>
              </div>
              
              <button 
                onClick={() => toggleSection(`metrics-goods`)}
                className="mt-3 flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                {expandedSections[`metrics-goods`] ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" /> Hide breakdown
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" /> Show breakdown
                  </>
                )}
              </button>
              
              {expandedSections[`metrics-goods`] && (
                <div className="mt-3 pt-3 border-t">
                  <div className="space-y-2">
                    {calculatedMetrics.goods?.sources.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-gray-700">Sources</h4>
                        <div className="mt-2 space-y-1">
                          {calculatedMetrics.goods.sources.map((source, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-gray-600">{source.name}</span>
                              <span>{source.value.toFixed(2)} {calculatedMetrics.goods.unit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Purchased Electricity */}
            <div className="border rounded-lg p-5 hover:shadow-sm transition-shadow">
              <h3 className="text-lg font-medium mb-3">{stepNames.electricity}</h3>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Energy Consumption</h4>
                <p className="text-xl font-semibold mt-1">
                  {calculatedMetrics.electricity?.value.toFixed(2)} <span className="text-sm font-normal text-gray-500 ml-1">{calculatedMetrics.electricity?.unit}</span>
                </p>
              </div>
              
              <button 
                onClick={() => toggleSection(`metrics-electricity`)}
                className="mt-3 flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                {expandedSections[`metrics-electricity`] ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" /> Hide breakdown
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" /> Show breakdown
                  </>
                )}
              </button>
              
              {expandedSections[`metrics-electricity`] && (
                <div className="mt-3 pt-3 border-t">
                  <div className="space-y-2">
                    {calculatedMetrics.electricity?.sources.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-gray-700">Sources</h4>
                        <div className="mt-2 space-y-1">
                          {calculatedMetrics.electricity.sources.map((source, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-gray-600">{source.name}</span>
                              <span>{source.value.toFixed(2)} {calculatedMetrics.electricity.unit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Water Quantities */}
            <div className="border rounded-lg p-5 hover:shadow-sm transition-shadow">
              <h3 className="text-lg font-medium mb-3">{stepNames.water}</h3>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Water Usage</h4>
                <p className="text-xl font-semibold mt-1">
                  {calculatedMetrics.water?.value.toFixed(2)} <span className="text-sm font-normal text-gray-500 ml-1">{calculatedMetrics.water?.unit}</span>
                </p>
              </div>
              
              <button 
                onClick={() => toggleSection(`metrics-water`)}
                className="mt-3 flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                {expandedSections[`metrics-water`] ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" /> Hide breakdown
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" /> Show breakdown
                  </>
                )}
              </button>
              
              {expandedSections[`metrics-water`] && (
                <div className="mt-3 pt-3 border-t">
                  <div className="space-y-2">
                    {calculatedMetrics.water?.sources.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-gray-700">Sources</h4>
                        <div className="mt-2 space-y-1">
                          {calculatedMetrics.water.sources.map((source, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-gray-600">{source.name}</span>
                              <span>{source.value.toFixed(2)} {calculatedMetrics.water.unit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Invoice Modal */}
      <Dialog 
        open={isEditModalOpen} 
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          // Reset state when closing the modal
          if (!open) {
            console.log("Dialog closed");
            setEditingInvoice(null);
            setAddingNewMetric(false);
            setNewMetric({
              name: "",
              description: "",
              unit: "kg",
              value: 0
            });
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto !p-0">
          <DialogHeader className="sticky top-0 z-10 bg-[#FCFCFC] px-6 py-4 border-b">
            <DialogTitle>Edit Invoice</DialogTitle>
          </DialogHeader>
          
          {editingInvoice && (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                // Validate all inputs before saving
                const isValidInvoice = validateInvoice(editingInvoice);
                if (isValidInvoice) {
                  handleSaveInvoiceEdit();
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 pb-0"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Product Name</label>
                <input 
                  type="text" 
                  value={editingInvoice.productName}
                  onChange={(e) => setEditingInvoice({...editingInvoice, productName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Facility</label>
                <input 
                  type="text" 
                  value={editingInvoice.facility}
                  onChange={(e) => setEditingInvoice({...editingInvoice, facility: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Invoice Number</label>
                <input 
                  type="text" 
                  value={editingInvoice.invoiceNumber}
                  onChange={(e) => setEditingInvoice({...editingInvoice, invoiceNumber: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Invoice Date</label>
                <input 
                  type="date" 
                  value={editingInvoice.invoiceDate}
                  onChange={(e) => setEditingInvoice({...editingInvoice, invoiceDate: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Total Amount</label>
                <input 
                  type="number" 
                  value={editingInvoice.totalAmount}
                  onChange={(e) => setEditingInvoice({...editingInvoice, totalAmount: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border rounded-md"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Currency</label>
                <input 
                  type="text" 
                  value={editingInvoice.currency}
                  onChange={(e) => setEditingInvoice({...editingInvoice, currency: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              {/* Emissions-related fields */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Emissions Are Per Unit</label>
                <select
                  value={editingInvoice.emissionsArePerUnit}
                  onChange={(e) => setEditingInvoice({...editingInvoice, emissionsArePerUnit: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">-- Select an option --</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Quantity Needed Per Unit</label>
                <input 
                  type="number" 
                  value={editingInvoice.quantityNeededPerUnit}
                  onChange={(e) => setEditingInvoice({...editingInvoice, quantityNeededPerUnit: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border rounded-md"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              {/* Only show Units Bought field if emissions are NOT per unit */}
              {editingInvoice.emissionsArePerUnit === "NO" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Units Bought</label>
                  <input 
                    type="number" 
                    value={editingInvoice.unitsBought}
                    onChange={(e) => setEditingInvoice({...editingInvoice, unitsBought: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border rounded-md"
                    min="0"
                    step="0.01"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Required when emissions are not per unit for proper calculation.
                  </p>
                </div>
              )}
              
              {/* Sustainability Metrics - with add capability */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Sustainability Metrics</h3>
                  {((Array.isArray(editingInvoice.sustainabilityMetrics) && getAvailableMetrics(editingInvoice.sustainabilityMetrics).length > 0) || (!Array.isArray(editingInvoice.sustainabilityMetrics) || editingInvoice.sustainabilityMetrics.length === 0 )) && (
                    <button
                      type="button"
                      onClick={() => {
                        setAddingNewMetric(true);
                        // Set timeout to scroll into view after the element renders
                        setTimeout(() => {
                          document.getElementById('new-metric-form')?.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                          });
                        }, 100);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                      disabled={addingNewMetric}
                    >
                      + Add Metric
                    </button>
                  )}
                </div>
                
                {!Array.isArray(editingInvoice.sustainabilityMetrics) || editingInvoice.sustainabilityMetrics.length === 0 ? (
                  <div className="border rounded-md p-4 bg-yellow-50 text-yellow-800 mb-4">
                    <h4 className="font-medium mb-2">No metrics found for this invoice</h4>
                    <p className="text-sm">
                      Please add sustainability metrics from the available categories.
                    </p>
                  </div>
                ) : null}
                
                <div className="space-y-2 border rounded-md p-4 bg-gray-50 max-h-[40vh] overflow-y-auto">
                  {Array.isArray(editingInvoice.sustainabilityMetrics) && editingInvoice.sustainabilityMetrics.length > 0 ? (
                    editingInvoice.sustainabilityMetrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 w-1/3">{metric.name}:</label>
                        <div className="flex items-center w-2/3">
                          <input
                            type="number"
                            value={metric.value}
                            onChange={(e) => {
                              const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                              const updatedMetrics = [...editingInvoice.sustainabilityMetrics];
                              updatedMetrics[index] = {
                                ...metric,
                                value: formatToTwoDecimals(value)
                              };
                              setEditingInvoice({
                                ...editingInvoice,
                                sustainabilityMetrics: updatedMetrics
                              });
                            }}
                            className="flex-1 px-3 py-2 border rounded-md"
                            min="0"
                            step="0.01"
                            required
                          />
                          <span className="ml-2 text-sm text-gray-500">{metric.unit}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedMetrics = [...editingInvoice.sustainabilityMetrics];
                              updatedMetrics.splice(index, 1);
                              setEditingInvoice({
                                ...editingInvoice,
                                sustainabilityMetrics: updatedMetrics
                              });
                            }}
                            className="ml-2 p-1 text-red-600 hover:text-red-800"
                            title="Delete metric"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 italic text-center py-2">
                      No metrics yet. Add some using the button above.
                    </div>
                  )}
                </div>
                
                {/* Add new metric form */}
                {addingNewMetric && (
                  <div 
                    id="new-metric-form"
                    className="mt-4 pt-4 border-t border-gray-200 bg-blue-50 p-4 rounded-md shadow-sm"
                  >
                    <h4 className="text-sm font-medium mb-3 flex items-center">
                      <span className="text-blue-600 mr-2">+</span> Add New Metric
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600 font-medium">Select Metric*</label>
                        <select
                          value={newMetric.name || ""}
                          onChange={(e) => {
                            const selected = PREDEFINED_METRICS.find(m => m.name === e.target.value);
                            if (selected) {
                              setNewMetric({
                                name: selected.name,
                                description: selected.description,
                                unit: selected.unit,
                                value: 0
                              });
                              // Scroll to value input after selection
                              setTimeout(() => {
                                document.getElementById('metric-value-input')?.scrollIntoView({ 
                                  behavior: 'smooth', 
                                  block: 'center' 
                                });
                                document.getElementById('metric-value-input')?.focus();
                              }, 100);
                            } else {
                              setNewMetric({
                                name: "",
                                description: "",
                                unit: "kg",
                                value: 0
                              });
                            }
                          }}
                          className="w-full px-3 py-2 border rounded-md mt-1 bg-[#FCFCFC]"
                          required
                        >
                          <option value="">-- Select a metric --</option>
                          {getAvailableMetrics(editingInvoice.sustainabilityMetrics).map((metric, idx) => (
                            <option key={idx} value={metric.name}>
                              {metric.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {newMetric.name && (
                        <div className="animate-fadeIn">
                          <div>
                            <label className="text-sm text-gray-600 font-medium">Description</label>
                            <p className="text-sm text-gray-600 mt-1 bg-[#FCFCFC] p-2 rounded border">{newMetric.description}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3 mt-3">
                            <div>
                              <label className="text-sm text-gray-600 font-medium">Unit*</label>
                              <p className="text-sm font-medium mt-1 bg-[#FCFCFC] p-2 rounded border">{newMetric.unit}</p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-600 font-medium">Value*</label>
                              <input
                                id="metric-value-input"
                                type="number"
                                value={newMetric.value || 0}
                                onChange={(e) => setNewMetric({...newMetric, value: parseFloat(e.target.value) || 0})}
                                className="w-full px-3 py-2 border rounded-md mt-1 bg-[#FCFCFC] focus:ring-2 focus:ring-blue-500"
                                min="0"
                                step="0.01"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          type="button"
                          onClick={() => setAddingNewMetric(false)}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-[#FCFCFC]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleAddMetric}
                          className="px-3 py-1 bg-blue-600 text-[#FCFCFC] rounded-md text-sm hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter className="col-span-1 md:col-span-2 sticky bottom-0 z-10 bg-[#FCFCFC] pt-4 border-t mt-4 pb-6">
                <OutlineButton 
                  type="button" 
                  onClick={() => {
                    // Reset all modal state
                    setIsEditModalOpen(false);
                    setEditingInvoice(null);
                    setAddingNewMetric(false);
                    setNewMetric({
                      name: "",
                      description: "",
                      unit: "kg",
                      value: 0
                    });
                  }}
                >
                  Cancel
                </OutlineButton>
                <PrimaryButton type="submit">
                  Save Changes
                </PrimaryButton>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Warning Modal for Submission */}
      <AlertDialog open={showSubmitWarning} onOpenChange={setShowSubmitWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Warning: Missing Sustainability Metrics</AlertDialogTitle>
            <AlertDialogDescription>
              The following invoices are missing sustainability metrics:
              <div className="mt-3 max-h-60 overflow-y-auto">
                <ul className="list-disc pl-5 space-y-1">
                  {invoicesToFix.map((invoice, idx) => (
                    <li key={idx} className="text-sm">
                      <span className="font-medium">{invoice.name}</span> ({invoice.category})
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-4">
                It's recommended to add metrics for accurate sustainability reporting. 
                Would you like to fix these issues or proceed anyway?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowSubmitWarning(false)}>
              Fix Issues
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setShowSubmitWarning(false);
                onSubmit(getAllInvoices());
              }}
            >
              Proceed Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col items-center space-y-4 mt-8">
        <PrimaryButton 
          onClick={isSubmitting ? undefined : handleSubmitAttempt} 
          className={`w-[1/2] py-6 text-lg ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          size="large"
        >
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
