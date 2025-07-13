"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useProgress } from "@/hooks/use-progress"
import { useRouter } from "next/navigation"
import { CheckCircle, Circle, LogOut, Settings } from "lucide-react"

const colors = {
  primary: "#8B1538",
  secondary: "#6C757D",
  white: "#FFFFFF",
  lightGray: "#F5F5F5",
  darkGray: "#333333",
  lightMaroon: "#A64B6B",
}

// Sample workout data structure
const workoutData = {
  1: {
    // Phase 1
    1: {
      // Week 1
      1: {
        // Day 1
        mobility: [
          { id: "mob-1-1-1-1", name: "Ankle Circles", description: "10 each direction" },
          { id: "mob-1-1-1-2", name: "Leg Swings", description: "10 forward/back, 10 side to side" },
          { id: "mob-1-1-1-3", name: "Hip Circles", description: "10 each direction" },
        ],
        dynamic: [
          { id: "dyn-1-1-1-1", name: "High Knees", description: "20 steps" },
          { id: "dyn-1-1-1-2", name: "Butt Kicks", description: "20 steps" },
          { id: "dyn-1-1-1-3", name: "Leg Swings", description: "10 each leg" },
        ],
        warmup: [
          { id: "warm-1-1-1-1", name: "Light Jog", description: "5 minutes" },
          { id: "warm-1-1-1-2", name: "Dynamic Stretching", description: "5 minutes" },
        ],
        exercises: [
          { id: "ex-1-1-1-1", name: "Squats", description: "3 sets of 15" },
          { id: "ex-1-1-1-2", name: "Push-ups", description: "3 sets of 10" },
          { id: "ex-1-1-1-3", name: "Lunges", description: "3 sets of 12 each leg" },
          { id: "ex-1-1-1-4", name: "Plank", description: "3 sets of 30 seconds" },
          { id: "ex-1-1-1-5", name: "Burpees", description: "3 sets of 8" },
        ],
      },
      2: {
        // Day 2
        mobility: [
          { id: "mob-1-1-2-1", name: "Shoulder Rolls", description: "10 forward, 10 backward" },
          { id: "mob-1-1-2-2", name: "Arm Circles", description: "10 small, 10 large each direction" },
          { id: "mob-1-1-2-3", name: "Torso Twists", description: "10 each side" },
        ],
        dynamic: [
          { id: "dyn-1-1-2-1", name: "Jumping Jacks", description: "20 reps" },
          { id: "dyn-1-1-2-2", name: "Mountain Climbers", description: "20 reps" },
          { id: "dyn-1-1-2-3", name: "High Knees", description: "20 steps" },
        ],
        warmup: [
          { id: "warm-1-1-2-1", name: "Bike Ride", description: "10 minutes easy pace" },
          { id: "warm-1-1-2-2", name: "Dynamic Stretching", description: "5 minutes" },
        ],
        exercises: [
          { id: "ex-1-1-2-1", name: "Deadlifts", description: "3 sets of 12" },
          { id: "ex-1-1-2-2", name: "Pull-ups", description: "3 sets of 8" },
          { id: "ex-1-1-2-3", name: "Step-ups", description: "3 sets of 10 each leg" },
          { id: "ex-1-1-2-4", name: "Russian Twists", description: "3 sets of 20" },
          { id: "ex-1-1-2-5", name: "Wall Sit", description: "3 sets of 45 seconds" },
        ],
      },
    },
  },
  2: {
    // Phase 2
    1: {
      // Week 1
      1: {
        // Day 1
        mobility: [
          { id: "mob-2-1-1-1", name: "Advanced Ankle Mobility", description: "15 each direction" },
          { id: "mob-2-1-1-2", name: "Hip Flexor Stretch", description: "30 seconds each side" },
          { id: "mob-2-1-1-3", name: "Thoracic Spine Rotation", description: "10 each side" },
        ],
        dynamic: [
          { id: "dyn-2-1-1-1", name: "Sprint Intervals", description: "5 x 30 seconds" },
          { id: "dyn-2-1-1-2", name: "Lateral Shuffles", description: "20 steps each direction" },
          { id: "dyn-2-1-1-3", name: "Carioca", description: "20 steps each direction" },
        ],
        warmup: [
          { id: "warm-2-1-1-1", name: "Intense Warm-up", description: "10 minutes" },
          { id: "warm-2-1-1-2", name: "Sport-specific Movements", description: "5 minutes" },
        ],
        exercises: [
          { id: "ex-2-1-1-1", name: "Jump Squats", description: "4 sets of 12" },
          { id: "ex-2-1-1-2", name: "Explosive Push-ups", description: "4 sets of 8" },
          { id: "ex-2-1-1-3", name: "Single-leg Deadlifts", description: "4 sets of 10 each leg" },
          { id: "ex-2-1-1-4", name: "Plank to Push-up", description: "4 sets of 10" },
          { id: "ex-2-1-1-5", name: "Box Jumps", description: "4 sets of 8" },
        ],
      },
    },
  },
}

