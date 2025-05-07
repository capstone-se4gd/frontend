"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface WaterConsumptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  onNoMetricsNeeded: () => void
}

export function WaterConsumptionModal({ isOpen, onClose, onSave, onNoMetricsNeeded }: WaterConsumptionModalProps) {
  const [url, setUrl] = useState("")
  const [scope1, setScope1] = useState("")
  const [scope2, setScope2] = useState("")
  const [scope3, setScope3] = useState("")
  const [waterUsage, setWaterUsage] = useState("")
  const [energyUsage, setEnergyUsage] = useState("")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl p-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-black">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Invoice: Water Consumption</h2>

        <div className="space-y-4 mb-8">
          <div>
            <input
              type="text"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-[#e9e9e9] border-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="font-medium">Scope 1:</label>
            <input
              type="text"
              value={scope1}
              onChange={(e) => setScope1(e.target.value)}
              className="col-span-2 px-4 py-3 rounded-full bg-[#e9e9e9] border-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="font-medium">Scope 2:</label>
            <input
              type="text"
              value={scope2}
              onChange={(e) => setScope2(e.target.value)}
              className="col-span-2 px-4 py-3 rounded-full bg-[#e9e9e9] border-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="font-medium">Scope 3:</label>
            <input
              type="text"
              value={scope3}
              onChange={(e) => setScope3(e.target.value)}
              className="col-span-2 px-4 py-3 rounded-full bg-[#e9e9e9] border-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="font-medium">Water Usage:</label>
            <input
              type="text"
              value={waterUsage}
              onChange={(e) => setWaterUsage(e.target.value)}
              className="col-span-2 px-4 py-3 rounded-full bg-[#e9e9e9] border-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="font-medium">Energy Usage:</label>
            <input
              type="text"
              value={energyUsage}
              onChange={(e) => setEnergyUsage(e.target.value)}
              className="col-span-2 px-4 py-3 rounded-full bg-[#e9e9e9] border-none"
            />
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button onClick={onSave} className="px-12 py-3 bg-[#12b784] text-white rounded-full font-medium">
            Save
          </button>

          <button
            onClick={onNoMetricsNeeded}
            className="px-6 py-3 border-2 border-[#12b784] text-[#12b784] rounded-full font-medium"
          >
            No Metrics Needed
          </button>
        </div>
      </div>
    </div>
  )
}
