import { useState } from 'react'
import { fetchTracks } from './utils/soundcloudApi'
import Header from './components/Header'
import UserInfo from './components/UserInfo'

function App() {
  const [tracks, setTracks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSearch() {
    setLoading(true)
    try {
      const data = await fetchTracks('jazz')
      setTracks(data.collection)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <UserInfo />
      <div>
        <h1>SoundCloud Explorer</h1>
        <button onClick={handleSearch}>Search Jazz</button>

        {loading && <p>Loading..</p>}
        <ul>
          {tracks.map((track) => (
            <li key={track.title}>{track.title}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
