"use client"

interface InvoiceCardProps {
  title: string
  status?: "missing" | "complete" | "no-metrics"
  onClick?: () => void
}

export function InvoiceCard({ title, status, onClick }: InvoiceCardProps) {
  return (
    <div
      className={`border-2 border-[#000000] rounded-lg p-6 flex flex-col items-center ${onClick ? "cursor-pointer hover:bg-gray-50" : ""}`}
      onClick={onClick}
    >
      <h3 className="text-xl font-medium mb-6">{title}</h3>
      {status === "missing" && <p className="text-[#ff0303] font-medium">Information Missing</p>}
      {status === "complete" && <p className="text-[#12b784] font-medium">Complete</p>}
      {status === "no-metrics" && <p className="text-gray-500 font-medium">No Metrics Needed</p>}
    </div>
  )
}
