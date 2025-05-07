import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { MetricsTable } from "@/components/tables/metrics-table"
import { ComponentCard } from "@/components/cards/component-card"

export default function WaterConsumptionPage() {
  const metrics = [
    { label: "Scope 1:", value: "X" },
    { label: "Scope 2:", value: "X" },
    { label: "Scope 3:", value: "X" },
    { label: "Water Usage:", value: "X" },
    { label: "Energy Consumption:", value: "X" },
  ]

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />

      <div className="flex-1">
        <Header showLogo={true} />

        <main className="px-8 py-12">
          <h1 className="text-4xl font-bold mb-16">Water Consumption - Batch XXX</h1>

          <div className="max-w-5xl mx-auto space-y-12">
            {/* Product information */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-2xl font-medium">Product:</div>
              <div className="text-2xl col-span-3">Couch</div>
            </div>

            {/* Sustainability Metrics */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Sustainability Metrics:</h2>
              <MetricsTable metrics={metrics} />
            </div>

            {/* Components */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Components:</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ComponentCard title="Water" metrics={metrics} />
                <ComponentCard title="Electricity" metrics={metrics} />
                <ComponentCard title="Wood" metrics={metrics} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
