import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Middleware",
  description: "A comprehensive platform for sustainability data management",
  // Disable font optimization
  metadataBase: new URL('https://frontend-876789228877.europe-north1.run.app'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent font preloading */}
        <meta name="next-font-preload" content="off" />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
