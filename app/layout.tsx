import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hockey Workout Program",
  description: "Anna Maria Ice Hockey Summer Workout Program",
  manifest: "/manifest.json",
  themeColor: "#8B1538",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hockey Workout",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
