"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for development
const DEMO_USERS = [
  {
    id: "admin-1",
    email: "admin@amcats.com",
    password: "admin123",
    name: "Admin User",
    role: "admin" as const,
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-1",
    email: "player1@amcats.com",
    password: "player123",
    name: "John Smith",
    role: "user" as const,
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-2",
    email: "player2@amcats.com",
    password: "player123",
    name: "Sarah Johnson",
    role: "user" as const,
    createdAt: new Date().toISOString(),
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("workout-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const demoUser = DEMO_USERS.find((u) => u.email === email && u.password === password)
    if (!demoUser) {
      throw new Error("Invalid email or password")
    }

    const { password: _, ...userWithoutPassword } = demoUser
    setUser(userWithoutPassword)
    localStorage.setItem("workout-user", JSON.stringify(userWithoutPassword))
  }

  const register = async (email: string, password: string, name: string) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check if user already exists
    const existingUser = DEMO_USERS.find((u) => u.email === email)
    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: "user" as const,
      createdAt: new Date().toISOString(),
    }

    // In a real app, you'd save this to your database
    DEMO_USERS.push({ ...newUser, password })

    setUser(newUser)
    localStorage.setItem("workout-user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("workout-user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
