"use client"

import { useState } from "react"
import { Calendar, Download, FileText, Printer, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PrimaryButton } from "@/components/ui/primary-button"
import { OutlineButton } from "@/components/ui/outline-button"
import { Badge } from "@/components/ui/badge"

// Mock report data
const MOCK_REPORTS = [
  {
    id: "rep-001",
    title: "Q3 2023 Sustainability Report",
    type: "quarterly",
    date: new Date(2023, 9, 15),
    status: "completed",
    metrics: {
      totalEmissions: "1,245 kg CO2e",
      waterUsage: "3,500 liters",
      energyConsumption: "780 kWh",
    },
  },
  {
    id: "rep-002",
    title: "Wood Extraction Process Analysis",
    type: "process",
    date: new Date(2023, 10, 5),
    status: "completed",
    metrics: {
      totalEmissions: "450 kg CO2e",
      waterUsage: "1,200 liters",
      energyConsumption: "320 kWh",
    },
  },
  {
    id: "rep-003",
    title: "Textile Manufacturing Impact",
    type: "process",
    date: new Date(2023, 10, 10),
    status: "processing",
    metrics: {
      totalEmissions: "pending",
      waterUsage: "pending",
      energyConsumption: "pending",
    },
  },
  {
    id: "rep-004",
    title: "Annual Sustainability Overview 2023",
    type: "annual",
    date: new Date(2023, 11, 20),
    status: "draft",
    metrics: {
      totalEmissions: "draft",
      waterUsage: "draft",
      energyConsumption: "draft",
    },
  },
]

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [reports, setReports] = useState(MOCK_REPORTS)
  const [filteredReports, setFilteredReports] = useState(MOCK_REPORTS)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterReports(query, selectedType)
  }

  const handleFilterByType = (type: string | null) => {
    setSelectedType(type)
    filterReports(searchQuery, type)
  }

  const filterReports = (query: string, type: string | null) => {
    let filtered = [...reports]

    if (query) {
      filtered = filtered.filter((report) => report.title.toLowerCase().includes(query.toLowerCase()))
    }

    if (type) {
      filtered = filtered.filter((report) => report.type === type)
    }

    setFilteredReports(filtered)
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "quarterly":
        return "Quarterly Report"
      case "annual":
        return "Annual Report"
      case "process":
        return "Process Analysis"
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-gray-500 mt-1">View and generate sustainability reports</p>
        </div>
        <div className="mt-4 md:mt-0">
          <PrimaryButton>
            <FileText className="w-4 h-4 mr-2" />
            Generate New Report
          </PrimaryButton>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-4 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search reports..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <OutlineButton onClick={() => handleFilterByType(null)} className={!selectedType ? "bg-gray-100" : ""}>
              All
            </OutlineButton>
            <OutlineButton
              onClick={() => handleFilterByType("quarterly")}
              className={selectedType === "quarterly" ? "bg-gray-100" : ""}
            >
              Quarterly
            </OutlineButton>
            <OutlineButton
              onClick={() => handleFilterByType("annual")}
              className={selectedType === "annual" ? "bg-gray-100" : ""}
            >
              Annual
            </OutlineButton>
            <OutlineButton
              onClick={() => handleFilterByType("process")}
              className={selectedType === "process" ? "bg-gray-100" : ""}
            >
              Process
            </OutlineButton>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Report</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{report.title}</div>
                      <div className="text-sm text-gray-500">
                        {report.status === "completed" ? (
                          <>
                            <span className="inline-block mr-4">
                              <span className="font-medium">Emissions:</span> {report.metrics.totalEmissions}
                            </span>
                            <span className="inline-block">
                              <span className="font-medium">Water:</span> {report.metrics.waterUsage}
                            </span>
                          </>
                        ) : (
                          "Metrics not finalized"
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">{getTypeLabel(report.type)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {report.date.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(report.status)}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1 text-gray-500 hover:text-gray-700" title="Download">
                          <Download className="w-5 h-5" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-gray-700" title="Print">
                          <Printer className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No reports found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Report Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="font-medium">Quarterly Sustainability Report</div>
                <div className="text-sm text-gray-500">Comprehensive quarterly overview</div>
              </li>
              <li className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="font-medium">Annual Sustainability Report</div>
                <div className="text-sm text-gray-500">Complete annual sustainability metrics</div>
              </li>
              <li className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="font-medium">Process Analysis Report</div>
                <div className="text-sm text-gray-500">Detailed analysis of specific processes</div>
              </li>
              <li className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="font-medium">Executive Summary</div>
                <div className="text-sm text-gray-500">Condensed overview for management</div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scheduled Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="p-3 border rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-medium">Quarterly Report</div>
                  <div className="text-sm text-gray-500">Every 3 months</div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Active</Badge>
              </li>
              <li className="p-3 border rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-medium">Monthly Process Summary</div>
                  <div className="text-sm text-gray-500">Monthly</div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Active</Badge>
              </li>
              <li className="p-3 border rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-medium">Annual Sustainability Report</div>
                  <div className="text-sm text-gray-500">Yearly (December)</div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Active</Badge>
              </li>
              <li className="p-3 border rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-medium">Weekly Water Usage</div>
                  <div className="text-sm text-gray-500">Weekly</div>
                </div>
                <Badge className="bg-gray-100 text-gray-800">Paused</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
