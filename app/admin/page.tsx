"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useProgress } from "@/hooks/use-progress"
import { useRouter } from "next/navigation"
import { Calendar, User, TrendingUp, Award } from "lucide-react"

const colors = {
  primary: "#8B1538",
  secondary: "#6C757D",
  white: "#FFFFFF",
  lightGray: "#F5F5F5",
  darkGray: "#333333",
  lightMaroon: "#A64B6B",
}

interface UserStats {
  userId: string
  userName: string
  totalCompletions: number
  lastActivity: string
  currentPhase: number
  currentWeek: number
  currentDay: number
  completionRate: number
}

export default function AdminPage() {
  const { user } = useAuth()
  const { getAllUserProgress } = useProgress()
  const router = useRouter()
  const [userStats, setUserStats] = useState<UserStats[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "admin") {
      router.push("/")
      return
    }

    // Calculate user statistics
    const allProgress = getAllUserProgress()
    const stats: UserStats[] = []

    // Demo user data for display
    const demoUsers = [
      { id: "user-1", name: "John Smith" },
      { id: "user-2", name: "Sarah Johnson" },
      { id: "admin-1", name: "Admin User" },
    ]

    demoUsers.forEach((demoUser) => {
      const userCompletions = allProgress[demoUser.id] || []

      if (userCompletions.length > 0) {
        const lastCompletion = userCompletions[userCompletions.length - 1]
        const totalDays = 24 // 2 phases × 3 weeks × 4 days
        const expectedCompletions = totalDays * 20 // ~20 exercises per day

        stats.push({
          userId: demoUser.id,
          userName: demoUser.name,
          totalCompletions: userCompletions.length,
          lastActivity: lastCompletion.completedAt,
          currentPhase: lastCompletion.phase,
          currentWeek: lastCompletion.week,
          currentDay: lastCompletion.day,
          completionRate: Math.round((userCompletions.length / expectedCompletions) * 100),
        })
      } else {
        stats.push({
          userId: demoUser.id,
          userName: demoUser.name,
          totalCompletions: 0,
          lastActivity: "Never",
          currentPhase: 1,
          currentWeek: 1,
          currentDay: 1,
          completionRate: 0,
        })
      }
    })

    setUserStats(stats)
  }, [user, router, getAllUserProgress])

  const exportData = () => {
    const allProgress = getAllUserProgress()
    const csvData = []

    // CSV headers
    csvData.push(["User ID", "User Name", "Phase", "Week", "Day", "Exercise", "Section", "Completed At"])

    // Add data rows
    Object.entries(allProgress).forEach(([userId, completions]) => {
      const user = userStats.find((u) => u.userId === userId)
      completions.forEach((completion) => {
        csvData.push([
          userId,
          user?.userName || "Unknown",
          completion.phase,
          completion.week,
          completion.day,
          completion.exerciseName,
          completion.section,
          new Date(completion.completedAt).toLocaleString(),
        ])
      })
    })

    // Create and download CSV
    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `workout-progress-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.lightGray }}>
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6" style={{ backgroundColor: colors.primary, color: colors.white }}>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Admin Dashboard - Progress Report
            </CardTitle>
            <p className="opacity-90">Anna Maria Ice Hockey Summer Workout Program</p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6 text-center">
              <User className="w-8 h-8 mx-auto mb-2" style={{ color: colors.primary }} />
              <h3 className="text-2xl font-bold">{userStats.length}</h3>
              <p className="text-gray-600">Total Users</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 mx-auto mb-2" style={{ color: colors.primary }} />
              <h3 className="text-2xl font-bold">{userStats.reduce((sum, user) => sum + user.totalCompletions, 0)}</h3>
              <p className="text-gray-600">Total Completions</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2" style={{ color: colors.primary }} />
              <h3 className="text-2xl font-bold">
                {Math.round(userStats.reduce((sum, user) => sum + user.completionRate, 0) / userStats.length) || 0}%
              </h3>
              <p className="text-gray-600">Avg Completion Rate</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>User Progress Details</CardTitle>
            <Button onClick={exportData} style={{ backgroundColor: colors.secondary }}>
              Export CSV
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">User</th>
                    <th className="text-left p-2">Current Progress</th>
                    <th className="text-left p-2">Completions</th>
                    <th className="text-left p-2">Completion Rate</th>
                    <th className="text-left p-2">Last Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {userStats.map((user) => (
                    <tr key={user.userId} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{user.userName}</div>
                          <div className="text-sm text-gray-500">{user.userId}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-sm">
                          Phase {user.currentPhase}, Week {user.currentWeek}, Day {user.currentDay}
                        </div>
                      </td>
                      <td className="p-2">
                        <span className="font-medium">{user.totalCompletions}</span>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                backgroundColor: colors.primary,
                                width: `${Math.min(user.completionRate, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm">{user.completionRate}%</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-sm">
                          {user.lastActivity === "Never" ? "Never" : new Date(user.lastActivity).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
