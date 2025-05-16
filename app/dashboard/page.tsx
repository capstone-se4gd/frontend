"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Clock, FileText, Plus, Search, Upload } from "lucide-react"
import { PrimaryButton } from "@/components/ui/primary-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

// Mock batch data
const MOCK_BATCHES = [
  {
    id: "batch-001",
    name: "Wood Extraction Process",
    status: "completed",
    date: new Date(2023, 9, 15),
    product: "Couch",
    components: ["Water", "Electricity", "Wood"],
  },
  {
    id: "batch-002",
    name: "Textile Manufacturing",
    status: "processing",
    date: new Date(2023, 10, 5),
    product: "Chair",
    components: ["Cotton", "Dye", "Electricity"],
  },
  {
    id: "batch-003",
    name: "Metal Processing",
    status: "draft",
    date: new Date(2023, 10, 10),
    product: "Table",
    components: ["Steel", "Electricity", "Water"],
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [recentBatches, setRecentBatches] = useState(MOCK_BATCHES)
  const [filteredBatches, setFilteredBatches] = useState(MOCK_BATCHES)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    if (searchQuery) {
      setFilteredBatches(
        recentBatches.filter(
          (batch) =>
            batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            batch.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
            batch.components.some((component) => component.toLowerCase().includes(searchQuery.toLowerCase())),
        ),
      )
    } else {
      setFilteredBatches(recentBatches)
    }
  }, [searchQuery, recentBatches])

  const handleNewBatch = () => {
    router.push("/dashboard/upload")
  }

  const handleViewBatch = (batchId: string) => {
    router.push(`/dashboard/batches/${batchId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <main className="max-w-7xl mx-auto" aria-labelledby="dashboard-heading">
      <h1 id="dashboard-heading" className="sr-only">Dashboard</h1>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Welcome, {user?.name || "User"}!</h2>
          <p className="text-gray-500 mt-1">Here's an overview of your sustainability data</p>
        </div>
        <div className="mt-4 md:mt-0 flex">
          <PrimaryButton onClick={handleNewBatch} ariaLabel="Create new batch">
            <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
            New Batch
          </PrimaryButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Batches</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-[#12b784] mr-3" aria-hidden="true" />
              <span className="text-3xl font-bold">{recentBatches.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>In Progress</CardTitle>
            <CardDescription>Batches being processed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-blue-500 mr-3" aria-hidden="true" />
              <span className="text-3xl font-bold">
                {recentBatches.filter((batch) => batch.status === "processing").length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Last Upload</CardTitle>
            <CardDescription>Most recent activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {recentBatches.length > 0
                ? formatDate(new Date(Math.max(...recentBatches.map((b) => b.date.getTime()))))
                : "No uploads yet"}
            </div>
          </CardContent>
        </Card>
      </div>

      <section aria-labelledby="recent-batches-heading" className="bg-white rounded-lg border shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 id="recent-batches-heading" className="text-xl font-bold">Recent Batches</h2>
          <div className="mt-4 md:mt-0 relative">
            <label htmlFor="search-batches" className="sr-only">Search batches</label>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden="true" />
            <Input
              id="search-batches"
              placeholder="Search batches..."
              className="pl-10 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-controls="batches-table"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table id="batches-table" className="w-full" aria-label="Recent batches">
            <thead>
              <tr className="border-b">
                <th scope="col" className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                <th scope="col" className="text-left py-3 px-4 font-medium text-gray-500">Product</th>
                <th scope="col" className="text-left py-3 px-4 font-medium text-gray-500">Components</th>
                <th scope="col" className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                <th scope="col" className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th scope="col" className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.length > 0 ? (
                filteredBatches.map((batch) => (
                  <tr key={batch.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{batch.name}</td>
                    <td className="py-3 px-4">{batch.product}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {batch.components.map((component) => (
                          <Badge key={component} variant="outline" className="bg-gray-100">
                            {component}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">{formatDate(batch.date)}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(batch.status)}>
                        {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleViewBatch(batch.id)}
                        className="text-[#12b784] hover:text-[#0e9e70] font-medium"
                        aria-label={`View details for ${batch.name}`}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No batches found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
