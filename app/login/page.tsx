"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

const colors = {
  primary: "#8B1538",
  secondary: "#6C757D",
  white: "#FFFFFF",
  lightGray: "#F5F5F5",
  darkGray: "#333333",
  lightMaroon: "#A64B6B",
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { login, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await register(email, password, name)
      }
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: `
          linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%),
          linear-gradient(90deg, transparent 0%, rgba(0, 100, 200, 0.3) 20%, transparent 21%, transparent 79%, rgba(0, 100, 200, 0.3) 80%, transparent 100%),
          linear-gradient(90deg, transparent 49%, rgba(200, 0, 0, 0.4) 49.5%, rgba(200, 0, 0, 0.4) 50.5%, transparent 51%)
        `,
      }}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center" style={{ backgroundColor: colors.primary, color: colors.white }}>
          <CardTitle className="text-2xl">Anna Maria Ice Hockey</CardTitle>
          <p className="text-sm opacity-90">Summer Workout Program</p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                minLength={6}
              />
            </div>

            {error && <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading} style={{ backgroundColor: colors.primary }}>
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm hover:underline"
              style={{ color: colors.primary }}
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>Demo Admin Account:</p>
            <p>Email: admin@amcats.com</p>
            <p>Password: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
