"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { PrimaryButton } from "@/components/ui/primary-button"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSubmitted(true)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      {!isSubmitted ? (
        <>
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

          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">Reset Password</h1>
          <p className="text-sm md:text-base text-gray-600 mb-6">
            Enter your email address and we'll send you instructions to reset your password.
          </p>

          {error && (
            <div
              className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              role="alert"
            >
              {error}
            </div>
          )}

          <form className="w-full space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 md:h-12 px-3 rounded-lg bg-[#e9e9e9] border-none focus:ring-2 focus:ring-[#12b784] text-sm md:text-base"
                disabled={isLoading}
                placeholder="Enter your email address"
                aria-describedby={error ? "email-error" : undefined}
              />
            </div>

            <div className="pt-2">
              <PrimaryButton
                type="submit"
                className="w-full h-10 md:h-12 text-sm md:text-base flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? "Sending..." : "Send Reset Instructions"}
              </PrimaryButton>
            </div>
          </form>
        </>
      ) : (
        <div className="w-full text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-[#12b784]" />
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Check Your Email</h2>
          <p className="text-sm md:text-base text-gray-600 mb-8">
            We've sent password reset instructions to:
            <br />
            <span className="font-medium text-gray-900">{email}</span>
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Didn't receive the email? Check your spam folder or{" "}
            <button onClick={() => setIsSubmitted(false)} className="text-[#12b784] hover:underline font-medium">
              try again
            </button>
          </p>
          <Link
            href="/"
            className="text-sm md:text-base text-gray-600 hover:text-gray-900 flex items-center justify-center"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to login
          </Link>
        </div>
      )}
    </div>
  )
}
