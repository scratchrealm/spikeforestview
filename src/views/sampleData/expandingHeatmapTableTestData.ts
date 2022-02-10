import * as d3 from "d3"
import mockStudies from "./mockStudies"

const sorters = [
  "HerdingSpikes2",
  "IronClust",
  "JRClust",
  "Kilosort",
  "Kilosort2",
  "Klusta",
  "MountainSort4",
  "SpykingCircus",
  "Tridesclous",
  "Waveclus"
]

const computeBackgroundColor = (
  val: number | undefined,
  format: "count" | "average" | "cpu"
) => {
  if (val === undefined) return "white"
  let square = Math.pow(val, 2)
  if (format === "count") return d3.interpolateGreens(square)
  else if (format === "average") return d3.interpolateBlues(square)
  else if (format === "cpu") return d3.interpolateYlOrRd(square)
  else return "white"
}

const computeForegroundColor = (val: number | undefined) => {
  if (val === undefined) return "black"
  return val < 0.7 ? "black" : "white"
}