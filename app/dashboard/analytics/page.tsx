"use client"
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { OutlineButton } from "@/components/ui/outline-button"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"month" | "quarter" | "year">("year")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analyticsData, setAnalyticsData] = useState<any>(null)

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

        processBatchData(batchDetails, products)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [])

  function processBatchData(batchDetails: any[], products: any[]) {
    let totalEmissions = 0
    let waterUsage = 0
    let energyConsumption = 0
    let scope1 = 0,
      scope2 = 0,
      scope3 = 0

    const productMap = new Map(products.map(p => [p.productId, p.productName]))
    const productsWithEmissions: { productName: string; emissions: number; category: string }[] = []

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
            scope2 += value
            totalEmissions += value
            energyConsumption += value
            batchEmissions += value
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
        productsWithEmissions.push({
          productName,
          emissions: batchEmissions,
          category: categorizeProduct(productName),
        })
      }
    })

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

    setAnalyticsData({
      totalEmissions,
      waterUsage,
      energyConsumption,
      emissionsByCategory,
      emissionsByScope: { scope1, scope2, scope3 },
      topProducts,
      monthlyData,
    })
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
        {arrow} {Math.abs(trend)}% from previous period
      </div>
    )
  }

  const trends = { emissions: -12, water: 5, energy: -8 }

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

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
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
            {renderTrend(trends.emissions)}
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
            {renderTrend(trends.water)}
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
            {renderTrend(trends.energy)}
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
                { name: "Purchased Electricity (Energy)", value: analyticsData.energyConsumption, unit: "kWh" },
                { name: "Purchased Heat", value: analyticsData.emissionsByScope.scope2 - analyticsData.energyConsumption, unit: "kg CO2e" },
                { name: "Purchased Goods and Services", value: analyticsData.emissionsByScope.scope3, unit: "kg CO2e" },
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
