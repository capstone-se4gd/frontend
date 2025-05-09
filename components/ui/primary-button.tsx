"use client"

import type { ReactNode } from "react"

interface PrimaryButtonProps {
  children: ReactNode
  onClick?: () => void
  size?: "default" | "large"
  className?: string
  type?: "button" | "submit" | "reset"
  disabled?: boolean
}

export function PrimaryButton({ children, onClick, size = "default", className = "", type = "button", disabled = false }: PrimaryButtonProps) {
  const sizeClasses = "px-8 py-4 text-lg flex wrap items-center"

  return (
    <button
      className={`bg-[#12b784] text-white font-medium rounded-full hover:bg-[#12b784]/90 transition-colors ${sizeClasses} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
