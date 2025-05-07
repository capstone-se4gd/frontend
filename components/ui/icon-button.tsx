"use client"

import type { ReactNode } from "react"

interface IconButtonProps {
  icon: ReactNode
  onClick?: () => void
  className?: string
}

export function IconButton({ icon, onClick, className = "" }: IconButtonProps) {
  return (
    <button
      className={`flex items-center justify-center w-12 h-12 bg-[#12b784] rounded-full hover:bg-[#12b784]/90 transition-colors ${className}`}
      onClick={onClick}
    >
      {icon}
    </button>
  )
}
