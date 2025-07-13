"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./use-auth"

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

interface ProgressContextType {
  completions: ExerciseCompletion[]
  markExerciseComplete: (
    phase: number,
    week: number,
    day: number,
    exerciseId: string,
    exerciseName: string,
    section: "mobility" | "dynamic" | "warmup" | "exercises",
  ) => void
  isExerciseComplete: (phase: number, week: number, day: number, exerciseId: string) => boolean
  getDayProgress: (
    phase: number,
    week: number,
    day: number,
  ) => {
    completed: number
    total: number
    percentage: number
  }
  getAllUserProgress: () => { [userId: string]: ExerciseCompletion[] }
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [completions, setCompletions] = useState<ExerciseCompletion[]>([])

  useEffect(() => {
    // Load completions from localStorage
    const stored = localStorage.getItem("workout-completions")
    if (stored) {
      const allCompletions = JSON.parse(stored)
      if (user) {
        setCompletions(allCompletions.filter((c: ExerciseCompletion) => c.userId === user.id))
      }
    }
  }, [user])

  const markExerciseComplete = (
    phase: number,
    week: number,
    day: number,
    exerciseId: string,
    exerciseName: string,
    section: "mobility" | "dynamic" | "warmup" | "exercises",
  ) => {
    if (!user) return

    const completion: ExerciseCompletion = {
      id: `${user.id}-${phase}-${week}-${day}-${exerciseId}-${Date.now()}`,
      userId: user.id,
      phase,
      week,
      day,
      exerciseId,
      exerciseName,
      completedAt: new Date().toISOString(),
      section,
    }

    // Update local state
    setCompletions((prev) => [...prev, completion])

    // Update localStorage with all completions
    const stored = localStorage.getItem("workout-completions")
    const allCompletions = stored ? JSON.parse(stored) : []
    allCompletions.push(completion)
    localStorage.setItem("workout-completions", JSON.stringify(allCompletions))
  }

  const isExerciseComplete = (phase: number, week: number, day: number, exerciseId: string) => {
    return completions.some((c) => c.phase === phase && c.week === week && c.day === day && c.exerciseId === exerciseId)
  }

  const getDayProgress = (phase: number, week: number, day: number) => {
    // This would need to be updated based on your actual exercise data structure
    // For now, we'll estimate based on typical workout structure
    const totalExercises = 20 // Approximate total exercises per day
    const completed = completions.filter((c) => c.phase === phase && c.week === week && c.day === day).length

    return {
      completed,
      total: totalExercises,
      percentage: Math.round((completed / totalExercises) * 100),
    }
  }

  const getAllUserProgress = () => {
    const stored = localStorage.getItem("workout-completions")
    if (!stored) return {}

    const allCompletions: ExerciseCompletion[] = JSON.parse(stored)
    const userProgress: { [userId: string]: ExerciseCompletion[] } = {}

    allCompletions.forEach((completion) => {
      if (!userProgress[completion.userId]) {
        userProgress[completion.userId] = []
      }
      userProgress[completion.userId].push(completion)
    })

    return userProgress
  }

  return (
    <ProgressContext.Provider
      value={{
        completions,
        markExerciseComplete,
        isExerciseComplete,
        getDayProgress,
        getAllUserProgress,
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
