/**
 * Fetches temperature & humidity data from the server.
 */

export async function fetchData() {
  const url = "/api/data"
  const res = await fetch(url)
  const result = await res.json()

  if (!result.ok) {
    throw new Error(`Error fetching data from server: ${result.statusCode}`)
  }

  return result
}