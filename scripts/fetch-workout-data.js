// Fetch the CSV data and parse it
async function fetchWorkoutData() {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20spreadsheet%20-%20Untitled%20document-OLJhFJhKgc4AKDtpzQicD0B2Ikzo82.csv",
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

    console.log("Total rows:", data.length)
    console.log("Sample rows:", data.slice(0, 10))

    // Find Banded Ankle Dorsal Flexion specifically
    const bandedAnkleRows = data.filter((row) => row.Exercise && row.Exercise.toLowerCase().includes("banded ankle"))

    console.log("Banded Ankle Dorsal Flexion rows:", bandedAnkleRows)

    // Find all Phase 1 exercises for reference
    const phase1Exercises = data.filter((row) => row.Phase === "1")
    console.log("Phase 1 exercises count:", phase1Exercises.length)

    // Show Phase 1, Week 1, Day 1 exercises specifically
    const phase1Week1Day1 = data.filter(
      (row) => row.Phase === "1" && row.Week === "1" && row.Day === "1" && row.Section === "Exercise",
    )
    console.log("Phase 1, Week 1, Day 1 exercises:", phase1Week1Day1)

    return data
  } catch (error) {
    console.error("Error fetching workout data:", error)
    return null
  }
}

// Execute the function
fetchWorkoutData()
