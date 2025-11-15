import { useEffect, useState } from 'react'
import { usePlayer } from '../context/PlayerContext'

interface Track {
  id: number
  title: string
  artwork_url: string | null
  permalink_url: string
  user?: { username: string }
}

type Tab = 'tracks' | 'playlists' | 'feed'

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('tracks')
  const [items, setItems] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const player = usePlayer()

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)
      try {
        const endpoint =
          activeTab === 'feed'
            ? 'http://localhost:5555/api/me/feed'
            : `http://localhost:5555/api/me/${activeTab}`

        console.log('Fetching:', endpoint)

        const res = await fetch(endpoint, { credentials: 'include' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        const normalized =
          data.collection?.map((item: any) => item.track || item) ?? data
        setItems(normalized)
      } catch (err: any) {
        console.error(err)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [activeTab])

  return (
    <section className='max-w-6xl mx-auto my-10 px-4 text-white'>
      {/* Tabs */}
      <div className='flex gap-6 border-b border-zinc-700 mb-6'>
        {(['tracks', 'playlists', 'feed'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-lg capitalize ${
              activeTab === tab
                ? 'border-b-2 border-orange-500 font-semibold text-orange-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && <p className='text-gray-400'>Loading...</p>}
      {error && <p className='text-red-500'>{error}</p>}

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
        {items.map((t) => (
          <div
            key={t.id}
            onClick={() => player.playTrack(t)}
            className='cursor-pointer bg-zinc-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition transform hover:-translate-y-1'
          >
            {t.artwork_url ? (
              <img
                src={t.artwork_url.replace('-large', '-t300x300')}
                alt={t.title}
                className='w-full h-40 object-cover'
              />
            ) : (
              <div className='w-full h-40 bg-zinc-700 flex items-center justify-center text-gray-400'>
                No Art
              </div>
            )}

            <div className='p-3'>
              <p className='font-semibold text-sm truncate'>{t.title}</p>
              {t.user && (
                <p className='text-xs text-gray-400 truncate'>
                  {t.user.username}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {!loading && items.length === 0 && (
        <p className='text-gray-500 text-center mt-8'>Nothing to show here</p>
      )}
    </section>
  )
}
