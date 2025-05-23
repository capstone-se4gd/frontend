"use client"

import type { ReactNode } from "react"

interface OutlineButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  ariaLabel?: string
  type?: "button" | "submit" | "reset"
}

export function OutlineButton({ children, onClick, className = "", disabled, ariaLabel, type = "button" }: OutlineButtonProps) {
  return (
    <button
      className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#12b784] hover:bg-[#12b784]/5 transition-colors ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
}
