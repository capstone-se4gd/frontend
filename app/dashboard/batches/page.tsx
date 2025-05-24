"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Filter, Plus, Search, Eye } from "lucide-react"
import { PrimaryButton } from "@/components/ui/primary-button"
import { OutlineButton } from "@/components/ui/outline-button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"

// Mock batch data
const MOCK_BATCHES: Array<{
  id: string
  name: string
  status: "completed" | "processing" | "draft"
  date: Date
  product: string
  components: string[]
  metrics: {
    totalEmissions: string
    waterUsage: string
    energyConsumption: string
  }
}> = [
  {
    id: "batch-001",
    name: "Wood Extraction Process",
    status: "completed",
    date: new Date(2023, 9, 15),
    product: "Couch",
    components: ["Water", "Electricity", "Wood"],
    metrics: {
      totalEmissions: "1,245 kg CO2e",
      waterUsage: "3,500 liters",
      energyConsumption: "780 kWh",
    },
  },
  {
    id: "batch-002",
    name: "Textile Manufacturing",
    status: "processing",
    date: new Date(2023, 10, 5),
    product: "Chair",
    components: ["Cotton", "Dye", "Electricity"],
    metrics: {
      totalEmissions: "pending",
      waterUsage: "pending",
      energyConsumption: "pending",
    },
  },
  {
    id: "batch-003",
    name: "Metal Processing",
    status: "draft",
    date: new Date(2023, 10, 10),
    product: "Table",
    components: ["Steel", "Electricity", "Water"],
    metrics: {
      totalEmissions: "draft",
      waterUsage: "draft",
      energyConsumption: "draft",
    },
  },
  {
    id: "batch-004",
    name: "Plastic Components Production",
    status: "completed",
    date: new Date(2023, 8, 20),
    product: "Storage Box",
    components: ["Plastic", "Electricity"],
    metrics: {
      totalEmissions: "850 kg CO2e",
      waterUsage: "1,200 liters",
      energyConsumption: "450 kWh",
    },
  },
]

