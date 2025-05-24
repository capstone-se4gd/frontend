"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, HelpCircle, LogOut, Settings, User, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-[#e9e9e9] bg-white shadow-sm">
      <div className="flex items-center gap-4">
        {/* Hamburger menu button */}
        <button
          className="lg:hidden p-2 rounded-md text-[#1a2942]"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        {/* Logo */}
        {showLogo && <h2 className="text-xl sm:text-2xl font-bold text-[#1BA177]">Middleware</h2>}
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        <button className="relative p-2 rounded-full hover:bg-gray-100" aria-label="Help">
          <HelpCircle className="w-5 h-5 text-gray-600" />
        </button>

        <button
          className="relative p-2 rounded-full hover:bg-gray-100"
          aria-label={`Notifications: ${notifications} unread`}
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {notifications > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
              {notifications}
            </span>
          )}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 p-1 sm:p-2 rounded-full hover:bg-gray-100"
              aria-label="User menu"
            >
              <span className="text-sm font-medium hidden sm:inline">{userName}</span>
              <Avatar className="h-8 w-8 bg-[#12b784] text-white">
                <AvatarFallback>{getInitials(userName)}</AvatarFallback>
              </Avatar>
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
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
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
