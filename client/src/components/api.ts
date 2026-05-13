/**
 * Fetches temperature & humidity data from the server.
 */

export async function fetchData(): Promise<[]> {
  const url = "/api/data"
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Error fetching data from server: ${res.statusText}`)
  }
  const result = await res.json()

  return result.message
}