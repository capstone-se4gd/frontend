"use client"

import { useState, useEffect } from "react"
import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { OutlineButton } from "@/components/ui/outline-button"

// Define types based on the actual API response
interface SustainabilityMetric {
  name: string;
  description: string;
  unit: string;
  value: number;
}

interface Product {
  productId: string;
  productName: string;
  sustainabilityMetrics: SustainabilityMetric[];
}

interface AnalyticsData {
  totalEmissions: number;
  waterUsage: number;
  energyConsumption: number;
  emissionsByCategory: Record<string, number>;
  emissionsByScope: {
    scope1: number;
    scope2: number;
    scope3: number;
  };
  topProducts: {
    productName: string;
    emissions: number;
    category: string;
  }[];
  monthlyData: {
    emissions: number[];
    water: number[];
    energy: number[];
  };
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("year")
  const [category, setCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products')
        
        if (!response.ok) {
          throw new Error('Failed to fetch product data')
        }
        
        const products: Product[] = await response.json()
        processProductData(products)
      } catch (err) {
        console.error('Error fetching product data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const processProductData = (products: Product[]) => {
    // Calculate total emissions, water usage and energy consumption
    let totalEmissions = 0
    let waterUsage = 0
    let energyConsumption = 0
    
    // Emissions by scope
    let scope1Total = 0
    let scope2Total = 0
    let scope3Total = 0
    
    // Map to store products with their total emissions for sorting
    const productsWithEmissions: {
      productName: string;
      emissions: number;
      category: string;
    }[] = []
    
    // Process metrics for each product
    products.forEach(product => {
      let productEmissions = 0
      
      product.sustainabilityMetrics.forEach(metric => {
        switch(metric.name) {
          case "Stationary Combustion":
            scope1Total += metric.value
            productEmissions += metric.value
            totalEmissions += metric.value
            break;
          case "Purchased Electricity":
            scope2Total += metric.value
            productEmissions += metric.value
            totalEmissions += metric.value
            break;
          case "Purchased Goods and Services":
            scope3Total += metric.value
            productEmissions += metric.value
            totalEmissions += metric.value
            break;
          case "Water Quantities":
            waterUsage += metric.value
            break;
          case "Purchased Electricity (Energy)":
            energyConsumption += metric.value
            break;
        }
      })
      
      // Add product with its emissions to the array
      if (productEmissions > 0) {
        productsWithEmissions.push({
          productName: product.productName,
          emissions: productEmissions,
          // Assign a simple category based on product name (in a real app, this would come from the API)
          category: categorizeProduct(product.productName)
        })
      }
    })
    
    // Sort products by emissions (highest first)
    const topProducts = productsWithEmissions
      .sort((a, b) => b.emissions - a.emissions)
      .slice(0, 5)
    
    // Calculate emissions by category
    const emissionsByCategory = productsWithEmissions.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + product.emissions
      return acc
    }, {} as Record<string, number>)
    
    // Generate mock monthly data (in a real app, this would come from the API with historical data)
    const monthlyData = {
      emissions: Array(12).fill(0).map(() => Math.floor(Math.random() * 80) + 20),
      water: Array(12).fill(0).map(() => Math.floor(Math.random() * 40) + 40),
      energy: Array(12).fill(0).map(() => Math.floor(Math.random() * 40) + 40)
    }
    
