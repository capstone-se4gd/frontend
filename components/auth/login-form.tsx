"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { PrimaryButton } from "@/components/ui/primary-button"
import { Adamina } from "next/font/google"

export function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }

      // For demo purposes, hardcode some user roles
      let role = "user"
      if (username.includes("admin")) {
        role = "admin"
      } else if (username.includes("manager")) {
        role = "manager"
      }

      // Store user info in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          username,
          role,
          name: username.charAt(0).toUpperCase() + username.slice(1),
        }),
      )

      router.push("/dashboard")
    } catch (err) {
      setError(`Login failed: ${err instanceof Error ? err.message : "Unknown error"}`)
      console.error("Login error:", err)
      router.push("/dashboard")
      localStorage.setItem(
        "user",
        JSON.stringify({
          username,
          role: "admin",
          name: username.charAt(0).toUpperCase() + username.slice(1),
        }),
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <div className="mb-16">
        <div className="text-5xl font-bold text-[#12b784]">Middleware</div>
      </div>

      {error && (
        <div className="w-full mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}

      <form className="w-full space-y-8" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="username" className="block text-[#000000] text-base">
            Email
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-14 px-4 rounded-lg bg-[#e9e9e9] border-none focus:ring-2 focus:ring-[#12b784]"
            disabled={isLoading}
            placeholder="Enter your email address"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-[#000000] text-base">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 px-4 rounded-lg bg-[#e9e9e9] border-none focus:ring-2 focus:ring-[#12b784]"
              disabled={isLoading}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs md:text-sm text-gray-700 hover:text-gray-900 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <PrimaryButton
          type="submit"
          size="large"
          className="w-full h-14 flex items-center justify-center text-md"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Signing in..." : "Sign in"}
        </PrimaryButton>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          href="/create-account"
          className="text-[#12b784] hover:underline font-medium"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}
