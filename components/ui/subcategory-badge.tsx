import type * as React from "react"
import { cn } from "@/lib/utils"

interface SubcategoryBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

function SubcategoryBadge({ className, children, ...props }: SubcategoryBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-gray-300 bg-transparent px-2.5 py-0.5 text-xs font-semibold text-gray-700",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { SubcategoryBadge }
