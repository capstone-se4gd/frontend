interface MetricsTableProps {
  metrics: Array<{ label: string; value: string }>
  compact?: boolean
}

export function MetricsTable({ metrics, compact = false }: MetricsTableProps) {
  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {metrics.map((metric, index) => (
          <div key={index} className="contents">
            <div>{metric.label}</div>
            <div>{metric.value}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className="contents">
          <div>{metric.label}</div>
          <div>{metric.value}</div>
          <div className="col-span-2"></div>
        </div>
      ))}
    </div>
  )
}