export default function BatchesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [batches, setBatches] = useState<any[]>([])
  const [filteredBatches, setFilteredBatches] = useState<any[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchBatches = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const response = await fetch("/api/batches", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        })

        const data = await response.json()
        console.log("✅ Fetched data:", data)

        if (!Array.isArray(data.batches)) {
          console.error("❌ `batches` is not an array:", data)
          return
        }

        setBatches(data.batches)
        setFilteredBatches(data.batches)
      } catch (error) {
        console.error("Error fetching batches:", error)
      }
    }

    fetchBatches()
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterBatches(query, statusFilter)
  }

  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status)
    filterBatches(searchQuery, status)
  }

  const filterBatches = (query: string, status: string | null) => {
    let filtered = [...batches]

    if (query) {
      filtered = filtered.filter(
        (batch) =>
          batch.name?.toLowerCase().includes(query.toLowerCase()) ||
          batch.product?.toLowerCase().includes(query.toLowerCase()) ||
          batch.components?.some((component: string) =>
            component.toLowerCase().includes(query.toLowerCase())
          )
      )
    }

    if (status) {
      filtered = filtered.filter((batch) => batch.status === status)
    }

    setFilteredBatches(filtered)
  }

  const handleNewBatch = () => {
    router.push("/dashboard/upload")
  }

  const handleViewBatch = (batchId: string) => {
    router.push(`/batches/${batchId}`)
  }

  return (
    <main className="max-w-7xl mx-auto" aria-labelledby="batches-heading">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 id="batches-heading" className="text-2xl font-bold">Batches</h1>
          <p className="text-md text-gray-500 mt-1">Manage your sustainability data batches</p>
        </div>
        <div className="mt-4 md:mt-0">
          <PrimaryButton onClick={handleNewBatch} size="large" aria-label="Create new batch">
            <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
            New Batch
          </PrimaryButton>
        </div>
      </div>

      <section aria-labelledby="batch-list-heading">
        <h2 id="batch-list-heading" className="sr-only">Batch List</h2>
        <Card className="mb-8">
          <CardContent className="px-6 my-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="relative flex-1">
                <label htmlFor="search-batches" className="sr-only">Search batches</label>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden="true" />
                <Input
                  id="search-batches"
                  placeholder="Search batches..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  aria-controls="batches-table"
                />
              </div>

              <div className="flex gap-2">
                <OutlineButton
                  onClick={() => setShowFilters(!showFilters)}
                  aria-expanded={showFilters}
                  aria-controls="filters-panel"
                >
                  <Filter className="w-4 h-4 mr-2" aria-hidden="true" />
                  Filters
                </OutlineButton>
              </div>
            </div>

            {showFilters && (
              <div id="filters-panel" className="mb-6 p-4 bg-gray-50 rounded-lg" role="region" aria-labelledby="filter-heading">
                <h3 id="filter-heading" className="text-sm font-medium mb-3">Filter by Status</h3>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="filter-heading">
                  <OutlineButton
                    onClick={() => handleStatusFilter(null)}
                    className={!statusFilter ? "bg-gray-100" : ""}
                    aria-pressed={!statusFilter}
                    aria-checked={!statusFilter}
                  >
                    All
                  </OutlineButton>
                  <OutlineButton
                    onClick={() => handleStatusFilter("completed")}
                    className={statusFilter === "completed" ? "bg-gray-100" : ""}
                    aria-pressed={statusFilter === "completed"}
                    aria-checked={statusFilter === "completed"}
                  >
                    Completed
                  </OutlineButton>
                  <OutlineButton
                    onClick={() => handleStatusFilter("processing")}
                    className={statusFilter === "processing" ? "bg-gray-100" : ""}
                    aria-pressed={statusFilter === "processing"}
                    aria-checked={statusFilter === "processing"}
                  >
                    In Progress
                  </OutlineButton>
                  <OutlineButton
                    onClick={() => handleStatusFilter("draft")}
                    className={statusFilter === "draft" ? "bg-gray-100" : ""}
                    aria-pressed={statusFilter === "draft"}
                    aria-checked={statusFilter === "draft"}
                  >
                    Draft
                  </OutlineButton>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table id="batches-table" className="w-full" aria-label="Batches">
                <thead>
                  <tr className="border-b">
                    <th scope="col" className="text-left py-3 px-4 font-medium text-gray-500">Batch ID</th>
                    <th scope="col" className="text-left py-3 px-4 font-medium text-gray-500 hidden sm:table-cell">Product</th>
                    <th scope="col" className="text-left py-3 px-4 font-medium text-gray-500">Info URL</th>
                    <th scope="col" className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                    <th scope="col" className="text-left py-3 px-4 font-medium text-gray-500 hidden sm:table-cell">Status</th>
                    <th scope="col" className="text-center py-3 px-4 font-medium text-gray-500">Actions</th>

                  </tr>
                </thead>
                <tbody>
                  {filteredBatches.length > 0 ? (
                    filteredBatches.map((batch) => (
                      <tr key={batch.id} className="border-b hover:bg-gray-50 text-sm">
                        <td className="py-3 px-4">
                          <div className="font-medium">{batch.id}</div>
                        </td>
                        <td className="py-3 px-4">{batch.product_name || "-"}</td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <a
                            href={batch.information_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-sm"
                          >
                            View Info
                          </a>
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" aria-hidden="true" />
                            <span>{new Date(batch.created_at).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge status={batch.status || "completed"}>
                            {batch.status ? batch.status.charAt(0).toUpperCase() + batch.status.slice(1) : "Completed"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleViewBatch(batch.id)}
                            className="text-gray-500 hover:text-gray-700 font-medium"
                            aria-label={`View details for ${batch.name}`}
                          >
                            <Eye className="w-5 h-5 cursor-pointer" aria-hidden="true" />
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
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section aria-labelledby="statistics-heading">
          <Card>
            <CardContent className="p-6 my-4">
              <h2 id="statistics-heading" className="text-lg font-medium mb-4">Batch Statistics</h2>
              <dl className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <dt>Total Batches</dt>
                  <dd className="font-medium">{batches.length}</dd>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <dt>Completed</dt>
                  <dd className="font-medium">{batches.filter((b) => b.status === "completed" || !b.status).length}</dd>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <dt>In Progress</dt>
                  <dd className="font-medium">{batches.filter((b) => b.status === "processing").length}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt>Draft</dt>
                  <dd className="font-medium">{batches.filter((b) => b.status === "draft").length}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="activity-heading">
          <Card>
            <CardContent className="p-6 my-4">
              <h2 id="activity-heading" className="text-lg font-medium mb-4">Recent Activity</h2>
              <ul className="space-y-4 text-sm">
                {batches
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .slice(0, 4)
                  .map((batch) => (
                    <li key={batch.id} className="flex items-start py-2 border-b last:border-0">
                      <div
                        className={`w-2 h-2 mt-1.5 rounded-full mr-3 ${batch.status === "completed"
                          ? "bg-green-500"
                          : batch.status === "processing"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                          }`}
                        aria-hidden="true"
                      ></div>
                      <div className="flex-1">
                        <div className="font-medium">{batch.name}</div>
                        <div className="text-sm text-gray-500">
                          Completed • {formatDate(new Date(batch.created_at))}
                          {/* {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)} • {formatDate(batch.date)} */}
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
