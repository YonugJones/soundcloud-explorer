import {
  createContext,
  useRef,
  useState,
  useEffect,
  type ReactNode,
} from 'react'

interface Track {
  id: number
  title: string
  permalink_url: string
  artwork_url?: string | null
  user?: { username: string }
}

interface PlayerContextType {
  currentTrack: Track | null
  isPlaying: boolean
  progress: number
  duration: number
  playTrack: (track: Track) => void
  togglePlay: () => void
  seek: (time: number) => void
}

declare global {
  interface Window {
    SC: any
  }
}

export const PlayerContext = createContext<PlayerContextType | undefined>(
  undefined
)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const widgetRef = useRef<any>(null)

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!iframeRef.current) return
    if (!window.SC || !window.SC.Widget) {
      console.warn('SoundCloud widget API not found on window.SC')
      return
    }

    const widget = window.SC.Widget(iframeRef.current)
    widgetRef.current = widget

    widget.bind(window.SC.Widget.Events.READY, () => {
      console.log('✅ SC widget READY')
      setReady(true)
    })

    widget.bind(window.SC.Widget.Events.PLAY, () => {
      setIsPlaying(true)

      // 🎯 Always works: duration is available on PLAY
      widget.getDuration((ms: number) => {
        if (ms && ms > 0) {
          setDuration(ms / 1000)
          console.log('🎵 Duration fixed via PLAY:', ms / 1000)
        }
      })
    })

    widget.bind(window.SC.Widget.Events.PAUSE, () => {
      setIsPlaying(false)
    })

    widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, (e: any) => {
      if (typeof e?.currentPosition === 'number') {
        setProgress(e.currentPosition / 1000)
      }
    })
  }, [])

  function playTrack(track: Track) {
    if (!widgetRef.current || !ready) {
      console.warn('Widget not ready yet')
      return
    }

    console.log('▶️ Loading track:', track.permalink_url)
    setCurrentTrack(track)

    widgetRef.current.load(track.permalink_url, {
      auto_play: true,
      buying: false,
      liking: false,
      download: false,
      sharing: false,
      show_comments: false,
      hide_related: true,
      visual: false,
    })
  }

  function togglePlay() {
    if (!widgetRef.current) return
    if (isPlaying) {
      widgetRef.current.pause()
    } else {
      widgetRef.current.play()
    }
  }

  function seek(time: number) {
    if (!widgetRef.current) return
    widgetRef.current.seekTo(time * 1000)
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
      <iframe
        ref={iframeRef}
        title='soundcloud-widget'
        src='https://w.soundcloud.com/player/?url='
        style={{
          position: 'fixed',
          left: -9999,
          top: -9999,
          width: '300px',
          height: '80px',
          opacity: 0,
          pointerEvents: 'none',
        }}
        allow='autoplay; encrypted-media'
      />
      {children}
    </PlayerContext.Provider>
  )
}
