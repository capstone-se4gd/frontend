"use client"

import type { ReactNode } from "react"

interface PrimaryButtonProps {
  children: ReactNode
  onClick?: () => void
  size?: "default" | "large"
  className?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function PrimaryButton({
  children,
  onClick,
  size = "default",
  className = "",
  disabled = false,
  type = "button",
}: PrimaryButtonProps) {
  const sizeClasses = size === "large" ? "px-5 py-2.5 text-md" : "px-4 py-2 text-sm"

  return (
    <button
      type={type}
      className={`bg-[#1BA177] text-white font-medium rounded-lg hover:bg-[#12b784]/90 transition-colors inline-flex items-center justify-center ${sizeClasses} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
