"use client"
import React from "react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Legend,
} from "recharts"
import { useState, useEffect } from "react"
import { Calendar } from "lucide-react"
import { DateRange } from "react-day-picker"
import { format, subMonths, subWeeks, subYears, subQuarters, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Add these types at the top of your file
type TimeRangeType = "week" | "month" | "quarter" | "year"
type MetricData = {
  emissions: number
  water: number
  energy: number
  timestamp: Date
}

const OutlineButton = React.forwardRef<
  HTMLButtonElement, 
  React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }
>(({ children, className, ...props }, ref) => (
  <Button 
    ref={ref} 
    variant="outline" 
    className={cn("border border-input bg-background hover:bg-accent hover:text-accent-foreground", className)} 
    {...props}
  >
    {children}
  </Button>
))
OutlineButton.displayName = "OutlineButton"

export default function AnalyticsPage() {
  const [timeRangeType, setTimeRangeType] = useState<TimeRangeType>("year")
  const [timeRange, setTimeRange] = useState<DateRange>({
    from: startOfYear(new Date()),
    to: endOfYear(new Date())
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [historicalData, setHistoricalData] = useState<MetricData[]>([])
  const [periodComparisons, setPeriodComparisons] = useState<{
    emissions: number;
    water: number;
    energy: number;
  }>({
    emissions: 0,
    water: 0,
    energy: 0,
  })

  // Initialize time range when time range type changes
  useEffect(() => {
    const now = new Date()
    let from: Date
    let to: Date = now
    
    switch(timeRangeType) {
      case 'week':
        from = startOfWeek(now)
        to = endOfWeek(now)
        break
      case 'month':
        from = startOfMonth(now)
        to = endOfMonth(now)
        break
      case 'quarter':
        from = startOfQuarter(now)
        to = endOfQuarter(now)
        break
      case 'year':
        from = startOfYear(now)
        to = endOfYear(now)
        break
    }
    
    setTimeRange({ from, to })
  }, [timeRangeType])

  // Fetch data from API
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const headers = {
          Authorization: `Bearer ${token}`,
        }

        const [productsRes, batchesRes] = await Promise.all([
          fetch("/api/products", { headers }),
          fetch("/api/batches", { headers }),
        ])
        if (!productsRes.ok || !batchesRes.ok)
          throw new Error("Failed to fetch products or batches")

        const products = await productsRes.json()
        const { batches } = await batchesRes.json()

        const batchDetails = await Promise.all(
          batches.map((batch: any) =>
            fetch(`/api/batches/${batch.id}`, { headers }).then((res) => res.json())
          )
        )

        const processedData = processBatchData(batchDetails, products)
        
        // Generate historical data for trends (in real app, this would come from API)
        generateHistoricalData(processedData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [])

  // Calculate trends when time range changes
  useEffect(() => {
    if (!analyticsData || !timeRange.from || !timeRange.to) return
    
    calculatePeriodComparisons(timeRange)
  }, [timeRange, analyticsData, historicalData])

  // Generate mock historical data (in a real app, this would come from your API)
  function generateHistoricalData(currentData: any) {
    const now = new Date()
    const twoYearsAgo = subYears(now, 2)
    
    // Create weekly data points for the last 2 years
    const historicalPoints: MetricData[] = []
    let currentDate = twoYearsAgo
    
    while (currentDate <= now) {
      // Add some random variation to the current values
      const randomFactor = 0.7 + Math.random() * 0.6 // between 0.7 and 1.3
      
      historicalPoints.push({
        emissions: currentData.totalEmissions * randomFactor,
        water: currentData.waterUsage * randomFactor,
        energy: currentData.energyConsumption * randomFactor,
        timestamp: new Date(currentDate)
      })
      
      // Move to next week
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 7))
    }
    
    setHistoricalData(historicalPoints)
  }

  function calculatePeriodComparisons(selectedRange: DateRange) {
    if (!selectedRange.from || !selectedRange.to || !historicalData.length) {
      return
    }
    
    const currentFrom = selectedRange.from
    const currentTo = selectedRange.to
    
    // Calculate the duration of the selected period
    const durationMs = currentTo.getTime() - currentFrom.getTime()
    
    // Calculate the previous period (same duration, immediately before)
    const previousFrom = new Date(currentFrom.getTime() - durationMs)
    const previousTo = new Date(currentTo.getTime() - durationMs)
    
    // Filter data for current period and previous period
    const currentPeriodData = historicalData.filter(
      data => data.timestamp >= currentFrom && data.timestamp <= currentTo
    )
    
    const previousPeriodData = historicalData.filter(
      data => data.timestamp >= previousFrom && data.timestamp <= previousTo
    )
    
    // Calculate averages for each period
    const currentAvg = calculateAverages(currentPeriodData)
    const previousAvg = calculateAverages(previousPeriodData)
    
    // Calculate percentage changes
    const emissionsChange = previousAvg.emissions !== 0 
      ? ((currentAvg.emissions - previousAvg.emissions) / previousAvg.emissions) * 100 
      : 0
    
    const waterChange = previousAvg.water !== 0 
      ? ((currentAvg.water - previousAvg.water) / previousAvg.water) * 100 
      : 0
    
    const energyChange = previousAvg.energy !== 0 
      ? ((currentAvg.energy - previousAvg.energy) / previousAvg.energy) * 100 
      : 0
    
    setPeriodComparisons({
      emissions: Number(emissionsChange.toFixed(1)),
      water: Number(waterChange.toFixed(1)),
      energy: Number(energyChange.toFixed(1))
    })
  }
  
  function calculateAverages(data: MetricData[]) {
    if (!data.length) {
      return { emissions: 0, water: 0, energy: 0 }
    }
    
    const sum = data.reduce((acc, point) => ({
      emissions: acc.emissions + point.emissions,
      water: acc.water + point.water,
      energy: acc.energy + point.energy
    }), { emissions: 0, water: 0, energy: 0 })
    
    return {
      emissions: sum.emissions / data.length,
      water: sum.water / data.length,
      energy: sum.energy / data.length
    }
  }

  function processBatchData(batchDetails: any[], products: any[]) {
    let totalEmissions = 0
    let waterUsage = 0
    let energyConsumption = 0
    let scope1 = 0,
      scope2 = 0,
      scope3 = 0

    const productMap = new Map(products.map(p => [p.productId, p.productName]))
    
    // Use a Map to aggregate emissions by product
    const productEmissionsMap = new Map<string, { 
      productName: string; 
      emissions: number; 
      category: string 
    }>()

    batchDetails.forEach(({ batch, batchData, invoices }) => {
      const productName = productMap.get(batch.product_id) || batch.product_name
      let batchEmissions = 0

      const allMetrics = [
        ...(batchData?.sustainability_metrics || []),
        ...invoices.flatMap((inv: any) => inv.supplierDetails?.sustainability_metrics || []),
      ]

      allMetrics.forEach((metric: any) => {
        let value = metric.value
        if (metric.unit === "MWh") value *= 1000
        if (metric.unit === "Cubic meters") value *= 1000

        switch (metric.name) {
          case "Stationary Combustion":
            scope1 += value
            totalEmissions += value
            batchEmissions += value
            break
          case "Purchased Electricity (Energy)":
            energyConsumption += value
            break
          case "Purchased Heat":
            scope2 += value
            totalEmissions += value
            batchEmissions += value
            break
          case "Purchased Goods and Services":
            scope3 += value
            totalEmissions += value
            batchEmissions += value
            break
          case "Water Quantities":
            waterUsage += value
            break
        }
      })

      if (batchEmissions > 0) {
        // Aggregate emissions for the same product
        const category = categorizeProduct(productName)
        if (productEmissionsMap.has(productName)) {
          const existing = productEmissionsMap.get(productName)!
          existing.emissions += batchEmissions
        } else {
          productEmissionsMap.set(productName, {
            productName,
            emissions: batchEmissions,
            category
          })
        }
      }
    })

    // Convert the Map to array for further processing
    const productsWithEmissions = Array.from(productEmissionsMap.values())

    const topProducts = productsWithEmissions
      .sort((a, b) => b.emissions - a.emissions)
      .slice(0, 5)

    const emissionsByCategory = productsWithEmissions.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + p.emissions
      return acc
    }, {} as Record<string, number>)

    const monthlyData = {
      emissions: Array(12).fill(0).map(() => Math.floor(Math.random() * 80) + 20),
      water: Array(12).fill(0).map(() => Math.floor(Math.random() * 40) + 40),
      energy: Array(12).fill(0).map(() => Math.floor(Math.random() * 40) + 40),
    }

    const processedData = {
      totalEmissions,
      waterUsage,
      energyConsumption,
      emissionsByCategory,
      emissionsByScope: { scope1, scope2, scope3 },
      topProducts,
      monthlyData,
    }
    
    setAnalyticsData(processedData)
    return processedData
  }

  function categorizeProduct(productName: string) {
    const lower = productName.toLowerCase()
    if (lower.includes("wood")) return "Furniture"
    if (lower.includes("cotton")) return "Textiles"
    if (lower.includes("plastic")) return "Packaging"
    if (lower.includes("electronic")) return "Electronics"
    return "Other"
  }

  const formatNumber = (num: number, unit: string) =>
    `${num.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${unit}`

  const renderTrend = (trend: number) => {
    const isPositive = trend > 0
    const trendClass = isPositive ? "text-red-600" : "text-green-600"
    const arrow = isPositive ? "↑" : "↓"
    return (
      <div className={`text-sm ${trendClass} mt-1`}>
        {arrow} {Math.abs(trend)}% from previous {timeRangeType}
      </div>
    )
  }

  if (loading)
    return <div className="max-w-7xl mx-auto p-4">Loading analytics data...</div>

  if (error || !analyticsData)
    return <div className="max-w-7xl mx-auto p-4 text-red-600">{error || "Failed to load analytics"}</div>

  const totalScope =
    analyticsData.emissionsByScope.scope1 +
    analyticsData.emissionsByScope.scope2 +
    analyticsData.emissionsByScope.scope3

  const scope1Percentage = totalScope ? (analyticsData.emissionsByScope.scope1 / totalScope) * 100 : 0
  const scope2Percentage = totalScope ? (analyticsData.emissionsByScope.scope2 / totalScope) * 100 : 0
  const scope3Percentage = totalScope ? (analyticsData.emissionsByScope.scope3 / totalScope) * 100 : 0

  // Format date range for display
  const formatTimeRangeDisplay = () => {
    if (!timeRange.from || !timeRange.to) return "Select date range"
    return `${format(timeRange.from, 'PP')} - ${format(timeRange.to, 'PP')}`
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        
        <div className="flex items-center space-x-4">
          <Tabs defaultValue={timeRangeType} onValueChange={(value) => setTimeRangeType(value as TimeRangeType)}>
            <TabsList>
              <TabsTrigger value="week">Weekly</TabsTrigger>
              <TabsTrigger value="month">Monthly</TabsTrigger>
              <TabsTrigger value="quarter">Quarterly</TabsTrigger>
              <TabsTrigger value="year">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Popover>
            <PopoverTrigger>
              <Button variant="outline" className="ml-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatTimeRangeDisplay()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <DatePickerWithRange
                date={timeRange}
                onSelect={(range) => {
                  if (range) {
                    setTimeRange(range);
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Emissions</CardTitle>
            <CardDescription>All scopes combined</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatNumber(analyticsData.totalEmissions, "kg CO2e")}
            </div>
            {renderTrend(periodComparisons.emissions)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Water Usage</CardTitle>
            <CardDescription>In liters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatNumber(analyticsData.waterUsage, "L")}
            </div>
            {renderTrend(periodComparisons.water)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Energy Consumption</CardTitle>
            <CardDescription>In kWh</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatNumber(analyticsData.energyConsumption, "kWh")}
            </div>
            {renderTrend(periodComparisons.energy)}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Top Products by Emissions</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Product</th>
                <th className="border border-gray-300 px-4 py-2">Category</th>
                <th className="border border-gray-300 px-4 py-2">Emissions</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.topProducts.map((prod: any) => (
                <tr key={prod.productName}>
                  <td className="border border-gray-300 px-4 py-2">{prod.productName}</td>
                  <td className="border border-gray-300 px-4 py-2">{prod.category}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {prod.emissions.toFixed(2)} kg CO2e
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={[
            { name: "Scope 1", value: analyticsData.emissionsByScope.scope1 },
            { name: "Scope 2", value: analyticsData.emissionsByScope.scope2 },
            { name: "Scope 3", value: analyticsData.emissionsByScope.scope3 },
          ]}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>All Sustainability Metrics (Summed)</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Metric</th>
                <th className="border border-gray-300 px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Stationary Combustion", value: analyticsData.emissionsByScope.scope1, unit: "kg CO2e" },
                { name: "Purchased Heat", value: analyticsData.emissionsByScope.scope2, unit: "kg CO2e" },
                { name: "Purchased Goods and Services", value: analyticsData.emissionsByScope.scope3, unit: "kg CO2e" },
                { name: "Purchased Electricity (Energy)", value: analyticsData.energyConsumption, unit: "kWh" },
                { name: "Water Quantities", value: analyticsData.waterUsage, unit: "L" },
              ].map((metric) => (
                <tr key={metric.name}>
                  <td className="border border-gray-300 px-4 py-2">{metric.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{formatNumber(metric.value, metric.unit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
