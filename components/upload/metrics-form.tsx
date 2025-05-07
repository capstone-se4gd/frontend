"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoCircle } from "@/components/ui/icons"

interface MetricsFormProps {
  title: string
  metrics: {
    scope1: string
    scope2: string
    scope3: string
    waterUsage: string
    energyConsumption: string
  }
  onChange: (field: string, value: string) => void
}

export function MetricsForm({ title, metrics, onChange }: MetricsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scope 1 Emissions
              <InfoCircle
                className="inline-block ml-1 text-gray-400"
                title="Direct emissions from owned or controlled sources"
              />
            </label>
            <div className="flex">
              <input
                type="text"
                value={metrics.scope1}
                onChange={(e) => onChange("scope1", e.target.value)}
                className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                placeholder="Enter value"
              />
              <span className="inline-flex items-center px-3 py-2 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                kg CO2e
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scope 2 Emissions
              <InfoCircle
                className="inline-block ml-1 text-gray-400"
                title="Indirect emissions from purchased electricity, steam, heating and cooling"
              />
            </label>
            <div className="flex">
              <input
                type="text"
                value={metrics.scope2}
                onChange={(e) => onChange("scope2", e.target.value)}
                className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                placeholder="Enter value"
              />
              <span className="inline-flex items-center px-3 py-2 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                kg CO2e
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scope 3 Emissions
              <InfoCircle
                className="inline-block ml-1 text-gray-400"
                title="All other indirect emissions in a company's value chain"
              />
            </label>
            <div className="flex">
              <input
                type="text"
                value={metrics.scope3}
                onChange={(e) => onChange("scope3", e.target.value)}
                className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                placeholder="Enter value"
              />
              <span className="inline-flex items-center px-3 py-2 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                kg CO2e
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Water Usage
              <InfoCircle className="inline-block ml-1 text-gray-400" title="Total water consumption" />
            </label>
            <div className="flex">
              <input
                type="text"
                value={metrics.waterUsage}
                onChange={(e) => onChange("waterUsage", e.target.value)}
                className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                placeholder="Enter value"
              />
              <span className="inline-flex items-center px-3 py-2 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                liters
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Energy Consumption
              <InfoCircle className="inline-block ml-1 text-gray-400" title="Total energy used" />
            </label>
            <div className="flex">
              <input
                type="text"
                value={metrics.energyConsumption}
                onChange={(e) => onChange("energyConsumption", e.target.value)}
                className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                placeholder="Enter value"
              />
              <span className="inline-flex items-center px-3 py-2 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                kWh
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
