"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { PrimaryButton } from "@/components/ui/primary-button"
import { formatDate } from "@/lib/utils"

// Mock data as fallback if API fails
const MOCK_DATA = {
  id: "wood-extraction-psz5o",
  name: "Wood Extraction Process",
  description: "Sustainable wood extraction process for furniture manufacturing",
  metrics: {
    scope_1: "12.5 kg CO2e",
    scope_2: "8.3 kg CO2e",
    scope_3: "45.7 kg CO2e",
    water_usage: "320 liters",
    energy_consumption: "78 kWh",
  },
  components: [
    {
      name: "Wood",
      metrics: {
        scope_1: "5.2 kg CO2e",
        scope_2: "3.1 kg CO2e",
        scope_3: "22.4 kg CO2e",
        water_usage: "150 liters",
        energy_consumption: "35 kWh",
      },
    },
    {
      name: "Electricity",
      metrics: {
        scope_1: "2.8 kg CO2e",
        scope_2: "4.2 kg CO2e",
        scope_3: "8.3 kg CO2e",
        water_usage: "70 liters",
        energy_consumption: "43 kWh",
      },
    },
    {
      name: "Water",
      metrics: {
        scope_1: "4.5 kg CO2e",
        scope_2: "1.0 kg CO2e",
        scope_3: "15.0 kg CO2e",
        water_usage: "100 liters",
        energy_consumption: "0 kWh",
      },
    },
  ],
  created_at: "2023-09-15T10:30:00Z",
  updated_at: "2023-10-20T14:45:00Z",
  status: "active",
}

interface ProductData {
  id: string
  name: string
  description: string
  metrics: {
    [key: string]: any
  }
  components: Array<{
    name: string
    metrics: {
      [key: string]: any
    }
  }>
  [key: string]: any
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timestamp, setTimestamp] = useState<string>("")
  const [usingMockData, setUsingMockData] = useState(false)

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Use our internal API route instead of directly calling the external API
        const response = await fetch(`/api/products/${params.id}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Error fetching data: ${response.status}`)
        }

        const data = await response.json()
        setProductData(data)
        setUsingMockData(false)
        setTimestamp(formatDate(new Date()))
      } catch (err) {
        console.error("Error fetching product data:", err)

        // Use mock data as fallback
        setProductData(MOCK_DATA)
        setUsingMockData(true)
        setTimestamp(formatDate(new Date()) + " (using fallback data)")

        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, [params.id])

  const handleGoBack = () => {
    router.back()
  }

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    setUsingMockData(false)
    // Force re-fetch by triggering the useEffect
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1">
          <Header showLogo={true} />
          <main className="px-8 py-12 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-[#12b784] animate-spin" />
            <p className="mt-4 text-xl">Loading product data...</p>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1">
        <Header showLogo={true} />
        <main className="px-8 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <button onClick={handleGoBack} className="flex items-center text-[#12b784]">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>

              <div className="text-sm text-gray-500">Data fetched at: {timestamp}</div>
            </div>

            {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-1">
                    <h3 className="text-yellow-800 font-medium">Warning: Using Fallback Data</h3>
                    <p className="text-yellow-700 text-sm mt-1">{error}</p>
                  </div>
                  <PrimaryButton onClick={handleRetry} className="ml-4 py-2 px-4">
                    Retry
                  </PrimaryButton>
                </div>
              </div>
            )}

            {productData && (
              <div className="space-y-8">
                <div className="bg-white border-2 border-[#000000] rounded-lg p-6">
                  <h1 className="text-3xl font-bold mb-4">{productData.name || "Product Details"}</h1>

                  {productData.description && <p className="text-gray-700 mb-6">{productData.description}</p>}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(productData).map(([key, value]) => {
                      // Skip complex objects, arrays, and internal fields
                      if (
                        typeof value === "object" ||
                        Array.isArray(value) ||
                        key === "id" ||
                        key === "name" ||
                        key === "description" ||
                        key === "components" ||
                        key === "metrics"
                      ) {
                        return null
                      }

                      return (
                        <div key={key} className="flex">
                          <div className="font-medium w-1/2 capitalize">{key.replace(/_/g, " ")}:</div>
                          <div className="w-1/2">{String(value)}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Metrics Section */}
                {productData.metrics && Object.keys(productData.metrics).length > 0 && (
                  <div className="bg-white border-2 border-[#000000] rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Sustainability Metrics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(productData.metrics).map(([key, value]) => (
                        <div key={key} className="flex">
                          <div className="font-medium w-1/2 capitalize">{key.replace(/_/g, " ")}:</div>
                          <div className="w-1/2">{String(value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Components Section */}
                {productData.components && productData.components.length > 0 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Components</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {productData.components.map((component, index) => (
                        <div key={index} className="bg-white border-2 border-[#000000] rounded-lg p-6">
                          <h3 className="text-xl font-medium text-center mb-4">{component.name}</h3>

                          {component.metrics && Object.keys(component.metrics).length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(component.metrics).map(([key, value]) => (
                                <div key={key} className="contents">
                                  <div className="capitalize">{key.replace(/_/g, " ")}:</div>
                                  <div>{String(value)}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {usingMockData && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
                    <p className="text-yellow-700 text-sm">
                      <strong>Note:</strong> This is fallback data for demonstration purposes. The actual API could not
                      be reached.
                    </p>
                  </div>
                )}

                {/* Raw JSON for any other data */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
                  <h3 className="text-xl font-medium mb-4">Raw Data</h3>
                  <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
                    {JSON.stringify(productData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
