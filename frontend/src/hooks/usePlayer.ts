import { useContext } from 'react'
import { PlayerContext } from '../context/PlayerContext'

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) {
    throw new Error('usePlayer must be inside PlayerProvider')
  }
  return ctx
}
