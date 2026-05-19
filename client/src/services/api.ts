/**
 * Fetches temperature & humidity data from the server.
 */

import { ClimateData } from "../utils/types"

export async function fetchSensorData(limit: number): Promise<ClimateData[]> {
  const url = `/api/data/?limit=${limit}`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Error fetching data from server: ${res.statusText}`)
  }
  const result = await res.json()
  
  return result.message
}