export async function fetchTracks(query: string) {
  const res = await fetch(
    `http://localhost:5000/api/search?q=${encodeURIComponent(query)}`,
    {
      credentials: 'include', // ensure session cookie is sent
    }
  )
  if (!res.ok) throw new Error(`Server error ${res.status}`)
  const data = await res.json()
  return data.collection || data
}
