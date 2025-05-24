"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation" // Correctly import useRouter
import { BarChart2, FileText, Home, Layers, Package, Settings, Users, Menu, X, PlusCircle } from "lucide-react"
import { OutlineButton } from "../ui/outline-button"

interface SidebarProps {
  userRole?: string
}

export function Sidebar({ userRole = "user" }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter() // Initialize the router using useRouter
  const [expanded, setExpanded] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setExpanded(window.innerWidth >= 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const isActive = (path: string) => pathname === path || (pathname.startsWith(`${path}/`) && path !== "/dashboard")

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Layers, label: "Batches", path: "/dashboard/batches" },
    { icon: FileText, label: "User Guide", path: "/dashboard/reports" },
    { icon: BarChart2, label: "Analytics", path: "/dashboard/analytics" },
  ]

  const adminItems = [
    { icon: Users, label: "User Management", path: "/dashboard/users" }
  ]

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen)

  const handleNewBatch = () => {
    router.push("/dashboard/upload") 
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#1a2942] text-white"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`bg-[#1a2942] text-white transition-all duration-300 fixed lg:sticky top-0 z-40
          ${expanded ? "w-64" : "w-[80px]"} 
          ${mobileOpen ? "left-0 min-w-full h-full" : "-left-full lg:left-0"}
          h-screen flex flex-col`}
        aria-label="Main navigation"
        role="navigation"
      >
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          {expanded && <h2 className="text-xl font-bold">Middleware</h2>}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors hidden lg:block"
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <Package className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                  isActive(item.path) ? "bg-[#1BA177] text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive(item.path) ? "page" : undefined}
              >
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" aria-hidden="true" />
                {(expanded || mobileOpen) && <span className="text-sm">{item.label}</span>}
              </Link>
            ))}

            {(userRole === "admin" || userRole === "manager") && (
              <>
                <div className={`mt-6 mb-2 ${expanded || mobileOpen ? "px-4" : "px-2"}`}>
                  {expanded || mobileOpen ? (
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4">Administration</p>
                  ) : (
                    <div className="border-t border-gray-700 w-full"></div>
                  )}
                </div>

                {adminItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-[#1BA177] text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive(item.path) ? "page" : undefined}
                  >
                    <item.icon className="w-5 h-5 mr-3 flex-shrink-0" aria-hidden="true" />
                    {(expanded || mobileOpen) && <span className="text-sm">{item.label}</span>}
                  </Link>
                ))}
              </>
            )}
          </nav>
        </div>

        {/* New Batch Button at the Bottom */}
        <div className="p-4 border-t border-gray-700">
          <OutlineButton
            onClick={() => handleNewBatch()}
            className={`w-full flex items-center justify-center ${
              expanded ? "px-4 py-2" : "px-2 py-2"
            }`}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            {expanded && <span>New Batch</span>}
            {mobileOpen && <span>New Batch</span>}
          </OutlineButton>
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
