"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Plus, Upload } from "lucide-react"
import { WaterConsumptionModal } from "@/components/water-consumption-modal"

export default function NewBatchPage() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [waterInvoiceStatus, setWaterInvoiceStatus] = useState("missing")

  const handleCreate = () => {
    router.push("/dashboard/new-batch/water-consumption")
  }

  const handleWaterInvoiceClick = () => {
    if (waterInvoiceStatus === "missing") {
      setIsModalOpen(true)
    }
  }

  const handleSave = () => {
    setWaterInvoiceStatus("complete")
    setIsModalOpen(false)
  }

  const handleNoMetricsNeeded = () => {
    setWaterInvoiceStatus("no-metrics")
    setIsModalOpen(false)
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Left sidebar */}
      <div className="w-[92px] bg-[#e9e9e9] h-full"></div>

      {/* Main content */}
      <div className="flex-1">
        {/* Header */}
        <header className="flex items-center justify-end px-8 py-4 border-b border-[#e9e9e9]">
          <div className="flex items-center">
            <span className="text-xl font-medium">Manu</span>
          </div>
        </header>

        {/* Main content */}
        <main className="px-8 py-12">
          <h1 className="text-4xl font-bold mb-16">New Batch</h1>

          <div className="max-w-4xl mx-auto space-y-12">
            {/* Product selection */}
            <div className="flex items-center gap-6">
              <label className="text-2xl font-medium">Product:</label>
              <div className="relative">
                <div className="flex items-center justify-between w-[240px] px-6 py-3 rounded-full border-2 border-[#12b784]">
                  <span className="text-lg">New Product</span>
                  <Check className="w-5 h-5 text-[#12b784]" />
                </div>
              </div>
              <button className="flex items-center justify-center w-12 h-12 bg-[#12b784] rounded-full">
                <Plus className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Invoices upload */}
            <div className="flex items-center gap-6">
              <label className="text-2xl font-medium">Invoices:</label>
              <button className="flex items-center gap-2 px-8 py-3 rounded-full border-2 border-[#12b784] hover:bg-[#12b784]/5 transition-colors">
                <span className="text-lg">Upload</span>
                <div className="bg-[#12b784] rounded-sm p-1">
                  <Upload className="w-4 h-4 text-white" />
                </div>
              </button>
            </div>

            {/* Invoice cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Water Invoice */}
              <div
                className="border-2 border-[#000000] rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-gray-50"
                onClick={handleWaterInvoiceClick}
              >
                <h3 className="text-xl font-medium mb-6">Water Invoice</h3>
                {waterInvoiceStatus === "missing" && <p className="text-[#ff0303] font-medium">Information Missing</p>}
                {waterInvoiceStatus === "complete" && <p className="text-[#12b784] font-medium">Complete</p>}
                {waterInvoiceStatus === "no-metrics" && <p className="text-gray-500 font-medium">No Metrics Needed</p>}
              </div>

              {/* Electricity Invoice */}
              <div className="border-2 border-[#000000] rounded-lg p-6 flex flex-col items-center">
                <h3 className="text-xl font-medium">Electricity Invoice</h3>
              </div>

              {/* Wood Invoice */}
              <div className="border-2 border-[#000000] rounded-lg p-6 flex flex-col items-center">
                <h3 className="text-xl font-medium">Wood Invoice</h3>
              </div>
            </div>

            {/* Create button */}
            <div className="flex justify-center mt-16">
              <button
                className="bg-[#12b784] text-white text-xl font-medium px-16 py-4 rounded-full hover:bg-[#12b784]/90 transition-colors"
                onClick={handleCreate}
              >
                Create
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Water Consumption Modal */}
      <WaterConsumptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onNoMetricsNeeded={handleNoMetricsNeeded}
      />
    </div>
  )
}