    setAnalyticsData({
      totalEmissions,
      waterUsage,
      energyConsumption,
      emissionsByCategory,
      emissionsByScope: {
        scope1: scope1Total,
        scope2: scope2Total,
        scope3: scope3Total
      },
      topProducts,
      monthlyData
    })
  }
  
  // Simple function to categorize products based on name
  // In a real app, this would come from the API
  const categorizeProduct = (productName: string): string => {
    if (productName.toLowerCase().includes('wood')) return 'Furniture'
    if (productName.toLowerCase().includes('cotton')) return 'Textiles'
    if (productName.toLowerCase().includes('plastic')) return 'Packaging'
    if (productName.toLowerCase().includes('electronic')) return 'Electronics'
    return 'Other'
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
        <p>Loading analytics data...</p>
      </div>
    )
  }

  if (error || !analyticsData) {
    return (
      <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
        <p className="text-red-500">{error || "Failed to load analytics data"}</p>
      </div>
    )
  }

  // Helper function to format numbers
  const formatNumber = (num: number, unit: string) => {
    return `${num.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${unit}`
  }

  // Mock trends (in a real app, these would be calculated from historical data)
  const trends = {
    emissions: -12,
    water: 5,
    energy: -8
  }

  // Helper function to render trend indicators
  const renderTrend = (trend: number) => {
    const isPositive = trend > 0
    const trendClass = isPositive ? "text-red-600" : "text-green-600"
    const arrow = isPositive ? "↑" : "↓"
    return <div className={`text-sm ${trendClass} mt-1`}>{arrow} {Math.abs(trend)}% from previous period</div>
  }

  // Calculate scope percentages
  const totalScope = analyticsData.emissionsByScope.scope1 + 
                    analyticsData.emissionsByScope.scope2 + 
                    analyticsData.emissionsByScope.scope3
  
  const scope1Percentage = totalScope > 0 ? (analyticsData.emissionsByScope.scope1 / totalScope) * 100 : 0
  const scope2Percentage = totalScope > 0 ? (analyticsData.emissionsByScope.scope2 / totalScope) * 100 : 0
  const scope3Percentage = totalScope > 0 ? (analyticsData.emissionsByScope.scope3 / totalScope) * 100 : 0

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-500 mt-1">Visualize and analyze your sustainability data</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <OutlineButton onClick={() => setTimeRange("month")} className={timeRange === "month" ? "bg-gray-100" : ""}>
            Month
          </OutlineButton>
          <OutlineButton
            onClick={() => setTimeRange("quarter")}
            className={timeRange === "quarter" ? "bg-gray-100" : ""}
          >
            Quarter
          </OutlineButton>
          <OutlineButton onClick={() => setTimeRange("year")} className={timeRange === "year" ? "bg-gray-100" : ""}>
            Year
          </OutlineButton>
          <OutlineButton>
            <Calendar className="w-4 h-4 mr-2" />
            Custom
          </OutlineButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Emissions</CardTitle>
            <CardDescription>All scopes combined</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(analyticsData.totalEmissions, "kg CO2e")}</div>
            {renderTrend(trends.emissions)}
            <div className="h-[100px] mt-4 bg-gray-100 rounded flex items-end">
              {analyticsData.monthlyData.emissions.map((value, index) => (
                <div 
                  key={index}
                  className="w-1/12 bg-[#12b784] mx-[0.5%]"
                  style={{ height: `${value}%` }}
                ></div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Water Usage</CardTitle>
            <CardDescription>Total consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(analyticsData.waterUsage, "m³")}</div>
            {renderTrend(trends.water)}
            <div className="h-[100px] mt-4 bg-gray-100 rounded flex items-end">
              {analyticsData.monthlyData.water.map((value, index) => (
                <div 
                  key={index}
                  className="w-1/12 bg-blue-500 mx-[0.5%]"
                  style={{ height: `${value}%` }}
                ></div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Energy Consumption</CardTitle>
            <CardDescription>Total usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(analyticsData.energyConsumption, "MWh")}</div>
            {renderTrend(trends.energy)}
            <div className="h-[100px] mt-4 bg-gray-100 rounded flex items-end">
              {analyticsData.monthlyData.energy.map((value, index) => (
                <div 
                  key={index}
                  className="w-1/12 bg-yellow-500 mx-[0.5%]"
                  style={{ height: `${value}%` }}
                ></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <CardTitle>Emissions by Category</CardTitle>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <OutlineButton onClick={() => setCategory("all")} className={category === "all" ? "bg-gray-100" : ""}>
                  All
                </OutlineButton>
                <OutlineButton
                  onClick={() => setCategory("scope1")}
                  className={category === "scope1" ? "bg-gray-100" : ""}
                >
                  Scope 1
                </OutlineButton>
                <OutlineButton
                  onClick={() => setCategory("scope2")}
                  className={category === "scope2" ? "bg-gray-100" : ""}
                >
                  Scope 2
                </OutlineButton>
                <OutlineButton
                  onClick={() => setCategory("scope3")}
                  className={category === "scope3" ? "bg-gray-100" : ""}
                >
                  Scope 3
                </OutlineButton>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-gray-100 rounded p-4 flex items-end justify-around">
              {Object.entries(analyticsData.emissionsByCategory).map(([categoryName, value], index) => {
                // Calculate percentage height based on the maximum value
                const maxValue = Math.max(...Object.values(analyticsData.emissionsByCategory))
                const heightPercentage = (value / maxValue) * 100
                
                return (
                  <div key={index} className="flex flex-col items-center w-1/5">
                    <div 
                      className="w-full bg-[#12b784] rounded" 
                      style={{ height: `${heightPercentage * 2}px` }}
                    ></div>
                    <div className="mt-2 text-sm">{categoryName}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emissions by Scope</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] bg-gray-100 rounded p-4 flex items-center justify-center">
              <div className="relative w-[200px] h-[200px] rounded-full overflow-hidden">
                {/* Scope 1 slice */}
                <div
                  className="absolute inset-0 bg-[#12b784]"
                  style={{ 
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + Math.cos(2 * Math.PI * scope1Percentage / 100) * 50}% ${50 - Math.sin(2 * Math.PI * scope1Percentage / 100) * 50}%, 50% 50%)` 
                  }}
                ></div>
                {/* Scope 2 slice */}
                <div
                  className="absolute inset-0 bg-blue-500"
                  style={{ 
                    clipPath: `polygon(50% 50%, ${50 + Math.cos(2 * Math.PI * scope1Percentage / 100) * 50}% ${50 - Math.sin(2 * Math.PI * scope1Percentage / 100) * 50}%, ${50 + Math.cos(2 * Math.PI * (scope1Percentage + scope2Percentage) / 100) * 50}% ${50 - Math.sin(2 * Math.PI * (scope1Percentage + scope2Percentage) / 100) * 50}%, 50% 50%)` 
                  }}
                ></div>
                {/* Scope 3 slice */}
                <div
                  className="absolute inset-0 bg-yellow-500"
                  style={{ 
                    clipPath: `polygon(50% 50%, ${50 + Math.cos(2 * Math.PI * (scope1Percentage + scope2Percentage) / 100) * 50}% ${50 - Math.sin(2 * Math.PI * (scope1Percentage + scope2Percentage) / 100) * 50}%, 50% 0%, 50% 50%)` 
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[120px] h-[120px] bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#12b784] rounded-full mr-2"></div>
                <span className="text-sm">Scope 1: {Math.round(scope1Percentage)}%</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm">Scope 2: {Math.round(scope2Percentage)}%</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm">Scope 3: {Math.round(scope3Percentage)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resource Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Water Efficiency</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Energy Efficiency</span>
                  <span className="text-sm font-medium">72%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "72%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Material Efficiency</span>
                  <span className="text-sm font-medium">93%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-[#12b784] h-2.5 rounded-full" style={{ width: "93%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Waste Reduction</span>
                  <span className="text-sm font-medium">68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: "68%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Top Products by Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-medium text-gray-500">Product</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-500">Category</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-500">Total Emissions</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-500">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.topProducts.map((product, index) => (
                    <tr key={index} className={`${index < analyticsData.topProducts.length - 1 ? 'border-b' : ''} hover:bg-gray-50`}>
                      <td className="py-3 px-4">{product.productName}</td>
                      <td className="py-3 px-4">{product.category}</td>
                      <td className="py-3 px-4">{product.emissions.toFixed(1)} kg CO2e</td>
                      <td className="py-3 px-4 text-green-600">↓ {Math.floor(Math.random() * 15) + 5}%</td>
                    </tr>
                  ))}
                  {/* Add dummy rows if we have fewer than 5 products */}
                  {Array(Math.max(0, 5 - analyticsData.topProducts.length)).fill(0).map((_, index) => (
                    <tr key={`dummy-${index}`} className={`${index < 5 - analyticsData.topProducts.length - 1 ? 'border-b' : ''} hover:bg-gray-50`}>
                      <td className="py-3 px-4">Product {index + analyticsData.topProducts.length + 1}</td>
                      <td className="py-3 px-4">Other</td>
                      <td className="py-3 px-4">{(Math.random() * 100).toFixed(1)} kg CO2e</td>
                      <td className="py-3 px-4 text-red-600">↑ {Math.floor(Math.random() * 10) + 1}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sustainability Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Carbon Reduction</span>
                  <span className="text-sm font-medium">65% / 80%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-[#12b784] h-2.5 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Water Conservation</span>
                  <span className="text-sm font-medium">50% / 70%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "50%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Renewable Energy</span>
                  <span className="text-sm font-medium">75% / 90%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Zero Waste</span>
                  <span className="text-sm font-medium">40% / 60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: "40%" }}></div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800">Next Goal Milestone</h4>
              <p className="text-xs text-blue-700 mt-1">Reduce water consumption by 10% in the next quarter</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
