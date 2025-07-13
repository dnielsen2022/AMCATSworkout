"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useProgress } from "@/hooks/use-progress"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, Eye, Trash2, Filter, X } from "lucide-react"

const colors = {
  primary: "#8B1538",
  secondary: "#6C757D",
  white: "#FFFFFF",
  lightGray: "#F5F5F5",
  darkGray: "#333333",
  lightMaroon: "#A64B6B",
}

// Demo users for admin view
const demoUsers = [
  { id: "1", email: "admin@amcats.com", name: "Coach Admin", role: "admin" },
  { id: "2", email: "player1@amcats.com", name: "Player One", role: "user" },
  { id: "3", email: "player2@amcats.com", name: "Player Two", role: "user" },
  { id: "4", email: "player3@amcats.com", name: "Player Three", role: "user" },
]

interface ExerciseCompletion {
  exerciseId: string
  exerciseName: string
  section: "mobility" | "dynamic" | "warmup" | "exercises"
  completedAt: string
  phase: number
  week: number
  day: number
}

export default function AdminPage() {
  const { user, logout, deleteUser } = useAuth()
  const { getAllUsersProgress, deleteUserProgress } = useProgress()
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    phase: "",
    week: "",
    day: "",
    section: "",
    dateFrom: "",
    dateTo: "",
  })

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login")
    }
  }, [user, router])

  if (!user || user.role !== "admin") {
    return null
  }

  const allProgress = getAllUsersProgress()

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId)
    deleteUserProgress(userId)
    setShowDeleteConfirm(null)
  }

  const exportToCSV = () => {
    const csvData = []
    csvData.push(["User", "Exercise", "Section", "Phase", "Week", "Day", "Completed At"])

    Object.entries(allProgress).forEach(([userId, completions]) => {
      const userName = demoUsers.find((u) => u.id === userId)?.name || "Unknown"
      completions.forEach((completion) => {
        csvData.push([
          userName,
          completion.exerciseName,
          completion.section,
          completion.phase.toString(),
          completion.week.toString(),
          completion.day.toString(),
          new Date(completion.completedAt).toLocaleString(),
        ])
      })
    })

    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "workout_progress_report.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getFilteredCompletions = (completions: ExerciseCompletion[]) => {
    return completions.filter((completion) => {
      if (filters.phase && completion.phase.toString() !== filters.phase) return false
      if (filters.week && completion.week.toString() !== filters.week) return false
      if (filters.day && completion.day.toString() !== filters.day) return false
      if (filters.section && completion.section !== filters.section) return false
      if (filters.dateFrom && new Date(completion.completedAt) < new Date(filters.dateFrom)) return false
      if (filters.dateTo && new Date(completion.completedAt) > new Date(filters.dateTo + "T23:59:59")) return false
      return true
    })
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
  }

  const getSectionColor = (section: string) => {
    switch (section) {
      case "mobility":
        return "bg-blue-100 text-blue-800"
      case "dynamic":
        return "bg-green-100 text-green-800"
      case "warmup":
        return "bg-yellow-100 text-yellow-800"
      case "exercises":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (selectedUser) {
    const userCompletions = allProgress[selectedUser] || []
    const filteredCompletions = getFilteredCompletions(userCompletions)
    const userName = demoUsers.find((u) => u.id === selectedUser)?.name || "Unknown User"

    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: colors.lightGray }}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <Card className="mb-6" style={{ backgroundColor: colors.primary, color: colors.white }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => setSelectedUser(null)}
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-gray-900"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  <div>
                    <CardTitle className="text-2xl">User Exercise History</CardTitle>
                    <p className="opacity-90">{userName}</p>
                  </div>
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

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
                <Button onClick={clearFilters} variant="outline" size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phase</label>
                  <select
                    value={filters.phase}
                    onChange={(e) => setFilters((prev) => ({ ...prev, phase: e.target.value }))}
                    className="w-full p-2 border rounded-md text-sm"
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
                    onChange={(e) => setFilters((prev) => ({ ...prev, week: e.target.value }))}
                    className="w-full p-2 border rounded-md text-sm"
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
                    onChange={(e) => setFilters((prev) => ({ ...prev, day: e.target.value }))}
                    className="w-full p-2 border rounded-md text-sm"
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
                    onChange={(e) => setFilters((prev) => ({ ...prev, section: e.target.value }))}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    <option value="">All Sections</option>
                    <option value="mobility">Mobility</option>
                    <option value="dynamic">Dynamic</option>
                    <option value="warmup">Warm-up</option>
                    <option value="exercises">Exercises</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">From Date</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                    className="w-full p-2 border rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">To Date</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
                    className="w-full p-2 border rounded-md text-sm"
                  />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredCompletions.length} of {userCompletions.length} exercise completions
              </div>
            </CardContent>
          </Card>

          {/* Exercise History */}
          <Card>
            <CardHeader>
              <CardTitle>Exercise Completions</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredCompletions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No exercise completions found for the selected filters.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Exercise</th>
                        <th className="text-left p-3 font-medium">Section</th>
                        <th className="text-left p-3 font-medium">Phase</th>
                        <th className="text-left p-3 font-medium">Week</th>
                        <th className="text-left p-3 font-medium">Day</th>
                        <th className="text-left p-3 font-medium">Completed At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCompletions
                        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                        .map((completion, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{completion.exerciseName}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getSectionColor(completion.section)}`}
                              >
                                {completion.section}
                              </span>
                            </td>
                            <td className="p-3">{completion.phase}</td>
                            <td className="p-3">{completion.week}</td>
                            <td className="p-3">{completion.day}</td>
                            <td className="p-3 text-sm text-gray-600">
                              {new Date(completion.completedAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.lightGray }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-6" style={{ backgroundColor: colors.primary, color: colors.white }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
                <p className="opacity-90">Workout Progress Report</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={exportToCSV}
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-gray-900 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Main
                </Button>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-gray-900 bg-transparent"
                >
                  Logout
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* User Progress Cards */}
        <div className="grid gap-6">
          {demoUsers
            .filter((u) => u.role === "user")
            .map((user) => {
              const userCompletions = allProgress[user.id] || []
              const totalCompletions = userCompletions.length
              const recentCompletions = userCompletions
                .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                .slice(0, 5)

              // Calculate completion rate by day
              const completionsByDay = userCompletions.reduce(
                (acc, completion) => {
                  const dayKey = `${completion.phase}-${completion.week}-${completion.day}`
                  acc[dayKey] = (acc[dayKey] || 0) + 1
                  return acc
                },
                {} as Record<string, number>,
              )

              const uniqueDays = Object.keys(completionsByDay).length
              const avgCompletionsPerDay = uniqueDays > 0 ? Math.round(totalCompletions / uniqueDays) : 0

              return (
                <Card key={user.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setSelectedUser(user.id)}
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View History
                        </Button>
                        <Button
                          onClick={() => setShowDeleteConfirm(user.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{totalCompletions}</div>
                        <div className="text-sm text-blue-600">Total Exercises</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{uniqueDays}</div>
                        <div className="text-sm text-green-600">Active Days</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{avgCompletionsPerDay}</div>
                        <div className="text-sm text-purple-600">Avg per Day</div>
                      </div>
                    </div>

                    {recentCompletions.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Recent Activity</h4>
                        <div className="space-y-2">
                          {recentCompletions.map((completion, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                            >
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded text-xs ${getSectionColor(completion.section)}`}>
                                  {completion.section}
                                </span>
                                <span className="font-medium">{completion.exerciseName}</span>
                              </div>
                              <div className="text-gray-500 text-xs">
                                P{completion.phase}W{completion.week}D{completion.day} •{" "}
                                {new Date(completion.completedAt).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {totalCompletions === 0 && (
                      <div className="text-center py-4 text-gray-500">No exercise completions yet</div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="text-red-600">Delete User</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Are you sure you want to delete {demoUsers.find((u) => u.id === showDeleteConfirm)?.name}? This will
                  permanently remove their account and all progress data.
                </p>
                <div className="flex gap-2 justify-end">
                  <Button onClick={() => setShowDeleteConfirm(null)} variant="outline">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleDeleteUser(showDeleteConfirm)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete User
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
