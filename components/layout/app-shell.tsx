"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

interface User {
  username: string
  role: string
  name: string
}

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }, [router])

  // Check permissions based on role and path
  useEffect(() => {
    if (!loading && user) {
      // Example permission check
      if (pathname.includes("/admin") && user.role !== "admin") {
        router.push("/dashboard")
      }
    }
  }, [loading, user, pathname, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#12b784]"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar userRole={user?.role} />
      <div className="flex-1 w-full">
        <Header userName={user?.name} userRole={user?.role} />
        <main className="px-4 sm:px-8 py-6 sm:py-12 w-full overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}