export default function HomePage() {
  const { user, logout } = useAuth()
  const { markExerciseComplete, isExerciseComplete, getDayProgress } = useProgress()
  const router = useRouter()
  const [selectedPhase, setSelectedPhase] = useState(1)
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [selectedDay, setSelectedDay] = useState(1)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const currentWorkout = workoutData[selectedPhase]?.[selectedWeek]?.[selectedDay]
  const progress = getDayProgress(selectedPhase, selectedWeek, selectedDay)

  const handleExerciseComplete = (
    exerciseId: string,
    exerciseName: string,
    section: "mobility" | "dynamic" | "warmup" | "exercises",
  ) => {
    markExerciseComplete(selectedPhase, selectedWeek, selectedDay, exerciseId, exerciseName, section)
  }

  const renderExerciseSection = (
    title: string,
    exercises: any[],
    section: "mobility" | "dynamic" | "warmup" | "exercises",
  ) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg" style={{ color: colors.primary }}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {exercises.map((exercise) => {
            const isComplete = isExerciseComplete(selectedPhase, selectedWeek, selectedDay, exercise.id)
            return (
              <div
                key={exercise.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  isComplete ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
                }`}
              >
                <div className={`flex-1 ${isComplete ? "line-through text-gray-500" : ""}`}>
                  <h4 className="font-medium">{exercise.name}</h4>
                  <p className="text-sm text-gray-600">{exercise.description}</p>
                </div>
                <Button
                  size="sm"
                  variant={isComplete ? "default" : "outline"}
                  onClick={() => handleExerciseComplete(exercise.id, exercise.name, section)}
                  disabled={isComplete}
                  className={isComplete ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {isComplete ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.lightGray }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6" style={{ backgroundColor: colors.primary, color: colors.white }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Anna Maria Ice Hockey Summer Workout</CardTitle>
                <p className="opacity-90">Welcome back, {user.name}!</p>
              </div>
              <div className="flex items-center gap-2">
                {user.role === "admin" && (
                  <Button
                    onClick={() => router.push("/admin")}
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-gray-900"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                )}
                <Button
                  onClick={logout}
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-gray-900 bg-transparent"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Progress Overview */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Today's Progress</h3>
              <div className="text-sm text-gray-600">
                {progress.completed} of {progress.total} exercises completed ({progress.percentage}%)
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: colors.primary,
                  width: `${progress.percentage}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Workout Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Workout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phase</label>
                <select
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(Number(e.target.value))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value={1}>Phase 1</option>
                  <option value={2}>Phase 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Week</label>
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(Number(e.target.value))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value={1}>Week 1</option>
                  <option value={2}>Week 2</option>
                  <option value={3}>Week 3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Day</label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(Number(e.target.value))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value={1}>Day 1</option>
                  <option value={2}>Day 2</option>
                  <option value={3}>Day 3</option>
                  <option value={4}>Day 4</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workout Content */}
        {currentWorkout ? (
          <div>
            {renderExerciseSection("Mobility", currentWorkout.mobility, "mobility")}
            {renderExerciseSection("Dynamic Warm-up", currentWorkout.dynamic, "dynamic")}
            {renderExerciseSection("Warm-up", currentWorkout.warmup, "warmup")}
            {renderExerciseSection("Main Exercises", currentWorkout.exercises, "exercises")}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">No workout data available for the selected phase, week, and day.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
