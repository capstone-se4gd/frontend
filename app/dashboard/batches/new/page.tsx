"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Plus, Upload } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { PrimaryButton } from "@/components/ui/primary-button"
import { OutlineButton } from "@/components/ui/outline-button"
import { IconButton } from "@/components/ui/icon-button"
import { InvoiceCard } from "@/components/cards/invoice-card"
import { WaterConsumptionModal } from "@/components/modals/water-consumption-modal"

export default function NewBatchPage() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [waterInvoiceStatus, setWaterInvoiceStatus] = useState<"missing" | "complete" | "no-metrics">("missing")

  const handleCreate = () => {
    router.push("/dashboard/batches/water-consumption")
  }

  const handleUpload = () => {
    router.push("/dashboard/products/wood-extraction-psz5o")
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
      <Sidebar />

      <div className="flex-1">
        <Header showLogo={false} />

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
              <IconButton icon={<Plus className="w-6 h-6 text-white" />} />
            </div>

            {/* Invoices upload */}
            <div className="flex items-center gap-6">
              <label className="text-2xl font-medium">Invoices:</label>
              <OutlineButton onClick={handleUpload}>
                <span className="text-lg">Upload</span>
                <div className="bg-[#12b784] rounded-sm p-1">
                  <Upload className="w-4 h-4 text-white" />
                </div>
              </OutlineButton>
            </div>

            {/* Invoice cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InvoiceCard title="Water Invoice" status={waterInvoiceStatus} onClick={handleWaterInvoiceClick} />
              <InvoiceCard title="Electricity Invoice" />
              <InvoiceCard title="Wood Invoice" />
            </div>

            {/* Create button */}
            <div className="flex justify-center mt-16">
              <PrimaryButton onClick={handleCreate} size="large">
                Create
              </PrimaryButton>
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
