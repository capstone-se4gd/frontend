"use client"

import type { ReactNode } from "react"

interface OutlineButtonProps {
  children: ReactNode
  onClick?: () => void
  size?: "default" | "large"
  className?: string
  disabled?: boolean
  ariaLabel?: string
  type?: "button" | "submit" | "reset"
}

export function OutlineButton({ children, onClick, className = "", disabled, ariaLabel, size }: OutlineButtonProps) {
  const sizeClasses = size === "large" ? "px-6 py-3 text-lg" : "px-4 py-2 text-sm"

  return (
    <button
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#1BA177] hover:bg-[#12b784]/5 transition-colors  ${sizeClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      type="button"
    >
      {children}
    </button>
  )
}
