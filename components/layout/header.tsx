"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowUp, Bell, HelpCircle, LogOut, Settings, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  showLogo?: boolean
  userName?: string
  userRole?: string
}

export function Header({ showLogo = true, userName = "User", userRole = "user" }: HeaderProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState(3)

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const roleLabel = () => {
    switch (userRole) {
      case "admin":
        return "Administrator"
      case "manager":
        return "Manager"
      default:
        return "Basic User"
    }
  }

  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-[#e9e9e9] bg-white">
      {showLogo ? <div className="text-2xl font-bold text-[#12b784]"></div> : <div></div>}

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <HelpCircle className="w-5 h-5 text-gray-600" />
        </button>

        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-600" />
          {notifications > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
              {notifications}
            </span>
          )}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 sm:gap-3 p-2 rounded-full hover:bg-gray-100">
              <span className="text-sm sm:text-base font-medium hidden sm:inline">{userName}</span>
              <div className="rounded-full border border-[#000000] p-2">
                <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{userName}</span>
                <span className="text-xs text-gray-500">{roleLabel()}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
