import { createContext, useContext, useRef, useState } from 'react'

interface Track {
  id: number
  title: string
  artwork_url?: string | null
  stream_url?: string
  user?: { username: string }
}

interface PlayerContextType {
  currentTrack: Track | null
  isPlaying: boolean
  progress: number // seconds
  duration: number // seconds
  playTrack: (track: Track) => void
  togglePlay: () => void
  seek: (time: number) => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef(new Audio())
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  function playTrack(track: Track) {
    if (!track.stream_url) return

    const audio = audioRef.current
    audio.src = track.stream_url

    audio.onloadedmetadata = () => {
      setDuration(audio.duration)
    }

    audio.ontimeupdate = () => {
      setProgress(audio.currentTime)
    }

    audio.play()
    setCurrentTrack(track)
    setIsPlaying(true)
  }

  function togglePlay() {
    if (!currentTrack) return
    const audio = audioRef.current

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  function seek(time: number) {
    const audio = audioRef.current
    audio.currentTime = time
  }

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        playTrack,
        togglePlay,
        seek,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used inside of PlayerProvider')
  return ctx
}
