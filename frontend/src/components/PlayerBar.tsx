import { usePlayer } from '../hooks/usePlayer'

export default function PlayerBar() {
  const { currentTrack, isPlaying, progress, duration, togglePlay, seek } =
    usePlayer()

  if (!currentTrack) return null

  return (
    <div className='fixed bottom-0 left-0 w-full bg-zinc-900 text-white p-4 border-t border-zinc-700 flex items-center gap-4'>
      {currentTrack.artwork_url ? (
        <img
          src={currentTrack.artwork_url.replace('-large', '-t120x120')}
          className='w-12 h-12 rounded'
        />
      ) : (
        <div className='w-12 h-12 bg-zinc-700 rounded flex items-center justify-center'>
          🎵
        </div>
      )}

      <div className='flex flex-col w-60'>
        <span className='text-sm font-semibold truncate'>
          {currentTrack.title}
        </span>
        <span className='text-xs text-gray-400 truncate'>
          {currentTrack.user?.username}
        </span>
      </div>

      <button
        onClick={togglePlay}
        className='bg-orange-500 px-3 py-1 rounded text-sm'
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      <div className='flex-1 mx-4'>
        <input
          type='range'
          min={0}
          max={duration || 0}
          value={progress}
          onChange={(e) => seek(Number(e.target.value))}
          className='w-full'
        />
      </div>

      <span className='text-xs text-gray-400'>
        {Math.floor(progress)} / {Math.floor(duration)}s
      </span>
    </div>
  )
}
