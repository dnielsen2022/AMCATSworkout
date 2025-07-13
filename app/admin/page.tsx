"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useProgress } from "@/hooks/use-progress"
import { useRouter } from "next/navigation"
import { Calendar, User, TrendingUp, Award, Trash2, Eye, ArrowLeft, Filter, X } from "lucide-react"

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

interface ExerciseCompletion {
  id: string
  userId: string
  phase: number
  week: number
  day: number
  exerciseId: string
  exerciseName: string
  completedAt: string
  section: "mobility" | "dynamic" | "warmup" | "exercises"
}

export default function AdminPage() {
  const { user, deleteUser, getAllUsers } = useAuth()
  const { getAllUserProgress, deleteUserProgress, getUserProgress } = useProgress()
  const router = useRouter()
  const [userStats, setUserStats] = useState<UserStats[]>([])
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [userHistory, setUserHistory] = useState<ExerciseCompletion[]>([])
  const [filteredHistory, setFilteredHistory] = useState<ExerciseCompletion[]>([])
  const [filters, setFilters] = useState({
    phase: "",
    week: "",
    day: "",
    section: "",
    dateFrom: "",
    dateTo: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "admin") {
      router.push("/")
      return
    }

    calculateUserStats()
  }, [user, router])

  const calculateUserStats = () => {
    const allProgress = getAllUserProgress()
    const allUsers = getAllUsers()
    const stats: UserStats[] = []

    allUsers.forEach((demoUser) => {
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
  }

  const handleDeleteUser = (userId: string, userName: string) => {
    if (
      confirm(`Are you sure you want to delete ${userName} and all their progress data? This action cannot be undone.`)
    ) {
      deleteUserProgress(userId)
      deleteUser(userId)
      calculateUserStats()
    }
  }

  const handleViewUser = (userId: string) => {
    const history = getUserProgress(userId)
    setUserHistory(history)
    setFilteredHistory(history)
    setSelectedUser(userId)
  }

  const applyFilters = () => {
    let filtered = [...userHistory]

    if (filters.phase) {
      filtered = filtered.filter((item) => item.phase === Number.parseInt(filters.phase))
    }
    if (filters.week) {
      filtered = filtered.filter((item) => item.week === Number.parseInt(filters.week))
    }
    if (filters.day) {
      filtered = filtered.filter((item) => item.day === Number.parseInt(filters.day))
    }
    if (filters.section) {
      filtered = filtered.filter((item) => item.section === filters.section)
    }
    if (filters.dateFrom) {
      filtered = filtered.filter((item) => new Date(item.completedAt) >= new Date(filters.dateFrom))
    }
    if (filters.dateTo) {
      filtered = filtered.filter((item) => new Date(item.completedAt) <= new Date(filters.dateTo))
    }

    setFilteredHistory(filtered)
  }

  const clearFilters = () => {
    setFilters({
      phase: "",
      week: "",
      day: "",
      section: "",
      dateFrom: "",
      dateTo: "",
    })
    setFilteredHistory(userHistory)
  }

  useEffect(() => {
    applyFilters()
  }, [filters, userHistory])

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

  if (selectedUser) {
    const selectedUserData = userStats.find((u) => u.userId === selectedUser)

    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: colors.lightGray }}>
        <div className="max-w-6xl mx-auto">
          <Card className="mb-6" style={{ backgroundColor: colors.primary, color: colors.white }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <User className="w-6 h-6" />
                    {selectedUserData?.userName} - Exercise History
                  </CardTitle>
                  <p className="opacity-90">Complete workout completion history</p>
                </div>
                <Button
                  onClick={() => setSelectedUser(null)}
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phase</label>
                  <select
                    value={filters.phase}
                    onChange={(e) => setFilters({ ...filters, phase: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">All Phases</option>
                    <option value="1">Phase 1</option>
                    <option value="2">Phase 2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Week</label>
                  <select
                    value={filters.week}
                    onChange={(e) => setFilters({ ...filters, week: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">All Weeks</option>
                    <option value="1">Week 1</option>
                    <option value="2">Week 2</option>
                    <option value="3">Week 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Day</label>
                  <select
                    value={filters.day}
                    onChange={(e) => setFilters({ ...filters, day: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">All Days</option>
                    <option value="1">Day 1</option>
                    <option value="2">Day 2</option>
                    <option value="3">Day 3</option>
                    <option value="4">Day 4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Section</label>
                  <select
                    value={filters.section}
                    onChange={(e) => setFilters({ ...filters, section: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">All Sections</option>
                    <option value="mobility">Mobility</option>
                    <option value="dynamic">Dynamic</option>
                    <option value="warmup">Warmup</option>
                    <option value="exercises">Exercises</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">From Date</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">To Date</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={clearFilters} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
                <span className="text-sm text-gray-600 flex items-center">
                  Showing {filteredHistory.length} of {userHistory.length} completions
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Exercise History */}
          <Card>
            <CardHeader>
              <CardTitle>Exercise Completions ({filteredHistory.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date & Time</th>
                      <th className="text-left p-2">Phase</th>
                      <th className="text-left p-2">Week</th>
                      <th className="text-left p-2">Day</th>
                      <th className="text-left p-2">Section</th>
                      <th className="text-left p-2">Exercise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory
                      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                      .map((completion) => (
                        <tr key={completion.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <div className="text-sm">{new Date(completion.completedAt).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(completion.completedAt).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="p-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                              Phase {completion.phase}
                            </span>
                          </td>
                          <td className="p-2">Week {completion.week}</td>
                          <td className="p-2">Day {completion.day}</td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                completion.section === "mobility"
                                  ? "bg-green-100 text-green-800"
                                  : completion.section === "dynamic"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : completion.section === "warmup"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {completion.section}
                            </span>
                          </td>
                          <td className="p-2">{completion.exerciseName}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {filteredHistory.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No exercise completions found matching the current filters.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.lightGray }}>
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6" style={{ backgroundColor: colors.primary, color: colors.white }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  Admin Dashboard - Progress Report
                </CardTitle>
                <p className="opacity-90">Anna Maria Ice Hockey Summer Workout Program</p>
              </div>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Main
              </Button>
            </div>
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
                    <th className="text-left p-2">Actions</th>
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
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewUser(user.userId)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {user.userId !== "admin-1" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteUser(user.userId, user.userName)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
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
