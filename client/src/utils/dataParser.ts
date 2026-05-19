/**
 * Defines utility functions for validating and parsing data.
 */

import { ChartData } from "./types"

export function isValid(entry: any) {
  return (
    entry &&
    typeof entry.time === "string" &&
    typeof entry.temperature === "number" &&
    typeof entry.humidity === "number" &&
    !isNaN(Date.parse(entry.time))
  )
}

export function formatTicks(index: number, chartData: ChartData) {
  const value = new Date(chartData.labels[index])
  if (isNaN(value.getTime())) {
    console.error("Failed to parse date: ", chartData.labels[index])
    return ""
  }

  return value.toLocaleDateString("en-US", { 
    year: "2-digit", 
    month: "numeric", 
    day: "numeric", 
    hour: "numeric", 
    minute: "numeric",
    second: "numeric"
  })
}