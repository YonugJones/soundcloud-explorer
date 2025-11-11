import { useEffect, useState } from 'react'

interface Track {
  id: number
  title: string
  artwork_url: string | null
  permalink_url: string
}

export default function ProfileDashboard() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTracks() {
      try {
        const res = await fetch('http://localhost:5555/api/me/tracks', {
          credentials: 'include',
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setTracks(data)
      } catch (err: any) {
        setError('Failed to load tracks')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadTracks()
  }, [])

  if (loading) return <p className='text-gray-400'>Loading tracks...</p>
  if (error) return <p className='text-red-600'>{error}</p>

  return (
    <section className='max-w-6xl mx-auto my-10 px-4'>
      <h2 className='text-2xl font-bold mb-4 text-white'>Your Tracks</h2>
      {tracks.length === 0 && <p className='text-gray-400'>No tracks found.</p>}

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
        {tracks.map((track) => (
          <a
            key={track.id}
            href={track.permalink_url}
            target='_blank'
            rel='noreferrer'
            className='bg-zinc-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition'
          >
            {track.artwork_url ? (
              <img
                src={track.artwork_url.replace('-large', '-t300x300')}
                alt={track.title}
                className='w-full h-40 object-cover'
              />
            ) : (
              <div className='w-full h-40 bg-zinc-700 flex items-center justify-center text-gray-400'>
                No Art
              </div>
            )}
            <div className='p-3'>
              <p className='font-semibold text-sm text-white truncate'>
                {track.title}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
