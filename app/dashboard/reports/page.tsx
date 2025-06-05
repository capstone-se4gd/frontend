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
    title: "Middleware specification: Endpoints usage",
    date: new Date(2025, 5, 16),
    status: "completed",
    link: "https://drive.google.com/file/d/1JV3LzBGU_0x1ije3d2fexsPBXg3tlZNA/view?usp=sharing",

  },
  {
    id: "rep-002",
    title: "Microsoft Sustainability Manager: Emission calculations",
    date: new Date(2025, 5, 16),
    status: "completed",
    link: "https://drive.google.com/file/d/133d67bFbJ9EHBqSZzYIhhfYYIg5QOx3W/view?usp=sharing",

  },
  {
    id: "rep-003",
    title: "Microsoft Sustainability Manager: Account Setup",
    date: new Date(2023, 10, 10),
    status: "processing",
  },
  {
    id: "rep-004",
    title: "Microsoft Sustainability Manager: Data Ingestion",
    date: new Date(2023, 11, 20),
    status: "draft",

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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">User Guide</h1>
          <p className="text-md text-gray-500 mt-1">View useful documentation on how to use Middleware.</p>
        </div>
      </div>

      <div className="bg-[#FCFCFC] rounded-lg border shadow-sm p-4 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search manual..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-500">User Manual</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-gray-50 text-sm">
                    <td className="py-3 px-4">
                      <div className="font-medium">{report.title}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {report.date.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center">
                        <a href={report.link} target="_blank">                        
                        <button className="text-center text-gray-500 hover:text-gray-700" title="Download">
                          <Download className="w-5 h-5" />
                        </button>
                        </a>
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
    </div>
  )
}
