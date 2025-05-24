"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react"
import { PrimaryButton } from "@/components/ui/primary-button"

export function CreateAccountForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate account creation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      localStorage.setItem(
        "user",
        JSON.stringify({
          username: formData.username,
          email: formData.email,
          role: "user",
          name: formData.username.charAt(0).toUpperCase() + formData.username.slice(1),
        }),
      )

      router.push("/dashboard")
    } catch (err) {
      setErrors({ form: "Failed to create account. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <div className="w-full mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm md:text-base flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Back to login"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to login
        </Link>
      </div>
      <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Create Account</h1>

      {errors.form && (
        <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
          {errors.form}
        </div>
      )}

      <form className="w-full space-y-5 md:space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label htmlFor="username" className="block text-gray-700 text-sm font-medium">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="w-full h-10 md:h-12 px-3 rounded-lg bg-[#e9e9e9] border-none focus:ring-2 focus:ring-[#12b784] text-sm md:text-base"
            disabled={isLoading}
            placeholder="Choose a username"
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? "username-error" : undefined}
          />
          {errors.username && (
            <p id="username-error" className="text-red-500 text-xs mt-1">
              {errors.username}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-gray-700 text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-10 md:h-12 px-3 rounded-lg bg-[#e9e9e9] border-none focus:ring-2 focus:ring-[#12b784] text-sm md:text-base"
            disabled={isLoading}
            placeholder="Enter your email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-red-500 text-xs mt-1">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-gray-700 text-sm font-medium">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className="w-full h-10 md:h-12 px-3 rounded-lg bg-[#e9e9e9] border-none focus:ring-2 focus:ring-[#12b784] text-sm md:text-base"
              disabled={isLoading}
              placeholder="Create a password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="text-red-500 text-xs mt-1">
              {errors.password}
            </p>
          )}
          <p className="text-gray-500 text-xs mt-1">Password must be at least 8 characters</p>
        </div>

        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full h-10 md:h-12 px-3 rounded-lg bg-[#e9e9e9] border-none focus:ring-2 focus:ring-[#12b784] text-sm md:text-base"
              disabled={isLoading}
              placeholder="Confirm your password"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p id="confirm-password-error" className="text-red-500 text-xs mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="pt-2">
          <PrimaryButton
            type="submit"
            className="w-full h-10 md:h-12 text-sm md:text-base flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? "Creating Account..." : "Create Account"}
          </PrimaryButton>
        </div>

        <p className="text-center text-xs md:text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/" className="text-[#12b784] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
