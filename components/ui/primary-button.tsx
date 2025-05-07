"use client"

import type { ReactNode } from "react"

interface PrimaryButtonProps {
  children: ReactNode
  onClick?: () => void
  size?: "default" | "large"
  className?: string
}

export function PrimaryButton({ children, onClick, size = "default", className = "" }: PrimaryButtonProps) {
  const sizeClasses = "px-8 py-4 text-lg flex wrap items-center"

  return (
    <button
      className={`bg-[#12b784] text-white font-medium rounded-full hover:bg-[#12b784]/90 transition-colors ${sizeClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
