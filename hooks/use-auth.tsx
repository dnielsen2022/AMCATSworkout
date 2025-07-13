"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

const isBrowser = typeof window !== "undefined"

interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  deleteUser: (userId: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users
const demoUsers: User[] = [
  { id: "1", email: "admin@amcats.com", name: "Coach Admin", role: "admin" },
  { id: "2", email: "player1@amcats.com", name: "Player One", role: "user" },
  { id: "3", email: "player2@amcats.com", name: "Player Two", role: "user" },
  { id: "4", email: "player3@amcats.com", name: "Player Three", role: "user" },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for stored user session
    const storedUser = isBrowser ? localStorage.getItem("amcats_user") : null
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo authentication
    const foundUser = demoUsers.find((u) => u.email === email)

    if (
      foundUser &&
      ((email === "admin@amcats.com" && password === "admin123") ||
        (email.includes("player") && password === "player123"))
    ) {
      setUser(foundUser)
      if (isBrowser) localStorage.setItem("amcats_user", JSON.stringify(foundUser))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    if (isBrowser) localStorage.removeItem("amcats_user")
  }

  const deleteUser = (userId: string) => {
    // Remove user from demo users (in real app, this would be an API call)
    const userIndex = demoUsers.findIndex((u) => u.id === userId)
    if (userIndex > -1) {
      demoUsers.splice(userIndex, 1)
    }

    // Also remove their progress data
    const progressKey = `amcats_progress_${userId}`
    if (isBrowser) localStorage.removeItem(progressKey)
  }

  return <AuthContext.Provider value={{ user, login, logout, deleteUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
