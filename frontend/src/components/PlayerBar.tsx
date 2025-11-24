import { usePlayer } from '../hooks/usePlayer'
import { useWaveform } from '../hooks/useWaveform'

export default function PlayerBar() {
  const { currentTrack, progress, duration, togglePlay, isPlaying, seek } =
    usePlayer()

  const waveform = useWaveform(currentTrack?.waveform_url, duration)

  if (!currentTrack) return null

  // Progress in %
  let percent = (progress / duration) * 100
  percent = Math.max(0, Math.min(percent, 100))

  // Fixed container height for predictable pixel math
  const BAR_CONTAINER_PX = 40 // matches h-10

  return (
    <div className='fixed bottom-0 left-0 w-full bg-zinc-900 text-white p-4 border-t border-zinc-700'>
      <div className='flex items-center gap-4'>
        {/* Artwork */}
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

        {/* Track info */}
        <div className='flex flex-col max-w-[150px] shrink-0'>
          <span className='font-semibold text-sm whitespace-normal wrap-break-word'>
            {currentTrack.title}
          </span>
          <span className='text-xs text-gray-400 whitespace-normal wrap-break-word'>
            {currentTrack.user?.username}
          </span>
        </div>

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className='bg-orange-500 px-3 py-1 rounded text-sm w-[70px] text-center shrink-0'
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        {/* Waveform */}
        <div className='mx-4 relative grow' style={{ width: '70%' }}>
          <div className='w-full h-10 bg-zinc-800 rounded overflow-hidden relative'>
            {/* Bars */}
            {waveform?.samples && (
              <div className='absolute inset-0 flex items-center z-0 overflow-hidden w-full'>
                {waveform.samples.map((value, i) => {
                  const normalized = value / waveform.maxSample

                  // Full peak height in px
                  const totalPx = normalized * BAR_CONTAINER_PX

                  // Pixel-aligned halves
                  const halfPx = Math.round(totalPx / 2)

                  return (
                    <div
                      key={i}
                      className='flex flex-col items-center justify-center'
                      style={{ flex: '0 0 2px' }}
                    >
                      {/* Top half */}
                      <div
                        className='bg-white'
                        style={{
                          height: `${halfPx}px`,
                          width: '100%',
                          opacity: 0.25,
                        }}
                      />
                      {/* Bottom half */}
                      <div
                        className='bg-white'
                        style={{
                          height: `${halfPx}px`,
                          width: '100%',
                          opacity: 0.25,
                        }}
                      />
                    </div>
                  )
                })}
              </div>
            )}

            {/* Progress overlay */}
            <div
              className='absolute left-0 top-0 h-full bg-orange-500 opacity-40 z-10 pointer-events-none'
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Click to seek */}
          <input
            type='range'
            min={0}
            max={duration}
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            className='absolute inset-0 w-full opacity-0 cursor-pointer z-20'
          />
        </div>

        {/* Time label */}
        <span className='text-xs text-gray-400'>
          {Math.floor(progress)} / {Math.floor(duration)}s
        </span>
      </div>
    </div>
  )
}
