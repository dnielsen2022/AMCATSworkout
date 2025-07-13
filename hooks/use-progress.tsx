"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface ExerciseCompletion {
  exerciseId: string
  exerciseName: string
  section: "mobility" | "dynamic" | "warmup" | "exercises"
  completedAt: string
  phase: number
  week: number
  day: number
}

interface ProgressContextType {
  markExerciseComplete: (
    phase: number,
    week: number,
    day: number,
    exerciseId: string,
    exerciseName: string,
    section: "mobility" | "dynamic" | "warmup" | "exercises",
  ) => void
  isExerciseComplete: (phase: number, week: number, day: number, exerciseId: string) => boolean
  getDayProgress: (phase: number, week: number, day: number) => { completed: number; total: number; percentage: number }
  getUserProgress: (userId: string) => ExerciseCompletion[]
  getAllUsersProgress: () => { [userId: string]: ExerciseCompletion[] }
  deleteUserProgress: (userId: string) => void
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completions, setCompletions] = useState<ExerciseCompletion[]>([])

  // Get current user ID from localStorage
  const getCurrentUserId = () => {
    const storedUser = localStorage.getItem("amcats_user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      return user.id
    }
    return null
  }

  useEffect(() => {
    // Load completions for current user
    const userId = getCurrentUserId()
    if (userId) {
      const stored = localStorage.getItem(`amcats_progress_${userId}`)
      if (stored) {
        setCompletions(JSON.parse(stored))
      }
    }
  }, [])

  const saveCompletions = (userId: string, newCompletions: ExerciseCompletion[]) => {
    localStorage.setItem(`amcats_progress_${userId}`, JSON.stringify(newCompletions))

    // If it's the current user, update state
    const currentUserId = getCurrentUserId()
    if (userId === currentUserId) {
      setCompletions(newCompletions)
    }
  }

  const markExerciseComplete = (
    phase: number,
    week: number,
    day: number,
    exerciseId: string,
    exerciseName: string,
    section: "mobility" | "dynamic" | "warmup" | "exercises",
  ) => {
    const userId = getCurrentUserId()
    if (!userId) return

    const newCompletion: ExerciseCompletion = {
      exerciseId,
      exerciseName,
      section,
      completedAt: new Date().toISOString(),
      phase,
      week,
      day,
    }

    const userCompletions = getUserProgress(userId)
    const existingIndex = userCompletions.findIndex(
      (c) => c.phase === phase && c.week === week && c.day === day && c.exerciseId === exerciseId,
    )

    let updatedCompletions
    if (existingIndex >= 0) {
      // Update existing completion
      updatedCompletions = [...userCompletions]
      updatedCompletions[existingIndex] = newCompletion
    } else {
      // Add new completion
      updatedCompletions = [...userCompletions, newCompletion]
    }

    saveCompletions(userId, updatedCompletions)
  }

  const isExerciseComplete = (phase: number, week: number, day: number, exerciseId: string): boolean => {
    const userId = getCurrentUserId()
    if (!userId) return false

    const userCompletions = getUserProgress(userId)
    return userCompletions.some(
      (c) => c.phase === phase && c.week === week && c.day === day && c.exerciseId === exerciseId,
    )
  }

  const getDayProgress = (phase: number, week: number, day: number) => {
    // This is a simplified calculation - in a real app, you'd have the actual exercise counts
    // For now, we'll estimate based on typical workout structure
    const estimatedTotals = {
      mobility: 7,
      dynamic: 5,
      warmup: 2,
      exercises: 8,
    }
    const totalExercises = Object.values(estimatedTotals).reduce((sum, count) => sum + count, 0)

    const userId = getCurrentUserId()
    if (!userId) return { completed: 0, total: totalExercises, percentage: 0 }

    const userCompletions = getUserProgress(userId)
    const dayCompletions = userCompletions.filter((c) => c.phase === phase && c.week === week && c.day === day)

    const completed = dayCompletions.length
    const percentage = totalExercises > 0 ? Math.round((completed / totalExercises) * 100) : 0

    return { completed, total: totalExercises, percentage }
  }

  const getUserProgress = (userId: string): ExerciseCompletion[] => {
    const stored = localStorage.getItem(`amcats_progress_${userId}`)
    return stored ? JSON.parse(stored) : []
  }

  const getAllUsersProgress = (): { [userId: string]: ExerciseCompletion[] } => {
    const allProgress: { [userId: string]: ExerciseCompletion[] } = {}

    // Get all users from demo data
    const demoUsers = [
      { id: "1", email: "admin@amcats.com", name: "Coach Admin", role: "admin" },
      { id: "2", email: "player1@amcats.com", name: "Player One", role: "user" },
      { id: "3", email: "player2@amcats.com", name: "Player Two", role: "user" },
      { id: "4", email: "player3@amcats.com", name: "Player Three", role: "user" },
    ]

    demoUsers.forEach((user) => {
      allProgress[user.id] = getUserProgress(user.id)
    })

    return allProgress
  }

  const deleteUserProgress = (userId: string) => {
    localStorage.removeItem(`amcats_progress_${userId}`)
  }

  return (
    <ProgressContext.Provider
      value={{
        markExerciseComplete,
        isExerciseComplete,
        getDayProgress,
        getUserProgress,
        getAllUsersProgress,
        deleteUserProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider")
  }
  return context
}
