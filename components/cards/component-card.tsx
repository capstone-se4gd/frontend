import { MetricsTable } from "@/components/tables/metrics-table"

interface ComponentCardProps {
  title: string
  metrics: Array<{ label: string; value: string }>
}

export function ComponentCard({ title, metrics }: ComponentCardProps) {
  return (
    <div className="border-2 border-[#000000] rounded-lg p-6">
      <h3 className="text-xl font-medium text-center mb-4">{title}</h3>
      <MetricsTable metrics={metrics} compact />
    </div>
  )
}
