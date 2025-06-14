// Fetch and parse the Phase 2 CSV data
async function fetchPhase2Data() {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Phase2Exercises-rxEfPQYjEJzEFvN6vA4JbDPDqDXxc5.csv",
    )
    const csvText = await response.text()

    // Parse CSV
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    console.log("Headers:", headers)

    const data = []
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
        const row = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ""
        })
        data.push(row)
      }
    }

    console.log("Total Phase 2 rows:", data.length)

    // Filter for Phase 2 exercises only
    const phase2Exercises = data.filter((row) => row.Phase === "2" && row.Section === "Exercise")
    console.log("Phase 2 exercises:", phase2Exercises.length)

    // Group by Week and Day
    const groupedData = {}

    phase2Exercises.forEach((exercise) => {
      const week = exercise.Week
      const day = exercise.Day

      if (!groupedData[week]) groupedData[week] = {}
      if (!groupedData[week][day]) groupedData[week][day] = []

      groupedData[week][day].push({
        order: exercise.Order,
        exercise: exercise.Exercise,
        rpe: exercise.RPE_Load,
        tempo: exercise.Tempo,
        week1: exercise.Week1,
        week2: exercise.Week2,
        week3: exercise.Week3,
        description: exercise.Description,
      })
    })

    // Sort exercises by order within each day
    Object.keys(groupedData).forEach((week) => {
      Object.keys(groupedData[week]).forEach((day) => {
        groupedData[week][day].sort((a, b) => {
          // Extract numeric part and letter part for proper sorting
          const aMatch = a.order.match(/(\d+)([A-Z])/)
          const bMatch = b.order.match(/(\d+)([A-Z])/)

          if (aMatch && bMatch) {
            const aNum = Number.parseInt(aMatch[1])
            const bNum = Number.parseInt(bMatch[1])
            if (aNum !== bNum) return aNum - bNum
            return aMatch[2].localeCompare(bMatch[2])
          }
          return a.order.localeCompare(b.order)
        })
      })
    })

    console.log("Grouped Phase 2 data:", JSON.stringify(groupedData, null, 2))

    return groupedData
  } catch (error) {
    console.error("Error fetching Phase 2 data:", error)
    return null
  }
}

// Execute the function
fetchPhase2Data()
