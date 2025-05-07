import { Info } from "lucide-react"

interface InfoCircleProps {
  className?: string
  title?: string
}

export function InfoCircle({ className, title }: InfoCircleProps) {
  return (
    <span className={`inline-block ${className}`} title={title}>
      <Info className="h-4 w-4" />
    </span>
  )
}
