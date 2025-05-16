"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart2,
  FileText,
  Home,
  Layers,
  Package,
  Settings,
  ShieldCheck,
  Upload,
  Users,
  Zap,
  Menu,
  X,
} from "lucide-react"

interface SidebarProps {
  userRole?: string
}

export function Sidebar({ userRole = "user" }: SidebarProps) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Check if screen is mobile on initial render
  useEffect(() => {
    const checkMobile = () => {
      setExpanded(window.innerWidth >= 1024)
    }

    // Set initial state
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Layers, label: "Batches", path: "/dashboard/batches" },
    { icon: FileText, label: "User Manual", path: "/dashboard/reports" },
    { icon: BarChart2, label: "Analytics", path: "/dashboard/analytics" },
  ]

  const adminItems = [
    { icon: Users, label: "User Management", path: "/admin/users" },
    { icon: Settings, label: "System Settings", path: "/admin/settings" },
  ]

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#1a2942] text-white"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`bg-[#1a2942] text-white transition-all duration-300 fixed lg:relative z-40
          ${expanded ? "w-64" : "w-[92px]"} 
          ${mobileOpen ? "left-0" : "-left-full lg:left-0"}
          h-auto flex flex-col`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          {expanded && <h2 className="text-xl font-bold">Middleware</h2>}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors hidden lg:block"
          >
            <Package className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path) ? "bg-[#12b784] text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {expanded && <span>{item.label}</span>}
              </Link>
            ))}

            {(userRole === "admin" || userRole === "manager") && (
              <>
                <div className={`mt-8 mb-2 ${expanded ? "px-4" : "px-2"}`}>
                  {expanded ? (
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Administration</p>
                  ) : (
                    <div className="border-t border-gray-700 w-full"></div>
                  )}
                </div>

                {adminItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-[#12b784] text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {expanded && <span>{item.label}</span>}
                  </Link>
                ))}
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
    </>
  )
}
