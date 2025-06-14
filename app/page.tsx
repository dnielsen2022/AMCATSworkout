"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Clock, Home, FileText, ChevronDown } from "lucide-react"

const colors = {
  primary: "#8B1538", // Anna Maria Maroon
  secondary: "#6C757D", // Anna Maria Grey (replacing gold)
  white: "#FFFFFF",
  lightGray: "#F5F5F5",
  darkGray: "#333333",
  lightMaroon: "#A64B6B", // Lighter maroon for accents
}

interface Exercise {
  exercise: string
  sets?: string
  description?: string
  order?: string
  rpe?: string
  tempo?: string
  week1?: string
  week2?: string
  week3?: string
}

interface WorkoutData {
  mobility: Exercise[]
  dynamic: Exercise[]
  warmup: Exercise[]
  exercises: Exercise[]
}

export default function HockeyWorkoutApp() {
  const [currentPhase, setCurrentPhase] = useState(1)
  const [currentWeek, setCurrentWeek] = useState(1)
  const [currentDay, setCurrentDay] = useState(1)
  const [activeSection, setActiveSection] = useState("overview")
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [targetTime, setTargetTime] = useState(60) // Default 60 seconds
  const [showTimerDropdown, setShowTimerDropdown] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((timer) => {
          if (timer <= 1) {
            setIsRunning(false)
            // Play chime sound when timer reaches 0
            const audio = new Audio(
              "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
            )
            audio.play().catch(() => {}) // Ignore errors if audio fails
            return 0
          }
          return timer - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, timer])

  const startTimer = (seconds?: number) => {
    if (seconds) {
      setTargetTime(seconds)
      setTimer(seconds)
    } else {
      setTimer(targetTime)
    }
    setIsRunning(true)
    setShowTimerDropdown(false)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setTimer(targetTime)
    setIsRunning(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Function to extract time duration from exercise sets/week data
  const getExerciseTime = (exercise: Exercise): number[] => {
    const times: number[] = []

    // Get current week data
    const currentWeekData = currentWeek === 1 ? exercise.week1 : currentWeek === 2 ? exercise.week2 : exercise.week3

    const dataToCheck = currentWeekData || exercise.sets || ""

    // Extract time patterns like "0:30", "0:25", "30", "25", etc.
    const timeMatches = dataToCheck.match(/(\d+):(\d+)|(\d+)(?=\s*(?:sec|s|ea|$))/g)

    if (timeMatches) {
      timeMatches.forEach((match) => {
        if (match.includes(":")) {
          // Format like "0:30"
          const [mins, secs] = match.split(":").map(Number)
          times.push(mins * 60 + secs)
        } else {
          // Format like "30"
          const seconds = Number.parseInt(match)
          if (seconds >= 15 && seconds <= 300) {
            // Reasonable range for exercise timing
            times.push(seconds)
          }
        }
      })
    }

    // Remove duplicates and sort
    return [...new Set(times)].sort((a, b) => a - b)
  }

  // Updated program data with EXACT CSV data for Phase 2
  const allProgramData = {
    phase1: {
      week1: {
        day1: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Bear Crawl Holds",
              sets: "2x30",
              description: "Hold bear crawl position",
            },
            {
              exercise: "Iso Split Squat",
              sets: "2x25 ea",
              description: "Isometric hold in split squat",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "BB Front Squat",
              rpe: "65%-75% of 1RM",
              tempo: "2:1:1",
              week1: "3x10",
              week2: "3x10",
              week3: "3x10",
            },
            {
              order: "1B",
              exercise: "1/2 knee IM 1 arm Press",
              rpe: "55%-65% of 1RM",
              tempo: "1:1:2",
              week1: "3x10 ea",
              week2: "3x10 ea",
              week3: "3x10 ea",
            },
            {
              order: "1C",
              exercise: "Banded Ankle Dorsal Flexion",
              rpe: "RPE 6-7",
              tempo: "1:2:1",
              week1: "3x4 ea",
              week2: "3x5 ea",
              week3: "3x6 ea",
            },
            {
              order: "2A",
              exercise: "Pull ups (Inverted Rows)",
              rpe: "RPE 7-8",
              tempo: "1:1:2",
              week1: "3x6+",
              week2: "3x6+",
              week3: "3x6+",
            },
            {
              order: "2B",
              exercise: "Single Leg Hamstring Bridge",
              rpe: "BW",
              tempo: "1:1:5",
              week1: "3x4 ea",
              week2: "3x5 ea",
              week3: "3x6 ea",
            },
            {
              order: "2C",
              exercise: "Lying Banded Hip Flexion",
              rpe: "RPE 6-7",
              tempo: "1:2:1",
              week1: "3x8 ea",
              week2: "3x10 ea",
              week3: "3x12 ea",
            },
            {
              order: "3A",
              exercise: "KB (or DB) Goblet Split squat",
              rpe: "55%-65% of 1RM",
              tempo: "2:1:1",
              week1: "3x12 ea",
              week2: "3x14 ea",
              week3: "3x16 ea",
            },
            {
              order: "3B",
              exercise: "Single Leg Glute Bridge",
              rpe: "ISO",
              tempo: "Hold",
              week1: "3x0:30 ea",
              week2: "3x0:35 ea",
              week3: "3x0:40 ea",
            },
          ],
        },
        day2: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Dead Bugs",
              sets: "2x10 ea",
              description: "Core stability exercise",
            },
            {
              exercise: "SL Glute Bridge",
              sets: "2x25 ea",
              description: "Single leg glute activation",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "DB Single leg RDL",
              rpe: "65%-75% of 1RM",
              tempo: "2:1:1",
              week1: "3x10",
              week2: "3x10",
              week3: "3x10",
            },
            {
              order: "1B",
              exercise: "Chest supported Row",
              rpe: "55%-65% of 1RM",
              tempo: "1:3:1",
              week1: "3x10 ea",
              week2: "3x10 ea",
              week3: "3x10 ea",
            },
            {
              order: "1C",
              exercise: "Plank",
              rpe: "BW",
              tempo: "Iso",
              week1: "3x0:40 ea",
              week2: "3x0:45 ea",
              week3: "3x0:50 ea",
            },
            {
              order: "2A",
              exercise: "DB Bench Press",
              rpe: "65%-75% of 1RM",
              tempo: "2:1:1",
              week1: "3x10",
              week2: "3x10",
              week3: "3x10",
            },
            {
              order: "2B",
              exercise: "Single Leg Skater Squat",
              rpe: "10%-15% of 1RM",
              tempo: "3:1:1",
              week1: "3x8 ea",
              week2: "3x10 ea",
              week3: "3x12 ea",
            },
            {
              order: "2C",
              exercise: "Cable External Rotation",
              rpe: "60%-70% of 1RM",
              tempo: "Cont",
              week1: "3x10 ea",
              week2: "3x10 ea",
              week3: "3x10 ea",
            },
            {
              order: "3A",
              exercise: "1/2 knee Pallof Press",
              rpe: "RPE 6-7",
              tempo: "1:2:4",
              week1: "3x5 ea",
              week2: "3x5 ea",
              week3: "3x5 ea",
            },
            {
              order: "3B",
              exercise: "Copenhagen Plank",
              rpe: "BW",
              tempo: "Iso",
              week1: "3x0:15 ea",
              week2: "3x0:20 ea",
              week3: "3x0:25 ea",
            },
          ],
        },
        day3: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Bear Crawl Holds",
              sets: "2x30",
              description: "Hold bear crawl position",
            },
            {
              exercise: "Iso Split Squat",
              sets: "2x25 ea",
              description: "Isometric hold in split squat",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "DB RFE Split Squat",
              rpe: "65%-75% of 1RM",
              tempo: "2:1:1",
              week1: "3x10 ea",
              week2: "3x10 ea",
              week3: "3x10 ea",
            },
            {
              order: "1B",
              exercise: "1/2 knee Cable rotation press",
              rpe: "50%-60% of 1RM",
              tempo: "1:1:3",
              week1: "3x6 ea",
              week2: "3x6 ea",
              week3: "3x6 ea",
            },
            {
              order: "1C",
              exercise: "Bear Crawl Hold",
              rpe: "BW",
              tempo: "ISO",
              week1: "3x0:40 ea",
              week2: "3x0:45 ea",
              week3: "3x0:50 ea",
            },
            {
              order: "2A",
              exercise: "1 Arm DB row",
              rpe: "65%-75%",
              tempo: "1:1:2",
              week1: "3x6 ea",
              week2: "3x6 ea",
              week3: "3x6 ea",
            },
            {
              order: "2B",
              exercise: "Slider Leg Curl",
              rpe: "BW",
              tempo: "1:1:4",
              week1: "3x8 ea",
              week2: "3x10 ea",
              week3: "3x12 ea",
            },
            {
              order: "2C",
              exercise: "Side Plank",
              rpe: "BW",
              tempo: "ISO",
              week1: "3x 0:30 ea",
              week2: "3x 0:30 ea",
              week3: "3x 0:30 ea",
            },
            {
              order: "3A",
              exercise: "DB Split squat ISO",
              rpe: "55%-65%",
              tempo: "ISO",
              week1: "3x0:20 ea",
              week2: "3x0:20 ea",
              week3: "3x0:20 ea",
            },
            {
              order: "3B",
              exercise: "Alt Leg Lower",
              rpe: "SLOW BW",
              tempo: "1:1:3",
              week1: "2x6 ea",
              week2: "2x7 ea",
              week3: "2x8 ea",
            },
          ],
        },
        day4: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Dead Bugs",
              sets: "2x12 ea",
              description: "Core stability exercise",
            },
            {
              exercise: "SL Glute Bridge",
              sets: "2x30 ea",
              description: "Single leg glute activation",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "Hex Bar Deadlift",
              rpe: "65%-75% of 1RM",
              tempo: "1:1:3",
              week1: "3x10",
              week2: "3x10",
              week3: "3x10",
            },
            {
              order: "1B",
              exercise: "Cable Hip Flexion",
              rpe: "55%-65% of 1RM",
              tempo: "1:1:2",
              week1: "3x10 ea",
              week2: "3x10 ea",
              week3: "3x10 ea",
            },
            {
              order: "2A",
              exercise: "Barbell Bench",
              rpe: "65%-75% of 1RM",
              tempo: "2:1:1",
              week1: "3x10",
              week2: "3x10",
              week3: "3x10",
            },
            {
              order: "2B",
              exercise: "DB Goblet Lateral Lunge",
              rpe: "55%-65% of 1RM",
              tempo: "1:3:1",
              week1: "3x5 ea",
              week2: "3x5 ea",
              week3: "3x5 ea",
            },
            {
              order: "2C",
              exercise: "1/2 knee Pallof Press",
              rpe: "RPE 6-7",
              tempo: "Cont",
              week1: "3x8 ea",
              week2: "3x8 ea",
              week3: "3x8 ea",
            },
            {
              order: "3A",
              exercise: "Lat pull down",
              rpe: "55%-65% of 1RM",
              tempo: "1:3:1",
              week1: "3x8 ea",
              week2: "3x8 ea",
              week3: "3x8 ea",
            },
            {
              order: "3B",
              exercise: "Glute-Ham Raise",
              rpe: "BW",
              tempo: "3:0:1",
              week1: "3x6",
              week2: "3x7",
              week3: "3x8",
            },
            {
              order: "3C",
              exercise: "Copenhagen Plank",
              rpe: "BW",
              tempo: "ISO",
              week1: "3x0:15 ea",
              week2: "3x0:20 ea",
              week3: "3x0:25 ea",
            },
          ],
        },
      },
      week2: {
        day1: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Bear Crawl Holds",
              sets: "2x35",
              description: "Hold bear crawl position",
            },
            {
              exercise: "Iso Split Squat",
              sets: "2x30 ea",
              description: "Isometric hold in split squat",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "BB Front Squat",
              rpe: "65%-75% of 1RM",
              tempo: "2:1:1",
              week1: "3x10",
              week2: "3x10",
              week3: "3x10",
            },
            {
              order: "1B",
              exercise: "1/2 knee IM 1 arm Press",
              rpe: "55%-65% of 1RM",
              tempo: "1:1:2",
              week1: "3x10 ea",
              week2: "3x10 ea",
              week3: "3x10 ea",
            },
            {
              order: "1C",
              exercise: "Banded Ankle Dorsal Flexion",
              rpe: "RPE 6-7",
              tempo: "1:2:1",
              week1: "3x4 ea",
              week2: "3x5 ea",
              week3: "3x6 ea",
            },
            {
              order: "2A",
              exercise: "Pull ups (Inverted Rows)",
              rpe: "RPE 7-8",
              tempo: "1:1:2",
              week1: "3x6+",
              week2: "3x6+",
              week3: "3x6+",
            },
            {
              order: "2B",
              exercise: "Single Leg Hamstring Bridge",
              rpe: "BW",
              tempo: "1:1:5",
              week1: "3x4 ea",
              week2: "3x5 ea",
              week3: "3x6 ea",
            },
            {
              order: "2C",
              exercise: "Lying Banded Hip Flexion",
              rpe: "RPE 6-7",
              tempo: "1:2:1",
              week1: "3x8 ea",
              week2: "3x10 ea",
              week3: "3x12 ea",
            },
            {
              order: "3A",
              exercise: "KB (or DB) Goblet Split squat",
              rpe: "55%-65% of 1RM",
              tempo: "2:1:1",
              week1: "3x12 ea",
              week2: "3x14 ea",
              week3: "3x16 ea",
            },
            {
              order: "3B",
              exercise: "Single Leg Glute Bridge",
              rpe: "ISO",
              tempo: "Hold",
              week1: "3x0:30 ea",
              week2: "3x0:35 ea",
              week3: "3x0:40 ea",
            },
          ],
        },
        day2: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Dead Bugs",
              sets: "2x12 ea",
              description: "Core stability exercise",
            },
            {
              exercise: "SL Glute Bridge",
              sets: "2x30 ea",
              description: "Single leg glute activation",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "DB Single leg RDL",
              rpe: "65%-75% of 1RM",
              tempo: "2:1:1",
              week1: "3x10",
              week2: "3x10",
              week3: "3x10",
            },
            {
              order: "1B",
              exercise: "Chest supported Row",
              rpe: "55%-65% of 1RM",
              tempo: "1:3:1",
              week1: "3x10 ea",
              week2: "3x10 ea",
              week3: "3x10 ea",
            },
            {
              order: "1C",
              exercise: "Plank",
              rpe: "BW",
              tempo: "Iso",
              week1: "3x0:40 ea",
              week2: "3x0:45 ea",
              week3: "3x0:50 ea",
            },
            {
              order: "2A",
              exercise: "DB Bench Press",
              rpe: "65%-75% of 1RM",
              tempo: "2:1:1",
              week1: "3x10",
              week2: "3x10",
              week3: "3x10",
            },
            {
              order: "2B",
              exercise: "Single Leg Skater Squat",
              rpe: "10%-15% of 1RM",
              tempo: "3:1:1",
              week1: "3x8 ea",
              week2: "3x10 ea",
              week3: "3x12 ea",
            },
            {
              order: "2C",
              exercise: "Cable External Rotation",
              rpe: "60%-70% of 1RM",
              tempo: "Cont",
              week1: "3x10 ea",
              week2: "3x10 ea",
              week3: "3x10 ea",
            },
            {
              order: "3A",
              exercise: "1/2 knee Pallof Press",
              rpe: "RPE 6-7",
              tempo: "1:2:4",
              week1: "3x5 ea",
              week2: "3x5 ea",
              week3: "3x5 ea",
            },
            {
              order: "3B",
              exercise: "Copenhagen Plank",
              rpe: "BW",
              tempo: "Iso",
              week1: "3x0:15 ea",
              week2: "3x0:20 ea",
              week3: "3x0:25 ea",
            },
          ],
        },
        day3: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Bear Crawl Holds",
              sets: "2x35",
              description: "Hold bear crawl position",
            },
            {
              exercise: "Iso Split Squat",
              sets: "2x30 ea",
              description: "Isometric hold in split squat",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "DB RFE Split Squat (Cluster)",
              rpe: "80%-90%",
              tempo: "6:1:1",
              week1: "3x 1.1.1 ea",
              week2: "3x 2.1.1 ea",
              week3: "3x 2.2 ea",
            },
            {
              order: "1B",
              exercise: "1/2 knee Cable rotation press",
              rpe: "60%-70%",
              tempo: "1:1:6",
              week1: "3x4 ea",
              week2: "3x4 ea",
              week3: "3x4 ea",
            },
            {
              order: "1C",
              exercise: "Bear Crawl Hold",
              rpe: "BW",
              tempo: "ISO",
              week1: "3x0:45 ea",
              week2: "3x0:50 ea",
              week3: "3x0:55 ea",
            },
            {
              order: "2A",
              exercise: "1 Arm DB row (Cluster)",
              rpe: "80%-90%",
              tempo: "1:1:6",
              week1: "3x 1.1.1 ea",
              week2: "3x 2.1.1 ea",
              week3: "3x 2.2 ea",
            },
            {
              order: "2B",
              exercise: "Slider Leg Curl",
              rpe: "BW",
              tempo: "1:1:6",
              week1: "3x6 ea",
              week2: "3x7 ea",
              week3: "3x8 ea",
            },
            {
              order: "2C",
              exercise: "Side Plank",
              rpe: "BW",
              tempo: "ISO",
              week1: "3x 0:35 ea",
              week2: "3x 0:35 ea",
              week3: "3x 0:35 ea",
            },
            {
              order: "3A",
              exercise: "DB Split squat ISO",
              rpe: "65%-75%",
              tempo: "ISO",
              week1: "2x0:25 ea",
              week2: "2x0:25 ea",
              week3: "2x0:25 ea",
            },
            {
              order: "3B",
              exercise: "Alt Leg Lower",
              rpe: "SLOW BW",
              tempo: "1:1:6",
              week1: "2x5 ea",
              week2: "2x6 ea",
              week3: "2x7 ea",
            },
          ],
        },
        day4: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Dead Bugs",
              sets: "2x15 ea",
              description: "Core stability exercise",
            },
            {
              exercise: "SL Glute Bridge",
              sets: "2x35 ea",
              description: "Single leg glute activation",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "Hex Bar Deadlift (Cluster)",
              rpe: "80%-90%",
              tempo: "1:1:6",
              week1: "3x 1.1.1",
              week2: "3x 2.1.1",
              week3: "3x 2.2",
            },
            {
              order: "1B",
              exercise: "Cable Hip Flexion",
              rpe: "65%-75%",
              tempo: "1:1:6",
              week1: "3x6 ea",
              week2: "3x6 ea",
              week3: "3x6 ea",
            },
            {
              order: "2A",
              exercise: "Barbell Bench (Cluster)",
              rpe: "80%-90%",
              tempo: "6:1:1",
              week1: "3x 1.1.1",
              week2: "3x 2.1.1",
              week3: "3x 2.2",
            },
            {
              order: "2B",
              exercise: "DB Goblet Lateral Lunge",
              rpe: "65%-75%",
              tempo: "1:6:1",
              week1: "3x3 ea",
              week2: "3x3 ea",
              week3: "3x3 ea",
            },
            {
              order: "2C",
              exercise: "1/2 knee Pallof Press",
              rpe: "RPE 7-8",
              tempo: "Cont",
              week1: "3x6 ea",
              week2: "3x6 ea",
              week3: "3x6 ea",
            },
            {
              order: "3A",
              exercise: "Lat pull down",
              rpe: "65%-75%",
              tempo: "1:6:1",
              week1: "2x6 ea",
              week2: "2x6 ea",
              week3: "2x6 ea",
            },
            {
              order: "3B",
              exercise: "Glute-Ham Raise",
              rpe: "BW",
              tempo: "6:0:1",
              week1: "2x4",
              week2: "2x5",
              week3: "2x6",
            },
            {
              order: "3C",
              exercise: "Copenhagen Plank",
              rpe: "BW",
              tempo: "ISO",
              week1: "2x0:20 ea",
              week2: "2x0:25 ea",
              week3: "2x0:30 ea",
            },
          ],
        },
      },
      week3: {
        day1: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Bear Crawl Holds",
              sets: "2x40",
              description: "Hold bear crawl position",
            },
            {
              exercise: "Iso Split Squat",
              sets: "2x35 ea",
              description: "Isometric hold in split squat",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "Safety Bar Back Squat (Max Effort)",
              rpe: "90%-100%",
              tempo: "2:1:1",
              week1: "5x3",
              week2: "5x3",
              week3: "4x3",
            },
            {
              order: "1B",
              exercise: "Box Jump",
              rpe: "Explosive",
              tempo: "Explosive",
              week1: "5x5",
              week2: "5x5",
              week3: "4x5",
            },
            {
              order: "1C",
              exercise: "1 arm DB row (Max Effort)",
              rpe: "90%-100%",
              tempo: "1:1:2",
              week1: "4x1.1.1 ea",
              week2: "4x1.1.1 ea",
              week3: "4x1.1.1 ea",
            },
            {
              order: "2A",
              exercise: "Glute-Ham Raise (Max Effort)",
              rpe: "BW",
              tempo: "3:0:1",
              week1: "4x1.1.1",
              week2: "4x2.1.1",
              week3: "4x2.2",
            },
            {
              order: "2B",
              exercise: "Standing 1 arm Landmine Press",
              rpe: "85%-95%",
              tempo: "1:1:2",
              week1: "4x4 ea",
              week2: "4x4 ea",
              week3: "4x4 ea",
            },
            {
              order: "2C",
              exercise: "Side Plank with Hip adduction",
              rpe: "BW",
              tempo: "1:1:3",
              week1: "4x4 ea",
              week2: "4x5 ea",
              week3: "4x7 ea",
            },
            {
              order: "3A",
              exercise: "Yoga Ball Roll outs",
              rpe: "BW",
              tempo: "3:0:1",
              week1: "3x8",
              week2: "3x9",
              week3: "3x10",
            },
            {
              order: "3B",
              exercise: "Band pull apart",
              rpe: "RPE 7-8",
              tempo: "1:1:3",
              week1: "3x10",
              week2: "3x11",
              week3: "3x12",
            },
          ],
        },
        day2: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Dead Bugs",
              sets: "2x20 ea",
              description: "Core stability exercise",
            },
            {
              exercise: "SL Glute Bridge",
              sets: "2x40 ea",
              description: "Single leg glute activation",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "DB Single leg RDL (Max Effort)",
              rpe: "90%-100%",
              tempo: "2:1:1",
              week1: "4x1.1.1 ea",
              week2: "4x2.1.1 ea",
              week3: "4x2.2 ea",
            },
            {
              order: "1B",
              exercise: "Med Ball Slam",
              rpe: "Explosive",
              tempo: "Explosive",
              week1: "4x8",
              week2: "4x8",
              week3: "4x8",
            },
            {
              order: "1C",
              exercise: "Chest supported Row (Max Effort)",
              rpe: "90%-100%",
              tempo: "1:3:1",
              week1: "4x1.1.1",
              week2: "4x2.1.1",
              week3: "4x2.2",
            },
            {
              order: "2A",
              exercise: "DB Bench Press (Max Effort)",
              rpe: "90%-100%",
              tempo: "2:1:1",
              week1: "4x1.1.1",
              week2: "4x2.1.1",
              week3: "4x2.2",
            },
            {
              order: "2B",
              exercise: "Single Leg Skater Squat",
              rpe: "30%-40%",
              tempo: "3:1:1",
              week1: "4x4 ea",
              week2: "4x5 ea",
              week3: "4x6 ea",
            },
            {
              order: "2C",
              exercise: "Cable External Rotation",
              rpe: "85%-95%",
              tempo: "Cont",
              week1: "4x5 ea",
              week2: "4x5 ea",
              week3: "4x5 ea",
            },
            {
              order: "3A",
              exercise: "1/2 knee Pallof Press",
              rpe: "RPE 8-9",
              tempo: "1:2:4",
              week1: "3x4 ea",
              week2: "3x5 ea",
              week3: "3x6 ea",
            },
            {
              order: "3B",
              exercise: "IYT shoulder exercise",
              rpe: "RPE 7-9",
              tempo: "1:3:1",
              week1: "3x8 ea",
              week2: "3x9 ea",
              week3: "3x10 ea",
            },
          ],
        },
        day3: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Bear Crawl Holds",
              sets: "2x45",
              description: "Hold bear crawl position",
            },
            {
              exercise: "Iso Split Squat",
              sets: "2x40 ea",
              description: "Isometric hold in split squat",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "DB RFE Split Squat (Max Effort)",
              rpe: "90%-100%",
              tempo: "2:1:1",
              week1: "4x1.1.1 ea",
              week2: "4x2.1.1 ea",
              week3: "4x2.2 ea",
            },
            {
              order: "1B",
              exercise: "1/2 knee Cable rotation press",
              rpe: "80%-90%",
              tempo: "1:1:3",
              week1: "4x5 ea",
              week2: "4x5 ea",
              week3: "4x5 ea",
            },
            {
              order: "1C",
              exercise: "Bear Crawl Hold",
              rpe: "BW",
              tempo: "ISO",
              week1: "4x0:50 ea",
              week2: "4x0:55 ea",
              week3: "4x1:00 ea",
            },
            {
              order: "2A",
              exercise: "1 Arm DB row (Max Effort)",
              rpe: "90%-100%",
              tempo: "1:1:2",
              week1: "4x1.1.1 ea",
              week2: "4x2.1.1 ea",
              week3: "4x2.2 ea",
            },
            {
              order: "2B",
              exercise: "Slider Leg Curl",
              rpe: "BW",
              tempo: "1:1:4",
              week1: "4x6 ea",
              week2: "4x7 ea",
              week3: "4x8 ea",
            },
            {
              order: "2C",
              exercise: "Side Plank",
              rpe: "BW",
              tempo: "ISO",
              week1: "4x0:40 ea",
              week2: "4x0:40 ea",
              week3: "4x0:40 ea",
            },
            {
              order: "3A",
              exercise: "DB Split squat ISO",
              rpe: "80%-90%",
              tempo: "ISO",
              week1: "3x0:30 ea",
              week2: "3x0:30 ea",
              week3: "3x0:30 ea",
            },
            {
              order: "3B",
              exercise: "Alt Leg Lower",
              rpe: "SLOW BW",
              tempo: "1:1:3",
              week1: "3x5 ea",
              week2: "3x6 ea",
              week3: "3x7 ea",
            },
          ],
        },
        day4: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Dead Bugs",
              sets: "2x15 ea",
              description: "Core stability exercise",
            },
            {
              exercise: "SL Glute Bridge",
              sets: "2x35 ea",
              description: "Single leg glute activation",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "Hex Bar Deadlift (Max Effort)",
              rpe: "90%-100%",
              tempo: "1:1:3",
              week1: "4x1.1.1",
              week2: "4x2.1.1",
              week3: "4x2.2",
            },
            {
              order: "1B",
              exercise: "Cable Hip Flexion",
              rpe: "80%-90%",
              tempo: "1:1:2",
              week1: "4x5 ea",
              week2: "4x5 ea",
              week3: "4x5 ea",
            },
            {
              order: "2A",
              exercise: "Barbell Bench (Max Effort)",
              rpe: "90%-100%",
              tempo: "2:1:1",
              week1: "4x1.1.1",
              week2: "4x2.1.1",
              week3: "4x2.2",
            },
            {
              order: "2B",
              exercise: "DB Goblet Lateral Lunge",
              rpe: "80%-90%",
              tempo: "1:3:1",
              week1: "4x3 ea",
              week2: "4x3 ea",
              week3: "4x3 ea",
            },
            {
              order: "2C",
              exercise: "1/2 knee Pallof Press",
              rpe: "RPE 8-9",
              tempo: "Cont",
              week1: "4x6 ea",
              week2: "4x6 ea",
              week3: "4x6 ea",
            },
            {
              order: "3A",
              exercise: "Lat pull down",
              rpe: "80%-90%",
              tempo: "1:3:1",
              week1: "3x6 ea",
              week2: "3x6 ea",
              week3: "3x6 ea",
            },
            {
              order: "3B",
              exercise: "Glute-Ham Raise",
              rpe: "BW",
              tempo: "3:0:1",
              week1: "3x5",
              week2: "3x6",
              week3: "3x7",
            },
            {
              order: "3C",
              exercise: "Copenhagen Plank",
              rpe: "BW",
              tempo: "ISO",
              week1: "3x0:25 ea",
              week2: "3x0:30 ea",
              week3: "3x0:35 ea",
            },
          ],
        },
      },
    },
    phase2: {
      week1: {
        day1: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Bear Crawl Holds",
              sets: "2x30",
              description: "Hold bear crawl position",
            },
            {
              exercise: "Iso Split Squat",
              sets: "2x25 ea",
              description: "Isometric hold in split squat",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "Safety Bar Reverse Lunge (or DB)",
              rpe: "80%-100% of 1RM",
              tempo: "6:1:1",
              week1: "4x2",
              week2: "4x2",
              week3: "3x2",
            },
            {
              order: "1B",
              exercise: "Trap Bar Vert Jump",
              rpe: "",
              tempo: "Exp",
              week1: "4x4 ea",
              week2: "4x4 ea",
              week3: "3x4 ea",
            },
            {
              order: "1C",
              exercise: "1 Arm DB Row (Cluster)",
              rpe: "85%-95% of 1RM",
              tempo: "1:1:6",
              week1: "3x 1:1:1",
              week2: "3x 1:1:1",
              week3: "3x 1:1:1",
            },
            {
              order: "2A",
              exercise: "Glute Ham Raise (Cluster)",
              rpe: "BW",
              tempo: "6:0:1",
              week1: "3x 1:1:1",
              week2: "3x 1:1:1",
              week3: "3x 1:1:1",
            },
            {
              order: "2B",
              exercise: "Standing 1 Arm Landmine Press",
              rpe: "80%-90% of 1RM",
              tempo: "1:1:6",
              week1: "3x3 ea",
              week2: "3x3 ea",
              week3: "3x3 ea",
            },
            {
              order: "2C",
              exercise: "Side Plank with Hip Aduction",
              rpe: "BW",
              tempo: "1:1:3",
              week1: "3x3 ea",
              week2: "3x4 ea",
              week3: "3x6 ea",
            },
            {
              order: "3A",
              exercise: "Yoga Ball Roll Outs",
              rpe: "BW",
              tempo: "3:0:1",
              week1: "2x6 ea",
              week2: "2x7 ea",
              week3: "2x8 ea",
            },
            {
              order: "3B",
              exercise: "Band Pull Apart",
              rpe: "RPE 6-7",
              tempo: "1:1:3",
              week1: "2x8 ea",
              week2: "2x9 ea",
              week3: "2x10 ea",
            },
          ],
        },
        day2: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Dead Bugs",
              sets: "2x12 ea",
              description: "Core stability exercise",
            },
            {
              exercise: "SL Glute Bridge",
              sets: "2x:25 ea",
              description: "Single leg glute activation",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "Hex Bar Dead Lift",
              rpe: "RPE 7-8",
              tempo: "1:1:3",
              week1: "4x3",
              week2: "4x3",
              week3: "3x3",
            },
            {
              order: "1B",
              exercise: "Single Leg Leap Matrix",
              rpe: "",
              tempo: "Exp",
              week1: "4x1 ea",
              week2: "4x1 ea",
              week3: "3x1 ea",
            },
            {
              order: "1C",
              exercise: "Rotational 1 Arm Cable Row",
              rpe: "70-%-75% of 1RM",
              tempo: "1:1:1",
              week1: "3x6 ea",
              week2: "3x6 ea",
              week3: "3x6 ea",
            },
            {
              order: "2A",
              exercise: "1 Arm Landmine Push Press",
              rpe: "70-%-75% of 1RM",
              tempo: "Exp",
              week1: "4x2 ea",
              week2: "4x2 ea",
              week3: "3x2 ea",
            },
            {
              order: "2B",
              exercise: "KB Swing",
              rpe: "55%-60% of 1RM",
              tempo: "Exp",
              week1: "3x10 ea",
              week2: "3x10 ea",
              week3: "3x10 ea",
            },
            {
              order: "2C",
              exercise: "IYT",
              rpe: "",
              tempo: "",
              week1: "3x5 ea",
              week2: "3x6 ea",
              week3: "3x7 ea",
            },
            {
              order: "3A",
              exercise: "Supine SL Cable Hip Flexion",
              rpe: "65%-7-% of 1rm",
              tempo: "1:1:3",
              week1: "2x5 ea",
              week2: "2x5 ea",
              week3: "2x5 ea",
            },
            {
              order: "3B",
              exercise: "Side Plank",
              rpe: "BW",
              tempo: "1:5:1",
              week1: "2x0:25 ea",
              week2: "2x0:30 ea",
              week3: "2x0:35 ea",
            },
          ],
        },
        day3: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Bear Crawl Holds",
              sets: "2x35",
              description: "Hold bear crawl position",
            },
            {
              exercise: "Iso Split Squat",
              sets: "2x30 ea",
              description: "Isometric hold in split squat",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "Barbell Front Squat",
              rpe: "75-80%",
              tempo: "1:1:X",
              week1: "5x3",
              week2: "5x3",
              week3: "5x3",
            },
            {
              order: "1B",
              exercise: "Inverted Row",
              rpe: "BW",
              tempo: "X:1:1",
              week1: "3x10",
              week2: "3x10",
              week3: "3x10",
            },
            {
              order: "1C",
              exercise: "1/2 knee cable lift",
              rpe: "RPE 6-7",
              tempo: "X:1:1",
              week1: "3x10 ea",
              week2: "3x10 ea",
              week3: "3x10 ea",
            },
            {
              order: "2A",
              exercise: "DB RDL",
              rpe: "65%-75%",
              tempo: "1:1:X",
              week1: "4x8",
              week2: "4x8",
              week3: "4x8",
            },
            {
              order: "2B",
              exercise: "Push up",
              rpe: "BW+",
              tempo: "1:1:X",
              week1: "3x12",
              week2: "3x12",
              week3: "3x12",
            },
            {
              order: "2C",
              exercise: "Yoga ball roll out",
              rpe: "BW+",
              tempo: "X:1:1",
              week1: "3x12",
              week2: "3x12",
              week3: "3x12",
            },
            {
              order: "3A",
              exercise: "KB Lateral Squat",
              rpe: "RPE 8",
              tempo: "X:1:1",
              week1: "3x8 ea",
              week2: "3x8 ea",
              week3: "3x8 ea",
            },
            {
              order: "3B",
              exercise: "DB over head press",
              rpe: "65-75%",
              tempo: "X:1:1",
              week1: "3x5",
              week2: "3x5",
              week3: "3x5",
            },
            {
              order: "3C",
              exercise: "Pallof Press",
              rpe: "RPE 8",
              tempo: "X:1:1",
              week1: "3x5",
              week2: "3x5",
              week3: "3x5",
            },
          ],
        },
        day4: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Dead Bugs",
              sets: "2x15 ea",
              description: "Core stability exercise",
            },
            {
              exercise: "SL Glute Bridge",
              sets: "2x35 ea",
              description: "Single leg glute activation",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "Hex Bar Deadlift",
              rpe: "75%-85% of 1RM",
              tempo: "1:1:3",
              week1: "4x8",
              week2: "4x8",
              week3: "4x8",
            },
            {
              order: "1B",
              exercise: "Cable Hip Flexion",
              rpe: "75%-85% of 1RM",
              tempo: "1:1:2",
              week1: "4x6 ea",
              week2: "4x6 ea",
              week3: "4x6 ea",
            },
            {
              order: "2A",
              exercise: "Barbell Bench",
              rpe: "75%-85% of 1RM",
              tempo: "2:1:1",
              week1: "4x8",
              week2: "4x8",
              week3: "4x8",
            },
            {
              order: "2B",
              exercise: "DB Goblet Lateral Lunge",
              rpe: "75%-85% of 1RM",
              tempo: "1:3:1",
              week1: "4x4 ea",
              week2: "4x4 ea",
              week3: "4x4 ea",
            },
            {
              order: "2C",
              exercise: "1/2 knee Pallof Press",
              rpe: "RPE 7-8",
              tempo: "Cont",
              week1: "4x8 ea",
              week2: "4x8 ea",
              week3: "4x8 ea",
            },
            {
              order: "3A",
              exercise: "Lat pull down",
              rpe: "75%-85% of 1RM",
              tempo: "1:3:1",
              week1: "3x8 ea",
              week2: "3x8 ea",
              week3: "3x8 ea",
            },
            {
              order: "3B",
              exercise: "Band pull apart",
              rpe: "RPE 6-8",
              tempo: "1:03:01",
              week1: "2x8",
              week2: "2x9",
              week3: "2x10",
            },
          ],
        },
      },
      week2: {
        day1: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Bear Crawl Holds",
              sets: "2x35",
              description: "Hold bear crawl position",
            },
            {
              exercise: "Iso Split Squat",
              sets: "2x30 ea",
              description: "Isometric hold in split squat",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "Safety Bar Back Squat (Cluster)",
              rpe: "85%-95%",
              tempo: "2:1:1",
              week1: "4x1.1.1",
              week2: "4x2.1.1",
              week3: "4x2.2",
            },
            {
              order: "1B",
              exercise: "1/2 knee IM 1 arm Press",
              rpe: "75%-85%",
              tempo: "1:1:2",
              week1: "4x6 ea",
              week2: "4x6 ea",
              week3: "4x6 ea",
            },
            {
              order: "1C",
              exercise: "Banded Ankle Dorsal Flexion",
              rpe: "RPE 8-9",
              tempo: "1:2:1",
              week1: "4x5 ea",
              week2: "4x6 ea",
              week3: "4x7 ea",
            },
            {
              order: "2A",
              exercise: "Pull ups (Inverted Rows) (Cluster)",
              rpe: "RPE 8-9",
              tempo: "1:1:2",
              week1: "4x1.1.1+",
              week2: "4x2.1.1+",
              week3: "4x2.2+",
            },
            {
              order: "2B",
              exercise: "Single Leg Hamstring Bridge",
              rpe: "BW",
              tempo: "1:1:5",
              week1: "4x5 ea",
              week2: "4x6 ea",
              week3: "4x7 ea",
            },
            {
              order: "2C",
              exercise: "Lying Banded Hip Flexion",
              rpe: "RPE 8-9",
              tempo: "1:2:1",
              week1: "4x8 ea",
              week2: "4x10 ea",
              week3: "4x12 ea",
            },
            {
              order: "3A",
              exercise: "KB (or DB) Goblet Split squat",
              rpe: "75%-85%",
              tempo: "2:1:1",
              week1: "4x8 ea",
              week2: "4x10 ea",
              week3: "4x12 ea",
            },
            {
              order: "3B",
              exercise: "Single Leg Glute Bridge",
              rpe: "ISO",
              tempo: "Hold",
              week1: "4x0:40 ea",
              week2: "4x0:45 ea",
              week3: "4x0:50 ea",
            },
          ],
        },
        day2: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Dead Bugs",
              sets: "2x15 ea",
              description: "Core stability exercise",
            },
            {
              exercise: "SL Glute Bridge",
              sets: "2x35 ea",
              description: "Single leg glute activation",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "DB Single leg RDL (Cluster)",
              rpe: "85%-95%",
              tempo: "2:1:1",
              week1: "4x1.1.1",
              week2: "4x2.1.1",
              week3: "4x2.2",
            },
            {
              order: "1B",
              exercise: "Chest supported Row (Cluster)",
              rpe: "75%-85%",
              tempo: "1:3:1",
              week1: "4x1.1.1 ea",
              week2: "4x2.1.1 ea",
              week3: "4x2.2 ea",
            },
            {
              order: "1C",
              exercise: "Plank",
              rpe: "BW",
              tempo: "Iso",
              week1: "4x0:45 ea",
              week2: "4x0:50 ea",
              week3: "4x0:55 ea",
            },
            {
              order: "2A",
              exercise: "DB Bench Press (Cluster)",
              rpe: "85%-95%",
              tempo: "2:1:1",
              week1: "4x1.1.1",
              week2: "4x2.1.1",
              week3: "4x2.2",
            },
            {
              order: "2B",
              exercise: "Single Leg Skater Squat",
              rpe: "25%-35%",
              tempo: "3:1:1",
              week1: "4x5 ea",
              week2: "4x6 ea",
              week3: "4x7 ea",
            },
            {
              order: "2C",
              exercise: "Cable External Rotation",
              rpe: "80%-90%",
              tempo: "Cont",
              week1: "4x6 ea",
              week2: "4x6 ea",
              week3: "4x6 ea",
            },
            {
              order: "3A",
              exercise: "1/2 knee Pallof Press",
              rpe: "RPE 8-9",
              tempo: "1:2:4",
              week1: "4x5 ea",
              week2: "4x5 ea",
              week3: "4x5 ea",
            },
            {
              order: "3B",
              exercise: "Copenhagen Plank",
              rpe: "BW",
              tempo: "Iso",
              week1: "4x0:20 ea",
              week2: "4x0:25 ea",
              week3: "4x0:30 ea",
            },
          ],
        },
        day3: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Bear Crawl Holds",
              sets: "2x40",
              description: "Hold bear crawl position",
            },
            {
              exercise: "Iso Split Squat",
              sets: "2x35 ea",
              description: "Isometric hold in split squat",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "DB RFE Split Squat (Cluster)",
              rpe: "85%-95%",
              tempo: "2:1:1",
              week1: "4x1.1.1 ea",
              week2: "4x2.1.1 ea",
              week3: "4x2.2 ea",
            },
            {
              order: "1B",
              exercise: "1/2 knee Cable rotation press",
              rpe: "70%-80%",
              tempo: "1:1:3",
              week1: "4x6 ea",
              week2: "4x6 ea",
              week3: "4x6 ea",
            },
            {
              order: "1C",
              exercise: "Bear Crawl Hold",
              rpe: "BW",
              tempo: "ISO",
              week1: "4x0:45 ea",
              week2: "4x0:50 ea",
              week3: "4x0:55 ea",
            },
            {
              order: "2A",
              exercise: "1 Arm DB row (Cluster)",
              rpe: "85%-95%",
              tempo: "1:1:2",
              week1: "4x1.1.1 ea",
              week2: "4x2.1.1 ea",
              week3: "4x2.2 ea",
            },
            {
              order: "2B",
              exercise: "Slider Leg Curl",
              rpe: "BW",
              tempo: "1:1:4",
              week1: "4x8 ea",
              week2: "4x10 ea",
              week3: "4x12 ea",
            },
            {
              order: "2C",
              exercise: "Side Plank",
              rpe: "BW",
              tempo: "ISO",
              week1: "4x0:35 ea",
              week2: "4x0:35 ea",
              week3: "4x0:35 ea",
            },
            {
              order: "3A",
              exercise: "DB Split squat ISO",
              rpe: "75%-85%",
              tempo: "ISO",
              week1: "4x0:25 ea",
              week2: "4x0:25 ea",
              week3: "4x0:25 ea",
            },
            {
              order: "3B",
              exercise: "Alt Leg Lower",
              rpe: "SLOW BW",
              tempo: "1:1:3",
              week1: "3x6 ea",
              week2: "3x7 ea",
              week3: "3x8 ea",
            },
          ],
        },
        day4: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Dead Bugs",
              sets: "2x18 ea",
              description: "Core stability exercise",
            },
            {
              exercise: "SL Glute Bridge",
              sets: "2x40 ea",
              description: "Single leg glute activation",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "Hex Bar Deadlift (Cluster)",
              rpe: "85%-95%",
              tempo: "1:1:3",
              week1: "4x1.1.1",
              week2: "4x2.1.1",
              week3: "4x2.2",
            },
            {
              order: "1B",
              exercise: "Cable Hip Flexion",
              rpe: "75%-85%",
              tempo: "1:1:2",
              week1: "4x6 ea",
              week2: "4x6 ea",
              week3: "4x6 ea",
            },
            {
              order: "2A",
              exercise: "Barbell Bench (Cluster)",
              rpe: "85%-95%",
              tempo: "2:1:1",
              week1: "4x1.1.1",
              week2: "4x2.1.1",
              week3: "4x2.2",
            },
            {
              order: "2B",
              exercise: "DB Goblet Lateral Lunge",
              rpe: "75%-85%",
              tempo: "1:3:1",
              week1: "4x4 ea",
              week2: "4x4 ea",
              week3: "4x4 ea",
            },
            {
              order: "2C",
              exercise: "1/2 knee Pallof Press",
              rpe: "RPE 8-9",
              tempo: "Cont",
              week1: "4x8 ea",
              week2: "4x8 ea",
              week3: "4x8 ea",
            },
            {
              order: "3A",
              exercise: "Lat pull down",
              rpe: "75%-85%",
              tempo: "1:3:1",
              week1: "3x8 ea",
              week2: "3x8 ea",
              week3: "3x8 ea",
            },
            {
              order: "3B",
              exercise: "Band pull apart",
              rpe: "RPE 6-8",
              tempo: "1:03:01",
              week1: "2x8",
              week2: "2x9",
              week3: "2x10",
            },
          ],
        },
      },
      week3: {
        day1: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Bear Crawl Holds",
              sets: "2x45",
              description: "Hold bear crawl position",
            },
            {
              exercise: "Iso Split Squat",
              sets: "2x40 ea",
              description: "Isometric hold in split squat",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "Safety Bar Back Squat (Max Effort)",
              rpe: "90%-100%",
              tempo: "2:1:1",
              week1: "5x3",
              week2: "5x3",
              week3: "4x3",
            },
            {
              order: "1B",
              exercise: "Box Jump",
              rpe: "Explosive",
              tempo: "Explosive",
              week1: "5x5",
              week2: "5x5",
              week3: "4x5",
            },
            {
              order: "1C",
              exercise: "1 arm DB row (Max Effort)",
              rpe: "90%-100%",
              tempo: "1:1:2",
              week1: "4x1.1.1 ea",
              week2: "4x1.1.1 ea",
              week3: "4x1.1.1 ea",
            },
            {
              order: "2A",
              exercise: "Glute-Ham Raise (Max Effort)",
              rpe: "BW",
              tempo: "3:0:1",
              week1: "4x1.1.1",
              week2: "4x2.1.1",
              week3: "4x2.2",
            },
            {
              order: "2B",
              exercise: "Standing 1 arm Landmine Press",
              rpe: "85%-95%",
              tempo: "1:1:2",
              week1: "4x4 ea",
              week2: "4x4 ea",
              week3: "4x4 ea",
            },
            {
              order: "2C",
              exercise: "Side Plank with Hip adduction",
              rpe: "BW",
              tempo: "1:1:3",
              week1: "4x4 ea",
              week2: "4x5 ea",
              week3: "4x7 ea",
            },
            {
              order: "3A",
              exercise: "Yoga Ball Roll outs",
              rpe: "BW",
              tempo: "3:0:1",
              week1: "3x8",
              week2: "3x9",
              week3: "3x10",
            },
            {
              order: "3B",
              exercise: "Band pull apart",
              rpe: "RPE 6-8",
              tempo: "1:03:01",
              week1: "2x8",
              week2: "2x9",
              week3: "2x10",
            },
          ],
        },
        day2: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Dead Bugs",
              sets: "2x20 ea",
              description: "Core stability exercise",
            },
            {
              exercise: "SL Glute Bridge",
              sets: "2x40 ea",
              description: "Single leg glute activation",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "DB Single leg RDL (Max Effort)",
              rpe: "90%-100%",
              tempo: "2:1:1",
              week1: "4x1.1.1 ea",
              week2: "4x2.1.1 ea",
              week3: "4x2.2 ea",
            },
            {
              order: "1B",
              exercise: "Med Ball Slam",
              rpe: "Explosive",
              tempo: "Explosive",
              week1: "4x8",
              week2: "4x8",
              week3: "4x8",
            },
            {
              order: "1C",
              exercise: "Chest supported Row (Max Effort)",
              rpe: "90%-100%",
              tempo: "1:3:1",
              week1: "4x1.1.1",
              week2: "4x2.1.1",
              week3: "4x2.2",
            },
            {
              order: "2A",
              exercise: "DB Bench Press (Max Effort)",
              rpe: "90%-100%",
              tempo: "2:1:1",
              week1: "4x1.1.1",
              week2: "4x2.1.1",
              week3: "4x2.2",
            },
            {
              order: "2B",
              exercise: "Single Leg Skater Squat",
              rpe: "30%-40%",
              tempo: "3:1:1",
              week1: "4x4 ea",
              week2: "4x5 ea",
              week3: "4x6 ea",
            },
            {
              order: "2C",
              exercise: "Cable External Rotation",
              rpe: "85%-95%",
              tempo: "Cont",
              week1: "4x5 ea",
              week2: "4x5 ea",
              week3: "4x5 ea",
            },
            {
              order: "3A",
              exercise: "1/2 knee Pallof Press",
              rpe: "RPE 8-9",
              tempo: "1:2:4",
              week1: "3x4 ea",
              week2: "3x5 ea",
              week3: "3x6 ea",
            },
            {
              order: "3B",
              exercise: "IYT shoulder exercise",
              rpe: "RPE 7-9",
              tempo: "1:3:1",
              week1: "3x8 ea",
              week2: "3x9 ea",
              week3: "3x10 ea",
            },
          ],
        },
        day3: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Bear Crawl Holds",
              sets: "2x45",
              description: "Hold bear crawl position",
            },
            {
              exercise: "Iso Split Squat",
              sets: "2x40 ea",
              description: "Isometric hold in split squat",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "DB RFE Split Squat (Max Effort)",
              rpe: "90%-100%",
              tempo: "2:1:1",
              week1: "4x1.1.1 ea",
              week2: "4x2.1.1 ea",
              week3: "4x2.2 ea",
            },
            {
              order: "1B",
              exercise: "1/2 knee Cable rotation press",
              rpe: "80%-90%",
              tempo: "1:1:3",
              week1: "4x5 ea",
              week2: "4x5 ea",
              week3: "4x5 ea",
            },
            {
              order: "1C",
              exercise: "Bear Crawl Hold",
              rpe: "BW",
              tempo: "ISO",
              week1: "4x0:50 ea",
              week2: "4x0:55 ea",
              week3: "4x1:00 ea",
            },
            {
              order: "2A",
              exercise: "1 Arm DB row (Max Effort)",
              rpe: "90%-100%",
              tempo: "1:1:2",
              week1: "4x1.1.1 ea",
              week2: "4x2.1.1 ea",
              week3: "4x2.2 ea",
            },
            {
              order: "2B",
              exercise: "Slider Leg Curl",
              rpe: "BW",
              tempo: "1:1:4",
              week1: "4x6 ea",
              week2: "4x7 ea",
              week3: "4x8 ea",
            },
            {
              order: "2C",
              exercise: "Side Plank",
              rpe: "BW",
              tempo: "ISO",
              week1: "4x0:40 ea",
              week2: "4x0:40 ea",
              week3: "4x0:40 ea",
            },
            {
              order: "3A",
              exercise: "DB Split squat ISO",
              rpe: "80%-90%",
              tempo: "ISO",
              week1: "3x0:30 ea",
              week2: "3x0:30 ea",
              week3: "3x0:30 ea",
            },
            {
              order: "3B",
              exercise: "Alt Leg Lower",
              rpe: "SLOW BW",
              tempo: "1:1:3",
              week1: "3x5 ea",
              week2: "3x6 ea",
              week3: "3x7 ea",
            },
          ],
        },
        day4: {
          mobility: [
            {
              exercise: "Ankle Rockers",
              sets: "1x6-10 ea",
              description: "Rock ankles forward and back",
            },
            {
              exercise: "Weight Shifts",
              sets: "1x6-10 ea",
              description: "Shift weight side to side",
            },
            {
              exercise: "90:90 w/ Torso Lean",
              sets: "1x6-10 ea",
              description: "Hip mobility in 90/90 position",
            },
            {
              exercise: "Supine Figure 4 w/ rotation",
              sets: "1x6-10 ea",
              description: "Hip and spine mobility",
            },
            {
              exercise: "Side Lying T-spine Windmills",
              sets: "1x6-10 ea",
              description: "Thoracic spine rotation",
            },
            {
              exercise: "Worlds Greatest",
              sets: "1x6-10 ea",
              description: "Multi-planar hip mobility",
            },
            {
              exercise: "Reach Roll Lift",
              sets: "1x6-10 ea",
              description: "Shoulder and spine mobility",
            },
          ],
          dynamic: [
            {
              exercise: "High Knees",
              sets: "Dynamic",
              description: "Drive knees up while moving forward",
            },
            {
              exercise: "Butt Kickers",
              sets: "Dynamic",
              description: "Kick heels to glutes while moving",
            },
            {
              exercise: "Cross Under",
              sets: "Dynamic",
              description: "Cross legs under while moving laterally",
            },
            {
              exercise: "Cross Over",
              sets: "Dynamic",
              description: "Cross legs over while moving laterally",
            },
            {
              exercise: "Carioca",
              sets: "Dynamic",
              description: "Lateral movement with crossover steps",
            },
          ],
          warmup: [
            {
              exercise: "Dead Bugs",
              sets: "2x15 ea",
              description: "Core stability exercise",
            },
            {
              exercise: "SL Glute Bridge",
              sets: "2x35 ea",
              description: "Single leg glute activation",
            },
          ],
          exercises: [
            {
              order: "1A",
              exercise: "Hex Bar Deadlift (Max Effort)",
              rpe: "90%-100%",
              tempo: "1:1:3",
              week1: "4x1.1.1",
              week2: "4x2.1.1",
              week3: "4x2.2",
            },
            {
              order: "1B",
              exercise: "Cable Hip Flexion",
              rpe: "80%-90%",
              tempo: "1:1:2",
              week1: "4x5 ea",
              week2: "4x5 ea",
              week3: "4x5 ea",
            },
            {
              order: "2A",
              exercise: "Barbell Bench (Max Effort)",
              rpe: "90%-100%",
              tempo: "2:1:1",
              week1: "4x1.1.1",
              week2: "4x2.1.1",
              week3: "4x2.2",
            },
            {
              order: "2B",
              exercise: "DB Goblet Lateral Lunge",
              rpe: "80%-90%",
              tempo: "1:3:1",
              week1: "4x3 ea",
              week2: "4x3 ea",
              week3: "4x3 ea",
            },
            {
              order: "2C",
              exercise: "1/2 knee Pallof Press",
              rpe: "RPE 8-9",
              tempo: "Cont",
              week1: "4x6 ea",
              week2: "4x6 ea",
              week3: "4x6 ea",
            },
            {
              order: "3A",
              exercise: "Lat pull down",
              rpe: "80%-90%",
              tempo: "1:3:1",
              week1: "3x6 ea",
              week2: "3x6 ea",
              week3: "3x6 ea",
            },
            {
              order: "3B",
              exercise: "Glute-Ham Raise",
              rpe: "BW",
              tempo: "3:0:1",
              week1: "3x5",
              week2: "3x6",
              week3: "3x7",
            },
            {
              order: "3C",
              exercise: "Copenhagen Plank",
              rpe: "BW",
              tempo: "ISO",
              week1: "3x0:25 ea",
              week2: "3x0:30 ea",
              week3: "3x0:35 ea",
            },
          ],
        },
      },
    },
  }

  // Add function to get current workout data based on selections
  const getCurrentWorkoutData = (): WorkoutData => {
    const phaseKey = `phase${currentPhase}` as keyof typeof allProgramData
    const weekKey = `week${currentWeek}` as keyof (typeof allProgramData)[typeof phaseKey]
    const dayKey = `day${currentDay}` as keyof (typeof allProgramData)[typeof phaseKey][typeof weekKey]

    const workoutData = allProgramData[phaseKey]?.[weekKey]?.[dayKey]

    if (!workoutData) {
      // Return empty data if combination doesn't exist
      return {
        mobility: [],
        dynamic: [],
        warmup: [],
        exercises: [],
      }
    }

    return workoutData
  }

  // Replace the old programData usage with getCurrentWorkoutData()
  const programData = getCurrentWorkoutData()

  const renderNavigation = () => (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            <Button
              onClick={() => setActiveSection("overview")}
              variant={activeSection === "overview" ? "default" : "outline"}
              className="flex items-center gap-2"
              style={{
                backgroundColor: activeSection === "overview" ? colors.primary : "transparent",
                borderColor: colors.primary,
              }}
            >
              <Home className="w-4 h-4" />
              Overview
            </Button>

            <Button
              onClick={() => setActiveSection("summary")}
              variant={activeSection === "summary" ? "default" : "outline"}
              className="flex items-center gap-2"
              style={{
                backgroundColor: activeSection === "summary" ? colors.primary : "transparent",
                borderColor: colors.primary,
              }}
            >
              <FileText className="w-4 h-4" />
              Summary
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Phase:</span>
              <select
                value={currentPhase}
                onChange={(e) => setCurrentPhase(Number(e.target.value))}
                className="px-3 py-1 rounded border text-sm"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Week:</span>
              <select
                value={currentWeek}
                onChange={(e) => setCurrentWeek(Number(e.target.value))}
                className="px-3 py-1 rounded border text-sm"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Day:</span>
              <select
                value={currentDay}
                onChange={(e) => setCurrentDay(Number(e.target.value))}
                className="px-3 py-1 rounded border text-sm"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: colors.secondary }}>
            <Clock className="w-4 h-4" />
            <span
              className="font-mono text-lg font-bold text-white"
              style={{ color: timer <= 10 && timer > 0 ? "#ef4444" : "white" }}
            >
              {formatTime(timer)}
            </span>
            <div className="flex gap-1 ml-2">
              <Button
                onClick={() => setIsRunning(!isRunning)}
                size="sm"
                variant="ghost"
                className="p-1 h-auto text-white hover:bg-white/20"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                onClick={resetTimer}
                size="sm"
                variant="ghost"
                className="p-1 h-auto text-white hover:bg-white/20"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative ml-2">
              <Button
                onClick={() => setShowTimerDropdown(!showTimerDropdown)}
                size="sm"
                variant="outline"
                className="text-xs px-2 py-1 h-auto bg-white text-gray-800 hover:bg-gray-100 flex items-center gap-1"
              >
                Timer <ChevronDown className="w-3 h-3" />
              </Button>
              {showTimerDropdown && (
                <div className="absolute top-full mt-1 right-0 bg-white border rounded-md shadow-lg z-10 min-w-[120px]">
                  <div className="py-1">
                    {[15, 20, 25, 30, 40, 45, 50, 60, 90, 120, 180].map((seconds) => (
                      <button
                        key={seconds}
                        onClick={() => startTimer(seconds)}
                        className="w-full text-left px-3 py-1 text-sm hover:bg-gray-100 text-gray-800"
                      >
                        {seconds < 60
                          ? `${seconds}s`
                          : `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderExerciseCard = (exercise: Exercise, index: number) => {
    const exerciseTimes = getExerciseTime(exercise)

    return (
      <Card key={index} className="border-l-4" style={{ borderLeftColor: colors.secondary }}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {exercise.order && (
                  <span
                    className="px-2 py-1 rounded text-white text-sm font-bold"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {exercise.order}
                  </span>
                )}
                <h4 className="font-semibold text-lg">{exercise.exercise}</h4>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  {exercise.week1 && (
                    <div className="bg-white rounded p-2 border-l-4" style={{ borderLeftColor: colors.primary }}>
                      <span className="font-bold text-white text-gray-700">Current Week:</span>
                      <div className="font-bold text-lg" style={{ color: colors.primary }}>
                        {currentWeek === 1 ? exercise.week1 : currentWeek === 2 ? exercise.week2 : exercise.week3}
                      </div>
                    </div>
                  )}

                  {exercise.sets && !exercise.week1 && (
                    <div className="bg-white rounded p-2 border-l-4" style={{ borderLeftColor: colors.primary }}>
                      <span className="font-bold text-white text-gray-700">Sets/Reps:</span>
                      <div className="font-bold text-lg" style={{ color: colors.primary }}>
                        {exercise.sets}
                      </div>
                    </div>
                  )}

                  {exercise.rpe && (
                    <div
                      className="rounded p-2 border-l-4"
                      style={{ borderLeftColor: colors.secondary, backgroundColor: colors.secondary }}
                    >
                      <span className="font-bold text-white">Load/RPE:</span>
                      <div className="font-bold text-base text-white">{exercise.rpe}</div>
                    </div>
                  )}

                  {exercise.tempo && (
                    <div className="bg-white rounded p-2 border-l-4 border-green-500">
                      <span className="font-medium text-gray-700">Tempo:</span>
                      <div className="font-bold text-base text-green-700">{exercise.tempo}</div>
                    </div>
                  )}
                </div>
              </div>

              {exercise.description && <p className="text-sm text-gray-600 italic">{exercise.description}</p>}
            </div>

            <div className="flex gap-2 ml-4">
              <Button
                className=""
                style={{
                  backgroundColor: colors.secondary,
                  color: colors.white,
                }}
                onClick={() =>
                  window.open(
                    `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.exercise + " exercise")}`,
                    "_blank",
                  )
                }
              >
                <Play className="w-4 h-4 mr-2" />
                Demo
              </Button>
              {exerciseTimes.length > 0 && (
                <div className="flex gap-1">
                  {exerciseTimes.map((time, idx) => (
                    <Button
                      key={idx}
                      onClick={() => startTimer(time)}
                      size="sm"
                      variant="outline"
                      className="text-xs px-2 py-1 h-auto"
                      style={{ borderColor: colors.primary, color: colors.primary }}
                    >
                      {time}s
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderWorkoutSection = (title: string, exercises: Exercise[], icon: string) => (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg text-xl" style={{ backgroundColor: colors.primary, color: "white" }}>
          {icon}
        </div>
        <h3 className="text-xl font-bold" style={{ color: colors.darkGray }}>
          {title}
        </h3>
      </div>

      <div className="grid gap-4">{exercises.map((exercise, index) => renderExerciseCard(exercise, index))}</div>
    </div>
  )

  const renderOverview = () => (
    <div className="space-y-6">
      <Card style={{ backgroundColor: colors.primary, color: colors.white }}>
        <CardContent className="text-center p-8">
          <h1 className="text-3xl font-bold mb-2">Anna Maria Ice Hockey</h1>
          <h2 className="text-xl mb-4">Summer Workout Program</h2>
          <div className="text-lg" style={{ color: colors.secondary }}>
            Phase {currentPhase} • Week {currentWeek} • Day {currentDay}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: "mobility", icon: "🧘", title: "Mobility", desc: "Movement prep" },
          { key: "dynamic", icon: "🏃", title: "Dynamic", desc: "Activation" },
          { key: "warmup", icon: "🔥", title: "Warm-up", desc: "Core prep" },
          { key: "exercises", icon: "💪", title: "Workout", desc: "Main training" },
        ].map((section) => (
          <Card
            key={section.key}
            className="cursor-pointer hover:shadow-lg transition-all"
            onClick={() => setActiveSection(section.key)}
          >
            <CardContent className="p-6 text-center">
              <div className="p-3 rounded-lg mx-auto mb-3 w-fit text-2xl" style={{ backgroundColor: colors.secondary }}>
                {section.icon}
              </div>
              <h3 className="font-semibold text-lg" style={{ color: colors.darkGray }}>
                {section.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{section.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add note about cluster sets */}
      <Card className="border-l-4" style={{ borderLeftColor: colors.primary }}>
        <CardContent className="p-4" style={{ backgroundColor: colors.lightMaroon + "20" }}>
          <h3 className="font-semibold text-lg mb-2" style={{ color: colors.primary }}>
            Cluster Set Instructions
          </h3>
          <p className="text-sm" style={{ color: colors.darkGray }}>
            <strong>Cluster Set:</strong> 1.1.1 = 3 single repetitions with 20 to 30 seconds rest between each set (pay
            attention to Tempo)
          </p>
        </CardContent>
      </Card>
    </div>
  )

  const renderSummary = () => (
    <div className="space-y-6">
      <Card style={{ backgroundColor: colors.primary, color: colors.white }}>
        <CardContent className="text-center p-6">
          <h1 className="text-2xl font-bold mb-2">Complete Workout Summary</h1>
          <div className="text-lg" style={{ color: colors.secondary }}>
            Phase {currentPhase} • Week {currentWeek} • Day {currentDay}
          </div>
        </CardContent>
      </Card>

      {[
        { name: "Mobility", data: programData.mobility, icon: "🧘" },
        { name: "Dynamic", data: programData.dynamic, icon: "🏃" },
        { name: "Warm-up", data: programData.warmup, icon: "🔥" },
        { name: "Main Workout", data: programData.exercises, icon: "💪" },
      ].map((section, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
              <span className="text-2xl">{section.icon}</span>
              {section.name}
            </h2>
            <div className="grid gap-3">{section.data.map((exercise, idx) => renderExerciseCard(exercise, idx))}</div>
          </CardContent>
        </Card>
      ))}

      {/* Add cluster set note to summary as well */}
      <Card className="border-l-4" style={{ borderLeftColor: colors.primary }}>
        <CardContent className="p-4" style={{ backgroundColor: colors.lightMaroon + "20" }}>
          <h3 className="font-semibold text-lg mb-2" style={{ color: colors.primary }}>
            Cluster Set Instructions
          </h3>
          <p className="text-sm" style={{ color: colors.darkGray }}>
            <strong>Cluster Set:</strong> 1.1.1 = 3 single repetitions with 20 to 30 seconds rest between each set (pay
            attention to Tempo)
          </p>
        </CardContent>
      </Card>
    </div>
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowTimerDropdown(false)
    }

    if (showTimerDropdown) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [showTimerDropdown])

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: `
          linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 25%, #ffffff 50%, #e6f3ff 75%, #f0f8ff 100%),
          linear-gradient(90deg, transparent 0%, rgba(0, 100, 200, 0.1) 20%, transparent 21%, transparent 79%, rgba(0, 100, 200, 0.1) 80%, transparent 100%),
          linear-gradient(90deg, transparent 0%, rgba(200, 0, 0, 0.15) 49.5%, transparent 50%, transparent 50.5%, rgba(200, 0, 0, 0.15) 50.5%, transparent 51%),
          radial-gradient(ellipse at 20% 30%, rgba(173, 216, 230, 0.2) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(173, 216, 230, 0.2) 0%, transparent 50%),
          conic-gradient(from 45deg at 15% 25%, transparent 0deg, rgba(255, 255, 255, 0.1) 30deg, transparent 60deg),
          conic-gradient(from 135deg at 85% 75%, transparent 0deg, rgba(255, 255, 255, 0.1) 30deg, transparent 60deg),
          conic-gradient(from 225deg at 25% 85%, transparent 0deg, rgba(255, 255, 255, 0.1) 20deg, transparent 40deg),
          conic-gradient(from 315deg at 75% 15%, transparent 0deg, rgba(255, 255, 255, 0.1) 20deg, transparent 40deg)
        `,
        backgroundSize: `
          100% 100%,
          100% 100%,
          100% 100%,
          300px 200px,
          300px 200px,
          150px 150px,
          150px 150px,
          100px 100px,
          100px 100px
        `,
        backgroundPosition: `
          0 0,
          0 0,
          0 0,
          0 0,
          100% 100%,
          0 0,
          100% 100%,
          0 100%,
          100% 0
        `,
        backgroundRepeat: "no-repeat, no-repeat, no-repeat, repeat, repeat, repeat, repeat, repeat, repeat",
      }}
    >
      <div className="max-w-6xl mx-auto p-6">
        {renderNavigation()}

        {activeSection === "overview" && renderOverview()}
        {activeSection === "summary" && renderSummary()}
        {activeSection === "mobility" && renderWorkoutSection("Mobility & Movement Prep", programData.mobility, "🧘")}
        {activeSection === "dynamic" && renderWorkoutSection("Dynamic Movement", programData.dynamic, "🏃")}
        {activeSection === "warmup" && renderWorkoutSection("Warm-up Exercises", programData.warmup, "🔥")}
        {activeSection === "exercises" && renderWorkoutSection("Main Workout", programData.exercises, "💪")}
      </div>
    </div>
  )
}
